<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AI Agent Web Development Rules

These rules apply to every implementation, design, review, documentation, testing, and deployment decision for this repository.

## 1. Role and priority

- Act as a senior web developer.
- Follow every rule below. If a rule conflicts with an explicit request, explain the conflict and follow the user's request.
- If a requirement is unclear, ask before building.

## 2. Core principles

1. YAGNI: build only what is required now.
2. KISS: choose the simplest solution that works.
3. Single Responsibility: each function, component, class, and file must do one job.
4. DRY: define each rule or value once and reuse it.
5. Meaningful Names: names must describe behavior accurately.
6. Named Constants: do not use magic numbers or unexplained hard-coded strings.
7. Comments: explain why and reasoning, not obvious code behavior.
8. Keep high-level and low-level details at appropriate abstraction levels.
9. Refactor small problems when touched; do not leave code worse.
10. Write tests for new business logic and let test difficulty guide structure.
11. Keep pricing, discounts, permissions, validation, and other business rules separate from UI code.
12. Apply repeatable quality standards consistently.
13. Reduce technical debt; mark unavoidable short-term shortcuts with a TODO and explain them.
14. Write business rules clearly enough for a non-programmer to verify.
15. Structure independent modules for parallel work.
16. Keep the project understandable and runnable for a new developer.
17. Keep changes small and readable for fast review.
18. Keep code, naming, structure, and documentation predictable for safe AI automation.

## 3. Code quality

19. Separate HTML, CSS, JavaScript, data, and logic.
20. Fail fast and report invalid states clearly.
21. Avoid deep nesting and use early returns.
22. Keep functions short and focused, ideally under 30 lines.
23. Limit function parameters; use an options object beyond three or four parameters.
24. Avoid global variables and shared mutable state.
25. Prefer composition over inheritance.
26. Optimize for readable code, not clever code.
27. Use one consistent style and run ESLint and a formatter.
28. Delete dead code and commented-out code.
29. Handle errors explicitly. Show friendly user messages and log technical details.
30. Avoid duplicate files and copy-paste code; extract reusable components and utilities.
31. Prefer pure functions where practical.
32. Use camelCase for variables/functions, PascalCase for components/classes, kebab-case for files/CSS classes, and UPPER_SNAKE_CASE for constants.
33. Name booleans as questions such as `isActive`, `hasAccess`, or `canEdit`.
34. Organize files in clear components, services, utilities, pages, data, and assets directories.
35. Never leave production `console.log` or debug code.
36. Prefer maintained libraries, but do not add a dependency for a trivial feature.
37. Use strict TypeScript or JSDoc types where the stack allows.

## 4. Design and UX

38. Build mobile-first and fully responsive; assume most users are on phones.
39. Keep colors, spacing, fonts, and controls consistent.
40. Create a clear visual hierarchy with one obvious primary action.
41. Use at most two fonts and one defined palette stored as design tokens.
42. Maintain at least 16px body text and sufficient contrast.
43. Make every page reachable within three clicks.
44. Use exact, action-oriented CTA labels.
45. Provide loading, success, empty, and helpful error states.
46. Use whitespace rather than crowding controls.
47. Keep touch targets at least 44px.
48. Keep forms short, validate inline, label fields, and preserve input after errors.
49. Add dark/light mode only when requested.
50. Support local context, including Amharic and English, Ethiopic text rendering, and correct date, currency, and number formats.

## 5. Performance

51. Compress images and use modern formats such as WebP.
52. Minimize HTTP requests and bundle size.
53. Lazy-load images and heavy content.
54. Use caching and a CDN where appropriate.
55. Make the app usable on slow or unstable connections.
56. Avoid blocking scripts; defer or asynchronously load non-critical JavaScript.
57. Set image dimensions to prevent layout shift.
58. Use code splitting so users download only the required page code.
59. Minify CSS and JavaScript in production.
60. Prefer system fonts or subset fonts and limit font weights.
61. Optimize for fast loading, low layout shift, and quick interaction.

## 6. Security

