# MyPortfolio - A Modern Animated Portfolio

This project is a modern, single-page portfolio website designed to showcase creative work with a strong emphasis on fluid animations and a polished user experience. It was built from the ground up using React, Vite, and Tailwind CSS, and features advanced animations powered by Framer Motion.

The user interface and animation sequences are inspired by high-quality design portfolios, aiming for a cinematic and interactive feel.

## Core Technologies

-   **Frontend:** [React](https://react.dev/) (with [Vite](https://vitejs.dev/))
-   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
-   **Animation:** [Framer Motion](https://www.framer.com/motion/)
-   **Smooth Scrolling:** [Lenis](https://lenis.studiofreight.com/)
-   **Routing:** [React Router](https://reactrouter.com/)

## Key Features

-   **Multi-Stage Entry Animation:** A sophisticated, self-contained loading sequence in the `Hero` component that includes:
    -   A progress-bar style preloader.
    -   A "curtain reveal" transition effect.
-   **Advanced Hover Effects:** Custom "double text" sliding hover animations on navigation links.
-   **Animated Active Link Indicator:** A sliding underline in the navbar that smoothly animates to the currently active page.
-   **Staggered Text Animation:** The main headline in the Hero section animates in word by word.
-   **Horizontal Project Gallery:** A horizontally scrolling showcase for projects with scroll-snapping for a clean browsing experience.
-   **Dark, Minimalist UI:** A modern, dark-themed UI configured with Tailwind CSS v4's `@theme` directive.
-   **Component-Based Architecture:** A clean and organized codebase with reusable components for the Navbar, Hero, Project List, and more.

## Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
2.  **Navigate to the client directory:**
    ```bash
    cd client
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:5173` (or the next available port).