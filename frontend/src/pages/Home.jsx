import { Link } from "react-router-dom";
import { useState } from "react";

// --- TRUST METRICS SECTION (GOOGLE MATERIAL 3 STYLE) ---
function TrustMetricsSection() {
  const metrics = [
    {
      title: "4.9 out of 5",
      description: "Average rating from 4,000+ verified agency reviews",
      badge: "Top Rated",
      icon: (
        <svg
          className="w-[22px] h-[22px]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      ),
      accentColor: "text-[#f29900]",
      bgColor: "bg-[#fef7e0]",
      topBar: "bg-[#fbbc04]",
    },
    {
      title: "200,000+",
      description: "Global businesses & SEO teams scaled",
      badge: "Global Reach",
      icon: (
        <svg
          className="w-[22px] h-[22px]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      accentColor: "text-[#1a73e8]",
      bgColor: "bg-[#e8f0fe]",
      topBar: "bg-[#1a73e8]",
    },
    {
      title: "1,000,000+",
      description: "High-authority DA/DR 50+ backlinks built",
      badge: "Verified DR 50+",
      icon: (
        <svg
          className="w-[22px] h-[22px]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
      ),
      accentColor: "text-[#1e8e3e]",
      bgColor: "bg-[#e6f4ea]",
      topBar: "bg-[#34a853]",
    },
    {
      title: "Managed or DIY",
      description: "Flexible workflows built for custom campaigns",
      badge: "API & Instant",
      icon: (
        <svg
          className="w-[22px] h-[22px]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
        </svg>
      ),
      accentColor: "text-[#9334e6]",
      bgColor: "bg-[#f3e8fd]",
      topBar: "bg-[#9334e6]",
    },
  ];

  return (
    <section className="relative w-full bg-white py-20 lg:py-28 px-4 sm:px-6 border-t border-[#e8eaed]">
      <div className="max-w-[1200px] mx-auto text-center">
        <div className="max-w-[720px] mx-auto mb-14 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f8f9fa] border border-[#e8eaed] text-[#5f6368] text-[12.5px] font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-[#34a853]" />
            Enterprise-Grade Link Infrastructure
          </div>
          <h2 className="gw-font-display text-[34px] md:text-[44px] lg:text-[50px] font-medium text-[#202124] leading-[1.12] tracking-[-0.03em] mb-4">
            Trusted by Businesses. <br />
            <span className="text-[#1a73e8]">Built to Scale.</span>
          </h2>
          <p className="gw-font-text text-[16px] md:text-[18px] text-[#5f6368] leading-[1.65]">
            When you partner with Jasa Backlinks, you get more than SEO—you get
            visibility that adapts to how people search today. Build trust with
            search engines, AI systems, and real customers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {metrics.map((item, index) => (
            <div
              key={index}
              className="relative overflow-hidden bg-white rounded-[24px] p-6 lg:p-8 border border-[#e8eaed] shadow-[0_1px_3px_rgba(60,64,67,0.04)] hover:shadow-[0_14px_36px_rgba(26,115,232,0.08)] hover:border-[#d2e3fc] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center group cursor-default"
            >
              {/* Subtle Google Top Accent Bar */}
              <div
                className={`absolute top-0 inset-x-0 h-[3px] ${item.topBar} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              <div
                className={`w-[50px] h-[50px] rounded-[16px] ${item.bgColor} ${item.accentColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                {item.icon}
              </div>

              <span className="text-[11px] font-medium text-[#5f6368] bg-[#f8f9fa] border border-[#e8eaed] px-2.5 py-0.5 rounded-full mb-3">
                {item.badge}
              </span>

              <h3 className="gw-font-display text-[24px] lg:text-[26px] font-medium text-[#202124] tracking-tight mb-2 whitespace-nowrap">
                {item.title}
              </h3>

              <p className="gw-font-text text-[13.5px] lg:text-[14px] text-[#5f6368] font-normal leading-[1.55] max-w-[210px]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- BENTO GRID SECTION (GOOGLE WORKSPACE SHOWCASE STYLE) ---
function AudienceBentoSection() {
  return (
    <section className="relative w-full bg-[#f8f9fa] py-20 lg:py-28 px-4 sm:px-6 border-t border-[#e8eaed] overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[400px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#e8f0fe]/60 via-[#f8f9fa]/20 to-transparent opacity-90 pointer-events-none" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="mb-14 lg:mb-16 flex flex-col items-center sm:items-start text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#e8eaed] text-[#1a73e8] text-[12.5px] font-medium mb-4 shadow-[0_1px_2px_rgba(60,64,67,0.04)]">
            <span className="w-2 h-2 rounded-full bg-[#1a73e8]" />
            Solutions by Business Type
          </div>
          <h2 className="gw-font-display text-[34px] md:text-[44px] lg:text-[50px] font-medium text-[#202124] leading-[1.12] tracking-[-0.03em] max-w-[700px]">
            Smarter visibility for <br className="hidden sm:block" />
            <span className="text-[#1a73e8]">every kind of business.</span>
          </h2>
          <p className="gw-font-text mt-4 md:mt-5 text-[16px] md:text-[18px] text-[#5f6368] leading-[1.65] max-w-[650px]">
            From local storefronts to national brands and scaling agencies, Jasa
            Backlinks gives you the flexibility to build authority your way.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 auto-rows-[minmax(230px,auto)]">
          {/* Card 1 */}
          <div className="col-span-1 bg-white rounded-[24px] p-8 border border-[#e8eaed] shadow-[0_1px_3px_rgba(60,64,67,0.03)] hover:shadow-[0_14px_36px_rgba(26,115,232,0.07)] hover:border-[#d2e3fc] hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between cursor-default relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div className="w-[46px] h-[46px] rounded-[14px] bg-[#e8f0fe] flex items-center justify-center text-[#1a73e8] group-hover:scale-105 transition-all duration-300">
                <svg
                  className="w-[22px] h-[22px]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <span className="text-[11.5px] font-medium text-[#1a73e8] bg-[#e8f0fe]/80 px-2.5 py-1 rounded-full">
                Local Maps & AEO
              </span>
            </div>
            <div>
              <h3 className="gw-font-display text-[21px] md:text-[22px] font-medium text-[#202124] mb-2">
                Local Businesses
              </h3>
              <p className="gw-font-text text-[14.5px] text-[#5f6368] leading-[1.6]">
                Show up in local search and AI Overviews when customers ask for
                services near them.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="col-span-1 bg-white rounded-[24px] p-8 border border-[#e8eaed] shadow-[0_1px_3px_rgba(60,64,67,0.03)] hover:shadow-[0_14px_36px_rgba(52,168,83,0.07)] hover:border-[#ceead6] hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between cursor-default relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div className="w-[46px] h-[46px] rounded-[14px] bg-[#e6f4ea] flex items-center justify-center text-[#1e8e3e] group-hover:scale-105 transition-all duration-300">
                <svg
                  className="w-[22px] h-[22px]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
              <span className="text-[11.5px] font-medium text-[#1e8e3e] bg-[#e6f4ea] px-2.5 py-1 rounded-full">
                High-Intent SERPs
              </span>
            </div>
            <div>
              <h3 className="gw-font-display text-[21px] md:text-[22px] font-medium text-[#202124] mb-2">
                E-Commerce Stores
              </h3>
              <p className="gw-font-text text-[14.5px] text-[#5f6368] leading-[1.6]">
                Get your products recommended by AI systems and featured in
                high-converting search results.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="col-span-1 bg-white rounded-[24px] p-8 border border-[#e8eaed] shadow-[0_1px_3px_rgba(60,64,67,0.03)] hover:shadow-[0_14px_36px_rgba(147,52,230,0.07)] hover:border-[#e9d2fc] hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between cursor-default relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div className="w-[46px] h-[46px] rounded-[14px] bg-[#f3e8fd] flex items-center justify-center text-[#9334e6] group-hover:scale-105 transition-all duration-300">
                <svg
                  className="w-[22px] h-[22px]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
              <span className="text-[11.5px] font-medium text-[#9334e6] bg-[#f3e8fd] px-2.5 py-1 rounded-full">
                100% White-Label
              </span>
            </div>
            <div>
              <h3 className="gw-font-display text-[21px] md:text-[22px] font-medium text-[#202124] mb-2">
                Agencies & Resellers
              </h3>
              <p className="gw-font-text text-[14.5px] text-[#5f6368] leading-[1.6]">
                Expand your services with fully managed, wholesale PBN and AI
                visibility campaigns.
              </p>
            </div>
          </div>

          {/* Card 4: Wide National Brands Card with Google Mini Analytics Pill */}
          <div className="col-span-1 md:col-span-2 bg-white rounded-[24px] p-8 md:p-10 border border-[#e8eaed] shadow-[0_1px_3px_rgba(60,64,67,0.03)] hover:shadow-[0_14px_36px_rgba(217,48,37,0.06)] hover:border-[#fad2cf] hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden cursor-default">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-8 relative z-10">
              <div className="w-[48px] h-[48px] rounded-[14px] bg-[#fce8e6] flex items-center justify-center text-[#d93025] group-hover:scale-105 transition-all duration-300">
                <svg
                  className="w-[24px] h-[24px]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </div>

              {/* Google Workspace Style Mini Status Chip */}
              <div className="flex items-center gap-3 bg-[#f8f9fa] border border-[#e8eaed] rounded-full px-3.5 py-1.5">
                <span className="flex items-center gap-1.5 text-[12px] font-medium text-[#202124]">
                  <span className="w-2 h-2 rounded-full bg-[#34a853]" />
                  DR 50+ Network
                </span>
                <span className="w-[1px] h-3.5 bg-[#dadce0]" />
                <span className="text-[12px] font-medium text-[#1a73e8]">
                  .COM • .ID • .EDU • .GOV
                </span>
              </div>
            </div>

            <div className="relative z-10 max-w-[90%]">
              <h3 className="gw-font-display text-[24px] md:text-[26px] font-medium text-[#202124] mb-2.5">
                National & Enterprise Brands
              </h3>
              <p className="gw-font-text text-[15px] md:text-[16px] text-[#5f6368] leading-[1.6]">
                Simplify multi-channel AEO and SEO with data-driven link
                strategies that scale across diverse teams, regional domains,
                and highly competitive keywords.
              </p>
            </div>
          </div>

          {/* Card 5 */}
          <div className="col-span-1 bg-white rounded-[24px] p-8 md:p-10 border border-[#e8eaed] shadow-[0_1px_3px_rgba(60,64,67,0.03)] hover:shadow-[0_14px_36px_rgba(60,64,67,0.08)] hover:border-[#dadce0] hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between cursor-default relative overflow-hidden">
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="w-[48px] h-[48px] rounded-[14px] bg-[#f1f3f4] flex items-center justify-center text-[#5f6368] group-hover:scale-105 transition-all duration-300">
                <svg
                  className="w-[24px] h-[24px]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <span className="text-[11.5px] font-medium text-[#5f6368] bg-[#f1f3f4] px-2.5 py-1 rounded-full">
                Multi-Region
              </span>
            </div>
            <div className="relative z-10">
              <h3 className="gw-font-display text-[24px] md:text-[26px] font-medium text-[#202124] mb-2.5">
                Franchises
              </h3>
              <p className="gw-font-text text-[15px] md:text-[16px] text-[#5f6368] leading-[1.6]">
                Manage search visibility for every location consistently from
                one unified authority strategy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- LIVE PACKAGE ESTIMATOR & CHECKOUT MODAL SECTION (GOOGLE CLOUD CALCULATOR STYLE) ---
function PackageEstimator() {
  const [cart, setCart] = useState({ hp_post: 50 });
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);

  const services = [
    {
      id: "hp_post",
      name: "Homepage Post",
      price: 1.0,
      desc: "Contextual homepage placement",
      metric: "DA/DR 50+",
      tag: "Popular",
    },
    {
      id: "sidebar",
      name: "Sidebar Blogroll",
      price: 2.0,
      desc: "High-authority sitewide sidebar link",
      metric: "DA/DR 50+",
    },
    {
      id: "sticky",
      name: "Homepage Sticky Post",
      price: 2.0,
      desc: "Pinned on homepage for maximum link juice",
      metric: "DA/DR 50+",
    },
    {
      id: "id_hp_post",
      name: ".ID Homepage Post",
      price: 2.0,
      desc: "Indonesian regional contextual homepage link",
      metric: "DA/DR 50+",
      tag: "Regional .ID",
    },
    {
      id: "id_sidebar",
      name: ".ID Sidebar Blogroll",
      price: 3.0,
      desc: "Local .ID sitewide blogroll placement",
      metric: "DA/DR 50+",
    },
    {
      id: "id_sticky",
      name: ".ID Sticky Post",
      price: 2.5,
      desc: "Pinned .ID homepage placement",
      metric: "DA/DR 50+",
    },
    {
      id: "hidden_links",
      name: "Hidden Links (AC.ID, SCH.ID, GO.ID)",
      price: 20.0,
      desc: "Official academic & government domains",
      metric: "High Trust",
      tag: "Exclusive",
    },
    {
      id: "edu_post",
      name: "EDU PBN Blogpost",
      price: 3.0,
      desc: "Academic contextual article placement",
      metric: "DA/DR 50+",
    },
    {
      id: "edu_sidebar",
      name: "EDU PBN Blogroll",
      price: 5.0,
      desc: "University sidebar sitewide placement",
      metric: "DA/DR 50+",
    },
  ];

  // Quick 1-Click Presets for Multi-Package Selection
  const presets = [
    {
      label: "Starter (100 Links)",
      config: { hp_post: 50, sidebar: 50 },
    },
    {
      label: "Agency Mix (1,050 Links)",
      config: { hp_post: 1000, edu_post: 50 },
    },
    {
      label: ".ID Domination (2,000 Links)",
      config: { id_hp_post: 1000, id_sidebar: 1000 },
    },
  ];

  const stops = [0, 50, 1000, 2000, 3000, 4000, 5000];

  const setServiceQty = (id, rawVal) => {
    let val = parseInt(rawVal, 10);
    if (isNaN(val) || val <= 0) {
      setCart((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      return;
    }
    if (val > 0 && val < 50) val = 50;
    if (val > 5000) val = 5000;

    setCart((prev) => ({ ...prev, [id]: val }));
  };

  const handleSliderChange = (id, rawVal) => {
    let val = parseInt(rawVal, 10) || 0;
    const milestoneStops = [1000, 2000, 3000, 4000, 5000];
    for (const stop of milestoneStops) {
      if (Math.abs(val - stop) <= 80) {
        val = stop;
        break;
      }
    }
    setServiceQty(id, val);
  };

  const clearCart = () => setCart({});

  const selectedEntries = Object.entries(cart).filter(([, qty]) => qty > 0);
  const selectedPackagesCount = selectedEntries.length;

  const finalTotal = selectedEntries.reduce((sum, [id, qty]) => {
    const service = services.find((s) => s.id === id);
    return sum + (service ? service.price * qty : 0);
  }, 0);

  const totalLinks = selectedEntries.reduce((sum, [, qty]) => sum + qty, 0);

  const handleStripeSubmit = async (e) => {
    e.preventDefault();
    alert(
      `Connecting to Stripe API to process $${finalTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD...`,
    );
  };

  const handlePayPalSubmit = async () => {
    window.open("https://www.paypal.com/checkoutnow", "_blank");
  };

  const openStripeModal = () => {
    setIsStripeModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeStripeModal = () => {
    setIsStripeModalOpen(false);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      <section
        id="estimator"
        className="w-full bg-white py-20 lg:py-28 px-4 sm:px-6 border-t border-[#e8eaed]"
      >
        <div className="max-w-[1200px] mx-auto">
          {/* Header */}
          <div className="mb-10 lg:mb-14 max-w-[740px] mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e8f0fe] text-[#1a73e8] text-[12.5px] font-medium mb-4">
              <span className="w-2 h-2 rounded-full bg-[#1a73e8] animate-pulse" />
              Interactive Cost Calculator
            </div>
            <h2 className="gw-font-display text-[34px] md:text-[46px] font-medium text-[#202124] leading-[1.15] tracking-[-0.02em] mb-4">
              Customise your{" "}
              <span className="text-[#1a73e8]">PBN package.</span>
            </h2>
            <p className="gw-font-text text-[16px] md:text-[17px] text-[#5f6368] leading-[1.6]">
              Slide any bar from 50 to 5,000 links or click a 1,000-link
              milestone stop. Combine multiple placements to build a custom
              multi-tiered campaign in USD.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-start gap-8 xl:gap-10 relative">
            {/* Left Column: Sliders Builder */}
            <div className="flex-1 w-full">
              {/* Top Control Bar with Quick Presets */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-[#f8f9fa] p-4 sm:px-5 rounded-[20px] border border-[#e8eaed]">
                <div className="flex items-center gap-2.5">
                  <span className="text-[13px] font-medium text-[#5f6368]">
                    Quick Presets:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {presets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCart(preset.config)}
                        className="text-[12px] font-medium bg-white hover:bg-[#e8f0fe] text-[#3c4043] hover:text-[#1a73e8] border border-[#dadce0] hover:border-[#d2e3fc] px-3 py-1 rounded-full transition-all cursor-pointer shadow-[0_1px_2px_rgba(60,64,67,0.03)]"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
                <span className="bg-[#e6f4ea] text-[#1e8e3e] text-[12px] font-semibold px-3 py-1 rounded-full border border-[#ceead6] self-start sm:self-auto shrink-0">
                  Guaranteed DA/DR 50+
                </span>
              </div>

              {/* Service Rows */}
              <div className="grid grid-cols-1 gap-4">
                {services.map((service) => {
                  const currentQty = cart[service.id] || 0;
                  const isActive = currentQty > 0;
                  const fillPercent = Math.min(100, (currentQty / 5000) * 100);

                  return (
                    <div
                      key={service.id}
                      className={`p-5 sm:p-6 rounded-[20px] border transition-all duration-200 ${
                        isActive
                          ? "bg-[#f8fbff] border-[#1a73e8] ring-3 ring-[#e8f0fe]/60"
                          : "bg-white border-[#e8eaed] hover:border-[#dadce0] hover:shadow-[0_4px_12px_rgba(60,64,67,0.04)]"
                      }`}
                    >
                      {/* Top Row: Info & Price */}
                      <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              setServiceQty(service.id, isActive ? 0 : 50)
                            }
                            className={`mt-1 w-5 h-5 rounded-[6px] flex items-center justify-center border transition-colors cursor-pointer shrink-0 ${
                              isActive
                                ? "bg-[#1a73e8] border-[#1a73e8] text-white"
                                : "bg-white border-[#bdc1c6] hover:border-[#1a73e8]"
                            }`}
                          >
                            {isActive && (
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth="3"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </button>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="gw-font-display text-[17px] font-medium text-[#202124]">
                                {service.name}
                              </h4>
                              <span className="text-[11px] font-medium bg-[#f1f3f4] text-[#5f6368] px-2 py-0.5 rounded-md">
                                {service.metric}
                              </span>
                              {service.tag && (
                                <span className="text-[11px] font-medium bg-[#e8f0fe] text-[#1a73e8] px-2 py-0.5 rounded-md">
                                  {service.tag}
                                </span>
                              )}
                            </div>
                            <p className="gw-font-text text-[13px] text-[#5f6368] mt-0.5">
                              {service.desc}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="gw-font-display text-[14.5px] font-medium text-[#1a73e8] bg-white border border-[#d2e3fc] px-3 py-1 rounded-full shadow-[0_1px_2px_rgba(26,115,232,0.06)]">
                            ${service.price.toFixed(2)}{" "}
                            <span className="text-[12px] font-normal text-[#5f6368]">
                              / link
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Middle Row: Slider Bar with 1,000 Milestone Tick Dots & Direct Input */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-3">
                        <div className="flex-1">
                          <div className="relative flex items-center h-7">
                            {/* Milestone Stop Dots on Track */}
                            <div className="absolute inset-x-0 flex justify-between items-center pointer-events-none px-[6px] z-10">
                              {[0, 1000, 2000, 3000, 4000, 5000].map(
                                (milestone) => (
                                  <span
                                    key={milestone}
                                    className={`w-2 h-2 rounded-full transition-colors ${
                                      currentQty >= milestone && currentQty > 0
                                        ? "bg-white ring-2 ring-[#1a73e8]"
                                        : "bg-[#bdc1c6]"
                                    }`}
                                  />
                                ),
                              )}
                            </div>

                            <input
                              type="range"
                              min="0"
                              max="5000"
                              step="50"
                              value={currentQty}
                              onChange={(e) =>
                                handleSliderChange(service.id, e.target.value)
                              }
                              className="w-full h-[8px] bg-[#e8eaed] rounded-full appearance-none cursor-pointer focus:outline-none relative z-20"
                              style={{
                                background: `linear-gradient(to right, #1a73e8 0%, #1a73e8 ${fillPercent}%, #e8eaed ${fillPercent}%, #e8eaed 100%)`,
                              }}
                            />
                          </div>

                          {/* Clickable Milestone Stop Pills (50 & every 1,000) */}
                          <div className="flex justify-between items-center mt-1.5 px-0.5">
                            {stops.map((stopVal) => {
                              const isCurrentStop =
                                currentQty === stopVal && stopVal > 0;
                              return (
                                <button
                                  key={stopVal}
                                  type="button"
                                  onClick={() =>
                                    setServiceQty(service.id, stopVal)
                                  }
                                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                                    isCurrentStop
                                      ? "bg-[#1a73e8] text-white font-semibold"
                                      : "text-[#5f6368] hover:text-[#1a73e8] hover:bg-[#e8f0fe]/70"
                                  }`}
                                >
                                  {stopVal === 0
                                    ? "Off"
                                    : stopVal === 50
                                      ? "50 (Min)"
                                      : `${stopVal / 1000}k`}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Direct Quantity Input & Subtotal */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#e8eaed]">
                          <div className="flex items-center bg-white border border-[#dadce0] rounded-full p-1 shadow-[0_1px_2px_rgba(60,64,67,0.04)]">
                            <button
                              type="button"
                              onClick={() =>
                                setServiceQty(
                                  service.id,
                                  currentQty === 50 ? 0 : currentQty - 50,
                                )
                              }
                              className="w-7 h-7 rounded-full text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4] flex items-center justify-center transition-colors cursor-pointer font-medium"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              min="0"
                              max="5000"
                              step="50"
                              value={currentQty}
                              onChange={(e) =>
                                setServiceQty(service.id, e.target.value)
                              }
                              className="w-[60px] text-center bg-transparent text-[14px] font-semibold text-[#202124] focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setServiceQty(
                                  service.id,
                                  currentQty === 0 ? 50 : currentQty + 50,
                                )
                              }
                              className="w-7 h-7 rounded-full text-[#1a73e8] hover:bg-[#e8f0fe] flex items-center justify-center transition-colors cursor-pointer font-medium"
                            >
                              +
                            </button>
                          </div>

                          <div className="w-[84px] text-right">
                            <span className="block text-[11px] text-[#5f6368]">
                              Subtotal
                            </span>
                            <span
                              className={`gw-font-display text-[15px] font-semibold ${isActive ? "text-[#1a73e8]" : "text-[#9aa0a6]"}`}
                            >
                              $
                              {(currentQty * service.price).toLocaleString(
                                "en-US",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                },
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Sticky Order Summary with Google 4-Colour Bar */}
            <div className="w-full lg:w-[390px] xl:w-[420px] shrink-0 sticky top-[88px] transition-all duration-300">
              <div className="bg-white rounded-[24px] border border-[#dadce0] shadow-[0_12px_36px_rgba(60,64,67,0.08)] overflow-hidden flex flex-col">
                {/* Authentic Google 4-Colour Top Strip */}
                <div className="grid grid-cols-4 h-[4px] w-full">
                  <div className="bg-[#4285F4]" />
                  <div className="bg-[#EA4335]" />
                  <div className="bg-[#FBBC04]" />
                  <div className="bg-[#34A853]" />
                </div>

                <div className="p-6 lg:p-7 flex flex-col">
                  <div className="flex items-center justify-between mb-5 border-b border-[#e8eaed] pb-4">
                    <div>
                      <h3 className="gw-font-display text-[20px] font-medium text-[#202124]">
                        Order Summary
                      </h3>
                      <p className="text-[12.5px] text-[#5f6368] mt-0.5">
                        {selectedPackagesCount}{" "}
                        {selectedPackagesCount === 1
                          ? "placement type"
                          : "placement types"}{" "}
                        active
                      </p>
                    </div>
                    {selectedPackagesCount > 0 && (
                      <button
                        type="button"
                        onClick={clearCart}
                        className="text-[12px] font-medium text-[#d93025] hover:bg-[#fce8e6] px-3 py-1 rounded-full transition-colors cursor-pointer"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  {/* Selected Packages List */}
                  <div className="flex-1 overflow-y-auto max-h-[250px] mb-5 pr-1 space-y-2.5 gw-font-text custom-scrollbar">
                    {selectedPackagesCount === 0 ? (
                      <div className="text-center py-8 px-4 bg-[#f8f9fa] rounded-[16px] border border-dashed border-[#dadce0]">
                        <p className="text-[14px] text-[#5f6368] font-medium">
                          No placements selected
                        </p>
                        <p className="text-[12.5px] text-[#9aa0a6] mt-1">
                          Slide any bar or choose a preset to start from 50
                          links.
                        </p>
                      </div>
                    ) : (
                      selectedEntries.map(([id, qty]) => {
                        const svc = services.find((s) => s.id === id);
                        if (!svc) return null;
                        return (
                          <div
                            key={id}
                            className="flex justify-between items-center bg-[#f8f9fa] hover:bg-[#f1f3f4]/70 px-3.5 py-2.5 rounded-[14px] border border-[#e8eaed] transition-colors"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-[12px] font-bold bg-[#e8f0fe] text-[#1a73e8] px-2.5 py-0.5 rounded-full shrink-0">
                                {qty.toLocaleString()}
                              </span>
                              <div className="min-w-0">
                                <p className="text-[13.5px] font-medium text-[#202124] truncate">
                                  {svc.name}
                                </p>
                                <p className="text-[11.5px] text-[#5f6368]">
                                  ${svc.price.toFixed(2)} / link
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 pl-2">
                              <span className="text-[13.5px] font-semibold text-[#202124]">
                                $
                                {(svc.price * qty).toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </span>
                              <button
                                type="button"
                                onClick={() => setServiceQty(id, 0)}
                                className="text-[#9aa0a6] hover:text-[#d93025] p-1 rounded-full hover:bg-white transition-colors cursor-pointer"
                                title="Remove package"
                              >
                                <svg
                                  className="w-3.5 h-3.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  strokeWidth="2.2"
                                >
                                  <path d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Totals Box */}
                  <div className="bg-[#f8f9fa] rounded-[18px] p-5 mb-5 border border-[#e8eaed]">
                    <div className="flex justify-between items-center mb-2.5 text-[13px] text-[#5f6368]">
                      <span>Selected Services</span>
                      <span className="font-medium text-[#202124]">
                        {selectedPackagesCount}{" "}
                        {selectedPackagesCount === 1 ? "Service" : "Services"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-3 pb-3 border-b border-[#dadce0] text-[13px] text-[#5f6368]">
                      <span>Total Volume</span>
                      <span className="font-semibold text-[#1a73e8] bg-[#e8f0fe] px-2.5 py-0.5 rounded-full">
                        {totalLinks.toLocaleString()} Backlinks
                      </span>
                    </div>
                    <div className="flex justify-between items-end pt-1">
                      <div>
                        <span className="gw-font-display text-[15px] font-medium text-[#202124] block">
                          Estimated Total
                        </span>
                        <span className="text-[11.5px] text-[#1e8e3e] font-medium">
                          ● Instant Setup Included
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="gw-font-display text-[30px] font-medium text-[#1a73e8] leading-none">
                          $
                          {finalTotal.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                        <span className="gw-font-text text-[12.5px] text-[#5f6368] font-medium ml-1">
                          USD
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Buttons */}
                  <div className="space-y-2.5">
                    <button
                      type="button"
                      onClick={openStripeModal}
                      disabled={totalLinks === 0}
                      className="gw-font-display w-full h-[50px] rounded-full bg-[#635BFF] text-white font-medium text-[15px] hover:bg-[#5851df] hover:shadow-[0_4px_14px_rgba(99,91,255,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <svg
                        className="h-[19px] w-auto"
                        viewBox="0 0 468 222.5"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M414 113.4c0-25.6-12.4-45.8-36.1-45.8c-23.8 0-38.2 20.2-38.2 45.6c0 30.1 17 45.3 41.4 45.3c11.9 0 20.9-2.7 27.7-6.5v-20c-6.8 3.4-14.6 5.5-24.5 5.5c-9.7 0-18.3-3.4-19.4-15.2h48.9C413.8 121 414 115.8 414 113.4z M364.6 103.9c0-11.3 6.9-16 13.2-16c6.1 0 12.6 4.7 12.6 16H364.6z"
                          fill="white"
                        />
                        <path
                          d="M301.1 67.6c-9.8 0-16.1 4.6-19.6 7.8l-1.3-6.2h-22v116.6l25-5.3l0.1-28.3c3.6 2.6 8.9 6.3 17.7 6.3c17.9 0 34.2-14.4 34.2-46.1C335.1 83.4 318.6 67.6 301.1 67.6z M295.1 136.5c-5.9 0-9.4-2.1-11.8-4.7l-0.1-37.1c2.6-2.9 6.2-4.9 11.9-4.9c9.1 0 15.4 10.2 15.4 23.3C310.5 126.5 304.3 136.5 295.1 136.5z"
                          fill="white"
                        />
                        <polygon
                          points="223.8 61.7 248.9 56.3 248.9 36 223.8 41.3"
                          fill="white"
                        />
                        <rect
                          x="223.8"
                          y="69.3"
                          width="25.1"
                          height="87.5"
                          fill="white"
                        />
                        <path
                          d="M196.9 76.7l-1.6-7.4h-21.6v87.5h25V97.5c5.9-7.7 15.9-6.3 19-5.2v-23C214.5 68.1 202.8 65.9 196.9 76.7z"
                          fill="white"
                        />
                        <path
                          d="M146.9 47.6l-24.4 5.2l-0.1 80.1c0 14.8 11.1 25.7 25.9 25.7c8.2 0 14.2-1.5 17.5-3.3V135c-3.2 1.3-19 5.9-19-8.9V90.6h19V69.3h-19L146.9 47.6z"
                          fill="white"
                        />
                        <path
                          d="M79.3 94.7c0-3.9 3.2-5.4 8.5-5.4c7.6 0 17.2 2.3 24.8 6.4V72.2c-8.3-3.3-16.5-4.6-24.8-4.6C67.5 67.6 54 78.2 54 95.9c0 27.6 38 23.2 38 35.1c0 4.6-4 6.1-9.6 6.1c-8.3 0-18.9-3.4-27.3-8v23.8c9.3 4 18.7 5.7 27.3 5.7c20.8 0 35.1-10.3 35.1-28.2C117.4 100.6 79.3 105.9 79.3 94.7z"
                          fill="white"
                        />
                      </svg>
                      <span className="opacity-60">|</span>
                      <span className="tracking-wide">Add Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={handlePayPalSubmit}
                      disabled={totalLinks === 0}
                      className="gw-font-display w-full h-[50px] rounded-full bg-[#FFC439] hover:bg-[#F4BB33] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(255,196,57,0.25)] cursor-pointer"
                    >
                      <svg
                        className="h-[21px] w-auto"
                        viewBox="0 0 188 49"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M164.01 11.446l-4.012 25.207a.643.643 0 0 0 .642.746h4.748a.701.701 0 0 0 .698-.589l4.012-25.207a.643.643 0 0 0-.642-.746h-4.748a.692.692 0 0 0-.698.589zm-5.07 7.356h-4.505a.699.699 0 0 0-.697.588l-.149.928s-3.499-3.794-9.694-1.23c-3.554 1.468-5.26 4.501-5.986 6.723 0 0-2.304 6.753 2.907 10.47 0 0 4.832 3.575 10.273-.22l-.094.592a.644.644 0 0 0 .37.686c.085.04.178.06.272.06h4.508a.692.692 0 0 0 .698-.589l2.742-17.262a.632.632 0 0 0-.149-.521.643.643 0 0 0-.496-.226zm-6.629 9.54a5.005 5.005 0 0 1-1.715 3.095 5.073 5.073 0 0 1-3.345 1.203 4.602 4.602 0 0 1-1.416-.206c-1.945-.62-3.055-2.474-2.736-4.484a5.01 5.01 0 0 1 1.717-3.093 5.08 5.08 0 0 1 3.343-1.207 4.6 4.6 0 0 1 1.416.208c1.957.616 3.062 2.473 2.741 4.485h-.005zm-24.056.477c2.443 0 4.806-.868 6.662-2.446a10.147 10.147 0 0 0 3.456-6.158c.789-4.993-3.14-9.351-8.71-9.351h-8.973a.699.699 0 0 0-.697.589L115.98 36.66a.644.644 0 0 0 .37.686c.086.04.178.06.272.06h4.751a.699.699 0 0 0 .697-.589l1.178-7.402a.692.692 0 0 1 .698-.59l4.309-.006zm3.974-8.831c-.293 1.846-1.731 3.205-4.482 3.205h-3.517l1.068-6.713h3.454c2.844.005 3.77 1.67 3.477 3.513v-.005z"
                          fill="#0070E0"
                        />
                        <path
                          d="M110.567 19.23l-5.434 9.105-2.758-9.038a.694.694 0 0 0-.672-.495h-4.904a.526.526 0 0 0-.527.446.515.515 0 0 0 .025.247l4.942 15.224-4.47 7.174a.516.516 0 0 0 .18.728.527.527 0 0 0 .269.07h5.282a.876.876 0 0 0 .751-.42l13.804-22.667a.512.512 0 0 0 .011-.53.524.524 0 0 0-.463-.263h-5.28a.877.877 0 0 0-.756.419zm-16.548-.428H89.51a.7.7 0 0 0-.698.59l-.146.927s-3.502-3.794-9.697-1.23c-3.553 1.468-5.26 4.501-5.983 6.723 0 0-2.306 6.753 2.904 10.47 0 0 4.833 3.575 10.274-.22l-.094.592a.642.642 0 0 0 .37.686c.085.04.178.06.272.06h4.508a.701.701 0 0 0 .697-.589l2.743-17.262a.642.642 0 0 0-.37-.687.655.655 0 0 0-.272-.06zm-6.63 9.542a5.011 5.011 0 0 1-1.716 3.091 5.082 5.082 0 0 1-3.343 1.206 4.605 4.605 0 0 1-1.414-.206c-1.944-.62-3.053-2.474-2.734-4.485a5.011 5.011 0 0 1 1.723-3.098 5.082 5.082 0 0 1 3.353-1.201c.48-.005.959.065 1.417.208 1.937.616 3.04 2.472 2.72 4.485h-.005zm-24.055.476a10.284 10.284 0 0 0 6.656-2.449 10.144 10.144 0 0 0 3.452-6.156c.79-4.992-3.14-9.35-8.708-9.35H55.76a.7.7 0 0 0-.698.588l-4 25.2a.642.642 0 0 0 .37.687c.085.039.178.06.272.06h4.748a.7.7 0 0 0 .698-.59l1.176-7.402a.692.692 0 0 1 .698-.589h4.31zm3.974-8.832c-.293 1.846-1.73 3.205-4.481 3.205H59.31l1.066-6.713h3.454c2.845.005 3.77 1.671 3.478 3.513v-.005z"
                          fill="#003087"
                        />
                        <path
                          d="M32.639 12.16c.107-5.566-4.484-9.836-10.797-9.836H8.784a1.277 1.277 0 0 0-1.262 1.078L2.29 36.095a1.038 1.038 0 0 0 1.025 1.2h7.736l-1.209 7.57a1.038 1.038 0 0 0 1.025 1.2h6.302c.304 0 .575-.109.807-.306.23-.198.268-.471.316-.772l1.85-10.884c.047-.3.2-.69.431-.888.231-.198.433-.306.738-.306h3.856c6.183 0 11.428-4.395 12.387-10.507.679-4.338-1.181-8.286-4.915-10.243z"
                          fill="#001C64"
                        />
                        <path
                          d="M12.725 25.238l-1.927 12.218-1.21 7.664a1.038 1.038 0 0 0 1.026 1.199h6.67a1.276 1.276 0 0 0 1.26-1.078l1.758-11.139a1.277 1.277 0 0 1 1.261-1.078h3.926c6.183 0 11.428-4.51 12.388-10.622.68-4.338-1.504-8.286-5.238-10.243-.01.462-.05.923-.121 1.38-.959 6.11-6.206 10.621-12.387 10.621h-6.145a1.278 1.278 0 0 0-1.261 1.079"
                          fill="#0070E0"
                        />
                        <path
                          d="M10.797 37.456h-7.76a1.037 1.037 0 0 1-1.024-1.2L7.245 3.078A1.277 1.277 0 0 1 8.506 2h13.336c6.313 0 10.904 4.594 10.797 10.159-1.571-.824-3.417-1.295-5.439-1.295H16.082a1.277 1.277 0 0 0-1.262 1.078l-2.094 13.296-1.93 12.218z"
                          fill="#003087"
                        />
                      </svg>
                    </button>

                    <button
                      type="button"
                      disabled={totalLinks === 0}
                      className="gw-font-display w-full h-[50px] rounded-full border border-[#dadce0] bg-white text-[#202124] font-medium text-[14.5px] hover:bg-[#f8f9fa] hover:border-[#bdc1c6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <svg
                        className="w-4 h-4 text-[#1a73e8]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                      Pay with Crypto (BoomFi)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- STRIPE CHECKOUT MODAL OVERLAY --- */}
      {isStripeModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#202124]/40 backdrop-blur-[2px] transition-opacity"
            onClick={closeStripeModal}
          />
          <div className="relative w-full max-w-[440px] bg-white rounded-[24px] shadow-[0_24px_60px_rgba(0,0,0,0.18)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#635BFF] px-6 py-6 text-white relative">
              <button
                type="button"
                onClick={closeStripeModal}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/20 transition-colors text-white/80 hover:text-white cursor-pointer"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>

              <div className="flex items-center mb-5">
                <svg
                  className="h-[24px] w-auto"
                  viewBox="0 0 468 222.5"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M414 113.4c0-25.6-12.4-45.8-36.1-45.8c-23.8 0-38.2 20.2-38.2 45.6c0 30.1 17 45.3 41.4 45.3c11.9 0 20.9-2.7 27.7-6.5v-20c-6.8 3.4-14.6 5.5-24.5 5.5c-9.7 0-18.3-3.4-19.4-15.2h48.9C413.8 121 414 115.8 414 113.4z M364.6 103.9c0-11.3 6.9-16 13.2-16c6.1 0 12.6 4.7 12.6 16H364.6z"
                    fill="white"
                  />
                  <path
                    d="M301.1 67.6c-9.8 0-16.1 4.6-19.6 7.8l-1.3-6.2h-22v116.6l25-5.3l0.1-28.3c3.6 2.6 8.9 6.3 17.7 6.3c17.9 0 34.2-14.4 34.2-46.1C335.1 83.4 318.6 67.6 301.1 67.6z M295.1 136.5c-5.9 0-9.4-2.1-11.8-4.7l-0.1-37.1c2.6-2.9 6.2-4.9 11.9-4.9c9.1 0 15.4 10.2 15.4 23.3C310.5 126.5 304.3 136.5 295.1 136.5z"
                    fill="white"
                  />
                  <polygon
                    points="223.8 61.7 248.9 56.3 248.9 36 223.8 41.3"
                    fill="white"
                  />
                  <rect
                    x="223.8"
                    y="69.3"
                    width="25.1"
                    height="87.5"
                    fill="white"
                  />
                  <path
                    d="M196.9 76.7l-1.6-7.4h-21.6v87.5h25V97.5c5.9-7.7 15.9-6.3 19-5.2v-23C214.5 68.1 202.8 65.9 196.9 76.7z"
                    fill="white"
                  />
                  <path
                    d="M146.9 47.6l-24.4 5.2l-0.1 80.1c0 14.8 11.1 25.7 25.9 25.7c8.2 0 14.2-1.5 17.5-3.3V135c-3.2 1.3-19 5.9-19-8.9V90.6h19V69.3h-19L146.9 47.6z"
                    fill="white"
                  />
                  <path
                    d="M79.3 94.7c0-3.9 3.2-5.4 8.5-5.4c7.6 0 17.2 2.3 24.8 6.4V72.2c-8.3-3.3-16.5-4.6-24.8-4.6C67.5 67.6 54 78.2 54 95.9c0 27.6 38 23.2 38 35.1c0 4.6-4 6.1-9.6 6.1c-8.3 0-18.9-3.4-27.3-8v23.8c9.3 4 18.7 5.7 27.3 5.7c20.8 0 35.1-10.3 35.1-28.2C117.4 100.6 79.3 105.9 79.3 94.7z"
                    fill="white"
                  />
                </svg>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-white/80 text-[13.5px] mb-1 font-medium">
                    Jasa Backlinks ({totalLinks.toLocaleString()} Links)
                  </p>
                  <h4 className="text-[34px] font-medium leading-none tracking-tight">
                    $
                    {finalTotal.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </h4>
                </div>
              </div>
            </div>

            <div className="p-6">
              <form onSubmit={handleStripeSubmit} className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#3c4043] mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@company.com"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#dadce0] rounded-[8px] focus:outline-none focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] transition-all text-[14.5px] text-[#202124]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#3c4043] mb-1.5">
                    Card Information
                  </label>
                  <div className="border border-[#dadce0] rounded-[8px] overflow-hidden focus-within:border-[#635BFF] focus-within:ring-1 focus-within:ring-[#635BFF] transition-all">
                    <div className="px-3.5 py-2.5 border-b border-[#dadce0] bg-white flex items-center">
                      <svg
                        className="w-5 h-5 text-[#9aa0a6] mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <rect
                          x="1"
                          y="4"
                          width="22"
                          height="16"
                          rx="2"
                          ry="2"
                        ></rect>
                        <line x1="1" y1="10" x2="23" y2="10"></line>
                      </svg>
                      <input
                        type="text"
                        placeholder="1234 5678 9101 1121"
                        className="w-full bg-transparent border-none outline-none text-[14.5px] text-[#202124] placeholder-[#9aa0a6]"
                        required
                      />
                    </div>
                    <div className="flex bg-white">
                      <input
                        type="text"
                        placeholder="MM / YY"
                        className="w-1/2 px-3.5 py-2.5 border-r border-[#dadce0] bg-transparent outline-none text-[14.5px] text-[#202124] placeholder-[#9aa0a6]"
                        required
                      />
                      <input
                        type="text"
                        placeholder="CVC"
                        className="w-1/2 px-3.5 py-2.5 bg-transparent outline-none text-[14.5px] text-[#202124] placeholder-[#9aa0a6]"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#3c4043] mb-1.5">
                    Name on card
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#dadce0] rounded-[8px] focus:outline-none focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] transition-all text-[14.5px] text-[#202124]"
                    required
                  />
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full h-[46px] bg-[#635BFF] text-white rounded-[8px] font-medium text-[15px] hover:bg-[#5851df] transition-colors shadow-[0_2px_8px_rgba(99,91,255,0.25)] flex items-center justify-center cursor-pointer"
                  >
                    Pay $
                    {finalTotal.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// --- ON-THEME GOOGLE WORKSPACE REVIEWS SECTION ---
function ReviewsSection() {
  const reviews = [
    {
      text: "Super simple and easy to use interface to select what I need — well done! The DA/DR 50+ metrics were exactly as promised.",
      name: "Anthony",
      role: "SEO Agency Lead",
      time: "28 days ago",
      avatar: "https://i.pravatar.cc/100?img=33",
    },
    {
      text: "The custom placements you guys do for .ID domains are unmatched. Being able to scale local authority instantly is a game changer.",
      name: "Fridolin Haemmer",
      role: "Head of Growth",
      time: "33 days ago",
      avatar: "https://i.pravatar.cc/100?img=11",
    },
    {
      text: "No need to follow-up. The system is transparent and the calculator makes ordering bulk placements effortless.",
      name: "Alyssa Douglas",
      role: "Digital Marketing Director",
      time: "35 days ago",
      avatar: "https://i.pravatar.cc/100?img=5",
    },
  ];

  const ratingBars = [
    { label: "5 Stars", width: "w-[88%]" },
    { label: "4 Stars", width: "w-[9%]" },
    { label: "3 Stars", width: "w-[2%]" },
    { label: "2 Stars", width: "w-[1%]" },
    { label: "1 Star", width: "w-[0%]" },
  ];

  return (
    <section className="relative w-full bg-[#f8f9fa] py-20 lg:py-28 px-4 sm:px-6 border-t border-[#e8eaed]">
      <div className="max-w-[1200px] mx-auto">
        {/* Top Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#e8eaed] text-[#5f6368] text-[12.5px] font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-[#fbbc04]" />
            Verified Client Feedback
          </div>
          <h2 className="gw-font-display text-[34px] md:text-[44px] font-medium text-[#202124] leading-[1.15] tracking-[-0.02em] mb-3">
            What our <span className="text-[#1a73e8]">customers think.</span>
          </h2>
          <p className="gw-font-text text-[16px] md:text-[17px] text-[#5f6368] leading-[1.6]">
            Read verified feedback from Agencies, In-House Marketing Teams & SEO
            Professionals.
          </p>
        </div>

        {/* Top Rating Analytics Banner */}
        <div className="bg-white rounded-[24px] border border-[#e8eaed] shadow-[0_2px_14px_rgba(60,64,67,0.03)] p-7 lg:p-10 mb-8 grid grid-cols-1 lg:grid-cols-3 items-center gap-8">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="flex items-baseline gap-2.5 mb-2">
              <span className="gw-font-display text-[48px] md:text-[54px] font-medium text-[#202124] leading-none">
                95%
              </span>
              <span className="text-[12px] font-semibold bg-[#e6f4ea] text-[#1e8e3e] px-2.5 py-0.5 rounded-full">
                satisfaction
              </span>
            </div>
            <p className="gw-font-text text-[14.5px] text-[#5f6368] leading-[1.55] max-w-[260px]">
              of customers that buy from this merchant give them a 4 or 5-star
              rating.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center lg:border-x border-[#e8eaed] py-4 lg:py-0">
            <span className="gw-font-text text-[14px] font-medium text-[#5f6368] mb-3">
              Overall Rating
            </span>
            <div className="flex gap-1.5 mb-2.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className="w-8 h-8 text-[#fbbc04]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className="text-[12.5px] text-[#5f6368]">
              100% Transparent PBN Metrics
            </span>
          </div>

          <div className="flex items-center justify-center lg:justify-end gap-6">
            <div className="text-center">
              <span className="gw-font-display text-[44px] md:text-[50px] font-medium text-[#202124] leading-none block mb-1">
                4.8/5
              </span>
              <span className="text-[12px] text-[#5f6368]">1,636 reviews</span>
            </div>
            <div className="flex-1 max-w-[210px] space-y-2">
              {ratingBars.map((bar) => (
                <div key={bar.label} className="flex items-center gap-2.5">
                  <span className="text-[12px] text-[#5f6368] w-[44px] shrink-0">
                    {bar.label}
                  </span>
                  <div className="h-2 flex-1 bg-[#f1f3f4] rounded-full overflow-hidden">
                    <div
                      className={`${bar.width} h-full bg-[#1a73e8] rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom 4-Column Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Excellent Badge Card */}
          <div className="bg-white p-7 rounded-[24px] border border-[#e8eaed] shadow-[0_1px_3px_rgba(60,64,67,0.03)] flex flex-col items-center justify-center text-center">
            <span className="gw-font-display text-[20px] font-medium text-[#202124] mb-3">
              Excellent
            </span>
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className="w-6 h-6 text-[#fbbc04]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <p className="gw-font-text text-[13px] text-[#5f6368] mb-5">
              Based on 1,636 verified orders
            </p>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f8f9fa] border border-[#e8eaed]">
              <svg
                className="w-4 h-4 text-[#1a73e8]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-[12.5px] font-medium text-[#202124]">
                Shopper Approved
              </span>
            </div>
          </div>

          {/* Cards 2-4: Customer Reviews */}
          {reviews.map((review, i) => (
            <div
              key={i}
              className="bg-white p-7 rounded-[24px] border border-[#e8eaed] shadow-[0_1px_3px_rgba(60,64,67,0.03)] hover:shadow-[0_12px_32px_rgba(26,115,232,0.06)] hover:border-[#d2e3fc] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className="w-4 h-4 text-[#fbbc04]"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <span className="gw-font-text text-[12px] text-[#9aa0a6]">
                    {review.time}
                  </span>
                </div>
                <p className="gw-font-text text-[14.5px] text-[#3c4043] leading-[1.6] mb-6">
                  "{review.text}"
                </p>
              </div>
              <div className="border-t border-[#f1f3f4] pt-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-8 h-8 rounded-full object-cover border border-[#e8eaed]"
                  />
                  <div>
                    <span className="gw-font-display text-[14px] font-medium text-[#202124] block leading-tight">
                      {review.name}
                    </span>
                    <span className="text-[11.5px] text-[#5f6368]">
                      {review.role}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-[#1e8e3e] bg-[#e6f4ea] px-2 py-0.5 rounded-full">
                  Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- COMPACT & ON-THEME GOOGLE WORKSPACE CTA SECTION ---
function CTASection() {
  return (
    <section className="w-full bg-[#f8f9fa] pb-20 lg:pb-24 px-4 sm:px-6">
      <div className="max-w-[1200px] mx-auto bg-white rounded-[28px] border border-[#dadce0] shadow-[0_12px_40px_rgba(60,64,67,0.06)] overflow-hidden relative p-8 sm:p-10 lg:px-14 lg:py-12">
        {/* Subtle Google Blue Radial Accent */}
        <div className="absolute -top-24 -right-24 w-[360px] h-[360px] bg-[#e8f0fe] rounded-full filter blur-[80px] opacity-80 pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          {/* Left Content Area */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f0fe] text-[#1a73e8] text-[12px] font-medium mb-4">
              Ready to scale your rankings?
            </div>
            <h2 className="gw-font-display text-[30px] sm:text-[36px] lg:text-[42px] font-medium text-[#202124] leading-[1.15] tracking-[-0.02em] mb-6 max-w-[540px] mx-auto lg:mx-0">
              The no-hassle way to{" "}
              <span className="text-[#1a73e8]">get SEO done.</span>
            </h2>

            {/* Compact Inline Metrics */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-10 mb-7">
              <div>
                <h3 className="gw-font-display text-[22px] sm:text-[26px] font-medium text-[#202124] leading-none mb-1">
                  2016
                </h3>
                <p className="gw-font-text text-[13px] text-[#5f6368]">
                  Founded In
                </p>
              </div>
              <div className="w-[1px] h-8 bg-[#dadce0] hidden sm:block" />
              <div>
                <h3 className="gw-font-display text-[22px] sm:text-[26px] font-medium text-[#1a73e8] leading-none mb-1">
                  40k+
                </h3>
                <p className="gw-font-text text-[13px] text-[#5f6368]">
                  Agency Accounts
                </p>
              </div>
              <div className="w-[1px] h-8 bg-[#dadce0] hidden sm:block" />
              <div>
                <h3 className="gw-font-display text-[22px] sm:text-[26px] font-medium text-[#202124] leading-none mb-1">
                  20+
                </h3>
                <p className="gw-font-text text-[13px] text-[#5f6368]">
                  Services Offered
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("estimator")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="gw-font-display w-full sm:w-auto h-[48px] px-7 rounded-full bg-[#1a73e8] text-[15px] font-medium text-white shadow-[0_4px_14px_rgba(26,115,232,0.25)] hover:bg-[#1557b0] transition-all duration-300 cursor-pointer"
              >
                View Our Services
              </button>
              <Link
                to="/contact"
                className="gw-font-display w-full sm:w-auto h-[48px] px-7 rounded-full border border-[#dadce0] bg-white text-[15px] font-medium text-[#202124] hover:bg-[#f8f9fa] hover:border-[#bdc1c6] transition-all duration-300 flex items-center justify-center"
              >
                Book a call
              </Link>
            </div>
          </div>

          {/* Right Compact SaaS Graphic Card */}
          <div className="w-full lg:w-[370px] shrink-0">
            <div className="bg-[#f8f9fa] rounded-[22px] border border-[#e8eaed] p-5 relative">
              <div className="bg-white rounded-[16px] border border-[#e8eaed] p-4 mb-3 shadow-[0_2px_8px_rgba(60,64,67,0.04)]">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#f1f3f4]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center font-bold text-[13px]">
                      SEO
                    </div>
                    <div>
                      <p className="text-[13.5px] font-medium text-[#202124]">
                        Authority Campaign
                      </p>
                      <p className="text-[11.5px] text-[#1e8e3e] font-medium">
                        ● Live Indexing Active
                      </p>
                    </div>
                  </div>
                  <span className="bg-[#fef7e0] text-[#f29900] text-[11.5px] font-bold px-2.5 py-1 rounded-full">
                    DA 50+
                  </span>
                </div>

                <div className="flex items-center justify-between text-[12px] text-[#5f6368]">
                  <span>Average SERP Velocity</span>
                  <span className="text-[#1e8e3e] font-semibold">
                    +142% Organic Lift
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between bg-white rounded-[16px] p-3.5 border border-[#e8eaed] shadow-[0_2px_8px_rgba(60,64,67,0.04)]">
                <div className="flex -space-x-2">
                  <img
                    src="https://i.pravatar.cc/100?img=33"
                    alt="Partner"
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                  <img
                    src="https://i.pravatar.cc/100?img=11"
                    alt="Partner"
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                  <img
                    src="https://i.pravatar.cc/100?img=12"
                    alt="Partner"
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-[#1a73e8] text-white text-[11px] font-bold flex items-center justify-center">
                    5k+
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="gw-font-display font-bold text-[15px] text-[#202124]">
                    4.9
                  </span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg
                        key={s}
                        className="w-3.5 h-3.5 text-[#fbbc04]"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- MAIN HOME COMPONENT ---
export default function Home() {
  return (
    <main className="w-full bg-[#fcfcfc] relative">
      <style>{`
        .bg-dotted-grid { background-image: radial-gradient(circle, #d0d7de 1px, transparent 1px); background-size: 32px 32px; }
        @keyframes floatBlob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.05); } 66% { transform: translate(-20px, 20px) scale(0.95); } 100% { transform: translate(0px, 0px) scale(1); } }
        .animate-blob { animation: floatBlob 18s infinite alternate ease-in-out; }
        .delay-2000 { animation-delay: 2s; } .delay-4000 { animation-delay: 4s; }
        @keyframes pulseNode { 0% { r: 3; opacity: 0.5; } 50% { r: 4.5; opacity: 1; } 100% { r: 3; opacity: 0.5; } }
        .node-pulse { animation: pulseNode 3s infinite ease-in-out; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f3f4; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #dadce0; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #bdc1c6; }

        /* Custom Slider Styling for Webkit Browsers */
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; height: 22px; width: 22px; border-radius: 50%;
          background: #ffffff; border: 3px solid #1a73e8; cursor: pointer;
          box-shadow: 0 2px 6px rgba(26, 115, 232, 0.3); transition: transform 0.15s ease;
        }
        input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.12); }
        input[type=range]::-webkit-slider-thumb:active { transform: scale(1.2); background: #e8f0fe; }

        /* Custom Slider Styling for Firefox */
        input[type=range]::-moz-range-thumb {
          height: 22px; width: 22px; border-radius: 50%;
          background: #ffffff; border: 3px solid #1a73e8; cursor: pointer;
          box-shadow: 0 2px 6px rgba(26, 115, 232, 0.3); transition: transform 0.15s ease;
        }
        input[type=range]::-moz-range-thumb:hover { transform: scale(1.12); }
        input[type=range]::-moz-range-thumb:active { transform: scale(1.2); background: #e8f0fe; }
      `}</style>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 pb-16 md:pb-24 pt-[64px] overflow-hidden">
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 bg-dotted-grid [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] opacity-50" />
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.15] md:opacity-[0.22] hidden sm:block"
            viewBox="0 0 1000 600"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M250 150 L400 220 L500 120 L650 200 L800 150 L850 320 L750 450 L550 380 L450 480 L300 380 Z"
              stroke="#1a73e8"
              strokeWidth="0.75"
              strokeDasharray="4 4"
            />
            <path
              d="M400 220 L550 380 M650 200 L750 450 M500 120 L800 150"
              stroke="#1a73e8"
              strokeWidth="0.5"
              opacity="0.4"
            />
            <circle
              cx="250"
              cy="150"
              r="3"
              fill="#1a73e8"
              className="node-pulse"
              style={{ animationDelay: "0s" }}
            />
            <circle cx="400" cy="220" r="4" fill="#1a73e8" />
            <circle
              cx="500"
              cy="120"
              r="3"
              fill="#1a73e8"
              className="node-pulse"
              style={{ animationDelay: "1s" }}
            />
            <circle cx="650" cy="200" r="4.5" fill="#1a73e8" />
            <circle
              cx="800"
              cy="150"
              r="3"
              fill="#1a73e8"
              className="node-pulse"
              style={{ animationDelay: "0.5s" }}
            />
            <circle cx="850" cy="320" r="4" fill="#1a73e8" />
            <circle
              cx="750"
              cy="450"
              r="3"
              fill="#1a73e8"
              className="node-pulse"
              style={{ animationDelay: "1.5s" }}
            />
            <circle cx="550" cy="380" r="5" fill="#1a73e8" />
            <circle
              cx="450"
              cy="480"
              r="3"
              fill="#1a73e8"
              className="node-pulse"
              style={{ animationDelay: "2s" }}
            />
            <circle cx="300" cy="380" r="4" fill="#1a73e8" />
          </svg>
          <div className="absolute top-[10%] md:top-[15%] left-[5%] md:left-[15%] w-[300px] md:w-[450px] h-[300px] md:h-[450px] bg-[#1a73e8] rounded-full mix-blend-multiply filter blur-[100px] md:blur-[140px] opacity-[0.10] animate-blob" />
          <div className="absolute top-[20%] md:top-[25%] right-[5%] md:right-[10%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-[#34a853] rounded-full mix-blend-multiply filter blur-[90px] md:blur-[130px] opacity-[0.08] animate-blob delay-2000" />
          <div className="absolute bottom-[5%] left-[20%] md:left-[30%] w-[350px] md:w-[550px] h-[350px] md:h-[550px] bg-[#fbbc04] rounded-full mix-blend-multiply filter blur-[120px] md:blur-[150px] opacity-[0.06] animate-blob delay-4000" />
        </div>

        <div className="flex flex-col items-center justify-center w-full max-w-[1300px] mt-8 md:mt-12 relative z-10">
          {/* Google Workspace Style 4-Colour Eyebrow Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#dadce0] shadow-[0_2px_8px_rgba(60,64,67,0.05)] mb-6">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
              <span className="w-2 h-2 rounded-full bg-[#EA4335]" />
              <span className="w-2 h-2 rounded-full bg-[#FBBC04]" />
              <span className="w-2 h-2 rounded-full bg-[#34A853]" />
            </span>
            <span className="gw-font-text text-[13px] font-medium text-[#3c4043]">
              Next-Gen PBN Authority • Verified DA/DR 50+
            </span>
          </div>

          <h2 className="gw-font-display text-[44px] sm:text-[58px] md:text-[74px] lg:text-[88px] font-medium leading-[1.1] md:leading-[1.06] tracking-[-0.025em] md:tracking-[-0.03em] text-[#202124] mb-6 w-full">
            Build organic authority <br className="hidden sm:block" />
            <span className="text-[#1a73e8]">with premium PBN backlinks.</span>
          </h2>

          {/* Authentic Google Product Subtitle */}
          <p className="gw-font-text text-[17px] md:text-[20px] text-[#5f6368] max-w-[720px] leading-[1.6] mb-9 px-2">
            Scale your search rankings and AI Overview visibility with clean,
            high-metric contextual placements across .COM, .ID, .EDU, and .GOV
            domains.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full px-4 sm:px-0 mb-10 md:mb-12 z-20">
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("estimator")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="gw-font-display w-full sm:w-[240px] inline-flex h-[52px] md:h-[56px] items-center justify-center rounded-full bg-[#1a73e8] text-[15px] md:text-[16px] font-medium tracking-[0.2px] text-white shadow-[0_6px_20px_rgba(26,115,232,0.25)] hover:bg-[#1557b0] hover:shadow-[0_8px_28px_rgba(26,115,232,0.35)] transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            >
              Explore SEO packages
            </button>
            <Link
              to="/contact"
              className="gw-font-display w-full sm:w-[240px] inline-flex h-[52px] md:h-[56px] items-center justify-center rounded-full border border-[#dadce0] bg-white/85 backdrop-blur-md text-[15px] md:text-[16px] font-medium tracking-[0.2px] text-[#3c4043] shadow-[0_2px_10px_rgba(60,64,67,0.04)] hover:bg-white hover:border-[#bdc1c6] hover:text-[#202124] transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Talk to an expert
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 px-5 md:px-6 py-3 rounded-[24px] sm:rounded-full bg-white/80 backdrop-blur-xl border border-[#e8eaed] shadow-[0_8px_32px_rgba(32,33,36,0.06)] relative z-20 transition-transform duration-300 hover:scale-105 cursor-default max-w-[90%] sm:max-w-none">
            <div className="flex -space-x-2 md:-space-x-3">
              <img
                src="https://i.pravatar.cc/100?img=33"
                alt="Agency Partner"
                className="w-[30px] h-[30px] md:w-[34px] md:h-[34px] rounded-full border-2 border-white shadow-sm object-cover"
              />
              <img
                src="https://i.pravatar.cc/100?img=11"
                alt="Agency Partner"
                className="w-[30px] h-[30px] md:w-[34px] md:h-[34px] rounded-full border-2 border-white shadow-sm object-cover"
              />
              <img
                src="https://i.pravatar.cc/100?img=12"
                alt="Agency Partner"
                className="w-[30px] h-[30px] md:w-[34px] md:h-[34px] rounded-full border-2 border-white shadow-sm object-cover"
              />
              <img
                src="https://i.pravatar.cc/100?img=59"
                alt="Agency Partner"
                className="w-[30px] h-[30px] md:w-[34px] md:h-[34px] rounded-full border-2 border-white shadow-sm object-cover"
              />
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <div className="flex items-center gap-0.5 mb-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-3.5 h-3.5 md:w-3.5 md:h-3.5 text-[#fbbc04]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="gw-font-text text-[12px] md:text-[13px] font-medium text-[#5f6368] leading-tight text-center sm:text-left">
                Trusted by 500+ SEO agencies & brands
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* --- TRUST METRICS SECTION --- */}
      <TrustMetricsSection />

      {/* --- BENTO GRID SECTION --- */}
      <AudienceBentoSection />

      {/* --- PACKAGE ESTIMATOR SECTION --- */}
      <PackageEstimator />

      {/* --- REVIEWS SECTION --- */}
      <ReviewsSection />

      {/* --- COMPACT CTA SECTION --- */}
      <CTASection />
    </main>
  );
}
