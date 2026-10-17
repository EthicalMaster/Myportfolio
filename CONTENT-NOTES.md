# Portfolio content reference

Source: Taher's supplied project brief. These are owner-reported implementation details, not an independent code or production audit. Keep public copy concise; preserve this context for later redesign work.

## AVEN — Adaptive Intelligence for Student Learning

Flagship student-only learning platform. Previously EduMate; keep http://edumate-studypartner-production.up.railway.app/ until a replacement URL is supplied. Do not infer a renamed domain.

Goal: Study → Understand → Assess → Measure Mastery → Identify Weaknesses → Track Retention and Forgetting → Adapt → Teach → Reassess. It is intended to adapt to learning progress, rather than only store courses and track completion.

### Implemented foundation

- React, TypeScript, Tailwind frontend; Node.js/Express backend; PostgreSQL.
- Argon2id authentication and server-managed sessions.
- Academic-profile-based curriculum eligibility.
- Practice/exam quiz engine, multiple question types, server-authoritative timing and scoring, results, history and leaderboards.
- Private study-material library; extraction, structuring and chunking for PDF/TXT/Markdown.
- BGE-small-en-v1.5 embeddings (384 dimensions), Qdrant semantic retrieval and student-level isolation.
- Real-time learning analytics; adaptive topic/subject mastery, accuracy, confidence, recent performance, trends and retention calculations.
- Intelligent flashcards with SM-2 spaced repetition.
- AI Gateway with IAIProvider abstraction.

### Not yet established

No fully working production LLM provider. An earlier Groq quiz-generation attempt was rolled back after reliability and integration failures. Do not present current AI generation or conversational teaching as a completed production capability.

### Planned AVEN AI Core

Gemini API is the first candidate, subject to availability, limits and testing. Verify the provider through the existing gateway, then ordinary reasoning and structured responses, then generation grounded in actual retrieved document chunks, then tool contracts, then student-facing workflows.

Use student context, curriculum, uploaded-material retrieval and application knowledge for appropriately leveled teaching, personalized revision, quiz/flashcard generation, recommendations and educational content. Tutor-like teaching and Buddy-like assistance are workflows on shared infrastructure; do not finalize product personas or imply separate models/backends.

Example: a request for 15 medium-difficulty questions from a PDF resolves owned material, retrieves relevant chunks, generates a strict source-grounded schema, validates it deterministically, and only then creates a quiz through the existing engine.

Study-material generation should support academic level and page limits. AVEN validates content, renders the real PDF, enforces the page limit, and re-ingests it through document intelligence, embeddings and retrieval. Controlled research/file tools may come later with attribution and permissions.

The LLM supplies language understanding, reasoning, teaching, planning and generation. AVEN owns context, memory, retrieval, application tools, permissions, validation, rendering and execution. Deterministic services remain authoritative for authentication, ownership, scoring, mastery, retention, analytics, quotas and database changes. No direct LLM database manipulation.

Require student privacy/isolation, rate and cost limits, structured outputs, useful errors and end-to-end tests. Validate generated artifacts before state changes. No fake data, dummy controls, fabricated grounding, unrestricted tools or silent success on failed AI actions.

## FGB Tea

Original frontend: https://fakhri-grains-barwani.vercel.app/#top

Taher built the minimal, premium frontend when the client approached him, and personally purchased and configured fgbtea.com. He has practical domain registration/setup experience. The client now uses a separate Shopdeck-powered website with a payment backend on that domain. Do not attribute Shopdeck's implementation, backend or payments to Taher. Link the portfolio to his original Vercel work.

## Content rules

No invented outcomes, usage metrics, proficiency scores or additional project claims. Preserve the distinction between implemented systems, product goals and future AI capabilities. Education details remain the user's supplied snapshot, pending future updates.

## Builder’s Circuit content provenance

Frontend, backend, retrieval and shipping details come from the supplied AVEN/FGB brief. Google ADK/SmartStudy details come from the previously checked workshop repository. Automation examples come from prior owner-provided project context: Gmail label to Sheets, form response to Slack, invoice attachments to Drive, personalized emails; learning with n8n and Zapier. These are personal learning projects, not paid client deployments or measured business outcomes.

LinkedIn /in/taher-saifee was searched during this update. Only a limited About preview and education snippets were publicly visible. Direct retrieval was blocked. Do not claim a complete LinkedIn review or treat recommended courses, others’ posts or similarly named profiles as Taher’s skills or achievements. Full About and Skills text can be incorporated when the user supplies it.

## Owner update — 17 October 2026

Python: comfortable coding. Has worked with various data-science libraries, but no exact library names supplied. Do not list future machine-learning libraries as current skills. Sketch artist by hobby; Instagram account name Artyvisions (exact handle/URL not supplied). Interests include learning more about AI; favourite subject physics. No other hobbies, awards or proficiency percentages inferred. Interests are not portrayed as professional credentials.
