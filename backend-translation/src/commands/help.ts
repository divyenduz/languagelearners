export const addHelpCommand = bot => {
  bot.help(ctx =>
    ctx.reply(
      "I will help you learn a new language by echoing you in that language. Simple right."
    )
  );
};
