import {makeInlineQueryResultArticle} from '../message';

const production = process.env.NODE_ENV === 'production' ? true : false;

const betaTesters = [
  'divyenduz',
  'nilanm',
  'rusrushal13',
  'yuvika01',
  'Lukastrong5',
  'wilbertliu',
];
const knownUsers = production ? [...betaTesters] : [...betaTesters];

export const addBotAccess = bot => {
  bot.use((ctx, next) => {
    if (ctx.inlineQuery && !isKnownUser(ctx.from.username)) {
      console.log(`inlineQuery but unknown user`);
      ctx.answerInlineQuery(
        [
          makeInlineQueryResultArticle({
            title: 'Join LanguageLearners to use the LingoParrot bot.',
            description: 'https://languagelearners.club',
            message: userNotKnownErrorMessage(ctx.from.username),
          }),
        ],
        {
          is_personal: true,
          cache_time: 0,
        },
      );
      return;
    }

    // Private access of bot requires access.
    if (
      ctx.message &&
      ctx.message.from &&
      ctx.message.chat &&
      ctx.message.chat.type === 'private' &&
      !isKnownUser(ctx.message.from.username)
    ) {
      console.log(`private chat but but unknown user`);
      ctx.reply(userNotKnownErrorMessage(ctx.from.username));
      return;
    }

    // Bot echoes in group for everyone.
    next();
  });
};

const isKnownUser = userName => {
  const index = knownUsers.indexOf(userName);
  return index > -1;
};
const userNotKnownErrorMessage = userName => {
  const joinLink = 'https://languagelearners.club';
  return `User ${userName} is not indentified. You need to join ${joinLink} before using LingoParrot.`;
};
