import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const FALLBACK_BLOGS = [
  {
    id: "blog-1",
    title: "How DA/DR 50+ Homepage PBN Backlinks Drive Page-1 Rankings in 2026",
    slug: "how-da-dr-50-homepage-pbn-backlinks-drive-rankings",
    category: "PBN Strategy",
    readTime: "6 min read",
    author: "SeoHub Technical Team",
    authorRole: "Senior Link Strategist",
    publishedAt: "2026-10-12",
    status: "published",
    featured: true,
    tags: ["DA/DR 50+", "Homepage Links", "Class-C IPs"],
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "Discover why root-level contextual placements on aged, footprint-free .COM and .NET domains remain the fastest catalyst for organic SERP and AI Overview visibility.",
    content: `
      <h2>Why Root-Level Authority Matters More Than Ever</h2>
      <p>Modern search algorithms evaluate both topical relevance and domain-level trust signals. When your target URL receives a dofollow contextual link directly from the homepage of an aged <strong>Moz DA 50+ and Ahrefs DR 50+</strong> domain, the link equity passes with minimal crawl decay.</p>
      <blockquote>Root-level homepage placements pass up to 4x more direct PageRank equity compared to unlinked inner archive pages.</blockquote>
      <h2>Zero-Footprint Network Architecture</h2>
      <p>At Jasa Backlinks (operated by SeoHub Ltd), every domain in our inventory is isolated across independent Class-C IP blocks, unique WHOIS records, and custom CMS themes. This ensures 100% natural link velocity for agencies and enterprise brands.</p>
      <ul>
        <li><strong>Contextual Relevance:</strong> Every placement includes a 400–600 word niche-aligned article.</li>
        <li><strong>Low Outbound Links (OBL):</strong> Strictly capped outbound links preserve maximum PageRank flow.</li>
        <li><strong>White-Label Reporting:</strong> Unbranded Excel and CSV sheets ready for client delivery.</li>
      </ul>
      <h2>Structuring Safe Anchor Text Ratios</h2>
      <p>For optimal results on a 50 to 500 link campaign, we recommend blending 50% branded and URL anchors, 35% partial-match topical anchors, and 15% exact-match commercial anchors.</p>
    `,
  },
  {
    id: "blog-2",
    title: "Dominating Google.co.id: The Complete Guide to Regional .ID & .CO.ID Backlinks",
    slug: "dominating-google-co-id-regional-id-backlinks-guide",
    category: "Regional .ID SEO",
    readTime: "5 min read",
    author: "SeoHub APAC Desk",
    authorRole: "Regional SEO Specialist",
    publishedAt: "2026-10-14",
    status: "published",
    featured: false,
    tags: [".ID Network", "Google.co.id", "Local SERPs"],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "Learn how authentic Indonesian ccTLD placements (.ID, .CO.ID, .WEB.ID) send hyper-local geotargeting signals to conquer Southeast Asian search markets.",
    content: `
      <h2>Why Regional ccTLDs Outperform Generic Links in Local SERPs</h2>
      <p>If you are targeting customers in Indonesia, generic global backlinks alone often plateau on Page 2. Search engines rely heavily on country-code top-level domains (<strong>.ID, .CO.ID, .WEB.ID</strong>) hosted on local Asian IP ranges to validate regional authority.</p>
      <h2>Bilingual Contextual Integration</h2>
      <p>Our .ID Regional Network supports both native Bahasa Indonesia articles and English content, allowing international brands and local enterprises to rank for high-intent commercial keywords on Google.co.id.</p>
      <ul>
        <li><strong>Authentic Registry Extensions:</strong> Verified .ID, .CO.ID, .WEB.ID, and .OR.ID domains.</li>
        <li><strong>Local Hosting Infrastructure:</strong> Geo-distributed across Jakarta and Singapore data centres.</li>
        <li><strong>Fast Indexing:</strong> Crawled daily by regional search bots.</li>
      </ul>
    `,
  },
  {
    id: "blog-3",
    title: "How .EDU & .GOV Authority Backlinks Boost E-E-A-T and AI Overview Citations",
    slug: "edu-gov-backlinks-eeat-ai-overview-citations",
    category: "EDU & GOV Authority",
    readTime: "7 min read",
    author: "SeoHub Research Lab",
    authorRole: "Head of Enterprise SEO",
    publishedAt: "2026-10-16",
    status: "published",
    featured: false,
    tags: [".EDU & .GOV", "AI Overviews", "Institutional Trust"],
    image:
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "Institutional domains (.EDU, .AC.ID, .SCH.ID, .GO.ID) carry unmatched algorithmic trust. Here is how strategic academic placements elevate your brand authority.",
    content: `
      <h2>The Algorithmic Weight of Institutional Domains</h2>
      <p>Academic and government extensions (<strong>.EDU, .AC.ID, .SCH.ID, .GO.ID</strong>) possess decades of natural authority. Both traditional search engines and modern AI answer engines (ChatGPT, Gemini, Perplexity) treat citations from institutional domains as primary trust anchors.</p>
      <h2>When to Deploy EDU & GOV Placements</h2>
      <p>Combining 50 EDU/GOV placements with a foundational layer of Standard PBN Homepage Posts creates an unshakeable authority moat for Finance, SaaS, E-Commerce, and iGaming websites.</p>
    `,
  },
  {
    id: "blog-4",
    title: "Case Study: Scaling a Fintech Brand from Page 3 to Top 3 with 1,050 Mixed Placements",
    slug: "case-study-scaling-fintech-brand-top-3-rankings",
    category: "Case Studies",
    readTime: "8 min read",
    author: "Marcus Vance",
    authorRole: "Enterprise Campaign Lead",
    publishedAt: "2026-10-15",
    status: "published",
    featured: false,
    tags: ["Fintech SEO", "1,050 Links", "+184% Traffic"],
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "A transparent breakdown of anchor text velocity, 14-day drip-feed scheduling, and how combining Homepage Sticky Posts with EDU blogposts unlocked Top-3 rankings.",
    content: `
      <h2>Campaign Baseline & Competitive Bottleneck</h2>
      <p>Our client, a B2B fintech platform, was stuck between positions 18 and 26 for five high-CPC commercial keywords despite strong on-page content. Competitor gap analysis revealed a significant deficit in root-level referring domain authority.</p>
      <h2>The 1,050-Link Execution Blueprint</h2>
      <p>Using the Jasa Backlinks Bulk Cost Calculator, we deployed 1,000 Standard Homepage Posts alongside 50 high-trust EDU PBN Blogposts over a 14-day drip-feed window.</p>
      <ul>
        <li><strong>Week 1:</strong> Branded and naked URL anchors across aged .COM/.ORG homepages.</li>
        <li><strong>Week 2:</strong> Partial-match commercial anchors reinforced by DA 50+ EDU contextual posts.</li>
        <li><strong>Week 4 Result:</strong> Ahrefs DR jumped from 34 to 56, with 4 of 5 primary keywords entering the Top 3.</li>
      </ul>
    `,
  },
  {
    id: "blog-5",
    title: "Sidebar Blogroll vs. Contextual Homepage Posts: Which Link Type Should You Choose?",
    slug: "sidebar-blogroll-vs-contextual-homepage-posts-comparison",
    category: "PBN Strategy",
    readTime: "5 min read",
    author: "SeoHub Technical Team",
    authorRole: "Senior Link Strategist",
    publishedAt: "2026-10-11",
    status: "published",
    featured: false,
    tags: ["Sidebar Blogroll", "Link Juice", "DR Boost"],
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "Understand the exact technical differences between sitewide sidebar widget links and pinned homepage contextual articles—and how to blend both safely.",
    content: `
      <h2>How Contextual Homepage Posts Work</h2>
      <p>Contextual homepage posts embed your link inside a 400–600 word niche article. Search engines parse the surrounding semantic text to understand exactly what keywords your target page should rank for.</p>
      <h2>How Sitewide Sidebar Blogrolls Work</h2>
      <p>Sidebar blogroll placements appear across the homepage and indexed inner pages of an authority domain, pumping raw Domain Rating (DR) and crawler discovery power into your root domain.</p>
      <blockquote>Best Practice: Use Contextual Homepage Posts for inner money pages and Sidebar Blogrolls with branded anchors to lift your root domain authority.</blockquote>
    `,
  },
  {
    id: "blog-6",
    title: "White-Label Link Building for SEO Agencies: How to Automate Client Reporting",
    slug: "white-label-link-building-for-seo-agencies-guide",
    category: "Case Studies",
    readTime: "6 min read",
    author: "SeoHub Agency Desk",
    authorRole: "Head of Partner Success",
    publishedAt: "2026-10-10",
    status: "published",
    featured: false,
    tags: ["White-Label", "Agency Scaling", "Wholesale PBN"],
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "See how 500+ digital marketing agencies use our unbranded Excel tracking sheets and multi-URL splitting to fulfil client SEO retainers at wholesale margins.",
    content: `
      <h2>Eliminating Manual Outreach Bottlenecks</h2>
      <p>For growing SEO agencies, manual guest post outreach is unpredictable and expensive. Jasa Backlinks provides instant wholesale access to verified DA/DR 50+ inventory starting at $1.00 per placement.</p>
      <h2>100% Unbranded White-Label Deliverables</h2>
      <p>Every order completed through our portal generates a clean, unbranded report containing live placement URLs, target anchors, and verified domain metrics that you can send directly to your clients under your own agency brand.</p>
    `,
  },
];

