import Router from 'koa-router';
import { isLoggedIn, hasRole } from '../../../../CorsaceServer/middleware';
import { Category } from '../../../../CorsaceModels/MCA_AYIM/category';
import { Beatmap } from '../../../../CorsaceModels/MCA_AYIM/beatmap';
import { ModeDivision } from '../../../../CorsaceModels/MCA_AYIM/modeDivision';

async function validateBody(ctx, next): Promise<any> {
    const name = ctx.request.body.name.trim();

    if (!name) {
        return ctx.body = {
            error: 'Need a name',
        };
    }

    const mode = await ModeDivision.findOne(ctx.request.body.mode);

    if (!mode) {
        return ctx.body = {
            error: 'Not a valid mode',
        };
    }

    ctx.state.categoryMode = mode;
    ctx.state.categoryName = name;

    await next();
}

const categoriesRouter = new Router();

categoriesRouter.get('/', isLoggedIn, hasRole('mca', 'staff'), async (ctx) => {
    const [beatmaps, categories, modes] = await Promise.all([
        Beatmap.find({}),
        Category.find({ 
            relations: ['beatmaps'],
            where: {
                isAutomatic: false,
            }
        }),
        ModeDivision.find({}),
    ]);

    ctx.body = {
        beatmaps,
        categories,
        modes,
    };
});

categoriesRouter.post('/create', isLoggedIn, hasRole('mca', 'staff'), validateBody, async (ctx) => {
    const category = new Category();
    category.name = ctx.state.categoryName;
    category.isAutomatic = false;
    category.mode = ctx.state.categoryMode;
    category.beatmaps = [];
    await category.save();

    ctx.body = category;
});

categoriesRouter.post('/:id/update', isLoggedIn, hasRole('mca', 'staff'), validateBody, async (ctx) => {
    const category = await Category.findOneOrFail(ctx.params.id, {
        where: {
            isAutomatic: false
        }
    });
    category.name = ctx.state.categoryName;
    category.mode = ctx.state.categoryMode;
    category.beatmaps = ctx.request.body.beatmaps;

    await category.save();

    ctx.body = category;
});

categoriesRouter.post('/:id/remove', isLoggedIn, hasRole('mca', 'staff'), async (ctx) => {
    const category = await Category.findOneOrFail(ctx.params.id, {
        where: {
            isAutomatic: false
        }
    });
    await category.remove();

    ctx.body = {
        success: 'ok',
    };
});

export default categoriesRouter;
