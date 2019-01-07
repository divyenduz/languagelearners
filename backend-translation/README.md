### Setup

Built with [telegraf](http://telegraf.js.org/#/), [Telegram Bot API](https://core.telegram.org/bots/api) and <3

### Run

Setup `BOT_TOKEN` and AWS credentials in `.env` file.

To setup a webhook for a bot, run the following
`yarn run set-webhook <env to set> $BOT_TOKEN` // After `source .env` or hardcode the value.

```
nodemon index.js
```

### Deploy

`sls deploy`

Current known URL: https://t1bfb781ya.execute-api.us-east-1.amazonaws.com/dev/

### Resources

* https://telegraf.js.org/#/

* https://core.telegram.org/bots/api#inlinequeryresult

* https://aws.amazon.com/translate/pricing/
* https://docs.aws.amazon.com/translate/latest/dg/API_TranslateText.html
* https://docs.aws.amazon.com/translate/latest/dg/pairs.html
