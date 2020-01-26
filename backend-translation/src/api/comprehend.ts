import AWS from 'aws-sdk'

const comprehendAPI = new AWS.Comprehend({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_KEY_ID,
  apiVersion: '2017-11-27',
  signatureVersion: 'v4',
})

export const comprehend = async sourceText => {
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
      LanguageCode: 'de',
      Score: 0,
    },
  )
  return language.LanguageCode
}
