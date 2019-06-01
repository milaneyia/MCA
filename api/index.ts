import * as Koa from 'koa';
import * as Session from 'koa-session';
import * as Router from 'koa-router';
import * as BodyParser from 'koa-bodyparser';
import OsuApi from './osuApi';
import * as Crypto from 'crypto';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { Config } from '../Config';
import { User } from '../models/user';
import { Beatmapset } from '../models/beatmapset';
import { Vote } from '../models/vote';
import { Nomination } from '../models/nomination';
import { Category } from '../models/category';
import { Mode } from '../models/mode';
import { Permission } from '../models/permission';

const app = new Koa();
const appRouter = new Router();
const config = new Config;
const osuApi = new OsuApi;
const server = new Sequelize(config.database.name, config.database.username, config.database.password, {
    host: 'localhost',
    dialect: 'mariadb',
});

server.addModels([User, Beatmapset, Vote, Nomination, Category, Mode, Permission]);
server.sync().then(async () => {
    const [modes, categories] = await Promise.all([
        Mode.findAll(),
        Category.findAll(),
    ]);

    if (!modes || !modes.length) {
        await Mode.bulkCreate([
            { name: 'Standard' },
            { name: 'Taiko' },
            { name: 'Fruits' },
            { name: 'Mania' },
            { name: 'Storyboard' },
        ]);
    }

    if (!categories || !categories.length) {
        await Category.bulkCreate([
            { name: 'Grand MCA Award', allowedNominations: 1, isMaps: 1, modeId: 1 },
            { name: 'Marathon', allowedNominations: 2, isMaps: 1, modeId: 1 },
            { name: 'Spread', allowedNominations: 2, isMaps: 1, modeId: 1 },
            { name: 'Hitsounding', allowedNominations: 2, isMaps: 1, modeId: 1 },
            { name: 'Unorthodox', allowedNominations: 2, isMaps: 1, modeId: 1 },
            { name: 'Doujin', allowedNominations: 2, isMaps: 1, modeId: 1, isGenre: 1 },
            { name: 'Anime', allowedNominations: 2, isMaps: 1, modeId: 1, isGenre: 1 },
            { name: 'Electro', allowedNominations: 2, isMaps: 1, modeId: 1, isGenre: 1 },
            { name: 'Western', allowedNominations: 2, isMaps: 1, modeId: 1, isGenre: 1 },
            { name: 'Grand MCA Award', allowedNominations: 1, isMappers: 1, modeId: 1 },
            { name: 'Mapper', allowedNominations: 2, isMappers: 1, modeId: 1 },
            { name: 'Modder', allowedNominations: 2, isMappers: 1, modeId: 1 },
            { name: 'Rookie', allowedNominations: 2, isMappers: 1, modeId: 1, isRookie: 1 },
            { name: 'Influential', allowedNominations: 2, isMappers: 1, modeId: 1 },

            { name: 'Grand MCA Award', allowedNominations: 1, isMaps: 1, modeId: 2 },
            { name: 'Grand MCA Award', allowedNominations: 1, isMappers: 1, modeId: 2 },
            { name: 'Grand MCA Award', allowedNominations: 1, isMaps: 1, modeId: 3 },
            { name: 'Grand MCA Award', allowedNominations: 1, isMappers: 1, modeId: 3 },
            { name: 'Grand MCA Award', allowedNominations: 1, isMaps: 1, modeId: 4 },
            { name: 'Grand MCA Award', allowedNominations: 1, isMappers: 1, modeId: 4 },
            { name: 'Grand MCA Award', allowedNominations: 1, isMaps: 1, modeId: 5 },
            { name: 'Grand MCA Award', allowedNominations: 1, isMappers: 1, modeId: 5 },
        ]);
    }
}).catch((err) => {
    console.log(err);
});

app.keys = ['secret'];
app.use(Session(app));
app.use(BodyParser());
app.use(appRouter.routes());
app.use(appRouter.allowedMethods());

async function isLoggedIn(ctx, next) {
    if (ctx.session.id) {
        ctx.state.user = await User.findByPk(ctx.session.id);
        if (ctx.state.user) return next();
    }
    ctx.redirect('/');
}

async function canVote(ctx, next) {
    if (ctx.state.user) {
        if (ctx.params.modeId) {
            if (ctx.state.user.permissions.find(p => p.modeId == ctx.params.modeId && p.canVote)) {
                return next();
            }
        } else if (ctx.request.body.modeId) {
            if (ctx.state.user.permissions.find(p => p.modeId == ctx.request.body.modeId && p.canVote)) {
                return next();
            }
        }
    }
    ctx.redirect('/');
}

