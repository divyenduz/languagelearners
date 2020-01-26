import request from 'request'

import { upload } from '.'

const fetch = require('node-fetch')

const getFileUrlFromMessage = async message => {
  const voiceInfoJSON = await fetch(
    `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getFile?file_id=${message.file_id}`,
  )
  const voiceInfo = await voiceInfoJSON.json()
  return `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${voiceInfo.result.file_path}`
}

const util = require('util')
const requestPromise = util.promisify(request)
const getStreamFromFileUrl = async fileUrl => {
  return await requestPromise(fileUrl)
}

export const moveTelegramFileToS3 = async (message, name) => {
  const voiceFileUrl = await getFileUrlFromMessage(message)
  const voiceFileStream = await getStreamFromFileUrl(voiceFileUrl)

  const voiceFileS3Url = await upload({
    name: name,
    buffer: voiceFileStream.body,
    folder: `transcribe`,
  })

  return voiceFileS3Url
}
