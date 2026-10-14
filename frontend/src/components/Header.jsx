import { useState } from "react";
import { Link } from "react-router-dom";

const serviceGroups = [
  {
    title: "PBN services",
    links: [
      {
        label: "Homepage post",
        description: "Contextual links on established sites",
        to: "/pbn/homepage-post",
        icon: "article",
      },
      {
        label: "Sidebar blogroll",
        description: "A lasting placement on trusted blogs",
        to: "/pbn/sidebar-blogroll",
        icon: "blogroll",
      },
      {
        label: "Homepage sticky post",
        description: "Premium homepage visibility",
        to: "/pbn/sticky-post",
        icon: "pin",
      },
    ],
  },
  {
    title: "Indonesian links",
    links: [
      {
        label: ".ID homepage post",
        description: "Build authority with local placements",
        to: "/pbn-id/homepage-post",
        icon: "globe",
      },
      {
        label: ".ID sidebar blogroll",
        description: "Local links from established sites",
        to: "/pbn-id/sidebar-blogroll",
        icon: "map",
      },
      {
        label: ".ID sticky post",
        description: "Prominent Indonesian homepage links",
        to: "/pbn-id/sticky-post",
        icon: "bookmark",
      },
    ],
  },
  {
    title: "EDU & GOV",
    links: [
      {
        label: "EDU PBN blogpost",
        description: "Relevant links from education sites",
        to: "/edu-gov/pbn-blogpost",
        icon: "graduation",
      },
      {
        label: "EDU PBN blogroll",
        description: "Long-term links on EDU domains",
        to: "/edu-gov/pbn-blogroll",
        icon: "book",
      },
      {
        label: "EDU & GOV backlink",
        description: "Authority-focused domain placements",
        to: "/edu-gov/backlink",
        icon: "institution",
      },
    ],
  },
];

function ServiceIcon({ name, className }) {
  const iconPaths = {
    article: (
      <>
        <path d="M7 3.75h7l4 4v12.5H7z" />
        <path d="M14 3.75v4h4M9.5 12h6M9.5 15.5h6" />
      </>
    ),
    blogroll: (
      <>
        <circle cx="6.5" cy="7" r="1" />
        <circle cx="6.5" cy="12" r="1" />
        <circle cx="6.5" cy="17" r="1" />
        <path d="M10 7h8M10 12h8M10 17h8" />
      </>
    ),
    pin: (
      <>
        <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
        <circle cx="12" cy="10" r="2" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M3.8 12h16.4M12 3.5c2.2 2.3 3.2 5.1 3.2 8.5s-1 6.2-3.2 8.5c-2.2-2.3-3.2-5.1-3.2-8.5S9.8 5.8 12 3.5Z" />
      </>
    ),
    map: (
      <>
        <path d="m3.5 6 5-2.5 7 2.5 5-2.5v14l-5 2.5-7-2.5-5 2.5z" />
        <path d="M8.5 3.5v14M15.5 6v14" />
      </>
    ),
    bookmark: <path d="M7 4.5h10v16l-5-3.5-5 3.5z" />,
    graduation: (
      <>
        <path d="m3 9 9-5 9 5-9 5z" />
        <path d="M7 11.2v5.1c3.2 2.2 6.8 2.2 10 0v-5.1M21 9v6" />
      </>
    ),
    book: (
      <>
        <path d="M12 7.5c-2.2-2-5-2.5-8-1.5v13c3-.9 5.8-.4 8 1.5 2.2-1.9 5-2.4 8-1.5V6c-3-1-5.8-.5-8 1.5Z" />
        <path d="M12 7.5v13" />
      </>
    ),
    institution: (
      <>
        <path d="m3 8 9-4.5L21 8v1H3zM5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18" />
      </>
    ),
  };

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <g
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {iconPaths[name]}
      </g>
    </svg>
  );
}

