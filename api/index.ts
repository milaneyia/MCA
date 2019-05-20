import * as Koa from 'koa';
import * as Router from 'koa-router';

const App = new Koa();
const AppRouter = new Router();

AppRouter.get("/test", (ctx) => {
    ctx.body = {
        status: 'success',
        message: 'hello'
    }
});

App.use(AppRouter.routes());

export default {
    path: "/api",
    handler: App.callback(),
}
