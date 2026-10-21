import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FloatingReviewWidget from "./components/FloatingReviewWidget";
import FloatingContactWidget from "./components/FloatingContactWidget";
import CookieConsent from "./components/CookieConsent";
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetail, { SERVICE_PAGES_DATA } from "./pages/ServiceDetail";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import AdminBlog from "./pages/AdminBlog";

const SITE_URL =
  import.meta.env.VITE_SITE_URL ||
  (typeof window !== "undefined"
    ? window.location.origin
    : "https://www.jasabacklinks.net");

// --- AUTOMATIC TAB TITLE, META DESCRIPTION, CANONICAL & JSON-LD SCHEMA MANAGER ---
function RouteTitleManager() {
  const location = useLocation();

  useEffect(() => {
    const rawPath = location.pathname.toLowerCase();
    const path =
      rawPath.length > 1 && rawPath.endsWith("/")
        ? rawPath.slice(0, -1)
        : rawPath;
    const canonicalUrl = `${SITE_URL}${path === "/" ? "" : path}`;

    // Single blog post (/blog/:slug) manages its own SEO title & meta description inside BlogPost.jsx
    const isSingleBlogPost = path.startsWith("/blog/") && path !== "/blog";

    // 1. Static Pages Title & Meta Description Map
    const staticSeoMap = {
      "/": {
        title: "Jasa Backlinks",
        description:
          "Scale your Google rankings with Jasa Backlinks (by SeoHub Ltd). Verified DA/DR 50+ Homepage PBN Posts, Sidebar Blogrolls, .ID Regional, and .EDU/.GOV backlinks starting at $1/link.",
      },
      "/services": {
        title: "Services | Jasa Backlinks",
        description:
          "Explore all 12 verified DA/DR 50+ link building services, including Homepage PBN Posts, Sidebar Blogrolls, .ID Regional Links, and EDU/GOV backlinks.",
      },
      "/about": {
        title: "About | Jasa Backlinks",
        description:
          "Learn how Jasa Backlinks and SeoHub Ltd engineer footprint-free DA/DR 50+ private link infrastructure for global SEO agencies and enterprise brands.",
      },
      "/contact": {
        title: "Contact | Jasa Backlinks",
        description:
          "Connect with our 24/7 SEO agency desk via WhatsApp, Telegram, or official support email for bulk orders and white-label link building campaigns.",
      },
      "/privacy": {
        title: "Privacy Policy | Jasa Backlinks",
        description:
          "Read the Jasa Backlinks and SeoHub Ltd Privacy Policy, payment security standards, and strict white-label agency non-disclosure guarantees.",
      },
      "/privacy-policy": {
        title: "Privacy Policy | Jasa Backlinks",
        description:
          "Read the Jasa Backlinks and SeoHub Ltd Privacy Policy, payment security standards, and strict white-label agency non-disclosure guarantees.",
      },
      "/terms": {
        title: "Terms of Service | Jasa Backlinks",
        description:
          "Review our Terms of Service, DA/DR 50+ metric guarantees, 5–7 day turnaround SLAs, and 12-month link replacement policy.",
      },
      "/terms-of-service": {
        title: "Terms of Service | Jasa Backlinks",
        description:
          "Review our Terms of Service, DA/DR 50+ metric guarantees, 5–7 day turnaround SLAs, and 12-month link replacement policy.",
      },
      "/blog": {
        title: "SEO & Authority Link Building Blog | Jasa Backlinks",
        description:
          "Read technical SEO guides, DA/DR 50+ PBN case studies, .ID regional ranking strategies, and .EDU/.GOV authority insights from SeoHub Ltd.",
      },
      "/admin": {
        title: "Admin Blog CMS | Jasa Backlinks",
        description: "Jasa Backlinks Administrator Content Management Portal.",
      },
    };

    let pageTitle = "Jasa Backlinks | Powered by SeoHub Ltd";
    let pageDescription = staticSeoMap["/"].description;
    let matchedService = null;

    if (staticSeoMap[path]) {
      pageTitle = staticSeoMap[path].title;
      pageDescription = staticSeoMap[path].description;
    } else if (path.startsWith("/services/")) {
      const slug = path.replace("/services/", "").split("/")[0];
      matchedService = (SERVICE_PAGES_DATA || []).find(
        (s) =>
          s.slug === slug ||
          s.id === slug ||
          (s.aliases && s.aliases.includes(slug)),
      );

      if (matchedService) {
        pageTitle = `${matchedService.name} (${matchedService.metric}) — $${matchedService.price.toFixed(2)}/Link | Jasa Backlinks`;
        pageDescription = `${matchedService.desc} Starting at $${matchedService.price.toFixed(2)} USD per link (Min 50 links) with verified ${matchedService.metric} metrics and white-label Excel reporting.`;
      } else {
        pageTitle = "SEO & Backlink Service | Jasa Backlinks";
      }
    }

    if (!isSingleBlogPost) {
      document.title = pageTitle;

      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute("content", pageDescription);

      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute("content", pageTitle);

      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute("content", pageDescription);
    }

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", canonicalUrl);

    // 2. Build Dynamic JSON-LD Schema.org @graph
    const organizationSchema = {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Jasa Backlinks",
      legalName: "SeoHub Ltd",
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      email: "jasa-backlinks@seohubltd.com",
      description:
        "Enterprise PBN and high-authority DA/DR 50+ link building infrastructure across .COM, .ID regional, and .EDU/.GOV domains.",
      parentOrganization: {
        "@type": "Organization",
        name: "SeoHub Ltd",
        url: "https://seohub.ltd",
      },
      sameAs: ["https://t.me/jasabacklinks", "https://wa.me/6281234567890"],
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "jasa-backlinks@seohubltd.com",
          telephone: "+62-812-3456-7890",
          availableLanguage: ["English", "Indonesian"],
        },
      ],
    };

    const websiteSchema = {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Jasa Backlinks",
      description: staticSeoMap["/"].description,
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
    };

    const breadcrumbItems = [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
    ];

    if (path === "/services") {
      breadcrumbItems.push({
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: `${SITE_URL}/services`,
      });
    } else if (matchedService) {
      breadcrumbItems.push(
        {
          "@type": "ListItem",
          position: 2,
          name: "Services",
          item: `${SITE_URL}/services`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: matchedService.name,
          item: canonicalUrl,
        },
      );
    } else if (path !== "/") {
      breadcrumbItems.push({
        "@type": "ListItem",
        position: 2,
        name: pageTitle.split("|")[0].trim(),
        item: canonicalUrl,
      });
    }

    const breadcrumbSchema = {
      "@type": "BreadcrumbList",
      "@id": `${canonicalUrl}#breadcrumb`,
      itemListElement: breadcrumbItems,
    };

    const schemaGraph = [organizationSchema, websiteSchema, breadcrumbSchema];

    if (path === "/" || path === "/services") {
      const catalogueItems = (SERVICE_PAGES_DATA || []).map((svc, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "Service",
          "@id": `${SITE_URL}/services/${svc.slug}#service`,
          name: svc.name,
          description: svc.desc,
          url: `${SITE_URL}/services/${svc.slug}`,
          provider: {
            "@id": `${SITE_URL}/#organization`,
          },
          offers: {
            "@type": "Offer",
            priceCurrency: "USD",
            price: svc.price.toFixed(2),
            availability: "https://schema.org/InStock",
            url: `${SITE_URL}/services/${svc.slug}`,
          },
        },
      }));

      schemaGraph.push({
        "@type": "ItemList",
        "@id": `${canonicalUrl}#service-catalogue`,
        name: "Jasa Backlinks Enterprise SEO & PBN Catalogue",
        itemListElement: catalogueItems,
      });
    }

    if (matchedService) {
      schemaGraph.push({
        "@type": ["Service", "Product"],
        "@id": `${canonicalUrl}#service`,
        name: `${matchedService.name} (${matchedService.metric})`,
        description: matchedService.desc,
        sku: matchedService.id,
        brand: {
          "@type": "Brand",
          name: "Jasa Backlinks",
        },
        provider: {
          "@id": `${SITE_URL}/#organization`,
        },
        areaServed: "Worldwide",
        serviceType: matchedService.categoryLabel,
        offers: {
          "@type": "Offer",
          url: canonicalUrl,
          priceCurrency: "USD",
          price: matchedService.price.toFixed(2),
          availability: "https://schema.org/InStock",
          eligibleQuantity: {
            "@type": "QuantitativeValue",
            minValue: matchedService.minQty || 50,
            maxValue: 5000,
            unitText: "Links",
          },
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "1636",
          bestRating: "5",
          worstRating: "1",
        },
      });

      if (
        Array.isArray(matchedService.faqs) &&
        matchedService.faqs.length > 0
      ) {
        schemaGraph.push({
          "@type": "FAQPage",
          "@id": `${canonicalUrl}#faq`,
          mainEntity: matchedService.faqs.map((faqItem) => ({
            "@type": "Question",
            name: faqItem.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: faqItem.a,
            },
          })),
        });
      }
    }

    if (path === "/about") {
      schemaGraph.push({
        "@type": "AboutPage",
        "@id": `${canonicalUrl}#aboutpage`,
        url: canonicalUrl,
        name: pageTitle,
        description: pageDescription,
        mainEntity: {
          "@id": `${SITE_URL}/#organization`,
        },
      });
    }

    if (path === "/contact") {
      schemaGraph.push({
        "@type": "ContactPage",
        "@id": `${canonicalUrl}#contactpage`,
        url: canonicalUrl,
        name: pageTitle,
        description: pageDescription,
        mainEntity: {
          "@id": `${SITE_URL}/#organization`,
        },
      });
    }

    const fullJsonLd = {
      "@context": "https://schema.org",
      "@graph": schemaGraph,
    };

    let schemaScript = document.getElementById("jasa-jsonld-schema");
    if (!schemaScript) {
      schemaScript = document.createElement("script");
      schemaScript.id = "jasa-jsonld-schema";
      schemaScript.type = "application/ld+json";
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(fullJsonLd);

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
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/admin" element={<AdminBlog />} />
          </Routes>
        </main>
        <FloatingReviewWidget />
        <CookieConsent />
        <FloatingContactWidget />
        <Footer />
      </div>
    </Router>
  );
}
