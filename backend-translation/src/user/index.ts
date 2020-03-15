import { sendMail } from '../api'

import { PrismaClient } from '@prisma/client'

const client = new PrismaClient()

export const isAdmin = async userId => {
  const user = await client.users.findOne({
    where: {
      telegram_id: userId.toString(),
    },
  })
  if (user && user.type === 'ADMIN') {
    return true
  } else {
    return false
  }
}

export const isKnownUser = async userId => {
  const user = await client.users.findOne({
    where: {
      telegram_id: userId.toString(),
    },
  })
  if (user && user.plan !== 'PAST') {
    return true
  } else {
    return false
  }
}

export const userNotKnownErrorMessage = userName => {
  const joinLink = 'https://languagelearners.club'
  return `User ${userName} is not identified. You need to join ${joinLink} before using LingoParrot or please click the invitation link from the invitation email if you have it.`
}

export const makeInvitationLink = ({ id, production }) => {
  return `https://telegram.me/LingoParrot${
    production ? '' : 'Dev'
  }Bot?start=${id}`
}

export const inviteUserViaEmail = ({ email, invitationLink }) => {
  sendMail({
    email,
    subject: `You have been invited to join Language Learners Club ✅`,
    body: `
          Please use this <a href='${invitationLink}'>link</a> to get started with LingoParrot. 

          P.S. This requires a Telegram account. 
          `,
  })
}
