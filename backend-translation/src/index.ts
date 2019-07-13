import * as dotenv from "dotenv";
import * as Telegraf from "telegraf";

import {
  makeInlineQueryResultArticle,
  makeInlineQueryResultVoice
} from "./message";

import {
  translate,
  speech,
  upload,
  comprehend,
  moveTelegramFileToS3
} from "./wrapper";
import { FEATURE_FLAGS } from "./globals";

import { transcribe } from "./future/transcribe";

import {
  mixpanelMiddleware,
  environmentMiddleware,
  accessMiddleware
} from "./middlewares";

import {
  addStartCommand,
  addHelpCommand,
  addSpeakCommand,
  addAddUserCommand,
  addRemoveUserCommand,
  addListUsersCommand,
  addBroadcastCommand
} from "./commands";

dotenv.config();

const uuidv4 = require("uuid/v4");
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(environmentMiddleware);
bot.use(mixpanelMiddleware);

// Start command happens before access control
addStartCommand(bot);

bot.use(accessMiddleware);

addHelpCommand(bot);
addAddUserCommand(bot);
addRemoveUserCommand(bot);
addListUsersCommand(bot);
addBroadcastCommand(bot);

// TODO: Other languages are coming
// TODO: Unify language maps
const languageMap = {
  en: "en-US",
  de: "de-DE"
};

if (FEATURE_FLAGS.echo.botTranscribe) {
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
      if (ctx.environment.debug) {
        console.log({ voiceFileS3Url });
      }
      const transcription = await transcribe(jobName, voiceFileS3Url);
      ctx.reply(transcription);
    } catch (e) {
      console.log(e.toString());
    }
  });
}

// TODO:  Move events to separate files for better code readability i.e. less code
bot.on("inline_query", async ctx => {
  const query = ctx.inlineQuery.query.trim();

  try {
    const dominantLanguage = await comprehend(query);
    const targetLanguage = dominantLanguage === "de" ? "en" : "de";
    if (ctx.environment.debug) {
      console.log({ query }, { dominantLanguage });
    }
    const data = await translate(query, dominantLanguage, targetLanguage);

    // TODO: Can this type cast be removed
    let result: Array<any> = [
      makeInlineQueryResultArticle({
        title: data,
        description: "Text",
        message: `${data} (${query})`
      })
    ];
    if (ctx.FEATURE_FLAGS.inline.botSpeech) {
      const voice = await speech(data, languageMap[targetLanguage]);
      const fileUrl = await upload({
        name: `${uuidv4()}.ogg`,
        buffer: voice,
        folder: `polly`,
        type: `audio/ogg`
      });
      if (debug) {
        console.log({ fileUrl });
      }
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

    ctx.answerInlineQuery(result, {
      is_personal: true,
      cache_time: 0
    });
  } catch (e) {
    console.log(e.toString());
  }
});

if (FEATURE_FLAGS.command.botSpeech) {
  addSpeakCommand(bot);
}

bot.on("text", async ctx => {
  const query = ctx.message.text.trim();

  try {
    const dominantLanguage = await comprehend(query);
    const targetLanguage = dominantLanguage === "de" ? "en" : "de";
    if (ctx.environment.debug) {
      console.log({ query }, { dominantLanguage });
    }
    const data = await translate(query, dominantLanguage, targetLanguage);
    ctx.reply(data);
  } catch (e) {
    console.log(e.toString());
  }
});

module.exports.handler = (event, ctx, callback) => {
  if (event.httpMethod === "GET") {
    // For health checks
    callback(null, {
      statusCode: 200,
      body: "OK"
    });
    return;
  }
  bot.handleUpdate(JSON.parse(event.body));
  callback(null, {
    statusCode: 200,
    body: "OK"
  });
};
