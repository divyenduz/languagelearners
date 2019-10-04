import { sendMail } from '../wrapper'

// TODO: Unify data access to one place, we shouldn't be importing storage helpers all over the place
import { prisma } from '../generated/prisma-client'
import { PRODUCTION } from '../globals'

export const isAdmin = async userId => {
  const user = await prisma.user({
    telegram_id: userId.toString(),
  })
  if (user && user.type === 'ADMIN') {
    return true
  } else {
    return false
  }
}

export const isKnownUser = async userId => {
  const user = await prisma.user({
    telegram_id: userId.toString(),
  })
  if (user && user.plan !== 'PAST') {
    return true
  } else {
    return false
  }
}

// TODO: Move this to use backend state making it possible to add new groups via admin commands
export const isKnownGroup = groupName => {
  const developmentGroups = ['Development - Language Learners Club']
  const productionGroups = ['German - Language Learners Club']
  const knownGroups = PRODUCTION
    ? [...productionGroups]
    : [...developmentGroups]
  const index = knownGroups.indexOf(groupName)
  return index > -1
}

// TODO: Unify messaging via some template system
// TODO: Re-send invite when we know a user is in system but not using /start workflow
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
  // TODO: Separate email bodies into a concept of "email templates".
  // They shouldn't be scattered all over the code. Maybe https://heml.io/
  sendMail({
    email,
    subject: `You have been invited to join Language Learners Club ✅`,
    body: `
          Please use this <a href='${invitationLink}'>link</a> to get started with LingoParrot. 

          P.S. This requires a Telegram account. 
          `,
  })
}
