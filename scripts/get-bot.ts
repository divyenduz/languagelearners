import dotenv from 'dotenv'
import fetch from 'node-fetch'
import arg from 'arg'

const args = arg({
  '--production': Boolean,
  '-p': '--production',
})

const production = args['--production']

dotenv.config({
  path: production ? '.env.production' : '.env',
})

console.log(`Environment ${process.env.NODE_ENV}`)

if (!process.env.BOT_TOKEN) {
  console.error('Invalid .env, please set BOT_TOKEN')
  process.exit(1)
}

const telegramUrl = `https://api.telegram.org/bot${
  process.env.BOT_TOKEN
}/getWebhookInfo`

console.log(telegramUrl)

async function main() {
  const data = await fetch(telegramUrl, {
    method: 'GET',
  })
  console.log(data.status, await data.json())
}

main()