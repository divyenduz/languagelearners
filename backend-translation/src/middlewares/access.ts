import { makeInlineQueryResultArticle } from "../message";
import { isKnownUser, userNotKnownErrorMessage, isKnownGroup } from "../user";

export const accessMiddleware = (ctx, next) => {
  if (ctx.inlineQuery && !isKnownUser(ctx.from.id)) {
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
    !isKnownUser(ctx.message.from.id)
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
};
