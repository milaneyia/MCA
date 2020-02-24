import "reflect-metadata";
import { App } from "../../CorsaceServer";
import Mount from "koa-mount";
import UserRouter from "./routes/user";
import categoriesRouter from "./routes/staff/categories";

const app = new App("mca");

app.koa.use(Mount("/user", UserRouter.routes()));
app.koa.use(Mount("/staff/categories", categoriesRouter.routes()));

export default {
    path: "/api",
    handler: app.koa.callback(),
};
