**DRY, Scalability, and Tailwind v4 Compliance.**

> **Role:** Senior Frontend QA & Performance Engineer.
> **Task:** Audit the completed implementation of `V2-plan-1.md` within the `/client` directory.
> **Audit Requirements:**
>
> 1. **Tailwind v4 Integrity Check:** Scan for any `tailwind.config.js` or `tailwind.config.cjs` files. If they contain a `theme: { extend: { ... } }` block, flag it as a CRITICAL FAILURE. All design tokens must reside in `src/styles/` using the `@theme` directive.
> 2. **DRY & Redundancy Verification:**
>
> - Confirm that `TerminalHeader.jsx` is used in all 7 components (ContactForm, WorkHero, etc.).
> - Ensure `useBlinkingCursor` hook is the sole source of cursor logic.
> - Check `src/utils/motion-presets.js`—are components still hardcoding Framer Motion objects, or are they importing these presets?
>
> 1. **Scalability & Structure Audit:**
>
> - Verify `src/hooks/index.js` correctly exports all custom hooks.
> - Check for "Ghost Code": Identify any variables, imports, or CSS classes that were left over from the refactor but are no longer used.
>
> 1. **UI Styling Deep-Dive:**
>
> - Analyze `src/styles/theme.css`. Ensure the "Midnight Sun" palette (OKLCH) is applied consistently.
> - Check for "Focus Normalization": Are interactive elements using a standardized focus ring defined in your utility CSS?
>
> **Output Format:**
> Provide a "Health Report" listing:
>
> - **Pass/Fail** for each Phase of V2-plan-1.
> - **Code Smell List:** Specifically pinpoint files with redundant logic.
> - **Scalability Suggestions:** 1-2 architectural improvements for the next version.

---

### Pro-Tips

- **Context Injection:** If your CLI tool allows passing files as context (e.g., `gemini-cli --file V2-plan-1.md`), make sure to include `V2-plan-1.md` and `AGENTS.md` so it knows the "Source of Truth."
- **The "Find" Command:** If the agent says it can't find something, tell it: _"Run `find client/src -name "_.jsx"` to map the component tree before you begin the audit."\*
- **Debugging Logic:** Since you asked it to "debug everything," if you have specific console errors or build warnings, append them to the end of the prompt: _"Note: I am seeing a warning regarding [Insert Warning]—please investigate this first."_
