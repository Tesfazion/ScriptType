# Roadmap, Growth, Monetization, and Launch

## Development roadmap

### Phase 0 — Product foundation
- Confirm content provenance, data protection requirements, success metrics, and interaction prototypes.
- Set up Next.js, TypeScript, design tokens, Firebase emulator projects, environments, CI checks, and accessibility baseline.
- Deliver a guest mode and Firebase Auth entry points; do not make unsupported progress persistence claims.

### Phase 1 — MVP habit loop
- Today's mission and a guided first session.
- Live typing validation, WPM, accuracy, elapsed time, mistakes, completion.
- Initial KJV verse set and journeys with reference/provenance metadata.
- Server-authoritative XP, named level milestones, achievements, timezone-aware streak, weekly goal.
- Personal progress, account settings, responsive experience, product event interface.
- Closed beta; gather qualitative feedback and instrument activation/retention.

### Phase 2 — Version 2 learning and community
- Four memory levels and spaced review.
- Rights-cleared audio practice with replay and accessible controls.
- Optional AI reflection and private journaling, with clear consent/deletion.
- Friends, invite-only groups, opt-in leaderboards and time-bounded challenges.
- Premium entitlements and advanced analytics.
- Admin content authoring, moderation queues, and auditable user-support tools.

### Phase 3 — Scale and partnerships
- Church/school group onboarding and cohort reporting with privacy thresholds.
- Localization and additional translations only after rights, editorial review, and localization QA.
- Content creator workflows, experimentation framework, reliability/security operations, and expansion based on evidence.

### Quality gates
Each phase must pass type/lint/build checks, unit tests for scoring/reward boundaries, Firebase Emulator tests for rules and functions, keyboard/screen-reader review, responsive checks, privacy review, and measured performance budgets. Community/AI/payment features additionally require their specific safety and compliance review.

## MVP roadmap and launch boundary

MVP is intentionally narrow: public landing + sample challenge; email/Google auth; daily mission; keyboard typing; a curated journey; server-backed XP/levels/streaks/achievements; progress; privacy/settings; and accessible responsive UI. It excludes public leaderboards, unmoderated social features, paid processing, AI journaling, and unverified audio. Invite-only small cohorts may be used for learning after moderation operations are ready.

MVP exit criteria: a new user can finish a first practice successfully; returning user can continue; all rewards are deduplicated and server-validated; core funnel/retention events have privacy review; and no critical accessibility/security issue remains.

## Growth strategy

1. **Activation:** landing page has an interactive sample without a gate; onboarding asks only for weekly goal, timezone, and journey preference; first meaningful win occurs in one short session.
2. **Habit:** mission is predictable and easy to resume; users pick their own goal and reminder; weekly reflection celebrates consistency without shame or forced notifications.
3. **Progress:** show a personal baseline and non-comparative skill improvement; unlock the next manageable verse/path step rather than an endless feed.
4. **Referral:** share a verse challenge or invite to a private group with preview, expiration, privacy defaults, and no contact scraping.
5. **Group distribution:** equip church/Bible study leaders with a lightweight invitation and weekly challenge; offer aggregate reporting only above privacy thresholds.
6. **Content loops:** seasonal reading journeys and community-created, reviewed challenges; disclose translation and content provenance.
7. **Measurement:** run small experiments on mission clarity, session length, and return prompts; pre-register primary metric/guardrails and roll back regressions.

Growth guardrails: no dark-pattern streak timers, manipulative push notifications, purchased reward boosts, or targeting based on sensitive spiritual/journal data.

## Monetization strategy

- **Free:** core typing practice, starter journeys and basic reading plans, daily streaks, baseline progress, accessibility features, account export/delete.
- **Premium:** advanced analytics, deeper memory review, audio mode, AI reflection, advanced challenges, and expanded journey catalog, subject to operating/content costs.
- Use a transparent monthly/yearly subscription with pricing, trial duration, renewal, cancel, and feature boundaries shown before checkout. No ads in Scripture or journaling surfaces.
- Validate willingness-to-pay in interviews and opt-in pilots before locking feature boundaries; do not take payment until receipts, refunds, and entitlement reconciliation are implemented and tested.
- Family/school/church plans are a later channel option, not an MVP dependency. Protect child data and avoid public rankings for minors.

## Launch strategy

1. **Preflight:** verify KJV text source/edition; secure audio rights or omit audio; complete privacy/terms, age guidance, deletion/export, consent, accessibility, moderation, and incident-response review.
2. **Internal alpha:** test Firebase Emulator flows, scoring, rules, function idempotency, and synthetic account deletion.
3. **Closed beta:** invite a small mix of individual users and study groups; use opt-in feedback, clear demo/staging labels, and weekly cohort review.
4. **Public launch:** gradually open signups, monitor first-session completion, D1/D7 retention, function errors, duplicate rewards, and abuse reports; maintain a rollback/feature-flag path.
5. **Post-launch:** review cohorts and qualitative feedback weekly; improve the first-session and return-to-practice experience before expanding feature breadth.

Launch channels: founder/community outreach, church and campus Bible-study partnerships, Christian education newsletters, product demo clips showing live Scripture typing, and referral links to a shared challenge. All social proof must be real and permissioned; do not invent endorsements or traction metrics.

## Operational readiness

- Dashboards: signup-to-first-practice, meaningful practice users, day/week retention, challenge completion, reward anomalies, auth/function error rate, moderation response, deletion requests.
- On-call runbook for auth outage, reward corruption, unauthorized data access, harmful group content, and provider/API incidents.
- Feature flags for AI, community, premium, and audio; ability to disable each without breaking core practice.
- Data backups, restore drills, rate limits, App Check, access reviews, and documented incident communications.
