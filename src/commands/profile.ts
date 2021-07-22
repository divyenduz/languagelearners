import { ContextMessageUpdateDecorated } from '..'
import Telegraf from 'telegraf'
import { PrismaClient, SourceLanguage, TargetLanguage } from '@prisma/client'
import { LanguageMap, LanguageCode } from '../utils/LanguageMap'

const client = new PrismaClient()

const languageMap = new LanguageMap()
const allLanguageCodes = languageMap.getAllLanguageCodes()

export const addProfileCommands = (
  bot: Telegraf<ContextMessageUpdateDecorated>,
) => {
  bot.command('set_email', async ctx => {
    const query = ctx.message.text.replace('/set_email', '').trim()
    const existingUser = await client.user.findUnique({
      where: {
        telegram_id: ctx.from.id.toString(),
      },
    })
    if (!Boolean(existingUser)) {
      await ctx.reply(`/set_email called for a user that does not exist`)
    }
    await client.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        email: query,
      },
    })
    await ctx.reply(`User's email successfully changed to ${query}`)
  })

  bot.command(['set_source_language', 'set_target_language'], async ctx => {
    const commandEntity = ctx.message?.entities![0]
    const command = ctx.message?.text?.slice(
      commandEntity?.offset + 1,
      commandEntity?.length,
    )

    const user = await client.user.findUnique({
      where: {
        telegram_id: ctx.from.id.toString(),
      },
    })

    const inlineKeyboard = allLanguageCodes
      .map(languageCode => languageCode.toLowerCase())
      .map(languageCode => {
        const isSourceLanguage =
          user.source_language.toString().toLowerCase() === languageCode
        const isTargetLanguage =
          user.target_language.toString().toLowerCase() === languageCode
        const languageName = languageMap.getName(languageCode as LanguageCode)

        const text =
          languageName +
          (isSourceLanguage ? ' (source language)' : '') +
          (isTargetLanguage ? ' (target language)' : '')

        return [
          {
            text: text,
            callback_data: `${command}: ${languageCode}`,
          },
        ]
      })
      .concat([
        [
          {
            text: 'Cancel',
            callback_data: 'target: cancel',
          },
        ],
      ])

    await ctx.reply(
      `Please choose a ${
        command === 'set_target_language'
          ? '"to learn" (target)'
          : '"I know" (source)'
      } language`,
      {
        reply_markup: {
          force_reply: true,
          inline_keyboard: inlineKeyboard,
        },
      },
    )
  })

  bot.on('callback_query', async ctx => {
    const [command, value] = ctx.update.callback_query.data
      .split(':')
      .map(token => token.trim())

    if (value === 'cancel') {
      return
    }

    console.log(ctx.from.id.toString())
    const user = await client.user.update({
      where: {
        telegram_id: ctx.from.id.toString(),
      },
      data: {
        ...(command === 'set_target_language' && {
          target_language: value.toUpperCase() as TargetLanguage,
        }),
        ...(command === 'set_source_language' && {
          source_language: value.toUpperCase() as SourceLanguage,
        }),
      },
    })
    console.log({ user })

    await ctx.reply(
      `User's ${
        command === 'set_target_language' ? 'target' : 'source'
      } set to ${languageMap.getName(value as LanguageCode)}`,
    )
  })
}
