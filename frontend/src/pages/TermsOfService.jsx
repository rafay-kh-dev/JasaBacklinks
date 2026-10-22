import { Link } from "react-router-dom";

export default function TermsOfService() {
  const sections = [
    {
      id: "agreement",
      number: "01",
      title: "Agreement to Terms & Service Scope",
      content: [
        "These Terms of Service constitute a legally binding agreement between you ('Client', 'Agency', or 'Buyer') and Jasa Backlinks, operating under SeoHub Ltd ('Company', 'we', or 'us').",
        "By accessing our platform, configuring packages in our interactive bulk calculator, or submitting an order via Stripe, PayPal, or BoomFi Crypto, you agree to be bound by these Terms.",
      ],
    },
    {
      id: "minimums-metrics",
      number: "02",
      title: "Minimum Order Volume & DA/DR 50+ Guarantee",
      content: [
        "All self-serve placements across our Standard PBN (.COM/.NET/.ORG), Regional Indonesian (.ID/.CO.ID), and Academic/Government (.EDU/.AC.ID/.GO.ID) tiers are governed by the following quality standards:",
      ],
      bullets: [
        "Minimum Order Quantity: Every placement tier requires a minimum order of 50 backlinks per selected service, scalable up to 5,000+ links per campaign.",
        "Verified Metrics Guarantee: All domains in our standard, .ID, and .EDU inventory are vetted to meet Moz DA 50+ and Ahrefs DR 50+ metrics at the time of placement.",
        "Contextual & Sitewide Formats: Homepage Posts and Blogposts include niche-relevant contextual articles, while Sidebar Blogrolls and Sticky Posts are deployed according to the specifications displayed on the respective service page.",
      ],
    },
    {
      id: "onboarding-turnaround",
      number: "03",
      title: "Mandatory Onboarding & Turnaround SLA",
      content: [
        "Immediately following payment capture (Step 1), clients are required to complete Step 2 (Campaign Intake) by providing their Target URLs, Keywords/Anchor Texts, and a valid WhatsApp number or Telegram username.",
        "Standard campaign turnaround time is 5 to 7 business days (3 to 5 business days for Sidebar Blogroll placements), unless a custom drip-feed schedule (e.g., 14 or 30 days) is requested in the Special Instructions field.",
      ],
    },
    {
      id: "replacement-policy",
      number: "04",
      title: "Link Permanence & Replacement Guarantee",
      content: [
        "We stand behind the stability and permanence of our private domain infrastructure:",
      ],
      bullets: [
        "All contextual posts and placements are published as permanent dofollow links on our privately managed network.",
        "In the rare event that a placement URL goes offline or drops within 12 months of delivery, we provide a 100% free replacement link of equal or greater DA/DR authority.",
        "While our network maintains a 99.8% indexation rate and zero footprint architecture, search engine ranking movements depend on multiple on-page and algorithmic factors outside any third-party provider's control.",
      ],
    },
    {
      id: "payments-refunds",
      number: "05",
      title: "Pricing, Payments & Refund Policy",
      content: [
        "All prices listed on Jasa Backlinks are denominated in United States Dollars (USD) and calculated server-side to prevent tampering.",
        "Because our editorial and technical teams begin article production and domain allocation immediately upon campaign submission, full refunds are available only if requested before content creation and link deployment have commenced. Once live placements have been published and delivered in your white-label report, orders are non-refundable, though we will gladly modify anchor texts or target URLs upon request.",
      ],
    },
    {
      id: "governing-contact",
      number: "06",
      title: "Corporate Operations & Support Contact",
      content: [
        "Jasa Backlinks is operated and managed by SeoHub Ltd. For billing enquiries, custom agency SLA agreements, or order modifications, please contact our team:",
      ],
    },
  ];

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="w-full bg-[#fcfcfc] relative overflow-x-clip pt-[56px] pb-16 sm:pb-0">
      <style>{`
        .bg-dotted-grid { background-image: radial-gradient(circle, #d0d7de 1px, transparent 1px); background-size: 28px 28px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* --- HERO HEADER --- */}
      <section className="relative w-full bg-white py-8 sm:py-14 lg:py-18 px-4 sm:px-6 border-b border-[#e8eaed] overflow-hidden">
        <div className="absolute inset-0 bg-dotted-grid [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] opacity-45 pointer-events-none" />
        <div className="max-w-[1200px] mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f8f9fa] border border-[#dadce0] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
            <span className="gw-font-text text-[11.5px] sm:text-[12.5px] font-medium text-[#3c4043]">
              Service Level Agreement & Terms • Effective October 2026
            </span>
          </div>

          <h2 className="gw-font-display text-[28px] sm:text-[44px] md:text-[52px] font-medium text-[#202124] leading-[1.12] tracking-[-0.025em] mb-3 sm:mb-4">
            Terms of <span className="text-[#1a73e8]">Service.</span>
          </h2>

          <p className="gw-font-text text-[14px] sm:text-[16.5px] text-[#5f6368] max-w-[680px] mx-auto leading-[1.6]">
            Clear, transparent terms governing our DA/DR 50+ link placements,
            turnaround SLAs, replacement guarantees, and white-label agency
            deliverables.
          </p>
        </div>
      </section>

      {/* --- MOBILE HORIZONTAL SECTION JUMP BAR --- */}
      <div className="lg:hidden sticky top-[62px] z-30 bg-white/95 backdrop-blur-md border-b border-[#e8eaed] px-3.5 py-2.5 overflow-x-auto no-scrollbar flex items-center gap-2">
        {sections.map((sec) => (
          <button
            key={sec.id}
            type="button"
            onClick={() => scrollToSection(sec.id)}
            className="px-3 py-1.5 rounded-full bg-[#f8f9fa] border border-[#dadce0] text-[11.5px] font-medium text-[#3c4043] whitespace-nowrap shrink-0 cursor-pointer active:bg-[#e8f0fe] active:text-[#1a73e8]"
          >
            {sec.number}. {sec.title.split("&")[0]}
          </button>
        ))}
      </div>

      {/* --- MAIN 2-COLUMN LEGAL CONTENT --- */}
      <section className="w-full py-8 sm:py-14 lg:py-18 px-3.5 sm:px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 4 COLUMNS: STICKY TABLE OF CONTENTS (DESKTOP) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-[96px]">
            <div className="bg-white rounded-[22px] border border-[#e8eaed] p-5 shadow-[0_4px_20px_rgba(60,64,67,0.04)]">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1a73e8] block mb-1">
                Document Navigation
              </span>
              <h2 className="gw-font-display text-[18px] font-medium text-[#202124] mb-4 pb-3 border-b border-[#e8eaed]">
                Terms & SLA Clauses
              </h2>
              <div className="space-y-1.5">
                {sections.map((sec) => (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => scrollToSection(sec.id)}
                    className="w-full text-left px-3 py-2 rounded-[10px] text-[13px] font-medium text-[#5f6368] hover:text-[#1a73e8] hover:bg-[#f8fbff] transition-colors flex items-center gap-2.5 cursor-pointer"
                  >
                    <span className="text-[11px] font-bold text-[#1a73e8] bg-[#e8f0fe] px-2 py-0.5 rounded-full">
                      {sec.number}
                    </span>
                    <span className="truncate">{sec.title}</span>
                  </button>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-[#e8eaed]">
                <Link
                  to="/privacy"
                  className="text-[12.5px] font-semibold text-[#1a73e8] hover:underline block"
                >
                  View Privacy Policy →
                </Link>
              </div>
            </div>
          </aside>

          {/* RIGHT 8 COLUMNS: TERMS SECTIONS */}
          <div className="lg:col-span-8 space-y-5">
            {sections.map((sec) => (
              <div
                key={sec.id}
                id={sec.id}
                className="scroll-mt-[120px] bg-white rounded-[20px] sm:rounded-[24px] p-5 sm:p-8 border border-[#e8eaed] shadow-[0_2px_10px_rgba(60,64,67,0.03)]"
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="gw-font-display text-[12px] font-bold text-[#1a73e8] bg-[#e8f0fe] px-3 py-1 rounded-full">
                    Clause {sec.number}
                  </span>
                </div>

                <h2 className="gw-font-display text-[20px] sm:text-[23px] font-medium text-[#202124] mb-3">
                  {sec.title}
                </h2>

                <div className="space-y-3 text-[14px] sm:text-[15px] text-[#5f6368] leading-[1.65]">
                  {sec.content.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>

                {sec.bullets && (
                  <ul className="mt-4 space-y-2.5 bg-[#f8f9fa] p-4 sm:p-5 rounded-[16px] border border-[#e8eaed]">
                    {sec.bullets.map((bullet, bIdx) => (
                      <li
                        key={bIdx}
                        className="flex items-start gap-2.5 text-[13.5px] sm:text-[14px] text-[#3c4043] leading-[1.55]"
                      >
                        <span className="w-5 h-5 rounded-full bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                          ✓
                        </span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {sec.id === "governing-contact" && (
                  <div className="mt-4 p-4 rounded-[16px] bg-[#f8fbff] border border-[#d2e3fc] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="block text-[11.5px] font-semibold uppercase text-[#5f6368]">
                        SeoHub Ltd Legal & Billing Desk
                      </span>
                      <a
                        href="mailto:jasa-backlinks@seohubltd.com"
                        className="gw-font-display text-[15px] font-semibold text-[#1a73e8] hover:underline"
                      >
                        jasa-backlinks@seohubltd.com
                      </a>
                    </div>
                    <Link
                      to="/contact"
                      className="gw-font-display px-5 py-2.5 rounded-full bg-[#1a73e8] text-white text-[13px] font-medium text-center hover:bg-[#1557b0] transition-colors"
                    >
                      Open Support Page →
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}