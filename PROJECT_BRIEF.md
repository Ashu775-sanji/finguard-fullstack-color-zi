# FinGuard — Master Project Brief

Use this document as the prompt brief for rebuilding or extending FinGuard. Each page brief is written so it can be pasted directly to an AI agent (or a developer) with the shared system prompt below.

## Role statement

> Act as a senior fintech product designer + lead full-stack engineer. Build like a small studio shipping a real product: opinionated design, honest microcopy, every data state considered. Verify before claiming done: typecheck, production build, then load and test each route.

## Stack

| Layer | Choice |
|---|---|
| Frontend | React 18 + TypeScript 5 + Vite 5, react-router-dom (`HashRouter` for GitHub Pages SPA routing) |
| UI libs | framer-motion (page reveals), recharts (charts), lucide-react (icons) |
| Styling | Hand-written CSS system (`styles.css`, `modern.css`, `section-art.css`) — CSS variables, no framework |
| File handling | pdfjs-dist (client-side statement reading), jspdf (PDF exports) |
| Backend | FastAPI (Python 3.12), SQLAlchemy 2, Argon2 passwords, short-lived JWT, Pydantic settings from `.env` |
| ML | scikit-learn ensemble — Z-score + Isolation Forest + Local Outlier Factor; regression expense forecasts |
| AI | Gemini server-side only, grounded in the user's authenticated records; deterministic fallback |
| Data | PostgreSQL in production (Render), SQLite in dev; realistic labeled demo seed |
| Hosting | Frontend on GitHub Pages (auto-workflow `deploy.yml` pushes `main` → `gh-pages`); backend on Render free tier |
| Secrets | Environment only. Never in the frontend bundle. Never echoed into validation errors. |

## Design system (never deviate)

- **Canvas**: deep navy `#080b12`, layered surfaces `#101520 → #181f2d`, 1px `rgba(255,255,255,.08)` borders
- **Accent**: lavender-blue `#7c8cff` → violet `#a78bfa` gradients; semantic green `#34d399`, yellow `#facc15`, red `#f87171`
- **Type**: Inter. Display numerals with `-2px`+ letter-spacing; eyebrow labels in ALL CAPS, `0.16em` tracking; generous line-height on body (1.6–1.75)
- **Motion**: 200ms ease-out fades/slides, cinematic hero only; honor `prefers-reduced-motion` everywhere
- **Light theme**: full parity via `[data-theme="light"]` variables; fixed dark "material" surfaces stay dark in both themes
- **Feel**: Linear/Stripe-grade restraint. No filler, no lorem ipsum, no gray placeholder boxes. Every statistic labeled honestly (`SAMPLE ANALYSIS`, `model estimate`, `not proof of fraud`)
- **A11y**: visible `:focus-visible` rings, 44px min touch targets, `aria-label` on icon buttons, accessible data tables behind every chart
- **Every screen ships with**: loading → loaded → empty → error states, and an offline/waking-backend message where the API is slow

---

## Page briefs

### Public

1. **Landing (`/`)** — Cinematic marketing page. Hero: animated 3D shield with orbit rings, drifting transaction particles, scroll-driven parallax. Story sequence (4 chapters: money moves → AI detects → threat identified → FinGuard guides), platform feature rail, message-scan cinema, expense category world, recovery steps, AI preview, trust section, final CTA, footer. In-page nav links smooth-scroll without touching the router hash. Mood: calm confidence, not hype.

2. **Login (`/login`)** — Split screen. Left: brand story, glowing auth headline, proof points, API status card. Right: glass form card with three modes — sign in / register / recovery — driven by one form, inline errors in rose, success in mint. Redirects to `/dashboard` on success. No demo-credentials pressure; the demo account is documented in the README.

### Workspace shell (`/app/*`, sidebar + header)

Shell: collapsible sidebar with grouped nav (Overview / Security / Intelligence / Learn / System), live unread-badge on Alerts, notifications popover, theme toggle, profile menu, global "Analyze a scam" button that opens a right-side drawer anywhere in the app, mobile bottom dock, route-transition motion, page titles in the header.

3. **Dashboard (`/dashboard`)** — The signature screen. Storytelling scroll: greeting + Guard Score with an interactive material shield (components as satellite cards), rotating floating insight card (Security / Savings / Prediction), four-signal snapshot ribbon, money-movement flow with clickable transaction bubbles, risk moment card, sticky spending narrative with 7D–1Y chart period filters and an accessible data table, recent ledger, financial-security alert links, grounded "Fin AI" prompt block. Must degrade to clearly-labeled demo data when the API is unreachable, with a visible `DEMO ENVIRONMENT` banner and a motion on/off toggle.

4. **Scam Analyzer (`/app/scam-analyzer` + global drawer)** — Paste message, optional URL. Returns explainable verdict: risk dial (x/100), classification, detected signals, plain-language explanation, ordered next steps, confidence note. Hard safety boundary: warn against pasting passwords/OTP/PIN/CVV; client-side secret detector blocks it; results stored as private safety context that grounds Fin AI. Loading state: staged "analysis journey" indicator.

