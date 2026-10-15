import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#fafafa] pt-16 sm:pt-24 flex flex-col relative overflow-hidden border-t border-[#e8eaed]">
      {/* Top Section: Small Header & Links Grid */}
      <div className="max-w-[1400px] w-full mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-start gap-12 md:gap-8 mb-16 sm:mb-20 z-10">
        {/* Left Side: Tagline */}
        <div className="md:w-1/2">
          <h3 className="gw-font-display text-[22px] md:text-[28px] font-medium text-[#202124] tracking-tight text-center md:text-left">
            Experience SEO liftoff
          </h3>
        </div>

        {/* Right Side: Links Columns */}
        <div className="md:w-1/2 flex flex-col sm:flex-row justify-between md:justify-end gap-12 sm:gap-24 lg:gap-32 w-full">
          {/* Column 1: Services/Product */}
          <div className="flex flex-col gap-4 items-center sm:items-start text-center sm:text-left">
            <h4 className="gw-font-text text-[14px] font-medium text-[#5f6368] mb-1">
              Services
            </h4>
            <Link
              to="/pbn/homepage"
              className="gw-font-text text-[15px] font-medium text-[#202124] hover:text-[#1a73e8] transition-colors"
            >
              Homepage Post
            </Link>
            <Link
              to="/pbn/sidebar"
              className="gw-font-text text-[15px] font-medium text-[#202124] hover:text-[#1a73e8] transition-colors"
            >
              Sidebar Blogroll
            </Link>
            <Link
              to="/pbn/id-links"
              className="gw-font-text text-[15px] font-medium text-[#202124] hover:text-[#1a73e8] transition-colors"
            >
              .ID Extensions
            </Link>
            <Link
              to="/pbn/edu-gov"
              className="gw-font-text text-[15px] font-medium text-[#202124] hover:text-[#1a73e8] transition-colors"
            >
              EDU & GOV Links
            </Link>
            <Link
              to="/pbn/sticky"
              className="gw-font-text text-[15px] font-medium text-[#202124] hover:text-[#1a73e8] transition-colors"
            >
              Sticky Placements
            </Link>
          </div>

          {/* Column 2: Resources */}
          <div className="flex flex-col gap-4 items-center sm:items-start text-center sm:text-left">
            <h4 className="gw-font-text text-[14px] font-medium text-[#5f6368] mb-1">
              Resources
            </h4>
            <Link
              to="/docs"
              className="gw-font-text text-[15px] font-medium text-[#202124] hover:text-[#1a73e8] transition-colors"
            >
              Docs
            </Link>
            <Link
              to="/case-studies"
              className="gw-font-text text-[15px] font-medium text-[#202124] hover:text-[#1a73e8] transition-colors"
            >
              Case Studies
            </Link>
            <Link
              to="/blog"
              className="gw-font-text text-[15px] font-medium text-[#202124] hover:text-[#1a73e8] transition-colors"
            >
              Blog
            </Link>
            <Link
              to="/pricing"
              className="gw-font-text text-[15px] font-medium text-[#202124] hover:text-[#1a73e8] transition-colors"
            >
              Pricing
            </Link>
            <Link
              to="/contact"
              className="gw-font-text text-[15px] font-medium text-[#202124] hover:text-[#1a73e8] transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>

      {/* Middle Section: Giant Typography Brand Name */}
      {/* w-full max-w-[100vw] overflow-hidden ensures text never breaks mobile screen width */}
      <div className="w-full flex justify-center items-center px-4 md:px-8 overflow-hidden z-0 select-none pb-8 md:pb-12 max-w-[100vw]">
        <h1
          className="gw-font-display font-bold text-[#111111] leading-none tracking-tighter text-center"
          style={{ fontSize: "clamp(36px, 12vw, 220px)" }}
        >
          Jasa Backlinks
        </h1>
      </div>

      {/* Bottom Section: Standard Minimal Strip */}
      <div className="w-full border-t border-[#e8eaed] bg-[#fafafa] py-6 px-6 md:px-12 z-10 relative">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          {/* Left Brand (Favicon) / Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link to="/" className="flex items-center justify-center">
              <img
                src="/favicon.svg"
                alt="Jasa Backlinks"
                className="h-7 w-auto object-contain grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            </Link>
            <div className="hidden sm:block w-[1px] h-4 bg-[#dadce0]"></div>
            <span className="gw-font-text text-[13px] font-medium text-[#5f6368]">
              &copy; {currentYear} All rights reserved.
            </span>
          </div>

          {/* Center Links */}
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2">
            <Link
              to="/about"
              className="gw-font-text text-[13.5px] font-medium text-[#5f6368] hover:text-[#202124] transition-colors"
            >
              About Us
            </Link>
            <Link
              to="/privacy"
              className="gw-font-text text-[13.5px] font-medium text-[#5f6368] hover:text-[#202124] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="gw-font-text text-[13.5px] font-medium text-[#5f6368] hover:text-[#202124] transition-colors"
            >
              Terms of Service
            </Link>
          </div>

          {/* Right SeoHub Link */}
          <div className="gw-font-text text-[13px] font-medium text-[#5f6368]">
            Powered by{" "}
            <a
              href="https://seohub.ltd"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1a73e8] hover:underline transition-all"
            >
              SeoHub Ltd
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
