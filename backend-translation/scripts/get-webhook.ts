import * as dotenv from "dotenv";
import * as fetch from "isomorphic-fetch";
import * as arg from "arg";
import * as FormData from "form-data";

const args = arg({
  "--production": Boolean,
  "-p": "--production"
});

const production = args["--production"];

dotenv.config({
  path: production ? ".env.production" : ".env"
});

console.log(`Environment ${process.env.NODE_ENV}`);

if (!process.env.BOT_TOKEN) {
  console.error("Invalid .env, please set BOT_TOKEN");
  process.exit(1);
}

const telegramUrl = `https://api.telegram.org/bot${
  process.env.BOT_TOKEN
}/getWebhookInfo`;

console.log(telegramUrl);

async function main() {
  const data = await fetch(telegramUrl, {
    method: "GET"
  });
  console.log(data.status, await data.json());
}

main();
