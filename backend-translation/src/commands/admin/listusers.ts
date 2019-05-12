import { isAdmin } from "../../user";

import { prisma } from "../../generated/prisma-client";

export const addListUsersCommand = bot => {
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
};
