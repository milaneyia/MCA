import { User } from "./models/User";

async function isLoggedIn(ctx, next) {
    if (ctx.session.id) {
        ctx.state.user = await User.findByPk(ctx.session.id);
        if (ctx.state.user) return next();
    }
    ctx.redirect('/');
}

async function isStaff(ctx, next) {
    if (ctx.state.user) {
        if (ctx.state.user.isStaff) return next();
    }
    ctx.redirect('/');
}

async function canParticipate(ctx, next) {
    if (ctx.state.user) {
        if (ctx.params.modeId) {
            if (ctx.state.user.permissions.find(p => p.modeId == ctx.params.modeId && p.canParticipate)) {
                return next();
            }
        } else if (ctx.request.body.modeId) {
            if (ctx.state.user.permissions.find(p => p.modeId == ctx.request.body.modeId && p.canParticipate)) {
                return next();
            }
        }
    }
    ctx.redirect('/');
}

export { isLoggedIn, isStaff, canParticipate }