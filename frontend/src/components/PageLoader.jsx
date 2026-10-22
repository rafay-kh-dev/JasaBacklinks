export default function PageLoader() {
  return (
    <div
      className="flex min-h-[50vh] flex-col items-center justify-center gap-3"
      role="status"
      aria-live="polite"
    >
      <span
        className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#d2e3fc] border-t-[#1a73e8]"
        aria-hidden="true"
      />
      <span className="text-sm font-medium text-[#5f6368]">Loading…</span>
    </div>
  );
}
