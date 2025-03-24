create or replace view wedu_points with (security_invoker=on) as
  with balances_changes as (
    select
      *,
      lead("blockTimestamp") over (partition by chain, address order by "blockTimestamp", "logIndex") as "untilBlockTimestamp",
      sum(amount) over (partition by chain, address order by "blockTimestamp", "logIndex") as balance,
      row_number() over (partition by chain, address order by "blockTimestamp", "logIndex") as "rowNumber"
    from 
      wedu_balance_changes
  ),
  point_balances as (
    select
      *,
      (extract(
        epoch from (
          coalesce("untilBlockTimestamp"::timestamp, now()) - 
          "blockTimestamp"::timestamp)
        ) / 86400) * (balance * 0.05 / 1e18) as points
    from 
      balances_changes
    order by 
      chain, address, "rowNumber"
  )
  select 
    chain,
    address, 
    sum(points) as points,
    now() as timestamp
  from 
    point_balances
  group by 
    chain, address;