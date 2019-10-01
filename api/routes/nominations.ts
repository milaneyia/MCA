
import Router from 'koa-router';
import { isLoggedIn, isStaff, canParticipate } from '../middlewares';
import { Nomination } from '../models/Nomination';
import { SubCategory } from '../models/SubCategory';
import { Categories, Category } from '../models/Category';
import { User } from '../models/User';
import { Beatmapset } from '../models/Beatmapset';
import { Op } from 'sequelize';
import * as osuApi from '../osuApi';
import { Permission } from '../models/Permission';

const nominationsRouter = new Router();

nominationsRouter.get('/nominations/:modeId', isLoggedIn, async (ctx) => {
    const [nominations, categories, user] = await Promise.all([
        Nomination.scope(['defaultScope', { method: ['allByModeAndNominator', ctx.params.modeId, ctx.session.id] }]).findAll(),
        Category.scope({ method: ['allByMode', ctx.params.modeId] }).findAll(),
        User.findByPk(ctx.session.id)
    ]);

    ctx.body = {
        nominations,
        categories,
        canParticipate: user && user.canParticipateFor(ctx.params.modeId),
    }
});


nominationsRouter.get('/nominations/:modeId/beatmapsets/:keywords', isLoggedIn, canParticipate, async (ctx) => {
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

nominationsRouter.get('/nominations/:modeId/users/:user', isLoggedIn, canParticipate, async (ctx) => {
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
                        fields: ['userId', 'modeId', 'canParticipate'],
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

nominationsRouter.post('/nominations/nominate', isLoggedIn, canParticipate, async (ctx) => {
    const subCategory = await SubCategory.findByPk(ctx.request.body.subCategoryId);
    if (!subCategory) return ctx.body = { error: 'category not found' };

    let nomination = {
        nominatorId: ctx.session.id,
        subCategoryId: subCategory.id,
        beatmapsetId: null,
        userId: null,
    };

    let beatmapset: Beatmapset;
    let user: User;

    if (subCategory.category.name == Categories.Beatmaps || subCategory.category.name == Categories.Genre) {
        nomination.beatmapsetId = ctx.request.body.nomineeId;
        beatmapset = await Beatmapset.findByPk(nomination.beatmapsetId);
    } else if (subCategory.category.name == Categories.Mappers) {
        nomination.userId = ctx.request.body.nomineeId;
        user = await User.findByPk(nomination.userId);
    }

    const nominationCount = await Nomination.count({ where: { subCategoryId: nomination.subCategoryId } });
    if (nominationCount >= subCategory.allowedNominations) {
        return ctx.body = { error: 'max nominations' };
    }
    
    if ((subCategory.name == 'Marathon' || subCategory.name == 'Spread')
        && ((beatmapset.isMarathon && subCategory.name == 'Spread')
        || (beatmapset.isSpread && subCategory.name == 'Marathon'))) {
        
        return ctx.body = { error: 'wrong category' };
    }

    if (subCategory.category.name == Categories.Genre && beatmapset.genre != subCategory.name) {
        return ctx.body = { error: 'wrong genre category' };
    }

    if (user && !user.canParticipateFor(subCategory.category.modeId)) {
        return ctx.body = { error: 'user cannot be nominated' };
    }

    let result = await Nomination.findOrCreate({
        where: nomination,
    });

    if (!result[1]) {
        return ctx.body = { error: 'already nominated' };
    }
    
    let newNomination = result[0];
    newNomination = await Nomination.findByPk(newNomination.id);

    if (newNomination) {
        return ctx.body = {
            nomination: newNomination
        }
    } else {
        return ctx.body = {
            error: 'error'
        }
    }
});

nominationsRouter.post('/nominations/cancelNomination', isLoggedIn, canParticipate, async (ctx) => {
    const subCategory = await SubCategory.findByPk(ctx.request.body.subCategoryId);
    if (!subCategory) return ctx.body = { error: 'error' };

    let conditions = {
        nominatorId: ctx.session.id,
        subCategoryId: subCategory.id,
        beatmapsetId: null,
        userId: null,
    };

    if (subCategory.category.name == Categories.Beatmaps) {
        conditions.beatmapsetId = ctx.request.body.nomineeId;
    } else if (subCategory.category.name == Categories.Mappers) {
        conditions.userId = ctx.request.body.nomineeId;
    }
    
    const rowsDeleted = await Nomination.destroy({
        where: conditions,
    });

    if (rowsDeleted && rowsDeleted > 0) {
        ctx.body = {
            success: 'ok'
        }
    } else {
        ctx.body = {
            error: 'error'
        }
    }
});

export default nominationsRouter;