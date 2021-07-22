import dotenv from 'dotenv'
import Telegraf, { ContextMessageUpdate } from 'telegraf'

import {
  makeInlineQueryResultArticle,
  makeInlineQueryResultVoice,
} from './message'

import { translate, speech, upload, comprehend } from './api'
import { FEATURE_FLAGS } from './globals'

import {
  mixpanelMiddleware,
  environmentMiddleware,
  accessMiddleware,
} from './middlewares'

import {
  addStartCommand,
  addHelpCommand,
  addSpeakCommand,
  addAddUserCommand,
  addRemoveUserCommand,
} from './commands'
import { Mixpanel } from 'mixpanel'
import { LanguageCode } from './utils/LanguageMap'

import { PrismaClient } from '@prisma/client'
import { addProfileCommands } from './commands/profile'

const client = new PrismaClient()

dotenv.config()

const uuidv4 = require('uuid/v4')

export type ContextMessageUpdateDecorated = ContextMessageUpdate & {
  environment: {
    production: boolean
    debug: boolean
  }
  mixpanel?: Mixpanel
}

export const bot: Telegraf<ContextMessageUpdateDecorated> = new Telegraf(
  process.env.BOT_TOKEN,
)

bot.use(environmentMiddleware)
bot.use(mixpanelMiddleware)

// Start command happens before access control
addStartCommand(bot)
addProfileCommands(bot)

bot.use(accessMiddleware)

addHelpCommand(bot)
addAddUserCommand(bot)
addRemoveUserCommand(bot)

bot.on('inline_query', async ctx => {
  const query = ctx.inlineQuery.query.trim()

  try {
    const user = await client.user.findUnique({
      where: {
        telegram_id: ctx.from.id.toString(),
      },
    })
    const dominantLanguage = await comprehend(
      user.source_language as LanguageCode,
    )(query)
    const targetLanguage =
      dominantLanguage === user.source_language.toLowerCase()
        ? user.target_language
        : user.source_language
    if (ctx.environment.debug) {
      console.log({ query }, { dominantLanguage })
    }

    const data = await translate(
      query,
      dominantLanguage as LanguageCode,
      targetLanguage as LanguageCode,
    )

    // TODO: Can this type cast be removed
    let result: Array<any> = [
      makeInlineQueryResultArticle({
        title: data,
        description: 'Text',
        message: `${data} (${query})`,
      }),
    ]
    if (FEATURE_FLAGS.inline.botSpeech) {
      const voice = await speech(data, targetLanguage as LanguageCode)
      const fileUrl = await upload({
        name: `${uuidv4()}.ogg`,
        buffer: voice,
        folder: `polly`,
        type: `audio/ogg`,
      })

      result = [
        ...result,
        ...[
          makeInlineQueryResultVoice({
            title: data,
            caption: `${data} (${query})`,
            voiceUrl: fileUrl,
          }),
        ],
      ]
    }

    await ctx.answerInlineQuery(result, {
      is_personal: true,
      cache_time: 0,
    })
  } catch (e) {
    console.log(e.toString())
  }
})

if (FEATURE_FLAGS.command.botSpeech) {
  addSpeakCommand(bot)
}

bot.on(['message', 'edited_message'], async ctx => {
  const message = ctx.message || ctx.editedMessage
  const query = message.text.trim() || message.text.trim()

  try {
    const user = await client.user.findUnique({
      where: {
        telegram_id: ctx.from.id.toString(),
      },
    })
    const dominantLanguage = await comprehend(
      user.source_language as LanguageCode,
    )(query)
    const targetLanguage =
      dominantLanguage === user.source_language.toLowerCase()
        ? user.target_language
        : user.source_language
    if (ctx.environment.debug) {
      console.log({ query }, { dominantLanguage })
    }
    const data = await translate(
      query,
      dominantLanguage as LanguageCode,
      targetLanguage as LanguageCode,
    )
    await ctx.reply(data, {
      reply_to_message_id: message.message_id,
    })
  } catch (e) {
    console.log(e.toString())
    await ctx.reply('🐞 Failed to translate, our team has been notified.', {
      reply_to_message_id: message.message_id,
    })
  }
})
