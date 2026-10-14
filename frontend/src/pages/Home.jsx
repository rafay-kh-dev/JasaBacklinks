import { Link } from "react-router-dom";

function LinkMark({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m12.1 19.9-2.3 2.3a5.25 5.25 0 0 1-7.4-7.4l5.3-5.3a5.25 5.25 0 0 1 7.4 0m4.8 2.6 2.3-2.3a5.25 5.25 0 1 1 7.4 7.4l-5.3 5.3a5.25 5.25 0 0 1-7.4 0m-6.1-2.5 9.2-9.2"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArtworkNode({ className, iconClassName, children, detail, icon }) {
  return (
    <div
      className={`absolute z-10 flex min-h-[72px] min-w-[208px] items-center gap-3 rounded-[16px] border border-gray-200/80 bg-white/95 px-4 py-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] backdrop-blur-md max-[1050px]:min-h-[65px] max-[1050px]:min-w-[184px] max-[1050px]:gap-[9px] max-[1050px]:p-[10px] max-[480px]:min-h-[50px] max-[480px]:min-w-0 max-[480px]:gap-[7px] max-[480px]:rounded-[12px] max-[480px]:p-[7px] ${className}`}
    >
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl max-[1050px]:h-9 max-[1050px]:w-9 max-[480px]:h-[30px] max-[480px]:w-[30px] max-[480px]:rounded-[9px] ${iconClassName}`}
      >
        {icon}
      </span>
      <span className="flex flex-col gap-1 whitespace-nowrap">
        <strong className="text-[13px] font-semibold text-[#202124] tracking-tight max-[1050px]:text-[11px] max-[480px]:text-[9px]">
          {children}
        </strong>
        <small className="text-[11px] text-[#5f6368] font-normal max-[1050px]:text-[9px] max-[480px]:text-[8px]">
          {detail}
        </small>
      </span>
    </div>
  );
}

function AuthorityArtwork() {
  return (
    <div
      className="relative isolate aspect-[560/520] w-full max-w-[590px] justify-self-end max-[1100px]:mx-auto max-[1100px]:max-w-[560px]"
      aria-label="Illustration of connected websites"
    >
      <div className="absolute -inset-[9%] -z-20 rounded-full bg-[radial-gradient(circle,rgba(232,240,254,0.9),rgba(248,249,250,0.3)_60%,transparent_72%)]" />
      <div className="absolute left-1/2 top-1/2 -z-10 aspect-square w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#1a73e8]/[0.1]" />
      <div className="absolute left-1/2 top-1/2 -z-10 aspect-square w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#1a73e8]/[0.15]" />

      <svg
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 560 520"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M280 260 118 133M280 260l168-125M280 260l175 144M280 260 110 397"
          stroke="rgba(26,115,232,0.2)"
          strokeWidth="1.5"
          strokeDasharray="6 6"
        />
        <g fill="white" stroke="#93c5fd" strokeWidth="2">
          <circle cx="280" cy="260" r="5" />
          <circle cx="118" cy="133" r="5" />
          <circle cx="448" cy="135" r="5" />
          <circle cx="455" cy="404" r="5" />
          <circle cx="110" cy="397" r="5" />
        </g>
      </svg>

      <div className="absolute left-1/2 top-1/2 flex h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-3 rounded-full border border-white bg-[linear-gradient(145deg,#ffffff,#f8f9fa)] shadow-[0_20px_50px_rgba(26,115,232,0.12),inset_0_0_0_8px_rgba(232,240,254,0.6)] max-[480px]:h-[130px] max-[480px]:w-[130px]">
        <span className="absolute -inset-4 -z-10 rounded-full bg-[#1a73e8]/[0.08] blur-xl" />
        <span className="grid h-[68px] w-[68px] place-items-center rounded-2xl bg-[#1a73e8] text-white shadow-[0_8px_20px_rgba(26,115,232,0.3)] max-[480px]:h-[50px] max-[480px]:w-[50px]">
          <LinkMark className="h-8 w-8 text-white" />
        </span>
        <span className="text-[10px] font-bold tracking-[1.5px] text-[#5f6368]">
          JASA BACKLINKS
        </span>
      </div>

      <ArtworkNode
        className="left-0 top-[12%]"
        iconClassName="bg-[#e8f0fe] text-[#1a73e8]"
        detail="Contextual links"
        icon={
          <svg
            className="h-5 w-5 stroke-current stroke-[1.8]"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path d="M6 4.5h8l4 4v11H6zM14 4.5v4h4M9 12h6M9 15.5h6" />
          </svg>
        }
      >
        Relevant content
      </ArtworkNode>

      <ArtworkNode
        className="right-0 top-[12%]"
        iconClassName="bg-[#fef7e0] text-[#b06000]"
        detail="Verified metrics"
        icon={
          <svg
            className="h-5 w-5 stroke-current stroke-[1.8]"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path d="m3.5 9 8.5-4.5L20.5 9 12 13.5zM6.5 10.5v5c3.4 2.5 7.6 2.5 11 0v-5M20.5 9v6" />
          </svg>
        }
      >
        Trusted sources
      </ArtworkNode>

      <ArtworkNode
        className="bottom-[10%] left-0"
        iconClassName="bg-[#e6f4ea] text-[#188038]"
        detail="Targeted reach"
        icon={
          <svg
            className="h-5 w-5 stroke-current stroke-[1.8]"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle cx="12" cy="12" r="8.5" />
            <path d="M3.8 12h16.4M12 3.5c2.2 2.3 3.2 5.1 3.2 8.5s-1 6.2-3.2 8.5c-2.2-2.3-3.2-5.1-3.2-8.5S9.8 5.8 12 3.5Z" />
          </svg>
        }
      >
        Built for growth
      </ArtworkNode>

      <ArtworkNode
        className="bottom-[10%] right-0"
        iconClassName="bg-[#f0ebfa] text-[#7c3aed]"
        detail="Permanent placements"
        icon={
          <svg
            className="h-5 w-5 stroke-current stroke-[1.8]"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path d="m12 3 2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2zM19 16v5M16.5 18.5h5" />
          </svg>
        }
      >
        Lasting authority
      </ArtworkNode>
    </div>
  );
}

const audiences = [
  {
    title: "Local businesses",
    description:
      "Build local authority and help nearby customers find the services you offer.",
    icon: "store",
    accent: "text-[#1a73e8]",
    span: "col-span-6 md:col-span-3 lg:col-span-2",
  },
  {
    title: "E-commerce brands",
    description:
      "Earn relevant mentions that support product discovery and category growth.",
    icon: "cart",
    accent: "text-[#1a73e8]",
    span: "col-span-6 md:col-span-3 lg:col-span-2",
  },
  {
    title: "Agencies & consultants",
    description:
      "Extend your SEO offering with dependable link-building support for clients.",
    icon: "agency",
    accent: "text-[#1a73e8]",
    span: "col-span-6 md:col-span-3 lg:col-span-2",
  },
  {
    title: "National brands",
    description:
      "Strengthen authority across competitive markets with a strategy built to scale.",
    icon: "brand",
    accent: "text-[#1a73e8]",
    span: "col-span-6 md:col-span-3 lg:col-span-3",
  },
  {
    title: "Franchises & multi-location",
    description:
      "Support consistent brand authority while staying relevant to each location.",
    icon: "locations",
    accent: "text-[#1a73e8]",
    span: "col-span-6 md:col-span-3 lg:col-span-3",
  },
];

function AudienceIcon({ name }) {
  const icons = {
    store: (
      <path d="M4 10.5V20h16v-9.5M3 9l2-5h14l2 5M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M9 20v-6h6v6" />
    ),
    cart: (
      <path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 1.9-1.4L21 8H6M10 20a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8zm7 0a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8z" />
    ),
    agency: (
      <path d="M20 7v5h-5M4 17v-5h5M6.1 9a7 7 0 0 1 11.7-2L20 9M4 15l2.2 2a7 7 0 0 0 11.7-2" />
    ),
    brand: (
      <path d="M4 20V5h11v15M15 10h5v10M7 8h2M11 8h1M7 12h2M11 12h1M7 16h2M11 16h1M17 14h1M17 17h1M2 20h20" />
    ),
    locations: (
      <path d="M3 20V9l5-4v15M8 20V4l7-2v18M15 20V9l6-3v14M2 20h22M5 11h1M5 14h1M11 7h1M11 11h1M11 15h1M18 12h1M18 16h1" />
    ),
  };
  return (
    <svg
      className="h-6 w-6 stroke-current stroke-[1.7]"
      viewBox="0 0 24 24"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[name]}
    </svg>
  );
}

function AudienceSection() {
  return (
    <section className="relative mx-auto my-14 w-[calc(100%-48px)] max-w-[1360px] overflow-hidden rounded-[28px] border border-[#e8eaed] bg-[#f8f9fa] px-10 py-14 text-[#202124]">
      <div className="relative max-w-[700px] mb-10">
        <span className="mb-3 inline-flex items-center gap-2 text-xs font-bold tracking-[1.2px] text-[#1a73e8] uppercase">
          <span className="h-2 w-2 rounded-full bg-[#1a73e8]" />
          Who We Help
        </span>
        <h2 className="text-[36px] font-normal leading-[1.2] tracking-tight text-[#202124]">
          Smarter link building for every kind of business
        </h2>
        <p className="mt-3 text-[16px] leading-[1.6] text-[#5f6368]">
          From local teams to national brands and agencies, find a thoughtful
          backlink strategy shaped around your goals.
        </p>
      </div>

      <div className="grid grid-cols-6 gap-5">
        {audiences.map((audience) => (
          <article
            key={audience.title}
            className={`col-span-6 flex flex-col items-start rounded-2xl border border-[#dadce0] bg-white p-7 shadow-sm transition duration-200 hover:border-[#1a73e8] hover:shadow-md ${audience.span}`}
          >
            <span className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-[#e8f0fe] text-[#1a73e8]">
              <AudienceIcon name={audience.icon} />
            </span>
            <h3 className="mb-2 text-[18px] font-medium text-[#202124]">
              {audience.title}
            </h3>
            <p className="m-0 text-[14px] leading-[1.6] text-[#5f6368]">
              {audience.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

const trustHighlights = [
  {
    title: "Relevant by design",
    description:
      "Prioritize websites and placements that make sense for your niche.",
  },
  {
    title: "Quality over volume",
    description:
      "Focus on thoughtful, contextual backlinks instead of chasing numbers.",
  },
  {
    title: "Built around your goals",
    description:
      "Shape a link-building approach around your market and audience priorities.",
  },
  {
    title: "Flexible support",
    description:
      "Get focused placement support or build a longer-term campaign together.",
  },
];

function TrustSection() {
  return (
    <section className="relative px-6 py-20 bg-white">
      <div className="mx-auto max-w-[1280px]">
        <div className="mx-auto mb-12 max-w-[700px] text-center">
          <span className="mb-3 inline-flex items-center gap-2 text-xs font-bold tracking-[1.2px] text-[#1a73e8] uppercase">
            <span className="h-2 w-2 rounded-full bg-[#1a73e8]" />
            The Jasa Approach
          </span>
          <h2 className="text-[38px] font-normal leading-[1.2] tracking-tight text-[#202124]">
            Trusted by businesses. Built to grow with you.
          </h2>
          <p className="mt-3 text-[16px] leading-[1.6] text-[#5f6368]">
            Thoughtful link building starts with relevance, clear goals, and a
            strategy that fits your business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustHighlights.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-[#dadce0] bg-[#f8f9fa] p-8 text-left transition hover:border-[#1a73e8] hover:bg-white hover:shadow-md"
            >
              <h3 className="text-[17px] font-medium text-[#202124] mb-2">
                {item.title}
              </h3>
              <p className="text-[14px] leading-[1.6] text-[#5f6368] m-0">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      {/* Redesigned Hero Section */}
      <section className="relative isolate overflow-hidden bg-[radial-gradient(ellipse_at_75%_40%,rgba(232,240,254,0.7),transparent_40%),linear-gradient(180deg,#fff_0%,#f8f9fa_100%)]">
        <div className="mx-auto grid min-[700px]:min-h-[700px] w-[calc(100%-48px)] max-w-[1360px] grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center gap-12 py-20 max-[1100px]:grid-cols-1 max-[1100px]:py-16">
          {/* Left Text Content */}
          <div className="relative z-[1] max-w-[620px]">
            <span className="inline-flex items-center gap-2.5 text-xs font-bold tracking-[1.2px] text-[#1a73e8] uppercase">
              <span className="h-2 w-2 rounded-full bg-[#1a73e8]" />
              Link Building for Long-Term Growth
            </span>

            <h1 className="mt-6 text-[clamp(42px,5vw,64px)] font-normal leading-[1.1] tracking-tight text-[#202124]">
              Build authority. <br />
              <span className="text-[#1a73e8] font-medium">
                Earn visibility.
              </span>
            </h1>

            <p className="mt-6 text-[18px] leading-[1.6] text-[#5f6368]">
              Relevant backlinks and a strategy shaped around your audience and
              goals help your business earn stronger search visibility.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex items-center gap-4">
              <Link
                to="/pbn/homepage-post"
                className="inline-flex h-[48px] items-center justify-center rounded-full bg-[#1a73e8] px-8 text-[15px] font-medium text-white shadow-sm hover:bg-[#1557b0] transition-colors"
              >
                Explore backlink services
              </Link>
              <Link
                to="/contact"
                className="inline-flex h-[48px] items-center justify-center rounded-full border border-[#dadce0] bg-white px-7 text-[15px] font-medium text-[#202124] hover:bg-[#f8f9fa] hover:border-[#1a73e8] transition-colors"
              >
                Let&apos;s talk
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-[14px] text-[#3c4043]">
              <span className="inline-flex items-center gap-2">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-[#e6f4ea] text-[#137333]">
                  ✓
                </span>
                Quality-led placements
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-[#e6f4ea] text-[#137333]">
                  ✓
                </span>
                Built around your goals
              </span>
            </div>
          </div>

          {/* Right Interactive Artwork */}
          <AuthorityArtwork />
        </div>
      </section>

      <AudienceSection />
      <TrustSection />
    </>
  );
}
