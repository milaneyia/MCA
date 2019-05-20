import * as Koa from 'koa';
import * as Router from 'koa-router';
import { Sequelize } from 'sequelize';
import { Config } from '../Config';

const App = new Koa();
const AppRouter = new Router();
const config = new Config;
console.log(config);
const server = new Sequelize(config.database.name, config.database.username, config.database.password, {
    host: 'localhost',
    dialect: 'mariadb',
});

AppRouter.get("/test", (ctx) => {
    ctx.body = {
        status: 'success',
        message: 'hello'
    }
    console.log("Good job.")
});

App.use(AppRouter.routes());

server.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});

export default {
    path: "/api",
    handler: App.callback(),
}
