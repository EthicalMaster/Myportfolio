-- Rollback-only acceptance check: no test traffic persists.
begin;
select set_config('request.jwt.claim.sub',(select user_id::text from public.portfolio_owners limit 1),true);
set local role service_role;
do $$
declare test_id uuid=gen_random_uuid(); accepted boolean;
begin
 accepted=public.record_portfolio_event(test_id,repeat('a',64),'pageview','/','', 'test.invalid','mobile',repeat('b',64));
 if accepted is not true then raise exception 'Expected accepted event';end if;
 perform public.record_portfolio_event(test_id,repeat('a',64),'pageview','/','', 'test.invalid','mobile',repeat('b',64));
 if (select count(*) from public.portfolio_analytics_events where id=test_id)<>1 then raise exception 'Duplicate event';end if;
end $$;
set local role authenticated;
do $$ declare summary jsonb;begin
 summary=public.portfolio_analytics_summary(7);
 if (summary->>'views')::int<1 or jsonb_array_length(summary->'daily')<>7 then raise exception 'Incorrect aggregation';end if;
end $$;
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000000',true);
do $$ begin
 if (select count(*) from public.portfolio_analytics_events)<>0 then raise exception 'Non-owner read leaked';end if;
 begin perform public.portfolio_analytics_summary(7);raise exception 'Non-owner summary was allowed';exception when insufficient_privilege then null;end;
end $$;
set local role anon;
do $$ begin
 begin perform count(*) from public.portfolio_analytics_events;raise exception 'Anonymous read was allowed';exception when insufficient_privilege then null;end;
 begin perform public.portfolio_analytics_summary(7);raise exception 'Anonymous summary was allowed';exception when insufficient_privilege then null;end;
end $$;
rollback;
