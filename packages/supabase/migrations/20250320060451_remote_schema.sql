drop materialized view if exists "public"."weth_point_reservations";

create table "public"."holdings" (
    "id" uuid not null default gen_random_uuid(),
    "wallet" character varying not null,
    "token" character varying not null,
    "symbol" character varying not null,
    "amount" numeric not null,
    "value" numeric not null,
    "snapshotId" bigint not null,
    "snapshotAt" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text)
);

alter table "public"."holdings" enable row level security;

create table "public"."ref_data_11_03" (
    "address" text not null,
    "referral" text,
    "timestamp" timestamp with time zone
);

alter table "public"."ref_data_11_03" enable row level security;

CREATE UNIQUE INDEX holdings_pkey ON public.holdings USING btree (id);

CREATE INDEX idx_ref_data_11_03_address_lower ON public.ref_data_11_03 USING btree (lower(address));

CREATE INDEX idx_ref_data_11_03_referral_lower ON public.ref_data_11_03 USING btree (lower(referral));

CREATE UNIQUE INDEX "ref_data_11-03_pkey" ON public.ref_data_11_03 USING btree (address);

alter table "public"."holdings" add constraint "holdings_pkey" PRIMARY KEY using index "holdings_pkey";

alter table "public"."ref_data_11_03" add constraint "ref_data_11-03_pkey" PRIMARY KEY using index "ref_data_11-03_pkey";

create or replace view "public"."holdings_agg" as  SELECT h.wallet,
    sum(h.value) AS total,
    count(1) AS positions,
    max(h."snapshotId") AS version
   FROM holdings h
  GROUP BY h.wallet;


create materialized view "public"."weth_point_reservations_total" as  WITH referral_points_calc AS (
         SELECT lower(r.referral) AS referrer_address,
            sum((rb.points * 0.1)) AS total_referral_points
           FROM (ref_data_11_03 r
             JOIN wedu_agg_point_balances_view rb ON ((lower(r.address) = lower((rb.address)::text))))
          GROUP BY (lower(r.referral))
        )
 SELECT b.chain,
    b.address,
    b.points,
    COALESCE(rp.total_referral_points, (0)::numeric) AS referral_points,
    floor((b.points + COALESCE(rp.total_referral_points, (0)::numeric))) AS total_points,
    b."timestamp",
    'merkle_claim'::text AS reason
   FROM (wedu_agg_point_balances_view b
     LEFT JOIN referral_points_calc rp ON ((lower((b.address)::text) = rp.referrer_address)));


create materialized view "public"."yuzu_snapshot" as  SELECT wedu_agg_point_balances_view.chain,
    wedu_agg_point_balances_view.address,
    wedu_agg_point_balances_view.points,
    wedu_agg_point_balances_view."timestamp"
   FROM wedu_agg_point_balances_view;


create materialized view "public"."weth_point_reservations" as  SELECT b.chain,
    b.address,
    floor(b.points) AS points,
    b."timestamp",
    'merkle_claim'::text AS reason
   FROM wedu_agg_point_balances_view b;


grant delete on table "public"."holdings" to "anon";

grant insert on table "public"."holdings" to "anon";

grant references on table "public"."holdings" to "anon";

grant select on table "public"."holdings" to "anon";

grant trigger on table "public"."holdings" to "anon";

grant truncate on table "public"."holdings" to "anon";

grant update on table "public"."holdings" to "anon";

grant delete on table "public"."holdings" to "authenticated";

grant insert on table "public"."holdings" to "authenticated";

grant references on table "public"."holdings" to "authenticated";

grant select on table "public"."holdings" to "authenticated";

grant trigger on table "public"."holdings" to "authenticated";

grant truncate on table "public"."holdings" to "authenticated";

grant update on table "public"."holdings" to "authenticated";

grant delete on table "public"."holdings" to "service_role";

grant insert on table "public"."holdings" to "service_role";

grant references on table "public"."holdings" to "service_role";

grant select on table "public"."holdings" to "service_role";

grant trigger on table "public"."holdings" to "service_role";

grant truncate on table "public"."holdings" to "service_role";

grant update on table "public"."holdings" to "service_role";

grant delete on table "public"."ref_data_11_03" to "anon";

grant insert on table "public"."ref_data_11_03" to "anon";

grant references on table "public"."ref_data_11_03" to "anon";

grant select on table "public"."ref_data_11_03" to "anon";

grant trigger on table "public"."ref_data_11_03" to "anon";

grant truncate on table "public"."ref_data_11_03" to "anon";

grant update on table "public"."ref_data_11_03" to "anon";

grant delete on table "public"."ref_data_11_03" to "authenticated";

grant insert on table "public"."ref_data_11_03" to "authenticated";

grant references on table "public"."ref_data_11_03" to "authenticated";

grant select on table "public"."ref_data_11_03" to "authenticated";

grant trigger on table "public"."ref_data_11_03" to "authenticated";

grant truncate on table "public"."ref_data_11_03" to "authenticated";

grant update on table "public"."ref_data_11_03" to "authenticated";

grant delete on table "public"."ref_data_11_03" to "service_role";

grant insert on table "public"."ref_data_11_03" to "service_role";

grant references on table "public"."ref_data_11_03" to "service_role";

grant select on table "public"."ref_data_11_03" to "service_role";

grant trigger on table "public"."ref_data_11_03" to "service_role";

grant truncate on table "public"."ref_data_11_03" to "service_role";

grant update on table "public"."ref_data_11_03" to "service_role";


