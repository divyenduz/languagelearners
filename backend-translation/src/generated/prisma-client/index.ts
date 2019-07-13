// Code generated by Prisma (prisma@1.34.1). DO NOT EDIT.
// Please don't change this file manually but run `prisma generate` to update it.
// For more information, please read the docs: https://www.prisma.io/docs/prisma-client/

import { DocumentNode } from "graphql";
import {
  makePrismaClientClass,
  BaseClientOptions,
  Model
} from "prisma-client-lib";
import { typeDefs } from "./prisma-schema";

export type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
  U[keyof U];

export type Maybe<T> = T | undefined | null;

export interface Exists {
  payment: (where?: PaymentWhereInput) => Promise<boolean>;
  user: (where?: UserWhereInput) => Promise<boolean>;
}

export interface Node {}

export type FragmentableArray<T> = Promise<Array<T>> & Fragmentable;

export interface Fragmentable {
  $fragment<T>(fragment: string | DocumentNode): Promise<T>;
}

export interface Prisma {
  $exists: Exists;
  $graphql: <T = any>(
    query: string,
    variables?: { [key: string]: any }
  ) => Promise<T>;

  /**
   * Queries
   */

  payment: (where: PaymentWhereUniqueInput) => PaymentNullablePromise;
  payments: (args?: {
    where?: PaymentWhereInput;
    orderBy?: PaymentOrderByInput;
    skip?: Int;
    after?: String;
    before?: String;
    first?: Int;
    last?: Int;
  }) => FragmentableArray<Payment>;
  paymentsConnection: (args?: {
    where?: PaymentWhereInput;
    orderBy?: PaymentOrderByInput;
    skip?: Int;
    after?: String;
    before?: String;
    first?: Int;
    last?: Int;
  }) => PaymentConnectionPromise;
  user: (where: UserWhereUniqueInput) => UserNullablePromise;
  users: (args?: {
    where?: UserWhereInput;
    orderBy?: UserOrderByInput;
    skip?: Int;
    after?: String;
    before?: String;
    first?: Int;
    last?: Int;
  }) => FragmentableArray<User>;
  usersConnection: (args?: {
    where?: UserWhereInput;
    orderBy?: UserOrderByInput;
    skip?: Int;
    after?: String;
    before?: String;
    first?: Int;
    last?: Int;
  }) => UserConnectionPromise;
  node: (args: { id: ID_Output }) => Node;

  /**
   * Mutations
   */

  createPayment: (data: PaymentCreateInput) => PaymentPromise;
  updatePayment: (args: {
    data: PaymentUpdateInput;
    where: PaymentWhereUniqueInput;
  }) => PaymentPromise;
  updateManyPayments: (args: {
    data: PaymentUpdateManyMutationInput;
    where?: PaymentWhereInput;
  }) => BatchPayloadPromise;
  upsertPayment: (args: {
    where: PaymentWhereUniqueInput;
    create: PaymentCreateInput;
    update: PaymentUpdateInput;
  }) => PaymentPromise;
  deletePayment: (where: PaymentWhereUniqueInput) => PaymentPromise;
  deleteManyPayments: (where?: PaymentWhereInput) => BatchPayloadPromise;
  createUser: (data: UserCreateInput) => UserPromise;
  updateUser: (args: {
    data: UserUpdateInput;
    where: UserWhereUniqueInput;
  }) => UserPromise;
  updateManyUsers: (args: {
    data: UserUpdateManyMutationInput;
    where?: UserWhereInput;
  }) => BatchPayloadPromise;
  upsertUser: (args: {
    where: UserWhereUniqueInput;
    create: UserCreateInput;
    update: UserUpdateInput;
  }) => UserPromise;
  deleteUser: (where: UserWhereUniqueInput) => UserPromise;
  deleteManyUsers: (where?: UserWhereInput) => BatchPayloadPromise;

  /**
   * Subscriptions
   */

  $subscribe: Subscription;
}

export interface Subscription {
  payment: (
    where?: PaymentSubscriptionWhereInput
  ) => PaymentSubscriptionPayloadSubscription;
  user: (
    where?: UserSubscriptionWhereInput
  ) => UserSubscriptionPayloadSubscription;
}

export interface ClientConstructor<T> {
  new (options?: BaseClientOptions): T;
}

/**
 * Types
 */

