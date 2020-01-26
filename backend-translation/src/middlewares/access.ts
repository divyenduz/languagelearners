import { makeInlineQueryResultArticle } from '../message'
import { isKnownUser, userNotKnownErrorMessage } from '../user'
import { Middleware } from 'telegraf'
import { ContextMessageUpdateDecorated } from '..'

export const accessMiddleware: Middleware<ContextMessageUpdateDecorated> = async (
  ctx,
  next,
) => {
  if (ctx.inlineQuery && !(await isKnownUser(ctx.from.id))) {
    console.log(`inlineQuery but unknown user`)
    await ctx.answerInlineQuery(
      [
        makeInlineQueryResultArticle({
          title: 'Join LanguageLearners to use the LingoParrot bot.',
          description: 'https://languagelearners.club',
          message: userNotKnownErrorMessage(ctx.from.username),
        }),
      ],
      {
        is_personal: true,
        cache_time: 0,
      },
    )
    return
  }

  // Private access of bot requires access.
  if (
    ctx.message &&
    ctx.message.from &&
    ctx.message.chat &&
    ctx.message.chat.type === 'private' &&
    !(await isKnownUser(ctx.message.from.id))
  ) {
    console.log(`private chat but but unknown user`)
    await ctx.reply(userNotKnownErrorMessage(ctx.from.username))
    return
  }

  // Bot echoes in group for everyone.
  const start = new Date()
  await next()
  const ms = +new Date() - +start
  console.log('Response time %sms', ms)
}
