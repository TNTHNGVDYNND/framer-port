# 🧠 TASK: Organize Project Documentation into Structured Narrative

You are an expert technical writer and software architect.

## 🎯 Goal

I have a MERN stack project with many scattered `.md` files containing:

- prompts
- notes
- experiments
- partial documentation
- Etc.
  **They are all inside** @documents/

Your task is:

1. to check them out and analyze them along with existing files in the projects.
2. transform them into a **clear, structured documentation system** that shows:

- How the project started
- How it evolved over time
- Key learning phases
- Current state of the project

For example: In such formation.
docs/
01-project-overview.md
02-initial-setup.md
03-learning-phase.md
04-feature-development.md
05-current-state.md

It could be more according to the documents ...
timeline.md
README.md

---

## Input

You will receive multiple markdown files from a `/docs` folder.

---

## Tasks & tips

Don’t do everything in one prompt

Break it:

Step 1: “Analyze and cluster files”
Step 2: “Generate structure”
Step 3: “Rewrite into final docs”

### 1. Analyze all documents

- Identify themes, duplicates, and relationships
- Detect chronological order if possible

---

### 2. Group into logical sections

Create a clean structure like:

- Project Overview
- Initial Setup
- Early Experiments / Prompting Phase
- Feature Development
- Challenges & Learnings
- Current State
- Future Improvements

---

### 3. Create new documents

Generate:

- `README.md` → high-level overview
- `timeline.md` → chronological evolution
- Section-based `.md` files (numbered)

---

### 4. Rewrite content

- Remove redundancy
- Merge similar ideas
- Improve clarity and flow
- Keep technical insights

---

### 5. Preserve important details

- Keep key prompts (summarized if needed)
- Keep important decisions
- Keep learning insights

---

### 6. Output format

Provide:

1. Final folder structure
2. Content for each file
3. Explanation of organization logic

---

## ⚠️ Constraints

- Do NOT invent fake features
- Do NOT remove important learning steps
- Keep it portfolio-friendly and professional
- Prefer clarity over verbosity

---

## 💡 Style

- Clean, structured, minimal
- Developer-focused
- Easy for recruiters to scan

---

## Bonus (optional)

- Suggest improvements to make the project more impressive
- Suggest missing documentation sections

---

Finally, A. explain what you have seen and understood. B. list the plan how you are going to do it. I will review and discuss with you before giving the confirmation. When it all done we will use those file to organize the main part in README.md

Now begin.
