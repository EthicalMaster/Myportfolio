-- Additive setup for Taher's existing portfolio database. No CMS content changes.
create table public.portfolio_analytics_events (
 id uuid primary key,
 recorded_at timestamptz not null default now(),
 session_key text not null check(length(session_key)=64),
 event text not null check(event in ('pageview','project_click','contact_click','resume_click')),
 page text not null check(page in ('/','/skills/')),
 target text not null default '' check(length(target)<=80),
 referrer text not null default '' check(length(referrer)<=120),
 device text not null check(device in ('mobile','tablet','desktop'))
);
create index portfolio_analytics_recorded on public.portfolio_analytics_events(recorded_at);
alter table public.portfolio_analytics_events enable row level security;
revoke all on public.portfolio_analytics_events from public,anon,authenticated;
grant select on public.portfolio_analytics_events to authenticated;
grant all on public.portfolio_analytics_events to service_role;
create policy portfolio_analytics_owner_read on public.portfolio_analytics_events for select to authenticated using (exists(select 1 from public.portfolio_owners where user_id=(select auth.uid())));

create function public.record_portfolio_event(event_id uuid, session_hash text,event_name text,page_path text,target_name text,referrer_host text,device_class text,visitor_hash text) returns boolean
language plpgsql security invoker set search_path='' set timezone='UTC' as $$
declare bucket_name text; hits_now integer; limit_value integer; cleanup_day text;
begin
 if length(visitor_hash)<>64 or length(session_hash)<>64 then return false;end if;
 perform pg_advisory_xact_lock(684216);
 for bucket_name,limit_value in select * from (values
  ('analytics:global:minute:'||to_char(now(),'YYYYMMDDHH24MI'),300),
  ('analytics:global:day:'||to_char(now(),'YYYYMMDD'),10000),
  ('analytics:visitor:'||visitor_hash||':'||to_char(now(),'YYYYMMDDHH24MI'),30)
 ) as b(k,v) loop
  insert into portfolio_private.request_limits(bucket,hits,expires_at) values(bucket_name,1,now()+interval '2 days')
  on conflict(bucket) do update set hits=portfolio_private.request_limits.hits+1 returning hits into hits_now;
  if hits_now>limit_value then return false;end if;
 end loop;
 cleanup_day='analytics:cleanup:'||to_char(now(),'YYYYMMDD');
 if not exists(select 1 from portfolio_private.request_limits where bucket=cleanup_day) then
  delete from public.portfolio_analytics_events where recorded_at<now()-interval '90 days';
  delete from portfolio_private.request_limits where expires_at<now();
  insert into portfolio_private.request_limits(bucket,hits,expires_at) values(cleanup_day,1,now()+interval '2 days');
 end if;
 insert into public.portfolio_analytics_events(id,session_key,event,page,target,referrer,device)
 values(event_id,session_hash,event_name,page_path,target_name,referrer_host,device_class)
 on conflict(id) do nothing;
 return true;
end $$;
revoke all on function public.record_portfolio_event(uuid,text,text,text,text,text,text,text) from public,anon,authenticated;
grant execute on function public.record_portfolio_event(uuid,text,text,text,text,text,text,text) to service_role;

create function public.portfolio_analytics_summary(period_days integer default 30) returns jsonb
language plpgsql security invoker set search_path='' set timezone='UTC' as $$
declare since_time timestamptz; days integer; result jsonb;
begin
 if not exists(select 1 from public.portfolio_owners where user_id=auth.uid()) then raise exception 'Owner access required' using errcode='42501';end if;
 days=case when period_days in (7,30,90) then period_days else 30 end;
 since_time=date_trunc('day',now())-make_interval(days=>days-1);
 with events as (select * from public.portfolio_analytics_events where recorded_at>=since_time),
 daily as (select d::date as day,count(e.id) as count from generate_series(since_time,date_trunc('day',now()),interval '1 day') d left join events e on e.event='pageview' and e.recorded_at>=d and e.recorded_at<d+interval '1 day' group by d order by d),
 pages as (select page,count(*) as count from events where event='pageview' group by page order by count desc),
 refs as (select referrer,count(*) as count from events where event='pageview' group by referrer order by count desc limit 10),
 devices as (select device,count(*) as count from events where event='pageview' group by device order by count desc),
 targets as (select target,count(*) as count from events where event<>'pageview' group by target order by count desc limit 20)
 select jsonb_build_object('days',days,'views',count(*) filter(where event='pageview'),'visits',count(distinct session_key) filter(where event='pageview'),
 'project_clicks',count(*) filter(where event='project_click'),'contact_clicks',count(*) filter(where event='contact_click'),
 'daily',(select jsonb_agg(to_jsonb(daily)) from daily),'pages',coalesce((select jsonb_agg(to_jsonb(pages)) from pages),'[]'::jsonb),
 'referrers',coalesce((select jsonb_agg(to_jsonb(refs)) from refs),'[]'::jsonb),'devices',coalesce((select jsonb_agg(to_jsonb(devices)) from devices),'[]'::jsonb),
 'targets',coalesce((select jsonb_agg(to_jsonb(targets)) from targets),'[]'::jsonb)) into result from events;
 return result;
end $$;
revoke all on function public.portfolio_analytics_summary(integer) from public,anon;
grant execute on function public.portfolio_analytics_summary(integer) to authenticated;
