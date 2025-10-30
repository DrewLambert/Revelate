# Engineering Backlog

This backlog collects cross-cutting or future action items that emerge from reviews and planning.

Routing guidance:

- Use this file for non-urgent optimizations, refactors, or follow-ups that span multiple stories/epics.
- Must-fix items to ship a story belong in that story's `Tasks / Subtasks`.
- Same-epic improvements may also be captured under the epic Tech Spec `Post-Review Follow-ups` section.

| Date | Story | Epic | Type | Severity | Owner | Status | Notes |
| ---- | ----- | ---- | ---- | -------- | ----- | ------ | ----- |
| 2025-10-30 | 1.3 | 1 | Bug | Medium | Dev | Open | Add email format validation to POST /api/contact - app/api/contact/route.ts:46-50 |
| 2025-10-30 | 1.3 | 1 | TechDebt | Medium | Dev | Open | Remove/gate sensitive console.log statements - app/api/contact/route.ts:26-40, app/api/slack/events/route.ts:47-78 (Related: Story 1.8) |
| 2025-10-30 | 1.3 | 1 | Enhancement | Low | Dev | Open | Mock console.error in tests to reduce noise - All test files with expected error scenarios |
| 2025-10-30 | 1.3 | 1 | Enhancement | Low | Dev | Open | Document jest-polyfills.js pattern in README - revelateops-website/README.md |
| 2025-10-30 | 1.3 | 2 | Enhancement | Low | TBD | Open | Consider input sanitization tests for XSS/injection - Defer to Story 2.2 or security audit |
