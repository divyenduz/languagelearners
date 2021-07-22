import AWS from 'aws-sdk'
import { LanguageCode } from '../utils/LanguageMap'

const translateAPI = new AWS.Translate({
  region: 'us-east-1',
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_KEY_ID,
  apiVersion: '2017-07-01',
})

export const translate = async (
  sourceText: string,
  sourceLanguageCode: LanguageCode,
  targetLanguageCode: LanguageCode,
) => {
  try {
    const data = await translateAPI
      .translateText({
        SourceLanguageCode: sourceLanguageCode,
        TargetLanguageCode: targetLanguageCode,
        Text: sourceText,
      })
      .promise()
    if (!data || !data.TranslatedText) {
      throw new Error('Failed to translate')
    }
    return data && data.TranslatedText
  } catch (e) {
    throw new Error(`Failed to translate: ${e.toString()}`)
  }
}