import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetail, { SERVICE_PAGES_DATA } from "./pages/ServiceDetail";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Contact from "./pages/Contact";

// --- AUTOMATIC TAB TITLE & SCROLL MANAGER ---
function RouteTitleManager() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.toLowerCase();

    // 1. Static Pages Title Map
    const staticTitles = {
      "/": "Jasa Backlinks",
      "/services": "Services | Jasa Backlinks",
      "/about": "About | Jasa Backlinks",
      "/contact": "Contact | Jasa Backlinks",
      "/privacy": "Privacy Policy | Jasa Backlinks",
      "/terms": "Terms of Service | Jasa Backlinks",
    };

    if (staticTitles[path]) {
      document.title = staticTitles[path];
    } else if (path.startsWith("/services/")) {
      // 2. Dynamic 12 Service Pages Title Resolution
      const slug = path.replace("/services/", "").split("/")[0];
      const matchedService = (SERVICE_PAGES_DATA || []).find(
        (s) =>
          s.slug === slug ||
          s.id === slug ||
          (s.aliases && s.aliases.includes(slug)),
      );

      if (matchedService) {
        document.title = `${matchedService.name} (${matchedService.metric}) — $${matchedService.price.toFixed(2)}/Link | Jasa Backlinks`;
      } else {
        document.title = "SEO & Backlink Service | Jasa Backlinks";
      }
    } else {
      document.title = "Jasa Backlinks | Powered by SeoHub Ltd";
    }

    // Smoothly handle scroll position on route change
    if (location.hash) {
      const targetId = location.hash.replace("#", "");
      setTimeout(() => {
        document
          .getElementById(targetId)
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [location.pathname, location.hash]);

  return null;
}

export default function App() {
  return (
    <Router>
      <RouteTitleManager />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}