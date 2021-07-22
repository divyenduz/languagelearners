--
-- PostgreSQL database dump
--

-- Dumped from database version 13.1 (Debian 13.1-1.pgdg100+1)
-- Dumped by pg_dump version 13.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: Plan; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Plan" AS ENUM (
    'PAST',
    'GUEST',
    'INTRO_5',
    'PLAN_9',
    'YEARLY_100',
    'LIFETIME_199'
);


--
-- Name: SourceLanguage; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."SourceLanguage" AS ENUM (
    'EN',
    'DE',
    'ES',
    'NL',
    'FR',
    'HI',
    'IT',
    'JP',
    'KR',
    'RU',
    'SE',
    'FA'
);


--
-- Name: TargetLanguage; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TargetLanguage" AS ENUM (
    'EN',
    'DE',
    'ES',
    'NL',
    'FR',
    'HI',
    'IT',
    'JP',
    'KR',
    'RU',
    'SE',
    'FA'
);


--
-- Name: TelemetryType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TelemetryType" AS ENUM (
    'PROVIDER_PAYMENT_EVENT'
);


--
-- Name: UserType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."UserType" AS ENUM (
    'ADMIN',
    'USER'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Payment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Payment" (
    id text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    amount integer NOT NULL,
    provider_subscription_id text NOT NULL,
    provider_payment_id text NOT NULL,
    "subscriptionPlanId" text,
    "userId" text
);


--
-- Name: SubscriptionPlan; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."SubscriptionPlan" (
    id text NOT NULL,
    provider_plan_id text NOT NULL,
    provider_subscription_id text NOT NULL
);


--
-- Name: Telemetry; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Telemetry" (
    id text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    filename text NOT NULL,
    payload text NOT NULL,
    telemetry_key text NOT NULL,
    type public."TelemetryType" NOT NULL
);


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    first_name text,
    last_name text,
    email text,
    plan public."Plan" NOT NULL,
    provider_customer_id text,
    source_language public."SourceLanguage" DEFAULT 'EN'::public."SourceLanguage" NOT NULL,
    target_language public."TargetLanguage" DEFAULT 'DE'::public."TargetLanguage" NOT NULL,
    telegram_chat_id text,
    telegram_id text,
    type public."UserType" DEFAULT 'USER'::public."UserType" NOT NULL,
    "subscriptionPlanId" text
);


--
-- Name: Payment Payment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_pkey" PRIMARY KEY (id);


--
-- Name: SubscriptionPlan SubscriptionPlan_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SubscriptionPlan"
    ADD CONSTRAINT "SubscriptionPlan_pkey" PRIMARY KEY (id);


--
-- Name: Telemetry Telemetry_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Telemetry"
    ADD CONSTRAINT "Telemetry_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Payment.provider_payment_id_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Payment.provider_payment_id_unique" ON public."Payment" USING btree (provider_payment_id);


--
-- Name: User.email_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User.email_unique" ON public."User" USING btree (email);


--
-- Name: User.telegram_chat_id_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User.telegram_chat_id_unique" ON public."User" USING btree (telegram_chat_id);


--
-- Name: User.telegram_id_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User.telegram_id_unique" ON public."User" USING btree (telegram_id);


--
-- Name: Payment Payment_subscriptionPlanId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_subscriptionPlanId_fkey" FOREIGN KEY ("subscriptionPlanId") REFERENCES public."SubscriptionPlan"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Payment Payment_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: User User_subscriptionPlanId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_subscriptionPlanId_fkey" FOREIGN KEY ("subscriptionPlanId") REFERENCES public."SubscriptionPlan"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

