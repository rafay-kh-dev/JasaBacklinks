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
      className={`absolute z-10 flex min-h-[72px] min-w-[208px] items-center gap-3 rounded-[14px] border border-[#dce4ee]/90 bg-white/95 px-[15px] py-3 shadow-[0_12px_28px_rgba(31,52,78,0.09)] backdrop-blur-lg max-[1050px]:min-h-[65px] max-[1050px]:min-w-[184px] max-[1050px]:gap-[9px] max-[1050px]:p-[10px] max-[480px]:min-h-[50px] max-[480px]:min-w-0 max-[480px]:gap-[7px] max-[480px]:rounded-[11px] max-[480px]:p-[7px] ${className}`}
    >
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl max-[1050px]:h-9 max-[1050px]:w-9 max-[480px]:h-[30px] max-[480px]:w-[30px] max-[480px]:rounded-[9px] ${iconClassName}`}
      >
        {icon}
      </span>
      <span className="flex flex-col gap-[5px] whitespace-nowrap max-[480px]:gap-[3px]">
        <strong className="text-xs font-semibold text-[#263548] max-[1050px]:text-[11px] max-[480px]:text-[9px]">
          {children}
        </strong>
        <small className="text-[10px] text-[#6a7788] max-[1050px]:text-[9px] max-[480px]:text-[8px]">
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
      <div className="absolute -inset-[9%] -z-20 rounded-full bg-[radial-gradient(circle,rgba(224,237,255,0.9),rgba(239,245,252,0.25)_60%,transparent_72%)]" />
      <div className="absolute left-1/2 top-1/2 -z-10 aspect-square w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#315f91]/[0.13]" />
      <div className="absolute left-1/2 top-1/2 -z-10 aspect-square w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#315f91]/[0.19]" />

      <svg
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 560 520"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M280 260 118 133M280 260l168-125M280 260l175 144M280 260 110 397"
          stroke="rgba(49,95,145,0.3)"
          strokeWidth="1.4"
          strokeDasharray="5 7"
        />
        <g fill="white" stroke="#7ea8d8" strokeWidth="1.5">
          <circle cx="280" cy="260" r="4" />
          <circle cx="118" cy="133" r="4" />
          <circle cx="448" cy="135" r="4" />
          <circle cx="455" cy="404" r="4" />
          <circle cx="110" cy="397" r="4" />
        </g>
      </svg>

      <div className="absolute left-1/2 top-1/2 flex h-[178px] w-[178px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-[13px] rounded-full border border-white/90 bg-[linear-gradient(145deg,#fff,#f4f8fe)] shadow-[0_24px_60px_rgba(33,76,128,0.14),inset_0_0_0_9px_rgba(232,240,254,0.65)] max-[480px]:h-[130px] max-[480px]:w-[130px] max-[480px]:gap-[9px] max-[480px]:shadow-[0_16px_40px_rgba(33,76,128,0.14),inset_0_0_0_7px_rgba(232,240,254,0.65)]">
        <span className="absolute -inset-[18px] -z-10 rounded-full bg-[#1a73e8]/[0.08] blur-[15px]" />
        <span className="grid h-[70px] w-[70px] rotate-[-7deg] place-items-center rounded-[23px] bg-[linear-gradient(145deg,#3188f1,#1261c8)] text-white shadow-[0_10px_24px_rgba(26,115,232,0.27)] max-[480px]:h-[54px] max-[480px]:w-[54px] max-[480px]:rounded-[18px]">
          <LinkMark className="h-10 w-10 rotate-[7deg] max-[480px]:h-8 max-[480px]:w-8" />
        </span>
        <span className="text-[9px] font-bold tracking-[1.45px] text-[#536b87] max-[480px]:text-[7px]">
          JASA BACKLINKS
        </span>
      </div>

      <ArtworkNode
        className="left-0 top-[13%] max-[480px]:-left-[3px]"
        iconClassName="bg-[#e8f0fe] text-[#1a73e8]"
        detail="Links with context"
        icon={
          <svg
            className="h-[23px] w-[23px] stroke-current stroke-[1.65]"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path d="M6 4.5h8l4 4v11H6zM14 4.5v4h4M9 12h6M9 15.5h6" />
          </svg>
        }
      >
        Relevant content
      </ArtworkNode>

      <ArtworkNode
        className="right-0 top-[13%] max-[480px]:-right-[3px]"
        iconClassName="bg-[#fef7e0] text-[#b06000]"
        detail="Quality-first approach"
        icon={
          <svg
            className="h-[23px] w-[23px] stroke-current stroke-[1.65]"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path d="m3.5 9 8.5-4.5L20.5 9 12 13.5zM6.5 10.5v5c3.4 2.5 7.6 2.5 11 0v-5M20.5 9v6" />
          </svg>
        }
      >
        Trusted sources
      </ArtworkNode>

      <ArtworkNode
        className="bottom-[12%] left-0 max-[480px]:-left-[3px]"
        iconClassName="bg-[#e6f4ea] text-[#188038]"
        detail="Made for your market"
        icon={
          <svg
            className="h-[23px] w-[23px] stroke-current stroke-[1.65]"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="8.5" />
            <path d="M3.8 12h16.4M12 3.5c2.2 2.3 3.2 5.1 3.2 8.5s-1 6.2-3.2 8.5c-2.2-2.3-3.2-5.1-3.2-8.5S9.8 5.8 12 3.5Z" />
          </svg>
        }
      >
        Built for growth
      </ArtworkNode>

      <ArtworkNode
        className="bottom-[12%] right-0 max-[480px]:-right-[3px]"
        iconClassName="bg-[#f0ebfa] text-[#6941c6]"
        detail="Thoughtful placements"
        icon={
          <svg
            className="h-[23px] w-[23px] stroke-current stroke-[1.65]"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path d="m12 3 2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2zM19 16v5M16.5 18.5h5" />
          </svg>
        }
      >
        Lasting authority
      </ArtworkNode>

      <span className="absolute left-[45%] top-[30%] text-[17px] text-[#77a9e6]" aria-hidden="true">
        ✳
      </span>
      <span className="absolute bottom-[29%] right-[17%] text-lg text-[#d2a84c]" aria-hidden="true">
        ✦
      </span>
    </div>
  );
}

export default function Home() {
  return (
    <section className="relative isolate overflow-hidden bg-[radial-gradient(ellipse_at_76%_48%,rgba(232,240,254,0.7),transparent_38%),linear-gradient(180deg,#fff_0%,#f9fbff_100%)]">
      <div className="mx-auto grid min-h-[660px] w-[calc(100%-80px)] max-w-[1360px] grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] items-center gap-12 py-16 pb-[72px] max-[1100px]:min-h-0 max-[1100px]:w-[calc(100%-56px)] max-[1100px]:max-w-[760px] max-[1100px]:grid-cols-1 max-[1100px]:gap-8 max-[1100px]:py-[72px] max-[1100px]:pb-[64px] max-[900px]:w-[calc(100%-40px)] max-[900px]:max-w-[650px] max-[900px]:gap-10 max-[900px]:py-[64px] max-[900px]:pb-[56px] max-[480px]:w-[calc(100%-36px)] max-[480px]:gap-8 max-[480px]:py-[52px] max-[480px]:pb-12">
        <div className="relative z-[1] max-w-[650px] pb-2">
          <span className="inline-flex items-center gap-[10px] text-xs font-bold tracking-[1.1px] text-[#426486] max-[480px]:text-[10px] max-[480px]:tracking-[0.8px]">
            <span className="h-2 w-2 rounded-full bg-[#1a73e8] shadow-[0_0_0_4px_#e8f0fe]" />
            LINK BUILDING FOR LONG-TERM GROWTH
          </span>
          <h1 className="my-5 mt-[26px] font-[var(--font-display)] text-[clamp(48px,4.5vw,64px)] font-bold leading-[1.08] tracking-[-2.8px] text-[#17212f] max-[1100px]:mt-[22px] max-[1100px]:text-[clamp(46px,6vw,60px)] max-[1100px]:tracking-[-2.5px] max-[480px]:my-4 max-[480px]:mt-5 max-[480px]:text-[clamp(39px,10vw,48px)] max-[480px]:tracking-[-2.2px]">
            Build authority.
            <br />
            <span className="text-[#1a73e8]">Earn visibility.</span>
          </h1>
          <p className="m-0 max-w-[560px] text-[17px] leading-[1.75] text-[#586474] max-[1100px]:text-base max-[480px]:text-[15px] max-[480px]:leading-[1.7]">
            Relevant backlinks and a strategy shaped around your audience and
            goals help your business earn stronger search visibility.
          </p>
          <div className="mt-8 flex items-center gap-4 max-[480px]:mt-6 max-[480px]:items-stretch max-[480px]:gap-[10px]">
            <Link
              to="/pbn/homepage-post"
              className="inline-flex min-h-[54px] items-center justify-center gap-[14px] rounded-full border border-[#1a73e8] bg-[#1a73e8] px-6 text-[15px] font-semibold text-white shadow-[0_8px_18px_rgba(26,115,232,0.18)] transition duration-150 hover:-translate-y-0.5 hover:border-[#1558b0] hover:bg-[#1558b0] hover:shadow-[0_10px_22px_rgba(26,115,232,0.23)] focus-visible:outline-3 focus-visible:outline-[#1a73e8]/30 focus-visible:outline-offset-[3px] max-[480px]:min-h-12 max-[480px]:gap-2 max-[480px]:px-[15px] max-[480px]:text-[13px]"
            >
              Explore backlink services
              <svg className="h-[18px] w-[18px]" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="M4.5 10h11m0 0-4.5-4.5M15.5 10 11 14.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link
              to="/contact"
              className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-[#d8e0ea] bg-white px-[22px] text-[15px] font-semibold text-[#26384d] transition duration-150 hover:-translate-y-0.5 hover:border-[#9bbce3] hover:text-[#1a73e8] focus-visible:outline-3 focus-visible:outline-[#1a73e8]/30 focus-visible:outline-offset-[3px] max-[480px]:min-h-12 max-[480px]:px-[17px] max-[480px]:text-[13px]"
            >
              Let&apos;s talk
            </Link>
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] leading-normal text-[#667282] max-[480px]:mt-5 max-[480px]:items-start max-[480px]:gap-x-4 max-[480px]:text-xs">
            <span className="inline-flex items-center gap-2">
              <span className="grid h-[21px] w-[21px] flex-[0_0_21px] place-items-center rounded-full bg-[#e9f5ee] text-[#218653]">
              <svg className="h-[15px] w-[15px]" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="m3.5 8 3 3 6-6"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              </span>
              Quality-led placements
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="grid h-[21px] w-[21px] flex-[0_0_21px] place-items-center rounded-full bg-[#e9f5ee] text-[#218653]">
                <svg className="h-[15px] w-[15px]" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="m3.5 8 3 3 6-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              Built around your goals
            </span>
          </div>
        </div>

        <AuthorityArtwork />
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,#e5ebf2_18%,#e5ebf2_82%,transparent)]"
        aria-hidden="true"
      />
    </section>
  );
}
