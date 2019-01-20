import * as dotenv from "dotenv";
import * as Telegraf from "telegraf";

// import { transcribe } from "./future/transcribe";
import { addBotAccess } from "./user";
import {
  makeInlineQueryResultArticle,
  makeInlineQueryResultVoice,
  addBotManners
  // detectViaBotText
} from "./message";

import {
  translate,
  speech,
  upload,
  comprehend,
  moveTelegramFileToS3
} from "./wrapper";
import { transcribe } from "./future/transcribe";

dotenv.config();

console.log(`Environment ${process.env.NODE_ENV}`);
const production = process.env.NODE_ENV === "production" ? true : false;
const debug = process.env.DEBUG || !production;

const uuidv4 = require("uuid/v4");
const bot = new Telegraf(process.env.BOT_TOKEN);
addBotManners(bot);
addBotAccess(bot);

const featureFlags = {
  botSpeech: false,
  botTranscribe: false
};

if (featureFlags.botTranscribe) {
  bot.on("voice", async ctx => {
    const query = ctx.message.voice;
    console.log(`Voice ${query.file_id} from ${ctx.from.username}`);
    const jobName = uuidv4();
    console.log(`JobName: ${jobName}`);
    try {
      const hardcodedFileUrl = "https://s3.amazonaws.com/lingoparrot/voice.mp3";
      const voiceFileS3Url =
        hardcodedFileUrl ||
        (await moveTelegramFileToS3(query, `${jobName}.ogg`));
      if (debug) {
        console.log({ voiceFileS3Url });
      }
      const transcription = await transcribe(jobName, voiceFileS3Url);
      ctx.reply(transcription);
    } catch (e) {
      console.log(e.toString());
    }
  });
}

bot.on("inline_query", async ctx => {
  const query = ctx.inlineQuery.query.trim();
  console.log(`Inline query ${query} from ${ctx.from.username}`);

  try {
    const dominantLanguage = await comprehend(query);
    const targetLanguage = dominantLanguage === "de" ? "en" : "de";
    if (debug) {
      console.log({ query }, { dominantLanguage });
    }
    const data = await translate(query, "auto", targetLanguage);

    // TODO: Can this type cast be removed
    let result: Array<any> = [
      makeInlineQueryResultArticle({
        title: data,
        description: "Text",
        message: `${data} (${query})`
      })
    ];
    if (featureFlags.botSpeech) {
      const voice = await speech(data, "de-DE");
      const fileUrl = await upload({
        name: `${uuidv4()}.ogg`,
        buffer: voice,
        folder: `polly`
      });

      result = [
        ...result,
        ...[
          makeInlineQueryResultVoice({
            title: data,
            caption: `${data} (${query})`,
            voiceUrl: fileUrl
          })
        ]
      ];
    }

    ctx.answerInlineQuery(result);
  } catch (e) {
    console.log(e.toString());
  }
});

bot.on("text", async ctx => {
  const query = ctx.message.text.trim();
  console.log(`Text ${query} from ${ctx.from.username}`);

  try {
    const dominantLanguage = await comprehend(query);
    const targetLanguage = dominantLanguage === "de" ? "en" : "de";
    if (debug) {
      console.log({ query }, { dominantLanguage });
    }
    const data = await translate(query, "auto", targetLanguage);
    ctx.reply(data);

    if (featureFlags.botSpeech) {
      const voice = await speech(data, "de-DE");
      ctx.replyWithVoice({
        source: voice
      });
    }
  } catch (e) {
    console.log(e.toString());
  }
});

// bot.startPolling();

module.exports.handler = (event, ctx, callback) => {
  const tmp = JSON.parse(event.body);
  bot.handleUpdate(tmp);
  callback(null, {
    statusCode: 200,
    body: "Working"
  });
};
