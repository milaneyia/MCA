import * as Koa from 'koa';
import * as Session from 'koa-session';
import * as Router from 'koa-router';
import * as BodyParser from 'koa-bodyparser';
import OsuApi from './osuApi';
import * as Crypto from 'crypto';
import { Sequelize } from 'sequelize-typescript';
import { Config } from '../Config';
import { User } from '../models/user';
import { Beatmapset } from '../models/beatmapset';
import { Vote } from '../models/vote';

const app = new Koa();
const appRouter = new Router();
const config = new Config;
const osuApi = new OsuApi;
const server = new Sequelize(config.database.name, config.database.username, config.database.password, {
    host: 'localhost',
    dialect: 'mariadb',
});

server.addModels([User, Beatmapset, Vote]);
server.sync();

app.keys = ['secret'];
app.use(Session(app));
app.use(BodyParser());
app.use(appRouter.routes());
app.use(appRouter.allowedMethods());

appRouter.get('/beatmapsets', async (ctx) => {
    ctx.body = {
        beatmapsets: await Beatmapset.findAll({ limit: 10 })
    };
});

appRouter.post('/vote', async (ctx) => {
    const newVote = await Vote.create({
        userId: ctx.session.id,
        beatmapsetId: ctx.request.body.beatmapsetId,
        vote: ctx.request.body.vote
    });

    if (!newVote) {
        ctx.body = {
            error: 'error'
        }
    } else {
        ctx.body = {
            success: 'ok'
        }
    }
});

appRouter.get('/login', async (ctx, next) => {
    if (ctx.session.accessToken) {
        ctx.redirect('back');
    }

    let state = ctx.cookies.get('_state');
    
    if (!ctx.cookies.get('_state')) {
        try {
            const buffer = await Crypto.randomBytes(48);
            state = buffer.toString('hex');
            ctx.cookies.set('_state', state);
        } catch (error) {
            console.log(error);
        }
    }

    const hashedState = Buffer.from(state).toString('base64');
    ctx.redirect(
        `https://osu.ppy.sh/oauth/authorize?response_type=code&client_id=${
            config.osuApi.id
        }&redirect_uri=${encodeURIComponent(config.osuApi.redirect)}&scope=identify&state=${hashedState}`
    );
});

appRouter.get('/callback', async (ctx, next) => {
    if (!ctx.query.code || ctx.query.error) {
        return ctx.redirect('/');
    }

    const decodedState = Buffer.from(ctx.query.state, 'base64').toString('ascii');
    if (decodedState !== ctx.cookies.get('_state')) {
        ctx.cookies.set('_state', undefined);
        return ctx.redirect('/error');
    }

    ctx.cookies.set('_state', undefined);
    
    let response = await osuApi.getToken(ctx.query.code);
    
    if (response.error) {
        ctx.redirect('/error');
    } else {
        ctx.session.accessToken = response.access_token;
        ctx.session.refreshToken = response.refresh_token;

        response = await osuApi.getUserInfo(response.access_token);
        if (response.error) {
            ctx.redirect('/error');
        }

        ctx.session.username = response.username;
        ctx.session.id = response.id;
        
        if (!(await User.findByPk(response.id))) {
            const newUser = await User.create({
                id: response.id,
                username: response.username
            });

            if (newUser) {
                return ctx.redirect('/');
            } else {
                return ctx.redirect('/error');
            }
        } else {
            return ctx.redirect('/');
        }
    }
});

server.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});

export default {
    path: "/api",
    handler: app.callback(),
}
