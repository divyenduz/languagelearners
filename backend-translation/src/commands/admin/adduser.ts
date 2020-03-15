import { Telegraf } from 'telegraf'
import { ContextMessageUpdateDecorated } from '../..'
import { isAdmin, inviteUserViaEmail, makeInvitationLink } from '../../user'

import { PrismaClient } from '@prisma/client'

const client = new PrismaClient()

export const addAddUserCommand = (
  bot: Telegraf<ContextMessageUpdateDecorated>,
) => {
  bot.command('adduser', async ctx => {
    if (await isAdmin(ctx.from.id)) {
      const query = ctx.message.text.replace('/adduser', '').trim()
      const existingUser = await client.users.findOne({
        where: {
          email: query,
        },
      })
      if (existingUser) {
        if (existingUser.plan !== 'PAST') {
          await ctx.reply(
            `User with email ${existingUser.email}, already exists with plan ${existingUser.plan}`,
          )
        } else {
          const user = await client.users.update({
            where: {
              email: query,
            },
            data: {
              plan: 'GUEST',
              source_language: 'EN',
              target_language: 'DE',
            },
          })

          const invitationLink = makeInvitationLink({
            id: user.id,
            production: ctx.environment.production,
          })

          inviteUserViaEmail({
            email: query,
            invitationLink,
          })

          await ctx.reply(
            `Invitation link ${invitationLink} sent to user's email address ${query}`,
          )
        }
      } else {
        const user = await client.users.create({
          data: {
            email: query,
            plan: 'GUEST',
            source_language: 'EN',
            target_language: 'DE',
          },
        })

        const invitationLink = `https://telegram.me/LingoParrot${
          ctx.environment.production ? '' : 'Dev'
        }Bot?start=${user.id}`

        inviteUserViaEmail({
          email: query,
          invitationLink,
        })

        await ctx.reply(
          `Invitation link ${invitationLink} sent to user's email address ${query}`,
        )
      }
    } else {
      console.log(`Admin command from non-admin user ${ctx.from.username}`)
    }
  })
}