export type TargetLanguage = "EN" | "DE" | "ES";

export type SourceLanguage = "AUTO" | "EN" | "DE" | "ES";

export type Plan =
  | "PAST"
  | "GUEST"
  | "INTRO_5"
  | "PLAN_9"
  | "YEARLY_100"
  | "LIFETIME_199";

export type UserType = "ADMIN" | "USER";

export type PaymentOrderByInput =
  | "id_ASC"
  | "id_DESC"
  | "date_ASC"
  | "date_DESC"
  | "amount_ASC"
  | "amount_DESC";

export type UserOrderByInput =
  | "id_ASC"
  | "id_DESC"
  | "email_ASC"
  | "email_DESC"
  | "source_language_ASC"
  | "source_language_DESC"
  | "target_language_ASC"
  | "target_language_DESC"
  | "plan_ASC"
  | "plan_DESC"
  | "type_ASC"
  | "type_DESC"
  | "telegram_id_ASC"
  | "telegram_id_DESC"
  | "telegram_chat_id_ASC"
  | "telegram_chat_id_DESC";

export type MutationType = "CREATED" | "UPDATED" | "DELETED";

export interface UserCreateOneWithoutPaymentInput {
  create?: Maybe<UserCreateWithoutPaymentInput>;
  connect?: Maybe<UserWhereUniqueInput>;
}

export type PaymentWhereUniqueInput = AtLeastOne<{
  id: Maybe<ID_Input>;
}>;

export interface PaymentUpdateWithWhereUniqueWithoutUserInput {
  where: PaymentWhereUniqueInput;
  data: PaymentUpdateWithoutUserDataInput;
}

export interface UserCreateInput {
  id?: Maybe<ID_Input>;
  email: String;
  source_language?: Maybe<SourceLanguage>;
  target_language?: Maybe<TargetLanguage>;
  plan: Plan;
  type?: Maybe<UserType>;
  payment?: Maybe<PaymentCreateManyWithoutUserInput>;
  telegram_id?: Maybe<String>;
  telegram_chat_id?: Maybe<String>;
}

export interface PaymentUpdateManyWithoutUserInput {
  create?: Maybe<
    PaymentCreateWithoutUserInput[] | PaymentCreateWithoutUserInput
  >;
  delete?: Maybe<PaymentWhereUniqueInput[] | PaymentWhereUniqueInput>;
  connect?: Maybe<PaymentWhereUniqueInput[] | PaymentWhereUniqueInput>;
  set?: Maybe<PaymentWhereUniqueInput[] | PaymentWhereUniqueInput>;
  disconnect?: Maybe<PaymentWhereUniqueInput[] | PaymentWhereUniqueInput>;
  update?: Maybe<
    | PaymentUpdateWithWhereUniqueWithoutUserInput[]
    | PaymentUpdateWithWhereUniqueWithoutUserInput
  >;
  upsert?: Maybe<
    | PaymentUpsertWithWhereUniqueWithoutUserInput[]
    | PaymentUpsertWithWhereUniqueWithoutUserInput
  >;
  deleteMany?: Maybe<PaymentScalarWhereInput[] | PaymentScalarWhereInput>;
  updateMany?: Maybe<
    | PaymentUpdateManyWithWhereNestedInput[]
    | PaymentUpdateManyWithWhereNestedInput
  >;
}

export interface UserUpsertWithoutPaymentInput {
  update: UserUpdateWithoutPaymentDataInput;
  create: UserCreateWithoutPaymentInput;
}

export interface UserUpdateInput {
  email?: Maybe<String>;
  source_language?: Maybe<SourceLanguage>;
  target_language?: Maybe<TargetLanguage>;
  plan?: Maybe<Plan>;
  type?: Maybe<UserType>;
  payment?: Maybe<PaymentUpdateManyWithoutUserInput>;
  telegram_id?: Maybe<String>;
  telegram_chat_id?: Maybe<String>;
}

