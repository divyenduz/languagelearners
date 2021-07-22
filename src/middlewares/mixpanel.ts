import Mixpanel from 'mixpanel'
import { Middleware } from 'telegraf'
import { ContextMessageUpdateDecorated } from '..'

export const mixpanelMiddleware: Middleware<ContextMessageUpdateDecorated> = async (
  ctx,
  next,
) => {
  if (!process.env.MIXPANEL_TOKEN) {
    if (ctx.environment.debug) {
      console.log('WARN: env MIXPANEL_TOKEN not provided')
    }
    return
  }
  if (ctx.environment.debug) {
    console.log('using mixpanel')
  }
  const mixpanel = Mixpanel.init(process.env.MIXPANEL_TOKEN)
  ctx.mixpanel = mixpanel

  const from =
    ctx.message?.from || ctx.inlineQuery?.from || ctx.editedMessage?.from

  const query =
    ctx.message?.text?.trim() ||
    ctx.inlineQuery?.query?.trim() ||
    ctx.editedMessage?.text?.trim()

  const chat = ctx.chat?.type
  const group = ctx.chat?.title

  console.log(
    `${ctx.updateType} - ${query} from user ${from &&
      from.username} in ${chat} chat ${chat !== 'private' ? `(${group})` : ``}`,
  )

  if (ctx.mixpanel && from) {
    const mixpanel = ctx.mixpanel
    if (ctx.environment.debug) {
      console.log(`metrics - tracking user stats for user: ${from.username}`)
    }
    mixpanel.people.set(from.username, {
      $first_name: from.first_name,
      $last_name: from.last_name,
      plan: 'premium',
    })
    mixpanel.track('received_message', {
      $distinct_id: from.username,
    })
    mixpanel.people.increment(from.username, 'messages', 1)
    mixpanel.people.increment(from.username, 'characters', query.length)
  }

  const start = new Date()
  await next()
  const ms = +new Date() - +start
  console.log('Response time %sms', ms)
}
