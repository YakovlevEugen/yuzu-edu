revoke delete on table "public"."community_allocations" from "anon";

revoke insert on table "public"."community_allocations" from "anon";

revoke references on table "public"."community_allocations" from "anon";

revoke select on table "public"."community_allocations" from "anon";

revoke trigger on table "public"."community_allocations" from "anon";

revoke truncate on table "public"."community_allocations" from "anon";

revoke update on table "public"."community_allocations" from "anon";

revoke delete on table "public"."community_allocations" from "authenticated";

revoke insert on table "public"."community_allocations" from "authenticated";

revoke references on table "public"."community_allocations" from "authenticated";

revoke select on table "public"."community_allocations" from "authenticated";

revoke trigger on table "public"."community_allocations" from "authenticated";

revoke truncate on table "public"."community_allocations" from "authenticated";

revoke update on table "public"."community_allocations" from "authenticated";

revoke delete on table "public"."community_allocations" from "service_role";

revoke insert on table "public"."community_allocations" from "service_role";

revoke references on table "public"."community_allocations" from "service_role";

revoke select on table "public"."community_allocations" from "service_role";

revoke trigger on table "public"."community_allocations" from "service_role";

revoke truncate on table "public"."community_allocations" from "service_role";

revoke update on table "public"."community_allocations" from "service_role";

drop view if exists "public"."community_allocations_total";

alter table "public"."community_allocations" drop constraint "community_allocations_pkey";

drop index if exists "public"."community_allocations_pkey";

drop table "public"."community_allocations";

create table "public"."community_rewards_history" (
    "address" character varying not null,
    "community" character varying not null,
    "points" numeric not null default '0'::numeric,
    "createdAt" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text)
);


alter table "public"."community_rewards_history" enable row level security;

CREATE UNIQUE INDEX community_rewards_history_pkey ON public.community_rewards_history USING btree (address, community, "createdAt");

alter table "public"."community_rewards_history" add constraint "community_rewards_history_pkey" PRIMARY KEY using index "community_rewards_history_pkey";

create or replace view "public"."community_rewards_by_address" as  SELECT community_rewards_history.address,
    sum(community_rewards_history.points) AS total
   FROM community_rewards_history
  GROUP BY community_rewards_history.address;


create or replace view "public"."community_rewards_by_community" as  SELECT community_rewards_history.community,
    sum(community_rewards_history.points) AS total
   FROM community_rewards_history
  GROUP BY community_rewards_history.community;


grant delete on table "public"."community_rewards_history" to "anon";

grant insert on table "public"."community_rewards_history" to "anon";

grant references on table "public"."community_rewards_history" to "anon";

grant select on table "public"."community_rewards_history" to "anon";

grant trigger on table "public"."community_rewards_history" to "anon";

grant truncate on table "public"."community_rewards_history" to "anon";

grant update on table "public"."community_rewards_history" to "anon";

grant delete on table "public"."community_rewards_history" to "authenticated";

grant insert on table "public"."community_rewards_history" to "authenticated";

grant references on table "public"."community_rewards_history" to "authenticated";

grant select on table "public"."community_rewards_history" to "authenticated";

grant trigger on table "public"."community_rewards_history" to "authenticated";

grant truncate on table "public"."community_rewards_history" to "authenticated";

grant update on table "public"."community_rewards_history" to "authenticated";

grant delete on table "public"."community_rewards_history" to "service_role";

grant insert on table "public"."community_rewards_history" to "service_role";

grant references on table "public"."community_rewards_history" to "service_role";

grant select on table "public"."community_rewards_history" to "service_role";

grant trigger on table "public"."community_rewards_history" to "service_role";

grant truncate on table "public"."community_rewards_history" to "service_role";

grant update on table "public"."community_rewards_history" to "service_role";


