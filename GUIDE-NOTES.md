# Portfolio guide — first release

This release implements the character and guided tour stage. It is **not conversational AI**: there is no language model, chat field, microphone capture, API key, or visitor transcript collection.

An expressive SVG robot greets visitors quietly once per tab session after the intro. It never opens the full panel or plays audio automatically. Visitors can start a step-by-step tour, ask for the current section's explanation, pause character motion, minimize, or dismiss. A footer button reopens it. Dismissal and motion preference are kept in sessionStorage; access failures do not break the guide.

The home tour visits the sculpture, AVEN, SmartStudy, websites, skills circuit, about and contact. The skills tour activates the appropriate Build / Explore / Sketch tab. Published collection sections become tour stops when CMS content loads. Quotes come from the rendered page, so the dashboard's published text is used when available; the same static fallback limitation as the rest of the site applies during CMS failures.

Optional **Read aloud** uses browser speech synthesis, only after an explicit click. Changing stop, ending/minimizing/dismissing, opening another modal, hiding the tab or leaving the page stops speech. Voice availability and pronunciation depend on the browser/device. It is narration, not a voice conversation. No paid speech service is configured by this project.

The existing floating command shortcut is replaced by the guide to avoid two overlapping widgets. Header and mobile command-menu access remain available. The hero sculpture and existing animations are untouched. Reduced-motion settings disable character animation and use instant tour navigation; the character can also be paused manually. The widget stays out of owner previews.

## Next stage: real AI

Connect a provider through a server-side endpoint. Keep provider secrets off the frontend, retrieve only the public published content, enforce request and spend limits, and return honest unavailable responses on failures. Answers must distinguish implemented work from future plans and offer citations to relevant portfolio sections. The current guide must not be described as AI chat until that connection is implemented and tested. Choose a provider and budget before deployment of that stage.

## Verification

`npm run build`, `node scripts/test-guide.mjs`, and existing CMS/motion checks. Browser QA was unavailable in the authoring environment. Before merging, check the first-visit greeting after intro, both page tours, keyboard/Escape, mobile rail clearance, reduced motion, speech stop controls, dismissal/reopen, and quotations after a dashboard publication. Check that your local `dist/cms-config.js` connection remains unchanged when applying the bundle.
