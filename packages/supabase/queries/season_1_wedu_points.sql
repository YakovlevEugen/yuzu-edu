with 
  balances_changes as (
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
          coalesce("untilBlockTimestamp"::timestamp, '2025-03-17'::date) - 
          "blockTimestamp"::timestamp)
        ) / 86400) * (balance * 0.05 / 1e18) as points
    from 
      balances_changes
    where 
      "blockTimestamp" < '2025-03-17'::date
    order by 
      chain, address, "rowNumber"
  ),
  agg_point_balances as (
    select 
      chain,
      address, 
      sum(points) as points,
      '2025-03-17'::date as timestamp
    from 
      point_balances
    group by 
      chain, address
  )
insert into yuzu_reservations (wallet, reason, season, source, points)
  select 
    w.address, 
    'merkle_claim', 
    1, -- season 1
    'wedu', 
    floor(w.points)
  from 
    agg_point_balances w
  where
    floor(w.points) > 0
  on conflict do nothing;