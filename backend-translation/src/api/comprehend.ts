import AWS from 'aws-sdk'
import { LanguageCode } from '../utils/LanguageMap'

const comprehendAPI = new AWS.Comprehend({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_KEY_ID,
  apiVersion: '2017-11-27',
  signatureVersion: 'v4',
})

export const comprehend = (languageCode: LanguageCode) => {
  return async sourceText => {
    const languages = await comprehendAPI
      .detectDominantLanguage({
        Text: sourceText,
      })
      .promise()
    const language = languages.Languages.reduce(
      (dominantLanguage, language) => {
        if (dominantLanguage.Score > language.Score) {
          return dominantLanguage
        } else {
          return language
        }
      },
      {
        LanguageCode: languageCode.toLowerCase(),
        Score: 0,
      },
    )
    return language.LanguageCode
  }
}
