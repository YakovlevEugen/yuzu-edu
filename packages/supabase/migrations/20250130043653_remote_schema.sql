CREATE UNIQUE INDEX community_allocations_pkey ON public.community_allocations USING btree (address, community);

alter table "public"."community_allocations" add constraint "community_allocations_pkey" PRIMARY KEY using index "community_allocations_pkey";

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
    ((EXTRACT(epoch FROM (COALESCE(((wedu_balances_changes_view."untilBlockTimestamp")::timestamp without time zone)::timestamp with time zone, now()) - ((wedu_balances_changes_view."blockTimestamp")::timestamp without time zone)::timestamp with time zone)) / (86400)::numeric) * ((wedu_balances_changes_view.balance * 0.05) / '1000000000000000000'::numeric)) AS points
   FROM wedu_balances_changes_view
  ORDER BY wedu_balances_changes_view.chain, wedu_balances_changes_view.address, wedu_balances_changes_view."rowNumber";



