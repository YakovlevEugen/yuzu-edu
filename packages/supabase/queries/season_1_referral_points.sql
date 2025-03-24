with 
  ref_points as (
    select 
      r.address as address,
      r.referral as referral,
      h.points * 0.1 as points,
      'tvl' as source
    from 
      referrals r 
    inner join 
      holdings_points h 
    on 
      r.address = h.wallet
    where 
      r.timestamp < '2025-03-17'::date
    
    union all

    select 
      r.address as address,
      r.referral as referral,
      h.points * 0.1 as points,
      'wedu' as source
    from 
      referrals r 
    inner join 
      wedu_snapshot_season_1 h 
    on 
      r.address = h.address
    where 
      r.timestamp < '2025-03-17'::date
  ), 
  ref_points_agg as (
    select 
      referral,
      floor(sum(points)) as points
    from 
      ref_points 
    group by 
      referral
    having 
      floor(sum(points)) > 0 
    order by points desc
  )
insert into yuzu_reservations (wallet, reason, season, source, points)
  select 
    h.referral, 
    'merkle_claim', 
    1, -- season
    'referral', 
    floor(h.points)
  from 
    referral_points h
  where
    floor(h.points) > 0
  on conflict do nothing;