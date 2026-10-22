import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// Columns ke bajaye Rows (lines) banayi hain taake horizontal alignment kharab na ho
const serviceRows = [
  // Row 1
  [
    {
      label: "Homepage Post",
      description: "Contextual homepage links",
      to: "/services/homepage-post",
      icon: "file-text",
    },
    {
      label: ".ID Homepage Post",
      description: "Indonesian contextual links",
      to: "/services/id-homepage-post",
      icon: "globe",
    },
    {
      label: "EDU PBN Blogpost",
      description: "Academic contextual articles",
      to: "/services/edu-pbn-blogpost",
      icon: "graduation",
    },
  ],
  // Row 2
  [
    {
      label: "Sidebar Blogroll",
      description: "High-authority sidebar links",
      to: "/services/sidebar-blogroll",
      icon: "layout",
    },
    {
      label: ".ID Sidebar Blogroll",
      description: "Local .ID blogroll placement",
      to: "/services/id-sidebar-blogroll",
      icon: "map",
    },
    {
      label: "EDU PBN Blogroll",
      description: "University sidebar placements",
      to: "/services/edu-pbn-blogroll",
      icon: "book",
    },
  ],
  // Row 3
  [
    {
      label: "Homepage Sticky Post",
      description: "Pinned homepage placement",
      to: "/services/homepage-sticky-post",
      icon: "pin",
    },
    {
      label: ".ID Sticky Post",
      description: "Pinned .ID homepage post",
      to: "/services/id-sticky-post",
      icon: "target",
    },
    {
      label: "EDU & GOV Backlink",
      description: "Official authority backlinks",
      to: "/services/edu-gov-backlink",
      icon: "building",
    },
  ],
];

// Featured Flagship Service
const featuredGuestPosting = {
  label: "Guest Posting",
  badge: "★ #1 Flagship",
  desktopBadge: "★ #1 Flagship Service",
  priceTag: "From $15/link",
  metricsTag: "DA/DR 30+ to 50+",
  description:
    "Contextual dofollow placements on real authority websites with verified monthly organic traffic.",
  to: "/services/guest-posting",
};

const sidebarLinks = [
  { label: "Complete SEO Package", to: "/services/complete-seo-package" },
  { label: "Rank on First Page", to: "/services/rank-on-first-page" },
  { label: "Custom SEO Solutions", to: "/services/custom-seo-solutions" },
  { label: "Talk to our team", to: "/contact" },
  { label: "See all packages", to: "/services" },
];

