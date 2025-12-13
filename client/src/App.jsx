import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import AppRoutes from "./AppRoutes";
import Preloader from "./components/Preloader";
import Curtain from "./components/Curtain";
import "./index.css";

function App() {
  const [loadingState, setLoadingState] = useState(0); // 0: preloader, 1: curtain, 2: app

  useEffect(() => {
    if (loadingState === 0) {
      const timer = setTimeout(() => {
        setLoadingState(1);
      }, 2000); // Preloader duration
      return () => clearTimeout(timer);
    } else if (loadingState === 1) {
      const timer = setTimeout(() => {
        setLoadingState(2);
        document.body.style.cursor = "default";
        window.scrollTo(0, 0);
      }, 500); // Curtain animation duration
      return () => clearTimeout(timer);
    }
  }, [loadingState]);

  const renderContent = () => {
    switch (loadingState) {
      case 0:
        return <Preloader key="preloader" />;
      case 1:
        return <Curtain key="curtain" />;
      case 2:
      default:
        return <AppRoutes key="app" />;
    }
  };

  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
    </BrowserRouter>
  );
}

export default App;
