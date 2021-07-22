import { PrismaClient } from '@prisma/client'

import { Razorpay } from './types/payment'
import { inviteUserViaEmail, makeInvitationLink } from './user'

const client = new PrismaClient()

console.log(`Environment ${process.env.NODE_ENV}`)
const production = process.env.NODE_ENV === 'production' ? true : false

const handleSubscriptionChargedEvent = async (body: Razorpay.Event) => {
  const existingUser = await client.user.findUnique({
    where: {
      email: body.payload.payment.entity.email,
    },
  })

  if (existingUser) {
    const payment = await client.payment.create({
      data: {
        amount: body.payload.payment.entity.amount,
        provider_subscription_id: body.payload.subscription.entity.id,
        provider_payment_id: body.payload.payment.entity.id,
        User: {
          connect: {
            id: existingUser.id,
          },
        },
      },
    })
    return {
      statusCode: 200,
      body: JSON.stringify(payment),
    }
  } else {
    const user = await client.user.create({
      data: {
        plan: 'INTRO_5', // TODO: Unhardcode this
        email: body.payload.payment.entity.email,
        source_language: 'EN',
        target_language: 'DE', // TODO: Ask this earlier in the flow, maybe while payment?
        payment: {
          create: {
            provider_subscription_id: body.payload.subscription.entity.id,
            provider_payment_id: body.payload.payment.entity.id,
            amount: body.payload.payment.entity.amount / 100, // Convert cents to USD
          },
        },
      },
    })

    const invitationLink = makeInvitationLink({
      id: user.id,
      production,
    })

    inviteUserViaEmail({
      email: user.email,
      invitationLink,
    })

    return {
      statusCode: 200,
      body: JSON.stringify({
        ...user,
        invitation: `https://telegram.me/LingoParrot${
          production ? 'Dev' : ''
        }Bot?start=${user.id}`,
      }),
    }
  }
}

const handleOtherEvents = async (body: Razorpay.Event) => {
  return {
    statusCode: 200,
    body: `Event Received: ${body.event}, ignoring`,
  }
}

module.exports.handler = async (event, ctx) => {
  if (event.httpMethod === 'GET') {
    // For health checks
    return {
      statusCode: 200,
      body: 'OK - payment',
    }
  }
  const body: Razorpay.Event = JSON.parse(event.body)

  await client.telemetry.create({
    data: {
      type: 'PROVIDER_PAYMENT_EVENT',
      telemetry_key: body.payload.payment.entity.id,
      filename: `${Date.now()}-${body.event}`,
      payload: JSON.stringify(body),
    },
  })

  if (body.event === 'subscription.charged') {
    return await handleSubscriptionChargedEvent(body)
  } else {
    return await handleOtherEvents(body)
  }
}