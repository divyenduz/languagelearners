import { makeInlineQueryResultArticle } from "../message";
import { sendMail } from "../wrapper";

// TODO: Unify data access to one place, we shouldn't be importing storage helpers all over the place
import { prisma } from "../generated/prisma-client";

// TODO: Unify environment with middleware.
console.log(`Environment ${process.env.NODE_ENV}`);
const production = process.env.NODE_ENV === "production" ? true : false;
const debug = process.env.DEBUG || !production;

export const addBotAccess = bot => {
  bot.use((ctx, next) => {
    if (ctx.inlineQuery && !isKnownUser(ctx.from.username)) {
      console.log(`inlineQuery but unknown user`);
      ctx.answerInlineQuery(
        [
          makeInlineQueryResultArticle({
            title: "Join LanguageLearners to use the LingoParrot bot.",
            description: "https://languagelearners.club",
            message: userNotKnownErrorMessage(ctx.from.username)
          })
        ],
        {
          is_personal: true,
          cache_time: 0
        }
      );
      return;
    }

    // Private access of bot requires access.
    if (
      ctx.message &&
      ctx.message.from &&
      ctx.message.chat &&
      ctx.message.chat.type === "private" &&
      !isKnownUser(ctx.message.from.username)
    ) {
      console.log(`private chat but but unknown user`);
      ctx.reply(userNotKnownErrorMessage(ctx.from.username));
      return;
    }

    if (
      ctx.message &&
      ctx.message.from &&
      ctx.message.chat &&
      (ctx.message.chat.type === "group" ||
        ctx.message.chat.type === "supergroup") &&
      !isKnownGroup(ctx.message.chat.title)
    ) {
      if (!isKnownGroup(ctx.message.chat.title)) {
        console.log(`unknown group: ${ctx.message.chat.title}`);
      }
      return;
    }

    // Bot echoes in group for everyone.
    next();
  });
};

export const isAdmin = async userId => {
  const user = await prisma.user({
    telegram_id: userId
  });
  if (user && user.type === "ADMIN") {
    return true;
  } else {
    return false;
  }
};

const isKnownUser = async userId => {
  const user = await prisma.user({
    telegram_id: userId
  });
  if (user && user.plan !== "PAST") {
    return true;
  } else {
    return false;
  }
};

// TODO: Move this to use backend state making it possible to add new groups via admin commands
const isKnownGroup = groupName => {
  const developmentGroups = ["Development - Language Learners Club"];
  const productionGroups = ["German - Language Learners Club"];
  const knownGroups = production
    ? [...productionGroups]
    : [...developmentGroups];
  const index = knownGroups.indexOf(groupName);
  return index > -1;
};

// TODO: Unify messaging via some template system
// TODO: Re-send invite when we know a user is in system but not using /start workflow
const userNotKnownErrorMessage = userName => {
  const joinLink = "https://languagelearners.club";
  return `User ${userName} is not identified. You need to join ${joinLink} before using LingoParrot or please click the invitation link from the invitation email if you have it.`;
};

export const inviteUserViaEmail = ({ email, invitationLink }) => {
  // TODO: Separate email bodies into a concept of "email templates".
  // They shouldn't be scattered all over the code. Maybe https://heml.io/
  // TODO: The community link is German only, maybe it should open a link that has links to all communities
  // TODO: This community link is not personalized i.e. user can share it with anyone
  sendMail({
    email,
    subject: `You have been invited to join Language Learners Club ✅`,
    body: `
          Please use this <a href='${invitationLink}'>link</a> to get started with LingoParrot. 

          Please join the German community using this <a href='https://t.me/joinchat/DGq5gw15zpNHPDKMO6-c3A'>link</a>

          P.S. This requires a telegram account. 
          `
  });
};
