import { prisma } from '../generated/prisma-client'

export const addStartCommand = bot => {
  bot.start(async ctx => {
    const text = ctx.message.text
    const id = text.replace('/start', '').trim()
    const existingUser = prisma.user({
      id,
    })

    if ((ctx).environment.debug) {
      console.log({ message: ctx.message })
    }

    if (!existingUser) {
      ctx.reply(`User with id ${id} does not exist`)
    } else {
      const user = await prisma.updateUser({
        where: {
          id,
        },
        data: {
          telegram_id: ctx.message.from.id.toString(),
          telegram_chat_id: ctx.message.chat.id.toString(),
        },
      })

      // TODO: The community link is German only, maybe it should open a link that has links to all communities
      // TODO: This community link is not personalized i.e. user can share it with anyone
      ctx.replyWithHTML(`Welcome ${user.email} to LingoParrot from LanguageLearners.club
            
Please join the German community using this <a href='https://t.me/joinchat/DGq5gw15zpNHPDKMO6-c3A'>link</a>`)
    }
  })
}
