import Router from 'koa-router';
import { isLoggedIn, canParticipate } from '../middlewares';
import { Vote } from '../models/Vote';
import { Nomination } from '../models/Nomination';
import { User } from '../models/User';
import { Category } from '../models/Category';

const votingRouter = new Router();

votingRouter.get('/voting/:modeId', isLoggedIn, async (ctx) => {
    const [votes, categories, beatmapsetsNominations, mappersNominations, user] = await Promise.all([
        Vote.scope({ method: ['allByModeAndUser', ctx.params.modeId, ctx.session.id] }).findAll(),
        Category.scope({ method: ['allByMode', ctx.params.modeId] }).findAll(),
        Nomination.scope(['defaultScope', { method: ['allBeatmapsNominationsByMode', ctx.params.modeId] }]).findAll(),
        Nomination.scope(['defaultScope', { method: ['allMappersNominationsByMode', ctx.params.modeId] }]).findAll(),
        User.findByPk(ctx.session.id)
    ]);

    ctx.body = {
        votes,
        categories,
        beatmapsetsNominations: beatmapsetsNominations,
        mappersNominations: mappersNominations,
        canParticipate: user && user.canParticipateFor(ctx.params.modeId),
    }
});

votingRouter.post('/voting/vote', isLoggedIn, canParticipate, async (ctx) => {
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

    if (!nominee) {
        return ctx.body = {
            error: 'cannot find nominee',
        };
    }

    let canVote = true;
    if (votes && nominee) {
        const votesCount = votes.filter(v => v.points == points && v.nomination.subCategoryId == nominee.subCategoryId);

        switch (points) {
            case 7:
            case 6:
            case 5:
                canVote = votesCount.length < 1;
                break;
            case 4:
            case 3:
                canVote = votesCount.length < 2;
                break;
            case 2:
            case 1:
                canVote = votesCount.length < 3;
                break;
            default:
                return false;
        }
    }

    if (canVote) {
        let newVote = await Vote.create({
            userId: ctx.session.id,
            nominationId: nominee.id,
            points: points,
        });

        newVote = await Vote.findByPk(newVote.id);

        if (newVote) {
            return ctx.body = {
                vote: newVote,
            }
        }
    }

    ctx.body = {
        error: 'error',
    };
});

votingRouter.post('/voting/unvote', isLoggedIn, canParticipate, async (ctx) => {
    const rowsDeleted = await Vote.destroy({
        where: {
            userId: ctx.session.id,
            nominationId: ctx.request.body.nomineeId,
            points: ctx.request.body.points,
        }
    });

    if (rowsDeleted && rowsDeleted > 0) {
        ctx.body = {
            success: 'ok'
        };
    } else {
        ctx.body = {
            error: 'error'
        };
    }
});

export default votingRouter;
