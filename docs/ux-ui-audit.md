# ScriptType UX/UI Audit

## Executive summary

ScriptType already has a coherent visual direction: restrained indigo, editorial Scripture typography, clear practice-focused language, and a strong public landing-page hierarchy. The first impression is more considered than a generic dashboard template, and it avoids manipulative streak language and invented social proof.

The largest experience risks were operational rather than aesthetic: onboarding promised a path it did not unlock, a Firebase-unconfigured sign-in state could strand local learners, the mobile app navigation exposed too many destinations at once, an AI privacy disclosure conflicted with actual request behavior, and the weekly goal allowed an impossible value. These have been corrected. Remaining work is mostly legibility and information hierarchy across data-heavy product pages, accurate launch readiness/content rights, and the absence of the admin and group-moderation capabilities described in product requirements.

## Audit scope and evidence

Reviewed source and route structure for the public landing page, authentication, legal and offline routes; the authenticated product shell; onboarding dialog; Today, Practice, Journeys and journey detail, Memory, Audio, Trainer, Progress, Community, Reflection, Profile, and Settings; and the floating assistant. Reviewed shared typography, spacing, color, radius, elevation, button, card, and navigation conventions.

The live landing page was checked at a 375 CSS-pixel viewport: document and body widths matched the viewport with no horizontal scrolling. A full multi-route browser sweep timed out after App Check failures and did not produce reliable route-by-route responsive evidence. The browser reported Firebase App Check `exchangeDebugToken` requests returning HTTP 403; Firebase-backed operations and assistant replies could not be validated end-to-end in this environment. No quantitative performance trace or formal screen-reader/WCAG audit was run, so those remain validation tasks rather than implied passes.

## Findings ordered by severity

Severity uses P1 (high), P2 (medium), and P3 (polish). Resolved findings are retained here to record why the changes were made.

### P1 — High

1. **Onboarding choices and copy did not match the actual flow — resolved.**
   - **Impact:** A visitor was told the first session would unlock a personalized path, although the action only opened Practice. The setup path also risked implying that account sync was required.
   - **Fix:** The promise now accurately says users can choose a journey when ready. Setup saves the selected weekly goal locally, allows device-only continuation, and only offers account sync when Firebase is configured.
2. **Firebase-unconfigured sign-in could strand guest learners — resolved.**
   - **Impact:** Authentication controls cannot work without Firebase, but learners should still be able to use local practice.
   - **Fix:** The sign-in route now explains the unavailable account feature and exposes a working device-only continuation.
3. **Mobile navigation exposed ten destinations in a compressed bar — resolved.**
   - **Impact:** Small labels and many peers made navigation hard to scan and tap.
   - **Fix:** Mobile now prioritizes Today, Journeys, Practice, and Growth, with the remaining destinations in an accessible More panel. Desktop retains its full rail.
4. **AI data-use copy did not match explicit AI requests — resolved.**
   - **Impact:** A blanket privacy claim could mislead users when they explicitly asked AI for help.
   - **Fix:** The assistant requests consent before sending and states that the message, up to six recent turns, and a section label go to Firebase AI. It does not attach journals, account data, or progress. Conversation remains in component memory and can be cleared.
5. **The weekly practice target permitted an impossible goal — resolved.**
   - **Impact:** A 14-days-per-week maximum was confusing and undermined trust in goal tracking.
   - **Fix:** New goals are limited to seven days; legacy values are normalized safely.
6. **Profile success feedback was announced as an error — resolved.**
   - **Impact:** A successful display-name update used `role="alert"` and destructive styling, confusing both screen-reader users and sighted users.
   - **Fix:** Profile errors and success/status feedback now have distinct live-region roles and visual treatments.

### P2 — Medium

