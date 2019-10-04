// Code generated by Prisma (prisma@1.34.8). DO NOT EDIT.
  // Please don't change this file manually but run `prisma generate` to update it.
  // For more information, please read the docs: https://www.prisma.io/docs/prisma-client/

export const typeDefs = /* GraphQL */ `type AggregatePayment {
  count: Int!
}

type AggregateTelemetry {
  count: Int!
}

type AggregateUser {
  count: Int!
}

type BatchPayload {
  count: Long!
}

scalar DateTime

scalar Json

scalar Long

type Mutation {
  createPayment(data: PaymentCreateInput!): Payment!
  updatePayment(data: PaymentUpdateInput!, where: PaymentWhereUniqueInput!): Payment
  updateManyPayments(data: PaymentUpdateManyMutationInput!, where: PaymentWhereInput): BatchPayload!
  upsertPayment(where: PaymentWhereUniqueInput!, create: PaymentCreateInput!, update: PaymentUpdateInput!): Payment!
  deletePayment(where: PaymentWhereUniqueInput!): Payment
  deleteManyPayments(where: PaymentWhereInput): BatchPayload!
  createTelemetry(data: TelemetryCreateInput!): Telemetry!
  updateTelemetry(data: TelemetryUpdateInput!, where: TelemetryWhereUniqueInput!): Telemetry
  updateManyTelemetries(data: TelemetryUpdateManyMutationInput!, where: TelemetryWhereInput): BatchPayload!
  upsertTelemetry(where: TelemetryWhereUniqueInput!, create: TelemetryCreateInput!, update: TelemetryUpdateInput!): Telemetry!
  deleteTelemetry(where: TelemetryWhereUniqueInput!): Telemetry
  deleteManyTelemetries(where: TelemetryWhereInput): BatchPayload!
  createUser(data: UserCreateInput!): User!
  updateUser(data: UserUpdateInput!, where: UserWhereUniqueInput!): User
  updateManyUsers(data: UserUpdateManyMutationInput!, where: UserWhereInput): BatchPayload!
  upsertUser(where: UserWhereUniqueInput!, create: UserCreateInput!, update: UserUpdateInput!): User!
  deleteUser(where: UserWhereUniqueInput!): User
  deleteManyUsers(where: UserWhereInput): BatchPayload!
}

enum MutationType {
  CREATED
  UPDATED
  DELETED
}

interface Node {
  id: ID!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type Payment {
  id: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  provider_subscription_id: String!
  provider_payment_id: String!
  amount: Int!
  user: User!
}

type PaymentConnection {
  pageInfo: PageInfo!
  edges: [PaymentEdge]!
  aggregate: AggregatePayment!
}

input PaymentCreateInput {
  id: ID
  provider_subscription_id: String!
  provider_payment_id: String!
  amount: Int!
  user: UserCreateOneWithoutPaymentInput!
}

input PaymentCreateManyWithoutUserInput {
  create: [PaymentCreateWithoutUserInput!]
  connect: [PaymentWhereUniqueInput!]
}

input PaymentCreateWithoutUserInput {
  id: ID
  provider_subscription_id: String!
  provider_payment_id: String!
  amount: Int!
}

type PaymentEdge {
  node: Payment!
  cursor: String!
}

enum PaymentOrderByInput {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  provider_subscription_id_ASC
  provider_subscription_id_DESC
  provider_payment_id_ASC
  provider_payment_id_DESC
  amount_ASC
  amount_DESC
}

type PaymentPreviousValues {
  id: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  provider_subscription_id: String!
  provider_payment_id: String!
  amount: Int!
}

input PaymentScalarWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  updatedAt: DateTime
  updatedAt_not: DateTime
  updatedAt_in: [DateTime!]
  updatedAt_not_in: [DateTime!]
  updatedAt_lt: DateTime
  updatedAt_lte: DateTime
  updatedAt_gt: DateTime
  updatedAt_gte: DateTime
  provider_subscription_id: String
  provider_subscription_id_not: String
  provider_subscription_id_in: [String!]
  provider_subscription_id_not_in: [String!]
  provider_subscription_id_lt: String
  provider_subscription_id_lte: String
  provider_subscription_id_gt: String
  provider_subscription_id_gte: String
  provider_subscription_id_contains: String
  provider_subscription_id_not_contains: String
  provider_subscription_id_starts_with: String
  provider_subscription_id_not_starts_with: String
  provider_subscription_id_ends_with: String
  provider_subscription_id_not_ends_with: String
  provider_payment_id: String
  provider_payment_id_not: String
  provider_payment_id_in: [String!]
  provider_payment_id_not_in: [String!]
  provider_payment_id_lt: String
  provider_payment_id_lte: String
  provider_payment_id_gt: String
  provider_payment_id_gte: String
  provider_payment_id_contains: String
  provider_payment_id_not_contains: String
  provider_payment_id_starts_with: String
  provider_payment_id_not_starts_with: String
  provider_payment_id_ends_with: String
  provider_payment_id_not_ends_with: String
  amount: Int
  amount_not: Int
  amount_in: [Int!]
  amount_not_in: [Int!]
  amount_lt: Int
  amount_lte: Int
  amount_gt: Int
  amount_gte: Int
  AND: [PaymentScalarWhereInput!]
  OR: [PaymentScalarWhereInput!]
  NOT: [PaymentScalarWhereInput!]
}

type PaymentSubscriptionPayload {
  mutation: MutationType!
  node: Payment
  updatedFields: [String!]
  previousValues: PaymentPreviousValues
}

input PaymentSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: PaymentWhereInput
  AND: [PaymentSubscriptionWhereInput!]
  OR: [PaymentSubscriptionWhereInput!]
  NOT: [PaymentSubscriptionWhereInput!]
}

input PaymentUpdateInput {
  provider_subscription_id: String
  provider_payment_id: String
  amount: Int
  user: UserUpdateOneRequiredWithoutPaymentInput
}

input PaymentUpdateManyDataInput {
  provider_subscription_id: String
  provider_payment_id: String
  amount: Int
}

input PaymentUpdateManyMutationInput {
  provider_subscription_id: String
  provider_payment_id: String
  amount: Int
}

input PaymentUpdateManyWithoutUserInput {
  create: [PaymentCreateWithoutUserInput!]
  delete: [PaymentWhereUniqueInput!]
  connect: [PaymentWhereUniqueInput!]
  set: [PaymentWhereUniqueInput!]
  disconnect: [PaymentWhereUniqueInput!]
  update: [PaymentUpdateWithWhereUniqueWithoutUserInput!]
  upsert: [PaymentUpsertWithWhereUniqueWithoutUserInput!]
  deleteMany: [PaymentScalarWhereInput!]
  updateMany: [PaymentUpdateManyWithWhereNestedInput!]
}

input PaymentUpdateManyWithWhereNestedInput {
  where: PaymentScalarWhereInput!
  data: PaymentUpdateManyDataInput!
}

input PaymentUpdateWithoutUserDataInput {
  provider_subscription_id: String
  provider_payment_id: String
  amount: Int
}

input PaymentUpdateWithWhereUniqueWithoutUserInput {
  where: PaymentWhereUniqueInput!
  data: PaymentUpdateWithoutUserDataInput!
}

input PaymentUpsertWithWhereUniqueWithoutUserInput {
  where: PaymentWhereUniqueInput!
  update: PaymentUpdateWithoutUserDataInput!
  create: PaymentCreateWithoutUserInput!
}

input PaymentWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  updatedAt: DateTime
  updatedAt_not: DateTime
  updatedAt_in: [DateTime!]
  updatedAt_not_in: [DateTime!]
  updatedAt_lt: DateTime
  updatedAt_lte: DateTime
  updatedAt_gt: DateTime
  updatedAt_gte: DateTime
  provider_subscription_id: String
  provider_subscription_id_not: String
  provider_subscription_id_in: [String!]
  provider_subscription_id_not_in: [String!]
  provider_subscription_id_lt: String
  provider_subscription_id_lte: String
  provider_subscription_id_gt: String
  provider_subscription_id_gte: String
  provider_subscription_id_contains: String
  provider_subscription_id_not_contains: String
  provider_subscription_id_starts_with: String
  provider_subscription_id_not_starts_with: String
  provider_subscription_id_ends_with: String
  provider_subscription_id_not_ends_with: String
  provider_payment_id: String
  provider_payment_id_not: String
  provider_payment_id_in: [String!]
  provider_payment_id_not_in: [String!]
  provider_payment_id_lt: String
  provider_payment_id_lte: String
  provider_payment_id_gt: String
  provider_payment_id_gte: String
  provider_payment_id_contains: String
  provider_payment_id_not_contains: String
  provider_payment_id_starts_with: String
  provider_payment_id_not_starts_with: String
  provider_payment_id_ends_with: String
  provider_payment_id_not_ends_with: String
  amount: Int
  amount_not: Int
  amount_in: [Int!]
  amount_not_in: [Int!]
  amount_lt: Int
  amount_lte: Int
  amount_gt: Int
  amount_gte: Int
  user: UserWhereInput
  AND: [PaymentWhereInput!]
  OR: [PaymentWhereInput!]
  NOT: [PaymentWhereInput!]
}

input PaymentWhereUniqueInput {
  id: ID
  provider_payment_id: String
}

enum Plan {
  PAST
  GUEST
  INTRO_5
  PLAN_9
  YEARLY_100
  LIFETIME_199
}

type Query {
  payment(where: PaymentWhereUniqueInput!): Payment
  payments(where: PaymentWhereInput, orderBy: PaymentOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Payment]!
  paymentsConnection(where: PaymentWhereInput, orderBy: PaymentOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): PaymentConnection!
  telemetry(where: TelemetryWhereUniqueInput!): Telemetry
  telemetries(where: TelemetryWhereInput, orderBy: TelemetryOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Telemetry]!
  telemetriesConnection(where: TelemetryWhereInput, orderBy: TelemetryOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): TelemetryConnection!
  user(where: UserWhereUniqueInput!): User
  users(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [User]!
  usersConnection(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): UserConnection!
  node(id: ID!): Node
}

enum SourceLanguage {
  AUTO
  EN
  DE
  ES
}

type Subscription {
  payment(where: PaymentSubscriptionWhereInput): PaymentSubscriptionPayload
  telemetry(where: TelemetrySubscriptionWhereInput): TelemetrySubscriptionPayload
  user(where: UserSubscriptionWhereInput): UserSubscriptionPayload
}

enum TargetLanguage {
  EN
  DE
  ES
}

type Telemetry {
  id: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  type: TelemetryType!
  telemetry_key: String!
  filename: String!
  payload: Json!
}

type TelemetryConnection {
  pageInfo: PageInfo!
  edges: [TelemetryEdge]!
  aggregate: AggregateTelemetry!
}

input TelemetryCreateInput {
  id: ID
  type: TelemetryType!
  telemetry_key: String!
  filename: String!
  payload: Json!
}

type TelemetryEdge {
  node: Telemetry!
  cursor: String!
}

enum TelemetryOrderByInput {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  type_ASC
  type_DESC
  telemetry_key_ASC
  telemetry_key_DESC
  filename_ASC
  filename_DESC
  payload_ASC
  payload_DESC
}

type TelemetryPreviousValues {
  id: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  type: TelemetryType!
  telemetry_key: String!
  filename: String!
  payload: Json!
}

type TelemetrySubscriptionPayload {
  mutation: MutationType!
  node: Telemetry
  updatedFields: [String!]
  previousValues: TelemetryPreviousValues
}

input TelemetrySubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: TelemetryWhereInput
  AND: [TelemetrySubscriptionWhereInput!]
  OR: [TelemetrySubscriptionWhereInput!]
  NOT: [TelemetrySubscriptionWhereInput!]
}

enum TelemetryType {
  PROVIDER_PAYMENT_EVENT
}

input TelemetryUpdateInput {
  type: TelemetryType
  telemetry_key: String
  filename: String
  payload: Json
}

input TelemetryUpdateManyMutationInput {
  type: TelemetryType
  telemetry_key: String
  filename: String
  payload: Json
}

input TelemetryWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  updatedAt: DateTime
  updatedAt_not: DateTime
  updatedAt_in: [DateTime!]
  updatedAt_not_in: [DateTime!]
  updatedAt_lt: DateTime
  updatedAt_lte: DateTime
  updatedAt_gt: DateTime
  updatedAt_gte: DateTime
  type: TelemetryType
  type_not: TelemetryType
  type_in: [TelemetryType!]
  type_not_in: [TelemetryType!]
  telemetry_key: String
  telemetry_key_not: String
  telemetry_key_in: [String!]
  telemetry_key_not_in: [String!]
  telemetry_key_lt: String
  telemetry_key_lte: String
  telemetry_key_gt: String
  telemetry_key_gte: String
  telemetry_key_contains: String
  telemetry_key_not_contains: String
  telemetry_key_starts_with: String
  telemetry_key_not_starts_with: String
  telemetry_key_ends_with: String
  telemetry_key_not_ends_with: String
  filename: String
  filename_not: String
  filename_in: [String!]
  filename_not_in: [String!]
  filename_lt: String
  filename_lte: String
  filename_gt: String
  filename_gte: String
  filename_contains: String
  filename_not_contains: String
  filename_starts_with: String
  filename_not_starts_with: String
  filename_ends_with: String
  filename_not_ends_with: String
  AND: [TelemetryWhereInput!]
  OR: [TelemetryWhereInput!]
  NOT: [TelemetryWhereInput!]
}

input TelemetryWhereUniqueInput {
  id: ID
}

type User {
  id: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  email: String!
  source_language: SourceLanguage!
  target_language: TargetLanguage!
  plan: Plan!
  type: UserType!
  payment(where: PaymentWhereInput, orderBy: PaymentOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Payment!]
  telegram_id: String
  telegram_chat_id: String
}

type UserConnection {
  pageInfo: PageInfo!
  edges: [UserEdge]!
  aggregate: AggregateUser!
}

input UserCreateInput {
  id: ID
  email: String!
  source_language: SourceLanguage
  target_language: TargetLanguage
  plan: Plan!
  type: UserType
  payment: PaymentCreateManyWithoutUserInput
  telegram_id: String
  telegram_chat_id: String
}

input UserCreateOneWithoutPaymentInput {
  create: UserCreateWithoutPaymentInput
  connect: UserWhereUniqueInput
}

input UserCreateWithoutPaymentInput {
  id: ID
  email: String!
  source_language: SourceLanguage
  target_language: TargetLanguage
  plan: Plan!
  type: UserType
  telegram_id: String
  telegram_chat_id: String
}

type UserEdge {
  node: User!
  cursor: String!
}

enum UserOrderByInput {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  email_ASC
  email_DESC
  source_language_ASC
  source_language_DESC
  target_language_ASC
  target_language_DESC
  plan_ASC
  plan_DESC
  type_ASC
  type_DESC
  telegram_id_ASC
  telegram_id_DESC
  telegram_chat_id_ASC
  telegram_chat_id_DESC
}

type UserPreviousValues {
  id: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  email: String!
  source_language: SourceLanguage!
  target_language: TargetLanguage!
  plan: Plan!
  type: UserType!
  telegram_id: String
  telegram_chat_id: String
}

type UserSubscriptionPayload {
  mutation: MutationType!
  node: User
  updatedFields: [String!]
  previousValues: UserPreviousValues
}

input UserSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: UserWhereInput
  AND: [UserSubscriptionWhereInput!]
  OR: [UserSubscriptionWhereInput!]
  NOT: [UserSubscriptionWhereInput!]
}

enum UserType {
  ADMIN
  USER
}

input UserUpdateInput {
  email: String
  source_language: SourceLanguage
  target_language: TargetLanguage
  plan: Plan
  type: UserType
  payment: PaymentUpdateManyWithoutUserInput
  telegram_id: String
  telegram_chat_id: String
}

input UserUpdateManyMutationInput {
  email: String
  source_language: SourceLanguage
  target_language: TargetLanguage
  plan: Plan
  type: UserType
  telegram_id: String
  telegram_chat_id: String
}

input UserUpdateOneRequiredWithoutPaymentInput {
  create: UserCreateWithoutPaymentInput
  update: UserUpdateWithoutPaymentDataInput
  upsert: UserUpsertWithoutPaymentInput
  connect: UserWhereUniqueInput
}

input UserUpdateWithoutPaymentDataInput {
  email: String
  source_language: SourceLanguage
  target_language: TargetLanguage
  plan: Plan
  type: UserType
  telegram_id: String
  telegram_chat_id: String
}

input UserUpsertWithoutPaymentInput {
  update: UserUpdateWithoutPaymentDataInput!
  create: UserCreateWithoutPaymentInput!
}

input UserWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  updatedAt: DateTime
  updatedAt_not: DateTime
  updatedAt_in: [DateTime!]
  updatedAt_not_in: [DateTime!]
  updatedAt_lt: DateTime
  updatedAt_lte: DateTime
  updatedAt_gt: DateTime
  updatedAt_gte: DateTime
  email: String
  email_not: String
  email_in: [String!]
  email_not_in: [String!]
  email_lt: String
  email_lte: String
  email_gt: String
  email_gte: String
  email_contains: String
  email_not_contains: String
  email_starts_with: String
  email_not_starts_with: String
  email_ends_with: String
  email_not_ends_with: String
  source_language: SourceLanguage
  source_language_not: SourceLanguage
  source_language_in: [SourceLanguage!]
  source_language_not_in: [SourceLanguage!]
  target_language: TargetLanguage
  target_language_not: TargetLanguage
  target_language_in: [TargetLanguage!]
  target_language_not_in: [TargetLanguage!]
  plan: Plan
  plan_not: Plan
  plan_in: [Plan!]
  plan_not_in: [Plan!]
  type: UserType
  type_not: UserType
  type_in: [UserType!]
  type_not_in: [UserType!]
  payment_every: PaymentWhereInput
  payment_some: PaymentWhereInput
  payment_none: PaymentWhereInput
  telegram_id: String
  telegram_id_not: String
  telegram_id_in: [String!]
  telegram_id_not_in: [String!]
  telegram_id_lt: String
  telegram_id_lte: String
  telegram_id_gt: String
  telegram_id_gte: String
  telegram_id_contains: String
  telegram_id_not_contains: String
  telegram_id_starts_with: String
  telegram_id_not_starts_with: String
  telegram_id_ends_with: String
  telegram_id_not_ends_with: String
  telegram_chat_id: String
  telegram_chat_id_not: String
  telegram_chat_id_in: [String!]
  telegram_chat_id_not_in: [String!]
  telegram_chat_id_lt: String
  telegram_chat_id_lte: String
  telegram_chat_id_gt: String
  telegram_chat_id_gte: String
  telegram_chat_id_contains: String
  telegram_chat_id_not_contains: String
  telegram_chat_id_starts_with: String
  telegram_chat_id_not_starts_with: String
  telegram_chat_id_ends_with: String
  telegram_chat_id_not_ends_with: String
  AND: [UserWhereInput!]
  OR: [UserWhereInput!]
  NOT: [UserWhereInput!]
}

input UserWhereUniqueInput {
  id: ID
  email: String
  telegram_id: String
  telegram_chat_id: String
}
`