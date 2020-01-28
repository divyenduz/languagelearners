import AWS from 'aws-sdk'
import ffmpegFactory from 'fluent-ffmpeg'
import { Readable } from 'stream'
import fs from 'fs'
import path from 'path'
import os from 'os'
import uuidv4 from 'uuid/v4'

const speechAPI = new AWS.Polly({
  region: 'us-east-1',
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_KEY_ID,
  signatureVersion: 'v4',
})

// TODO: Enable strict true
type Optional<T> = T | null

export const speech: (
  sourceText: string,
  languageCode: string,
) => Promise<Optional<Buffer>> = async (sourceText, languageCode = 'de-DE') => {
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
    const readable = new Readable()
    readable._read = () => {}
    readable.push(data.AudioStream)
    readable.push(null)

    const filename = uuidv4()
    const outputPath = path.join(os.tmpdir(), `${filename}.ogg`)
    console.log({ outputPath })

    const ffmpeg = ffmpegFactory({
      logger: {
        debug: data => {
          console.log(`FFMPEG DEBUG: ${data}`)
        },
        info: data => {
          console.log(`FFMPEG INFO: ${data}`)
        },
        warn: data => {
          console.log(`FFMPEG WARN: ${data}`)
        },
        error: data => {
          console.log(`FFMPEG ERROR: ${data}`)
        },
      },
    })

    return new Promise((resolve, reject) => {
      ffmpeg
        .input(readable)
        .audioCodec('libopus')
        .output(outputPath)
        .on('end', () => {
          const buffer = fs.readFileSync(outputPath)
          resolve(buffer)
        })
        .on('error', () => {
          reject(null)
        })
        .run()
    })
  } catch (e) {
    throw new Error(`Failed to synthesize: ${e.toString()}`)
  }
}
