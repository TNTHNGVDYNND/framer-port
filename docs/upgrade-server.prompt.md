# 🧠 TASK: Upgrade Zenfolio Server Using Boilerplate Reference

You are a senior backend engineer specializing in Node.js, Express, and MongoDB.

---

## 🎯 Goal

Upgrade the **this project (framer-port) server** by integrating and adapting the backend architecture from a reference project (`port-exp-boilerplate`). go to

This is NOT a simple copy task.

You must:

- Analyze both codebases
- Merge intelligently
- Preserve working functionality
- Improve structure and completeness

---

## 📂 Context

### Target Project framer-port (Zenfolio)

- Existing but incomplete backend
- Some routes/controllers may already exist
- Frontend already depends on current API structure

---

### Source Project (Boilerplate)

Provides:

- Clean Express architecture
- Auth system (JWT + bcrypt)
- User model + routes
- MongoDB configuration
- Environment setup

---

## 🧩 Tasks

### 1. Analyze both server codebases

- Compare folder structures
- Identify missing pieces in Zenfolio
- Detect overlapping files

---

### 2. Design merge strategy (IMPORTANT)

Before writing code:

- Decide what to:
  - KEEP (framer-port-specific logic)
  - REPLACE (broken/incomplete parts)
  - ADD (missing features from boilerplate)

---

### 3. Upgrade server architecture

Ensure Zenfolio server includes:

- `/config` → DB connection & env handling
- `/models` → User schema + others if needed
- `/controllers` → Auth + business logic
- `/routes` → Clean route separation
- Middleware (auth, error handling)

---

### 4. Implement authentication system

Add:

- User schema
- Register route
- Login route
- JWT handling
- Password hashing (bcrypt)

Ensure compatibility with frontend.

---

### 5. Preserve compatibility (CRITICAL)

DO NOT break:

- Existing API endpoints used by frontend
- Existing route paths
- Port configuration (keep framer-port defaults unless necessary)

If changes are required:
→ clearly document them

---

### 6. Environment configuration

Unify `.env` setup:

- MONGO_URI
- JWT_SECRET
- PORT

Ensure consistency across both projects.

---

### 7. Code quality improvements

- Remove duplicate logic
- Normalize naming conventions
- Ensure modular structure
- Follow best practices (Express 5)

---

## 📦 Output Requirements

Provide:

### 1. 📁 Final server structure

(show full folder tree)

---

### 2. 📄 Updated/created files

- Full code for new/modified files

---

### 3. 🔄 Migration summary

Explain:

- What was copied
- What was adapted
- What was kept

---

### 4. ⚠️ Breaking changes (if any)

---

### 5. 🧪 Testing instructions

- How to run server
- How to test auth endpoints

---

## ⚠️ Constraints

- Do NOT blindly overwrite files
- Do NOT remove working features
- Do NOT introduce unnecessary complexity
- Keep it clean and production-ready

---

## 💡 Priority

1. Stability
2. Compatibility
3. Clean architecture
4. Feature completeness

---

## 🚀 Bonus (optional)

- Suggest improvements (rate limiting, validation, logging)
- Suggest production readiness upgrades

---

Now begin by analyzing both server directories.
