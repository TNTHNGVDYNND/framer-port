# Backend Refactor Plan (v1) - Contact Form Integration

This document outlines the reasoning and step-by-step plan to refactor the `server/` directory and connect the existing `ContactForm.jsx` frontend to the backend.

## 1. Reasoning for Refactor

1.  **Functional Gap:** The current `contactController.js` is a placeholder that only logs to the console. It needs to perform real-world tasks like database persistence and validation.
2.  **Frontend Synchronization:** `ContactForm.jsx` currently uses a `setTimeout` to simulate an API call. It needs to be updated to use the `api.contact.submit` service for real asynchronous communication.
3.  **Data Persistence:** There is no Mongoose model for "Contact" submissions. To store user messages, a new schema and model are required.
4.  **Port Alignment:** The client-side `api.js` defaults to port `3001`, while the server defaults to port `5000`. These need to be synchronized via environment variables.
5.  **Enhanced UX:** The terminal-style UI is designed to show "system logs." Refactoring the backend allows the frontend to display real server-side status updates (e.g., "[SYSTEM] Data verified by remote host").

---

## 2. Implementation Plan

### Phase 1: Server-Side (Backend)
- [ ] **Create `server/models/Contact.js`**:
    - Define a schema with `name` (String, required), `email` (String, required), `message` (String, required), and `createdAt` (Date, default: Date.now).
- [ ] **Refactor `server/controllers/contactController.js`**:
    - Import the `Contact` model.
    - Add basic server-side validation (ensure fields are not empty).
    - Implement `Contact.create(req.body)` to save submissions to MongoDB.
    - Return a `201 Created` status on success and `400 Bad Request` on validation failure.
- [ ] **Enable Database in `server/server.js`**:
    - Uncomment the `mongoose.connect()` logic to allow the server to talk to the database.

### Phase 2: Client-Side (Frontend)
- [ ] **Update `client/src/components/ContactForm.jsx`**:
    - Import the `api` service from `../services/api.js`.
    - Replace the `setTimeout` simulation in `handleSubmit` with `await api.contact.submit(formData)`.
    - Map server response errors to the terminal output display.
- [ ] **Synchronize Ports**:
    - Ensure `VITE_API_URL` in `client/.env` (or the fallback in `api.js`) points to the correct server port (default `5000`).

---

## 3. Success Criteria
1.  A POST request to `/api/contact` results in a new document in the MongoDB `contacts` collection.
2.  The terminal UI in the frontend displays "[SUCCESS] Message transmitted successfully!" only after a successful server response.
3.  The server returns a descriptive error if the email or message is missing.
