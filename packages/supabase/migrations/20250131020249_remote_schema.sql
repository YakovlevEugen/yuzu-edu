revoke delete on table "public"."community_rewards" from "anon";

revoke insert on table "public"."community_rewards" from "anon";

revoke references on table "public"."community_rewards" from "anon";

revoke select on table "public"."community_rewards" from "anon";

revoke trigger on table "public"."community_rewards" from "anon";

revoke truncate on table "public"."community_rewards" from "anon";

revoke update on table "public"."community_rewards" from "anon";

revoke delete on table "public"."community_rewards" from "authenticated";

revoke insert on table "public"."community_rewards" from "authenticated";

revoke references on table "public"."community_rewards" from "authenticated";

revoke select on table "public"."community_rewards" from "authenticated";

revoke trigger on table "public"."community_rewards" from "authenticated";

revoke truncate on table "public"."community_rewards" from "authenticated";

revoke update on table "public"."community_rewards" from "authenticated";

revoke delete on table "public"."community_rewards" from "service_role";

revoke insert on table "public"."community_rewards" from "service_role";

revoke references on table "public"."community_rewards" from "service_role";

revoke select on table "public"."community_rewards" from "service_role";

revoke trigger on table "public"."community_rewards" from "service_role";

revoke truncate on table "public"."community_rewards" from "service_role";

revoke update on table "public"."community_rewards" from "service_role";

alter table "public"."community_rewards" drop constraint "community_rewards_pkey";

drop index if exists "public"."community_rewards_pkey";

drop table "public"."community_rewards";

alter table "public"."community_allocations" add column "createdAt" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text);

create or replace view "public"."community_allocations_total" as  SELECT community_allocations.community,
    sum(community_allocations.points) AS total
   FROM community_allocations
  GROUP BY community_allocations.community;



