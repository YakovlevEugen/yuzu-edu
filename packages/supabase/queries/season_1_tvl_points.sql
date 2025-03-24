with 
  holdings_agg as (
    select 
      h.wallet,
      sum(h.value) AS total,
      count(1) AS positions,
      max(h."snapshotId") AS version
    from 
      holdings h
    group by
      h.wallet
  ),
  tvl as (
    select 
      sum(total) as total_tvl
    from 
      holdings_agg
  ), 
  holdings_points as (
    select 
      wallet, 
      (1000000 * total / tvl.total_tvl) as points, -- TODO: here we need total amount of pre allocated yuzu
      version
    from 
      holdings_agg
    cross join 
      tvl
  )
insert into yuzu_reservations (wallet, reason, season, source, points)
  select 
    h.wallet, 
    'merkle_claim', 
    1, -- season 1
    'tvl', 
    floor(h.points)
  from 
    holdings_points h
  where
    floor(h.points) > 0
  on conflict do nothing;