import { Telegraf, ContextMessageUpdate } from 'telegraf'

export const addHelpCommand = (bot: Telegraf<ContextMessageUpdate>) => {
  bot.help(
    async ctx =>
      await ctx.reply(
        'I will help you learn a new language by echoing you in that language. Simple right.',
      ),
  )
}