async function isStaff(ctx, next) {
    if (ctx.state.user) {
        if (ctx.state.user.isStaff) return next();
    }
    ctx.redirect('/');
}

appRouter.get('/initialData/user', async (ctx) => {
    let user;

    if (ctx.session.id) {
        try {
            user = await User.findByPk(ctx.session.id);
        } catch (error) {
            console.log(error);
        }
    }

    ctx.body = {
        user: user,
    }
});

appRouter.get('/initialData/modes/:modeId', isLoggedIn, async (ctx) => {
    const [nominations, categories, beatmapsetsToVote, mappersToVote, votes, user] = await Promise.all([
        Nomination.findAll({
            include: [{
                model: Category,
                where: {
                    modeId: ctx.params.modeId,
                },
            }],
            where: {
                nominatorId: ctx.session.id,
            },
        }),
        Category.findAll({
            where: {
                modeId: ctx.params.modeId,
            }
        }),
        Nomination.findAll({
            include: [{
                model: Category,
                where: {
                    [Op.and]: {
                        modeId: ctx.params.modeId,
                        isMaps: true,
                    }
                },
            }]
        }),
        Nomination.findAll({
            include: [{
                model: Category,
                where: {
                    [Op.and]: {
                        modeId: ctx.params.modeId,
                        isMappers: true,
                    }
                },
            }]
        }),
        Vote.findAll({
            include: [{
                model: Nomination,
                include: [{
                    model: Category,
                }],
            }],
            where: {
                userId: ctx.session.id,
                '$nomination.category.modeId$': ctx.params.modeId,
            }
        }),
        User.findByPk(ctx.session.id)
    ]);

    ctx.body = {
        nominations: nominations,
        categories: categories,
        beatmapsetsToVote: beatmapsetsToVote,
        mappersToVote: mappersToVote,
        votes: votes,
        canVote: user.permissions.find(p => p.modeId == ctx.params.modeId),
    }
});

appRouter.get('/initialData/staff', isLoggedIn, isStaff, async (ctx) => {
    let requests;
    try {
        requests = await Permission.findAll({
            include: [{
                all: true,
            }],
            where: {
                requestsAccess: true,
            }
        });
    } catch (error) {
        console.log(error);
    }

    ctx.body = {
        requests: requests,
    }
});

appRouter.get('/beatmapsets/:modeId/:keywords', isLoggedIn, canVote, async (ctx) => {
    const keywords = ctx.params.keywords.replace(/ /g, '|');    

    ctx.body = {
        beatmapsets: await Beatmapset.findAll({ 
            where: {
                [Op.and]: {
                    [Op.or]: {
                        creator: { [Op.regexp]: keywords },
                        title: { [Op.regexp]: keywords },
                        artist: { [Op.regexp]: keywords },
                        tags: { [Op.regexp]: keywords },
                    },
                    modeId: ctx.params.modeId,
                },
            },
            limit: 20,
        }),
    };
});

appRouter.get('/users/:modeId/:user', isLoggedIn, canVote, async (ctx) => {
    let user = await User.findOne({
        where: {
            [Op.or]: {
                id: ctx.params.user,
                username: ctx.params.user,
            }
        },
    });

    if (!user) {
        let searchedUser = await osuApi.searchUser(ctx.params.user);
        
        if (searchedUser.length) {
            searchedUser = searchedUser[0];
            user = await User.create({
                id: searchedUser.user_id,
                username: searchedUser.username,
            });

            if (user) {
                await Permission.bulkCreate(
                    await osuApi.setPermissions(searchedUser.user_id),
                    {
                        fields: ['userId', 'modeId', 'canVote'],
                    }
                );
            }
        } else {
            ctx.body = {
                error: 'not found'
            }
        }
    }

    ctx.body = {
        user: user,
    }
});

appRouter.post('/users/requestAccess', isLoggedIn, async (ctx) => {
    if (!ctx.request.body.evidence.includes('osu.ppy.sh/')) {
        return ctx.body = {
            response: 'not an osu link',
        }
    }

    const permission = await Permission.findOne({
        where: {
            userId: ctx.session.id,
            modeId: ctx.request.body.modeId,
        }
    });

    let wasRequested;
    if (permission) {
        wasRequested = await Permission.update({
            requestsAccess: true,
            evidence: ctx.request.body.evidence,
        }, {
            where: {
                userId: ctx.session.id,
                modeId: ctx.request.body.modeId,
            }
        });
    } else {
        wasRequested = await Permission.create({
            userId: ctx.session.id,
            modeId: ctx.request.body.modeId,
            requestsAccess: true,
            evidence: ctx.request.body.evidence,
        });
    }

    let response;
    if (!wasRequested) {
        response = 'error';
    } else {
        response = 'wait now';
    }

    ctx.body = {
        response: response,
    }
});

