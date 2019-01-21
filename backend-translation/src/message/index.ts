const uuidv4 = require("uuid/v4");

// TODO: Unify environment with middleware.
console.log(`Environment ${process.env.NODE_ENV}`);
const production = process.env.NODE_ENV === "production" ? true : false;
const debug = process.env.DEBUG || !production;

export const addBotManners = bot => {
  bot.use((ctx, next) => {
    // TODO: Unify logging in its own middleware.
    const from =
      (ctx.message && ctx.message.from && ctx.message.from) ||
      (ctx.inlineQuery && ctx.inlineQuery.from && ctx.inlineQuery.from);
    const query =
      (ctx.message && ctx.message.text.trim()) ||
      (ctx.inlineQuery && ctx.inlineQuery.query.trim());
    console.log(`${ctx.updateType} - ${query} from user ${from.username}`);

    if (ctx.mixpanel) {
      if (debug) {
        console.log(`metrics - tracking user stats`);
      }
      ctx.mixpanel.track("received");
      // console.log(ctx.mixpanel.client);
      console.log(from.username);
      // ctx.mixpanel.client.alias(from.username);
      // ctx.mixpanel.client.identify(from.username);
      ctx.mixpanel.people.increment("messages", 1);
      ctx.mixpanel.people.increment("characters", query.length);
    }

    const start = new Date();
    return next(ctx).then(() => {
      const ms = +new Date() - +start;
      console.log("Response time %sms", ms);
    });
  });

  bot.start(ctx =>
    ctx.reply("Welcome to LingoParrot from LanguageLearners.club")
  );
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
