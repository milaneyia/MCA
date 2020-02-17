import "reflect-metadata";
import { App } from "../../CorsaceServer"
import Mount from 'koa-mount';
import userRouter from "./routes/user"

const app = new App("mca")

app.koa.use(Mount("/user", userRouter.routes()));

export default {
    path: "/api",
    handler: app.koa.callback(),
}
