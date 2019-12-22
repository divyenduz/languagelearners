import { comprehend, translate, speech } from '../wrapper'
import { PRODUCTION } from '../globals'

// TODO: unify language maps
const languageMap = {
  en: 'en-US',
  de: 'de-DE',
}

export const addSpeakCommand = bot => {
  bot.command(
    [
      'speak',
      `speak@LingoParrot${PRODUCTION ? '' : 'Dev'}Bot`,
      'speakt',
      `speakt@LingoParrot${PRODUCTION ? '' : 'Dev'}Bot`,
    ],
    async ctx => {
      const useTranslation =
        (ctx.message.text as string).indexOf('speakt') > -1 ? true : false
      const query = ctx.message.text
        .replace(
          `@LingoParrot${(ctx as any).environment.production ? '' : 'Dev'}Bot`,
          '',
        )
        .replace('/speakt', '')
        .replace('/speak', '')
        .trim()
      try {
        const dominantLanguage = await comprehend(query)
        const targetLanguage = dominantLanguage === 'de' ? 'en' : 'de'
        const useLanguage = useTranslation ? targetLanguage : dominantLanguage
        if ((ctx as any).environment.debug) {
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
        ctx.replyWithVoice({
          source: voice,
        })
      } catch (e) {
        console.log(e.toString())
      }
    },
  )
}
