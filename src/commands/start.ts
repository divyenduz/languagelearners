import { Telegraf } from 'telegraf'
import { ContextMessageUpdateDecorated } from '..'
import { PrismaClient, User } from '@prisma/client'

import ml from 'multilines'
import { LanguageMap, LanguageCode } from '../utils/LanguageMap'
import { match } from 'ts-pattern'

const client = new PrismaClient()
const languageMap = new LanguageMap()

function getName(user: User) {
  return `${user.first_name} ${user.last_name}`.trim()
}

export const addStartCommand = (
  bot: Telegraf<ContextMessageUpdateDecorated>,
) => {
  bot.start(async ctx => {
    const text = ctx.message.text
    const id = text.replace('/start', '').trim() // Externally created Prisma ID for payment

    // TODO: fix the error when two users are created
    const findUniqueWhereArgs = match(Boolean(id))
      .with(true, () => {
        return {
          id,
        }
      })
      .with(false, () => {
        return { telegram_id: ctx.from.id.toString() }
      })
      .exhaustive()

    console.log({ findUniqueWhereArgs })

    const existingUser = await client.user.findUnique({
      where: findUniqueWhereArgs,
    })

    console.log({ existingUser })

    if (ctx.environment.debug) {
      console.log({ message: ctx.message })
    }

    let user: User
    if (!existingUser) {
      // await ctx.reply(`User with id ${id} does not exist`)
      user = await client.user.create({
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
      user = await client.user.update({
        where: findUniqueWhereArgs,
        data: {
          telegram_id: ctx.message.from.id.toString(),
          telegram_chat_id: ctx.message.chat.id.toString(),
        },
      })
    }

    const sourceLanguageName = languageMap.getName(
      user.source_language.toLowerCase() as LanguageCode,
    )
    const targetLanguageName = languageMap.getName(
      user.target_language.toLowerCase() as LanguageCode,
    )
    if (Boolean(user)) {
      await ctx.replyWithHTML(ml`
      | Welcome ${getName(user)} to LingoParrot from LanguageLearners.club
      | Your "known" (source) language is ${sourceLanguageName}.
      | Please change it with /set_source_language command.
      |
      | Your "to learn" (target) language is ${targetLanguageName}
      | Please change it with /set_target_language command.`)
    }
  })
}