export interface UserWhereInput {
  id?: Maybe<ID_Input>;
  id_not?: Maybe<ID_Input>;
  id_in?: Maybe<ID_Input[] | ID_Input>;
  id_not_in?: Maybe<ID_Input[] | ID_Input>;
  id_lt?: Maybe<ID_Input>;
  id_lte?: Maybe<ID_Input>;
  id_gt?: Maybe<ID_Input>;
  id_gte?: Maybe<ID_Input>;
  id_contains?: Maybe<ID_Input>;
  id_not_contains?: Maybe<ID_Input>;
  id_starts_with?: Maybe<ID_Input>;
  id_not_starts_with?: Maybe<ID_Input>;
  id_ends_with?: Maybe<ID_Input>;
  id_not_ends_with?: Maybe<ID_Input>;
  email?: Maybe<String>;
  email_not?: Maybe<String>;
  email_in?: Maybe<String[] | String>;
  email_not_in?: Maybe<String[] | String>;
  email_lt?: Maybe<String>;
  email_lte?: Maybe<String>;
  email_gt?: Maybe<String>;
  email_gte?: Maybe<String>;
  email_contains?: Maybe<String>;
  email_not_contains?: Maybe<String>;
  email_starts_with?: Maybe<String>;
  email_not_starts_with?: Maybe<String>;
  email_ends_with?: Maybe<String>;
  email_not_ends_with?: Maybe<String>;
  source_language?: Maybe<SourceLanguage>;
  source_language_not?: Maybe<SourceLanguage>;
  source_language_in?: Maybe<SourceLanguage[] | SourceLanguage>;
  source_language_not_in?: Maybe<SourceLanguage[] | SourceLanguage>;
  target_language?: Maybe<TargetLanguage>;
  target_language_not?: Maybe<TargetLanguage>;
  target_language_in?: Maybe<TargetLanguage[] | TargetLanguage>;
  target_language_not_in?: Maybe<TargetLanguage[] | TargetLanguage>;
  plan?: Maybe<Plan>;
  plan_not?: Maybe<Plan>;
  plan_in?: Maybe<Plan[] | Plan>;
  plan_not_in?: Maybe<Plan[] | Plan>;
  type?: Maybe<UserType>;
  type_not?: Maybe<UserType>;
  type_in?: Maybe<UserType[] | UserType>;
  type_not_in?: Maybe<UserType[] | UserType>;
  payment_every?: Maybe<PaymentWhereInput>;
  payment_some?: Maybe<PaymentWhereInput>;
  payment_none?: Maybe<PaymentWhereInput>;
  telegram_id?: Maybe<String>;
  telegram_id_not?: Maybe<String>;
  telegram_id_in?: Maybe<String[] | String>;
  telegram_id_not_in?: Maybe<String[] | String>;
  telegram_id_lt?: Maybe<String>;
  telegram_id_lte?: Maybe<String>;
  telegram_id_gt?: Maybe<String>;
  telegram_id_gte?: Maybe<String>;
  telegram_id_contains?: Maybe<String>;
  telegram_id_not_contains?: Maybe<String>;
  telegram_id_starts_with?: Maybe<String>;
  telegram_id_not_starts_with?: Maybe<String>;
  telegram_id_ends_with?: Maybe<String>;
  telegram_id_not_ends_with?: Maybe<String>;
  telegram_chat_id?: Maybe<String>;
  telegram_chat_id_not?: Maybe<String>;
  telegram_chat_id_in?: Maybe<String[] | String>;
  telegram_chat_id_not_in?: Maybe<String[] | String>;
  telegram_chat_id_lt?: Maybe<String>;
  telegram_chat_id_lte?: Maybe<String>;
  telegram_chat_id_gt?: Maybe<String>;
  telegram_chat_id_gte?: Maybe<String>;
  telegram_chat_id_contains?: Maybe<String>;
  telegram_chat_id_not_contains?: Maybe<String>;
  telegram_chat_id_starts_with?: Maybe<String>;
  telegram_chat_id_not_starts_with?: Maybe<String>;
  telegram_chat_id_ends_with?: Maybe<String>;
  telegram_chat_id_not_ends_with?: Maybe<String>;
  AND?: Maybe<UserWhereInput[] | UserWhereInput>;
  OR?: Maybe<UserWhereInput[] | UserWhereInput>;
  NOT?: Maybe<UserWhereInput[] | UserWhereInput>;
}

export interface PaymentSubscriptionWhereInput {
  mutation_in?: Maybe<MutationType[] | MutationType>;
  updatedFields_contains?: Maybe<String>;
  updatedFields_contains_every?: Maybe<String[] | String>;
  updatedFields_contains_some?: Maybe<String[] | String>;
  node?: Maybe<PaymentWhereInput>;
  AND?: Maybe<PaymentSubscriptionWhereInput[] | PaymentSubscriptionWhereInput>;
  OR?: Maybe<PaymentSubscriptionWhereInput[] | PaymentSubscriptionWhereInput>;
  NOT?: Maybe<PaymentSubscriptionWhereInput[] | PaymentSubscriptionWhereInput>;
}

