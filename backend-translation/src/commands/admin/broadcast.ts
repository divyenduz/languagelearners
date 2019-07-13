import { isAdmin } from "../../user";

import { prisma } from "../../generated/prisma-client";

export const addBroadcastCommand = bot => {
  bot.command("broadcast", async ctx => {
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
};
