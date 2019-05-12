import { PRODUCTION, DEBUG } from "../globals";

export const environmentMiddleware = (ctx, next) => {
  ctx.environment = {
    production: PRODUCTION,
    debug: DEBUG
  };
  next();
};