export interface PaymentUpdateManyDataInput {
  date?: Maybe<DateTimeInput>;
  amount?: Maybe<Float>;
}

export interface PaymentCreateInput {
  id?: Maybe<ID_Input>;
  date: DateTimeInput;
  amount: Float;
  user: UserCreateOneWithoutPaymentInput;
}

export interface PaymentScalarWhereInput {
  id?: Maybe<ID_Input>;
  id_not?: Maybe<ID_Input>;
  id_in?: Maybe<ID_Input[] | ID_Input>;
  id_not_in?: Maybe<ID_Input[] | ID_Input>;
  id_lt?: Maybe<ID_Input>;
  id_lte?: Maybe<ID_Input>;
  id_gt?: Maybe<ID_Input>;
  id_gte?: Maybe<ID_Input>;
  id_contains?: Maybe<ID_Input>;
  id_not_contains?: Maybe<ID_Input>;
  id_starts_with?: Maybe<ID_Input>;
  id_not_starts_with?: Maybe<ID_Input>;
  id_ends_with?: Maybe<ID_Input>;
  id_not_ends_with?: Maybe<ID_Input>;
  date?: Maybe<DateTimeInput>;
  date_not?: Maybe<DateTimeInput>;
  date_in?: Maybe<DateTimeInput[] | DateTimeInput>;
  date_not_in?: Maybe<DateTimeInput[] | DateTimeInput>;
  date_lt?: Maybe<DateTimeInput>;
  date_lte?: Maybe<DateTimeInput>;
  date_gt?: Maybe<DateTimeInput>;
  date_gte?: Maybe<DateTimeInput>;
  amount?: Maybe<Float>;
  amount_not?: Maybe<Float>;
  amount_in?: Maybe<Float[] | Float>;
  amount_not_in?: Maybe<Float[] | Float>;
  amount_lt?: Maybe<Float>;
  amount_lte?: Maybe<Float>;
  amount_gt?: Maybe<Float>;
  amount_gte?: Maybe<Float>;
  AND?: Maybe<PaymentScalarWhereInput[] | PaymentScalarWhereInput>;
  OR?: Maybe<PaymentScalarWhereInput[] | PaymentScalarWhereInput>;
  NOT?: Maybe<PaymentScalarWhereInput[] | PaymentScalarWhereInput>;
}

export interface PaymentCreateWithoutUserInput {
  id?: Maybe<ID_Input>;
  date: DateTimeInput;
  amount: Float;
}

export type UserWhereUniqueInput = AtLeastOne<{
  id: Maybe<ID_Input>;
  email?: Maybe<String>;
  telegram_id?: Maybe<String>;
  telegram_chat_id?: Maybe<String>;
}>;

export interface UserCreateWithoutPaymentInput {
  id?: Maybe<ID_Input>;
  email: String;
  source_language?: Maybe<SourceLanguage>;
  target_language?: Maybe<TargetLanguage>;
  plan: Plan;
  type?: Maybe<UserType>;
  telegram_id?: Maybe<String>;
  telegram_chat_id?: Maybe<String>;
}

