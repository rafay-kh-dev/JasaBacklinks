import { Link, useParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { FALLBACK_BLOGS } from "./Blog";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const CATEGORY_STYLES = {
  "PBN Strategy": {
    badge: "bg-[#e8f0fe] text-[#1a73e8] border-[#d2e3fc]",
    accent: "bg-[#1a73e8]",
  },
  "Regional .ID SEO": {
    badge: "bg-[#fce8e6] text-[#d93025] border-[#fad2cf]",
    accent: "bg-[#ea4335]",
  },
  "EDU & GOV Authority": {
    badge: "bg-[#f3e8fd] text-[#9334e6] border-[#e9d2fc]",
    accent: "bg-[#9334e6]",
  },
  "Case Studies": {
    badge: "bg-[#e6f4ea] text-[#1e8e3e] border-[#ceead6]",
    accent: "bg-[#34a853]",
  },
};

function getCategoryStyle(category) {
  return (
    CATEGORY_STYLES[category] || {
      badge: "bg-[#e8f0fe] text-[#1a73e8] border-[#d2e3fc]",
      accent: "bg-[#1a73e8]",
    }
  );
}

export default function BlogPost() {
  const { slug } = useParams();
  return <BlogPostContent key={slug} slug={slug} />;
}

function BlogPostContent({ slug }) {
  const [post, setPost] = useState(null);
  const [allBlogs, setAllBlogs] = useState(FALLBACK_BLOGS);
  const [isLoading, setIsLoading] = useState(true);

  // Reading UX States
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeHeadingId, setActiveHeadingId] = useState("");
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Sidebar Mini-Estimator State
  const [quickService, setQuickService] = useState({
    name: "Homepage Post (.COM/.NET)",
    price: 1.0,
    slug: "homepage-post",
  });
  const [quickQty, setQuickQty] = useState(100);

  const quickServicesList = [
    { name: "Homepage Post (DA 50+)", price: 1.0, slug: "homepage-post" },
    { name: "Sidebar Blogroll (DA 50+)", price: 2.0, slug: "sidebar-blogroll" },
    { name: ".ID Homepage Post", price: 2.0, slug: "id-homepage-post" },
    { name: "EDU PBN Blogpost", price: 3.0, slug: "edu-pbn-blogpost" },
    { name: "EDU & GOV Backlink", price: 20.0, slug: "edu-gov-backlink" },
  ];

  // Fetch Article & Merge with Fallback Catalogue
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const loadArticle = async () => {
      setIsLoading(true);
      let combinedList = [...FALLBACK_BLOGS];

      try {
        const { data } = await axios.get(`${BACKEND_URL}/api/blogs`);
        if (Array.isArray(data) && data.length > 0) {
          const apiSlugs = new Set(data.map((b) => b.slug));
          combinedList = [
            ...data,
            ...FALLBACK_BLOGS.filter((fb) => !apiSlugs.has(fb.slug)),
          ];
          localStorage.setItem(
            "jasa_blogs_cache",
            JSON.stringify(combinedList),
          );
        }
      } catch {
        const cached = localStorage.getItem("jasa_blogs_cache");
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              combinedList = parsed;
            }
          } catch {
            combinedList = FALLBACK_BLOGS;
          }
        }
      }

      setAllBlogs(combinedList);
      const matched =
        combinedList.find(
          (b) => b.slug?.toLowerCase() === slug?.toLowerCase(),
        ) || combinedList[0];

      setPost(matched);
      setIsLoading(false);
    };

    loadArticle();
  }, [slug]);

  // Parse H2 & H3 Headings for Interactive Table of Contents & Inject IDs
  const { processedHtml, tocHeadings, wordCount } = useMemo(() => {
    if (!post || !post.content) {
      return { processedHtml: "", tocHeadings: [], wordCount: 0 };
    }

    const headings = [];
    let index = 0;

    const htmlWithIds = post.content.replace(
      /<(h[23])([^>]*)>(.*?)<\/\1>/gi,
      (fullMatch, tag, attrs, innerHtml) => {
        const cleanText = innerHtml.replace(/<[^>]+>/g, "").trim();
        const generatedId = `section-${index++}-${cleanText
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
          .slice(0, 36)}`;

        headings.push({
          id: generatedId,
          text: cleanText,
          level: tag.toLowerCase() === "h3" ? 3 : 2,
        });

        return `<${tag}${attrs} id="${generatedId}">${innerHtml}</${tag}>`;
      },
    );

    const plainText = post.content
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const words = plainText ? plainText.split(" ").length : 0;

    return {
      processedHtml: htmlWithIds,
      tocHeadings: headings,
      wordCount: words,
    };
  }, [post]);

  // Reading Progress Bar & Active Section Spy on Scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct =
        docHeight > 0
          ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100))
          : 0;
      setReadingProgress(pct);

      if (tocHeadings.length > 0) {
        let currentId = tocHeadings[0].id;
        for (const h of tocHeadings) {
          const el = document.getElementById(h.id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 150) {
              currentId = h.id;
            }
          }
        }
        setActiveHeadingId(currentId);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tocHeadings]);

  const scrollToHeading = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveHeadingId(id);
      setIsMobileTocOpen(false);
    }
  };

  const handleCopyUrl = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (isLoading || !post) {
    return (
      <main className="w-full min-h-[75vh] bg-[#fcfcfc] pt-[56px] px-4">
        <div className="max-w-[1140px] mx-auto animate-pulse space-y-6">
          <div className="h-6 w-48 bg-[#e8eaed] rounded-full" />
          <div className="h-12 w-4/5 bg-[#e8eaed] rounded-2xl" />
          <div className="h-[340px] w-full bg-[#e8eaed] rounded-[24px]" />
        </div>
      </main>
    );
  }

  const catStyle = getCategoryStyle(post.category);
  const currentIndex = allBlogs.findIndex((b) => b.id === post.id);
  const prevPost = currentIndex > 0 ? allBlogs[currentIndex - 1] : null;
  const nextPost =
    currentIndex >= 0 && currentIndex < allBlogs.length - 1
      ? allBlogs[currentIndex + 1]
      : null;
  const relatedPosts = allBlogs.filter((b) => b.id !== post.id).slice(0, 3);

  const shareUrl =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.href)
      : "";
  const shareTitle = encodeURIComponent(post.title);
  const effectiveSeoTitle = `${
    post.seoTitle || post.title
  } | Jasa Backlinks Blog`;
  const seoDescription = post.excerpt || post.title;
  const siteOrigin = (
    import.meta.env.VITE_SITE_URL ||
    (typeof window !== "undefined"
      ? window.location.origin
      : "https://www.jasabacklinks.net")
  ).replace(/\/$/, "");
  const articleUrl = `${siteOrigin}/blog/${post.slug}`;
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    headline: post.seoTitle || post.title,
    description: seoDescription,
    image: post.image ? [post.image] : [],
    datePublished: post.publishedAt || "2026-10-16",
    dateModified: post.publishedAt || "2026-10-16",
    wordCount: wordCount || 450,
    keywords: Array.isArray(post.tags)
      ? post.tags.join(", ")
      : post.focusKeyword || "PBN Backlinks, SEO",
    author: {
      "@type": "Person",
      name: post.author || "SeoHub Technical Team",
      jobTitle: post.authorRole || "Senior Link Strategist",
    },
    publisher: {
      "@type": "Organization",
      name: "Jasa Backlinks (SeoHub Ltd)",
      url: siteOrigin,
    },
  };

  return (
    <main className="w-full bg-[#fcfcfc] relative overflow-x-clip pt-[56px] pb-20">
      <Helmet prioritizeSeoTags>
        <title>{effectiveSeoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={effectiveSeoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:url" content={articleUrl} />
        {post.image && <meta property="og:image" content={post.image} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={effectiveSeoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        {post.image && <meta name="twitter:image" content={post.image} />}
        <script id="jasa-blogpost-schema" type="application/ld+json">
          {JSON.stringify(blogSchema).replace(/</g, "\\u003c")}
        </script>
      </Helmet>
      {/* --- FIXED TOP READING PROGRESS BAR --- */}
      <div className="fixed top-[60px] sm:top-[68px] left-0 right-0 h-[3.5px] bg-[#e8eaed]/70 z-40 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#4285F4] via-[#34A853] to-[#1a73e8] transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <style>{`
        .bg-dotted-grid { background-image: radial-gradient(circle, #d0d7de 1px, transparent 1px); background-size: 28px 28px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .article-body {
          font-family: 'Google Sans Text', Roboto, -apple-system, sans-serif;
          color: #3c4043;
          font-size: 16.5px;
          line-height: 1.85;
        }
        .article-body h2 {
          font-family: 'Google Sans', Roboto, sans-serif;
          font-size: 24px;
          font-weight: 500;
          color: #202124;
          margin-top: 38px;
          margin-bottom: 14px;
          line-height: 1.25;
          letter-spacing: -0.015em;
          padding-bottom: 8px;
          border-bottom: 1px solid #f1f3f4;
        }
        .article-body h3 {
          font-family: 'Google Sans', Roboto, sans-serif;
          font-size: 19px;
          font-weight: 500;
          color: #202124;
          margin-top: 28px;
          margin-bottom: 10px;
          line-height: 1.3;
        }
        .article-body p {
          margin-bottom: 20px;
        }
        .article-body strong {
          color: #202124;
          font-weight: 600;
        }
        .article-body ul, .article-body ol {
          margin-top: 14px;
          margin-bottom: 24px;
          padding-left: 22px;
          background: #f8f9fa;
          border: 1px solid #e8eaed;
          border-radius: 16px;
          padding: 18px 22px 18px 36px;
        }
        .article-body ul { list-style-type: disc; }
        .article-body ol { list-style-type: decimal; }
        .article-body li {
          margin-bottom: 10px;
          line-height: 1.65;
          color: #3c4043;
        }
        .article-body li:last-child { margin-bottom: 0; }
        .article-body blockquote {
          background: linear-gradient(to right, #f8fbff, #ffffff);
          border-left: 4px solid #1a73e8;
          border-top: 1px solid #d2e3fc;
          border-right: 1px solid #d2e3fc;
          border-bottom: 1px solid #d2e3fc;
          padding: 18px 22px;
          border-radius: 0 16px 16px 0;
          color: #202124;
          font-weight: 500;
          font-size: 15.5px;
          margin: 26px 0;
          box-shadow: 0 2px 10px rgba(26, 115, 232, 0.04);
        }
        .article-body a {
          color: #1a73e8;
          font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .article-body a:hover { color: #1557b0; }
        .article-body figure { margin: 28px 0; }
        .article-body img {
          border-radius: 18px;
          border: 1px solid #e8eaed;
          max-width: 100%;
          height: auto;
          box-shadow: 0 4px 16px rgba(60,64,67,0.06);
        }
      `}</style>

      {/* --- 1. PREMIUM EDITORIAL ARTICLE HERO HEADER --- */}
      <section className="relative w-full bg-white pt-8 pb-9 sm:py-14 lg:py-18 px-4 sm:px-6 border-b border-[#e8eaed] overflow-hidden">
        <div className="absolute inset-0 bg-dotted-grid [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] opacity-40 pointer-events-none" />

        <div className="max-w-[1160px] mx-auto relative z-10">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[12px] sm:text-[13px] text-[#5f6368] mb-5 overflow-x-auto no-scrollbar whitespace-nowrap">
            <Link to="/" className="hover:text-[#1a73e8] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-[#1a73e8] transition-colors">
              SEO Research Hub
            </Link>
            <span>/</span>
            <span className="text-[#1a73e8] font-medium">{post.category}</span>
          </div>

          {/* Metadata Badges Row */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-4">
            <span
              className={`text-[11.5px] sm:text-[12px] font-semibold px-3.5 py-1 rounded-full border ${catStyle.badge}`}
            >
              {post.category}
            </span>

            <span className="text-[11.5px] sm:text-[12px] font-semibold bg-[#e6f4ea] text-[#1e8e3e] border border-[#ceead6] px-3.5 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1e8e3e] animate-pulse" />
              Peer-Reviewed ({post.seoScore || 94}/100 Rank Math Score)
            </span>

            <span className="text-[12px] text-[#5f6368] bg-[#f8f9fa] border border-[#e8eaed] px-3.5 py-1 rounded-full">
              ⏱ {post.readTime} ({wordCount} words)
            </span>

            <span className="text-[12px] text-[#5f6368]">
              Updated {post.publishedAt}
            </span>
          </div>

          {/* Main Article Title */}
          <h2 className="gw-font-display text-[28px] sm:text-[40px] md:text-[50px] font-medium text-[#202124] leading-[1.14] tracking-[-0.025em] max-w-[980px] mb-4 sm:mb-5">
            {post.title}
          </h2>

          {/* Lead Summary / Excerpt */}
          <p className="gw-font-text text-[15px] sm:text-[18px] text-[#5f6368] leading-[1.65] max-w-[860px] mb-7">
            {post.excerpt}
          </p>

          {/* Author with SeoHub Logo & Quick Share Strip */}
          <div className="pt-5 border-t border-[#f1f3f4] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              {/* SeoHub Corporate Logo / Brand Avatar Mark */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1a73e8] to-[#1557b0] text-white font-bold text-[13px] flex items-center justify-center shrink-0 shadow-sm border-2 border-white ring-2 ring-[#d2e3fc]">
                <img
                  src="/SeoHubLogo.png"
                  alt="SeoHub Logo"
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="gw-font-display text-[15px] font-medium text-[#202124]">
                    {post.author || "SeoHub Technical Team"}
                  </span>
                  <span className="text-[10.5px] font-semibold bg-[#e8f0fe] text-[#1a73e8] border border-[#d2e3fc] px-2.5 py-0.2 rounded-full">
                    SeoHub Ltd
                  </span>
                </div>
                <span className="block text-[12.5px] text-[#5f6368]">
                  {post.authorRole || "Senior Link Strategist"}
                </span>
              </div>
            </div>

            {/* Share Controls */}
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-[#5f6368] mr-1 hidden sm:inline">
                Share Guide:
              </span>
              <button
                type="button"
                onClick={handleCopyUrl}
                className="px-3.5 py-1.5 rounded-full bg-[#f8f9fa] hover:bg-[#e8f0fe] text-[#3c4043] hover:text-[#1a73e8] border border-[#dadce0] text-[12px] font-medium transition-colors cursor-pointer"
              >
                {copiedLink ? "✓ Link Copied" : "🔗 Copy Link"}
              </button>
              <a
                href={`https://wa.me/?text=${shareTitle}%20${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full bg-[#e6f4ea] hover:bg-[#ceead6] text-[#1e8e3e] text-[12px] font-semibold transition-colors"
              >
                WhatsApp
              </a>
              <a
                href={`https://t.me/share/url?url=${shareUrl}&text=${shareTitle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full bg-[#e8f0fe] hover:bg-[#d2e3fc] text-[#1a73e8] text-[12px] font-semibold transition-colors"
              >
                Telegram
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* --- 2. MAIN 2-COLUMN EDITORIAL LAYOUT (CONTENT + STICKY SIDEBAR) --- */}
      <section className="w-full py-8 sm:py-12 px-3.5 sm:px-6">
        <div className="max-w-[1160px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-9 items-start">
          {/* LEFT 8 COLUMNS: ARTICLE CARD */}
          <div className="lg:col-span-8 min-w-0 space-y-6">
            <article className="bg-white rounded-[24px] sm:rounded-[28px] border border-[#e8eaed] shadow-[0_4px_24px_rgba(60,64,67,0.05)] overflow-hidden">
              {/* Top Category Colour Strip */}
              <div className={`h-[4px] w-full ${catStyle.accent}`} />

              {/* Featured Cover Image */}
              {post.image && (
                <div className="relative w-full h-[240px] sm:h-[380px] bg-[#f1f3f4] overflow-hidden border-b border-[#e8eaed]">
                  <img
                    src={post.image}
                    alt={post.imageAlt || post.title}
                    className="w-full h-full object-cover"
                  />
                  {post.focusKeyword && (
                    <span className="absolute bottom-3 right-3 bg-[#202124]/85 backdrop-blur-xs text-white text-[11.5px] font-medium px-3.5 py-1 rounded-full">
                      Target Keyword: {post.focusKeyword}
                    </span>
                  )}
                </div>
              )}

              <div className="p-6 sm:p-9 lg:p-12">
                {/* Mobile Collapsible Table of Contents */}
                {tocHeadings.length > 0 && (
                  <div className="lg:hidden mb-8 rounded-[18px] bg-[#f8fbff] border border-[#d2e3fc] overflow-hidden shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
                      className="w-full px-4 py-3.5 flex items-center justify-between text-left cursor-pointer"
                    >
                      <span className="gw-font-display text-[14.5px] font-semibold text-[#1a73e8]">
                        📑 Table of Contents ({tocHeadings.length} Sections)
                      </span>
                      <span className="text-[#1a73e8] font-bold">
                        {isMobileTocOpen ? "−" : "+"}
                      </span>
                    </button>
                    {isMobileTocOpen && (
                      <div className="px-4 pb-4 pt-1 space-y-2 border-t border-[#d2e3fc]/60">
                        {tocHeadings.map((h, i) => (
                          <button
                            key={h.id}
                            type="button"
                            onClick={() => scrollToHeading(h.id)}
                            className={`w-full text-left text-[13.5px] py-1 transition-colors cursor-pointer ${
                              h.level === 3 ? "pl-4 text-[13px]" : "font-medium"
                            } ${
                              activeHeadingId === h.id
                                ? "text-[#1a73e8] font-semibold"
                                : "text-[#3c4043]"
                            }`}
                          >
                            {i + 1}. {h.text}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Rendered HTML Content */}
                <div
                  className="article-body"
                  dangerouslySetInnerHTML={{ __html: processedHtml }}
                />

                {/* Topic Tags Strip */}
                {Array.isArray(post.tags) && post.tags.length > 0 && (
                  <div className="mt-10 pt-6 border-t border-[#f1f3f4] flex flex-wrap items-center gap-2">
                    <span className="text-[12.5px] font-semibold text-[#5f6368] mr-1">
                      Related Topics:
                    </span>
                    {post.tags.map((tag, idx) => (
                      <Link
                        key={idx}
                        to="/blog"
                        className="text-[12px] font-medium text-[#3c4043] hover:text-[#1a73e8] bg-[#f8f9fa] hover:bg-[#e8f0fe] border border-[#e8eaed] px-3.5 py-1 rounded-full transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                )}

                {/* In-Article Conversion Banner */}
                <div className="mt-10 rounded-[22px] bg-gradient-to-r from-[#f8fbff] via-[#f1faf4] to-[#e8f0fe] border border-[#d2e3fc] p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-2xs">
                  <div>
                    <span className="inline-block text-[11.5px] font-semibold uppercase tracking-wider text-[#1e8e3e] bg-white px-3 py-1 rounded-full border border-[#ceead6] mb-2">
                      ● Instant White-Label Execution
                    </span>
                    <h2 className="gw-font-display text-[19px] sm:text-[21px] font-medium text-[#202124]">
                      Need verified DA/DR 50+ placements for your brand?
                    </h2>
                    <p className="text-[13.5px] text-[#5f6368] mt-1">
                      Combine Homepage Posts, .ID Regional, and .EDU/.GOV links
                      starting from $1.00/link.
                    </p>
                  </div>
                  <Link
                    to="/#estimator"
                    className="gw-font-display shrink-0 w-full sm:w-auto px-6 py-3 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-[14px] font-medium text-center shadow-xs transition-all"
                  >
                    Launch Calculator →
                  </Link>
                </div>

                {/* Author Bio & SeoHub Ltd Editorial Verification Box */}
                <div className="mt-10 p-6 sm:p-7 rounded-[22px] bg-[#f8f9fa] border border-[#e8eaed] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                  <div className="flex items-start gap-4">
                    <div className="w-13 h-13 rounded-full bg-gradient-to-br from-[#1a73e8] to-[#1557b0] text-white font-bold text-[14px] flex items-center justify-center shrink-0 shadow-sm border-2 border-white ring-2 ring-[#d2e3fc]">
                      <svg
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1a73e8] block mb-0.5">
                        Written & Fact-Checked By
                      </span>
                      <h2 className="gw-font-display text-[18px] font-medium text-[#202124]">
                        {post.author || "SeoHub Technical Team"}
                      </h2>
                      <p className="text-[13px] text-[#5f6368] leading-relaxed mt-1 max-w-[520px]">
                        {post.authorRole || "Senior Link Strategist"} at{" "}
                        <strong className="text-[#202124]">SeoHub Ltd</strong>.
                        Specialising in Class-C IP isolated PBN architecture,
                        regional APAC ccTLD rankings, and enterprise E-E-A-T
                        link building.
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/contact"
                    className="shrink-0 text-[13px] font-semibold text-[#1a73e8] hover:underline"
                  >
                    Ask Our Team →
                  </Link>
                </div>
              </div>
            </article>

            {/* Previous & Next Article Navigation Cards */}
            {(prevPost || nextPost) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prevPost ? (
                  <Link
                    to={`/blog/${prevPost.slug}`}
                    className="group bg-white rounded-[20px] p-5 sm:p-6 border border-[#e8eaed] hover:border-[#1a73e8] shadow-2xs transition-all flex flex-col justify-between"
                  >
                    <span className="text-[12px] font-semibold text-[#5f6368] group-hover:text-[#1a73e8] mb-1.5">
                      ← Previous Guide
                    </span>
                    <h2 className="gw-font-display text-[16px] font-medium text-[#202124] group-hover:text-[#1a73e8] line-clamp-2 leading-snug">
                      {prevPost.title}
                    </h2>
                  </Link>
                ) : (
                  <div />
                )}

                {nextPost && (
                  <Link
                    to={`/blog/${nextPost.slug}`}
                    className="group bg-white rounded-[20px] p-5 sm:p-6 border border-[#e8eaed] hover:border-[#1a73e8] shadow-2xs transition-all flex flex-col justify-between sm:text-right"
                  >
                    <span className="text-[12px] font-semibold text-[#5f6368] group-hover:text-[#1a73e8] mb-1.5">
                      Next Guide →
                    </span>
                    <h2 className="gw-font-display text-[16px] font-medium text-[#202124] group-hover:text-[#1a73e8] line-clamp-2 leading-snug">
                      {nextPost.title}
                    </h2>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* RIGHT 4 COLUMNS: STICKY TABLE OF CONTENTS & QUICK LINK ESTIMATOR */}
          <aside className="lg:col-span-4 lg:sticky lg:top-[84px] space-y-5">
            {/* 1. Sticky Interactive Table of Contents (Desktop) */}
            {tocHeadings.length > 0 && (
              <div className="hidden lg:block bg-white rounded-[24px] border border-[#e8eaed] p-6 shadow-[0_4px_20px_rgba(60,64,67,0.04)]">
                <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#f1f3f4]">
                  <span className="gw-font-display text-[16px] font-medium text-[#202124]">
                    Table of Contents
                  </span>
                  <span className="text-[11.5px] font-semibold text-[#1a73e8] bg-[#e8f0fe] px-2.5 py-0.5 rounded-full">
                    {Math.round(readingProgress)}% Read
                  </span>
                </div>

                <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                  {tocHeadings.map((h) => {
                    const active = activeHeadingId === h.id;
                    return (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => scrollToHeading(h.id)}
                        className={`w-full text-left px-3.5 py-2 rounded-[12px] text-[13px] transition-all cursor-pointer flex items-start gap-2.5 ${
                          h.level === 3 ? "pl-7 text-[12.5px]" : ""
                        } ${
                          active
                            ? "bg-[#e8f0fe] text-[#1a73e8] font-semibold shadow-2xs"
                            : "text-[#5f6368] hover:text-[#202124] hover:bg-[#f8f9fa]"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                            active ? "bg-[#1a73e8]" : "bg-[#dadce0]"
                          }`}
                        />
                        <span className="line-clamp-2 leading-snug">
                          {h.text}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. Interactive Quick Link Estimator Widget */}
            <div className="bg-white rounded-[24px] border border-[#dadce0] shadow-[0_12px_36px_rgba(60,64,67,0.06)] overflow-hidden">
              <div className="grid grid-cols-4 h-[4px] w-full">
                <div className="bg-[#4285F4]" />
                <div className="bg-[#EA4335]" />
                <div className="bg-[#FBBC04]" />
                <div className="bg-[#34A853]" />
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11.5px] font-semibold uppercase tracking-wider text-[#1a73e8]">
                    Quick Price Estimator
                  </span>
                  <span className="text-[11.5px] font-semibold bg-[#e6f4ea] text-[#1e8e3e] px-2.5 py-0.5 rounded-full">
                    DA/DR 50+
                  </span>
                </div>

                <h2 className="gw-font-display text-[19px] font-medium text-[#202124] mb-3.5">
                  Estimate Your Link Campaign
                </h2>

                <div className="space-y-3.5 mb-4">
                  <div>
                    <label className="block text-[12px] font-medium text-[#5f6368] mb-1.5">
                      Select Placement Tier
                    </label>
                    <select
                      value={quickService.slug}
                      onChange={(e) => {
                        const found = quickServicesList.find(
                          (s) => s.slug === e.target.value,
                        );
                        if (found) setQuickService(found);
                      }}
                      className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-[#dadce0] rounded-[12px] text-[13.5px] font-medium text-[#202124] focus:outline-none focus:border-[#1a73e8]"
                    >
                      {quickServicesList.map((s) => (
                        <option key={s.slug} value={s.slug}>
                          {s.name} — ${s.price.toFixed(2)}/link
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-[#5f6368] mb-1.5">
                      Select Link Volume
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[50, 100, 250, 500].map((vol) => (
                        <button
                          key={vol}
                          type="button"
                          onClick={() => setQuickQty(vol)}
                          className={`py-2 rounded-[10px] text-[12.5px] font-medium border transition-all cursor-pointer ${
                            quickQty === vol
                              ? "bg-[#1a73e8] border-[#1a73e8] text-white font-semibold shadow-xs"
                              : "bg-[#f8f9fa] border-[#e8eaed] text-[#3c4043]"
                          }`}
                        >
                          {vol}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-[16px] bg-[#f8fbff] border border-[#d2e3fc] flex items-center justify-between mb-4">
                  <div>
                    <span className="block text-[11.5px] text-[#5f6368]">
                      Estimated Total ({quickQty} Links)
                    </span>
                    <span className="text-[11.5px] font-semibold text-[#1e8e3e]">
                      ● White-Label Report Included
                    </span>
                  </div>
                  <span className="gw-font-display text-[24px] font-bold text-[#1a73e8]">
                    ${(quickQty * quickService.price).toLocaleString("en-US")}
                  </span>
                </div>

                <div className="space-y-2.5">
                  <Link
                    to={`/services/${quickService.slug}`}
                    className="gw-font-display w-full h-[48px] rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-[14px] font-medium flex items-center justify-center shadow-xs transition-colors"
                  >
                    Order {quickService.name.split(" (")[0]} →
                  </Link>
                  <Link
                    to="/#estimator"
                    className="gw-font-display w-full h-[44px] rounded-full border border-[#dadce0] bg-white hover:bg-[#f8f9fa] text-[#202124] text-[13.5px] font-medium flex items-center justify-center transition-colors"
                  >
                    Open Full Multi-Service Calculator
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* --- 3. RELATED SEO RESEARCH ARTICLES GRID --- */}
      {relatedPosts.length > 0 && (
        <section className="w-full py-12 sm:py-16 px-4 sm:px-6 border-t border-[#e8eaed] bg-white">
          <div className="max-w-[1160px] mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[11.5px] font-semibold uppercase tracking-wider text-[#1a73e8] block mb-1">
                  Continue Reading
                </span>
                <h2 className="gw-font-display text-[24px] sm:text-[30px] font-medium text-[#202124]">
                  Related SEO Guides & Case Studies
                </h2>
              </div>
              <Link
                to="/blog"
                className="text-[13.5px] font-semibold text-[#1a73e8] hover:underline"
              >
                View All Articles →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rel) => {
                const style = getCategoryStyle(rel.category);
                return (
                  <Link
                    key={rel.id}
                    to={`/blog/${rel.slug}`}
                    className="group bg-[#fcfcfc] hover:bg-white rounded-[24px] border border-[#e8eaed] hover:border-[#d2e3fc] shadow-2xs hover:shadow-[0_16px_40px_rgba(26,115,232,0.09)] transition-all overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className={`h-[3px] w-full ${style.accent}`} />
                      <div className="h-[180px] w-full bg-[#f1f3f4] overflow-hidden relative">
                        <img
                          src={rel.image}
                          alt={rel.imageAlt || rel.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span
                          className={`absolute top-3 left-3 text-[11px] font-semibold px-3 py-0.5 rounded-full border bg-white/95 ${style.badge}`}
                        >
                          {rel.category}
                        </span>
                      </div>
                      <div className="p-6">
                        <span className="text-[11.5px] text-[#5f6368] block mb-2">
                          {rel.publishedAt} • {rel.readTime}
                        </span>
                        <h2 className="gw-font-display text-[18px] font-medium text-[#202124] group-hover:text-[#1a73e8] transition-colors line-clamp-2 leading-snug mb-2.5">
                          {rel.title}
                        </h2>
                        <p className="text-[13.5px] text-[#5f6368] line-clamp-3 leading-relaxed">
                          {rel.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 py-4 border-t border-[#f1f3f4] flex items-center justify-between text-[12.5px]">
                      <span className="font-medium text-[#3c4043]">
                        {rel.author || "SeoHub Ltd"}
                      </span>
                      <span className="font-semibold text-[#1a73e8]">
                        Read Guide →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
