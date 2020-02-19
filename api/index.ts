import "reflect-metadata";
import { App } from "../../CorsaceServer"
import Mount from 'koa-mount';
import UserRouter from "./routes/user"

const app = new App("mca")

app.koa.use(Mount("/user", UserRouter.routes()));

export default {
    path: "/api",
    handler: app.koa.callback(),
}
