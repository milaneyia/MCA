import Router from "koa-router";
import { isLoggedInOsu } from "../../../CorsaceServer/middleware";
import { Nomination } from "../../../CorsaceModels/MCA_AYIM/nomination";
import { Category } from "../../../CorsaceModels/MCA_AYIM/category";
import { Beatmapset } from "../../../CorsaceModels/MCA_AYIM/beatmapset";
import { User } from "../../../CorsaceModels/user";
import { CategorySectionType } from "../../../CorsaceModels/MCA_AYIM/categorySection";
import { isEligibleFor, isEligibleCurrentYear } from "../middleware";

async function isNominationPhase(ctx, next): Promise<any> {
    const now = new Date();
    
    // edit this date according to schedule
    if (now <= new Date(2020, 1, 1) || now >= new Date(2020, 4, 1)) {
        return ctx.body = {
            error: "Not the right time",
        };
    }

    await next();
}

const nominationsRouter = new Router();

nominationsRouter.use(isLoggedInOsu);
nominationsRouter.use(isNominationPhase);

nominationsRouter.get("/", async (ctx) => {
    const [nominations, categories] = await Promise.all([
        Nomination.find({
            where: {
                nominator: ctx.state.user,
            },
            relations: ["beatmapset", "user", "category", "nominator"],
        }),
        Category.find({}),
    ]);

    ctx.body = {
        nominations,
        categories,
    };
});

nominationsRouter.post("/create", async (ctx) => {
    const category = await Category.findOneOrFail(ctx.request.body.categoryId, { 
        relations: ["beatmapsets"],
    });
    
    if (!isEligibleFor(ctx.state.user, category.modeID)) {
        return ctx.body = { 
            error: "You weren't active for this mode",
        };
    }

    const nomination = new Nomination();
    nomination.nominator = ctx.state.user;
    nomination.category = category;

    let beatmapset: Beatmapset;
    let user: User;

    if (category.sectionID == CategorySectionType.Beatmapsets) {
        beatmapset = await Beatmapset.findOneOrFail(ctx.request.body.nomineeId, {
            relations: ["beatmaps"],
        });

        // sbs categories
        if (!category.isAutomatic && !category.beatmapsets.some(b => b.ID === beatmapset.ID)) {
            return ctx.body = {
                error: "wrong category", 
            };
        }

        if (category.isAutomatic) {
            if (!beatmapset.beatmaps.find(b => b.mode.ID == category.mode.ID)) {
                return ctx.body = { 
                    error: "wrong mode",
                };
            }

            // others checks if a map is part of the category should go here (if any)
        }

        nomination.beatmapset = beatmapset;
    } else if (category.sectionID == CategorySectionType.Users) {
        user = await User.findOneOrFail(ctx.request.body.nomineeId);

        if (!isEligibleFor(user, category.modeID)) {
            return ctx.body = { 
                error: "user cannot be nominated",
            };
        }

        nomination.user = user;
    }

    const nominations = await Nomination.find({
        nominator: ctx.state.user,
        category,
    });

    if (nominations.length >= category.maxNominations) {
        return ctx.body = { 
            error: "Reached max nominations", 
        };
    }

    if (nominations.find(n => (beatmapset ? n.beatmapsetID === beatmapset.ID : n.userID === user.ID))) {
        return ctx.body = {
            error: "Already nominated", 
        };
    }
    
    await nomination.save();

    ctx.body = nomination;
});

nominationsRouter.post("/:id/remove", isEligibleCurrentYear, async (ctx) => {
    const nomination = await Nomination.findOneOrFail(ctx.params.id, {
        where: {
            voter: ctx.state.user,
        },
    });
    await nomination.remove();

    ctx.body = {
        success: "ok",
    };
});

export default nominationsRouter;
