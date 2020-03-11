import Router from "koa-router";
import { hasRole, isLoggedInDiscord } from "../../../../CorsaceServer/middleware";
import { Category } from "../../../../CorsaceModels/MCA_AYIM/category";
import { ModeDivision } from "../../../../CorsaceModels/MCA_AYIM/modeDivision";
import { ParameterizedContext, Next } from "koa";
import { Beatmapset } from "../../../../CorsaceModels/MCA_AYIM/beatmapset";
import { CategorySectionType } from "../../../../CorsaceModels/MCA_AYIM/categorySection";

async function validateBody(ctx: ParameterizedContext<any, Router.IRouterParamContext<any, {}>>, next: Next): Promise<any> {
    const name = ctx.request.body.name.trim();

    if (!name) {
        return ctx.body = {
            error: "Need a name",
        };
    }

    const mode = await ModeDivision.findOne(ctx.request.body.mode);

    if (!mode) {
        return ctx.body = {
            error: "Not a valid mode",
        };
    }

    ctx.state.categoryMode = mode;
    ctx.state.categoryName = name;

    await next();
}

const categoriesRouter = new Router();

categoriesRouter.use(isLoggedInDiscord);
categoriesRouter.use(hasRole("mca", "staff"));

categoriesRouter.get("/", async (ctx) => {
    const [beatmapsets, categories, modes] = await Promise.all([
        Beatmapset.find({}),
        Category.find({ 
            relations: ["beatmapsets"],
            where: {
                isAutomatic: false,
            },
        }),
        ModeDivision.find({}),
    ]);

    ctx.body = {
        beatmapsets,
        categories,
        modes,
    };
});

categoriesRouter.post("/create", validateBody, async (ctx) => {
    const category = new Category();
    category.name = ctx.state.categoryName;
    category.isAutomatic = false;
    category.sectionID = CategorySectionType.Beatmapsets;
    category.mode = ctx.state.categoryMode;
    category.maxNominations = ctx.request.body.maxNominations || 1;
    category.isRequired = ctx.request.body.isRequired;
    category.beatmapsets = [];
    await category.save();

    ctx.body = category;
});

categoriesRouter.post("/:id/update", validateBody, async (ctx) => {
    const category = await Category.findOneOrFail(ctx.params.id, {
        where: {
            isAutomatic: false,
        },
    });
    category.name = ctx.state.categoryName;
    category.mode = ctx.state.categoryMode;
    category.maxNominations = ctx.request.body.maxNominations || 1;
    category.isRequired = ctx.request.body.isRequired;
    category.beatmapsets = ctx.request.body.beatmapsets;

    await category.save();

    ctx.body = category;
});

categoriesRouter.post("/:id/remove", async (ctx) => {
    const category = await Category.findOneOrFail(ctx.params.id, {
        where: {
            isAutomatic: false,
        },
    });
    await category.remove();

    ctx.body = {
        success: "ok",
    };
});

export default categoriesRouter;
