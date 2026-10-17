import { useState, useEffect } from "react";

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Check if preloader has already been shown in this session
    const hasLoadedBefore = sessionStorage.getItem("jasa_preloader_shown");

    if (hasLoadedBefore) {
      setLoading(false);
      return;
    }

    // Lock scroll during loading
    document.body.style.overflow = "hidden";

    // Start fade out after 1.5 seconds
    const timer1 = setTimeout(() => {
      setFading(true);
    }, 1500);

    // Completely remove preloader after fade out animation (1.5s + 0.5s)
    const timer2 = setTimeout(() => {
      setLoading(false);
      document.body.style.overflow = "auto";
      sessionStorage.setItem("jasa_preloader_shown", "true");
    }, 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-opacity duration-500 ease-in-out ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center justify-center">
        {/* Animated Brand Logo / Spinner */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-6">
          {/* Outer Rotating Ring (Google Blue) */}
          <div className="absolute inset-0 rounded-full border-4 border-[#e8f0fe] border-t-[#1a73e8] animate-spin" />

          {/* Inner Static Logo Mark */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#1a73e8] to-[#1557b0] rounded-full flex items-center justify-center text-white shadow-md">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="gw-font-display text-[22px] sm:text-[26px] font-medium text-[#202124] tracking-tight mb-2 flex items-center gap-1.5">
          Jasa Backlinks
        </h1>

        {/* Subtitle / Loading Text with pulsing dots */}
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] sm:text-[13px] font-medium text-[#5f6368] uppercase tracking-widest">
            By SeoHub Ltd
          </span>
          <span className="flex gap-0.5">
            <span
              className="w-1 h-1 bg-[#1a73e8] rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="w-1 h-1 bg-[#ea4335] rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <span
              className="w-1 h-1 bg-[#fbbc04] rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
            <span
              className="w-1 h-1 bg-[#34a853] rounded-full animate-bounce"
              style={{ animationDelay: "450ms" }}
            />
          </span>
        </div>
      </div>
    </div>
  );
}
