export namespace Razorpay {
  type ContainsKey = 'subscription' | 'payment' | 'order' | 'invoice'

  type SubscriptionStatus = 'active'
  type PaymentStatus =
    | 'created'
    | 'captured'
    | 'authorized'
    | 'refunded'
    | 'failed'

  type PaymentMethod = 'card' | 'netbanking' | 'wallet' | 'emi' | 'upi'

  type CardNetwork = 'MasterCard'
  type CardType = 'credit' | 'debit'

  type Type = 1
  enum Currency {
    USD,
  }

  interface SubscriptionEntity {
    entity: {
      id: string
      entity: 'subscription'
      plan_id: string
      customer_id: string
      status: SubscriptionStatus
      type: Type
      current_start: number
      current_end: number
      ended_at: number | null
      quantity: number
      notes: string[]
      charge_at: number
      start_at: number
      end_at: number
      auth_attempts: number
      total_count: number
      paid_count: number
      customer_notify: boolean
      created_at: number
      expire_by: number | null
      short_url: string | null
      has_scheduled_changes: boolean
      change_scheduled_at: number | null
      source: string | null
      remaining_count: number
    }
  }

  interface Card {
    id: string
    entity: 'card'
    name: string
    last4: string
    network: CardNetwork
    type: CardType
    issuer: string | null
    international: boolean
    emi: boolean
    expiry_month: number
    expiry_year: number
  }

  interface PaymentEntity {
    entity: {
      id: string
      entity: 'payment'
      amount: number
      currency: Currency
      status: PaymentStatus
      order_id: string
      invoice_id: string
      international: boolean
      method: PaymentMethod
      amount_refunded: number
      amount_transferred: number
      refund_status: 'null' | 'partial' | 'full'
      captured: number | boolean // Because subscription.charged and payment.captured 👉 https://www.diffchecker.com/7h2635VM
      description: string
      card_id: string
      card: Card
      bank: string | null
      wallet: string | null
      vpa: string | null
      email: string
      contact: string
      customer_id: string
      notes: string[]
      fee: number
      tax: number
      error_code: string | null
      error_description: string | null
      created_at: number
    }
  }

  interface OrderEntity {
    entity: {
      id: string
      entity: 'order'
      amount: number
      amount_paid: number
      amount_due: number
      currency: Currency
      receipt: string | null
      offer_id: null
      offers: { entity: 'collection'; count: 0; items: [] }
      status: 'created' | 'attempted' | 'paid'
      attempts: number
      notes: string[]
      created_at: number
    }
  }

  interface Customer {
    id: string
    name: string | null
    email: string
    contact: string
    gstin: string | null
    billing_address: string | null
    shipping_address: string | null
    customer_name: string | null
    customer_email: string
    customer_contact: string
  }

  interface InvoiceEntity {
    entity: {
      id: string
      entity: 'invoice'
      receipt: null
      invoice_number: null
      customer_id: string
      customer_details: Customer
      order_id: string
      subscription_id: string
      payment_id: string
      status: 'issued' | 'paid' // TODO: Find other possible values
      expire_by: number | null
      issued_at: number
      paid_at: number
      cancelled_at: number | null
      expired_at: number | null
      sms_status: 'pending' | 'sent' | null
      email_status: 'pending' | 'sent' | null
      date: number
      terms: string | null
      partial_payment: boolean
      gross_amount: number
      tax_amount: number
      taxable_amount: number
      amount: number
      amount_paid: number
      amount_due: number
      first_payment_min_amount: number | null
      currency: Currency
      currency_symbol: '$'
      description: string | null
      notes: string[]
      comment: string | null
      short_url: string
      view_less: boolean
      billing_start: number
      billing_end: number
      type: 'invoice'
      group_taxes_discounts: boolean
      supply_state_code: string | null
      subscription_status: string | null
      user_id: string | null
      created_at: number
      idempotency_key: string | null
    }
  }

  type PaymentEventType =
    | 'payment.authorized' // payment
    | 'payment.captured' // payment
  type OrderEventType = 'order.paid' // payment, order
  type InvoiceEventType = 'invoice.paid' // payment, order, invoice
  type SubscriptionEventType = 'subscription.charged' // subscription, payment

  type EventType =
    | SubscriptionEventType
    | PaymentEventType
    | OrderEventType
    | InvoiceEventType

  export interface Event {
    entity: 'event'
    account_id: string
    event: EventType
    contains: ContainsKey[]
    payload: {
      payment: PaymentEntity
      subscription?: SubscriptionEntity
      order?: OrderEntity
      invoice?: InvoiceEntity
    }
  }
}
