create or replace view wedu_balances_changes_view  with (security_invoker=on) as
select
  *,
  lead("blockTimestamp") over (partition by address order by "blockTimestamp", "logIndex") as "untilBlockTimestamp",
  sum(amount) over (partition by address order by "blockTimestamp", "logIndex") as balance,
  row_number() over (partition by address order by "blockTimestamp", "logIndex") as "rowNumber"
from wedu_balance_changes;

create or replace view wedu_point_balances_view  with (security_invoker=on) as
select
  *,
  (extract(
    epoch from (
      coalesce("untilBlockTimestamp"::timestamp, now()) - 
      "blockTimestamp"::timestamp)
    ) / 3600) * balance / 1e18 as points
from wedu_balances_changes_view
order by address, "rowNumber";

create or replace view wedu_agg_point_balances_view  with (security_invoker=on) as
select 
  address, 
  sum(points) as points,
  now() as timestamp
from wedu_point_balances_view
group by address
