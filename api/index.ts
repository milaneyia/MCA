import Koa from 'koa';
import Session from 'koa-session';
import BodyParser from 'koa-bodyparser';
import { Sequelize } from 'sequelize-typescript';
import { Config } from '../Config';
import { User } from './models/user';
import { Beatmapset } from './models/beatmapset';
import { Vote } from './models/vote';
import { Nomination } from './models/nomination';
import { Category } from './models/category';
import { Mode } from './models/mode';
import { Permission } from './models/permission';
import Routes from './routes';
import seed from './seed';

const app = new Koa();
const config = new Config;
const server = new Sequelize(config.database.name, config.database.username, config.database.password, {
    host: 'localhost',
    dialect: 'mariadb',
});

server.addModels([__dirname + '/models']);
server.sync().then(seed).catch((error) => console.log(error));

app.keys = config.keys;
app.use(Session(app));
app.use(BodyParser());
app.use(Routes.routes());
app.use(Routes.allowedMethods());

server.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});

export default {
    path: "/api",
    handler: app.callback(),
}
