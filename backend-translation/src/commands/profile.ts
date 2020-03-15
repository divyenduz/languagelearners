import { ContextMessageUpdateDecorated } from '..'
import Telegraf from 'telegraf'
import { PrismaClient } from '@prisma/client'
import { LanguageMap } from '../utils/LanguageMap'
import stripANSI from 'strip-ansi'

import ml from 'multilines'
import os from 'os'

const client = new PrismaClient()

const languageMap = new LanguageMap()
const allLanguageCodes = languageMap.getAllLanguageCodes()

const isKnownLanguage = (language: string) =>
  allLanguageCodes.map(l => l.toLowerCase()).includes(language.toLowerCase())

const knownLanguages = () => {
  return allLanguageCodes
    .map(languageCode => {
      return `${languageCode.toUpperCase()} (${languageMap.getName(
        languageCode,
      )})`
    })
    .join(os.EOL)
}

export const addProfileCommands = (
  bot: Telegraf<ContextMessageUpdateDecorated>,
) => {
  bot.command('set_email', async ctx => {
    const query = ctx.message.text.replace('/set_email', '').trim()
    const existingUser = await client.users.findOne({
      where: {
        telegram_id: ctx.from.id.toString(),
      },
    })
    if (!Boolean(existingUser)) {
      await ctx.reply(`/set_email called for a user that does not exist`)
    }
    await client.users.update({
      where: {
        id: existingUser.id,
      },
      data: {
        email: query,
      },
    })
    await ctx.reply(`User's email successfully changed to ${query}`)
  })

  bot.command('set_source_language', async ctx => {
    const query = ctx.message.text
      .replace('/set_source_language', '')
      .trim()
      .toUpperCase()
    if (!isKnownLanguage(query)) {
      await ctx.reply(
        ml`
        | /set_source_language called with an unknown language. Known languages are 
        | 
        | ${knownLanguages()}`,
      )
      return
    }
    const existingUser = await client.users.findOne({
      where: {
        telegram_id: ctx.from.id.toString(),
      },
    })
    if (!Boolean(existingUser)) {
      await ctx.reply(
        `/set_source_language called for a user that does not exist`,
      )
      return
    }
    if (query === existingUser.target_language) {
      await ctx.reply(
        `/set_source_language called with a value that is already set for target language. Source and target language cannot be same.`,
      )
      return
    }
    try {
      await client.users.update({
        where: {
          id: existingUser.id,
        },
        data: {
          source_language: query as any,
        },
      })
    } catch (e) {
      await ctx.reply(
        `User's source language change failed with error ${stripANSI(
          e.toString(),
        )}`,
      )
      return
    }
    await ctx.reply(`User's source language successfully changed to ${query}`)
  })

  bot.command('set_target_language', async ctx => {
    const query = ctx.message.text
      .replace('/set_target_language', '')
      .trim()
      .toUpperCase()
    if (!isKnownLanguage(query)) {
      await ctx.reply(
        ml`
        | /set_target_language called with an unknown language. Known languages are 
        | 
        | ${knownLanguages()}`,
      )
      return
    }
    const existingUser = await client.users.findOne({
      where: {
        telegram_id: ctx.from.id.toString(),
      },
    })
    if (!Boolean(existingUser)) {
      await ctx.reply(
        `/set_target_language called for a user that does not exist`,
      )
      return
    }
    if (query === existingUser.source_language) {
      await ctx.reply(
        `/set_target_language called with a value that is already set for source language. Source and target language cannot be same.`,
      )
      return
    }
    try {
      await client.users.update({
        where: {
          id: existingUser.id,
        },
        data: {
          target_language: query as any,
        },
      })
    } catch (e) {
      await ctx.reply(
        `User's target language change failed with error ${stripANSI(
          e.toString(),
        )}`,
      )
      return
    }
    await ctx.reply(`User's target language successfully changed to ${query}`)
  })
}
