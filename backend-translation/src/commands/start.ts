import { Telegraf } from 'telegraf'
import { ContextMessageUpdateDecorated } from '..'
import { PrismaClient, User } from '@prisma/client'

import ml from 'multilines'

const client = new PrismaClient()

function getName(user: User) {
  return `${user.first_name} ${user.last_name}`.trim()
}

export const addStartCommand = (
  bot: Telegraf<ContextMessageUpdateDecorated>,
) => {
  bot.start(async ctx => {
    const text = ctx.message.text
    const id = text.replace('/start', '').trim() // Externally created Prisma ID for payment

    const existingUser = await client.users.findOne({
      where: {
        id,
        telegram_id: ctx.from.id.toString(),
      },
    })

    if (ctx.environment.debug) {
      console.log({ message: ctx.message })
    }

    let user: User
    if (!existingUser) {
      // await ctx.reply(`User with id ${id} does not exist`)
      user = await client.users.create({
        data: {
          first_name: ctx.from.first_name,
          last_name: ctx.from.last_name,
          plan: 'GUEST',
          source_language: 'EN',
          target_language: 'DE',
          telegram_id: ctx.message.from.id.toString(),
          telegram_chat_id: ctx.message.chat.id.toString(),
        },
      })
    } else {
      user = await client.users.update({
        where: {
          id,
        },
        data: {
          telegram_id: ctx.message.from.id.toString(),
          telegram_chat_id: ctx.message.chat.id.toString(),
        },
      })
    }

    if (Boolean(user)) {
      await ctx.replyWithHTML(ml`
      | Welcome ${getName(user)} to LingoParrot from LanguageLearners.club`)
    }
  })
}