export interface PaymentWhereInput {
  id?: Maybe<ID_Input>;
  id_not?: Maybe<ID_Input>;
  id_in?: Maybe<ID_Input[] | ID_Input>;
  id_not_in?: Maybe<ID_Input[] | ID_Input>;
  id_lt?: Maybe<ID_Input>;
  id_lte?: Maybe<ID_Input>;
  id_gt?: Maybe<ID_Input>;
  id_gte?: Maybe<ID_Input>;
  id_contains?: Maybe<ID_Input>;
  id_not_contains?: Maybe<ID_Input>;
  id_starts_with?: Maybe<ID_Input>;
  id_not_starts_with?: Maybe<ID_Input>;
  id_ends_with?: Maybe<ID_Input>;
  id_not_ends_with?: Maybe<ID_Input>;
  date?: Maybe<DateTimeInput>;
  date_not?: Maybe<DateTimeInput>;
  date_in?: Maybe<DateTimeInput[] | DateTimeInput>;
  date_not_in?: Maybe<DateTimeInput[] | DateTimeInput>;
  date_lt?: Maybe<DateTimeInput>;
  date_lte?: Maybe<DateTimeInput>;
  date_gt?: Maybe<DateTimeInput>;
  date_gte?: Maybe<DateTimeInput>;
  amount?: Maybe<Float>;
  amount_not?: Maybe<Float>;
  amount_in?: Maybe<Float[] | Float>;
  amount_not_in?: Maybe<Float[] | Float>;
  amount_lt?: Maybe<Float>;
  amount_lte?: Maybe<Float>;
  amount_gt?: Maybe<Float>;
  amount_gte?: Maybe<Float>;
  user?: Maybe<UserWhereInput>;
  AND?: Maybe<PaymentWhereInput[] | PaymentWhereInput>;
  OR?: Maybe<PaymentWhereInput[] | PaymentWhereInput>;
  NOT?: Maybe<PaymentWhereInput[] | PaymentWhereInput>;
}

export interface PaymentUpdateInput {
  date?: Maybe<DateTimeInput>;
  amount?: Maybe<Float>;
  user?: Maybe<UserUpdateOneRequiredWithoutPaymentInput>;
}

export interface UserUpdateManyMutationInput {
  email?: Maybe<String>;
  source_language?: Maybe<SourceLanguage>;
  target_language?: Maybe<TargetLanguage>;
  plan?: Maybe<Plan>;
  type?: Maybe<UserType>;
  telegram_id?: Maybe<String>;
  telegram_chat_id?: Maybe<String>;
}

export interface PaymentUpdateManyMutationInput {
  date?: Maybe<DateTimeInput>;
  amount?: Maybe<Float>;
}

export interface PaymentCreateManyWithoutUserInput {
  create?: Maybe<
    PaymentCreateWithoutUserInput[] | PaymentCreateWithoutUserInput
  >;
  connect?: Maybe<PaymentWhereUniqueInput[] | PaymentWhereUniqueInput>;
}

export interface UserUpdateWithoutPaymentDataInput {
  email?: Maybe<String>;
  source_language?: Maybe<SourceLanguage>;
  target_language?: Maybe<TargetLanguage>;
  plan?: Maybe<Plan>;
  type?: Maybe<UserType>;
  telegram_id?: Maybe<String>;
  telegram_chat_id?: Maybe<String>;
}

export interface UserUpdateOneRequiredWithoutPaymentInput {
  create?: Maybe<UserCreateWithoutPaymentInput>;
  update?: Maybe<UserUpdateWithoutPaymentDataInput>;
  upsert?: Maybe<UserUpsertWithoutPaymentInput>;
  connect?: Maybe<UserWhereUniqueInput>;
}

export interface PaymentUpdateManyWithWhereNestedInput {
  where: PaymentScalarWhereInput;
  data: PaymentUpdateManyDataInput;
}

export interface UserSubscriptionWhereInput {
  mutation_in?: Maybe<MutationType[] | MutationType>;
  updatedFields_contains?: Maybe<String>;
  updatedFields_contains_every?: Maybe<String[] | String>;
  updatedFields_contains_some?: Maybe<String[] | String>;
  node?: Maybe<UserWhereInput>;
  AND?: Maybe<UserSubscriptionWhereInput[] | UserSubscriptionWhereInput>;
  OR?: Maybe<UserSubscriptionWhereInput[] | UserSubscriptionWhereInput>;
  NOT?: Maybe<UserSubscriptionWhereInput[] | UserSubscriptionWhereInput>;
}

export interface PaymentUpdateWithoutUserDataInput {
  date?: Maybe<DateTimeInput>;
  amount?: Maybe<Float>;
}

export interface PaymentUpsertWithWhereUniqueWithoutUserInput {
  where: PaymentWhereUniqueInput;
  update: PaymentUpdateWithoutUserDataInput;
  create: PaymentCreateWithoutUserInput;
}

export interface NodeNode {
  id: ID_Output;
}

export interface UserPreviousValues {
  id: ID_Output;
  email: String;
  source_language: SourceLanguage;
  target_language: TargetLanguage;
  plan: Plan;
  type: UserType;
  telegram_id?: String;
  telegram_chat_id?: String;
}

