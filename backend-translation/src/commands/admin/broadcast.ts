import { Telegraf, ContextMessageUpdate } from 'telegraf'
import { isAdmin } from '../../user'

import { PrismaClient } from '@prisma/client'

const client = new PrismaClient()

export const addBroadcastCommand = (bot: Telegraf<ContextMessageUpdate>) => {
  bot.command('broadcast', async ctx => {
    if (await isAdmin(ctx.from.id)) {
      const query = ctx.message.text.replace('/broadcast', '').trim()
      const users = await client.users.findMany()
      users
        .filter(user => user.telegram_chat_id)
        .forEach(user => {
          ctx.telegram.sendMessage(user.telegram_chat_id, query)
        })
    } else {
      console.log(`Admin command from non-admin user ${ctx.from.username}`)
    }
  })
}
