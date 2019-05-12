import { Mixpanel } from "mixpanel";
import { prisma } from "../generated/prisma-client";

const uuidv4 = require("uuid/v4");

// TODO: Unify environment with middleware.
console.log(`Environment ${process.env.NODE_ENV}`);
const production = process.env.NODE_ENV === "production" ? true : false;
const debug = process.env.DEBUG || !production;

export const addBotManners = bot => {
  bot.use((ctx, next) => {
    // TODO: Unify logging in its own middleware.
    const from =
      (ctx.message && ctx.message.from) ||
      (ctx.inlineQuery && ctx.inlineQuery.from && ctx.inlineQuery.from) ||
      (ctx.editedMessage && ctx.editedMessage.from);

    const query =
      (ctx.message && ctx.message.text.trim()) ||
      (ctx.inlineQuery && ctx.inlineQuery.query.trim()) ||
      (ctx.editedMessage && ctx.editedMessage.text.trim());

    console.log(
      `${ctx.updateType} - ${query} from user ${from && from.username}`
    );

    if (ctx.mixpanel && from) {
      const mixpanel: Mixpanel = ctx.mixpanel;
      if (debug) {
        console.log(`metrics - tracking user stats for user: ${from.username}`);
      }
      mixpanel.people.set(from.username, {
        $first_name: from.first_name,
        $last_name: from.last_name,
        plan: "premium"
      });
      mixpanel.track("received_message", {
        $distinct_id: from.username
      });
      mixpanel.people.increment(from.username, "messages", 1);
      mixpanel.people.increment(from.username, "characters", query.length);
    }

    const start = new Date();
    return next(ctx).then(() => {
      const ms = +new Date() - +start;
      console.log("Response time %sms", ms);
    });
  });

  bot.start(async ctx => {
    const text = ctx.message.text;
    const id = text.replace("/start", "").trim();
    const existingUser = prisma.user({
      id
    });

    if (debug) {
      console.log({ message: ctx.message });
    }

    if (!existingUser) {
      ctx.reply(`User with id ${id} does not exist`);
    } else {
      const user = await prisma.updateUser({
        where: {
          id
        },
        data: {
          telegram_id: ctx.message.from.id.toString(),
          telegram_chat_id: ctx.message.chat.id.toString()
        }
      });

      // TODO: The community link is German only, maybe it should open a link that has links to all communities
      // TODO: This community link is not personalized i.e. user can share it with anyone
      ctx.reply(
        `Welcome ${user.email} to LingoParrot from LanguageLearners.club
        
        Please join the German community using this <a href='https://t.me/joinchat/DGq5gw15zpNHPDKMO6-c3A'>link</a>
        `
      );
    }
  });
  bot.help(ctx =>
    ctx.reply(
      "I will help you learn a new language by echoing you in that language. Simple right."
    )
  );
};

export const makeInlineQueryResultArticle = ({
  title,
  description,
  message,
  url = ""
}) => {
  return {
    type: "article",
    id: uuidv4(),
    title: title,
    description: description,

    input_message_content: {
      message_text: message
    },
    url: url,
    thumb_url: "https://s3.amazonaws.com/lingoparrot/logo.png"
  };
};

export const makeInlineQueryResultVoice = ({ title, caption, voiceUrl }) => {
  return {
    type: "voice",
    id: uuidv4(),
    voice_url: voiceUrl,
    title: title,
    caption: caption
  };
};

export const detectViaBotText = text => {
  // https://regex101.com/r/U15Tkv/1
  const regex = /^(.*?)+\(.*?\)$/gm;
  return regex.exec(text) !== null;
};
