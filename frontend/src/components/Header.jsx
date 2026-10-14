import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const serviceColumns = [
  // Column 1: PBN Services
  [
    {
      label: "Homepage Post",
      description: "Contextual homepage links",
      to: "/pbn/homepage-post",
      icon: "gmail",
    },
    {
      label: "Sidebar Blogroll",
      description: "High-authority sidebar links",
      to: "/pbn/sidebar-blogroll",
      icon: "drive",
    },
    {
      label: "Homepage Sticky Post",
      description: "Pinned homepage placement",
      to: "/pbn/sticky-post",
      icon: "meet",
    },
  ],
  // Column 2: PBN.ID Services
  [
    {
      label: ".ID Homepage Post",
      description: "Indonesian contextual links",
      to: "/pbn-id/homepage-post",
      icon: "docs",
    },
    {
      label: ".ID Sidebar Blogroll",
      description: "Local .ID blogroll placement",
      to: "/pbn-id/sidebar-blogroll",
      icon: "sheets",
    },
    {
      label: ".ID Sticky Post",
      description: "Pinned .ID homepage post",
      to: "/pbn-id/sticky-post",
      icon: "slides",
    },
  ],
  // Column 3: EDU & GOV Services
  [
    {
      label: "EDU PBN Blogpost",
      description: "Academic contextual articles",
      to: "/edu-gov/pbn-blogpost",
      icon: "gemini",
    },
    {
      label: "EDU PBN Blogroll",
      description: "University sidebar placements",
      to: "/edu-gov/pbn-blogroll",
      icon: "notebook",
    },
    {
      label: "EDU & GOV Backlink",
      description: "Official authority backlinks",
      to: "/edu-gov/backlink",
      icon: "studio",
    },
  ],
];

const sidebarLinks = [
  { label: "Complete SEO Package", to: "/seo-packages/complete" },
  { label: "Rank on First Page", to: "/seo-packages/first-page" },
  { label: "Custom SEO Solutions", to: "/contact" },
  { label: "Talk to our team", to: "/contact" },
  { label: "See all packages", to: "/pricing" },
];

