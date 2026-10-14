# Taher Saifee — interactive portfolio

Interactive portfolio with the Builder’s Circuit and keyboard explorer: reactive particle hero, selected real projects, interactive SmartStudy workflow explanation, portrait, verified education and contact section.

## Run locally

Install Node.js 20 or newer. Extract this package, open the folder in VS Code, then run:

```sh
npm run dev
```

Open http://localhost:3000. Refresh after edits. No npm install is needed: this standalone HTML/CSS/JavaScript version has no runtime dependencies or API keys. It is a fresh implementation, not the old Next.js project.

Validate before deployment:

```sh
npm run build
```

## GitHub

Create a new empty repository for the redesign. Upload the extracted contents, not the ZIP. Keep the `dist` and `scripts` folders, package.json, vercel.json, README.md, CONTENT-NOTES.md and .gitignore. `dist` contains the authored source: do not delete it.

Or run these commands inside the extracted folder, then follow your GitHub repository's instructions to add its remote and push:

```sh
git init
git add .
git commit -m "Build interactive portfolio redesign"
git branch -M main
```

No personal GitHub repository has been modified by the assistant.

## Vercel

Import the new repository. Set Framework Preset to **Other**, Build Command to **npm run build**, and Output Directory to **dist**. These are also defined in vercel.json. No environment variables are required. If using your old Vercel project, remove its Next.js preset override first.

## Edit

- dist/index.html — copy, education, project and contact links.
- dist/style.css — colors, layout, responsive design, artwork and transitions.
- dist/motion.js — particle sculpture, shape controls and pause behavior.
- dist/interactions.js — menu, workflow steps, email copying, pointer and scroll effects.
- dist/intro.js + dist/intro.css — circuit-monogram opening sequence, readiness checks and mobile refinements.
- dist/explore.js — six skill connections with project evidence; searchable native-dialog explorer.
- dist/portrait.jpg — portrait from your original supplied project.
- scripts/dev.mjs — dependency-free local server.
- scripts/build.mjs — JavaScript syntax, assets and internal-anchor checks.

## Content evidence

Education is the user's October 2026 snapshot: B.Tech CSE/Data Science at Acropolis, first year/first semester; IIT Madras BS Foundation second term, two current courses, three previous-term courses completed with A grades and overall CGPA 9.

AVEN is the flagship project, previously called EduMate. Its existing Railway URL is retained until the user supplies a new address. Implemented features and the planned AI Core are based on the user's detailed project brief, not an independent backend audit. No production LLM integration is claimed. The artwork is a labeled concept illustration, not a screenshot. See CONTENT-NOTES.md for the technical brief and content boundaries.

SmartStudy's sequential, parallel and review-loop structure was checked against the README and agent.py in EthicalMaster/google-adk-workshop-agents. Its workflow is an explanation, not live AI execution.

FGB Tea links to https://fakhri-grains-barwani.vercel.app/#top, the user's original frontend. Their scope covers frontend design/development and purchasing/configuring fgbtea.com. That domain now serves a separate Shopdeck-built website and payment backend, which must not be credited to the user. Sarra's architecture portfolio remains a user-reported project. External availability was not confirmed during this content update. No invented skill ratings, client counts or outcomes are included.

## Motion and accessibility

Native scrolling and details elements, semantic links, visible focus, Escape-close mobile navigation, clipboard failure feedback, reduced-motion support and manual sculpture pause. The canvas stops when hidden/offscreen. A no-JavaScript fallback retains readable content and navigation.

Source validation and interaction simulations pass. Browser visual QA is still pending because the supported preview-browser environment was unavailable. Please check desktop, mobile and keyboard navigation before promoting this as the main portfolio.

## Design references

Original implementation, informed by the principles in:
- https://tympanus.net/codrops/2026/04/28/more-than-a-portfolio-building-a-scroll-driven-3d-world-with-something-to-say/
- https://tympanus.net/codrops/2026/03/09/building-a-scroll-reactive-3d-gallery-with-three-js-velocity-and-mood-based-backgrounds/

## Interactive exploration

The Builder’s Circuit connects six areas of practice to concrete work: interfaces, systems, retrieval, agents, automation and shipping. Select nodes or use “Trace another connection”; the evidence panel and project link update together. The diagram is an explanation of experience, not live system telemetry. Node transitions are short and bounded.

“Explore this mind” opens a native modal dialog with local search across authored portfolio destinations. Ctrl/Command+K opens it; Up/Down moves through matches; Enter opens a result; Escape closes it and restores focus. No backend, AI request, tracking, API keys or external data collection is involved. The hero supports a click/tap pulse and an equivalent keyboard-operable button. Reduced motion keeps state changes instantaneous.

Interaction simulations cover every skill selection, cycle wrap, valid destinations, multiword search, empty and HTML-like search input, arrow navigation, Enter, keyboard opening and Escape/focus restoration. Browser layout and screen-reader verification remain pending because the supported browser environment was unavailable.

LinkedIn review: public search exposed a short About preview for the supplied /in/taher-saifee URL, but direct access was blocked and a full skills list was unavailable. No LinkedIn skills, endorsements, job titles or post-derived achievements were invented. Automation examples use prior owner-provided learning-project context. Review those with Taher before turning them into detailed case studies.

## Opening sequence and mobile layout

A custom SVG T/S circuit monogram assembles into a brief opening sequence. The three readiness checks are actual document parsing, typography readiness and successful loading/execution of the three deferred interaction scripts. The count is checks completed, not a network download percentage. A minimum 1.45-second visual sequence plus a 0.55-second reveal is used for ordinary motion; reduced-motion visitors get no intentional delay. Skip and Escape immediately open the page. Failed scripts or an overall 4.5-second timeout release the overlay without claiming readiness.

The intro runs on fresh visits and ordinary refreshes. Fragment destinations, in-page navigation and browser-history restoration bypass it. No session tracking or persistent visitor identifiers are used. The dialog is hidden by default, so a missing intro script or disabled JavaScript does not block the site.

Phones get a safe-area-aware bottom navigation bar, active-section indication, a larger dropdown menu, a bottom-sheet search dialog, larger reading type and touch controls, a framed sculpture, and a two-column skill selector. Desktop retains the connected circuit diagram. Portrait and project art retain native sizing constraints. No extra animation library, font download or video asset was added.

Run `node scripts/test-intro.mjs` for readiness, failed-script, timeout, skip, Escape, reduced-motion and history/deep-link checks. These simulations pass; mobile layout, touch behavior and screen-reader behavior still need real browser/device verification.

## Motion refinement

Scroll-linked transforms and pointer tilt now use frame-rate-independent exponential smoothing, with a single settling animation loop for those effects. Native page scrolling is retained. Particle targets are cached; persistent depth/color buckets replace per-frame sorting and thousands of independent fills with at most 24 fills. Pulse amplitude eases in and decays. Pausing preserves an in-progress morph instead of snapping to its destination. The sculpture waits until the intro closes and stops offscreen or in hidden tabs.

Progress uses a transform instead of layout width. Project arrivals use translation instead of animated clipping; website-link hovers no longer animate padding. Skill-panel transitions cancel cleanly without forcing a layout read.

Source checks, intro regression tests and a particle-render simulation passed (finite coordinates, drawing batch limit, pause continuity, pulse and hidden-tab stop). Actual frame rates and device smoothness were not measured; supported browser profiling remains unavailable.
