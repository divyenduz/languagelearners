import * as dotenv from "dotenv";
import * as Telegraf from "telegraf";
import * as AWS from "aws-sdk";

dotenv.config();

console.log(`Environment ${process.env.NODE_ENV}`);
const production = process.env.NODE_ENV === "production" ? true : false;

const betaTesters = ["divyenduz", "nilanm", "rusrushal13", "yuvika01"];
const knownUsers = production ? [...betaTesters] : [...betaTesters];

const isKnownUser = userName => {
  const index = knownUsers.indexOf(userName);
  return index > -1;
};
const userNotKnownErrorMessage = userName => {
  const joinLink = "https://languagelearners.club";
  return `User ${userName} is not indentified. You need to join ${joinLink} before using LingoParrot.`;
};
const translate = async (
  sourceText,
  sourceLanguageCode = "auto",
  targetLanguageCode = "de"
) => {
  try {
    const data = await translateAPI
      .translateText({
        SourceLanguageCode: sourceLanguageCode,
        TargetLanguageCode: targetLanguageCode,
        Text: sourceText
      })
      .promise();
    if (!data || !data.TranslatedText) {
      throw new Error("Failed to translate");
    }
    return data && data.TranslatedText;
  } catch (e) {
    throw new Error(`Failed to translate: ${e.toString()}`);
  }
};

const translateAPI = new AWS.Translate({
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

bot.on("inline_query", async ctx => {
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

  try {
    const data = await translate(ctx.inlineQuery.query.trim(), "auto", "de");
    const result = [
      {
        type: "article",
        id: "1",
        title: data,
        description: "Text",
        input_message_content: {
          message_text: `${data} (${ctx.inlineQuery.query.trim()})`
        },
        thumb_url:
          "https://lingoparrot.languagelearners.club/assets/images/image01.jpg?v34762461586451"
      }
    ];
    ctx.answerInlineQuery(result);
  } catch (e) {
    ctx.reply(e.toString());
  }
});

bot.on("text", async ctx => {
  console.log(`Text from ${ctx.from.username}`);

  if (!isKnownUser(ctx.from.username)) {
    ctx.reply(userNotKnownErrorMessage(ctx.from.username));
    return;
  }

  try {
    const data = await translate(ctx.message.text.trim(), "auto", "de");
    ctx.reply(data);
  } catch (e) {
    ctx.reply(e.toString());
  }
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
