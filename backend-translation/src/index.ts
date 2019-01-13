import * as dotenv from "dotenv";
import * as Telegraf from "telegraf";
import * as AWS from "aws-sdk";
// import * as fs from "fs";
import * as request from "request-promise-native";
import { sleep } from "sleep";

const fetch = require("isomorphic-fetch");

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
        OutputFormat: "ogg_vorbis",
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

const talkAPI = new AWS.TranscribeService({
  region: "us-east-1",
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_KEY_ID,
  apiVersion: "2017-10-26"
});

const S3API = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_KEY_ID
  // params: {
  //   Bucket: `lingoparrot/${process.env.NODE_ENV}`
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

bot.on("voice", async ctx => {
  const query = ctx.message.voice;
  console.log(`Voice ${query.file_id} from ${ctx.from.username}`);
  const voiceInfoJSON = await fetch(
    `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getFile?file_id=${
      query.file_id
    }`
  );
  const voiceInfo = await voiceInfoJSON.json();
  const hardcodedFile = "https://s3.amazonaws.com/lingoparrot/voice.mp3";
  // const hardcodedFile = null;
  const voiceFile =
    hardcodedFile ||
    `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${
      voiceInfo.result.file_path
    }`;

  const voiceFileStream = await request(voiceFile);

  const jobName = uuidv4();
  try {
    const voiceFileS3 = await S3API.upload({
      Key: `${jobName}.ogg`,
      ACL: "public-read",
      Body: voiceFileStream,
      // ContentLength: voiceFileStream,
      // ContentType: mime(voiceFileStream),
      Bucket: `lingoparrot/transcribe/${process.env.NODE_ENV}`
    }).promise();

    let job = await talkAPI
      .startTranscriptionJob({
        LanguageCode: "en-US",
        // OutputBucketName: `lingoparrot`,
        TranscriptionJobName: jobName,
        MediaFormat: "mp3",
        // MediaSampleRateHertz: sampleRate,
        Media: {
          MediaFileUri: hardcodedFile || voiceFileS3.Location
        }
      })
      .promise();

    while (job.TranscriptionJob.TranscriptionJobStatus === "IN_PROGRESS") {
      sleep(1);
      job = await talkAPI
        .getTranscriptionJob({
          TranscriptionJobName: jobName
        })
        .promise();
    }

    if (job.TranscriptionJob.TranscriptionJobStatus === "COMPLETED") {
      const dataJSON = await fetch(
        job.TranscriptionJob.Transcript.TranscriptFileUri
      );
      const data = await dataJSON.json();
      ctx.reply(
        data.results.transcripts.reduce(
          (acc, i) => `${acc} ${i.transcript}`,
          ""
        )
      );
    } else if (job.TranscriptionJob.TranscriptionJobStatus === "FAILED") {
      ctx.reply(`Failed to transcribe: ${job.TranscriptionJob.FailureReason}`);
    } else {
      console.log({ job });
      ctx.reply(`Unknown job status`);
    }
  } catch (e) {
    ctx.reply(e.toString());
  }
});

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
      Key: `${uuidv4()}.ogg`,
      ACL: "public-read",
      Body: voice,
      ContentLength: voice.byteLength,
      ContentType: mime(voice),
      Bucket: `lingoparrot/polly/${process.env.NODE_ENV}`
    }).promise();

    const result = [
      makeInlineQueryResultArticle({
        title: data,
        description: "Text",
        message: `${data} (${query})`
      }),
      {
        type: "voice",
        id: uuidv4(),
        voice_url: voiceFile.Location,
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
    ctx.replyWithVoice({
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
