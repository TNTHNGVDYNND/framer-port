import { Routes, Route, useLocation } from "react-router-dom";

import Layout from './components/Layout';
import Home from './pages/Home';
import Work from './pages/Work';
import About from './pages/About';
import Contact from './pages/Contact';
import ThemeCard from './pages/ThemeCard';

const AppRoutes = () => {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />} />
        <Route path='work' element={<Work />} />
        <Route path='about' element={<About />} />
        <Route path='contact' element={<Contact />} />
        <Route path='theme' element={<ThemeCard />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
