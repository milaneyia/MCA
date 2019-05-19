import * as Koa from 'koa';
import * as Router from 'koa-router';
import Nuxt from 'nuxt';
import * as Config from '../nuxt.config';

const App = new Koa();
const AppRouter = new Router();
const nuxt = new Nuxt(Config);

AppRouter.get("/test", (ctx) => {
    ctx.body = {
        status: 'success',
        message: 'hello'
    }
    console.log('Good job.')
});

App.use(async ctx => {
    ctx.status = 200
    ctx.respond = false // Mark request as handled for Koa
    nuxt.render(ctx.req, ctx.res)
});
App.use(AppRouter.routes());

export default {
    path: "/api",
    handler: App,
}