## Setup

Built with [telegraf](http://telegraf.js.org/#/), [Telegram Bot API](https://core.telegram.org/bots/api), AWS and ❤️

```
docker build . -t lingoparrot

docker tag lingoparrot:latest 297907245068.dkr.ecr.ap-southeast-1.amazonaws.com/lingoparrot:latest

aws ecr get-login-password --region ap-southeast-1 -- profile admin | docker login --username AWS --password-stdin 297907245068.dkr.ecr.ap-southeast-1.amazonaws.com

docker run -p 3000:3000 --env-file ./.env.local.docker lingoparrot:latest

docker push 297907245068.dkr.ecr.ap-southeast-1.amazonaws.com/lingoparrot:latest
```

---

## Development/Production Workflow

We use a specific dev/production setup. For all the relevant commands, yarn scripts have two variants like:

1.  `yarn run set-webhook`
2.  `yarn run set-webhook-production`

The 1st one uses `.env` and the 2nd one uses `.env.production`. With sensible defaults, I believe that this setup is most convenient for bot development and yields least mistakes. Open to feedback.

---

## Development Setup

Copy `.env_sample` file to `.env` (and `.env.production` for a production setup - details later) and fill the required values.

Run the following commands to start receiving `@<bot-name>` requests on your local machine.

1.  `yarn dev`

- runs the project locally (via `sls offline start`, supports hot realoading).
- creates a tunnel (languagelearnersclub.localtunnel.me) from local to the internet.
- points the bot to local development version (uses `.env` and localtunnel url).

2.  `yarn run watch` - to watch and compile TS to JS.

Generally, I have two versions of the bot i.e. development and production. I point my dev bot to my local setup using the above steps.

---

## Deploy Development

`yarn run deploy` - deploys to Lambda using parameters from `.env`

---

## Deploy Production

`yarn run deploy-production` - deploys to Lambda using parameters from `.env.production`

---

## Resources

- https://telegraf.js.org/#/
- https://core.telegram.org/bots/api#inlinequeryresult
- https://aws.amazon.com/translate/pricing/
- https://docs.aws.amazon.com/translate/latest/dg/API_TranslateText.html
- https://docs.aws.amazon.com/translate/latest/dg/pairs.html
- https://ibb.co/rx3tsGD (Pricing for a conversational app)

---
