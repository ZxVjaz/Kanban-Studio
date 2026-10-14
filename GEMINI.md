# AI Operational Rules - Kanban Board

## 1. Core Principles & Communication Guidelines

1. **Concise & Pragmatic Tone**: Communicate in a clear, modern, and pragmatic engineering tone (like a Senior Tech Lead / Pair Programmer). Avoid overly stiff or archaic wording.
2. **Strict No-Emoji Rule**: Do NOT use visual emoji characters anywhere in code, user interfaces, comments, documentation, commit messages, or notifications. Use scalable SVG icons or standard icon libraries (Lucide React / Font Awesome) instead, confirming with the user if needed.
3. **Clarify Ambiguities**: Always ask for clarification when specifications, user flows, edge cases, or parameters are unclear before writing code or making assumptions.
4. **Descriptive Naming**: Use clear, descriptive, and context-rich identifiers for variables, functions, components, and files (e.g., `calculateColumnTaskCount()` instead of `calc()`). Avoid cryptic abbreviations.
5. **Language Requirement**: All UI copy, source code, comments, documentation, commit messages, and repository assets must be entirely in **English** for public GitHub distribution.

## 2. Existing Code & Reusability Rules

1. Before writing new functions, hooks, or components, inspect the existing codebase to see if similar patterns or utilities already exist.
2. If similar code exists:
   - Present the existing code/component to the user.
   - Ask for confirmation among three options:
     - **Reuse**: Reuse the existing component or helper as-is.
     - **Align Consistency**: Create a new entity adhering to the established conventions and architectural patterns.
     - **Standalone**: Implement an isolated solution with dedicated logic.
3. Proceed only after the user confirms their preferred approach.

## 3. Senior Software Engineer Standards

1. **Idiomatic & Pragmatic**: Write clean, efficient, and idiomatic React 18 + JavaScript code. Avoid premature abstraction and over-engineering.
2. **Guard Clauses**: Prefer early returns / guard clauses to reduce nested conditionals and maintain readable control flow.
3. **Minimalist Comments**: Avoid stating the obvious. Document only architectural decisions, non-trivial trade-offs, or complex edge cases.
4. **Explicit Error Handling**: Handle runtime and storage errors explicitly and gracefully (e.g., handling JSON parsing failures or quota exceeded in `localStorage`), rather than generic `console.log`.
5. **Component Architecture**: Keep components modular, focused on a single responsibility, and colocated with relevant types or helpers where appropriate.

## 4. Data & Storage Conventions

1. **Storage Engine**: `localStorage` (browser client-side JSON persistence).
2. **Boolean Standard**: Use standard JavaScript booleans (`true` / `false`) for status flags and object properties.
3. **Keys & Properties**: Use `camelCase` for JavaScript object properties (e.g., `taskId`, `columnId`, `createdAt`, `isCompleted`).
4. **Resilience & Fallbacks**: Always provide sensible default states when loading from or falling back in `localStorage` to prevent app crashes on empty or corrupt data.
5. **No Authentication**: The application is an offline-first personal task manager for a single user without authentication or password storage.

## 5. Form Validation & Toast Notifications

1. **No Default HTML5 Validation Bubbles**: Never use default browser validation tooltips/bubbles for input validation.
2. **Structured Toast Notifications**: Validation issues or feedback events must trigger a structured toast notification containing:
   - **Issue Title / Target Field**: Clearly identifying the affected field or action (e.g., *Task Title Required*).
   - **Actionable Guidance**: A clear instruction on how to resolve the issue (e.g., *Please provide a title before adding the task.*).
   - **Visual Icon**: Explicit SVG or Lucide React icon representing the notification state (Success, Warning, Error).

## 6. Date & Time Standards

1. **Storage Format**: Store timestamps in ISO 8601 string format (`YYYY-MM-DDTHH:mm:ss.sssZ`) or standard `YYYY-MM-DD`.
2. **Display Format**: Standard readable date formatting (e.g., `DD MMM YYYY`, such as `14 Oct 2026`).
3. **Date Range Display**: When displaying date ranges, use a spaced hyphen delimiter: `DD MMM YYYY - DD MMM YYYY` (e.g., `14 Oct 2026 - 21 Oct 2026`).

## 7. Diagram & Architecture Documentation Standards

1. **Clean Mermaid Diagrams**: When creating ERD or entity relationship diagrams with Mermaid, physical relationship lines must not use excessive action verbs. Use empty strings `""` for direct structural relationships.
2. **Descriptive Labels**: Reserve labels strictly for conceptual or audit relationships where explicit semantics are required.

## 8. Testing & Verification Policy

1. **No Autonomous Browser Automation**: Do NOT initiate automated browser testing subagents unless explicitly instructed by the user.
2. **Step-by-Step Manual Testing Guide**: Always provide structured step-by-step testing instructions containing:
   - **Positive Test Scenarios**: Verifying expected happy path behaviors.
   - **Negative / Edge Case Scenarios**: Verifying validation, boundary conditions, and error recovery.
   - Clear expected outcomes so the user can verify changes locally in their browser.
