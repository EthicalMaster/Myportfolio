-- Run ONCE in a new, dedicated Supabase project's SQL Editor.
-- No changes should be applied to Sarra's project.
begin;
create table public.portfolio_owners (user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.portfolio_owners enable row level security;
revoke all on public.portfolio_owners from anon, authenticated;
grant select on public.portfolio_owners to authenticated;
create policy owner_self on public.portfolio_owners for select to authenticated using (user_id=(select auth.uid()));

create table public.portfolio_documents (
 kind text primary key check (kind in ('draft','published')),
 body jsonb not null,
 revision integer not null default 0,
 updated_at timestamptz not null default now()
);
insert into public.portfolio_documents(kind,body) values ('draft','{}');
alter table public.portfolio_documents enable row level security;
revoke all on public.portfolio_documents from anon, authenticated;
grant select on public.portfolio_documents to anon, authenticated;
create policy published_read on public.portfolio_documents for select to anon, authenticated using (kind='published');
create policy owner_read on public.portfolio_documents for select to authenticated using (exists(select 1 from public.portfolio_owners where user_id=(select auth.uid())));

create table public.portfolio_history(id bigint generated always as identity primary key,body jsonb not null,created_at timestamptz not null default now());
alter table public.portfolio_history enable row level security;
revoke all on public.portfolio_history from anon,authenticated;
grant select on public.portfolio_history to authenticated;
create policy owner_history on public.portfolio_history for select to authenticated using (exists(select 1 from public.portfolio_owners where user_id=(select auth.uid())));

create function public.save_portfolio_draft(new_body jsonb,expected_revision integer) returns integer
language plpgsql security definer set search_path='' as $$
declare current_revision integer;
begin
 if not exists(select 1 from public.portfolio_owners where user_id=auth.uid()) then raise exception 'Owner access required' using errcode='42501'; end if;
 select revision into current_revision from public.portfolio_documents where kind='draft' for update;
 if current_revision<>expected_revision then raise exception 'Draft changed in another session. Export your edits, reload, and reconcile before saving.'; end if;
 if new_body->>'version' is distinct from '1' or jsonb_typeof(new_body->'values') is distinct from 'object' or jsonb_typeof(new_body->'collections') is distinct from 'object' or jsonb_typeof(new_body->'socials') is distinct from 'object' or jsonb_typeof(new_body->'resume') is distinct from 'object' or octet_length(new_body::text)>1000000 then raise exception 'Invalid content document'; end if;
 update public.portfolio_documents set body=new_body,revision=revision+1,updated_at=now() where kind='draft';
 return current_revision+1;
end $$;
revoke all on function public.save_portfolio_draft(jsonb,integer) from public,anon;
grant execute on function public.save_portfolio_draft(jsonb,integer) to authenticated;

create function public.publish_portfolio(expected_revision integer) returns integer
language plpgsql security definer set search_path='' as $$
declare content jsonb;current_revision integer;collection record;cleaned jsonb;files jsonb;
begin
 if not exists(select 1 from public.portfolio_owners where user_id=auth.uid()) then raise exception 'Owner access required' using errcode='42501'; end if;
 select body,revision into content,current_revision from public.portfolio_documents where kind='draft' for update;
 if current_revision<>expected_revision or current_revision=0 then raise exception 'Save the latest draft before publishing'; end if;
 for collection in select * from jsonb_each(content->'collections') loop
  select coalesce(jsonb_agg(value),'[]'::jsonb) into cleaned from jsonb_array_elements(collection.value) where value->>'visible'='true';
  content=jsonb_set(content,array['collections',collection.key],cleaned);
 end loop;
 if content#>>'{resume,enabled}' is distinct from 'true' then content=jsonb_set(content,'{resume,file}','""');end if;
 content=content-'assets';
 select coalesce(jsonb_agg(distinct substring(value#>>'{}' from 7)),'[]'::jsonb) into files
 from jsonb_path_query(content,'strict $.** ? (@.type() == "string")') as x(value)
 where value#>>'{}' ~ '^asset:[a-f0-9-]+\.(pdf|png|jpg|webp)$';
 content=jsonb_set(content,'{assets}',files);
 insert into public.portfolio_documents(kind,body,revision) values ('published',content,current_revision)
 on conflict(kind) do update set body=excluded.body,revision=excluded.revision,updated_at=now();
 -- History stores the complete private draft, including hidden entries.
 insert into public.portfolio_history(body) select body from public.portfolio_documents where kind='draft';
 return current_revision;
end $$;
revoke all on function public.publish_portfolio(integer) from public,anon;
grant execute on function public.publish_portfolio(integer) to authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values
 ('portfolio-files','portfolio-files',false,10485760,array['application/pdf','image/jpeg','image/png','image/webp']);
create policy portfolio_upload on storage.objects for insert to authenticated with check
 (bucket_id='portfolio-files' and name ~ '^[a-f0-9-]+\.(pdf|png|jpg|webp)$' and exists(select 1 from public.portfolio_owners where user_id=(select auth.uid())));
create policy portfolio_owner_files on storage.objects for select to authenticated using
 (bucket_id='portfolio-files' and exists(select 1 from public.portfolio_owners where user_id=(select auth.uid())));
create policy portfolio_published_files on storage.objects for select to anon,authenticated using
 (bucket_id='portfolio-files' and exists(select 1 from public.portfolio_documents where kind='published' and (body->'assets') ? storage.objects.name));
-- Immutable filenames: no client UPDATE/DELETE grant. Replacements are new uploads.
-- Unpublishing revokes new file access; previously issued signed URLs expire in 5 minutes.
commit;

-- After creating your owner user in Authentication > Users, run separately:
-- insert into public.portfolio_owners(user_id) values ('COPY_AUTH_USER_UUID_HERE');
-- Do not authorize via editable user_metadata or just an email field in the browser.
