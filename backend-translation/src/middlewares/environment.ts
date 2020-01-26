import { PRODUCTION, DEBUG } from '../globals'
import { Middleware } from 'telegraf'
import { ContextMessageUpdateDecorated } from '..'

export const environmentMiddleware: Middleware<ContextMessageUpdateDecorated> = async (
  ctx,
  next,
) => {
  ctx.environment = {
    production: PRODUCTION,
    debug: DEBUG,
  }
  const start = new Date()
  await next()
  const ms = +new Date() - +start
  console.log('Response time %sms', ms)
}
