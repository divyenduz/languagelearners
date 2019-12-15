console.log(`Environment ${process.env.NODE_ENV}`)
export const PRODUCTION = process.env.NODE_ENV === 'production' ? true : false
export const DEBUG = process.env.DEBUG || !PRODUCTION

export const FEATURE_FLAGS = {
  inline: {
    botSpeech: false,
    botTranscribe: false,
  },
  command: {
    botSpeech: true,
    botTranscribe: false,
  },
  echo: {
    botSpeech: false,
    botTranscribe: false,
  },
}