function MinimalSEOIcon({ name }) {
  const icons = {
    "file-text": (
      <svg
        className="w-[20px] h-[20px] lg:w-[22px] lg:h-[22px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    ),
    layout: (
      <svg
        className="w-[20px] h-[20px] lg:w-[22px] lg:h-[22px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="3" y1="9" x2="21" y2="9"></line>
        <line x1="9" y1="21" x2="9" y2="9"></line>
      </svg>
    ),
    pin: (
      <svg
        className="w-[20px] h-[20px] lg:w-[22px] lg:h-[22px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="17" x2="12" y2="22"></line>
        <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
      </svg>
    ),
    globe: (
      <svg
        className="w-[20px] h-[20px] lg:w-[22px] lg:h-[22px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
    ),
    map: (
      <svg
        className="w-[20px] h-[20px] lg:w-[22px] lg:h-[22px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
        <line x1="8" y1="2" x2="8" y2="18"></line>
        <line x1="16" y1="6" x2="16" y2="22"></line>
      </svg>
    ),
    target: (
      <svg
        className="w-[20px] h-[20px] lg:w-[22px] lg:h-[22px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <circle cx="12" cy="12" r="6"></circle>
        <circle cx="12" cy="12" r="2"></circle>
      </svg>
    ),
    graduation: (
      <svg
        className="w-[20px] h-[20px] lg:w-[22px] lg:h-[22px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
        <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
      </svg>
    ),
    book: (
      <svg
        className="w-[20px] h-[20px] lg:w-[22px] lg:h-[22px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
      </svg>
    ),
    building: (
      <svg
        className="w-[20px] h-[20px] lg:w-[22px] lg:h-[22px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
        <path d="M9 22v-4h6v4"></path>
        <path d="M8 6h.01"></path>
        <path d="M16 6h.01"></path>
        <path d="M12 6h.01"></path>
        <path d="M12 10h.01"></path>
        <path d="M12 14h.01"></path>
        <path d="M16 10h.01"></path>
        <path d="M16 14h.01"></path>
        <path d="M8 10h.01"></path>
        <path d="M8 14h.01"></path>
      </svg>
    ),
  };

  const colors = {
    "file-text": "text-[#4285F4]",
    layout: "text-[#4285F4]",
    pin: "text-[#FBBC04]",
    globe: "text-[#34A853]",
    map: "text-[#34A853]",
    target: "text-[#FBBC04]",
    graduation: "text-[#A142F4]",
    book: "text-[#A142F4]",
    building: "text-[#EA4335]",
  };

  return (
    <span className={`${colors[name] || "text-[#4285F4]"}`}>{icons[name]}</span>
  );
}

export default function Header() {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef(null);

  const closeMenu = () => {
    setIsServicesOpen(false);
    setIsMobileServicesOpen(false);
    setIsMobileOpen(false);
  };

  // Scroll Event Listener to toggle background colour
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock background page scroll on iPhone/Mobile when mobile drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  // Click outside listener for Desktop Mega Menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setIsServicesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 w-full z-[110] transition-all duration-300 ${
        isScrolled || isServicesOpen || isMobileOpen
          ? "bg-white/95 backdrop-blur-md"
          : "bg-transparent"
      }`}
      style={{
        fontFamily:
          "'Google Sans Text', 'Google Sans', 'Inter', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 h-[56px] max-w-[1920px] mx-auto">
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center h-full">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-2.5 no-underline select-none shrink-0"
          >
            <img
              src="/favicon.svg"
              alt="Jasa Backlinks"
              width="32"
              height="32"
              className="h-[26px] w-[26px] object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <span className="flex flex-col items-end justify-center">
              <span className="text-[20px] sm:text-[21px] font-medium text-[#202124] tracking-[-0.015em] leading-none mt-0.5">
                Jasa Backlinks
              </span>
              <span className="text-[9px] font-medium text-[#5f6368] leading-tight tracking-[0.02em]">
                Powered By <span className="text-[#1a73e8]">SeoHub Ltd</span>
              </span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-9 h-full ml-8 xl:ml-12 text-[14px] font-medium text-[#5f6368]">
            <Link
              to="/"
              onClick={closeMenu}
              className="flex items-center h-full px-1 hover:text-[#202124] transition-colors"
            >
              Home
            </Link>

            <button
              type="button"
              onClick={() => setIsServicesOpen(!isServicesOpen)}
              className={`relative flex items-center h-full px-1 cursor-pointer transition-colors focus:outline-none ${
                isServicesOpen ? "text-[#1a73e8]" : "hover:text-[#202124]"
              }`}
            >
              <span className="mr-1">Services</span>
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isServicesOpen
                    ? "rotate-180 text-[#1a73e8]"
                    : "text-[#5f6368]"
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.3"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <Link
              to="/about"
              onClick={closeMenu}
              className="flex items-center h-full px-1 hover:text-[#202124] transition-colors"
            >
              About
            </Link>

            <Link
              to="/Blog"
              onClick={closeMenu}
              className="flex items-center h-full px-1 hover:text-[#202124] transition-colors"
            >
              Blog
            </Link>
          </nav>
        </div>

        {/* Right Action Buttons (Desktop) */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <Link
            to="/services"
            onClick={closeMenu}
            className={`inline-flex h-[40px] items-center justify-center rounded-full px-5 text-[14px] font-medium whitespace-nowrap transition-colors border ${
              isScrolled || isServicesOpen
                ? "bg-white text-[#1a73e8] border-[#dadce0] hover:bg-[#f8f9fa] hover:border-[#d2e3fc]"
                : "bg-white/50 text-[#1a73e8] border-[#dadce0]/50 hover:bg-white hover:border-[#dadce0]"
            }`}
          >
            Explore services
          </Link>
          <Link
            to="/contact"
            onClick={closeMenu}
            className="inline-flex h-[40px] items-center justify-center rounded-full bg-[#1a73e8] px-6 text-[14px] font-medium text-white hover:bg-[#1557b0] transition-colors whitespace-nowrap"
          >
            Contact Us
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex lg:hidden items-center">
          <button
            type="button"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 text-[#5f6368] hover:text-[#202124] rounded-full hover:bg-[#f1f3f4] transition-colors cursor-pointer"
            aria-label="Toggle Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Desktop Mega Menu (100% Untouched) */}
      {isServicesOpen && (
        <div className="hidden lg:flex absolute top-[56px] left-0 w-full bg-white border-b border-[#dadce0] shadow-[0_10px_20px_rgba(60,64,67,0.06)] min-h-[390px]">
          {/* Left Panel: 3x3 Services Rows on Top + Featured Guest Posting Bar at Bottom */}
          <div className="flex-1 py-10 lg:py-12 pl-6 lg:pl-[60px] xl:pl-[120px] 2xl:pl-[170px] pr-6 lg:pr-10 xl:pr-12">
            <div className="flex flex-col gap-9 max-w-[1100px]">
              {/* 3x3 Services Grid */}
              {serviceRows.map((row, rowIdx) => (
                <div
                  key={rowIdx}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-x-6 lg:gap-x-10 xl:gap-x-16 items-start"
                >
                  {row.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={closeMenu}
                      className="group flex items-start gap-4 no-underline"
                    >
                      <div className="mt-[2px] p-1.5 rounded-lg bg-gray-50 border border-gray-100 transition-colors duration-150 group-hover:bg-blue-50 group-hover:border-blue-100 shrink-0">
                        <MinimalSEOIcon name={item.icon} />
                      </div>
                      <div className="min-w-0 pt-0.5">
                        <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
                          <h2 className="text-[15px] xl:text-[16px] font-medium text-[#202124] leading-[22px] tracking-[-0.01em] group-hover:text-[#1a73e8] transition-colors whitespace-nowrap">
                            {item.label}
                          </h2>
                          {item.badge && (
                            <span className="inline-flex items-center rounded-[4px] bg-[#f1f3f4] px-2 py-[3px] text-[10px] font-bold text-[#5f6368] leading-none whitespace-nowrap">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[13px] xl:text-[14px] font-normal text-[#5f6368] leading-[20px] mt-[4px] pr-2 line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ))}

              {/* BOTTOM FULL-WIDTH SPOTLIGHT BAR: GUEST POSTING */}
              <div>
                <Link
                  to={featuredGuestPosting.to}
                  onClick={closeMenu}
                  className="group flex items-center justify-between gap-6 p-3.5 xl:p-4 rounded-[16px] bg-gradient-to-r from-[#f8fbff] via-[#eef5ff] to-[#f1faf4] border border-[#d2e3fc] hover:border-[#1a73e8] shadow-[0_4px_14px_rgba(26,115,232,0.06)] hover:shadow-[0_8px_22px_rgba(26,115,232,0.12)] transition-all duration-200 no-underline"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-[12px] bg-white border border-[#d2e3fc] flex items-center justify-center shadow-sm shrink-0 overflow-hidden">
                      <img
                        src="/favicon.svg"
                        alt="Guest Posting Icon"
                        className="w-6 h-6 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center flex-wrap gap-2">
                        <h2 className="text-[15.5px] xl:text-[16.5px] font-semibold text-[#202124] group-hover:text-[#1a73e8] transition-colors leading-snug">
                          {featuredGuestPosting.label}
                        </h2>
                        <span className="inline-flex items-center rounded-full bg-[#1a73e8] px-2.5 py-0.5 text-[10.5px] font-semibold text-white">
                          {featuredGuestPosting.desktopBadge}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-[#e6f4ea] border border-[#ceead6] px-2.5 py-0.5 text-[10.5px] font-semibold text-[#1e8e3e]">
                          {featuredGuestPosting.metricsTag}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-white border border-[#d2e3fc] px-2.5 py-0.5 text-[10.5px] font-bold text-[#1a73e8]">
                          {featuredGuestPosting.priceTag}
                        </span>
                      </div>
                      <p className="text-[13px] text-[#5f6368] mt-0.5 truncate">
                        {featuredGuestPosting.description}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1a73e8] group-hover:bg-[#1557b0] text-white px-4 py-2 text-[12.5px] font-medium shadow-sm transition-all shrink-0 whitespace-nowrap">
                    <span>Order Guest Posts</span>
                    <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Panel: Light Grey Sidebar */}
          <aside className="w-[280px] lg:w-[320px] xl:w-[400px] 2xl:w-[460px] shrink-0 bg-[#f8f9fa] py-12 px-8 xl:px-14 relative flex flex-col justify-start">
            <button
              type="button"
              onClick={closeMenu}
              className="absolute top-6 right-6 xl:right-10 p-2 text-[#5f6368] hover:text-[#202124] hover:bg-[#e8eaed] rounded-full transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <svg
                className="w-[18px] h-[18px]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="flex flex-col gap-[26px] mt-3">
              {sidebarLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={closeMenu}
                  className="text-[15px] xl:text-[16px] font-medium text-[#202124] leading-[24px] tracking-[-0.01em] hover:text-[#1a73e8] transition-colors no-underline w-fit"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </aside>
        </div>
      )}

      {/* Mobile Navigation Drawer (iPhone 100dvh Safe + Pinned Bottom Buttons + Top Guest Posting Spotlight) */}
      {isMobileOpen && (
        <div className="lg:hidden fixed top-[56px] left-0 right-0 w-full h-[calc(100dvh-56px)] max-h-[calc(100vh-56px)] bg-white flex flex-col justify-between z-[110] shadow-xl">
          {/* Scrollable Middle Navigation Area */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 py-4 space-y-2">
            {/* 1. ALWAYS-VISIBLE GUEST POSTING SPOTLIGHT CARD ON MOBILE */}
            <Link
              to={featuredGuestPosting.to}
              onClick={closeMenu}
              className="flex items-center justify-between gap-3 p-3.5 rounded-[16px] bg-gradient-to-r from-[#f8fbff] via-[#eef5ff] to-[#f1faf4] border-2 border-[#d2e3fc] shadow-[0_4px_14px_rgba(26,115,232,0.08)] no-underline mb-2"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-[12px] bg-white border border-[#d2e3fc] flex items-center justify-center shadow-sm shrink-0">
                  <img
                    src="/favicon.svg"
                    alt="Guest Posting"
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[15px] font-semibold text-[#202124]">
                      {featuredGuestPosting.label}
                    </span>
                    <span className="rounded-full bg-[#1a73e8] px-2 py-0.5 text-[10px] font-semibold text-white">
                      {featuredGuestPosting.badge}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span className="rounded-md bg-[#e6f4ea] px-1.5 py-0.5 text-[10.5px] font-semibold text-[#1e8e3e]">
                      {featuredGuestPosting.metricsTag}
                    </span>
                    <span className="rounded-md bg-white border border-[#d2e3fc] px-1.5 py-0.5 text-[10.5px] font-bold text-[#1a73e8]">
                      {featuredGuestPosting.priceTag}
                    </span>
                  </div>
                </div>
              </div>
              <span className="w-8 h-8 rounded-full bg-[#1a73e8] text-white flex items-center justify-center text-[14px] font-bold shrink-0">
                →
              </span>
            </Link>

            <Link
              to="/"
              onClick={closeMenu}
              className="flex items-center justify-between px-3 py-2.5 rounded-[12px] text-[15.5px] font-medium text-[#202124] hover:bg-[#f8f9fa]"
            >
              <span>Home</span>
            </Link>

            {/* Mobile Services Accordion */}
            <div className="rounded-[14px] bg-[#f8f9fa]/70 border border-[#e8eaed] overflow-hidden">
              <button
                type="button"
                onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                className="flex w-full items-center justify-between px-3.5 py-3 text-[15.5px] font-medium text-[#202124] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span>All SEO & PBN Services</span>
                  <span className="text-[11px] font-semibold bg-[#e8f0fe] text-[#1a73e8] px-2 py-0.5 rounded-full">
                    13
                  </span>
                </div>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isMobileServicesOpen
                      ? "rotate-180 text-[#1a73e8]"
                      : "text-[#5f6368]"
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isMobileServicesOpen && (
                <div className="px-2.5 pb-3 pt-1 space-y-1.5 bg-white border-t border-[#e8eaed]">
                  {/* Guest Posting #1 Inside Dropdown as well */}
                  <Link
                    to={featuredGuestPosting.to}
                    onClick={closeMenu}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-[12px] bg-[#f8fbff] border border-[#d2e3fc]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-1.5 rounded-lg bg-white border border-[#d2e3fc] shrink-0">
                        <img
                          src="/favicon.svg"
                          alt="Guest Posting"
                          className="w-[18px] h-[18px] object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[14px] font-semibold text-[#1a73e8] block leading-tight">
                          Guest Posting (Real Traffic)
                        </span>
                        <span className="text-[12px] text-[#5f6368] block">
                          DA/DR 30+ to 50+ • From $15/link
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-[#1a73e8] bg-[#e8f0fe] px-2 py-0.5 rounded-full shrink-0">
                      #1
                    </span>
                  </Link>

                  {/* 9 Core PBN Services */}
                  {serviceRows.flat().map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={closeMenu}
                      className="flex items-center gap-3 p-2 rounded-[10px] hover:bg-[#f8f9fa] transition-colors"
                    >
                      <div className="p-1.5 rounded-lg bg-gray-50 border border-gray-100 shrink-0">
                        <MinimalSEOIcon name={item.icon} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[14px] font-medium text-[#202124] leading-tight">
                          {item.label}
                        </div>
                        <div className="text-[12px] text-[#5f6368] truncate">
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  ))}

                  {/* Managed SEO Packages */}
                  <div className="pt-2 mt-2 border-t border-[#f1f3f4] grid grid-cols-1 gap-1">
                    {sidebarLinks.slice(0, 3).map((pkg) => (
                      <Link
                        key={pkg.to}
                        to={pkg.to}
                        onClick={closeMenu}
                        className="flex items-center justify-between px-3 py-2 rounded-[10px] bg-[#f8f9fa] text-[13px] font-medium text-[#202124] hover:text-[#1a73e8]"
                      >
                        <span>{pkg.label}</span>
                        <span className="text-[#1a73e8] text-[12px]">→</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/about"
              onClick={closeMenu}
              className="flex items-center justify-between px-3 py-2.5 rounded-[12px] text-[15.5px] font-medium text-[#202124] hover:bg-[#f8f9fa]"
            >
              <span>About</span>
            </Link>

            <Link
              to="/Blog"
              onClick={closeMenu}
              className="flex items-center justify-between px-3 py-2.5 rounded-[12px] text-[15.5px] font-medium text-[#202124] hover:bg-[#f8f9fa]"
            >
              <span>Blog</span>
            </Link>

            <Link
              to="/contact"
              onClick={closeMenu}
              className="flex items-center justify-between px-3 py-2.5 rounded-[12px] text-[15.5px] font-medium text-[#202124] hover:bg-[#f8f9fa]"
            >
              <span>Contact</span>
            </Link>
          </div>

          {/* Pinned iPhone-Safe Bottom Action Buttons (Never Hidden by iOS Safari Bar) */}
          <div className="shrink-0 bg-white border-t border-[#e8eaed] px-4 sm:px-6 pt-3 pb-[max(20px,env(safe-area-inset-bottom))] shadow-[0_-8px_20px_rgba(0,0,0,0.04)]">
            <div className="grid grid-cols-2 gap-2.5">
              <Link
                to="/services"
                onClick={closeMenu}
                className="flex h-[44px] w-full items-center justify-center rounded-full border border-[#dadce0] bg-white text-[13.5px] font-medium text-[#1a73e8] active:bg-[#f8f9fa] no-underline"
              >
                Explore Packages
              </Link>
              <Link
                to="/contact"
                onClick={closeMenu}
                className="flex h-[44px] w-full items-center justify-center rounded-full bg-[#1a73e8] text-[13.5px] font-medium text-white shadow-sm active:bg-[#1557b0] no-underline"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