// Category Visual Theme Mapping (Matches Google Workspace 4-Colour System)
const CATEGORY_STYLES = {
  "PBN Strategy": {
    badge: "bg-[#e8f0fe] text-[#1a73e8] border-[#d2e3fc]",
    topBar: "bg-[#1a73e8]",
    dot: "bg-[#1a73e8]",
  },
  "Regional .ID SEO": {
    badge: "bg-[#fce8e6] text-[#d93025] border-[#fad2cf]",
    topBar: "bg-[#ea4335]",
    dot: "bg-[#ea4335]",
  },
  "EDU & GOV Authority": {
    badge: "bg-[#f3e8fd] text-[#9334e6] border-[#e9d2fc]",
    topBar: "bg-[#9334e6]",
    dot: "bg-[#9334e6]",
  },
  "Case Studies": {
    badge: "bg-[#e6f4ea] text-[#1e8e3e] border-[#ceead6]",
    topBar: "bg-[#34a853]",
    dot: "bg-[#34a853]",
  },
};

function getCategoryStyle(category) {
  return (
    CATEGORY_STYLES[category] || {
      badge: "bg-[#e8f0fe] text-[#1a73e8] border-[#d2e3fc]",
      topBar: "bg-[#1a73e8]",
      dot: "bg-[#1a73e8]",
    }
  );
}

