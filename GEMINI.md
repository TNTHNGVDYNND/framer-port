# Portfolio Blueprint: MERN + Tailwind + Framer Motion

This document outlines the architectural plan for building a modern, interactive personal portfolio website.

## 1. Objective

To create a visually appealing, animated, and responsive portfolio website to showcase creative projects. The site will be a Single Page Application (SPA) with a backend to manage project data and handle contact form submissions.

## 2. Core Technologies

*   **Backend:** Node.js, Express.js
*   **Frontend:** React (using Vite for setup)
*   **Database:** MongoDB (with Mongoose for modeling)
*   **Styling:** Tailwind CSS
*   **Animation:** Framer Motion

## 3. Project Structure

A monorepo-style structure will be used to keep the client and server code separate but within the same project.

```
/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   ├── ProjectList.jsx
│   │   │   └── ContactForm.jsx
│   │   ├── pages/
│   │   │   └── Home.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── tailwind.config.js
│
├── server/
│   ├── models/
│   │   └── Project.js
│   ├── routes/
│   │   └── api.js
│   ├── controllers/
│   │   └── projectController.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── GEMINI.md
```

## 4. Backend (Server) Architecture

The server will be a simple RESTful API.

### Data Models (Mongoose Schemas)

**`Project` Model (`server/models/Project.js`)**
```javascript
{
  title: String,
  description: String,
  imageUrl: String,
  projectUrl: String,
  tags: [String]
}
```

### API Endpoints (`server/routes/api.js`)

*   `GET /api/projects`: Fetches all portfolio projects from the database.
*   `GET /api/projects/:id`: Fetches a single project by its ID.
*   `POST /api/contact`: Receives data from the contact form (for now, it will log to the console; later, it can be configured to send an email).

## 5. Frontend (Client) Architecture

The client will be a React-based SPA.

### Component Breakdown (`client/src/components/`)

*   **`Navbar.jsx`**: Top navigation bar, with links to different sections.
*   **`Hero.jsx`**: The main landing view with a headline and intro text.
*   **`ProjectList.jsx`**: A container that fetches project data from the backend and maps over it.
*   **`ProjectCard.jsx`**: A reusable card to display a single project, with an image, title, and description.
*   **`ContactForm.jsx`**: A form for users to send a message.

### Animation Strategy

*   **Framer Motion** will be used for:
    *   **Page Transitions:** Smooth fades or slides between sections.
    *   **Scroll-Triggered Animations:** Elements animating into view as the user scrolls.
    *   **Micro-interactions:** Hover effects on `ProjectCard`s, button press effects, etc.

## 6. Development & Deployment Plan

*   **Development:**
    1.  Use `npm install` in both `/client` and `/server` directories.
    2.  Run the backend server with `nodemon server.js`.
    3.  Run the frontend development server with `npm run dev`.
    4.  Use a tool like `concurrently` to run both with a single command from the root.
*   **Deployment:**
    *   **Frontend (Client):** Deploy as a static site on services like **Vercel** or **Netlify**.
    *   **Backend (Server):** Deploy as a Node.js application on services like **Render** or **Heroku**.

## 7. Action Plan (Next Steps)

1.  Set up the folder structure as defined above.
2.  Initialize the Node.js/Express server.
3.  Initialize the React client using Vite.
4.  Integrate Tailwind CSS into the React client.
5.  Build the basic backend API endpoints and test with sample data.
6.  Build the frontend components and connect them to the backend API.
7.  Implement animations with Framer Motion.
