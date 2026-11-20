# ScriptType Product Requirements

## Product promise

**Improve your typing speed through a guided curriculum while retaining meaningful Scripture practice.** ScriptType combines a 15-lesson keyboard-learning journey with Scripture memorization, reflection, and measurable growth.

## Problem and opportunity

Bible reading, memorization, and typing practice are usually separate activities. Scripture apps can make daily reading feel passive; typing sites lack a purpose users care about. ScriptType combines active recall and deliberate practice with a calm, rewarding routine.

## Audiences and jobs to be done

| Audience | Job to be done | Product response |
|---|---|---|
| Christian youth and university students | Build a daily Scripture habit without another intimidating commitment | A mobile-first daily mission that takes 3-5 minutes and shows the next small step |
| Church members and Bible-study groups | Remember passages and encourage one another | Private progress by default, opt-in groups, shared weekly challenges |
| Homeschool and Christian-school learners | Practice typing with meaningful, age-appropriate content | Teacher/admin-curated journeys and transparent progress |
| Church and mission leaders | Create a consistent group practice without managing spreadsheets | Moderated groups, scoped challenges, and group-level completion summaries |

## Product principles

1. Scripture is the purpose; gamification serves the habit and never trivializes the text.
2. The next useful action is visible immediately. Default home is today's mission, not a reporting dashboard.
3. Celebrate effort and consistency, not spiritual worth. Do not rank faith or imply that streaks measure devotion.
4. Private by default. Journals and individual progress are not shared without an explicit user action.
5. Every learning activity works with keyboard navigation, assistive technology, reduced motion, and a narrow screen.
6. Rewards are earned from server-validated activity. A client cannot grant its own XP or achievements.

## Goals and non-goals

### Goals
- Increase active Scripture engagement and recall through short daily sessions.
- Improve typing WPM and accuracy through repeated, meaningful practice.
- Make progress, the current goal, and the next step legible.
- Support individual practice first, then safe and useful group accountability.
- Measure activation and retention in privacy-conscious aggregate analytics.

### Non-goals
- Replace a Bible, church, pastor, or theological study.
- Score a user's faith, spiritual maturity, or doctrinal correctness.
- Publish private journaling or infer sensitive beliefs for advertising.
- Ship unmoderated direct messaging or public user-generated Scripture commentary.

## Core user stories and requirements

### Activation and account
- **REQ-AUTH-01:** A visitor can understand the value proposition and try a clearly labeled sample challenge without creating an account.
- **REQ-AUTH-02:** A user can create an account or sign in with email/password or Google using Firebase Authentication.
- **REQ-AUTH-03:** Users can review privacy choices, delete their account, and export or delete personal journal data.

### Daily practice and typing
- **REQ-PRACTICE-01:** The home screen presents today's mission, current streak, XP-to-next-level, weekly goal, and a clear start/continue action.
- **REQ-PRACTICE-02:** A challenge shows reference text and typed input with correct/incorrect character feedback, current position, and progress.
- **REQ-PRACTICE-03:** Completion summarizes WPM, accuracy, elapsed time, errors, XP earned, and a recommended next action.
- **REQ-PRACTICE-04:** WPM is based on correctly typed characters / 5 / elapsed minutes; accuracy is correct keystrokes divided by attempted keystrokes. Pauses shorter than one second remain included; attempts under five seconds are excluded from a WPM result.
- **REQ-PRACTICE-05:** A session is submitted once with an idempotency key. Trusted server logic revalidates the verse, elapsed time, and reward eligibility before writing progression.
- **REQ-PRACTICE-06:** Focus, selection, paste behavior, retry, and mobile input are designed and tested explicitly. The user's text is never silently discarded.
- **REQ-PRACTICE-07:** The first 15 keyboard lessons are ordered and unlock sequentially; coached lessons identify the target key, hand, and finger.
- **REQ-PRACTICE-08:** Speed and accuracy practice state their completion criteria before practice; account rewards remain server-authoritative.
- **REQ-PWA-01:** Installable browsers can install the web app; core routes and bundled lesson content remain available offline after they have been cached or installed.
- **REQ-PWA-02:** Offline account sessions remain pending locally until foreground sync succeeds; pending rewards are not represented as authoritative.
- **REQ-RACE-01:** Daily race submissions use a server-managed passage and server-computed text metrics; global display is opt-in and group results require existing membership.
- **REQ-SETTINGS-01:** Weekly-goal and sound preferences sync per account with a timestamped, per-setting conflict policy; race identity and visibility remain opt-in account settings.

### Memorization and journeys
- **REQ-MEMORY-01:** Memory challenge levels are: visible verse, selected missing words, major words hidden, and fully hidden verse.
- **REQ-MEMORY-02:** Memory score reflects normalized word recall and is distinct from typing accuracy. Punctuation/case normalization rules are disclosed.
- **REQ-JOURNEY-01:** Users can browse journeys such as Gospel of John, Psalms, Proverbs 31, New Testament Path, and Bible in One Year.
- **REQ-JOURNEY-02:** Journey progress is based on completed assigned activities, survives sign-in/device changes, and clearly shows the next activity.
- **REQ-JOURNEY-03:** Content metadata includes translation, reference, source/provenance, and review status.

