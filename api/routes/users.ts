import Router from 'koa-router';
import { isLoggedIn } from '../middlewares';
import { Permission } from '../models/Permission';
import { User } from '../models/User';

const usersRouter = new Router();

usersRouter.get('/user', async (ctx) => {
    let user: User;

    if (ctx.session.id) {
        user = await User.findByPk(ctx.session.id);
    }

    ctx.body = { user };
});

usersRouter.post('/users/requestAccess', isLoggedIn, async (ctx) => {
    if (!ctx.request.body.evidence.includes('osu.ppy.sh/')) {
        return ctx.body = {
            error: 'not an osu link',
        };
    }

    if (!ctx.request.body.modeId) {
        return ctx.body = {
            error: 'select a mode',
        };
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

    if (wasRequested) {
        ctx.body = {
            success: 'wait now',
        };
    } else {
        ctx.body = {
            error: 'error',
        };
    }
});

export default usersRouter;
