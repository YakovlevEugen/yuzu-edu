create table "public"."community_allocations" (
    "address" character varying not null,
    "community" character varying not null,
    "points" numeric not null default '0'::numeric
);


alter table "public"."community_allocations" enable row level security;

create table "public"."community_rewards" (
    "name" character varying not null,
    "points" numeric not null default '0'::numeric
);


alter table "public"."community_rewards" enable row level security;

CREATE UNIQUE INDEX community_rewards_pkey ON public.community_rewards USING btree (name);

alter table "public"."community_rewards" add constraint "community_rewards_pkey" PRIMARY KEY using index "community_rewards_pkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.reset_community_allocations()
 RETURNS void
 LANGUAGE sql
AS $function$  
  TRUNCATE community_allocations;
$function$
;

CREATE OR REPLACE FUNCTION public.reset_community_rewards()
 RETURNS void
 LANGUAGE sql
AS $function$  
  TRUNCATE community_rewards;
$function$
;

create or replace view "public"."wedu_point_balances_view" as  SELECT wedu_balances_changes_view.chain,
    wedu_balances_changes_view."transactionHash",
    wedu_balances_changes_view."transactionIndex",
    wedu_balances_changes_view."logIndex",
    wedu_balances_changes_view.address,
    wedu_balances_changes_view.amount,
    wedu_balances_changes_view."blockNumber",
    wedu_balances_changes_view."blockTimestamp",
    wedu_balances_changes_view."untilBlockTimestamp",
    wedu_balances_changes_view.balance,
    wedu_balances_changes_view."rowNumber",
    ((EXTRACT(epoch FROM (COALESCE(((wedu_balances_changes_view."untilBlockTimestamp")::timestamp without time zone)::timestamp with time zone, now()) - ((wedu_balances_changes_view."blockTimestamp")::timestamp without time zone)::timestamp with time zone)) / (3600)::numeric) * ((wedu_balances_changes_view.balance * 0.05 / 24) / '1000000000000000000'::numeric)) AS points
   FROM wedu_balances_changes_view
  ORDER BY wedu_balances_changes_view.chain, wedu_balances_changes_view.address, wedu_balances_changes_view."rowNumber";


grant delete on table "public"."community_allocations" to "anon";

grant insert on table "public"."community_allocations" to "anon";

grant references on table "public"."community_allocations" to "anon";

grant select on table "public"."community_allocations" to "anon";

grant trigger on table "public"."community_allocations" to "anon";

grant truncate on table "public"."community_allocations" to "anon";

grant update on table "public"."community_allocations" to "anon";

grant delete on table "public"."community_allocations" to "authenticated";

grant insert on table "public"."community_allocations" to "authenticated";

grant references on table "public"."community_allocations" to "authenticated";

grant select on table "public"."community_allocations" to "authenticated";

grant trigger on table "public"."community_allocations" to "authenticated";

grant truncate on table "public"."community_allocations" to "authenticated";

grant update on table "public"."community_allocations" to "authenticated";

grant delete on table "public"."community_allocations" to "service_role";

grant insert on table "public"."community_allocations" to "service_role";

grant references on table "public"."community_allocations" to "service_role";

grant select on table "public"."community_allocations" to "service_role";

grant trigger on table "public"."community_allocations" to "service_role";

grant truncate on table "public"."community_allocations" to "service_role";

grant update on table "public"."community_allocations" to "service_role";

grant delete on table "public"."community_rewards" to "anon";

grant insert on table "public"."community_rewards" to "anon";

grant references on table "public"."community_rewards" to "anon";

grant select on table "public"."community_rewards" to "anon";

grant trigger on table "public"."community_rewards" to "anon";

grant truncate on table "public"."community_rewards" to "anon";

grant update on table "public"."community_rewards" to "anon";

grant delete on table "public"."community_rewards" to "authenticated";

grant insert on table "public"."community_rewards" to "authenticated";

grant references on table "public"."community_rewards" to "authenticated";

grant select on table "public"."community_rewards" to "authenticated";

grant trigger on table "public"."community_rewards" to "authenticated";

grant truncate on table "public"."community_rewards" to "authenticated";

grant update on table "public"."community_rewards" to "authenticated";

grant delete on table "public"."community_rewards" to "service_role";

grant insert on table "public"."community_rewards" to "service_role";

grant references on table "public"."community_rewards" to "service_role";

grant select on table "public"."community_rewards" to "service_role";

grant trigger on table "public"."community_rewards" to "service_role";

grant truncate on table "public"."community_rewards" to "service_role";

grant update on table "public"."community_rewards" to "service_role";


