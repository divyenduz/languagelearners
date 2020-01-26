import AWS from 'aws-sdk'

const speechAPI = new AWS.Polly({
  region: 'us-east-1',
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_KEY_ID,
  signatureVersion: 'v4',
})

export const speech = async (sourceText, languageCode = 'de-DE') => {
  const germanVoiceId = 'Vicki'
  const defaultVoiceId = germanVoiceId
  const voiceIdLanguageCodeMap = {
    'de-DE': defaultVoiceId,
    'en-US': 'Ivy',
  }
  try {
    const data = await speechAPI
      .synthesizeSpeech({
        Text: sourceText,
        LanguageCode: languageCode,
        OutputFormat: 'ogg_vorbis',
        VoiceId: voiceIdLanguageCodeMap[languageCode] || defaultVoiceId,
      })
      .promise()
    if (!data || !(data.AudioStream instanceof Buffer)) {
      throw new Error('Failed to synthesize')
    }
    // fs.writeFileSync("voice.mp3", data.AudioStream);
    return data.AudioStream
  } catch (e) {
    throw new Error(`Failed to synthesize: ${e.toString()}`)
  }
}