// Exact Google Workspace Icons from Screenshot
function WorkspaceIcon({ name }) {
  const icons = {
    // Gmail Multi-Colour M Icon
    gmail: (
      <svg
        className="w-[26px] h-[26px] shrink-0"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M2 6.5V18C2 19.1 2.9 20 4 20H6V9.8L12 14.3L18 9.8V20H20C21.1 20 22 19.1 22 18V6.5C22 4.8 20.1 3.8 18.7 4.9L12 9.9L5.3 4.9C3.9 3.8 2 4.8 2 6.5Z"
          fill="#EA4335"
        />
        <path
          d="M2 6.5V18C2 19.1 2.9 20 4 20H6V9.8L2 6.8V6.5Z"
          fill="#4285F4"
        />
        <path
          d="M22 6.5V18C22 19.1 21.1 20 20 20H18V9.8L22 6.8V6.5Z"
          fill="#34A853"
        />
        <path
          d="M18 9.8V4.8L20.5 4.8C21.4 4.8 22 5.6 22 6.8L18 9.8Z"
          fill="#FBBC04"
        />
        <path
          d="M6 9.8V4.8L3.5 4.8C2.6 4.8 2 5.6 2 6.8L6 9.8Z"
          fill="#C5221F"
        />
      </svg>
    ),
    // Google Drive Triangle Icon
    drive: (
      <svg
        className="w-[26px] h-[26px] shrink-0"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path d="M8.7 3.5H15.3L21.5 14.2H14.9L8.7 3.5Z" fill="#FBBC04" />
        <path d="M2.5 14.2L8.7 3.5L12 9.2L5.8 19.9L2.5 14.2Z" fill="#0F9D58" />
        <path d="M5.8 19.9H18.2L21.5 14.2H9.1L5.8 19.9Z" fill="#4285F4" />
      </svg>
    ),
    // Google Meet Camera Icon
    meet: (
      <svg
        className="w-[26px] h-[26px] shrink-0"
        viewBox="0 0 24 24"
        fill="none"
      >
        <rect
          x="2.5"
          y="5.5"
          width="13.5"
          height="13"
          rx="2.5"
          fill="#FBBC04"
        />
        <path
          d="M16 10.2L20.3 6.7C20.9 6.2 21.8 6.6 21.8 7.4V16.6C21.8 17.4 20.9 17.8 20.3 17.3L16 13.8V10.2Z"
          fill="#34A853"
        />
        <path
          d="M11 5.5H13.5C14.9 5.5 16 6.6 16 8V16C16 17.4 14.9 18.5 13.5 18.5H11V5.5Z"
          fill="#EA4335"
          opacity="0.25"
        />
      </svg>
    ),
    // Google Docs Icon
    docs: (
      <svg
        className="w-[26px] h-[26px] shrink-0"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M6.5 2C5.4 2 4.5 2.9 4.5 4V20C4.5 21.1 5.4 22 6.5 22H17.5C18.6 22 19.5 21.1 19.5 20V7.5L14 2H6.5Z"
          fill="#4285F4"
        />
        <path d="M14 2V7.5H19.5L14 2Z" fill="#A1C2FA" />
        <path
          d="M8 11.5H16V13H8V11.5ZM8 14.5H16V16H8V14.5ZM8 17.5H13V19H8V17.5Z"
          fill="#FFFFFF"
        />
      </svg>
    ),
    // Google Sheets Icon
    sheets: (
      <svg
        className="w-[26px] h-[26px] shrink-0"
        viewBox="0 0 24 24"
        fill="none"
      >
        <rect x="3" y="4.5" width="18" height="15" rx="2.5" fill="#34A853" />
        <path d="M3 9.5H21V11H3V9.5Z" fill="#188038" />
        <path d="M9.5 4.5V19.5H11V4.5H9.5Z" fill="#188038" />
        <rect
          x="5.5"
          y="12.5"
          width="2.5"
          height="4.5"
          rx="0.5"
          fill="#FFFFFF"
        />
        <rect
          x="12.5"
          y="12.5"
          width="6"
          height="1.5"
          rx="0.5"
          fill="#FFFFFF"
        />
        <rect
          x="12.5"
          y="15.5"
          width="6"
          height="1.5"
          rx="0.5"
          fill="#FFFFFF"
        />
      </svg>
    ),
    // Google Slides Icon
    slides: (
      <svg
        className="w-[26px] h-[26px] shrink-0"
        viewBox="0 0 24 24"
        fill="none"
      >
        <rect x="3" y="4.5" width="18" height="15" rx="2.5" fill="#FBBC04" />
        <rect x="6" y="7.5" width="12" height="9" rx="1.2" fill="#FFFFFF" />
        <rect x="8" y="9.5" width="8" height="5" rx="0.6" fill="#F29900" />
      </svg>
    ),
    // Gemini Sparkle Icon
    gemini: (
      <svg
        className="w-[26px] h-[26px] shrink-0"
        viewBox="0 0 24 24"
        fill="none"
      >
        <defs>
          <linearGradient
            id="geminiSparkle"
            x1="2"
            y1="2"
            x2="22"
            y2="22"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#4285F4" />
            <stop offset="50%" stopColor="#34A853" />
            <stop offset="100%" stopColor="#FBBC04" />
          </linearGradient>
        </defs>
        <path
          d="M12 2C12 7.52 16.48 12 22 12C16.48 12 12 16.48 12 22C12 16.48 7.52 12 2 12C7.52 12 12 7.52 12 2Z"
          fill="url(#geminiSparkle)"
        />
      </svg>
    ),
    // Gemini Notebook Arch Icon
    notebook: (
      <svg
        className="w-[26px] h-[26px] shrink-0"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M4.5 18.5V12C4.5 7.86 7.86 4.5 12 4.5C16.14 4.5 19.5 7.86 19.5 12V18.5"
          stroke="#4285F4"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M8 18.5V12.5C8 10.29 9.79 8.5 12 8.5C14.21 8.5 16 10.29 16 12.5V18.5"
          stroke="#669DF6"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M11.5 18.5V13.5C11.5 12.67 12.17 12 13 12C13.83 12 14.5 12.67 14.5 13.5V18.5"
          stroke="#A1C2FA"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    ),
    // Studio Double Chevron Icon
    studio: (
      <svg
        className="w-[26px] h-[26px] shrink-0"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M7.5 5.5L14 12L7.5 18.5"
          stroke="#A1C2FA"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.5 5.5L19 12L12.5 18.5"
          stroke="#4285F4"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  };

  return icons[name] || icons.docs;
}

export default function Header() {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const headerRef = useRef(null);

  const closeMenu = () => {
    setIsServicesOpen(false);
    setIsMobileOpen(false);
  };

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
      className="sticky top-0 z-50 bg-white border-b border-[#e8eaed]"
      style={{
        fontFamily:
          "'Google Sans Text', 'Google Sans', 'Inter', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 lg:px-10 h-[64px] max-w-[1920px] mx-auto">
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center gap-12 h-full">
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-2.5 no-underline select-none"
          >
            <img
              src="/favicon.svg"
              alt="Jasa Backlinks"
              className="h-[26px] w-[26px] object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <span className="text-[21px] font-medium text-[#202124] tracking-[-0.015em] leading-none">
              Jasa Backlinks
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-9 h-full text-[14px] font-medium text-[#5f6368]">
            <Link
              to="/"
              onClick={closeMenu}
              className="flex items-center h-full hover:text-[#202124] transition-colors"
            >
              Home
            </Link>

            <button
              type="button"
              onClick={() => setIsServicesOpen(!isServicesOpen)}
              className={`relative flex items-center h-full cursor-pointer transition-colors focus:outline-none ${
                isServicesOpen
                  ? "text-[#1a73e8]"
                  : "text-[#5f6368] hover:text-[#202124]"
              }`}
            >
              <span>Services</span>
              <svg
                className={`absolute left-1/2 -translate-x-1/2 bottom-[7px] w-[12px] h-[12px] transition-transform duration-200 ${
                  isServicesOpen ? "text-[#1a73e8]" : "text-[#5f6368]"
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.3"
                  d={isServicesOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                />
              </svg>
            </button>

            <Link
              to="/pricing"
              onClick={closeMenu}
              className="flex items-center h-full hover:text-[#202124] transition-colors"
            >
              Pricing
            </Link>

            <Link
              to="/contact"
              onClick={closeMenu}
              className="flex items-center h-full hover:text-[#202124] transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>

        {/* Right Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/pricing"
            onClick={closeMenu}
            className="inline-flex h-[40px] items-center justify-center rounded-full border border-[#dadce0] bg-white px-5 text-[14px] font-medium text-[#1a73e8] hover:bg-[#f8f9fa] hover:border-[#d2e3fc] transition-colors"
          >
            Explore packages
          </Link>
          <Link
            to="/contact"
            onClick={closeMenu}
            className="inline-flex h-[40px] items-center justify-center rounded-full bg-[#1a73e8] px-6 text-[14px] font-medium text-white hover:bg-[#1557b0] transition-colors"
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

      {/* Desktop Mega Menu (Exact Proportions & Clear Typography from Screenshot) */}
      {isServicesOpen && (
        <div className="hidden lg:flex absolute top-[64px] left-0 w-full bg-white border-b border-[#dadce0] shadow-[0_10px_20px_rgba(60,64,67,0.06)] min-h-[390px]">
          {/* Left Panel: 3-Column Services Grid */}
          <div className="flex-1 py-12 pl-[120px] xl:pl-[170px] pr-12">
            <div className="grid grid-cols-3 gap-x-16 xl:gap-x-24 max-w-[1060px]">
              {serviceColumns.map((column, colIndex) => (
                <div key={colIndex} className="flex flex-col gap-9">
                  {column.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={closeMenu}
                      className="group flex items-start gap-[18px] no-underline"
                    >
                      <div className="mt-[2px] transition-transform duration-150 group-hover:scale-105">
                        <WorkspaceIcon name={item.icon} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-[16px] font-medium text-[#202124] leading-[22px] tracking-[-0.01em] group-hover:text-[#1a73e8] transition-colors whitespace-nowrap">
                          {item.label}
                        </h4>
                        <p className="text-[14px] font-normal text-[#5f6368] leading-[20px] tracking-[0px] mt-[2px] whitespace-nowrap">
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
          <aside className="w-[33%] max-w-[460px] bg-[#f8f9fa] py-12 px-14 relative flex flex-col justify-start">
            <button
              type="button"
              onClick={closeMenu}
              className="absolute top-6 right-10 p-2 text-[#5f6368] hover:text-[#202124] hover:bg-[#e8eaed] rounded-full transition-colors cursor-pointer"
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
                  className="text-[16px] font-medium text-[#202124] leading-[24px] tracking-[-0.01em] hover:text-[#1a73e8] transition-colors no-underline w-fit"
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
        <div className="lg:hidden bg-white border-b border-[#dadce0] px-6 py-5 space-y-4 max-h-[calc(100vh-64px)] overflow-y-auto">
          <Link
            to="/"
            onClick={closeMenu}
            className="block py-2 text-[16px] font-medium text-[#202124]"
          >
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isServicesOpen && (
              <div className="pl-2 space-y-5 pt-2 pb-3">
                {serviceColumns.flat().map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={closeMenu}
                    className="flex items-start gap-4"
                  >
                    <WorkspaceIcon name={item.icon} />
                    <div>
                      <div className="text-[15px] font-medium text-[#202124]">
                        {item.label}
                      </div>
                      <div className="text-[13.5px] text-[#5f6368] mt-0.5">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/pricing"
            onClick={closeMenu}
            className="block py-2 text-[16px] font-medium text-[#202124]"
          >
            Pricing
          </Link>
          <Link
            to="/contact"
            onClick={closeMenu}
            className="block py-2 text-[16px] font-medium text-[#202124]"
          >
            Contact
          </Link>

          <div className="pt-3 flex flex-col gap-2.5">
            <Link
              to="/pricing"
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
