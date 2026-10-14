import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// Columns ke bajaye Rows (lines) banayi hain taake horizontal alignment kharab na ho
const serviceRows = [
  // Row 1
  [
    {
      label: "Homepage Post",
      description: "Contextual homepage links",
      to: "/pbn/homepage-post",
      icon: "file-text",
    },
    {
      label: ".ID Homepage Post",
      description: "Indonesian contextual links",
      to: "/pbn-id/homepage-post",
      icon: "globe",
    },
    {
      label: "EDU PBN Blogpost",
      description: "Academic contextual articles",
      to: "/edu-gov/pbn-blogpost",
      icon: "graduation",
    },
  ],
  // Row 2 (Badge removed)
  [
    {
      label: "Sidebar Blogroll",
      description: "High-authority sidebar links",
      to: "/pbn/sidebar-blogroll",
      icon: "layout",
    },
    {
      label: ".ID Sidebar Blogroll",
      description: "Local .ID blogroll placement",
      to: "/pbn-id/sidebar-blogroll",
      icon: "map",
    },
    {
      label: "EDU PBN Blogroll",
      description: "University sidebar placements",
      to: "/edu-gov/pbn-blogroll",
      icon: "book",
    },
  ],
  // Row 3
  [
    {
      label: "Homepage Sticky Post",
      description: "Pinned homepage placement",
      to: "/pbn/sticky-post",
      icon: "pin",
    },
    {
      label: ".ID Sticky Post",
      description: "Pinned .ID homepage post",
      to: "/pbn-id/sticky-post",
      icon: "target",
    },
    {
      label: "EDU & GOV Backlink",
      description: "Official authority backlinks",
      to: "/edu-gov/backlink",
      icon: "building",
    },
  ],
];

const sidebarLinks = [
  { label: "Complete SEO Package", to: "/seo-packages/complete" },
  { label: "Rank on First Page", to: "/seo-packages/first-page" },
  { label: "Custom SEO Solutions", to: "/contact" },
  { label: "Talk to our team", to: "/contact" },
  { label: "See all packages", to: "/services" },
];

