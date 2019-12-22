import { PRODUCTION, DEBUG } from '../globals'

export const environmentMiddleware = (ctx, next) => {
  ;(ctx as any).environment = {
    production: PRODUCTION,
    debug: DEBUG,
  }
  next()
}
