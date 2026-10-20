begin;
create table public.portfolio_requests (
 id uuid primary key,
 name text not null check(char_length(name) between 1 and 100),
 email text not null check(char_length(email) between 3 and 254),
 category text not null check(category in ('opportunity','project','collaboration','question')),
 subject text not null check(char_length(subject) between 1 and 160),
 message text not null check(char_length(message) between 10 and 3000),
 status text not null default 'new' check(status in ('new','reviewing','replied','closed')),
 created_at timestamptz not null default now()
);
alter table public.portfolio_requests enable row level security;
revoke all on public.portfolio_requests from anon,authenticated;
grant select,delete on public.portfolio_requests to authenticated;
grant update(status) on public.portfolio_requests to authenticated;
grant all on public.portfolio_requests to service_role;
create policy owner_requests_read on public.portfolio_requests for select to authenticated using(exists(select 1 from public.portfolio_owners where user_id=(select auth.uid())));
create policy owner_requests_status on public.portfolio_requests for update to authenticated using(exists(select 1 from public.portfolio_owners where user_id=(select auth.uid()))) with check(exists(select 1 from public.portfolio_owners where user_id=(select auth.uid())));
create policy owner_requests_delete on public.portfolio_requests for delete to authenticated using(exists(select 1 from public.portfolio_owners where user_id=(select auth.uid())));
create schema if not exists portfolio_private;
revoke all on schema portfolio_private from public,anon,authenticated;
grant usage on schema portfolio_private to service_role;
create table portfolio_private.request_limits(bucket text primary key,hits integer not null,expires_at timestamptz not null);
alter table portfolio_private.request_limits enable row level security;
grant all on portfolio_private.request_limits to service_role;
create function public.admit_portfolio_request(action_kind text,visitor_hash text) returns boolean language plpgsql security invoker set search_path='' as $$
declare scope text;bucket_key text;used integer;maximum integer;minute_key text;day_key text;
begin
 if action_kind not in ('chat','request') or visitor_hash !~ '^[a-f0-9]{64}$' then return false;end if;
 perform pg_advisory_xact_lock(hashtext('portfolio-assistant:'||action_kind));
 minute_key=to_char(now() at time zone 'UTC','YYYYMMDDHH24MI');day_key=to_char(now() at time zone 'UTC','YYYYMMDD');
 delete from portfolio_private.request_limits where expires_at<now();
 foreach scope in array array['global-minute','global-day','visitor-minute','visitor-day'] loop
  bucket_key=action_kind||':'||scope||':'||(case when scope like '%minute' then minute_key else day_key end)||(case when scope like 'visitor%' then ':'||visitor_hash else '' end);
  maximum=case when action_kind='chat' then case scope when 'global-minute' then 20 when 'global-day' then 300 when 'visitor-minute' then 6 else 40 end else case scope when 'global-minute' then 10 when 'global-day' then 100 when 'visitor-minute' then 2 else 5 end end;
  insert into portfolio_private.request_limits values(bucket_key,1,now()+interval '2 days') on conflict(bucket) do update set hits=portfolio_private.request_limits.hits+1 returning hits into used;
  if used>maximum then return false;end if;
 end loop;
 return true;
end $$;
revoke all on function public.admit_portfolio_request(text,text) from public,anon,authenticated;
grant execute on function public.admit_portfolio_request(text,text) to service_role;
commit;
