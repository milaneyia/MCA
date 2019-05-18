import * as Koa from 'koa';
import * as Router from 'koa-router';

const App = new Koa();
const AppRouter = new Router();

AppRouter.get("/api/test", (ctx) => {
    ctx.body = {
        status: 'success',
        message: 'hello'
    }
    console.log('Good job.')
})

App.use(AppRouter.routes());

export default {
    path: "/",
    handler: App,
}