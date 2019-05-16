import "reflect-metadata";
import { Nuxt, Builder } from 'nuxt'
import { createKoaServer } from "routing-controllers";
import { Config } from "./Config";

async function start() {
    // Create the koa server
    const App = createKoaServer();

    // Instantiate nuxt.js
    const nuxt = new Nuxt()
    const builder = new Builder(nuxt)
    await builder.build()

    // Use nuxt routing
    App.use(ctx => {
        ctx.status = 200
        ctx.respond = false // Mark request as handled for Koa
        ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
        nuxt.render(ctx.req, ctx.res)
    })
    
    App.listen(Config.http.port, Config.http.host);``
}

start();