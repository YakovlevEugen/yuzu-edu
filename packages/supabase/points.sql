-- drop view wedu_balances_changes_view cascade;

create or replace view wedu_balances_changes_view  with (security_invoker=on) as
select
  *,
  lead("blockTimestamp") over (partition by chain, address order by "blockTimestamp", "logIndex") as "untilBlockTimestamp",
  sum(amount) over (partition by chain, address order by "blockTimestamp", "logIndex") as balance,
  row_number() over (partition by chain, address order by "blockTimestamp", "logIndex") as "rowNumber"
from wedu_balance_changes;

create or replace view wedu_point_balances_view  with (security_invoker=on) as
select
  *,
  (extract(
    epoch from (
      coalesce("untilBlockTimestamp"::timestamp, now()) - 
      "blockTimestamp"::timestamp)
    ) / 3600) * (balance * 0.05 / 24 / 1e18) as points
from wedu_balances_changes_view
order by chain, address, "rowNumber";

create or replace view wedu_agg_point_balances_view  with (security_invoker=on) as
select 
  chain,
  address, 
  sum(points) as points,
  now() as timestamp
from wedu_point_balances_view
group by chain, address
