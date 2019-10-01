import Koa from 'koa';
import Session from 'koa-session';
import BodyParser from 'koa-bodyparser';
import { Sequelize } from 'sequelize-typescript';
import { Config } from '../Config';
import logInRouter from './routes/logIn';
import nominationsRouter from './routes/nominations';
import votingRouter from './routes/voting';
import usersRouter from './routes/users';
import staffRouter from './routes/staff';

const app = new Koa();
const config = new Config;
const server = new Sequelize(config.database.name, config.database.username, config.database.password, {
    host: 'localhost',
    dialect: 'mariadb',
    dialectOptions: {
        timezone: "Etc/GMT-0"
    },
    models: [__dirname + '/models'],
});

app.keys = config.keys;
app.use(Session(app));
app.use(BodyParser());
app.use(logInRouter.routes());
app.use(nominationsRouter.routes());
app.use(votingRouter.routes());
app.use(usersRouter.routes());
app.use(staffRouter.routes());

server.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});

export default {
    path: '/api',
    handler: app.callback(),
}
