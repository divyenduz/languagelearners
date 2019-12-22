import { isAdmin, inviteUserViaEmail, makeInvitationLink } from '../../user'

import { prisma } from '../../generated/prisma-client'

export const addAddUserCommand = bot => {
  bot.command('adduser', async ctx => {
    if (await isAdmin(ctx.from.id)) {
      const query = ctx.message.text.replace('/adduser', '').trim()
      const existingUser = await prisma.user({
        email: query,
      })
      if (existingUser) {
        if (existingUser.plan !== 'PAST') {
          ctx.reply(
            `User with email ${existingUser.email}, already exists with plan ${existingUser.plan}`,
          )
        } else {
          const user = await prisma.updateUser({
            where: {
              email: query,
            },
            data: {
              plan: 'GUEST',
              source_language: 'AUTO',
              target_language: 'DE',
            },
          })

          const invitationLink = makeInvitationLink({
            id: user.id,
            production: (ctx).environment.production,
          })

          inviteUserViaEmail({
            email: query,
            invitationLink,
          })

          ctx.reply(
            `Invitation link ${invitationLink} sent to user's email address ${query}`,
          )
        }
      } else {
        // TODO: Simply repeated code from this if/else block
        const user = await prisma.createUser({
          email: query,
          plan: 'GUEST',
          source_language: 'AUTO',
          target_language: 'DE',
        })

        const invitationLink = `https://telegram.me/LingoParrot${
          (ctx).environment.production ? '' : 'Dev'
        }Bot?start=${user.id}`

        inviteUserViaEmail({
          email: query,
          invitationLink,
        })

        ctx.reply(
          `Invitation link ${invitationLink} sent to user's email address ${query}`,
        )
      }
    } else {
      console.log(`Admin command from non-admin user ${ctx.from.username}`)
    }
  })
}
