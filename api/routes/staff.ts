import Router from 'koa-router';
import { isLoggedIn, isStaff } from '../middlewares';
import { Permission } from '../models/Permission';

const staffRouter = new Router();

staffRouter.use(isLoggedIn);
staffRouter.use(isStaff);

staffRouter.get('/staff', async (ctx) => {
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

staffRouter.post('/staff/grantAccess', async (ctx) => {
    const rowsUpdated = await Permission.update({
        requestsAccess: false,
        canParticipate: true,
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

staffRouter.post('/staff/denyAccess', async (ctx) => {
    const rowsUpdated = await Permission.update({
        requestsAccess: false,
        canParticipate: false,
    }, {
        where: {
            userId: ctx.request.body.userId,
            modeId: ctx.request.body.modeId,
        }
    });

    let response: string;
    if (!rowsUpdated) {
        response = 'error';
    } else {
        response = 'denied';
    }

    ctx.body = {
        response,
    };
});

export default staffRouter;
