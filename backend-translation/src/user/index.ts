import { makeInlineQueryResultArticle } from "../message";

const production = process.env.NODE_ENV === "production" ? true : false;

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
      (!isKnownGroup(ctx.message.chat.title) ||
        !isKnownUser(ctx.message.from.username))
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

const isKnownUser = userName => {
  const developmentUsers = [
    "divyenduz",
    "nilanm",
    "rusrushal13",
    "yuvika01",
    "Lukastrong5",
    "wilbertliu"
  ];
  const productionUsers = []; // TODO: Fill this dynamically once payment workflow is done
  const knownUsers = production
    ? [...productionUsers, ...developmentUsers]
    : [...developmentUsers];
  const index = knownUsers.indexOf(userName);
  return index > -1;
};

const isKnownGroup = groupName => {
  const developmentGroups = ["Development - Language Learners Club"];
  const productionGroups = ["German - Language Learners Club"];
  const knownGroups = production
    ? [...productionGroups]
    : [...developmentGroups];
  const index = knownGroups.indexOf(groupName);
  return index > -1;
};

const userNotKnownErrorMessage = userName => {
  const joinLink = "https://languagelearners.club";
  return `User ${userName} is not indentified. You need to join ${joinLink} before using LingoParrot.`;
};
