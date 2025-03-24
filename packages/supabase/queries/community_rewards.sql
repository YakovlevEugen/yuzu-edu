-- drop view community_allocations_total 

create or replace view community_rewards_by_address with (security_invoker=on) as
  select 
    address, 
    sum(points) as total 
  from 
    community_rewards_history
  group by 
    address;

-- drop view community_allocations_total 

create or replace view community_rewards_by_community with (security_invoker=on) as
  select 
    community, 
    sum(points) as total 
  from 
    community_rewards_history
  group by 
    community;