import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

export default function FloatingContactWidget() {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const widgetRef = useRef(null);

  const avatarUrl = "/SeoHubLogo.png";

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  if (!isVisible) return null;

  const TEAM_CONTACTS = {
    whatsappUrl: "https://wa.me/447598789693",
    telegramUrl: "https://t.me/SEOHUBLTD",
    teamsUrl: "https://teams.live.com/l/invite/FEAMqmc6ahIpaIbVw?v=g1",
  };

  return (
    <div
      ref={widgetRef}
      className={`fixed ${
        location.pathname === "/services"
          ? "bottom-[120px] sm:bottom-6"
          : "bottom-4 sm:bottom-6"
      } right-4 sm:right-8 z-[100] flex flex-col items-end antialiased`}
    >
      {isOpen && (
        <div className="mb-3.5 w-[min(305px,calc(100vw-2rem))] sm:w-[325px] bg-white rounded-[24px] border border-[#dadce0] shadow-[0_16px_48px_rgba(32,33,36,0.16)] overflow-hidden transition-opacity duration-200">
          <div className="grid grid-cols-4 h-[4px] w-full">
            <div className="bg-[#4285F4]" />
            <div className="bg-[#EA4335]" />
            <div className="bg-[#FBBC04]" />
            <div className="bg-[#34A853]" />
          </div>

          <div className="bg-white px-4 pt-4 pb-3.5 border-b border-[#e8eaed] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {/* Clean Fixed PNG Logo Container */}
              <div className="relative w-11 h-11 rounded-[14px] bg-white border border-[#e8eaed] flex items-center justify-center shrink-0 shadow-2xs overflow-hidden p-1.5">
                <img
                  src={avatarUrl}
                  alt="SeoHub Logo"
                  className="w-full h-full object-contain"
                />
                <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-[#34a853] border-2 border-white" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="gw-font-display text-[15.5px] font-semibold text-[#202124] leading-tight truncate">
                    Chat with SeoHub
                  </h2>
                  <span className="text-[10px] font-semibold bg-[#e8f0fe] text-[#1a73e8] border border-[#d2e3fc] px-2 py-0.2 rounded-full shrink-0">
                    24/7 Desk
                  </span>
                </div>

                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-[#1e8e3e] animate-pulse shrink-0" />
                  <span className="text-[12px] font-medium text-[#1e8e3e] whitespace-nowrap">
                    Typically replies in 5 mins
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-[#f8f9fa] hover:bg-[#f1f3f4] text-[#5f6368] hover:text-[#202124] flex items-center justify-center text-[13px] cursor-pointer shrink-0 transition-colors"
              aria-label="Close chat menu"
            >
              ✕
            </button>
          </div>

          <div className="p-3 bg-[#fcfcfc] space-y-2">
            <a
              href={TEAM_CONTACTS.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-2.5 rounded-[16px] bg-white hover:bg-[#f3fbf5] border border-[#e8eaed] hover:border-[#ceead6] shadow-[0_2px_6px_rgba(60,64,67,0.03)] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[12px] bg-[#1e8e3e] text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                  </svg>
                </div>
                <div>
                  <span className="gw-font-display text-[14px] font-semibold text-[#202124] group-hover:text-[#1e8e3e] transition-colors block leading-snug">
                    WhatsApp Support
                  </span>
                  <span className="text-[11.5px] font-medium text-[#5f6368] block">
                    Direct instant chat
                  </span>
                </div>
              </div>

              <span className="w-7 h-7 rounded-full bg-[#f8f9fa] group-hover:bg-[#1e8e3e] text-[#5f6368] group-hover:text-white flex items-center justify-center text-[13px] font-bold transition-all">
                →
              </span>
            </a>

            <a
              href={TEAM_CONTACTS.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-2.5 rounded-[16px] bg-white hover:bg-[#f8fbff] border border-[#e8eaed] hover:border-[#d2e3fc] shadow-[0_2px_6px_rgba(60,64,67,0.03)] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[12px] bg-[#1a73e8] text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09" />
                  </svg>
                </div>
                <div>
                  <span className="gw-font-display text-[14px] font-semibold text-[#202124] group-hover:text-[#1a73e8] transition-colors block leading-snug">
                    Telegram Chat
                  </span>
                  <span className="text-[11.5px] font-medium text-[#5f6368] block">
                    Secure & fast replies
                  </span>
                </div>
              </div>

              <span className="w-7 h-7 rounded-full bg-[#f8f9fa] group-hover:bg-[#1a73e8] text-[#5f6368] group-hover:text-white flex items-center justify-center text-[13px] font-bold transition-all">
                →
              </span>
            </a>

            <a
              href={TEAM_CONTACTS.teamsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-2.5 rounded-[16px] bg-white hover:bg-[#f6f5fd] border border-[#e8eaed] hover:border-[#d1cbf1] shadow-[0_2px_6px_rgba(60,64,67,0.03)] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[12px] bg-[#5b5fc7] text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M9.186 4.797a2.42 2.42 0 1 0-2.86-2.448h1.178c.929 0 1.682.753 1.682 1.682zm-4.295 7.738h2.613c.929 0 1.682-.753 1.682-1.682V5.58h2.783a.7.7 0 0 1 .682.716v4.294a4.197 4.197 0 0 1-4.093 4.293c-1.618-.04-3-.99-3.667-2.35Zm10.737-9.372a1.674 1.674 0 1 1-3.349 0 1.674 1.674 0 0 1 3.349 0m-2.238 9.488-.12-.002a5.2 5.2 0 0 0 .381-2.07V6.306a1.7 1.7 0 0 0-.15-.725h1.792c.39 0 .707.317.707.707v3.765a2.6 2.6 0 0 1-2.598 2.598z" />
                    <path d="M.682 3.349h6.822c.377 0 .682.305.682.682v6.822a.68.68 0 0 1-.682.682H.682A.68.68 0 0 1 0 10.853V4.03c0-.377.305-.682.682-.682Zm5.206 2.596v-.72h-3.59v.72h1.357V9.66h.87V5.945z" />
                  </svg>
                </div>
                <div>
                  <span className="gw-font-display text-[14px] font-semibold text-[#202124] group-hover:text-[#5b5fc7] transition-colors block leading-snug">
                    Microsoft Teams
                  </span>
                  <span className="text-[11.5px] font-medium text-[#5f6368] block">
                    Enterprise chat & calls
                  </span>
                </div>
              </div>

              <span className="w-7 h-7 rounded-full bg-[#f8f9fa] group-hover:bg-[#5b5fc7] text-[#5f6368] group-hover:text-white flex items-center justify-center text-[13px] font-bold transition-all">
                →
              </span>
            </a>
          </div>

          <div className="px-4 py-2.5 bg-[#f8fbff] border-t border-[#e8eaed] flex items-center justify-between text-[11.5px]">
            <span className="text-[#5f6368] font-medium">
              Need instant bulk pricing?
            </span>
            <Link
              to="/#estimator"
              onClick={() => setIsOpen(false)}
              className="font-semibold text-[#1a73e8] hover:underline"
            >
              Open Calculator →
            </Link>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 sm:w-[58px] sm:h-[58px] rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white flex items-center justify-center shadow-[0_8px_24px_rgba(26,115,232,0.38)] hover:shadow-[0_12px_32px_rgba(26,115,232,0.48)] transition-colors duration-200 z-50 cursor-pointer border-2 border-white"
        aria-label="Contact SeoHub Support"
      >
        {!isOpen && (
          <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-[#34a853] border-2 border-white" />
        )}

        {isOpen ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg
            className="w-6 h-6 sm:w-7 sm:h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        )}
      </button>
    </div>
  );
}