function getAuthorInitials(name = "SeoHub Team") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Blog() {
  const [blogs, setBlogs] = useState(FALLBACK_BLOGS);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/api/blogs`);
        if (Array.isArray(data) && data.length > 0) {
          // Merge API blogs with fallback blogs so the grid always looks rich & complete
          const apiSlugs = new Set(data.map((b) => b.slug));
          const merged = [
            ...data,
            ...FALLBACK_BLOGS.filter((fb) => !apiSlugs.has(fb.slug)),
          ];
          setBlogs(merged);
          localStorage.setItem("jasa_blogs_cache", JSON.stringify(merged));
        }
      } catch {
        const cached = localStorage.getItem("jasa_blogs_cache");
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setBlogs(parsed);
            }
          } catch {
            setBlogs(FALLBACK_BLOGS);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const categories = [
    "All",
    "PBN Strategy",
    "Regional .ID SEO",
    "EDU & GOV Authority",
    "Case Studies",
  ];

  const getCategoryCount = (cat) => {
    if (cat === "All") return blogs.length;
    return blogs.filter((b) => b.category === cat).length;
  };

  const filteredBlogs = blogs.filter((post) => {
    const matchesCategory =
      activeCategory === "All" || post.category === activeCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.category.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const featuredPost =
    filteredBlogs.find((b) => b.featured) || filteredBlogs[0];

  const sidePickPosts = filteredBlogs
    .filter((b) => !featuredPost || b.id !== featuredPost.id)
    .slice(0, 2);

  const showEditorialHero =
    activeCategory === "All" && !searchQuery.trim() && featuredPost;

  const mainGridPosts = showEditorialHero
    ? filteredBlogs.filter((b) => b.id !== featuredPost.id)
    : filteredBlogs;

  return (
    <main className="w-full bg-[#fcfcfc] relative overflow-x-clip pt-[68px] sm:pt-[80px] pb-16">
      <style>{`
        .bg-dotted-grid { background-image: radial-gradient(circle, #d0d7de 1px, transparent 1px); background-size: 28px 28px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* --- 1. EDITORIAL HERO HEADER --- */}
      <section className="relative w-full bg-white pt-8 pb-7 sm:py-14 lg:py-16 px-4 sm:px-6 border-b border-[#e8eaed] overflow-hidden">
        <div className="absolute inset-0 bg-dotted-grid [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] opacity-45 pointer-events-none" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[260px] bg-gradient-to-r from-[#e8f0fe]/60 via-[#e6f4ea]/40 to-[#fef7e0]/50 blur-[80px] pointer-events-none" />

        <div className="max-w-[1200px] mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f8f9fa] border border-[#dadce0] shadow-[0_2px_6px_rgba(60,64,67,0.04)] mb-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
              <span className="w-2 h-2 rounded-full bg-[#EA4335]" />
              <span className="w-2 h-2 rounded-full bg-[#FBBC04]" />
              <span className="w-2 h-2 rounded-full bg-[#34A853]" />
            </span>
            <span className="gw-font-text text-[11.5px] sm:text-[13px] font-medium text-[#3c4043]">
              Jasa Backlinks Engineering & SEO Research Hub
            </span>
          </div>

          <h2 className="gw-font-display text-[28px] sm:text-[44px] md:text-[54px] font-medium text-[#202124] leading-[1.12] tracking-[-0.025em] max-w-[840px] mx-auto mb-3.5">
            Actionable intelligence on{" "}
            <span className="text-[#1a73e8]">authority link building.</span>
          </h2>

          <p className="gw-font-text text-[14.5px] sm:text-[16.5px] md:text-[17.5px] text-[#5f6368] max-w-[680px] mx-auto leading-[1.6] mb-6">
            Deep-dive technical guides on DA/DR 50+ PBN architecture, regional
            .ID SERP domination, institutional .EDU/.GOV citations, and AI
            Overview optimisation.
          </p>

          {/* Editorial Trust Metrics Pills */}
          <div className="flex items-center sm:justify-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
            {[
              "✓ Lab-Tested Link Strategies",
              "✓ Verified DA/DR 50+ Case Studies",
              "✓ Google.co.id & Global SERPs",
              "✓ Published by SeoHub Ltd Engineers",
            ].map((pill, i) => (
              <span
                key={i}
                className="text-[11.5px] sm:text-[12px] font-medium text-[#3c4043] bg-[#f8f9fa] border border-[#e8eaed] px-3 py-1 rounded-full whitespace-nowrap shrink-0"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* --- 2. STICKY FILTER, SEARCH & VIEW MODE COMMAND BAR --- */}
      <div className="sticky top-[62px] sm:top-[74px] z-30 bg-white/95 backdrop-blur-md border-b border-[#e8eaed] shadow-[0_4px_16px_rgba(60,64,67,0.04)] px-3.5 sm:px-6 py-3">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
          {/* Category Filter Pills with Article Count */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 md:pb-0">
            {categories.map((cat) => {
              const active = activeCategory === cat;
              const count = getCategoryCount(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 sm:py-2 rounded-full text-[12px] sm:text-[12.5px] font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    active
                      ? "bg-[#1a73e8] text-white shadow-xs"
                      : "bg-[#f8f9fa] text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4] border border-[#e8eaed]"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10.5px] px-1.5 py-0.2 rounded-full ${
                      active
                        ? "bg-white/20 text-white font-semibold"
                        : "bg-white text-[#5f6368] border border-[#dadce0]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Controls: Search Input + Grid/List Toggle */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-[260px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guides, .ID, EDU, DR 50+..."
                className="w-full pl-9 pr-8 py-1.5 sm:py-2 bg-[#f8f9fa] focus:bg-white border border-[#dadce0] rounded-full text-[13px] text-[#202124] focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#e8f0fe] transition-all"
              />
              <svg
                className="w-4 h-4 text-[#5f6368] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5f6368] hover:text-[#202124] p-0.5 cursor-pointer"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Grid vs List Layout Switcher (Desktop/Tablet) */}
            <div className="hidden sm:inline-flex items-center bg-[#f8f9fa] p-1 rounded-full border border-[#dadce0]">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                title="Grid View"
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-[#1a73e8] shadow-2xs"
                    : "text-[#5f6368] hover:text-[#202124]"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                title="Editorial List View"
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  viewMode === "list"
                    ? "bg-white text-[#1a73e8] shadow-2xs"
                    : "text-[#5f6368] hover:text-[#202124]"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- 3. MAIN BLOG CONTENT AREA --- */}
      <section className="w-full py-8 sm:py-12 lg:py-14 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-[24px] border border-[#e8eaed] p-5 h-[380px] animate-pulse flex flex-col justify-between"
                >
                  <div className="h-[180px] bg-[#f1f3f4] rounded-[16px]" />
                  <div className="space-y-3">
                    <div className="h-4 w-1/3 bg-[#f1f3f4] rounded" />
                    <div className="h-6 w-full bg-[#f1f3f4] rounded" />
                    <div className="h-4 w-4/5 bg-[#f1f3f4] rounded" />
                  </div>
                  <div className="h-8 w-full bg-[#f1f3f4] rounded" />
                </div>
              ))}
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="bg-white rounded-[24px] border border-[#dadce0] p-10 text-center max-w-[520px] mx-auto shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <h2 className="gw-font-display text-[20px] font-medium text-[#202124] mb-1.5">
                No matching SEO articles found
              </h2>
              <p className="text-[13.5px] text-[#5f6368] mb-5">
                We couldn&apos;t find any guides matching &ldquo;{searchQuery}
                &rdquo; in {activeCategory}.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory("All");
                  setSearchQuery("");
                }}
                className="gw-font-display px-6 py-2.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-[13.5px] font-medium cursor-pointer transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              {/* =========================================================
                  EDITORIAL BENTO TOP SHOWCASE (FEATURED + TRENDING PICKS)
                  ========================================================= */}
              {showEditorialHero && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10 sm:mb-14 items-stretch">
                  {/* LEFT 7 COLUMNS: FLAGSHIP FEATURED GUIDE */}
                  <Link
                    to={`/blog/${featuredPost.slug}`}
                    className="lg:col-span-7 group bg-white rounded-[24px] sm:rounded-[28px] border border-[#dadce0] shadow-[0_8px_30px_rgba(60,64,67,0.05)] hover:shadow-[0_18px_48px_rgba(26,115,232,0.11)] hover:border-[#1a73e8] transition-all duration-300 overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Google 4-Colour Top Strip */}
                      <div className="grid grid-cols-4 h-[4px] w-full">
                        <div className="bg-[#4285F4]" />
                        <div className="bg-[#EA4335]" />
                        <div className="bg-[#FBBC04]" />
                        <div className="bg-[#34A853]" />
                      </div>

                      <div className="relative h-[230px] sm:h-[310px] w-full bg-[#f1f3f4] overflow-hidden">
                        <img
                          src={featuredPost.image}
                          alt={featuredPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#202124]/60 via-transparent to-transparent" />

                        <div className="absolute top-4 left-4 flex items-center gap-2">
                          <span className="bg-[#1a73e8] text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            Featured Research
                          </span>
                          <span className="bg-white/95 backdrop-blur-xs text-[#202124] text-[11px] font-semibold px-3 py-1 rounded-full">
                            {featuredPost.category}
                          </span>
                        </div>

                        <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-white/95 text-[12px] font-medium">
                          <span>Published {featuredPost.publishedAt}</span>
                          <span className="bg-[#202124]/75 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                            ⏱ {featuredPost.readTime}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 sm:p-7 lg:p-8">
                        <h2 className="gw-font-display text-[22px] sm:text-[27px] lg:text-[30px] font-medium text-[#202124] group-hover:text-[#1a73e8] transition-colors leading-[1.2] mb-3">
                          {featuredPost.title}
                        </h2>

                        <p className="gw-font-text text-[14px] sm:text-[15.5px] text-[#5f6368] leading-[1.65] mb-5">
                          {featuredPost.excerpt}
                        </p>

                        {/* Topic Pills */}
                        {Array.isArray(featuredPost.tags) && (
                          <div className="flex flex-wrap items-center gap-1.5">
                            {featuredPost.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-[11px] font-medium text-[#5f6368] bg-[#f8f9fa] border border-[#e8eaed] px-2.5 py-0.5 rounded-md"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="px-5 py-4 sm:px-8 sm:py-5 bg-[#f8fbff] border-t border-[#e8eaed] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#e8f0fe] text-[#1a73e8] border border-[#d2e3fc] font-bold text-[12px] flex items-center justify-center shrink-0">
                          {getAuthorInitials(featuredPost.author)}
                        </div>
                        <div>
                          <span className="block text-[13px] font-semibold text-[#202124] leading-tight">
                            {featuredPost.author}
                          </span>
                          <span className="block text-[11.5px] text-[#5f6368]">
                            {featuredPost.authorRole || "SeoHub Editorial Team"}
                          </span>
                        </div>
                      </div>

                      <span className="gw-font-display inline-flex items-center gap-1.5 text-[13px] sm:text-[13.5px] font-semibold text-white bg-[#1a73e8] group-hover:bg-[#1557b0] px-4 py-2 rounded-full shadow-xs transition-all">
                        <span>Read Study</span>
                        <span className="group-hover:translate-x-0.5 transition-transform">
                          →
                        </span>
                      </span>
                    </div>
                  </Link>

                  {/* RIGHT 5 COLUMNS: EDITOR'S PICKS + INSTANT CALCULATOR CTA */}
                  <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                    <div className="bg-white rounded-[24px] border border-[#e8eaed] p-5 sm:p-6 shadow-[0_4px_20px_rgba(60,64,67,0.04)] flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#f1f3f4]">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#34a853]" />
                            <h2 className="gw-font-display text-[16px] sm:text-[17px] font-medium text-[#202124]">
                              Trending Technical Guides
                            </h2>
                          </div>
                          <span className="text-[11px] font-semibold text-[#1a73e8] bg-[#e8f0fe] px-2.5 py-0.5 rounded-full">
                            Editor&apos;s Picks
                          </span>
                        </div>

                        <div className="space-y-3.5">
                          {sidePickPosts.map((pick, i) => {
                            const style = getCategoryStyle(pick.category);
                            return (
                              <Link
                                key={pick.id}
                                to={`/blog/${pick.slug}`}
                                className="group flex items-start gap-3.5 p-3 rounded-[16px] bg-[#f8f9fa] hover:bg-[#f8fbff] border border-[#e8eaed] hover:border-[#d2e3fc] transition-all"
                              >
                                <img
                                  src={pick.image}
                                  alt={pick.title}
                                  loading="lazy"
                                  className="w-20 h-20 sm:w-22 sm:h-22 rounded-[12px] object-cover shrink-0 border border-[#e8eaed]"
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span
                                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${style.badge}`}
                                    >
                                      {pick.category}
                                    </span>
                                    <span className="text-[11px] text-[#5f6368]">
                                      {pick.readTime}
                                    </span>
                                  </div>
                                  <h2 className="gw-font-display text-[14px] sm:text-[15px] font-medium text-[#202124] group-hover:text-[#1a73e8] transition-colors line-clamp-2 leading-snug mb-1">
                                    {pick.title}
                                  </h2>
                                  <span className="text-[11.5px] font-semibold text-[#1a73e8] inline-flex items-center gap-1">
                                    Read Guide #{i + 2} →
                                  </span>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>

                      {/* Quick Topic Filter Tags */}
                      <div className="mt-4 pt-3.5 border-t border-[#f1f3f4]">
                        <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#5f6368] mb-2">
                          Popular Research Topics
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            "DA/DR 50+ PBN",
                            "Google.co.id .ID",
                            ".AC.ID & .GO.ID",
                            "Anchor Ratios",
                            "White-Label SEO",
                          ].map((topic) => (
                            <button
                              key={topic}
                              type="button"
                              onClick={() =>
                                setSearchQuery(topic.split(" ")[0])
                              }
                              className="text-[11px] font-medium text-[#3c4043] hover:text-[#1a73e8] bg-[#f8f9fa] hover:bg-[#e8f0fe] border border-[#e8eaed] px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                            >
                              {topic}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Mini Interactive Calculator CTA Card */}
                    <div className="bg-gradient-to-r from-[#1a73e8] to-[#1557b0] rounded-[22px] p-5 text-white shadow-[0_10px_28px_rgba(26,115,232,0.22)] flex items-center justify-between gap-4">
                      <div>
                        <span className="inline-block text-[10.5px] font-semibold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full mb-1">
                          Self-Serve Portal
                        </span>
                        <h2 className="gw-font-display text-[17px] sm:text-[18px] font-medium leading-snug">
                          Ready to launch your campaign?
                        </h2>
                        <p className="text-[12px] text-white/85 mt-0.5">
                          Calculate bulk pricing from 50 to 5,000+ links in real
                          time.
                        </p>
                      </div>
                      <Link
                        to="/#estimator"
                        className="gw-font-display shrink-0 px-4 py-2.5 rounded-full bg-white text-[#1a73e8] hover:bg-[#f8f9fa] text-[12.5px] font-semibold shadow-xs transition-all"
                      >
                        Calculator →
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Section Sub-Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h2 className="gw-font-display text-[22px] sm:text-[26px] font-medium text-[#202124]">
                    {activeCategory === "All"
                      ? searchQuery
                        ? `Search Results (${mainGridPosts.length})`
                        : "Latest SEO Guides & Case Studies"
                      : `${activeCategory} Articles (${mainGridPosts.length})`}
                  </h2>
                  <p className="text-[13px] text-[#5f6368]">
                    Written and peer-reviewed by technical SEO specialists at
                    SeoHub Ltd.
                  </p>
                </div>

                {(activeCategory !== "All" || searchQuery) && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCategory("All");
                      setSearchQuery("");
                    }}
                    className="text-[12.5px] font-semibold text-[#1a73e8] hover:underline self-start sm:self-auto cursor-pointer"
                  >
                    ← Back to All Articles
                  </button>
                )}
              </div>

              {/* =========================================================
                  ARTICLES DISPLAY (GRID VIEW OR EDITORIAL LIST VIEW)
                  ========================================================= */}
              {viewMode === "list" ? (
                <div className="space-y-4">
                  {mainGridPosts.map((post) => {
                    const style = getCategoryStyle(post.category);
                    return (
                      <Link
                        key={post.id}
                        to={`/blog/${post.slug}`}
                        className="group bg-white rounded-[22px] border border-[#e8eaed] hover:border-[#1a73e8] shadow-[0_2px_10px_rgba(60,64,67,0.03)] hover:shadow-[0_12px_32px_rgba(26,115,232,0.08)] transition-all p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center gap-5"
                      >
                        <div className="w-full md:w-[260px] h-[180px] md:h-[155px] rounded-[16px] overflow-hidden bg-[#f1f3f4] shrink-0 relative">
                          <img
                            src={post.image}
                            alt={post.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2.5 text-[12px] text-[#5f6368] mb-2">
                            <span
                              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${style.badge}`}
                            >
                              {post.category}
                            </span>
                            <span>{post.publishedAt}</span>
                            <span>•</span>
                            <span>⏱ {post.readTime}</span>
                          </div>

                          <h2 className="gw-font-display text-[19px] sm:text-[21px] font-medium text-[#202124] group-hover:text-[#1a73e8] transition-colors leading-snug mb-2">
                            {post.title}
                          </h2>

                          <p className="gw-font-text text-[13.5px] sm:text-[14px] text-[#5f6368] line-clamp-2 leading-[1.6] mb-3">
                            {post.excerpt}
                          </p>

                          <div className="flex items-center justify-between pt-2 border-t border-[#f1f3f4]">
                            <span className="text-[12px] font-medium text-[#3c4043]">
                              By {post.author}
                            </span>
                            <span className="text-[13px] font-semibold text-[#1a73e8] group-hover:translate-x-1 transition-transform">
                              Read Full Article →
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                  {mainGridPosts.map((post) => {
                    const style = getCategoryStyle(post.category);
                    return (
                      <Link
                        key={post.id}
                        to={`/blog/${post.slug}`}
                        className="group bg-white rounded-[22px] sm:rounded-[24px] border border-[#e8eaed] hover:border-[#d2e3fc] shadow-[0_2px_12px_rgba(60,64,67,0.04)] hover:shadow-[0_16px_40px_rgba(26,115,232,0.09)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                      >
                        <div>
                          {/* Category Colour Top Accent Bar */}
                          <div className={`h-[4px] w-full ${style.topBar}`} />

                          {/* Cover Image + Floating Badges */}
                          <div className="h-[195px] w-full bg-[#f1f3f4] overflow-hidden relative">
                            <img
                              src={post.image}
                              alt={post.title}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#202124]/45 via-transparent to-transparent opacity-80" />

                            <span
                              className={`absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full border shadow-2xs backdrop-blur-xs bg-white/95 ${style.badge}`}
                            >
                              {post.category}
                            </span>

                            <span className="absolute bottom-2.5 right-3 bg-[#202124]/80 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full">
                              ⏱ {post.readTime}
                            </span>
                          </div>

                          {/* Card Body */}
                          <div className="p-5 sm:p-6">
                            <div className="flex items-center gap-2 text-[11.5px] text-[#5f6368] mb-2">
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${style.dot}`}
                              />
                              <span>Published {post.publishedAt}</span>
                            </div>

                            <h2 className="gw-font-display text-[18px] sm:text-[20px] font-medium text-[#202124] group-hover:text-[#1a73e8] transition-colors leading-[1.3] mb-2.5 line-clamp-2">
                              {post.title}
                            </h2>

                            <p className="gw-font-text text-[13.5px] text-[#5f6368] leading-[1.6] line-clamp-3 mb-4">
                              {post.excerpt}
                            </p>

                            {Array.isArray(post.tags) && (
                              <div className="flex flex-wrap gap-1.5">
                                {post.tags.slice(0, 3).map((t, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[10.5px] font-medium text-[#5f6368] bg-[#f8f9fa] border border-[#e8eaed] px-2 py-0.5 rounded"
                                  >
                                    #{t}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Card Footer with Author Initials & Action */}
                        <div className="px-5 py-3.5 sm:px-6 sm:py-4 bg-[#f8f9fa]/70 border-t border-[#f1f3f4] flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-full bg-[#e8f0fe] text-[#1a73e8] font-bold text-[10.5px] flex items-center justify-center shrink-0 border border-[#d2e3fc]">
                              {getAuthorInitials(post.author)}
                            </div>
                            <div className="min-w-0">
                              <span className="block text-[12px] font-semibold text-[#202124] truncate">
                                {post.author}
                              </span>
                            </div>
                          </div>

                          <span className="w-8 h-8 rounded-full bg-white group-hover:bg-[#1a73e8] text-[#1a73e8] group-hover:text-white border border-[#dadce0] group-hover:border-[#1a73e8] flex items-center justify-center transition-all shrink-0">
                            →
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* --- 4. BOTTOM ENTERPRISE SEO & CALCULATOR CTA SECTION --- */}
      <section className="w-full px-4 sm:px-6 pt-4">
        <div className="max-w-[1200px] mx-auto bg-white rounded-[24px] sm:rounded-[28px] border border-[#dadce0] shadow-[0_12px_36px_rgba(60,64,67,0.06)] overflow-hidden relative">
          <div className="grid grid-cols-4 h-[4px] w-full">
            <div className="bg-[#4285F4]" />
            <div className="bg-[#EA4335]" />
            <div className="bg-[#FBBC04]" />
            <div className="bg-[#34A853]" />
          </div>

          <div className="p-6 sm:p-10 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left max-w-[640px]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f0fe] text-[#1a73e8] text-[11.5px] font-semibold mb-3">
                Turn SEO Strategy into Rankings
              </span>
              <h2 className="gw-font-display text-[24px] sm:text-[32px] lg:text-[36px] font-medium text-[#202124] leading-[1.15] mb-2.5">
                Put these authority link strategies{" "}
                <span className="text-[#1a73e8]">into action today.</span>
              </h2>
              <p className="gw-font-text text-[14px] sm:text-[15.5px] text-[#5f6368] leading-[1.6]">
                Configure your custom mix of DA/DR 50+ Homepage Posts, Regional
                .ID links, and institutional .EDU/.GOV placements with instant
                white-label reporting.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
              <Link
                to="/#estimator"
                className="gw-font-display w-full sm:w-auto px-7 h-[48px] sm:h-[50px] rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-[14.5px] font-medium shadow-[0_6px_20px_rgba(26,115,232,0.25)] flex items-center justify-center transition-all"
              >
                Open Bulk Calculator →
              </Link>
              <Link
                to="/services"
                className="gw-font-display w-full sm:w-auto px-6 h-[48px] sm:h-[50px] rounded-full border border-[#dadce0] bg-white hover:bg-[#f8f9fa] text-[#202124] text-[14.5px] font-medium flex items-center justify-center transition-all"
              >
                Explore All 12 Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}