export interface UserPreviousValuesPromise
  extends Promise<UserPreviousValues>,
    Fragmentable {
  id: () => Promise<ID_Output>;
  email: () => Promise<String>;
  source_language: () => Promise<SourceLanguage>;
  target_language: () => Promise<TargetLanguage>;
  plan: () => Promise<Plan>;
  type: () => Promise<UserType>;
  telegram_id: () => Promise<String>;
  telegram_chat_id: () => Promise<String>;
}

export interface UserPreviousValuesSubscription
  extends Promise<AsyncIterator<UserPreviousValues>>,
    Fragmentable {
  id: () => Promise<AsyncIterator<ID_Output>>;
  email: () => Promise<AsyncIterator<String>>;
  source_language: () => Promise<AsyncIterator<SourceLanguage>>;
  target_language: () => Promise<AsyncIterator<TargetLanguage>>;
  plan: () => Promise<AsyncIterator<Plan>>;
  type: () => Promise<AsyncIterator<UserType>>;
  telegram_id: () => Promise<AsyncIterator<String>>;
  telegram_chat_id: () => Promise<AsyncIterator<String>>;
}

export interface AggregatePayment {
  count: Int;
}

export interface AggregatePaymentPromise
  extends Promise<AggregatePayment>,
    Fragmentable {
  count: () => Promise<Int>;
}

export interface AggregatePaymentSubscription
  extends Promise<AsyncIterator<AggregatePayment>>,
    Fragmentable {
  count: () => Promise<AsyncIterator<Int>>;
}

export interface Payment {
  id: ID_Output;
  date: DateTimeOutput;
  amount: Float;
}

export interface PaymentPromise extends Promise<Payment>, Fragmentable {
  id: () => Promise<ID_Output>;
  date: () => Promise<DateTimeOutput>;
  amount: () => Promise<Float>;
  user: <T = UserPromise>() => T;
}

export interface PaymentSubscription
  extends Promise<AsyncIterator<Payment>>,
    Fragmentable {
  id: () => Promise<AsyncIterator<ID_Output>>;
  date: () => Promise<AsyncIterator<DateTimeOutput>>;
  amount: () => Promise<AsyncIterator<Float>>;
  user: <T = UserSubscription>() => T;
}

export interface PaymentNullablePromise
  extends Promise<Payment | null>,
    Fragmentable {
  id: () => Promise<ID_Output>;
  date: () => Promise<DateTimeOutput>;
  amount: () => Promise<Float>;
  user: <T = UserPromise>() => T;
}

export interface PaymentEdge {
  node: Payment;
  cursor: String;
}

export interface PaymentEdgePromise extends Promise<PaymentEdge>, Fragmentable {
  node: <T = PaymentPromise>() => T;
  cursor: () => Promise<String>;
}

export interface PaymentEdgeSubscription
  extends Promise<AsyncIterator<PaymentEdge>>,
    Fragmentable {
  node: <T = PaymentSubscription>() => T;
  cursor: () => Promise<AsyncIterator<String>>;
}

export interface UserSubscriptionPayload {
  mutation: MutationType;
  node: User;
  updatedFields: String[];
  previousValues: UserPreviousValues;
}

export interface UserSubscriptionPayloadPromise
  extends Promise<UserSubscriptionPayload>,
    Fragmentable {
  mutation: () => Promise<MutationType>;
  node: <T = UserPromise>() => T;
  updatedFields: () => Promise<String[]>;
  previousValues: <T = UserPreviousValuesPromise>() => T;
}

export interface UserSubscriptionPayloadSubscription
  extends Promise<AsyncIterator<UserSubscriptionPayload>>,
    Fragmentable {
  mutation: () => Promise<AsyncIterator<MutationType>>;
  node: <T = UserSubscription>() => T;
  updatedFields: () => Promise<AsyncIterator<String[]>>;
  previousValues: <T = UserPreviousValuesSubscription>() => T;
}

export interface PaymentSubscriptionPayload {
  mutation: MutationType;
  node: Payment;
  updatedFields: String[];
  previousValues: PaymentPreviousValues;
}

export interface PaymentSubscriptionPayloadPromise
  extends Promise<PaymentSubscriptionPayload>,
    Fragmentable {
  mutation: () => Promise<MutationType>;
  node: <T = PaymentPromise>() => T;
  updatedFields: () => Promise<String[]>;
  previousValues: <T = PaymentPreviousValuesPromise>() => T;
}

