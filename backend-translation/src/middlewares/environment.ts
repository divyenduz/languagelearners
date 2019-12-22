import { PRODUCTION, DEBUG } from '../globals'
import { Middleware } from 'telegraf'
import { ContextMessageUpdateDecorated } from '..'

export const environmentMiddleware: Middleware<ContextMessageUpdateDecorated> = (ctx, next) => {
  ctx.environment = {
    production: PRODUCTION,
    debug: DEBUG,
  }
  next()
}
