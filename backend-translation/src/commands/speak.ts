import ml from 'multilines'

import { comprehend, speech } from '../api'
import { PRODUCTION } from '../globals'
import Telegraf from 'telegraf'
import { ContextMessageUpdateDecorated } from '..'
import { LanguageMap, LanguageCode } from '../utils/LanguageMap'

const languageMap = new LanguageMap()

import { PrismaClient } from '@prisma/client'

const client = new PrismaClient()

export const addSpeakCommand = (
  bot: Telegraf<ContextMessageUpdateDecorated>,
) => {
  bot.command(
    ['speak', `speak@LingoParrot${PRODUCTION ? '' : 'Dev'}Bot`],
    async ctx => {
      const message = ctx.message || ctx.editedMessage
      const query = message.text
        .replace(
          `@LingoParrot${ctx.environment.production ? '' : 'Dev'}Bot`,
          '',
        )
        .replace('/speak', '')
        .trim()
      try {
        const user = await client.user.findUnique({
          where: {
            telegram_id: ctx.from.id.toString(),
          },
        })
        const dominantLanguage = await comprehend(
          user.source_language as LanguageCode,
        )(query)
        if (ctx.environment.debug) {
          console.log({ query }, { dominantLanguage })
        }
        const data = query
        const voice = await speech(data, dominantLanguage as LanguageCode)
        if (voice) {
          await ctx.replyWithVoice(
            {
              source: voice,
            },
            {
              reply_to_message_id: message.message_id,
              caption: `🔍 Identified language is ${languageMap.getName(
                dominantLanguage as LanguageCode,
              )}`,
            },
          )
        } else {
          await ctx.reply(
            '🐞 Failed to create voice for the text. Our team has been notified.',
            {
              reply_to_message_id: message.message_id,
            },
          )
        }
      } catch (e) {
        console.log(e.toString())
        await ctx.reply(
          ml`
          | 🐞 Failed to create voice for the text. Our team has been notified.
          | 
          | ${e.toString()}`,
          {
            reply_to_message_id: message.message_id,
          },
        )
      }
    },
  )
}
