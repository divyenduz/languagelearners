import { Telegraf, ContextMessageUpdate } from 'telegraf'
import { isAdmin } from '../../user'

import { PrismaClient } from '@prisma/client'

const client = new PrismaClient()

export const addRemoveUserCommand = (bot: Telegraf<ContextMessageUpdate>) => {
  bot.command('removeuser', async ctx => {
    if (await isAdmin(ctx.from.id)) {
      const query = ctx.message.text.replace('/removeuser', '').trim()
      const existingUser = await client.users.findOne({
        where: {
          email: query,
        },
      })
      if (!existingUser) {
        await ctx.reply(`User with email id ${query}, does not exists`)
      } else if (existingUser.plan === 'PAST') {
        await ctx.reply(`User with email id ${query}, is already in PAST plan`)
      } else {
        const user = await client.users.update({
          where: {
            id: existingUser.id,
          },
          data: {
            plan: 'PAST',
          },
        })
        await ctx.reply(`User with email ${user.email} moved to plan PAST`)
      }
    } else {
      console.log(`Admin command from non-admin user ${ctx.from.username}`)
    }
  })
}