export interface PaymentSubscriptionPayloadSubscription
  extends Promise<AsyncIterator<PaymentSubscriptionPayload>>,
    Fragmentable {
  mutation: () => Promise<AsyncIterator<MutationType>>;
  node: <T = PaymentSubscription>() => T;
  updatedFields: () => Promise<AsyncIterator<String[]>>;
  previousValues: <T = PaymentPreviousValuesSubscription>() => T;
}

export interface PaymentConnection {
  pageInfo: PageInfo;
  edges: PaymentEdge[];
}

export interface PaymentConnectionPromise
  extends Promise<PaymentConnection>,
    Fragmentable {
  pageInfo: <T = PageInfoPromise>() => T;
  edges: <T = FragmentableArray<PaymentEdge>>() => T;
  aggregate: <T = AggregatePaymentPromise>() => T;
}

export interface PaymentConnectionSubscription
  extends Promise<AsyncIterator<PaymentConnection>>,
    Fragmentable {
  pageInfo: <T = PageInfoSubscription>() => T;
  edges: <T = Promise<AsyncIterator<PaymentEdgeSubscription>>>() => T;
  aggregate: <T = AggregatePaymentSubscription>() => T;
}

export interface PageInfo {
  hasNextPage: Boolean;
  hasPreviousPage: Boolean;
  startCursor?: String;
  endCursor?: String;
}

export interface PageInfoPromise extends Promise<PageInfo>, Fragmentable {
  hasNextPage: () => Promise<Boolean>;
  hasPreviousPage: () => Promise<Boolean>;
  startCursor: () => Promise<String>;
  endCursor: () => Promise<String>;
}

export interface PageInfoSubscription
  extends Promise<AsyncIterator<PageInfo>>,
    Fragmentable {
  hasNextPage: () => Promise<AsyncIterator<Boolean>>;
  hasPreviousPage: () => Promise<AsyncIterator<Boolean>>;
  startCursor: () => Promise<AsyncIterator<String>>;
  endCursor: () => Promise<AsyncIterator<String>>;
}

export interface BatchPayload {
  count: Long;
}

export interface BatchPayloadPromise
  extends Promise<BatchPayload>,
    Fragmentable {
  count: () => Promise<Long>;
}

export interface BatchPayloadSubscription
  extends Promise<AsyncIterator<BatchPayload>>,
    Fragmentable {
  count: () => Promise<AsyncIterator<Long>>;
}

export interface AggregateUser {
  count: Int;
}

export interface AggregateUserPromise
  extends Promise<AggregateUser>,
    Fragmentable {
  count: () => Promise<Int>;
}

export interface AggregateUserSubscription
  extends Promise<AsyncIterator<AggregateUser>>,
    Fragmentable {
  count: () => Promise<AsyncIterator<Int>>;
}

export interface User {
  id: ID_Output;
  email: String;
  source_language: SourceLanguage;
  target_language: TargetLanguage;
  plan: Plan;
  type: UserType;
  telegram_id?: String;
  telegram_chat_id?: String;
}

export interface UserPromise extends Promise<User>, Fragmentable {
  id: () => Promise<ID_Output>;
  email: () => Promise<String>;
  source_language: () => Promise<SourceLanguage>;
  target_language: () => Promise<TargetLanguage>;
  plan: () => Promise<Plan>;
  type: () => Promise<UserType>;
  payment: <T = FragmentableArray<Payment>>(args?: {
    where?: PaymentWhereInput;
    orderBy?: PaymentOrderByInput;
    skip?: Int;
    after?: String;
    before?: String;
    first?: Int;
    last?: Int;
  }) => T;
  telegram_id: () => Promise<String>;
  telegram_chat_id: () => Promise<String>;
}

export interface UserSubscription
  extends Promise<AsyncIterator<User>>,
    Fragmentable {
  id: () => Promise<AsyncIterator<ID_Output>>;
  email: () => Promise<AsyncIterator<String>>;
  source_language: () => Promise<AsyncIterator<SourceLanguage>>;
  target_language: () => Promise<AsyncIterator<TargetLanguage>>;
  plan: () => Promise<AsyncIterator<Plan>>;
  type: () => Promise<AsyncIterator<UserType>>;
  payment: <T = Promise<AsyncIterator<PaymentSubscription>>>(args?: {
    where?: PaymentWhereInput;
    orderBy?: PaymentOrderByInput;
    skip?: Int;
    after?: String;
    before?: String;
    first?: Int;
    last?: Int;
  }) => T;
  telegram_id: () => Promise<AsyncIterator<String>>;
  telegram_chat_id: () => Promise<AsyncIterator<String>>;
}