export default function Header() {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const closeMenus = () => {
    setIsServicesOpen(false);
    setIsMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#dadce0] bg-white font-[var(--font-body)]">
      <div className="mx-auto flex min-h-[76px] w-[calc(100%-64px)] items-center justify-between gap-[38px] max-[900px]:w-[calc(100%-40px)] max-[900px]:gap-[22px] max-[720px]:min-h-[72px] max-[720px]:w-[calc(100%-36px)]">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-[10px] text-[#202124] no-underline max-[420px]:gap-[7px]"
          aria-label="Jasa Backlinks home"
          onClick={closeMenus}
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#1a73e8] text-white max-[720px]:h-[34px] max-[720px]:w-[34px]" aria-hidden="true">
            <svg className="h-[22px] w-[22px]" viewBox="0 0 32 32" fill="none">
              <path
                d="M11.25 19.75 8.7 22.3a5.3 5.3 0 0 1-7.5-7.5l5-5a5.3 5.3 0 0 1 7.5 0"
                transform="translate(4 0)"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="m20.75 12.25 2.55-2.55a5.3 5.3 0 0 1 7.5 7.5l-5 5a5.3 5.3 0 0 1-7.5 0"
                transform="translate(-4 0)"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="m12.5 19.5 7-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="flex items-baseline gap-[6px] whitespace-nowrap max-[420px]:gap-1">
            <span className="font-[var(--font-display)] text-[23px] font-bold leading-none tracking-[-0.6px] max-[720px]:text-[21px] max-[420px]:text-xl">Jasa</span>
            <span className="font-[var(--font-display)] text-[19px] font-medium tracking-[-0.4px] max-[720px]:text-lg max-[420px]:text-[17px]">Backlinks</span>
          </span>
        </Link>

        <nav className="flex h-full flex-1 items-center justify-start gap-[clamp(24px,3vw,50px)] ml-[10px] max-[900px]:ml-0 max-[900px]:gap-5 max-[720px]:hidden" aria-label="Main navigation">
          <Link to="/" className="inline-flex items-center gap-[7px] border-0 bg-transparent py-[10px] text-base font-medium text-[#5f6368] no-underline transition-colors duration-[160ms] hover:text-[#1a73e8] focus-visible:outline-2 focus-visible:outline-[#1a73e8] focus-visible:outline-offset-4" onClick={closeMenus}>
            Home
          </Link>
          <div className="flex h-full items-center">
            <button
              type="button"
              className={`inline-flex cursor-pointer items-center gap-[7px] border-0 bg-transparent py-[10px] text-base font-medium no-underline transition-colors duration-[160ms] hover:text-[#1a73e8] focus-visible:outline-2 focus-visible:outline-[#1a73e8] focus-visible:outline-offset-4 ${isServicesOpen ? "text-[#1a73e8]" : "text-[#5f6368]"}`}
              aria-expanded={isServicesOpen}
              aria-controls="services-menu"
              onClick={() => setIsServicesOpen((open) => !open)}
            >
              Services
              <svg
                className={`h-[17px] w-[17px] text-[#5f6368] transition-transform duration-200 ${isServicesOpen ? "rotate-180" : ""}`}
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="m4 6 4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <Link to="/pricing" className="inline-flex items-center gap-[7px] border-0 bg-transparent py-[10px] text-base font-medium text-[#5f6368] no-underline transition-colors duration-[160ms] hover:text-[#1a73e8] focus-visible:outline-2 focus-visible:outline-[#1a73e8] focus-visible:outline-offset-4" onClick={closeMenus}>
            Pricing
          </Link>
          <Link to="/contact" className="inline-flex items-center gap-[7px] border-0 bg-transparent py-[10px] text-base font-medium text-[#5f6368] no-underline transition-colors duration-[160ms] hover:text-[#1a73e8] focus-visible:outline-2 focus-visible:outline-[#1a73e8] focus-visible:outline-offset-4" onClick={closeMenus}>
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/contact" className="inline-flex min-h-11 items-center justify-center gap-3 rounded-full border border-[#1a73e8] bg-[#1a73e8] px-[22px] text-[15px] font-medium text-white no-underline transition duration-[160ms] hover:-translate-y-px hover:border-[#1558b0] hover:bg-[#1558b0] focus-visible:outline-2 focus-visible:outline-[#1a73e8] focus-visible:outline-offset-4 max-[720px]:hidden" onClick={closeMenus}>
            <span>Let&apos;s talk</span>
            <svg className="h-[17px] w-[17px]" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M4.5 10h11m0 0-4.5-4.5M15.5 10 11 14.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <button
            type="button"
            className="hidden h-[42px] w-[42px] cursor-pointer flex-col items-center justify-center gap-[6px] rounded-full border border-[#dadce0] bg-transparent max-[720px]:flex focus-visible:outline-2 focus-visible:outline-[#1a73e8] focus-visible:outline-offset-4"
            aria-label={isMobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMobileOpen((open) => !open)}
          >
            <span className="h-px w-[17px] bg-[#3c4043]" />
            <span className="h-px w-[17px] bg-[#3c4043]" />
          </button>
        </div>
      </div>

      {isServicesOpen && (
        <div className="absolute left-0 top-full w-full border-y border-[#dadce0] bg-white shadow-[0_14px_28px_rgba(60,64,67,0.12)] max-[720px]:hidden" id="services-menu">
          <div className="grid min-h-[400px] w-full grid-cols-[minmax(0,1.72fr)_minmax(330px,1fr)] max-[900px]:grid-cols-1">
            <div className="grid grid-cols-3 gap-[clamp(24px,4vw,76px)] px-[clamp(36px,8.7vw,170px)] py-10 max-[900px]:gap-[22px] max-[900px]:px-[clamp(24px,6vw,64px)] max-[900px]:py-8">
              {serviceGroups.map((group) => (
                <section key={group.title}>
                  <h3 className="mb-[18px] mt-1 font-[var(--font-display)] text-base font-semibold text-[#202124]">{group.title}</h3>
                  {group.links.map((link) => (
                    <Link
                      to={link.to}
                      key={link.to}
                      onClick={closeMenus}
                      className="mb-[17px] grid grid-cols-[32px_minmax(0,1fr)_14px] items-center gap-3 text-sm text-[#202124] no-underline transition duration-150 hover:translate-x-0.5 hover:text-[#1a73e8] max-[900px]:grid-cols-[28px_minmax(0,1fr)] max-[900px]:gap-[9px]"
                    >
                      <span
                        className={`grid h-[30px] w-[30px] place-items-center rounded-[9px] max-[900px]:h-[27px] max-[900px]:w-[27px] ${
                          {
                            article: "bg-[#e8f0fe] text-[#1a73e8]",
                            blogroll: "bg-[#e6f4f5] text-[#087e8b]",
                            pin: "bg-[#f0ebfa] text-[#6941c6]",
                            globe: "bg-[#e6f4ea] text-[#188038]",
                            map: "bg-[#e8f0fe] text-[#315f91]",
                            bookmark: "bg-[#fef7e0] text-[#b06000]",
                            graduation: "bg-[#fef7e0] text-[#b06000]",
                            book: "bg-[#e6f4f5] text-[#087e8b]",
                            institution: "bg-[#fce8e6] text-[#b3261e]",
                          }[link.icon]
                        }`}
                        aria-hidden="true"
                      >
                        <ServiceIcon name={link.icon} className="h-5 w-5" />
                      </span>
                      <span className="flex min-w-0 flex-col gap-1">
                        <span className="whitespace-nowrap text-[15px] font-semibold leading-[1.4] tracking-normal">
                          {link.label}
                        </span>
                        <span className="text-[13px] leading-[1.5] text-[#4f5358]">
                          {link.description}
                        </span>
                      </span>
                      <span className="self-start text-xs text-[#80868b] max-[900px]:hidden" aria-hidden="true">
                        ↗
                      </span>
                    </Link>
                  ))}
                </section>
              ))}
            </div>
            <aside className="relative bg-[#f8f9fa] px-[clamp(32px,5vw,88px)] py-[52px] max-[900px]:px-[clamp(24px,6vw,64px)] max-[900px]:py-8">
              <button
                type="button"
                className="absolute right-10 top-[34px] h-[34px] w-[34px] cursor-pointer border-0 bg-transparent text-[28px] font-light leading-none text-[#5f6368] focus-visible:outline-2 focus-visible:outline-[#1a73e8] focus-visible:outline-offset-4"
                aria-label="Close services menu"
                onClick={() => setIsServicesOpen(false)}
              >
                ×
              </button>
              <span className="text-xs font-semibold tracking-[0.8px] text-[#5f6368]">GROW WITH CONFIDENCE</span>
              <h2 className="mb-3 mt-[18px] max-w-[330px] font-[var(--font-display)] text-[26px] font-semibold leading-[1.25] tracking-[-0.9px] text-[#202124]">Build authority that lasts.</h2>
              <p className="mb-[27px] max-w-[340px] text-sm leading-[1.65] text-[#5f6368]">
                The right links, selected for your goals. Explore our tailored
                SEO plans or talk with our team.
              </p>
              <Link
                to="/seo-packages/complete"
                className="flex max-w-[360px] justify-between border-t border-[#dadce0] py-[13px] text-sm text-[#202124] no-underline hover:text-[#1a73e8]"
                onClick={closeMenus}
              >
                Complete SEO package <span aria-hidden="true">↗</span>
              </Link>
              <Link
                to="/seo-packages/first-page"
                className="flex max-w-[360px] justify-between border-t border-[#dadce0] py-[13px] text-sm text-[#202124] no-underline hover:text-[#1a73e8]"
                onClick={closeMenus}
              >
                Rank on the first page <span aria-hidden="true">↗</span>
              </Link>
              <Link
                to="/contact"
                className="flex max-w-[360px] justify-between border-t border-[#dadce0] py-[13px] text-sm text-[#202124] no-underline hover:text-[#1a73e8]"
                onClick={closeMenus}
              >
                Talk to our team <span aria-hidden="true">↗</span>
              </Link>
            </aside>
          </div>
        </div>
      )}

      {isMobileOpen && (
        <nav className="flex flex-col gap-0 border-t border-[#dadce0] bg-white px-[18px] pb-5 pt-[6px] min-[721px]:hidden" id="mobile-navigation" aria-label="Mobile navigation">
          <Link to="/" className="flex min-h-[46px] w-full items-center justify-between border-0 border-b border-[#f1f3f4] bg-transparent px-1 text-left text-sm text-[#3c4043] no-underline focus-visible:outline-2 focus-visible:outline-[#1a73e8] focus-visible:outline-offset-4" onClick={closeMenus}>
            Home
          </Link>
          <button
            type="button"
            className="flex min-h-[46px] w-full cursor-pointer items-center justify-between border-0 border-b border-[#f1f3f4] bg-transparent px-1 text-left text-sm text-[#3c4043] focus-visible:outline-2 focus-visible:outline-[#1a73e8] focus-visible:outline-offset-4"
            aria-expanded={isServicesOpen}
            onClick={() => setIsServicesOpen((open) => !open)}
          >
            Services
            <svg className={`h-[17px] w-[17px] text-[#5f6368] transition-transform duration-200 ${isServicesOpen ? "rotate-180" : ""}`} viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="m4 6 4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {isServicesOpen && (
            <div className="border-b border-[#f1f3f4] py-[5px] pb-[9px] pl-[14px]">
              {serviceGroups.flatMap((group) =>
                group.links.map((link) => (
                  <Link
                    to={link.to}
                    key={link.to}
                    className="flex min-h-10 w-full items-center justify-between border-0 bg-transparent px-1 text-left text-xs text-[#5f6368] no-underline focus-visible:outline-2 focus-visible:outline-[#1a73e8] focus-visible:outline-offset-4"
                    onClick={closeMenus}
                  >
                    {link.label}
                  </Link>
                )),
              )}
            </div>
          )}
          <Link to="/pricing" className="flex min-h-[46px] w-full items-center justify-between border-0 border-b border-[#f1f3f4] bg-transparent px-1 text-left text-sm text-[#3c4043] no-underline focus-visible:outline-2 focus-visible:outline-[#1a73e8] focus-visible:outline-offset-4" onClick={closeMenus}>
            Pricing
          </Link>
          <Link to="/contact" className="flex min-h-[46px] w-full items-center justify-between border-0 border-b border-[#f1f3f4] bg-transparent px-1 text-left text-sm text-[#3c4043] no-underline focus-visible:outline-2 focus-visible:outline-[#1a73e8] focus-visible:outline-offset-4" onClick={closeMenus}>
            Contact
          </Link>
          <Link to="/contact" className="mt-4 inline-flex min-h-[46px] items-center justify-between gap-3 rounded-full border border-[#1a73e8] bg-[#1a73e8] px-4 text-[15px] font-medium text-white no-underline transition duration-[160ms] hover:-translate-y-px hover:border-[#1558b0] hover:bg-[#1558b0] focus-visible:outline-2 focus-visible:outline-[#1a73e8] focus-visible:outline-offset-4" onClick={closeMenus}>
            Let&apos;s talk <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      )}
    </header>
  );
}