function MinimalSEOIcon({ name }) {
  const icons = {
    "file-text": (
      <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    ),
    "layout": (
      <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="3" y1="9" x2="21" y2="9"></line>
        <line x1="9" y1="21" x2="9" y2="9"></line>
      </svg>
    ),
    "pin": (
      <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="17" x2="12" y2="22"></line>
        <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
      </svg>
    ),
    "globe": (
      <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
    ),
    "map": (
      <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
        <line x1="8" y1="2" x2="8" y2="18"></line>
        <line x1="16" y1="6" x2="16" y2="22"></line>
      </svg>
    ),
    "target": (
      <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <circle cx="12" cy="12" r="6"></circle>
        <circle cx="12" cy="12" r="2"></circle>
      </svg>
    ),
    "graduation": (
      <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
        <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
      </svg>
    ),
    "book": (
      <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
      </svg>
    ),
    "building": (
      <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
    "layout": "text-[#4285F4]",
    "pin": "text-[#FBBC04]",
    "globe": "text-[#34A853]",
    "map": "text-[#34A853]",
    "target": "text-[#FBBC04]",
    "graduation": "text-[#A142F4]",
    "book": "text-[#A142F4]",
    "building": "text-[#EA4335]",
  };

  return (
    <span className={`${colors[name] || "text-[#4285F4]"}`}>
      {icons[name]}
    </span>
  );
}

export default function Header() {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false); // New state for scroll detection
  const headerRef = useRef(null);

  const closeMenu = () => {
    setIsServicesOpen(false);
    setIsMobileOpen(false);
  };

  // Scroll Event Listener to toggle background color
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

  // Click outside listener for Mega Menu
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
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled || isServicesOpen || isMobileOpen
          ? "bg-white/95 backdrop-blur-md border-b border-[#e8eaed] shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
      style={{
        fontFamily: "'Google Sans Text', 'Google Sans', 'Inter', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 lg:px-10 h-[64px] max-w-[1920px] mx-auto">
        
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
              className="h-[26px] w-[26px] object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <span className="text-[21px] font-medium text-[#202124] tracking-[-0.015em] leading-none mt-0.5">
              Jasa Backlinks
            </span>
          </Link>

          {/* Desktop Navigation Links (Aligned to Center vertically by removing arbitrary margins) */}
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
                  isServicesOpen ? "rotate-180 text-[#1a73e8]" : "text-[#5f6368]"
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
              to="/contact"
              onClick={closeMenu}
              className="flex items-center h-full px-1 hover:text-[#202124] transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>

        {/* Right Action Buttons */}
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
            Get started
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex lg:hidden items-center">
          <button
            type="button"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 text-[#5f6368] hover:text-[#202124] rounded-full hover:bg-[#f1f3f4] transition-colors"
            aria-label="Toggle Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Desktop Mega Menu */}
      {isServicesOpen && (
        <div className="hidden lg:flex absolute top-[64px] left-0 w-full bg-white border-b border-[#dadce0] shadow-[0_10px_20px_rgba(60,64,67,0.06)] min-h-[390px]">
          
          {/* Left Panel: Services Rows */}
          <div className="flex-1 py-10 lg:py-12 pl-6 lg:pl-[60px] xl:pl-[120px] 2xl:pl-[170px] pr-6 lg:pr-10 xl:pr-12">
            <div className="flex flex-col gap-10 max-w-[1100px]">
              {serviceRows.map((row, rowIdx) => (
                <div key={rowIdx} className="grid grid-cols-1 lg:grid-cols-3 gap-x-6 lg:gap-x-10 xl:gap-x-16 items-start">
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
                          <h4 className="text-[15px] xl:text-[16px] font-medium text-[#202124] leading-[22px] tracking-[-0.01em] group-hover:text-[#1a73e8] transition-colors whitespace-nowrap">
                            {item.label}
                          </h4>
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
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 18L18 6M6 6l12 12" />
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

      {/* Mobile Navigation Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden absolute top-[64px] left-0 w-full bg-white border-b border-[#dadce0] px-6 py-5 space-y-4 max-h-[calc(100vh-64px)] overflow-y-auto">
          <Link to="/" onClick={closeMenu} className="block py-2 text-[16px] font-medium text-[#202124]">
            Home
          </Link>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setIsServicesOpen(!isServicesOpen)}
              className="flex w-full items-center justify-between py-2 text-[16px] font-medium text-[#202124]"
            >
              <span>Services</span>
              <svg
                className={`w-4 h-4 transition-transform ${isServicesOpen ? "rotate-180 text-[#1a73e8]" : "text-[#5f6368]"}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isServicesOpen && (
              <div className="pl-2 space-y-5 pt-2 pb-3">
                {serviceRows.flat().map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={closeMenu}
                    className="flex items-start gap-4 group"
                  >
                    <div className="mt-0.5 p-1 rounded-md bg-gray-50 border border-gray-100 group-hover:bg-blue-50 group-hover:border-blue-100 shrink-0">
                      <MinimalSEOIcon name={item.icon} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[15px] font-medium text-[#202124]">{item.label}</span>
                        {item.badge && (
                          <span className="rounded bg-[#f1f3f4] px-1.5 py-0.5 text-[10px] font-bold text-[#5f6368]">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[13.5px] text-[#5f6368] mt-0.5 line-clamp-2">{item.description}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/about" onClick={closeMenu} className="block py-2 text-[16px] font-medium text-[#202124]">
            About
          </Link>
          <Link to="/contact" onClick={closeMenu} className="block py-2 text-[16px] font-medium text-[#202124]">
            Contact
          </Link>

          <div className="pt-3 flex flex-col gap-2.5">
            <Link
              to="/services"
              onClick={closeMenu}
              className="flex h-[40px] w-full items-center justify-center rounded-full border border-[#dadce0] text-[14px] font-medium text-[#1a73e8]"
            >
              Explore packages
            </Link>
            <Link
              to="/contact"
              onClick={closeMenu}
              className="flex h-[40px] w-full items-center justify-center rounded-full bg-[#1a73e8] text-[14px] font-medium text-white"
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