appRouter.post('/users/grantAccess', isLoggedIn, isStaff, async (ctx) => {
    const rowsUpdated = await Permission.update({
        requestsAccess: false,
        canVote: true,
    }, {
        where: {
            userId: ctx.request.body.userId,
            modeId: ctx.request.body.modeId,
        }
    });

    let response;
    if (!rowsUpdated) {
        response = 'error';
    } else {
        response = 'accessed';
    }

    ctx.body = {
        response: response,
    }
});

appRouter.post('/users/denyAccess', isLoggedIn, isStaff, async (ctx) => {
    const rowsUpdated = await Permission.update({
        requestsAccess: false,
        canVote: false,
    }, {
        where: {
            userId: ctx.request.body.userId,
            modeId: ctx.request.body.modeId,
        }
    });

    let response;
    if (!rowsUpdated) {
        response = 'error';
    } else {
        response = 'denied';
    }

    ctx.body = {
        response: response,
    }
});

appRouter.post('/nominations/nominate', isLoggedIn, canVote, async (ctx) => {
    const category = await Category.findByPk(ctx.request.body.categoryId);
    if (!category) return ctx.body = { error: 'error' };

    let newNomination;
    if (category.isMaps) {
        newNomination = await Nomination.create({
            nominatorId: ctx.session.id,
            categoryId: category.id,
            beatmapsetId: ctx.request.body.nomineeId,
        });
    } else {
        newNomination = await Nomination.create({
            nominatorId: ctx.session.id,
            categoryId: category.id,
            userId: ctx.request.body.nomineeId,
        });
    }
    
    newNomination = await Nomination.findByPk(newNomination.id);

    if (!newNomination) {
        return ctx.body = {
            error: 'error'
        }
    } else {
        return ctx.body = {
            nomination: newNomination
        }
    }
});

appRouter.post('/nominations/cancelNomination', isLoggedIn, canVote, async (ctx) => {
    const category = await Category.findByPk(ctx.request.body.categoryId);
    if (!category) return ctx.body = { error: 'error' };

    let rowsDeleted;
    if (category.isMaps) {
        rowsDeleted = await Nomination.destroy({
            where: {
                nominatorId: ctx.session.id,
                beatmapsetId: ctx.request.body.nomineeId,
                categoryId: category.id
            },
        });
    } else {
        rowsDeleted = await Nomination.destroy({
            where: {
                nominatorId: ctx.session.id,
                userId: ctx.request.body.nomineeId,
                categoryId: category.id
            },
        });
    }

    if (!rowsDeleted || rowsDeleted == 0) {
        ctx.body = {
            error: 'error'
        }
    } else {
        ctx.body = {
            success: 'ok'
        }
    }
});

appRouter.post('/votes/vote', isLoggedIn, canVote, async (ctx) => {
    const points = ctx.request.body.points;
    const [votes, nominee] = await Promise.all([
        Vote.findAll({
            where: {
                userId: ctx.session.id,
            }
        }),
        Nomination.findOne({
            where: {
                id: ctx.request.body.nomineeId,
            }
        })
    ]);

    let canVote = true;
    if (votes && nominee) {
        const count = votes.filter(v => v.points == points && v.nomination.categoryId == nominee.categoryId);
        switch (points) {
            case 7:
            case 6:
            case 5:
                canVote = count.length < 1;
                break;
            case 4:
            case 3:
                canVote = count.length < 2;
                break;
            case 2:
            case 1:
                canVote = count.length < 3;
                break;
            default:
                return false;
        }
    }

    if (canVote) {
        let newVote;
        try {
            newVote = await Vote.create({
                userId: ctx.session.id,
                nominationId: nominee.id,
                points: points,
            });
            newVote = await Vote.findByPk(newVote.id);
        } catch (error) {
            console.log(error);
        }

        if (newVote) {
            return ctx.body = {
                vote: newVote,
            }
        }
    }

    ctx.body = {
        error: 'error',
    }
});

appRouter.post('/votes/unvote', isLoggedIn, canVote, async (ctx) => {
    let rowsDeleted;

    try {
        rowsDeleted = await Vote.destroy({
            where: {
                userId: ctx.session.id,
                nominationId: ctx.request.body.nomineeId,
                points: ctx.request.body.points,
            }
        });
    } catch (error) {
        console.log(error);
    }

    if (!rowsDeleted || rowsDeleted == 0) {
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
                username: response.username,
            });
            
            if (newUser) {
                await Permission.bulkCreate(
                    await osuApi.setPermissions(response.id), 
                    {
                        fields: ['userId', 'modeId', 'canVote'],
                    }
                );
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
