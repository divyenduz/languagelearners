import * as dotenv from "dotenv";
import * as Telegraf from "telegraf";
import * as AWS from "aws-sdk";

dotenv.config();

console.log(`Environment ${process.env.NODE_ENV}`);
const production = process.env.NODE_ENV === "production" ? true : false;

const betaTesters = ["divyenduz", "nilanm", "rusrushal13", "yuvika01"]
const knownUsers = production
  ? [...betaTesters]
  : [...betaTesters];

const isKnownUser = userName => {
  const index = knownUsers.indexOf(userName);
  return index > -1;
};
const userNotKnownErrorMessage = userName => {
  const joinLink = "https://languagelearners.club";
  return `User ${userName} is not indentified. You need to join ${joinLink} before using LingoParrot.`;
};

const translate = new AWS.Translate({
  region: "us-east-1",
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_KEY_ID,
  apiVersion: "2017-07-01"
});

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use((ctx, next) => {
  const start = new Date();
  return next(ctx).then(() => {
    const ms = +new Date() - +start;
    console.log("Response time %sms", ms);
  });
});

bot.start(ctx => ctx.reply("Welcome to LingoParrot bot"));

bot.help(ctx => ctx.reply("This bot translates stuff"));

bot.on("inline_query", ctx => {
  console.log(`Inline query from ${ctx.from.username}`);

  if (!isKnownUser(ctx.from.username)) {
    ctx.answerInlineQuery([
      {
        type: "article",
        id: "1",
        title: "Join LanguageLearners",
        description: "Unidentified user",
        input_message_content: {
          message_text: userNotKnownErrorMessage(ctx.from.username)
        },
        url: "https://lingoparrot.languagelearners.club",
        thumb_url:
          "https://lingoparrot.languagelearners.club/assets/images/image01.jpg?v34762461586451"
      }
    ]);
    return;
  }

  translate.translateText(
    {
      SourceLanguageCode: "auto",
      TargetLanguageCode: "de",
      Text: ctx.inlineQuery.query.trim()
    },
    (err, data) => {
      if (err || !data || !data.TranslatedText) {
        ctx.reply("Failed to translate");
      }
      const result = [
        {
          type: "article",
          id: "1",
          title: data && data.TranslatedText,
          description: "~~",
          input_message_content: {
            message_text: `${data &&
              data.TranslatedText} (${ctx.inlineQuery.query.trim()})`
          },
          thumb_url:
            "https://lingoparrot.languagelearners.club/assets/images/image01.jpg?v34762461586451"
        }
      ];
      ctx.answerInlineQuery(result);
    }
  );
});

bot.on("text", ctx => {
  console.log(`Text from ${ctx.from.username}`);

  if (!isKnownUser(ctx.from.username)) {
    ctx.reply(userNotKnownErrorMessage(ctx.from.username));
    return;
  }

  translate.translateText(
    {
      SourceLanguageCode: "auto",
      TargetLanguageCode: "de",
      Text: ctx.message.text.trim()
    },
    (err, data) => {
      if (err || !data || !data.TranslatedText) {
        ctx.reply("Failed to translate");
      }
      ctx.reply(data && data.TranslatedText);
    }
  );
});

// bot.startPolling();

module.exports.handler = (event, ctx, callback) => {
  const tmp = JSON.parse(event.body);
  bot.handleUpdate(tmp);
  return callback(null, {
    statusCode: 200,
    body: "Working"
  });
};
