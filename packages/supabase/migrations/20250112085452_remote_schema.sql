

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


CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."reset_faucet_wallets"() RETURNS "void"
    LANGUAGE "sql"
    AS $$  
  TRUNCATE faucet_wallets;
$$;


ALTER FUNCTION "public"."reset_faucet_wallets"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."reset_testnet_points"() RETURNS "void"
    LANGUAGE "sql"
    AS $$  
  TRUNCATE testnet_points;
$$;


ALTER FUNCTION "public"."reset_testnet_points"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."configs" (
    "key" character varying NOT NULL,
    "value" "jsonb",
    "scope" character varying NOT NULL
);


ALTER TABLE "public"."configs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."faucet_wallets" (
    "address" character varying NOT NULL,
    "createdAt" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL
);


ALTER TABLE "public"."faucet_wallets" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."testnet_points" (
    "address" character varying NOT NULL,
    "points" numeric DEFAULT '0'::numeric NOT NULL
);


ALTER TABLE "public"."testnet_points" OWNER TO "postgres";


COMMENT ON TABLE "public"."testnet_points" IS 'Snapshot of points awarded for testnet activities';



CREATE TABLE IF NOT EXISTS "public"."wedu_balance_changes" (
    "chain" character varying NOT NULL,
    "transactionHash" character varying NOT NULL,
    "transactionIndex" character varying NOT NULL,
    "logIndex" numeric NOT NULL,
    "address" character varying NOT NULL,
    "amount" numeric NOT NULL,
    "blockNumber" numeric NOT NULL,
    "blockTimestamp" timestamp with time zone NOT NULL
);


ALTER TABLE "public"."wedu_balance_changes" OWNER TO "postgres";


COMMENT ON TABLE "public"."wedu_balance_changes" IS 'wrapped edu balance changes';



CREATE OR REPLACE VIEW "public"."wedu_balances_changes_view" WITH ("security_invoker"='on') AS
 SELECT "wedu_balance_changes"."chain",
    "wedu_balance_changes"."transactionHash",
    "wedu_balance_changes"."transactionIndex",
    "wedu_balance_changes"."logIndex",
    "wedu_balance_changes"."address",
    "wedu_balance_changes"."amount",
    "wedu_balance_changes"."blockNumber",
    "wedu_balance_changes"."blockTimestamp",
    "lead"("wedu_balance_changes"."blockTimestamp") OVER (PARTITION BY "wedu_balance_changes"."chain", "wedu_balance_changes"."address" ORDER BY "wedu_balance_changes"."blockTimestamp", "wedu_balance_changes"."logIndex") AS "untilBlockTimestamp",
    "sum"("wedu_balance_changes"."amount") OVER (PARTITION BY "wedu_balance_changes"."chain", "wedu_balance_changes"."address" ORDER BY "wedu_balance_changes"."blockTimestamp", "wedu_balance_changes"."logIndex") AS "balance",
    "row_number"() OVER (PARTITION BY "wedu_balance_changes"."chain", "wedu_balance_changes"."address" ORDER BY "wedu_balance_changes"."blockTimestamp", "wedu_balance_changes"."logIndex") AS "rowNumber"
   FROM "public"."wedu_balance_changes";


ALTER TABLE "public"."wedu_balances_changes_view" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."wedu_point_balances_view" WITH ("security_invoker"='on') AS
 SELECT "wedu_balances_changes_view"."chain",
    "wedu_balances_changes_view"."transactionHash",
    "wedu_balances_changes_view"."transactionIndex",
    "wedu_balances_changes_view"."logIndex",
    "wedu_balances_changes_view"."address",
    "wedu_balances_changes_view"."amount",
    "wedu_balances_changes_view"."blockNumber",
    "wedu_balances_changes_view"."blockTimestamp",
    "wedu_balances_changes_view"."untilBlockTimestamp",
    "wedu_balances_changes_view"."balance",
    "wedu_balances_changes_view"."rowNumber",
    (((EXTRACT(epoch FROM (COALESCE((("wedu_balances_changes_view"."untilBlockTimestamp")::timestamp without time zone)::timestamp with time zone, "now"()) - (("wedu_balances_changes_view"."blockTimestamp")::timestamp without time zone)::timestamp with time zone)) / (3600)::numeric) * "wedu_balances_changes_view"."balance") / '1000000000000000000'::numeric) AS "points"
   FROM "public"."wedu_balances_changes_view"
  ORDER BY "wedu_balances_changes_view"."chain", "wedu_balances_changes_view"."address", "wedu_balances_changes_view"."rowNumber";


