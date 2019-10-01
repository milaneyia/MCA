import Router from 'koa-router';
import { User } from '../models/User';
import * as osuApi from '../osuApi';
import { Permission } from '../models/Permission';
import Crypto from 'crypto';

const logInRouter = new Router();

logInRouter.get('/login', async (ctx, next) => {
    if (ctx.session.accessToken) {
        ctx.redirect('back');
    }
    
    let state = ctx.cookies.get('_state');
    
    if (!ctx.cookies.get('_state')) {
        state = Crypto.randomBytes(48).toString('hex');
        ctx.cookies.set('_state', state);
    }

    ctx.redirect(osuApi.generateAuthorizeLink(state));
});

logInRouter.get('/callback', async (ctx) => {
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
                username: response.username,
            });
            
            if (newUser) {
                await Permission.bulkCreate(
                    await osuApi.setPermissions(response.id), 
                    {
                        fields: ['userId', 'modeId', 'canParticipate'],
                    }
                );
                return ctx.redirect('back');
            } else {
                return ctx.redirect('/error');
            }
        } else {
            return ctx.redirect('back');
        }
    }
});

export default logInRouter;