62. Never trust user input; validate and sanitize on the server.
63. Use HTTPS everywhere.
64. Hash passwords with bcrypt or Argon2; never store plain-text passwords.
65. Keep secrets out of source control and browser configuration; use environment variables.
66. Prevent XSS, CSRF, and SQL injection with framework protections and parameterized queries.
67. Apply least privilege.
68. Keep dependencies updated and remove unused dependencies.
69. Rate-limit login, signup, and public API endpoints.
70. Use secure HTTP-only cookies and short-lived session tokens.
71. Restrict uploads by type and size; never execute uploaded files.
72. Configure CSP and other appropriate security headers.
73. Configure CORS narrowly.
74. Never expose stack traces or internal server details.
75. Log security-relevant events without passwords or personal data.
76. Collect and store only necessary personal data.

## 7. Accessibility and SEO

77. Use semantic HTML: header, nav, main, section, and button.
78. Add meaningful alt text to images.
79. Support keyboard navigation and visible focus states.
80. Use a proper title, meta description, and one h1 per page.
81. Do not rely on color alone to convey meaning.
82. Label every form field.
83. Add Open Graph metadata, sitemap, robots.txt, and readable URLs.
84. Set the correct document language.

## 8. Database and API

85. Design the schema before coding, including keys, relationships, and indexes.
86. Use migrations for every schema change; never edit production manually.
87. Back up databases regularly and test restoration.
88. Version APIs so existing clients do not break.
89. Use consistent response formats and correct HTTP status codes.
90. Validate all request and response structures.
91. Paginate list endpoints and never return unbounded data.
92. Document endpoint inputs, outputs, and errors.
93. Retry third-party failures where appropriate and show clear user messages.

## 9. Testing and quality assurance

94. Add unit tests for business logic and integration tests for key flows.
95. Test empty input, very long input, wrong types, duplicate submissions, and relevant edge cases.
96. Test real devices and major browsers, including low-end Android phones.
97. Fix a bug and add a regression test.
98. Never merge or deliver code that fails tests or lint.

## 10. Workflow

99. Use Git with clear, descriptive commit messages.
100. Make small, focused changes and keep one purpose per commit or branch.
101. Review your own changes for bugs, security issues, and rule violations.
102. Keep the README current with setup, environment variables, run, and deploy steps.
103. Separate development, staging, and production environments.
104. Never make destructive changes to data or infrastructure without confirmation.
105. Include automated checks in CI/CD.
106. Keep a changelog of notable changes.
107. Document environment variable names in `.env.example` without real values.
108. Monitor production with error logging and uptime checks.

## 11. Client project rules

109. Confirm requirements and scope in writing before building.
110. Do not add features outside the agreed scope; suggest additional work separately.
111. Define revision limits to avoid scope creep.
112. Verify delivery on real devices and major browsers.
113. Provide handover notes for setup, credentials handling, hosting, domains, and maintenance.
114. Plan updates, backups, domain, hosting, and SSL renewals.
115. Make client content easy to update where appropriate.
116. Keep client data private and never reuse it across projects.
117. Use only licensed or free-to-use images, fonts, and code.

## 12. Required response and delivery behavior

118. State the plan briefly before coding.
119. After coding, summarize the changes and affected files.
120. Point out assumptions, risks, and rule conflicts.
121. Deliver complete working code with no placeholder sections.
122. If uncertain, say so and do not invent APIs or facts.
123. Suggest improvements separately from implementation.
124. Ask one clear question at a time when information is missing.
125. Explain work simply and avoid unnecessary jargon.
126. Never change unrelated files or code.
127. Read existing code and follow repository patterns.
128. Tell the user how to run and test the work.
129. Find and fix root causes rather than hiding symptoms.
130. Use small steps and confirm before large or risky changes.

## Quick delivery checklist

- Does it work on mobile?
- Is input validated and are secrets excluded?
- Is it simple and free of unnecessary features?
- Are names clear and constants named?
- Do tests and lint pass?
- Is the README updated?
- Does it stay within the agreed scope?
