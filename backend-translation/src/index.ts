import * as dotenv from "dotenv";
import * as Telegraf from "telegraf";
import * as Mixpanel from "mixpanel";
import { prisma } from "./generated/prisma-client";

// import { transcribe } from "./future/transcribe";
import { addBotAccess, isAdmin, inviteUserViaEmail } from "./user";
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
  moveTelegramFileToS3,
  sendMail
} from "./wrapper";
import { transcribe } from "./future/transcribe";

dotenv.config();

// TODO: Unify environment with middleware.
console.log(`Environment ${process.env.NODE_ENV}`);
const production = process.env.NODE_ENV === "production" ? true : false;
const debug = process.env.DEBUG || !production;

const uuidv4 = require("uuid/v4");
const bot = new Telegraf(process.env.BOT_TOKEN);
const mixpanel = Mixpanel.init(process.env.MIXPANEL_TOKEN);
if (process.env.MIXPANEL_TOKEN) {
  if (debug) {
    console.log("using mixpanel");
  }
  bot.use((ctx, next) => {
    ctx.mixpanel = mixpanel;
    return next();
  });
}
addBotManners(bot);
addBotAccess(bot);

const featureFlags = {
  inline: {
    botSpeech: false,
    botTranscribe: false
  },
  // TODO: Move commands to separate code namespace!
  // Not all commands belong to this one file
  command: {
    botSpeech: true,
    botTranscribe: false
  },
  echo: {
    botSpeech: false,
    botTranscribe: false
  }
};

const languageMap = {
  en: "en-US",
  de: "de-DE"
};

