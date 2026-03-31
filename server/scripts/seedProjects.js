import mongoose from "mongoose";
import Project from "../src/models/Project.js";
import { env } from "../src/config/index.js";
import { connectDB } from "../src/config/database.js";

const sampleProjects = [
  {
    title: "Interactive Portfolio Website",
    description:
      "A personal portfolio showcasing creative development skills with interactive animations and a modern design.",
    imageUrl:
      "https://placehold.co/400x250/FF5733/FFFFFF?text=Portfolio+Website",
    projectUrl: "https://github.com/yourusername/project1",
    tags: ["React", "Tailwind CSS", "Framer Motion", "Vite"],
    category: "Frontend",
    featured: true,
  },
  {
    title: "E-commerce Storefront",
    description:
      "A full-stack e-commerce application with product listings, shopping cart functionality, and user authentication.",
    imageUrl: "https://placehold.co/400x250/33FF57/FFFFFF?text=E-commerce+App",
    projectUrl: "https://github.com/yourusername/project2",
    tags: ["MERN Stack", "Redux", "Stripe API"],
    category: "MERN",
    featured: true,
  },
  {
    title: "Real-time Chat Application",
    description:
      "A real-time chat application built with WebSockets, allowing users to communicate in various rooms.",
    imageUrl: "https://placehold.co/400x250/3357FF/FFFFFF?text=Chat+App",
    projectUrl: "https://github.com/yourusername/project3",
    tags: ["Node.js", "Express", "Socket.io", "React"],
    category: "MERN",
    featured: false,
  },
  {
    title: "Task Management Tool",
    description:
      "A simple and intuitive task management application to help users organize their daily tasks and boost productivity.",
    imageUrl: "https://placehold.co/400x250/FF33A1/FFFFFF?text=Task+Manager",
    projectUrl: "https://github.com/yourusername/project4",
    tags: ["React", "Context API", "CSS Modules"],
    category: "Frontend",
    featured: false,
  },
  {
    title: "Weather Dashboard",
    description:
      "A weather application that displays current weather conditions and forecasts for any city using a third-party API.",
    imageUrl: "https://placehold.co/400x250/A1FF33/FFFFFF?text=Weather+App",
    projectUrl: "https://github.com/yourusername/project5",
    tags: ["React", "API Integration", "Axios"],
    category: "APIs",
    featured: true,
  },
  {
    title: "ML Image Classifier",
    description:
      "A machine learning experiment that classifies images using TensorFlow.js.",
    imageUrl: "https://placehold.co/400x250/FF9500/FFFFFF?text=ML+Classifier",
    projectUrl: "https://github.com/yourusername/project6",
    tags: ["TensorFlow.js", "React", "ML"],
    category: "Experiments",
    featured: false,
  },
  {
    title: "Three.js 3D Scene",
    description: "An interactive 3D scene built with Three.js and WebGL.",
    imageUrl: "https://placehold.co/400x250/00CED1/FFFFFF?text=3D+Scene",
    projectUrl: "https://github.com/yourusername/project7",
    tags: ["Three.js", "WebGL", "React"],
    category: "Experiments",
    featured: false,
  },
];

const seedProjects = async () => {
  try {
    await connectDB();

    // Clear existing projects
    console.log("Clearing existing projects...");
    await Project.deleteMany({});

    // Insert sample projects
    console.log("Seeding projects...");
    const created = await Project.insertMany(sampleProjects);

    console.log(`✅ Successfully seeded ${created.length} projects`);
    console.log("\nFeatured projects:");
    created
      .filter((p) => p.featured)
      .forEach((p) => console.log(`  - ${p.title} (${p.category})`));

    console.log("\nAll categories:");
    const categories = [...new Set(created.map((p) => p.category))];
    categories.forEach((cat) => {
      const count = created.filter((p) => p.category === cat).length;
      console.log(`  - ${cat}: ${count} projects`);
    });

    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding projects:", err.message);
    process.exit(1);
  }
};

seedProjects();
.title ? And when the user hove