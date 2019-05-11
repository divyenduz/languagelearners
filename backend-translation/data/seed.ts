import { prisma } from "../src/generated/prisma-client";

// TODO: Unify environment with middleware.
console.log(`Environment ${process.env.NODE_ENV}`);
const production = process.env.NODE_ENV === "production" ? true : false;
const debug = process.env.DEBUG || !production;

async function run() {
  const user = await prisma.createUser({
    email: "divyendu.z@gmail.com",
    type: "ADMIN",
    plan: "GUEST",
    telegram_id: "",
    telegram_chat_id: ""
  });

  const invitationLink = `https://telegram.me/LingoParrot${
    production ? "" : "Dev"
  }Bot?start=${user.id}`;

  console.log(`Please join LLC using this link ${invitationLink}`);
}

run();
