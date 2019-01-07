import * as dotenv from "dotenv";
import * as Telegraf from "telegraf";
import * as AWS from "aws-sdk";

dotenv.config();

console.log(`Environment ${process.env.NODE_ENV}`);

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
          input_message_content: {
            message_text: data && data.TranslatedText
          }
        }
      ];
      ctx.answerInlineQuery(result);
    }
  );
});

bot.on("text", ctx => {
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

module.exports.handler = (event, context, callback) => {
  const tmp = JSON.parse(event.body);
  bot.handleUpdate(tmp);
  return callback(null, {
    statusCode: 200,
    body: "Working"
  });
};