### Habit, rewards, and growth
- **REQ-HABIT-01:** Daily streaks use a disclosed account timezone and a configurable day boundary; a day qualifies after at least one eligible completed activity.
- **REQ-HABIT-02:** Verse, memory, and active-day streaks are distinct counters; no shame-based loss messaging or paid streak repair.
- **REQ-REWARD-01:** XP, level, achievement, and challenge rewards are computed on a trusted backend, deduplicated, and auditable.
- **REQ-REWARD-02:** Levels 1-100 have named milestone ranks: Seeker (1), Disciple (5), Faith Builder (10), Scripture Warrior (20), Kingdom Scribe (50), Bible Master (100).
- **REQ-REWARD-03:** Achievements include First Verse, 100/1,000 Verses Typed, 7/30 Day Streak, Gospel of John, Proverbs, and Memory Champion.
- **REQ-PROGRESS-01:** Progress view displays WPM growth, accuracy trend, verses/chapters completed, streaks, XP/level, and memory retention over selectable periods.

### Reflection, audio, and premium
- **REQ-AUDIO-01:** Audio mode plays an authorized verse recording and reports listening/typing accuracy and speed. Audio may be replayed and has accessible text controls.
- **REQ-REFLECT-01:** Optional reflection prompts invite observation/application without presuming an answer. AI output is labeled, non-authoritative, and can be disabled.
- **REQ-REFLECT-02:** Journaling is optional, private by default, encrypted in transit, excluded from analytics and model training, and deletable.
- **REQ-AI-01:** The optional product-shell assistant supports Scripture questions and typing coaching. Before sending, it obtains explicit consent and discloses that the message, up to six recent chat turns, and a section label are sent to Firebase AI. It must not attach reflections, account data, or progress automatically; users can clear the in-memory conversation and consent.
- **REQ-PLAN-01:** Free access includes basic typing challenges and basic reading plans. Premium may unlock advanced memory, audio, AI reflection, advanced challenges, and expanded analytics.
- **REQ-PLAN-02:** Entitlements are verified server-side; paywalls disclose price, renewal, cancellation, and data behavior before purchase.

### Community and administration
- **REQ-COMMUNITY-01:** Users can join a group only through an invite/approved flow; group membership and progress visibility are explicit.
- **REQ-COMMUNITY-02:** Leaderboards and weekly/monthly challenges are opt-in, time-bounded, abuse-resistant, and allow hiding display names.
- **REQ-COMMUNITY-03:** Reporting, blocking, moderation queues, and group-owner controls exist before public/community launch.
- **REQ-ADMIN-01 (planned; not implemented):** Authorized staff can create, preview, publish, archive, and version reading plans, journeys, daily verses, achievements, and challenges.
- **REQ-ADMIN-02 (planned; not implemented):** Admin access is role-based and audited; user management exposes only information needed for support/safety.

The current repository has no `/admin` route or publishing interface. These requirements describe future product scope, not capabilities available to users or staff today. Community group creation and moderation workflows are likewise not open in this build.

## Success measures

### North-star
**Weekly Meaningful Practice Users (WMPU):** unique users completing at least three eligible Scripture practice sessions in a week, including at least one non-demo authenticated session for production reporting.

### Funnel and retention
- Activation: account creation to first completed verse in the first session.
- D1/D7/D30 retention, cohort-based; report separately for individual and group acquisition.
- Weekly goal completion and streak continuation, with opt-in and non-shaming copy.
- Journey start-to-completion and challenge repeat rates.
- Typing skill growth: median WPM and accuracy change against each user's baseline.
- Memory retention: delayed recall score at 1/7/30 days, where consented.
- Community safety: reports per 1,000 active group members, moderation response time, and blocked/removed content.
- Premium: trial-to-paid and paid retention, without targeting based on journal content.

### Guardrails
- No increase in accidental streak anxiety, unwanted notifications, or account deletion friction.
- Accessibility issue severity and completion parity for keyboard/screen-reader users.
- No exposure of private journal text or non-consenting individual progress.
- Monitor duplicate reward claims, abnormal completion rates, and moderation backlogs.

## MVP acceptance

1. Landing page communicates product value and offers a working guest demo.
2. User can complete a verse challenge end-to-end and see correct metrics/rewards.
3. User can resume a journey and see progress, streak, XP, and next goal.
4. Sign-in choices are available and production data writes require Firebase configuration.
5. Demo mode is visibly labeled; demo data cannot be mistaken for persisted production progress.
6. Responsive, keyboard/screen-reader accessible core loop passes focused tests and a production build.
7. Security rules deny cross-user reads/writes; progression cannot be client-awarded.
8. The 15-stage curriculum, offline queue, install prompt, and server-backed opt-in race flows are documented with their current platform and integrity limits.
