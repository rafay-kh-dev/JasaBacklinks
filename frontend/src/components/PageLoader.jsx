export default function PageLoader() {
  return (
    <div
      className="flex min-h-[60vh] w-full flex-col items-center justify-center bg-[#fcfcfc]/80 px-4 backdrop-blur-[2px]"
      role="status"
      aria-live="polite"
    >
      <div className="relative flex flex-col items-center rounded-[24px] border border-[#e8eaed] bg-white px-8 py-7 shadow-[0_14px_40px_rgba(32,33,36,0.06)]">
        <div className="absolute top-0 left-0 right-0 grid h-[3.5px] grid-cols-4 overflow-hidden rounded-t-[24px]">
          <span className="bg-[#4285F4] animate-pulse" />
          <span className="bg-[#EA4335] animate-pulse [animation-delay:150ms]" />
          <span className="bg-[#FBBC04] animate-pulse [animation-delay:300ms]" />
          <span className="bg-[#34A853] animate-pulse [animation-delay:450ms]" />
        </div>

        <div className="relative flex h-14 w-14 items-center justify-center">
          <span
            className="absolute inset-0 animate-spin rounded-full border-[2.5px] border-[#e8f0fe] border-t-[#1a73e8] border-r-[#1a73e8]"
            aria-hidden="true"
          />
          <span
            className="absolute inset-1.5 rounded-full bg-[#f8fbff]"
            aria-hidden="true"
          />
          <img
            src="/favicon.svg"
            alt=""
            className="relative z-10 h-6 w-6 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>

        <div className="mt-4 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#4285F4]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#EA4335] [animation-delay:120ms]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#FBBC04] [animation-delay:240ms]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#34A853] [animation-delay:360ms]" />
        </div>

        <span className="mt-2 text-[12.5px] font-medium tracking-[0.01em] text-[#5f6368]">
          Jasa Backlinks
        </span>
      </div>
    </div>
  );
}
