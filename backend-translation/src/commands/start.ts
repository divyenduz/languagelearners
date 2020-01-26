import { Telegraf } from 'telegraf'
import { ContextMessageUpdateDecorated } from '..'
import { PrismaClient } from '@prisma/client'

const client = new PrismaClient()

export const addStartCommand = (
  bot: Telegraf<ContextMessageUpdateDecorated>,
) => {
  bot.start(async ctx => {
    const text = ctx.message.text
    const id = text.replace('/start', '').trim()
    const existingUser = await client.users.findOne({
      where: {
        id,
      },
    })

    if (ctx.environment.debug) {
      console.log({ message: ctx.message })
    }

    if (!existingUser) {
      await ctx.reply(`User with id ${id} does not exist`)
    } else {
      const user = await client.users.update({
        where: {
          id,
        },
        data: {
          telegram_id: ctx.message.from.id.toString(),
          telegram_chat_id: ctx.message.chat.id.toString(),
        },
      })

      // TODO: The community link is German only, maybe it should open a link that has links to all communities
      // TODO: This community link is not personalized i.e. user can share it with anyone
      await ctx.replyWithHTML(`Welcome ${user.email} to LingoParrot from LanguageLearners.club
            
Please join the German community using this <a href='https://t.me/joinchat/DGq5gw15zpNHPDKMO6-c3A'>link</a>`)
    }
  })
}
