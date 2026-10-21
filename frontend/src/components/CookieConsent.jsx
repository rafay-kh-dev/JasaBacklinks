import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check karenge ke user ne pehle se cookies accept ki hain ya nahi
    const cookieConsent = localStorage.getItem("jasa_cookie_consent");
    if (!cookieConsent) {
      // Page load hone ke 1.5 second baad smoothly popup show karne ke liye
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("jasa_cookie_consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("jasa_cookie_consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 sm:bottom-6 sm:left-6 sm:right-auto w-full sm:w-[420px] z-[9999] bg-white sm:rounded-[24px] rounded-t-[24px] border border-[#dadce0] shadow-[0_24px_60px_rgba(0,0,0,0.18)] overflow-hidden animate-in slide-in-from-bottom-8 duration-500 ease-out">
      {/* 4-Color Google Signature Top Strip */}
      <div className="grid grid-cols-4 h-[4px] w-full">
        <div className="bg-[#4285F4]" />
        <div className="bg-[#EA4335]" />
        <div className="bg-[#FBBC04]" />
        <div className="bg-[#34A853]" />
      </div>

      <div className="p-5 sm:p-6 relative">
        {/* Subtle Close Button */}
        <button
          onClick={handleDecline}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#9aa0a6] hover:bg-[#f1f3f4] hover:text-[#5f6368] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex items-start gap-4 mb-4">
          {/* Enhanced Cookie Icon Box */}
          <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-[#e8f0fe] to-[#f8fbff] border border-[#d2e3fc] shadow-[0_2px_8px_rgba(26,115,232,0.15)] text-[#1a73e8] flex items-center justify-center shrink-0">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path>
              <circle cx="8.5" cy="8.5" r="0.8" fill="currentColor"></circle>
              <circle cx="16" cy="12.5" r="0.8" fill="currentColor"></circle>
              <circle cx="12" cy="16" r="0.8" fill="currentColor"></circle>
              <circle cx="7.5" cy="14.5" r="0.8" fill="currentColor"></circle>
            </svg>
          </div>

          <div className="pt-0.5">
            <h3 className="gw-font-display text-[17px] sm:text-[18px] font-semibold text-[#202124] tracking-tight">
              Cookies & Privacy
            </h3>
          </div>
        </div>

        <p className="gw-font-text text-[13px] sm:text-[13.5px] text-[#5f6368] leading-[1.6] mb-5">
          We use cookies to enhance your browsing experience, analyze our
          traffic, and deliver personalized content. By clicking "Accept All",
          you consent to our use of cookies.{" "}
          <a
            href="/privacy-policy"
            className="text-[#1a73e8] hover:underline font-medium cursor-pointer"
          >
            Read Policy
          </a>
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <button
            onClick={handleAccept}
            className="gw-font-display w-full sm:w-1/2 h-[42px] rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-[13.5px] font-medium transition-all shadow-[0_4px_12px_rgba(26,115,232,0.25)] flex items-center justify-center cursor-pointer"
          >
            Accept All
          </button>
          <button
            onClick={handleDecline}
            className="gw-font-display w-full sm:w-1/2 h-[42px] rounded-full bg-[#f8f9fa] border border-[#dadce0] hover:border-[#bdc1c6] text-[#3c4043] text-[13.5px] font-medium hover:bg-[#f1f3f4] transition-all flex items-center justify-center cursor-pointer"
          >
            Decline Optional
          </button>
        </div>
      </div>
    </div>
  );
}
