import dotenv from 'dotenv'
dotenv.config()

import { PrismaClient } from '@prisma/client'
import { PRODUCTION } from '../src/globals'

const client = new PrismaClient()

async function run() {
  const user = await client.user.create({
    data: {
      email: 'divyendu.z@gmail.com',
      type: 'ADMIN',
      plan: 'GUEST',
      telegram_id: '',
      telegram_chat_id: '',
    },
  })

  const invitationLink = `https://telegram.me/LingoParrot${
    PRODUCTION ? '' : 'Dev'
  }Bot?start=${user.id}`

  console.log(`Please join LLC using this link ${invitationLink}`)
}

run()