1. **Small supporting text is below comfortable reading size on several product pages.**
   - **Evidence:** Journey cards/stages, progress labels, reflection timestamps, challenge controls, and Today summary details include 9–11px text.
   - **Impact:** Dense labels are difficult to read on phones, at zoom, and for users with low vision; the small type also makes an otherwise polished interface feel less premium.
   - **Recommendation:** Use 12px as the minimum for nonessential captions and 14px for instructions, controls, and decision-supporting text. Keep one or two compact metadata labels only when they remain nonessential.
2. **The Journeys screen presents a large choice set before helping users choose.**
   - **Evidence:** Fifteen keyboard stages and multiple Scripture journey cards are visible in one long catalog.
   - **Impact:** First-time learners must scan many similarly weighted options instead of seeing one recommended next step.
   - **Recommendation:** Keep the next keyboard lesson and one or two recommended Scripture paths prominent; group the full curriculum behind a clearly labeled “All lessons” section without hiding progress or lock state.
3. **Progress and Today dashboards distribute attention across many metrics.**
   - **Impact:** Equal-weight cards and tiny labels can make the next practice action compete with secondary analytics, especially on mobile.
   - **Recommendation:** Lead with one continue-practice action and a small set of primary measures; move detailed trend and achievement data lower or into expandable sections. Preserve text summaries for charts.
4. **Community feature cards can imply that unavailable group features are live.**
   - **Evidence:** Group, challenge, and monthly-rhythm cards sit alongside a note that group features are not open in this build.
   - **Impact:** The page mixes aspirational feature marketing with a gated experience, creating uncertainty about what can actually be used.
   - **Recommendation:** Label preview concepts as planned, or show only currently actionable race controls until group membership, reporting, and moderation are ready.
5. **The landing-page footer exposes an unresolved content-rights note.**
   - **Evidence:** The public footer says “KJV text · rights review before launch.”
   - **Impact:** The operational wording weakens confidence and makes the experience feel unfinished, while the underlying rights question is important and cannot responsibly be hidden or guessed away.
   - **Recommendation:** Complete the appropriate translation/audio rights review before launch, then replace this internal-style notice with precise, approved attribution. Do not remove the review gate without resolving it.
6. **Admin and group operations are described as product requirements but have no UI route.**
   - **Evidence:** No admin page exists; group creation, moderation queues, and publishing interfaces are not present.
   - **Impact:** Staff cannot safely curate/publish content or operate community safety flows through the application despite the PRD describing these capabilities.
   - **Recommendation:** Keep them explicitly marked as planned scope. Before enabling public groups or operational publishing, define role-based access, review/provenance, versioning, audit logs, reporting/blocking, and moderation workflows. No admin interface was invented as part of this UX pass.
7. **Firebase App Check blocked live integration validation in this environment.**
   - **Evidence:** Browser requests to `exchangeDebugToken` returned HTTP 403 while the landing page itself rendered.
   - **Impact:** Firebase-backed sign-in/data sync and AI replies cannot be claimed as runtime-verified here.
   - **Recommendation:** Confirm the development App Check debug token and authorized app configuration in the owning Firebase project, then re-run the authenticated and assistant flows. This is a configuration check, not a reason to bypass App Check.

### P3 — Polish

1. **The assistant has section context, not task-level context.**
   - **Impact:** It knows whether the user is in practice, memory, or journeys, but cannot currently reference the exact verse or lesson unless the user includes it.
   - **Recommendation:** Offer an explicit “include this verse/lesson” action with a preview before adding that content to an AI request. Do not silently include private progress or reflections.
2. **Some lesson and metric cards use similar visual weight.**
   - **Impact:** The brand is calm and consistent, but repeated card grids can make screens feel more like generic SaaS dashboards than a focused learning experience.
   - **Recommendation:** Reserve elevated surfaces for the next action and meaningful milestones; use spacing, section headings, and lighter dividers for supporting information.
3. **No verified testimonials or external trust marks are present.**
   - **Impact:** Social proof is limited, although the landing page makes the product promise and privacy posture clear.
   - **Recommendation:** Keep the honest no-account/privacy proof points. Add social proof only after it can be substantiated; do not fabricate testimonials or user counts.