if (featureFlags.echo.botTranscribe) {
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

// TODO:  Move events to separate files for better code readability i.e. less code
bot.on("inline_query", async ctx => {
  const query = ctx.inlineQuery.query.trim();

  try {
    const dominantLanguage = await comprehend(query);
    const targetLanguage = dominantLanguage === "de" ? "en" : "de";
    if (debug) {
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
    if (featureFlags.inline.botSpeech) {
      const voice = await speech(data, languageMap[targetLanguage]);
      const fileUrl = await upload({
        name: `${uuidv4()}.ogg`,
        buffer: voice,
        folder: `polly`,
        type: `audio/ogg`
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

    ctx.answerInlineQuery(result, {
      is_personal: true,
      cache_time: 0
    });
  } catch (e) {
    console.log(e.toString());
  }
});

if (featureFlags.command.botSpeech) {
  bot.command(
    [
      "speak",
      `speak@LingoParrot${production ? "" : "Dev"}Bot`,
      "speakt",
      `speakt@LingoParrot${production ? "" : "Dev"}Bot`
    ],
    async ctx => {
      const useTranslation =
        (ctx.message.text as string).indexOf("speakt") > -1 ? true : false;
      const query = ctx.message.text
        .replace(`@LingoParrot${production ? "" : "Dev"}Bot`, "")
        .replace("/speakt", "")
        .replace("/speak", "")
        .trim();
      try {
        const dominantLanguage = await comprehend(query);
        const targetLanguage = dominantLanguage === "de" ? "en" : "de";
        const useLanguage = useTranslation ? targetLanguage : dominantLanguage;
        if (debug) {
          console.log(
            { query },
            { dominantLanguage },
            { targetLanguage },
            { useLanguage }
          );
        }
        const data = useTranslation
          ? await translate(query, dominantLanguage, useLanguage)
          : query;
        const voice = await speech(data, languageMap[useLanguage]);
        ctx.replyWithVoice({
          source: voice
        });
      } catch (e) {
        console.log(e.toString());
      }
    }
  );
}

bot.command("adduser", async ctx => {
  if (await isAdmin(ctx.from.id)) {
    const query = ctx.message.text.replace("/adduser", "").trim();
    const existingUser = await prisma.user({
      email: query
    });
    if (existingUser) {
      if (existingUser.plan !== "PAST") {
        ctx.reply(
          `User with email ${existingUser.email}, already exists with plan ${
            existingUser.plan
          }`
        );
      } else {
        const user = await prisma.updateUser({
          where: {
            email: query
          },
          data: {
            plan: "GUEST",
            source_language: "AUTO",
            target_language: "DE"
          }
        });
        const invitationLink = `https://telegram.me/LingoParrot${
          production ? "" : "Dev"
        }Bot?start=${user.id}`;

        inviteUserViaEmail({
          email: query,
          invitationLink
        });

        ctx.reply(
          `Invitation link ${invitationLink} sent to user's email address ${query}`
        );
      }
    } else {
      // TODO: Simply repeated code from this if/else block
      const user = await prisma.createUser({
        email: query,
        plan: "GUEST",
        source_language: "AUTO",
        target_language: "DE"
      });

      const invitationLink = `https://telegram.me/LingoParrot${
        production ? "" : "Dev"
      }Bot?start=${user.id}`;

      inviteUserViaEmail({
        email: query,
        invitationLink
      });

      ctx.reply(
        `Invitation link ${invitationLink} sent to user's email address ${query}`
      );
    }
  } else {
    console.log(`Admin command from non-admin user ${ctx.from.username}`);
  }
});
bot.command("removeuser", async ctx => {
  if (await isAdmin(ctx.from.id)) {
    const query = ctx.message.text.replace("/removeuser", "").trim();
    const existingUser = await prisma.user({
      email: query
    });
    if (!existingUser) {
      ctx.reply(`User with email id ${query}, does not exists`);
    } else if (existingUser.plan === "PAST") {
      ctx.reply(`User with email id ${query}, is already in PAST plan`);
    } else {
      const user = await prisma.updateUser({
        where: {
          id: existingUser.id
        },
        data: {
          plan: "PAST"
        }
      });
      ctx.reply(`User with email ${user.email} moved to plan PAST`);
    }
  } else {
    console.log(`Admin command from non-admin user ${ctx.from.username}`);
  }
});
bot.command("listusers", async ctx => {
  if (await isAdmin(ctx.from.id)) {
    const users = await prisma.users();
    ctx.reply(
      users
        .map(user => {
          return `
Email: ${user.email}
Chat ID: ${user.telegram_chat_id}
Plan: ${user.plan}
Type: ${user.type}
          `;
        })
        .join("--------------\n")
    );
  } else {
    console.log(`Admin command from non-admin user ${ctx.from.username}`);
  }
});
bot.command("broadcast", async ctx => {
  console.log({ admin: await isAdmin(ctx.from.id) });
  if (await isAdmin(ctx.from.id)) {
    const query = ctx.message.text.replace("/broadcast", "").trim();
    const users = await prisma.users();
    users.filter(user => user.telegram_chat_id).forEach(user => {
      ctx.telegram.sendMessage(user.telegram_chat_id, query);
    });
  } else {
    console.log(`Admin command from non-admin user ${ctx.from.username}`);
  }
});

bot.on("edited_message", async ctx => {
  const query = ctx.editedMessage.text.trim();
  try {
    const dominantLanguage = await comprehend(query);
    const targetLanguage = dominantLanguage === "de" ? "en" : "de";
    if (debug) {
      console.log({ query }, { dominantLanguage });
    }
    const data = await translate(query, dominantLanguage, targetLanguage);

    ctx.telegram.editMessageText(
      ctx.editedMessage.chat.id,
      // This will only work if bot's message is next of user message
      ctx.editedMessage.message_id + 1,
      ``, // Inline message ID. Fill it later.
      data
    );
  } catch (e) {
    console.log(e.toString());
  }
});

bot.on("text", async ctx => {
  const query = ctx.message.text.trim();

  try {
    const dominantLanguage = await comprehend(query);
    const targetLanguage = dominantLanguage === "de" ? "en" : "de";
    if (debug) {
      console.log({ query }, { dominantLanguage });
    }
    const data = await translate(query, dominantLanguage, targetLanguage);
    ctx.reply(data);
  } catch (e) {
    console.log(e.toString());
  }
});

// bot.startPolling();

module.exports.handler = (event, ctx, callback) => {
  if (event.httpMethod === "GET") {
    // For health checks
    callback(null, {
      statusCode: 200,
      body: "OK"
    });
    return;
  }
  const tmp = JSON.parse(event.body);
  bot.handleUpdate(tmp);
  callback(null, {
    statusCode: 200,
    body: "DONE"
  });
};
