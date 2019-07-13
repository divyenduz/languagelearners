import { prisma } from "../src/generated/prisma-client";
import { PRODUCTION } from "../src/globals";

async function run() {
  const user = await prisma.createUser({
    email: "divyendu.z@gmail.com",
    type: "ADMIN",
    plan: "GUEST",
    telegram_id: "",
    telegram_chat_id: ""
  });

  const invitationLink = `https://telegram.me/LingoParrot${
    PRODUCTION ? "" : "Dev"
  }Bot?start=${user.id}`;

  console.log(`Please join LLC using this link ${invitationLink}`);
}

run();
