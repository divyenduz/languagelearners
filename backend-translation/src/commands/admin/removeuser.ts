import { isAdmin } from '../../user'

import { prisma } from '../../generated/prisma-client'

export const addRemoveUserCommand = bot => {
  bot.command('removeuser', async ctx => {
    if (await isAdmin(ctx.from.id)) {
      const query = ctx.message.text.replace('/removeuser', '').trim()
      const existingUser = await prisma.user({
        email: query,
      })
      if (!existingUser) {
        ctx.reply(`User with email id ${query}, does not exists`)
      } else if (existingUser.plan === 'PAST') {
        ctx.reply(`User with email id ${query}, is already in PAST plan`)
      } else {
        const user = await prisma.updateUser({
          where: {
            id: existingUser.id,
          },
          data: {
            plan: 'PAST',
          },
        })
        ctx.reply(`User with email ${user.email} moved to plan PAST`)
      }
    } else {
      console.log(`Admin command from non-admin user ${ctx.from.username}`)
    }
  })
}
