import * as dotenv from "dotenv";
import * as Telegraf from "telegraf";
import * as AWS from "aws-sdk";
// import * as fs from "fs";

const uuidv4 = require("uuid/v4");
// const mime = require("mime-types");
const mime = require("buffer-type");

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
const speak = async (sourceText, languageCode = "de-DE") => {
  const germanVoiceId = "Vicki";
  const defaultVoiceId = germanVoiceId;
  const voiceIdLanguageCodeMap = {
    "de-DE": defaultVoiceId
  };
  try {
    const data = await speechAPI
      .synthesizeSpeech({
        Text: sourceText,
        LanguageCode: "de-DE",
        OutputFormat: "mp3",
        VoiceId: voiceIdLanguageCodeMap["de-DE"] || defaultVoiceId
      })
      .promise();
    if (!data || !(data.AudioStream instanceof Buffer)) {
      throw new Error("Failed to synthesize");
    }
    // fs.writeFileSync("voice.mp3", data.AudioStream);
    return data.AudioStream;
  } catch (e) {
    throw new Error(`Failed to synthesize: ${e.toString()}`);
  }
};

const makeInlineQueryResultArticle = ({
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
    thumb_url:
      "https://lingoparrot.languagelearners.club/assets/images/image01.jpg?v34762461586451"
  };
};

const translateAPI = new AWS.Translate({
  region: "us-east-1",
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_KEY_ID,
  apiVersion: "2017-07-01"
});

const speechAPI = new AWS.Polly({
  region: "us-east-1",
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_KEY_ID,
  signatureVersion: "v4"
});

const S3API = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_KEY_ID
  // params: {
  //   Bucket: `divyendusingh/LingoParrot/${process.env.NODE_ENV}`
  // }
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
  const query = ctx.inlineQuery.query.trim();
  ctx.inlineQuery.query.trim();
  console.log(`Inline query ${query} from ${ctx.from.username}`);

  if (!isKnownUser(ctx.from.username)) {
    ctx.answerInlineQuery([
      makeInlineQueryResultArticle({
        title: "Join LanguageLearners",
        description: "Unidentified user",
        message: userNotKnownErrorMessage(ctx.from.username),
        url: "https://lingoparrot.languagelearners.club"
      })
    ]);
    return;
  }

  try {
    const data = await translate(query, "auto", "de");

    const voice = await speak(data, "de-DE");
    const voiceFile = await S3API.upload({
      Key: `${uuidv4()}.mp3`,
      ACL: "public-read",
      Body: voice,
      ContentLength: voice.byteLength,
      ContentType: mime(voice),
      Bucket: `divyendusingh/LingoParrot/${process.env.NODE_ENV}`
    }).promise();

    const result = [
      makeInlineQueryResultArticle({
        title: data,
        description: "Text",
        message: `${data} (${query})`
      }),
      {
        type: "audio",
        id: uuidv4(),
        audio_url: voiceFile.Location,
        title: data,
        caption: `${data} (${query})`
      }
    ];
    ctx.answerInlineQuery(result);
  } catch (e) {
    ctx.answerInlineQuery([
      makeInlineQueryResultArticle({
        title: "Error",
        description: e.toString(),
        message: e.toString()
      })
    ]);
  }
});

bot.on("text", async ctx => {
  const query = ctx.message.text.trim();
  console.log(`Text ${query} from ${ctx.from.username}`);

  if (!isKnownUser(ctx.from.username)) {
    ctx.reply(userNotKnownErrorMessage(ctx.from.username));
    return;
  }

  try {
    const data = await translate(query, "auto", "de");
    ctx.reply(data);
    const voice = await speak(data, "de-DE");
    ctx.replyWithAudio({
      source: voice
    });
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
