import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#fcfcfc] pt-16 sm:pt-24 lg:pt-28 flex flex-col relative overflow-hidden border-t border-[#e8eaed] antialiased">
      {/* Top Section: Header & Links */}
      <div className="max-w-[1400px] w-full mx-auto px-5 sm:px-8 md:px-12 flex flex-col lg:flex-row justify-between items-center lg:items-start gap-12 lg:gap-12 mb-16 sm:mb-20 lg:mb-28 z-10">
        {/* Left Side: Tagline */}
        <div className="w-full lg:w-[45%] text-center lg:text-left">
          <h3 className="gw-font-display text-[26px] sm:text-[32px] md:text-[36px] font-normal text-[#202124] tracking-tight leading-[1.2]">
            Experience SEO <br className="block sm:hidden" />
            <span className="text-[#1a73e8] font-medium">liftoff.</span>
          </h3>
        </div>

        {/* Right Side: Links Columns */}
        <div className="w-full lg:w-[55%] flex flex-row flex-wrap sm:flex-nowrap justify-center lg:justify-end gap-10 sm:gap-20 lg:gap-32">
          {/* Column 1: Services/Product */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left w-[130px] sm:w-auto">
            <h4 className="gw-font-display text-[14px] sm:text-[15px] font-medium text-[#202124] tracking-wide mb-3 sm:mb-4">
              Product
            </h4>
            <div className="flex flex-col gap-3">
              <Link
                to="/pbn/homepage"
                className="gw-font-text text-[14px] sm:text-[14.5px] font-normal text-[#5f6368] hover:text-[#1a73e8] transition-colors"
              >
                Homepage Post
              </Link>
              <Link
                to="/pbn/sidebar"
                className="gw-font-text text-[14px] sm:text-[14.5px] font-normal text-[#5f6368] hover:text-[#1a73e8] transition-colors"
              >
                Sidebar Blogroll
              </Link>
              <Link
                to="/pbn/id-links"
                className="gw-font-text text-[14px] sm:text-[14.5px] font-normal text-[#5f6368] hover:text-[#1a73e8] transition-colors"
              >
                .ID Extensions
              </Link>
              <Link
                to="/pbn/edu-gov"
                className="gw-font-text text-[14px] sm:text-[14.5px] font-normal text-[#5f6368] hover:text-[#1a73e8] transition-colors"
              >
                EDU & GOV Links
              </Link>
              <Link
                to="/pbn/sticky"
                className="gw-font-text text-[14px] sm:text-[14.5px] font-normal text-[#5f6368] hover:text-[#1a73e8] transition-colors"
              >
                Sticky Placements
              </Link>
            </div>
          </div>

          {/* Column 2: Resources */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left w-[130px] sm:w-auto">
            <h4 className="gw-font-display text-[14px] sm:text-[15px] font-medium text-[#202124] tracking-wide mb-3 sm:mb-4">
              Resources
            </h4>
            <div className="flex flex-col gap-3">
              <Link
                to="/docs"
                className="gw-font-text text-[14px] sm:text-[14.5px] font-normal text-[#5f6368] hover:text-[#1a73e8] transition-colors"
              >
                Docs
              </Link>
              <Link
                to="/case-studies"
                className="gw-font-text text-[14px] sm:text-[14.5px] font-normal text-[#5f6368] hover:text-[#1a73e8] transition-colors"
              >
                Case Studies
              </Link>
              <Link
                to="/blog"
                className="gw-font-text text-[14px] sm:text-[14.5px] font-normal text-[#5f6368] hover:text-[#1a73e8] transition-colors"
              >
                Blog
              </Link>
              <Link
                to="/pricing"
                className="gw-font-text text-[14px] sm:text-[14.5px] font-normal text-[#5f6368] hover:text-[#1a73e8] transition-colors"
              >
                Pricing
              </Link>
              <Link
                to="/contact"
                className="gw-font-text text-[14px] sm:text-[14.5px] font-normal text-[#5f6368] hover:text-[#1a73e8] transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Giant Typography Brand Name */}
      <div className="w-full flex justify-center items-center px-4 overflow-hidden z-0 select-none pb-10 sm:pb-12 md:pb-16 max-w-[100vw]">
        <h1
          className="gw-font-display font-bold text-[#111111] text-center"
          style={{
            // Made clamp minimum smaller for mobile
            fontSize: "clamp(38px, 11vw, 240px)",
            lineHeight: "0.85",
            letterSpacing: "-0.03em",
          }}
        >
          Jasa Backlinks
        </h1>
      </div>

      {/* Bottom Section: Standard Minimal Strip */}
      <div className="w-full border-t border-[#e8eaed] bg-[#fafafa] py-6 px-5 sm:px-8 md:px-12 z-10 relative">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-5 md:gap-6 text-center md:text-left">
          {/* Left Brand (Favicon) / Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <Link to="/" className="flex items-center justify-center">
              <img
                src="/favicon.svg"
                alt="Jasa Backlinks"
                className="h-[22px] sm:h-[24px] w-auto"
              />
            </Link>
            <div className="hidden sm:block w-[1px] h-3.5 bg-[#dadce0]"></div>
            <span className="gw-font-text text-[12.5px] sm:text-[13px] font-normal text-[#5f6368]">
              &copy; {currentYear} All rights reserved.
            </span>
          </div>

          {/* Center Links */}
          <div className="flex flex-wrap justify-center items-center gap-x-5 sm:gap-x-8 gap-y-2">
            <Link
              to="/about"
              className="gw-font-text text-[12.5px] sm:text-[13px] font-medium text-[#5f6368] hover:text-[#202124] transition-colors"
            >
              About Us
            </Link>
            <Link
              to="/privacy"
              className="gw-font-text text-[12.5px] sm:text-[13px] font-medium text-[#5f6368] hover:text-[#202124] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="gw-font-text text-[12.5px] sm:text-[13px] font-medium text-[#5f6368] hover:text-[#202124] transition-colors"
            >
              Terms of Service
            </Link>
          </div>

          {/* Right SeoHub Link */}
          <div className="gw-font-text text-[12.5px] sm:text-[13px] font-normal text-[#5f6368]">
            Powered by{" "}
            <a
              href="https://seohubltd.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1a73e8] font-medium hover:text-[#1557b0] transition-colors"
            >
              SeoHub Ltd
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
