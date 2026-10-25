# Portfolio Studio setup

The dashboard lives at `/admin/`. Until connection settings exist, it explicitly shows **Setup required**. The editor can be explored and previewed without saving; uploads, cloud saves and publishing stay disabled. The public portfolio remains its existing static version. No certificates or résumé have been invented.

## Connect a dedicated Supabase project

1. Create a **separate Taher portfolio project** in your chosen Supabase organization. Do not run this setup in Sarra's database. Confirm any cost before creating it.
2. Run `backend/setup.sql` once in that project's SQL Editor. It creates draft/public documents, publication history, an owner allowlist, a private storage bucket and access policies. This bootstrap is intentionally not rerunnable.
3. In Authentication, disable public signups. Create your own email/password user through the Supabase dashboard. Use a strong unique password. Add that user's UUID to `public.portfolio_owners` using the final commented SQL statement. The browser cannot grant owner access.
4. Set the project URL and **publishable key** (or legacy anon key) in `dist/cms-config.js`. These are public settings. Never use a service-role or secret key. Supabase must allow requests from the deployment origins. Do not put credentials into a Git bundle.
5. Open `/admin/`, sign in, edit one field, save a draft, preview both pages and publish. The first save initializes the document from the bundled content. Content changes appear via the published API on page load and require no Git deployment. Structural/layout changes still need code and deployment.
6. Test signed-out and unrelated signed-in accounts before relying on the dashboard. Only the owner's UUID may save, upload, read drafts/history, or publish. Run Supabase security advisors after applying the SQL.

## Required live acceptance checks

- Signed out: published document readable, draft/history/owner rows inaccessible, mutations rejected.
- Authenticated non-owner: same restrictions; upload and RPC publish/save rejected.
- Owner: save → private preview → publish succeeds; another browser sees published content.
- Private file upload: anonymous signing/download fails before publishing; works after a visible item is published. Hidden certificate entries and disabled résumé files must not be in published assets.
- Replace/hide résumé: new publication no longer grants access to the old file. Already issued signed links expire after five minutes; downloaded copies cannot be revoked.
- Two owner tabs: save in one, then save in the other; the stale save must be rejected without overwriting.
- Test certificate PDF, portrait image, separate Instagram links, mobile preview and sign-out.

These live checks have not been run until a project is connected. SQL and client code are included for review; setup is not represented as an already secured live service.

## Editing and recovery

Existing page copy covers the original content on both pages, using stable selectors and text-node positions so layout markup is preserved. Builder's Circuit has its own structured editor. After a future structural HTML change, update `cms-fields.json` and migrate stored values deliberately; do not regenerate keys blindly.

Collections let you add, reorder, hide and remove certificates, projects, education, skills, interests, experience, achievements and artwork. New entries extend the original sections. Hiding a major section can leave original navigation pointing to a hidden section; adjust navigation when making a major structural change.

Images and PDF uploads are limited to 10 MB. File extensions are generated, basic file signatures are checked in the UI, and MIME/size restrictions are enforced by storage. This is not a malware scanning service. Only the owner can upload. Files are immutable; removal detaches them from content, and unreferenced originals are retained privately for recovery. Delete obsolete private files through the storage console only after checking publication history.

Every publish keeps a private history entry. Restore a history item to the editor, save and publish to roll back. Exported JSON backs up content and file references; download storage separately for a complete backup. The frontend stores owner tokens in sessionStorage for the current tab, not in source or content exports. If the session expires, sign in again.

The shipped HTML is a static fallback if the published API is unavailable. It may show older bundled content during an outage. For critical removal of personal information, update the static fallback as well. Search engines and no-JavaScript clients may see that fallback; automatic static regeneration is not part of this version.

## Studio 0.12 — projects and audience

The existing projects now have dedicated editors in Projects. They update the original CMS value keys, so stored content is retained. AVEN and SmartStudy support optional cover uploads; remove the image to restore their motion illustration. FGB Tea and Sarra have separate visibility controls. Education edits include the original degree fields and CGPA. Page content provides section filtering and search for the rest of the existing copy. Added collection entries can be reordered; original project layouts retain their original order.

Analytics uses your existing Supabase project, not a paid analytics subscription. The `portfolio_analytics_owner_dashboard` migration and `portfolio-analytics` Edge Function were applied to Taher's project on 25 October 2026. No new Vercel environment variables or API secrets are needed. Your existing public Supabase configuration must be present. The update bundle deliberately leaves `dist/cms-config.js` untouched.

Counters start after the updated frontend is deployed; previous traffic cannot be recovered. The owner sees 7/30/90-day views, approximate tab-session visits, project/contact clicks, daily counts, page/device/referrer breakdowns and resume clicks in the destination table. Different tabs/days may count the same person again. Blockers, unavailable services, DNT/GPC and opt-out lower counts. This is first-party usage measurement, not a list of identifiable viewers.

No raw IP addresses, full URLs, query strings, emails, chat text or fingerprint are stored. The Edge Function hashes the visitor IP for short-lived rate limiting, and hashes the tab UUID with a daily salt. Referrers are hostnames only. An opt-out is in the public footer; analytics can be disabled through Section visibility > Audience measurement, then Save and Publish. Owner-session tabs, embedded previews and local development do not collect events. Data is retained for 90 days and pruned on the next accepted collection request. Rate limits: 30 events/minute per hashed IP, 300/minute globally and 10,000/day globally. Analytics errors never block the portfolio.

For a fresh database only, apply `analytics-setup.sql` after `setup.sql` and `assistant-setup.sql`. Deploy the two files in `portfolio-analytics/` as `portfolio-analytics`; it validates the public API key itself. `PORTFOLIO_ALLOWED_ORIGINS`, if set, must include the actual public domain. Defaults cover tsportfolio-sandy.vercel.app and the Sites preview origin.

Validation: build, CMS and dashboard model checks; original AVEN edit propagated into owner preview; desktop and 390px dashboard layout checked; live edge event returned 204 and its isolated test row was removed; rollback-only SQL tests verified aggregation, deduplication, owner access and anon/non-owner denials. Owner login/upload/save/publish were not repeated in a live browser session. The security advisor reports the pre-existing intentional owner-checked save/publish definer functions, the server-only rate table without client policies, and disabled leaked-password protection: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection . No analytics-specific advisory was reported.