5. **Transaction Monitor (`/app/transaction-monitor`)** — Two panels: a clearly-labeled live simulation stream (transaction → feature extraction → ML scoring → alert, with pause/resume) and a real CSV import (validated columns, limits, precise row errors). Never presented as live bank data.

6. **Incident Center (`/app/incidents`)** — Create documented incidents (title, datetime, scam type, amount, method, references, description) with a `FG-###` incident code; cards show risk level + progress along Documenting → Reported → Resolved. Copy states plainly the platform cannot recover funds.

7. **Recovery Assistant (`/app/recovery`)** — Calm, prioritized checklist (stop contact → verify via official channel → preserve evidence → report officially → monitor). Progress persisted locally, percentage overview, guidance drawer with official links (e.g., cybercrime.gov.in, helpline 1930) and a verification disclaimer.

8. **Evidence Vault (`/app/evidence`)** — Per-incident evidence timeline (screenshots/urls/receipts/IDs as references only — never credentials), incident picker, PDF export with an honest footer. Empty state: "No incident selected" with a link to create one.

9. **Scam Education (`/app/education`)** — Expandable lesson cards (UPI scams, fake KYC, phishing, job scams…) each with "what not to do" vs "what to do", plus a data-transparency notice about anonymized public datasets.

10. **Transactions (`/app/transactions`)** — Search + type-filter data table, risk tags with scores, add-transaction modal, CSV import, delete with confirmation, `DEMO DATA` banner whenever fictional fallbacks render.

11. **Analytics (`/app/analytics`)** — Metric row (income/expenses/balance/savings rate), income-vs-spending area chart, category pie with a textual breakdown fallback, empty states that tell the user exactly what history is missing.

12. **Anomaly Center (`/app/anomalies`)** — Explainable anomaly table (score, risk tag, reason, date) + "evaluate a transaction" prospective check returning score/level/reason/recommended action with the model-signal disclaimer. Model cards show sample sizes and metrics.

13. **Forecasts (`/app/forecasts`)** — Month+1..N prediction cards (estimate, bounded range, confidence bar, model name), expected-range bar chart, "prediction unavailable" honest empty state, refresh action.

14. **Budgets (`/app/budgets`)** — Category budget cards with progress bars at actual spend, nuance copy past 80%, create-budget modal; empty state with primary action.

15. **Goals (`/app/goals`)** — Goal cards (saved/target, progress, months-remaining estimate) with add-goal modal and timeline copy grounded in recorded savings.

16. **Fin AI (`/app/assistant`)** — Grounded chat copilot. Suggestion chips, bounded history (last 6 turns), streaming-style "reading your account context" state, each answer cites model + sources, refuses to invent numbers, blocks users from sending credentials, shows a live-context sidebar and a data-boundary card.

17. **Reports (`/app/reports`)** — Generate a monthly report from actual backend records (never placeholders), with CSV export; guard-score and savings-rate cards; precise error states.

18. **Settings (`/app/settings`)** — Profile facts, change-password form (match validation, min length 10, real API errors), security status card that is honest about what is and isn't configured (e.g., no 2FA).

### Signature experiences

19. **Money Replay (`/app/replay`)** — Chaptered playback of a financial month: progress dots, 1.8s auto-advance with play/pause/restart, chapter cards (risks freeze-frame with reasons, moves get a single next-action), live ledger synced to the chapter.
20. **What-If Playground (`/app/playground`)** — Three live sliders (reduce food, cancel subscriptions, add savings) driving instant outcome cards (new savings, Guard score, goal ETA, 12-month impact) plus one recommended move.
21. **Statement Drop (`/app/import`)** — Drag-drop CSV/statement-PDF zone processed 100% in-browser (pdfjs), scan animation while reading, honest error for unreadable files, summary results, explicit "review before saving" copy.
22. **Financial Season (`/app/season`)** — Monthly ritual: season hero with score, biggest win / biggest risk / next focus cards, tap-to-reveal achievement cards, one-click "Download season" PDF.

---

## Engineering rules (apply to every page)

- Auth-guarded routes redirect to `/login`; API 401 clears the session silently and re-prompts.
- API base URL from `VITE_API_URL`; axios interceptors attach the token and normalize all errors into human sentences (timeout → "Render may be waking up…").
- Every chart has a visually-hidden accessible table; every icon button has an aria-label; risk words are consistently displayed (`MEDIUM` → `MODERATE`, `HIGH`, `CRITICAL`).
- Money: `₹` with `en-IN` formatting, tabular numerals, signed income (`+`/`-`).
- No secret ever enters a request body or a log line. Validation errors never echo submitted values.
- Verify: `npx tsc -b` (0 errors), `npm run build`, backend `pytest` from `backend/`, then load each route in a real browser.

## Deployment

- Push to `main` → GitHub Actions builds and publishes `gh-pages` → live at https://ashu775-sanji.github.io/finguard-fullstack-color-zi/
- Backend: Render blueprint (`render.yaml`) — free web service + Postgres, generated `SECRET_KEY`, CORS allow-listed to the Pages origin, demo seeding enabled via `SEED_DEMO=true` + `DEMO_PASSWORD`.
