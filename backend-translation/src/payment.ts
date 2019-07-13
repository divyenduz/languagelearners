import { prisma } from "./generated/prisma-client";

console.log(`Environment ${process.env.NODE_ENV}`);
const production = process.env.NODE_ENV === "production" ? true : false;

module.exports.handler = async (event, ctx, callback) => {
  if (event.httpMethod === "GET") {
    // For health checks
    callback(null, {
      statusCode: 200,
      body: "OK - payment"
    });
    return;
  }
  const body = JSON.parse(event.body);

  const date = new Date(); // TODO: check timezone

  const existingUser = await prisma.user({
    email: body.email
  });

  if (existingUser) {
    const payment = await prisma.createPayment({
      date: date.toISOString(),
      amount: parseFloat(body.amount),
      user: {
        connect: {
          id: existingUser.id
        }
      }
    });
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(payment)
    });
  } else {
    const user = await prisma.createUser({
      plan: "INTRO_5", // TODO: Unhardcode this
      email: body.email,
      source_language: "AUTO",
      target_language: "DE", // TODO: Ask this earlier in the flow, maybe while payment?
      payment: {
        create: {
          date: date.toISOString(),
          amount: parseFloat(body.amount)
        }
      }
    });
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        ...user,
        invitation: `https://telegram.me/LingoParrot${
          production ? "Dev" : ""
        }Bot?start=${user.id}`
      })
    });
  }
};
