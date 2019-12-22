import { comprehend, translate, speech } from '../wrapper'
import { PRODUCTION } from '../globals'
import Telegraf from 'telegraf'
import { ContextMessageUpdateDecorated } from '..'
import os from 'os'

// TODO: unify language maps
const languageMap = {
  en: 'en-US',
  de: 'de-DE',
}

export const addSpeakCommand = (
  bot: Telegraf<ContextMessageUpdateDecorated>,
) => {
  bot.command(
    [
      'speak',
      `speak@LingoParrot${PRODUCTION ? '' : 'Dev'}Bot`,
      'speakt',
      `speakt@LingoParrot${PRODUCTION ? '' : 'Dev'}Bot`,
    ],
    async ctx => {
      const message = ctx.message || ctx.editedMessage
      const useTranslation =
        (message.text as string).indexOf('speakt') > -1 ? true : false
      const query = message.text
        .replace(
          `@LingoParrot${ctx.environment.production ? '' : 'Dev'}Bot`,
          '',
        )
        .replace('/speakt', '')
        .replace('/speak', '')
        .trim()
      try {
        const dominantLanguage = await comprehend(query)
        const targetLanguage = dominantLanguage === 'de' ? 'en' : 'de'
        const useLanguage = useTranslation ? targetLanguage : dominantLanguage
        if (ctx.environment.debug) {
          console.log(
            { query },
            { dominantLanguage },
            { targetLanguage },
            { useLanguage },
          )
        }
        const data = useTranslation
          ? await translate(query, dominantLanguage, useLanguage)
          : query
        const voice = await speech(data, languageMap[useLanguage])
        ctx.replyWithVoice(
          {
            source: voice,
          },
          {
            reply_to_message_id: message.message_id,
            caption: `Language ${useLanguage.toUpperCase()}${
              useTranslation
                ? `${
                    os.EOL
                  }Original message in language ${dominantLanguage.toUpperCase()} was ${query}`
                : ''
            }`,
          },
        )
      } catch (e) {
        console.log(e.toString())
      }
    },
  )
}