ALTER TABLE "public"."wedu_point_balances_view" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."wedu_agg_point_balances_view" WITH ("security_invoker"='on') AS
 SELECT "wedu_point_balances_view"."chain",
    "wedu_point_balances_view"."address",
    "sum"("wedu_point_balances_view"."points") AS "points",
    "now"() AS "timestamp"
   FROM "public"."wedu_point_balances_view"
  GROUP BY "wedu_point_balances_view"."chain", "wedu_point_balances_view"."address";


ALTER TABLE "public"."wedu_agg_point_balances_view" OWNER TO "postgres";


ALTER TABLE ONLY "public"."configs"
    ADD CONSTRAINT "configs_pkey" PRIMARY KEY ("key", "scope");



ALTER TABLE ONLY "public"."faucet_wallets"
    ADD CONSTRAINT "faucet_wallets_pkey" PRIMARY KEY ("address");



ALTER TABLE ONLY "public"."testnet_points"
    ADD CONSTRAINT "testnet_points_pkey" PRIMARY KEY ("address");



ALTER TABLE ONLY "public"."wedu_balance_changes"
    ADD CONSTRAINT "wedu_balance_changes_pkey" PRIMARY KEY ("chain", "transactionHash", "transactionIndex", "logIndex", "address");



ALTER TABLE "public"."configs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."faucet_wallets" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."testnet_points" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."wedu_balance_changes" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";




















































































































































































GRANT ALL ON FUNCTION "public"."reset_faucet_wallets"() TO "anon";
GRANT ALL ON FUNCTION "public"."reset_faucet_wallets"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."reset_faucet_wallets"() TO "service_role";



GRANT ALL ON FUNCTION "public"."reset_testnet_points"() TO "anon";
GRANT ALL ON FUNCTION "public"."reset_testnet_points"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."reset_testnet_points"() TO "service_role";


















GRANT ALL ON TABLE "public"."configs" TO "anon";
GRANT ALL ON TABLE "public"."configs" TO "authenticated";
GRANT ALL ON TABLE "public"."configs" TO "service_role";



GRANT ALL ON TABLE "public"."faucet_wallets" TO "anon";
GRANT ALL ON TABLE "public"."faucet_wallets" TO "authenticated";
GRANT ALL ON TABLE "public"."faucet_wallets" TO "service_role";



GRANT ALL ON TABLE "public"."testnet_points" TO "anon";
GRANT ALL ON TABLE "public"."testnet_points" TO "authenticated";
GRANT ALL ON TABLE "public"."testnet_points" TO "service_role";



GRANT ALL ON TABLE "public"."wedu_balance_changes" TO "anon";
GRANT ALL ON TABLE "public"."wedu_balance_changes" TO "authenticated";
GRANT ALL ON TABLE "public"."wedu_balance_changes" TO "service_role";



GRANT ALL ON TABLE "public"."wedu_balances_changes_view" TO "anon";
GRANT ALL ON TABLE "public"."wedu_balances_changes_view" TO "authenticated";
GRANT ALL ON TABLE "public"."wedu_balances_changes_view" TO "service_role";



GRANT ALL ON TABLE "public"."wedu_point_balances_view" TO "anon";
GRANT ALL ON TABLE "public"."wedu_point_balances_view" TO "authenticated";
GRANT ALL ON TABLE "public"."wedu_point_balances_view" TO "service_role";



GRANT ALL ON TABLE "public"."wedu_agg_point_balances_view" TO "anon";
GRANT ALL ON TABLE "public"."wedu_agg_point_balances_view" TO "authenticated";
GRANT ALL ON TABLE "public"."wedu_agg_point_balances_view" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