## Screen and flow review

| Surface | Assessment |
|---|---|
| Landing | Clear value proposition, one obvious primary action, useful live verse preview, and honest trust points. The mobile rendering did not overflow. Resolve the visible rights-review note before public launch. |
| Sign-in | Clear account/device distinction and recovery path; local continuation is now available without Firebase. Real provider behavior remains blocked by App Check configuration in this browser environment. |
| Onboarding | Base UI dialog provides a proper dialog primitive; setup is optional, goal persistence is explicit, and the chosen starting point is used. Copy now reflects available behavior. |
| Product navigation | Desktop rail is comprehensive; mobile prioritizes the core loop and puts secondary destinations in More. The More and assistant controls now retain valid `aria-controls` targets while closed. |
| Today | Strong learning dashboard content and clear continuation concept; metric density and sub-12px supporting labels should be simplified and enlarged. |
| Practice | Focused typing canvas and useful progress feedback; small instructional labels and high-density metric metadata need a legibility pass. |
| Journeys | Strong editorial treatment and visible lock/progress states; 15-stage count is now dynamic. Reduce the initial choice burden and enlarge stage metadata. |
| Trainer, Memory, Audio | Each has a distinct learning purpose. Verify loading, empty, retry, and configured-audio states after Firebase/content configuration is available; keep typing and recall scores clearly separate. |
| Progress and Profile | Useful growth and history measures; prioritize key outcomes over dense grids. Profile success and error announcements are now distinct. |
| Community | Privacy guardrails are clear and leaderboard has an empty state; duplicate loading copy was removed. Mark nonfunctional group concepts as planned until full safety workflows exist. |
| Reflection and Settings | Device-first privacy and data controls are appropriate; AI use is now separately disclosed. Review small metadata and confirm deletion/export behavior in both local and signed-in environments. |
| Privacy, Terms, Offline | Legal/help surfaces exist and should remain linked from account and product entry points. Keep wording aligned with actual local storage, sync, and AI behavior. |
| Admin | No route or dashboard exists. This is a scoped product gap, not an implemented screen. |

## Design-system recommendations

The shared tokens in `src/app/globals.css` provide a good foundation. The design standard is documented in [design-system.md](./design-system.md): 16px body text, 14px supporting copy, 12px minimum captions, a 4px spacing rhythm, 12/20/28px control/card/panel radii, restrained semantic elevation, and consistent primary/secondary/quiet/mission button roles.

Continue using semantic light/dark tokens, visible focus, non-color status cues, reduced-motion behavior, and minimum 44px targets. Treat 200% zoom, keyboard-only operation, and contrast measurements as release gates rather than relying on source inspection alone.

## Implemented during this audit

- Made onboarding choices save and route correctly, removed an unsupported personalization promise, and kept device-only practice available.
- Added a direct Firebase-unconfigured local continuation path and improved privacy accuracy for AI requests.
- Reworked mobile navigation to four primary destinations plus More.
- Capped weekly goals at a valid seven-day week while normalizing legacy values.
- Added the opt-in Scripture/typing assistant with bounded chat, explicit disclosure, consent, loading/error states, and no app-side transcript persistence.
- Corrected stale curriculum completion copy, removed duplicate Community loading feedback, and distinguished Profile status from errors.
- Updated design, experience, and product-requirement documentation; clarified that admin and group operations are planned rather than available.

## Remaining validation

- Re-run Firebase-backed sign-in, sync, and AI response flows after correcting the development App Check configuration.
- Measure contrast for actual rendered token pairs and test keyboard/screen-reader behavior on core dialogs, typing, charts, and navigation.
- Re-run a complete route sweep at 320px, tablet, desktop, 200% zoom, and both themes after the development server is responsive; capture a performance trace for the practice dashboard and assistant.
- Resolve content/translation/audio rights and implement staff/community operations only as separately scoped, security-reviewed work.
