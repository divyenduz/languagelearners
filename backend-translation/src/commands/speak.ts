import { comprehend, speech } from '../api'
import { PRODUCTION } from '../globals'
import Telegraf from 'telegraf'
import { ContextMessageUpdateDecorated } from '..'

// TODO: unify language maps
const languageMap = {
  en: 'en-US',
  de: 'de-DE',
}

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
        const dominantLanguage = await comprehend(query)
        if (ctx.environment.debug) {
          console.log({ query }, { dominantLanguage })
        }
        const data = query
        const voice = await speech(data, languageMap[dominantLanguage])
        await ctx.replyWithVoice(
          {
            source: voice,
          },
          {
            reply_to_message_id: message.message_id,
            caption: `🔍 Identified language is ${dominantLanguage.toUpperCase()}`,
          },
        )
      } catch (e) {
        console.log(e.toString())
      }
    },
  )
}