export interface UserNullablePromise
  extends Promise<User | null>,
    Fragmentable {
  id: () => Promise<ID_Output>;
  email: () => Promise<String>;
  source_language: () => Promise<SourceLanguage>;
  target_language: () => Promise<TargetLanguage>;
  plan: () => Promise<Plan>;
  type: () => Promise<UserType>;
  payment: <T = FragmentableArray<Payment>>(args?: {
    where?: PaymentWhereInput;
    orderBy?: PaymentOrderByInput;
    skip?: Int;
    after?: String;
    before?: String;
    first?: Int;
    last?: Int;
  }) => T;
  telegram_id: () => Promise<String>;
  telegram_chat_id: () => Promise<String>;
}

export interface PaymentPreviousValues {
  id: ID_Output;
  date: DateTimeOutput;
  amount: Float;
}

export interface PaymentPreviousValuesPromise
  extends Promise<PaymentPreviousValues>,
    Fragmentable {
  id: () => Promise<ID_Output>;
  date: () => Promise<DateTimeOutput>;
  amount: () => Promise<Float>;
}

export interface PaymentPreviousValuesSubscription
  extends Promise<AsyncIterator<PaymentPreviousValues>>,
    Fragmentable {
  id: () => Promise<AsyncIterator<ID_Output>>;
  date: () => Promise<AsyncIterator<DateTimeOutput>>;
  amount: () => Promise<AsyncIterator<Float>>;
}

export interface UserConnection {
  pageInfo: PageInfo;
  edges: UserEdge[];
}

export interface UserConnectionPromise
  extends Promise<UserConnection>,
    Fragmentable {
  pageInfo: <T = PageInfoPromise>() => T;
  edges: <T = FragmentableArray<UserEdge>>() => T;
  aggregate: <T = AggregateUserPromise>() => T;
}

export interface UserConnectionSubscription
  extends Promise<AsyncIterator<UserConnection>>,
    Fragmentable {
  pageInfo: <T = PageInfoSubscription>() => T;
  edges: <T = Promise<AsyncIterator<UserEdgeSubscription>>>() => T;
  aggregate: <T = AggregateUserSubscription>() => T;
}

export interface UserEdge {
  node: User;
  cursor: String;
}

export interface UserEdgePromise extends Promise<UserEdge>, Fragmentable {
  node: <T = UserPromise>() => T;
  cursor: () => Promise<String>;
}

export interface UserEdgeSubscription
  extends Promise<AsyncIterator<UserEdge>>,
    Fragmentable {
  node: <T = UserSubscription>() => T;
  cursor: () => Promise<AsyncIterator<String>>;
}

/*
The `Boolean` scalar type represents `true` or `false`.
*/
export type Boolean = boolean;

/*
The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
*/
export type String = string;

export type Long = string;

/*
The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.
*/
export type ID_Input = string | number;
export type ID_Output = string;

/*
The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point). 
*/
export type Float = number;

/*
DateTime scalar input type, allowing Date
*/
export type DateTimeInput = Date | string;

/*
DateTime scalar output type, which is always a string
*/
export type DateTimeOutput = string;

/*
The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1. 
*/
export type Int = number;

/**
 * Model Metadata
 */

export const models: Model[] = [
  {
    name: "SourceLanguage",
    embedded: false
  },
  {
    name: "TargetLanguage",
    embedded: false
  },
  {
    name: "Plan",
    embedded: false
  },
  {
    name: "UserType",
    embedded: false
  },
  {
    name: "User",
    embedded: false
  },
  {
    name: "Payment",
    embedded: false
  }
];

/**
 * Type Defs
 */

export const Prisma = makePrismaClientClass<ClientConstructor<Prisma>>({
  typeDefs,
  models,
  endpoint: `https://api-prisma.divyendusingh.com/lingoparrot/${
    process.env["PRISMA_SERVICE_STAGE"]
  }`,
  secret: `{env:PRISMA_SERVICE_SECRET}`
});
export const prisma = new Prisma();
