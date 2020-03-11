import "reflect-metadata";
import { App } from "../../CorsaceServer";
import Mount from "koa-mount";
import UserRouter from "./routes/user";
import usersRouter from "./routes/users";
import categoriesRouter from "./routes/staff/categories";
import beatmapsetsRouter from "./routes/beatmapsets";
import nominationsRouter from "./routes/nominations";
import votingRouter from "./routes/voting";
import adminRouter from "./routes/admin";

const app = new App("mca");

app.koa.use(Mount("/user", UserRouter.routes()));
app.koa.use(Mount("/users", usersRouter.routes()));
app.koa.use(Mount("/beatmapsets", beatmapsetsRouter.routes()));
app.koa.use(Mount("/nominations", nominationsRouter.routes()));
app.koa.use(Mount("/voting", votingRouter.routes()));
app.koa.use(Mount("/staff/categories", categoriesRouter.routes()));
app.koa.use(Mount("/admin", adminRouter.routes()));

export default {
    path: "/api",
    handler: app.koa.callback(),
};
