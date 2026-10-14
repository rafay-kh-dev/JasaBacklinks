import { Link } from "react-router-dom";

// --- TRUST METRICS SECTION ---
function TrustMetricsSection() {
  const metrics = [
    {
      title: "4.9 out of 5",
      description: "Average Rating from 4,000+ reviews",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      ),
      accentColor: "text-[#fbbc04]",
      bgColor: "bg-[#fef7e0]",
    },
    {
      title: "200,000+",
      description: "Businesses Served",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      accentColor: "text-[#1a73e8]",
      bgColor: "bg-[#e8f0fe]",
    },
    {
      title: "1,000,000+",
      description: "Backlinks Built",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
      ),
      accentColor: "text-[#1e8e3e]",
      bgColor: "bg-[#e6f4ea]",
    },
    {
      title: "Managed or DIY",
      description: "Fully custom solutions",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
        </svg>
      ),
      accentColor: "text-[#9334e6]",
      bgColor: "bg-[#f3e8fd]",
    },
  ];

  return (
    <section className="relative w-full bg-white py-24 lg:py-32 px-4 sm:px-6 border-t border-[#e8eaed]">
      <div className="max-w-[1200px] mx-auto text-center">
        
        {/* Section Heading & Subtitle */}
        <div className="max-w-[700px] mx-auto mb-16 lg:mb-20">
          <h2 className="gw-font-display text-[36px] md:text-[46px] lg:text-[52px] font-medium text-[#202124] leading-[1.12] tracking-[-0.03em] mb-5">
            Trusted by Businesses. <br />
            <span className="text-[#1a73e8]">Built to Scale.</span>
          </h2>
          <p className="gw-font-text text-[17px] md:text-[18px] text-[#5f6368] leading-[1.65]">
            When you partner with Jasa Backlinks, you get more than SEO—you get visibility that adapts to how people search today. Build trust with search engines, AI systems, and real customers.
          </p>
        </div>

        {/* 4 Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((item, index) => (
            <div 
              key={index}
              className="bg-[#fafafa] hover:bg-white rounded-[24px] p-8 border border-[#e8eaed] shadow-[0_2px_12px_rgba(60,64,67,0.02)] hover:shadow-[0_16px_40px_rgba(26,115,232,0.08)] hover:border-[#d2e3fc] hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-center text-center group cursor-default"
            >
              {/* Icon Container */}
              <div className={`w-[52px] h-[52px] rounded-[16px] ${item.bgColor} ${item.accentColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                {item.icon}
              </div>

              {/* Stat Number / Title */}
              <h3 className="gw-font-display text-[28px] md:text-[32px] font-medium text-[#202124] tracking-tight mb-2">
                {item.title}
              </h3>

              {/* Description */}
              <p className="gw-font-text text-[14px] md:text-[15px] text-[#5f6368] font-normal leading-[1.5]">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// --- BENTO GRID SECTION ---
function AudienceBentoSection() {
  return (
    <section className="relative w-full bg-[#f8f9fa] py-24 lg:py-32 px-4 sm:px-6 border-t border-[#e8eaed] overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[400px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#e8f0fe]/50 via-[#f8f9fa]/20 to-transparent opacity-80 pointer-events-none" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="mb-16 lg:mb-20 flex flex-col items-center sm:items-start text-center sm:text-left">
          <h2 className="gw-font-display text-[36px] md:text-[48px] lg:text-[56px] font-medium text-[#202124] leading-[1.12] tracking-[-0.03em] max-w-[700px]">
            Smarter visibility for <br className="hidden sm:block" />
            <span className="text-[#1a73e8]">every kind of business.</span>
          </h2>
          <p className="gw-font-text mt-5 md:mt-6 text-[17px] md:text-[19px] text-[#5f6368] leading-[1.65] max-w-[650px]">
            From local storefronts to national brands and scaling agencies, Jasa Backlinks gives you the flexibility to build authority your way.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 auto-rows-[minmax(220px,auto)]">
          <div className="col-span-1 bg-white hover:bg-gradient-to-br hover:from-white hover:to-[#f8fafd] rounded-[24px] p-8 lg:p-10 border border-[#e8eaed] shadow-[0_2px_12px_rgba(60,64,67,0.02)] hover:shadow-[0_16px_48px_rgba(26,115,232,0.08)] hover:border-[#d2e3fc] hover:-translate-y-1.5 transition-all duration-500 group flex flex-col justify-between cursor-default relative overflow-hidden">
            <div className="flex justify-between items-start mb-8">
              <div className="w-[48px] h-[48px] rounded-[14px] bg-[#e8f0fe] flex items-center justify-center text-[#1a73e8] group-hover:scale-110 group-hover:bg-[#d2e3fc] transition-all duration-300 border border-[#d2e3fc]/50">
                <svg className="w-[24px] h-[24px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#e8f0fe] flex items-center justify-center text-[#1a73e8] opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </div>
            </div>
            <div>
              <h3 className="gw-font-display text-[22px] md:text-[24px] font-medium text-[#202124] mb-3">Local Businesses</h3>
              <p className="gw-font-text text-[15px] text-[#5f6368] leading-[1.6]">
                Show up in local search and AI Overviews when customers ask for services near them.
              </p>
            </div>
          </div>

          <div className="col-span-1 bg-white hover:bg-gradient-to-br hover:from-white hover:to-[#f6fcf8] rounded-[24px] p-8 lg:p-10 border border-[#e8eaed] shadow-[0_2px_12px_rgba(60,64,67,0.02)] hover:shadow-[0_16px_48px_rgba(52,168,83,0.08)] hover:border-[#ceead6] hover:-translate-y-1.5 transition-all duration-500 group flex flex-col justify-between cursor-default relative overflow-hidden">
            <div className="flex justify-between items-start mb-8">
              <div className="w-[48px] h-[48px] rounded-[14px] bg-[#e6f4ea] flex items-center justify-center text-[#1e8e3e] group-hover:scale-110 group-hover:bg-[#ceead6] transition-all duration-300 border border-[#ceead6]/50">
                <svg className="w-[24px] h-[24px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#e6f4ea] flex items-center justify-center text-[#1e8e3e] opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </div>
            </div>
            <div>
              <h3 className="gw-font-display text-[22px] md:text-[24px] font-medium text-[#202124] mb-3">E-Commerce Stores</h3>
              <p className="gw-font-text text-[15px] text-[#5f6368] leading-[1.6]">
                Get your products recommended by AI systems and featured in high-intent search results.
              </p>
            </div>
          </div>

          <div className="col-span-1 bg-white hover:bg-gradient-to-br hover:from-white hover:to-[#fcfafc] rounded-[24px] p-8 lg:p-10 border border-[#e8eaed] shadow-[0_2px_12px_rgba(60,64,67,0.02)] hover:shadow-[0_16px_48px_rgba(147,52,230,0.08)] hover:border-[#f3e8fd] hover:-translate-y-1.5 transition-all duration-500 group flex flex-col justify-between cursor-default relative overflow-hidden">
            <div className="flex justify-between items-start mb-8">
              <div className="w-[48px] h-[48px] rounded-[14px] bg-[#f3e8fd] flex items-center justify-center text-[#9334e6] group-hover:scale-110 group-hover:bg-[#e9d2fc] transition-all duration-300 border border-[#e9d2fc]/50">
                <svg className="w-[24px] h-[24px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#f3e8fd] flex items-center justify-center text-[#9334e6] opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </div>
            </div>
            <div>
              <h3 className="gw-font-display text-[22px] md:text-[24px] font-medium text-[#202124] mb-3">Agencies & Resellers</h3>
              <p className="gw-font-text text-[15px] text-[#5f6368] leading-[1.6]">
                Expand your services with fully managed, white-label SEO and AI visibility campaigns.
              </p>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 bg-white hover:bg-gradient-to-br hover:from-white hover:to-[#fdf9f9] rounded-[24px] p-8 md:p-10 lg:p-12 border border-[#e8eaed] shadow-[0_2px_12px_rgba(60,64,67,0.02)] hover:shadow-[0_16px_48px_rgba(217,48,37,0.08)] hover:border-[#fad2cf] hover:-translate-y-1.5 transition-all duration-500 group flex flex-col justify-between relative overflow-hidden cursor-default">
            <div className="absolute right-[-2%] bottom-[-15%] opacity-[0.02] group-hover:opacity-[0.05] group-hover:scale-105 transition-all duration-700 pointer-events-none">
               <svg width="240" height="240" viewBox="0 0 24 24" fill="none" stroke="#202124" strokeWidth="1"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
            </div>
            <div className="flex justify-between items-start mb-8 md:mb-12 relative z-10">
              <div className="w-[52px] h-[52px] rounded-[16px] bg-[#fce8e6] flex items-center justify-center text-[#d93025] group-hover:scale-110 group-hover:bg-[#fad2cf] transition-all duration-300 border border-[#fad2cf]/50">
                <svg className="w-[26px] h-[26px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#fce8e6] flex items-center justify-center text-[#d93025] opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </div>
            </div>
            <div className="relative z-10 max-w-[85%]">
              <h3 className="gw-font-display text-[26px] md:text-[30px] font-medium text-[#202124] mb-3">National Brands</h3>
              <p className="gw-font-text text-[16px] md:text-[17px] text-[#5f6368] leading-[1.65]">
                Simplify multi-channel AEO and SEO with data-driven strategies that scale across diverse teams, locations, and highly competitive markets.
              </p>
            </div>
          </div>

          <div className="col-span-1 bg-white hover:bg-gradient-to-br hover:from-white hover:to-[#f8f9fa] rounded-[24px] p-8 md:p-10 lg:p-12 border border-[#e8eaed] shadow-[0_2px_12px_rgba(60,64,67,0.02)] hover:shadow-[0_16px_48px_rgba(95,99,104,0.12)] hover:border-[#dadce0] hover:-translate-y-1.5 transition-all duration-500 group flex flex-col justify-between cursor-default relative overflow-hidden">
            <div className="flex justify-between items-start mb-8 md:mb-12 relative z-10">
              <div className="w-[52px] h-[52px] rounded-[16px] bg-[#f1f3f4] flex items-center justify-center text-[#5f6368] group-hover:scale-110 group-hover:bg-[#e8eaed] transition-all duration-300 border border-[#e8eaed]/50">
                <svg className="w-[26px] h-[26px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#f1f3f4] flex items-center justify-center text-[#5f6368] opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="gw-font-display text-[26px] md:text-[30px] font-medium text-[#202124] mb-3">Franchises</h3>
              <p className="gw-font-text text-[16px] md:text-[17px] text-[#5f6368] leading-[1.65]">
                Manage search visibility for every location consistently from one powerful strategy.
              </p>
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
    <main className="w-full bg-[#fcfcfc] overflow-hidden relative">
      <style>{`
        .bg-dotted-grid {
          background-image: radial-gradient(circle, #d0d7de 1px, transparent 1px);
          background-size: 32px 32px;
        }
        @keyframes floatBlob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: floatBlob 18s infinite alternate ease-in-out;
        }
        .delay-2000 { animation-delay: 2s; }
        .delay-4000 { animation-delay: 4s; }
        @keyframes pulseNode {
          0% { r: 3; opacity: 0.5; }
          50% { r: 4.5; opacity: 1; }
          100% { r: 3; opacity: 0.5; }
        }
        .node-pulse {
          animation: pulseNode 3s infinite ease-in-out;
        }
      `}</style>

      {/* Hero Background Layers */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden pt-[64px]">
        <div className="absolute inset-0 bg-dotted-grid [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] opacity-50" />
        <svg 
          className="absolute inset-0 w-full h-full opacity-[0.15] md:opacity-[0.22] hidden sm:block" 
          viewBox="0 0 1000 600" 
          preserveAspectRatio="xMidYMid slice" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M250 150 L400 220 L500 120 L650 200 L800 150 L850 320 L750 450 L550 380 L450 480 L300 380 Z" stroke="#1a73e8" strokeWidth="0.75" strokeDasharray="4 4" />
          <path d="M400 220 L550 380 M650 200 L750 450 M500 120 L800 150" stroke="#1a73e8" strokeWidth="0.5" opacity="0.4" />
          <circle cx="250" cy="150" r="3" fill="#1a73e8" className="node-pulse" style={{ animationDelay: '0s' }}/>
          <circle cx="400" cy="220" r="4" fill="#1a73e8" />
          <circle cx="500" cy="120" r="3" fill="#1a73e8" className="node-pulse" style={{ animationDelay: '1s' }}/>
          <circle cx="650" cy="200" r="4.5" fill="#1a73e8" />
          <circle cx="800" cy="150" r="3" fill="#1a73e8" className="node-pulse" style={{ animationDelay: '0.5s' }}/>
          <circle cx="850" cy="320" r="4" fill="#1a73e8" />
          <circle cx="750" cy="450" r="3" fill="#1a73e8" className="node-pulse" style={{ animationDelay: '1.5s' }}/>
          <circle cx="550" cy="380" r="5" fill="#1a73e8" />
          <circle cx="450" cy="480" r="3" fill="#1a73e8" className="node-pulse" style={{ animationDelay: '2s' }}/>
          <circle cx="300" cy="380" r="4" fill="#1a73e8" />
        </svg>

        <div className="absolute top-[10%] md:top-[15%] left-[5%] md:left-[15%] w-[300px] md:w-[450px] h-[300px] md:h-[450px] bg-[#1a73e8] rounded-full mix-blend-multiply filter blur-[100px] md:blur-[140px] opacity-[0.10] animate-blob" />
        <div className="absolute top-[20%] md:top-[25%] right-[5%] md:right-[10%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-[#34a853] rounded-full mix-blend-multiply filter blur-[90px] md:blur-[130px] opacity-[0.08] animate-blob delay-2000" />
        <div className="absolute bottom-[5%] left-[20%] md:left-[30%] w-[350px] md:w-[550px] h-[350px] md:h-[550px] bg-[#fbbc04] rounded-full mix-blend-multiply filter blur-[120px] md:blur-[150px] opacity-[0.06] animate-blob delay-4000" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen pt-[64px] flex flex-col items-center justify-center text-center px-4 sm:px-6 pb-16 md:pb-24">
        <div className="flex flex-col items-center justify-center w-full max-w-[1300px] mt-10 md:mt-16 relative">
          
          <h2 className="gw-font-display text-[46px] sm:text-[58px] md:text-[76px] lg:text-[92px] font-medium leading-[1.12] md:leading-[1.08] tracking-[-0.02em] md:tracking-[-0.03em] text-[#202124] mb-8 md:mb-12 w-full">
            Build organic authority <br className="hidden sm:block" />
            <span className="text-[#1a73e8]">with premium PBN backlinks.</span>
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full px-4 sm:px-0 mb-10 md:mb-14 z-20">
            <Link
              to="/pbn/homepage-post"
              className="gw-font-display w-full sm:w-[240px] inline-flex h-[52px] md:h-[56px] items-center justify-center rounded-full bg-[#1a73e8] text-[15px] md:text-[16px] font-medium tracking-[0.2px] text-white shadow-[0_6px_20px_rgba(26,115,232,0.25)] hover:bg-[#1557b0] hover:shadow-[0_8px_28px_rgba(26,115,232,0.35)] transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Explore SEO packages
            </Link>
            <Link
              to="/contact"
              className="gw-font-display w-full sm:w-[240px] inline-flex h-[52px] md:h-[56px] items-center justify-center rounded-full border border-[#dadce0] bg-white/85 backdrop-blur-md text-[15px] md:text-[16px] font-medium tracking-[0.2px] text-[#3c4043] shadow-[0_2px_10px_rgba(60,64,67,0.04)] hover:bg-white hover:border-[#bdc1c6] hover:text-[#202124] transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Talk to an expert
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 px-5 md:px-6 py-3 rounded-[24px] sm:rounded-full bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_32px_rgba(32,33,36,0.06)] relative z-20 transition-transform duration-300 hover:scale-105 cursor-default max-w-[90%] sm:max-w-none">
            <div className="flex -space-x-2 md:-space-x-3">
              <img src="https://i.pravatar.cc/100?img=33" alt="Agency Partner" className="w-[30px] h-[30px] md:w-[34px] md:h-[34px] rounded-full border-2 border-white shadow-sm object-cover" />
              <img src="https://i.pravatar.cc/100?img=11" alt="Agency Partner" className="w-[30px] h-[30px] md:w-[34px] md:h-[34px] rounded-full border-2 border-white shadow-sm object-cover" />
              <img src="https://i.pravatar.cc/100?img=12" alt="Agency Partner" className="w-[30px] h-[30px] md:w-[34px] md:h-[34px] rounded-full border-2 border-white shadow-sm object-cover" />
              <img src="https://i.pravatar.cc/100?img=59" alt="Agency Partner" className="w-[30px] h-[30px] md:w-[34px] md:h-[34px] rounded-full border-2 border-white shadow-sm object-cover" />
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <div className="flex items-center gap-0.5 mb-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-3.5 h-3.5 md:w-3.5 md:h-3.5 text-[#fbbc04]" fill="currentColor" viewBox="0 0 20 20">
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

      {/* --- TRUST METRICS SECTION (NEW) --- */}
      <TrustMetricsSection />

      {/* --- BENTO GRID SECTION --- */}
      <AudienceBentoSection />

    </main>
  );
}
