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
