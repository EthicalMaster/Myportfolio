# Groq assistant — v0.11.0

The portfolio-assistant Edge Function and assistant-setup.sql migration have been deployed to Taher's project vwlxaesvvuitxqlmexsp. Existing portfolio documents and login configuration were preserved.

## Activate
1. Create an API key in your Groq Console free account. Do not enable a paid plan for this setup.
2. In Supabase > taher-portfolio > Edge Functions > Secrets add GROQ_API_KEY with that key. Never put it in dist, GitHub, a chat message or a Vercel frontend variable.
3. Apply the accompanying Git bundle, build, and push your main branch to deploy the UI on Vercel.
4. Test Chat from the robot. Review a test enquiry before sending, then sign into /admin/ and open Requests to verify it. No live model call has been tested yet because the key is not configured.

No new Vercel environment variable is required. Your existing dist/cms-config.js must retain your public Supabase URL/key. The Sites demonstration copy does not include your local connection settings.

Default model: openai/gpt-oss-20b. Optional backend GROQ_MODEL changes it; check Groq model availability first. Optional PORTFOLIO_ALLOWED_ORIGINS is a comma-separated list of full origins. Defaults allow https://tsportfolio-sandy.vercel.app, https://taher-motion-study.iamspectrehq.chatgpt.site, http://localhost:3000 and http://127.0.0.1:3000. Add your actual domain if different.

## Behavior and limits
Chat uses only the published CMS document. It does not receive drafts, enquiry records or credentials. It uses at most six prior messages and a bounded selection of public content; answers can still be imperfect. Hiding an original nested project conservatively excludes its Work group from chat knowledge. Hidden education excludes About. Publish content edits to refresh knowledge.

The visitor authors a request, reviews the exact fields, consents and confirms. Only then is it saved; no chat transcript is attached. Request submission works independently of Groq. Owner Requests lists up to 100 recent items with filters, status changes, delete and a mailto reply. Emails are not sent automatically. This is the first inbox workflow, not autonomous scheduling or email management.

Chat has global limits of 20/minute and 300/day, plus 6/minute and 40/day per hashed IP. Requests: global 10/minute and 100/day, plus 2/minute and 5/day per hashed IP. Shared networks share limits. Provider limits may be lower. There is no paid fallback or automatic retry cascade. A busy/unavailable response keeps tour and contact available; no service can promise zero 429s/outages. Request UUIDs prevent duplicates on retry.

Voice remains off: conversational text tone is improved, but a new expressive speech engine has not been integrated. The refined robot and authored tour remain intact.

## Validation
Run npm run build and node scripts/test-assistant.mjs. Backend permissions verified: anonymous visitors cannot read requests or invoke admission counters. Live model responses and a complete authenticated owner workflow still require testing after activation.

For a fresh project only, apply backend/assistant-setup.sql after the main CMS setup. Deploy index.ts, core.mjs and fields.json in backend/portfolio-assistant as portfolio-assistant. The function checks the public API key itself and is deployed without gateway JWT verification. Service role credentials stay exclusively in the Edge Function. The published key is not a secret or anti-abuse boundary; database limits protect capacity.
