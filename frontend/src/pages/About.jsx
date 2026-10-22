import { Link } from "react-router-dom";

const TEAM_CONTACTS = {
  whatsappUrl: "https://wa.me/447598789693",
  whatsappLabel: "+44 7598789693",
  telegramUrl: "https://t.me/SEOHUBLTD",
  telegramLabel: "@SEOHUBLTD",
  supportEmail: "jasa-backlinks@seohubltd.com",
};

export default function About() {
  const stats = [
    {
      value: "2016",
      label: "Founded & Operating",
      badge: "Proven Track Record",
      color: "text-[#1a73e8] bg-[#e8f0fe]",
      topBar: "bg-[#1a73e8]",
    },
    {
      value: "1,000,000+",
      label: "DA/DR 50+ Links Deployed",
      badge: "Verified Authority",
      color: "text-[#1e8e3e] bg-[#e6f4ea]",
      topBar: "bg-[#34a853]",
    },
    {
      value: "500+",
      label: "Global SEO Agencies Scaled",
      badge: "100% White-Label",
      color: "text-[#f29900] bg-[#fef7e0]",
      topBar: "bg-[#fbbc04]",
    },
    {
      value: "99.8%",
      label: "Indexation & Network Uptime",
      badge: "Zero Footprints",
      color: "text-[#9334e6] bg-[#f3e8fd]",
      topBar: "bg-[#9334e6]",
    },
  ];

  const pillars = [
    {
      number: "01",
      title: "Strict Class-C IP & Hosting Isolation",
      desc: "Every domain across our .COM, .ID, and .EDU inventory is hosted on isolated Class-C IP blocks, independent DNS providers, and distinct registrars to guarantee zero footprints.",
      tag: "Network Security",
      tagColor: "bg-[#e8f0fe] text-[#1a73e8]",
    },
    {
      number: "02",
      title: "Rigorous Domain Vetting (DA/DR 50+)",
      desc: "We acquire and maintain aged domains with clean historical backlink profiles, zero spam scores, and verified Moz DA 50+ and Ahrefs DR 50+ authority metrics.",
      tag: "Quality Control",
      tagColor: "bg-[#e6f4ea] text-[#1e8e3e]",
    },
    {
      number: "03",
      title: "Multi-Region & Institutional Inventory",
      desc: "From global .COM/.NET/.ORG domains to authentic Indonesian (.ID, .CO.ID) and restricted academic/government (.EDU, .AC.ID, .GO.ID) properties.",
      tag: "Global & Local SERPs",
      tagColor: "bg-[#fef7e0] text-[#f29900]",
    },
    {
      number: "04",
      title: "Self-Serve Automation & White-Label Delivery",
      desc: "Built by engineers at SeoHub Ltd to eliminate manual outreach delays. Calculate bulk pricing in real time, checkout via Card, PayPal, or Crypto, and receive unbranded reports.",
      tag: "Agency Ready",
      tagColor: "bg-[#f3e8fd] text-[#9334e6]",
    },
  ];

  const milestones = [
    {
      year: "2016",
      title: "Foundation of Our Private Network",
      desc: "Started acquiring aged, high-authority domains and building isolated hosting infrastructure for private agency clients.",
    },
    {
      year: "2020",
      title: "Expansion into Regional .ID & Academic Tiers",
      desc: "Scaled our Southeast Asian (.ID / .CO.ID) and institutional (.EDU / .AC.ID / .GO.ID) inventory to support competitive international SERPs.",
    },
    {
      year: "2024",
      title: "Consolidation Under SeoHub Ltd",
      desc: "Unified our link-building operations, editorial teams, and technical SEO infrastructure under the corporate umbrella of SeoHub Ltd.",
    },
    {
      year: "2026",
      title: "Launch of the Automated Self-Serve Portal",
      desc: "Introduced our real-time bulk package estimator, multi-gateway checkout (Stripe, PayPal, BoomFi), and automated white-label dispatch system.",
    },
  ];

  return (
    <main className="w-full bg-[#fcfcfc] relative overflow-x-clip pt-[56px] pb-16 sm:pb-0">
      <style>{`
        .bg-dotted-grid { background-image: radial-gradient(circle, #d0d7de 1px, transparent 1px); background-size: 28px 28px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* --- 1. HERO HEADER SECTION --- */}
      <section className="relative w-full bg-white py-9 sm:py-16 lg:py-22 px-4 sm:px-6 border-b border-[#e8eaed] overflow-hidden">
        <div className="absolute inset-0 bg-dotted-grid [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] opacity-45 pointer-events-none" />

        <div className="max-w-[1200px] mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#f8f9fa] border border-[#dadce0] shadow-[0_2px_6px_rgba(60,64,67,0.04)] mb-4 sm:mb-5 max-w-full">
            <span className="flex items-center gap-1 shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
              <span className="w-2 h-2 rounded-full bg-[#EA4335]" />
              <span className="w-2 h-2 rounded-full bg-[#FBBC04]" />
              <span className="w-2 h-2 rounded-full bg-[#34A853]" />
            </span>
            <span className="gw-font-text text-[11.5px] sm:text-[13px] font-medium text-[#3c4043] truncate">
              About Jasa Backlinks • A Division of SeoHub Ltd
            </span>
          </div>

          <h2 className="gw-font-display text-[28px] sm:text-[46px] md:text-[58px] font-medium text-[#202124] leading-[1.14] sm:leading-[1.1] tracking-[-0.025em] max-w-[880px] mx-auto mb-4 sm:mb-5 px-1">
            Engineering organic authority <br className="hidden sm:block" />
            <span className="text-[#1a73e8]">at enterprise scale.</span>
          </h2>

          <p className="gw-font-text text-[14.5px] sm:text-[17px] md:text-[18.5px] text-[#5f6368] max-w-[720px] mx-auto leading-[1.6] mb-7 sm:mb-9 px-1">
            Jasa Backlinks is a premier SEO and private link infrastructure
            platform operating under{" "}
            <strong className="text-[#202124]">SeoHub Ltd</strong>. We empower
            global SEO agencies, e-commerce brands, and enterprise marketing
            teams with verified DA/DR 50+ placements across .COM, .ID, .EDU, and
            .GOV networks.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-[340px] sm:max-w-none mx-auto">
            <Link
              to="/services"
              className="gw-font-display w-full sm:w-auto px-7 h-[48px] sm:h-[52px] rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-[14.5px] sm:text-[15px] font-medium shadow-[0_6px_20px_rgba(26,115,232,0.25)] flex items-center justify-center transition-all"
            >
              Explore Our 12 Services →
            </Link>
            <Link
              to="https://seohubltd.com/contact"
              className="gw-font-display w-full sm:w-auto px-7 h-[48px] sm:h-[52px] rounded-full border border-[#dadce0] bg-white hover:bg-[#f8f9fa] text-[#202124] text-[14.5px] sm:text-[15px] font-medium flex items-center justify-center transition-all"
            >
              Contact SeoHub Ltd Desk
            </Link>
          </div>
        </div>
      </section>

      {/* --- 2. KEY METRICS & INFRASTRUCTURE STATS (2x2 MOBILE, 4-COL DESKTOP) --- */}
      <section className="w-full py-8 sm:py-14 px-3.5 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {stats.map((item, idx) => (
              <div
                key={idx}
                className="relative bg-white rounded-[20px] sm:rounded-[24px] p-4 sm:p-6 lg:p-7 border border-[#e8eaed] shadow-[0_2px_10px_rgba(60,64,67,0.03)] overflow-hidden flex flex-col justify-between"
              >
                <div
                  className={`absolute top-0 inset-x-0 h-[3px] ${item.topBar}`}
                />
                <div>
                  <span
                    className={`inline-block text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-full mb-3 ${item.color}`}
                  >
                    {item.badge}
                  </span>
                  <h2 className="gw-font-display text-[22px] sm:text-[32px] lg:text-[36px] font-medium text-[#202124] leading-tight mb-1">
                    {item.value}
                  </h2>
                  <p className="gw-font-text text-[12px] sm:text-[13.5px] text-[#5f6368] leading-snug">
                    {item.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 3. OUR STORY & SEOHUB LTD INFRASTRUCTURE (2-COLUMN) --- */}
      <section className="w-full py-8 sm:py-16 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="bg-white rounded-[24px] sm:rounded-[28px] border border-[#dadce0] shadow-[0_12px_36px_rgba(60,64,67,0.05)] overflow-hidden">
            <div className="grid grid-cols-4 h-[4px] w-full">
              <div className="bg-[#4285F4]" />
              <div className="bg-[#EA4335]" />
              <div className="bg-[#FBBC04]" />
              <div className="bg-[#34A853]" />
            </div>

            <div className="p-5 sm:p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f0fe] text-[#1a73e8] text-[12px] font-semibold">
                  Our Engineering Philosophy
                </div>
                <h2 className="gw-font-display text-[24px] sm:text-[34px] font-medium text-[#202124] leading-[1.18]">
                  Why we built{" "}
                  <span className="text-[#1a73e8]">Jasa Backlinks.</span>
                </h2>
                <p className="gw-font-text text-[14px] sm:text-[15.5px] text-[#5f6368] leading-[1.65]">
                  Traditional link building is broken—plagued by slow manual
                  outreach, unverified domain metrics, footprint-heavy reseller
                  blogs, and opaque invoicing. Under the leadership of{" "}
                  <strong className="text-[#202124]">SeoHub Ltd</strong>, we
                  engineered Jasa Backlinks to give SEO professionals direct,
                  self-serve access to a privately owned, enterprise-grade
                  domain ecosystem.
                </p>
                <p className="gw-font-text text-[14px] sm:text-[15.5px] text-[#5f6368] leading-[1.65]">
                  Whether you are scaling a local Indonesian brand on{" "}
                  <strong className="text-[#202124]">Google.co.id</strong>,
                  competing in global English SERPs, or reinforcing E-E-A-T and
                  AI Overview citations with institutional{" "}
                  <strong className="text-[#202124]">.EDU and .GOV</strong>{" "}
                  authority, our platform delivers predictable rankings with
                  complete transparency.
                </p>

                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "100% Privately Owned Domain Inventory",
                    "Zero Third-Party Reseller Markups",
                    "Automated Multi-Gateway Checkout",
                    "Unbranded White-Label Agency Sheets",
                  ].map((point, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 text-[13px] sm:text-[13.5px] font-medium text-[#202124]"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#e6f4ea] text-[#1e8e3e] flex items-center justify-center shrink-0">
                        ✓
                      </span>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Corporate Identity Card */}
              <div className="lg:col-span-5 bg-[#f8f9fa] rounded-[20px] p-5 sm:p-6 border border-[#e8eaed]">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#dadce0]">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5f6368] block">
                      Corporate Profile
                    </span>
                    <h2 className="gw-font-display text-[20px] font-medium text-[#202124]">
                      SeoHub Ltd
                    </h2>
                  </div>
                  <span className="text-[11.5px] font-semibold bg-[#e6f4ea] text-[#1e8e3e] border border-[#ceead6] px-3 py-1 rounded-full">
                    ● Verified Entity
                  </span>
                </div>

                <div className="space-y-3 text-[13px] text-[#3c4043] mb-5">
                  <div className="flex justify-between py-2 border-b border-[#e8eaed]">
                    <span className="text-[#5f6368]">Flagship Brand</span>
                    <span className="font-semibold text-[#202124]">
                      Jasa Backlinks
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#e8eaed]">
                    <span className="text-[#5f6368]">Network Guarantee</span>
                    <span className="font-semibold text-[#1a73e8]">
                      Moz DA 50+ / Ahrefs DR 50+
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#e8eaed]">
                    <span className="text-[#5f6368]">Supported Networks</span>
                    <span className="font-medium text-[#202124]">
                      .COM • .ID • .EDU • .GOV
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-[#5f6368]">
                      Official Support Desk
                    </span>
                    <span className="font-mono text-[12px] font-semibold text-[#1a73e8]">
                      {TEAM_CONTACTS.supportEmail}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <a
                    href={TEAM_CONTACTS.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-[12px] bg-white border border-[#dadce0] hover:border-[#34a853] text-center text-[12.5px] font-semibold text-[#1e8e3e] transition-all"
                  >
                    WhatsApp Desk ↗
                  </a>
                  <a
                    href={TEAM_CONTACTS.telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-[12px] bg-white border border-[#dadce0] hover:border-[#1a73e8] text-center text-[12.5px] font-semibold text-[#1a73e8] transition-all"
                  >
                    Telegram Desk ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 4. FOUR PILLARS OF NETWORK ARCHITECTURE --- */}
      <section className="w-full bg-white py-12 sm:py-20 px-4 sm:px-6 border-t border-[#e8eaed]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-[700px] mx-auto mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f8f9fa] border border-[#e8eaed] text-[#5f6368] text-[12px] font-medium mb-3">
              Infrastructure Standards
            </div>
            <h2 className="gw-font-display text-[26px] sm:text-[38px] font-medium text-[#202124] leading-[1.15]">
              Built for safety, speed, and{" "}
              <span className="text-[#1a73e8]">SERP dominance.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {pillars.map((pillar, i) => (
              <div
                key={i}
                className="bg-[#f8f9fa] hover:bg-white rounded-[20px] sm:rounded-[24px] p-5 sm:p-7 border border-[#e8eaed] hover:border-[#d2e3fc] hover:shadow-[0_12px_32px_rgba(26,115,232,0.06)] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="gw-font-display text-[14px] font-bold text-[#1a73e8] bg-white border border-[#d2e3fc] px-3 py-1 rounded-full">
                      Pillar {pillar.number}
                    </span>
                    <span
                      className={`text-[11.5px] font-semibold px-3 py-1 rounded-full ${pillar.tagColor}`}
                    >
                      {pillar.tag}
                    </span>
                  </div>
                  <h2 className="gw-font-display text-[19px] sm:text-[21px] font-medium text-[#202124] mb-2">
                    {pillar.title}
                  </h2>
                  <p className="gw-font-text text-[13.5px] sm:text-[14.5px] text-[#5f6368] leading-[1.6]">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 5. TIMELINE & MILESTONES --- */}
      <section className="w-full bg-[#f8f9fa] py-12 sm:py-20 px-4 sm:px-6 border-t border-[#e8eaed]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-[680px] mx-auto mb-8 sm:mb-12">
            <h2 className="gw-font-display text-[26px] sm:text-[36px] font-medium text-[#202124]">
              Our journey from 2016 to{" "}
              <span className="text-[#1a73e8]">2026.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="bg-white rounded-[20px] p-5 sm:p-6 border border-[#e8eaed] shadow-[0_2px_8px_rgba(60,64,67,0.03)] flex flex-col justify-between"
              >
                <div>
                  <span className="gw-font-display text-[24px] font-bold text-[#1a73e8] block mb-2">
                    {m.year}
                  </span>
                  <h2 className="gw-font-display text-[17px] font-medium text-[#202124] mb-2">
                    {m.title}
                  </h2>
                  <p className="gw-font-text text-[13px] text-[#5f6368] leading-[1.55]">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 6. BOTTOM CTA BANNER --- */}
      <section className="w-full bg-white py-12 sm:py-16 px-4 sm:px-6 border-t border-[#e8eaed]">
        <div className="max-w-[1000px] mx-auto bg-[#f8fbff] rounded-[24px] border border-[#d2e3fc] p-6 sm:p-10 text-center">
          <h2 className="gw-font-display text-[24px] sm:text-[34px] font-medium text-[#202124] mb-3">
            Ready to scale your rankings with{" "}
            <span className="text-[#1a73e8]">Jasa Backlinks?</span>
          </h2>
          <p className="gw-font-text text-[14px] sm:text-[16px] text-[#5f6368] max-w-[600px] mx-auto mb-6">
            Use our interactive bulk cost calculator to build your custom DA/DR
            50+ campaign in under 60 seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/#estimator"
              className="gw-font-display w-full sm:w-auto px-7 h-[48px] rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-[14.5px] font-medium flex items-center justify-center shadow-sm"
            >
              Launch Cost Calculator →
            </Link>
            <Link
              to="/services"
              className="gw-font-display w-full sm:w-auto px-7 h-[48px] rounded-full border border-[#dadce0] bg-white hover:bg-[#f8f9fa] text-[#202124] text-[14.5px] font-medium flex items-center justify-center"
            >
              View All 12 Services
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
