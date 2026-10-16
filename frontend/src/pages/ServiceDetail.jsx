import { Link, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";

// --- ENVIRONMENT & API CONFIGURATION ---
const STRIPE_PUBLIC_KEY =
  import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_placeholder";
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || "test";
const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// --- YOUR 3 OFFICIAL TEAM CONTACTS (SHOWN IN POPUP 3) ---
const TEAM_CONTACTS = {
  whatsappUrl: "https://wa.me/6281234567890",
  whatsappLabel: "+62 812-3456-7890",
  telegramUrl: "https://t.me/jasabacklinks",
  telegramLabel: "@jasabacklinks",
  supportEmail: "jasa-backlinks@seohubltd.com",
};

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const STRIPE_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "15px",
      color: "#202124",
      fontFamily: "'Google Sans', Roboto, -apple-system, sans-serif",
      fontSmoothing: "antialiased",
      "::placeholder": {
        color: "#9aa0a6",
      },
    },
    invalid: {
      color: "#d93025",
      iconColor: "#d93025",
    },
  },
};

// --- PIECEWISE SLIDER MAPPING HELPERS (EXACT ALIGNMENT WITH LABELS) ---
const SLIDER_STOPS = [0, 50, 1000, 2000, 3000, 4000, 5000];

function qtyToSliderPos(qty) {
  if (!qty || qty <= 0) return 0;
  if (qty <= 50) return 100;
  if (qty <= 1000) {
    return 100 + (qty / 1000) * 100;
  }
  return Math.min(600, 200 + ((qty - 1000) / 1000) * 100);
}

function sliderPosToQty(pos) {
  const numPos = Number(pos) || 0;
  if (numPos < 50) return 0;
  if (numPos <= 105) return 50;

  for (let i = 2; i <= 6; i++) {
    const targetPos = i * 100;
    if (Math.abs(numPos - targetPos) <= 6) {
      return (i - 1) * 1000;
    }
  }

  if (numPos <= 200) {
    const raw = ((numPos - 100) / 100) * 1000;
    const snapped = Math.round(raw / 50) * 50;
    return Math.max(50, Math.min(1000, snapped));
  }

  const rawAbove1k = 1000 + ((numPos - 200) / 100) * 1000;
  const snappedAbove1k = Math.round(rawAbove1k / 50) * 50;
  return Math.max(1000, Math.min(5000, snappedAbove1k));
}

// --- COMPLETE 12 DEDICATED SERVICE PAGES CATALOGUE ---
export const SERVICE_PAGES_DATA = [
  // 1. HOMEPAGE POST
  {
    id: "hp_post",
    slug: "homepage-post",
    aliases: ["hp_post", "homepage-links"],
    category: "standard",
    categoryLabel: "Standard PBN Network",
    name: "Homepage Post",
    shortSubtitle: "Contextual homepage links",
    heroHeadline: "Contextual Homepage PBN Posts on",
    heroHighlight: "Aged DA/DR 50+ Domains.",
    price: 1.0,
    unitLabel: "link",
    minQty: 50,
    metric: "DA/DR 50+",
    tlds: ".COM • .NET • .ORG",
    turnaround: "5–7 Days",
    badge: "Most Popular",
    badgeColor: "bg-[#e8f0fe] text-[#1a73e8]",
    topAccent: "bg-[#1a73e8]",
    desc: "Publish niche-relevant, human-edited articles directly on the main homepage feed of aged, high-authority .COM, .NET, and .ORG domains with zero footprints.",
    features: [
      "400–600 words unique contextual article per placement",
      "Guaranteed Moz DA 50+ & Ahrefs DR 50+ domains",
      "100% Dofollow contextual link placement on homepage",
      "Distributed Class-C IPs, WHOIS privacy & unique CMS themes",
    ],
    deliverables: [
      {
        title: "Contextual Content Engine",
        desc: "Every homepage post includes a 400–600 word article tailored around your target keyword and semantic niche entities.",
      },
      {
        title: "Direct Homepage Authority",
        desc: "Your article is published directly on the root homepage where 90%+ of a domain's referring link equity resides.",
      },
      {
        title: "White-Label Excel Tracking",
        desc: "Receive an unbranded spreadsheet containing live placement URLs, anchor texts, and verified DA/DR metrics.",
      },
    ],
    faqs: [
      {
        q: "How long does my post stay on the homepage?",
        a: "Homepage posts remain on the main feed as new content is added naturally. If you want your post permanently locked at the top, check our Homepage Sticky Post service.",
      },
      {
        q: "Can I submit multiple URLs and anchor texts for 50+ links?",
        a: "Yes. In Step 2 after payment, you can provide unlimited target URLs and custom anchor text ratios for your campaign.",
      },
    ],
  },

  // 2. SIDEBAR BLOGROLL
  {
    id: "sidebar",
    slug: "sidebar-blogroll",
    aliases: ["sidebar", "blogroll"],
    category: "standard",
    categoryLabel: "Standard PBN Network",
    name: "Sidebar Blogroll",
    shortSubtitle: "High-authority sidebar links",
    heroHeadline: "High-Authority Sitewide",
    heroHighlight: "Sidebar Blogroll Links.",
    price: 2.0,
    unitLabel: "link",
    minQty: 50,
    metric: "DA/DR 50+",
    tlds: ".COM • .NET • .ORG",
    turnaround: "3–5 Days",
    badge: "High Link Juice",
    badgeColor: "bg-[#e6f4ea] text-[#1e8e3e]",
    topAccent: "bg-[#34a853]",
    desc: "Pass massive sitewide link equity from every indexed page of our aged DA/DR 50+ domains directly to your money site to accelerate Domain Rating and crawler frequency.",
    features: [
      "Sitewide homepage & inner-page authority transfer",
      "Strictly capped outbound link (OBL) ratio (<15 links)",
      "Instant Googlebot discovery & rapid indexing",
      "Clean historical backlink profile with zero spam score",
    ],
    deliverables: [
      {
        title: "Sitewide Link Equity",
        desc: "Placed in the primary sidebar widget so your target URL receives authority from the homepage and all indexed inner pages.",
      },
      {
        title: "Strict OBL Control",
        desc: "We cap total outbound links on every domain to preserve maximum PageRank flow to your target URLs.",
      },
      {
        title: "Fast 3–5 Day Turnaround",
        desc: "Ideal for agencies needing rapid DR boosts and crawl velocity for competitive client campaigns.",
      },
    ],
    faqs: [
      {
        q: "Are sidebar blogroll links safe for money sites?",
        a: "Yes, when used with branded, naked URL, or high-level commercial anchors across our clean Class-C IP network.",
      },
      {
        q: "Do these links help increase Ahrefs DR?",
        a: "Absolutely. Sitewide blogroll placements on DR 50+ domains are one of the fastest ways to push your domain authority upward.",
      },
    ],
  },

  // 3. HOMEPAGE STICKY POST
  {
    id: "sticky",
    slug: "homepage-sticky-post",
    aliases: ["sticky", "sticky-post"],
    category: "standard",
    categoryLabel: "Standard PBN Network",
    name: "Homepage Sticky Post",
    shortSubtitle: "Pinned homepage placement",
    heroHeadline: "Permanently Pinned",
    heroHighlight: "Homepage Sticky Placements.",
    price: 2.0,
    unitLabel: "link",
    minQty: 50,
    metric: "DA/DR 50+",
    tlds: ".COM • .NET • .ORG",
    turnaround: "5–7 Days",
    badge: "Pinned Top",
    badgeColor: "bg-[#fef7e0] text-[#f29900]",
    topAccent: "bg-[#fbbc04]",
    desc: "Lock your contextual article permanently at the very top of our DA/DR 50+ homepages so your placement never rolls off into inner pagination.",
    features: [
      "Permanently pinned in the top homepage slot",
      "Maximum homepage crawl priority & link juice",
      "500+ word niche article with custom anchor text",
      "Unbranded white-label Excel & CSV delivery",
    ],
    deliverables: [
      {
        title: "Zero Roll-Off Guarantee",
        desc: "Unlike standard posts that move down as new articles publish, sticky posts stay pinned in the top homepage featured grid.",
      },
      {
        title: "Priority Crawler Access",
        desc: "Search engine bots crawl the top of the homepage first, ensuring your contextual backlink is re-indexed continuously.",
      },
      {
        title: "Multi-Niche Compatibility",
        desc: "Supports SaaS, E-Commerce, Local Services, Fintech, Crypto, and iGaming campaigns.",
      },
    ],
    faqs: [
      {
        q: "What is the difference between Homepage Post and Homepage Sticky Post?",
        a: "A Homepage Sticky Post is locked at the top of the homepage feed so it never rolls to page 2 when newer posts are added.",
      },
      {
        q: "Can I drip-feed my sticky posts over 2 weeks?",
        a: "Yes. Simply mention your preferred drip-feed schedule in the Special Instructions field during Step 2 onboarding.",
      },
    ],
  },

  // 4. .ID HOMEPAGE POST
  {
    id: "id_hp_post",
    slug: "id-homepage-post",
    aliases: ["id_hp_post", "id-homepage"],
    category: "id_net",
    categoryLabel: ".ID Regional Network",
    name: ".ID Homepage Post",
    shortSubtitle: "Indonesian contextual links",
    heroHeadline: "Authentic Indonesian (.ID)",
    heroHighlight: "Homepage Contextual Links.",
    price: 2.0,
    unitLabel: "link",
    minQty: 50,
    metric: "DA/DR 50+",
    tlds: ".ID • .CO.ID • .WEB.ID",
    turnaround: "5–7 Days",
    badge: "Regional .ID",
    badgeColor: "bg-[#fce8e6] text-[#d93025]",
    topAccent: "bg-[#ea4335]",
    desc: "Dominate Google.co.id and Southeast Asian SERPs with contextual homepage articles published on aged, authoritative Indonesian country-code domains.",
    features: [
      "Native Bahasa Indonesia or English contextual articles",
      "Aged .ID, .CO.ID, .WEB.ID & .OR.ID domains",
      "Geo-targeted Indonesian & Singaporean hosting IPs",
      "Verified Moz DA 50+ & Ahrefs DR 50+ metrics",
    ],
    deliverables: [
      {
        title: "Authentic ccTLD Authority",
        desc: "Country-code .ID and .CO.ID domains send the strongest regional relevance signals to Google for Indonesian and APAC search queries.",
      },
      {
        title: "Bilingual Content Support",
        desc: "Choose between native Bahasa Indonesia articles or English articles with Indonesian/English anchor texts.",
      },
      {
        title: "100% Footprint-Free .ID Hosting",
        desc: "Hosted across local Asian data centres and global CDNs with unique templates and clean WHOIS records.",
      },
    ],
    faqs: [
      {
        q: "Can I use English anchor texts inside Bahasa Indonesia articles?",
        a: "Yes. Our writers naturally weave either Bahasa Indonesia or English anchor texts into the contextual article.",
      },
      {
        q: "Are these real .ID and .CO.ID extensions?",
        a: "100%. Every placement in this tier is published on verified Indonesian registry extensions (.ID, .CO.ID, .WEB.ID, .OR.ID).",
      },
    ],
  },

  // 5. .ID SIDEBAR BLOGROLL
  {
    id: "id_sidebar",
    slug: "id-sidebar-blogroll",
    aliases: ["id_sidebar", "id-blogroll"],
    category: "id_net",
    categoryLabel: ".ID Regional Network",
    name: ".ID Sidebar Blogroll",
    shortSubtitle: "Local .ID blogroll placement",
    heroHeadline: "High-Powered Local .ID",
    heroHighlight: "Sidebar Blogroll Placements.",
    price: 3.0,
    unitLabel: "link",
    minQty: 50,
    metric: "DA/DR 50+",
    tlds: ".ID • .CO.ID • .OR.ID",
    turnaround: "3–5 Days",
    badge: "Local Power",
    badgeColor: "bg-[#fce8e6] text-[#d93025]",
    topAccent: "bg-[#ea4335]",
    desc: "Push competitive Indonesian keywords into the Top 3 with sitewide blogroll placements across our highest-authority .ID and .CO.ID domains.",
    features: [
      "Direct homepage & sitewide .ID link equity",
      "Geo-targeted Indonesian Class-C IP distribution",
      "Strong regional trust signals for Google.co.id",
      "Full placement replacement guarantee included",
    ],
    deliverables: [
      {
        title: "Regional Sitewide Power",
        desc: "Transfers regional ccTLD authority from every indexed page of our aged .ID domains directly to your target URL.",
      },
      {
        title: "Competitive Niche Ready",
        desc: "Proven performance for Indonesian E-Commerce, Fintech, Travel, Gaming, and Enterprise corporate portals.",
      },
      {
        title: "Rapid 3–5 Day Deployment",
        desc: "Links go live quickly with instant crawler discovery and a complete white-label verification sheet.",
      },
    ],
    faqs: [
      {
        q: "How many URLs can I use in a 50-link .ID Sidebar order?",
        a: "You can use 1 URL or split the 50 placements across multiple inner pages or subdomains at no extra cost.",
      },
      {
        q: "Are all .ID Sidebar domains indexed in Google?",
        a: "Yes. We continuously monitor indexation across our entire .ID inventory prior to deploying any client campaign.",
      },
    ],
  },

  // 6. .ID STICKY POST
  {
    id: "id_sticky",
    slug: "id-sticky-post",
    aliases: ["id_sticky"],
    category: "id_net",
    categoryLabel: ".ID Regional Network",
    name: ".ID Sticky Post",
    shortSubtitle: "Pinned .ID homepage post",
    heroHeadline: "Pinned Top-of-Homepage",
    heroHighlight: ".ID Sticky Post Placements.",
    price: 2.5,
    unitLabel: "link",
    minQty: 50,
    metric: "DA/DR 50+",
    tlds: ".ID • .CO.ID • .WEB.ID",
    turnaround: "5–7 Days",
    badge: "Pinned .ID",
    badgeColor: "bg-[#fef7e0] text-[#f29900]",
    topAccent: "bg-[#fbbc04]",
    desc: "Combine contextual relevance with permanent top-of-homepage positioning across aged DA/DR 50+ Indonesian (.ID / .CO.ID) domains.",
    features: [
      "Locked top-of-homepage .ID contextual placement",
      "Unique Bahasa Indonesia or English niche article",
      "Safe drip-feed publishing schedule available",
      "Complete live URL & DA/DR tracking sheet",
    ],
    deliverables: [
      {
        title: "Pinned Regional Authority",
        desc: "Your contextual article stays pinned in the primary featured section of the .ID homepage so it never loses root-level link equity.",
      },
      {
        title: "Contextual Surround Signals",
        desc: "Surrounded by niche-relevant headings, semantic keywords, and topical paragraphs to maximise AEO and organic rankings.",
      },
      {
        title: "Agency White-Label Ready",
        desc: "Delivered in a clean, unbranded Excel sheet ready to share directly with your clients or in-house stakeholders.",
      },
    ],
    faqs: [
      {
        q: "Why choose .ID Sticky Post over standard .ID Homepage Post?",
        a: "Sticky posts guarantee your article remains pinned at the top of the homepage feed permanently rather than moving down over time.",
      },
      {
        q: "Can I combine .ID Sticky Posts with EDU links?",
        a: "Yes! Use the Bulk Cost Calculator below on this page to combine .ID Sticky Posts with any other service in a single checkout.",
      },
    ],
  },

  // 7. EDU PBN BLOGPOST
  {
    id: "edu_post",
    slug: "edu-pbn-blogpost",
    aliases: ["edu_post", "edu-blogpost"],
    category: "edu_gov",
    categoryLabel: "EDU & GOV Authority Tier",
    name: "EDU PBN Blogpost",
    shortSubtitle: "Academic contextual articles",
    heroHeadline: "High-Trust Academic",
    heroHighlight: "EDU PBN Contextual Blogposts.",
    price: 3.0,
    unitLabel: "link",
    minQty: 50,
    metric: "DA/DR 50+",
    tlds: ".EDU • .AC.ID • .SCH.ID",
    turnaround: "5–7 Days",
    badge: "Academic Trust",
    badgeColor: "bg-[#f3e8fd] text-[#9334e6]",
    topAccent: "bg-[#9334e6]",
    desc: "Skyrocket your E-E-A-T signals, AI Overview citations, and Domain Rating with contextual articles published on aged educational domains.",
    features: [
      "Contextual article on aged .EDU & academic domains",
      "Massive boost to Ahrefs DR & institutional trust",
      "Natural anchor text & citation integration",
      "100% indexed & footprint-free academic hosting",
    ],
    deliverables: [
      {
        title: "Institutional E-E-A-T Signals",
        desc: "Search engines and LLM systems assign significantly higher trust weight to links originating from academic domain extensions.",
      },
      {
        title: "Editorial-Grade Articles",
        desc: "Each placement is wrapped in an informative, well-structured article that matches academic and research-style formatting.",
      },
      {
        title: "Verified DA/DR 50+ Metrics",
        desc: "Every educational domain is vetted for clean historical backlinks from real universities, journals, and authority portals.",
      },
    ],
    faqs: [
      {
        q: "Are these contextual articles or profile links?",
        a: "These are 100% contextual articles published as full blog posts on our aged educational PBN properties—never spammy forum profiles.",
      },
      {
        q: "Do EDU blogposts help with AI Overviews (ChatGPT / Gemini / Perplexity)?",
        a: "Yes. High-trust educational domains carry strong citation authority that helps brands surface in AI-generated answers.",
      },
    ],
  },

  // 8. EDU PBN BLOGROLL
  {
    id: "edu_sidebar",
    slug: "edu-pbn-blogroll",
    aliases: ["edu_sidebar", "edu-blogroll"],
    category: "edu_gov",
    categoryLabel: "EDU & GOV Authority Tier",
    name: "EDU PBN Blogroll",
    shortSubtitle: "University sidebar placements",
    heroHeadline: "Maximum Institutional Power:",
    heroHighlight: "EDU PBN Sidebar Blogroll.",
    price: 5.0,
    unitLabel: "link",
    minQty: 50,
    metric: "DA/DR 50+",
    tlds: ".EDU • .AC.ID • .SCH.ID",
    turnaround: "3–5 Days",
    badge: "Max Authority",
    badgeColor: "bg-[#f3e8fd] text-[#9334e6]",
    topAccent: "bg-[#9334e6]",
    desc: "University and academic sidebar placements delivering massive sitewide institutional authority to push ultra-competitive keywords into the Top 3.",
    features: [
      "Sitewide academic sidebar link equity transfer",
      "High-trust institutional backlink profile",
      "Built for Finance, SaaS, iGaming, Crypto & E-Com",
      "Priority indexing & white-label spreadsheet report",
    ],
    deliverables: [
      {
        title: "Sitewide Academic Authority",
        desc: "Your link is placed on the sidebar of aged educational domains, capturing authority from every indexed academic page.",
      },
      {
        title: "Built for Hardest Keywords",
        desc: "Engineered specifically for high-CPC and high-difficulty SERPs where standard guest posts plateau.",
      },
      {
        title: "Strict Capacity Protection",
        desc: "We strictly limit the number of active sidebar slots per educational domain to maintain elite link equity.",
      },
    ],
    faqs: [
      {
        q: "Who should order EDU PBN Blogroll placements?",
        a: "Agencies and brands competing in high-difficulty niches (Fintech, SaaS, iGaming, Legal, E-Commerce) looking for maximum authority transfer.",
      },
      {
        q: "How fast will I see ranking movement?",
        a: "Most campaigns experience noticeable crawler activity within 7 days and strong SERP movement within 2 to 4 weeks.",
      },
    ],
  },

  // 9. EDU & GOV BACKLINK (HIDDEN LINKS)
  {
    id: "hidden_links",
    slug: "edu-gov-backlink",
    aliases: ["hidden_links", "hidden-links", "edu-gov-backlinks"],
    category: "edu_gov",
    categoryLabel: "EDU & GOV Authority Tier",
    name: "EDU & GOV Backlink",
    shortSubtitle: "Official authority backlinks",
    heroHeadline: "Official Academic & Government",
    heroHighlight: "Stealth Authority Backlinks.",
    price: 20.0,
    unitLabel: "link",
    minQty: 50,
    metric: "DA 50–85+ Trust",
    tlds: ".AC.ID • .SCH.ID • .GO.ID",
    turnaround: "5–7 Days",
    badge: "Exclusive Tier",
    badgeColor: "bg-[#f3e8fd] text-[#9334e6]",
    topAccent: "bg-[#9334e6]",
    desc: "Ultra-high-trust placements on official academic (.AC.ID, .SCH.ID) and government (.GO.ID) properties with competitor-proof stealth integration.",
    features: [
      "Authentic .AC.ID, .SCH.ID & .GO.ID extensions",
      "Competitor-proof stealth link integration",
      "Unmatched institutional trust & AI citation weight",
      "Strict capacity limits for maximum network safety",
    ],
    deliverables: [
      {
        title: "Official .AC.ID, .SCH.ID & .GO.ID",
        desc: "Direct placements on restricted academic and government extensions that competitors cannot easily replicate.",
      },
      {
        title: "Stealth Competitor Protection",
        desc: "Formatted so search engine bots crawl and count full dofollow link equity while keeping your strategy hidden from competitor audits.",
      },
      {
        title: "VIP Campaign Management",
        desc: "Handled by our senior technical SEO engineers with dedicated WhatsApp/Telegram reporting.",
      },
    ],
    faqs: [
      {
        q: "Why are EDU & GOV Backlinks priced at $20 per link?",
        a: "Because these placements are deployed on restricted official .AC.ID, .SCH.ID, and .GO.ID domains with extraordinary domain trust and strict slot limits.",
      },
      {
        q: "Are these links dofollow and crawlable by Googlebot?",
        a: "Yes. 100% dofollow and fully crawlable by Googlebot, Bingbot, and AI search crawlers.",
      },
    ],
  },

  // 10. COMPLETE SEO PACKAGE (RIGHT MENU ITEM 1)
  {
    id: "complete_seo",
    slug: "complete-seo-package",
    aliases: ["complete_seo", "complete-seo"],
    category: "solutions",
    categoryLabel: "Managed SEO Solutions",
    name: "Complete SEO Package",
    shortSubtitle: "All-in-one authority & contextual link campaign",
    heroHeadline: "All-In-One Managed",
    heroHighlight: "Complete SEO Link Package.",
    price: 5.0,
    unitLabel: "link",
    minQty: 50,
    metric: "Multi-Tier DR 50+",
    tlds: ".COM • .ID • .EDU Mix",
    turnaround: "5–7 Days",
    badge: "All-In-One",
    badgeColor: "bg-[#e8f0fe] text-[#1a73e8]",
    topAccent: "bg-[#1a73e8]",
    desc: "A diversified, done-for-you authority campaign combining Standard PBN Homepage Posts, Sitewide Blogrolls, and High-Trust EDU placements into one balanced link profile.",
    features: [
      "Balanced mix of Homepage, Sticky & EDU placements",
      "Natural anchor text diversification (Branded, Exact, Partial)",
      " Drip-feed velocity tailored to your domain age",
      "Dedicated campaign manager & white-label master report",
    ],
    deliverables: [
      {
        title: "Diversified TLD Footprint",
        desc: "Blends .COM, .NET, .ORG, regional .ID, and academic .EDU domains so your backlink profile looks 100% organic.",
      },
      {
        title: "Anchor Text Optimization",
        desc: "Our SEO strategists structure safe exact-match, partial-match, and branded anchor ratios across your target URLs.",
      },
      {
        title: "End-to-End Execution",
        desc: "Submit your URLs and keywords once in Step 2—we handle content creation, placement, indexing, and white-label reporting.",
      },
    ],
    faqs: [
      {
        q: "What is included in the Complete SEO Package?",
        a: "Every 50-link unit includes a curated blend of DA/DR 50+ Homepage Posts, Sticky placements, and EDU authority links managed by our team.",
      },
      {
        q: "Can agencies resell the Complete SEO Package?",
        a: "Yes! All reports are 100% unbranded and white-label so you can hand them directly to your clients.",
      },
    ],
  },

  // 11. RANK ON FIRST PAGE (RIGHT MENU ITEM 2)
  {
    id: "rank_first_page",
    slug: "rank-on-first-page",
    aliases: ["rank_first_page", "first-page-seo"],
    category: "solutions",
    categoryLabel: "Managed SEO Solutions",
    name: "Rank on First Page",
    shortSubtitle: "Aggressive Page-1 SERP domination campaign",
    heroHeadline: "High-Velocity Authority Built to",
    heroHighlight: "Rank on the First Page.",
    price: 8.0,
    unitLabel: "link",
    minQty: 50,
    metric: "DR 50–80+ Power",
    tlds: ".COM • .EDU • .AC.ID • .GO.ID",
    turnaround: "5–7 Days",
    badge: "Page 1 Power",
    badgeColor: "bg-[#e6f4ea] text-[#1e8e3e]",
    topAccent: "bg-[#34a853]",
    desc: "Engineered for stubborn keywords stuck on Page 2 or Page 3. Combines our highest-metric Pinned Sticky Posts, EDU Blogrolls, and Institutional links to force Top-3 SERP breakthroughs.",
    features: [
      "Priority placement on our highest-DR (DR 60–80+) domains",
      "Includes Pinned Sticky Posts + EDU/GOV institutional links",
      "Competitor gap analysis & anchor velocity planning",
      "Direct WhatsApp/Telegram strategist support",
    ],
    deliverables: [
      {
        title: "High-DR Power Placements",
        desc: "Focuses exclusively on top-percentile domains with strong referring domain counts and permanent homepage visibility.",
      },
      {
        title: "SERP Bottleneck Breaker",
        desc: "Designed to overcome authority gaps against entrenched competitors in Finance, SaaS, E-Commerce, and iGaming.",
      },
      {
        title: "Verified Indexing Protocol",
        desc: "Every placement is pushed through our premium indexing pipeline to ensure rapid Googlebot recognition.",
      },
    ],
    faqs: [
      {
        q: "How is 'Rank on First Page' different from standard packages?",
        a: "It allocates your budget toward our highest-tier Sticky Homepage and EDU/GOV inventory with custom anchor text velocity designed for Page-1 breakthroughs.",
      },
      {
        q: "How many target keywords should I submit?",
        a: "For best Page-1 results, we recommend focusing a 50 to 250 link campaign on 1 to 3 primary money pages and 5 to 10 core keywords.",
      },
    ],
  },

  // 12. CUSTOM SEO SOLUTIONS (RIGHT MENU ITEM 3)
  {
    id: "custom_seo",
    slug: "custom-seo-solutions",
    aliases: ["custom_seo", "custom-seo"],
    category: "solutions",
    categoryLabel: "Managed SEO Solutions",
    name: "Custom SEO Solutions",
    shortSubtitle: "Bespoke enterprise & agency link infrastructure",
    heroHeadline: "Tailored Enterprise & Agency",
    heroHighlight: "Custom SEO Solutions.",
    price: 4.0,
    unitLabel: "link",
    minQty: 50,
    metric: "Custom DR 50+",
    tlds: "Custom TLD & Geo Selection",
    turnaround: "3–7 Days",
    badge: "Enterprise Custom",
    badgeColor: "bg-[#fef7e0] text-[#f29900]",
    topAccent: "bg-[#fbbc04]",
    desc: "Need custom drip-feed schedules, specific country TLDs, multi-client agency splitting, or bespoke anchor ratios? Configure your custom allocation or build a multi-service bundle below.",
    features: [
      "Split link volume across unlimited client domains",
      "Custom geo-targeting (Global .COM, Indonesian .ID, or EDU)",
      "Custom drip-feed schedules from 3 days to 30 days",
      "Dedicated account manager via WhatsApp & Telegram",
    ],
    deliverables: [
      {
        title: "Multi-Client Agency Splitting",
        desc: "Order in bulk and distribute your links across 5, 10, or 50+ client URLs with separate white-label tabs.",
      },
      {
        title: "Custom Editorial Guidelines",
        desc: "Provide your own brand guidelines, restricted words, or custom language requirements during Step 2 onboarding.",
      },
      {
        title: "Flexible Bulk Estimator",
        desc: "Order a custom allocation directly above or use the 9-service slider calculator below to craft your exact mix.",
      },
    ],
    faqs: [
      {
        q: "Can I specify custom instructions for different URLs?",
        a: "Yes. In Step 2 after checkout, you can paste your URLs, anchor texts, and detailed custom instructions, or message our team directly on WhatsApp/Telegram.",
      },
      {
        q: "Do you offer wholesale volume for SEO agencies?",
        a: "Yes! Our pricing starts from $1.00/link with instant bulk scaling up to 5,000+ placements per order.",
      },
    ],
  },
];

// --- POPUP 1: DEDICATED 3-FIELD CUSTOM STRIPE CARD FORM ---
function CustomStripeCardForm({ clientSecret, totalAmount, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [cardBrand, setCardBrand] = useState("unknown");

  const [numComplete, setNumComplete] = useState(false);
  const [expComplete, setExpComplete] = useState(false);
  const [cvcComplete, setCvcComplete] = useState(false);

  const handleElementChange = (event, setter) => {
    setter(event.complete);
    if (event.brand) setCardBrand(event.brand);
    if (event.error) {
      setErrorMessage(event.error.message);
    } else {
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!numComplete || !expComplete || !cvcComplete) {
      setErrorMessage(
        "Please complete your Card Number, Expiry Date, and CVV.",
      );
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    const cardNumberElement = elements.getElement(CardNumberElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardNumberElement,
        },
      },
    );

    if (error) {
      setErrorMessage(
        error.message ||
          "Your card was declined. Please check your card details.",
      );
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setIsProcessing(false);
      onSuccess(paymentIntent.id, "Credit / Debit Card");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-[12.5px] sm:text-[13px] font-medium text-[#3c4043]">
            Card Number *
          </label>
          <span className="text-[10.5px] sm:text-[11px] font-medium text-[#5f6368] uppercase tracking-wider">
            {cardBrand !== "unknown" ? cardBrand : "Visa • Mastercard • Amex"}
          </span>
        </div>
        <div
          className={`flex items-center px-3.5 py-2.5 sm:py-3 bg-[#f8f9fa] focus-within:bg-white border rounded-[12px] transition-all ${
            numComplete
              ? "border-[#34a853] ring-2 ring-[#e6f4ea]"
              : "border-[#dadce0] focus-within:border-[#1a73e8] focus-within:ring-2 focus-within:ring-[#e8f0fe]"
          }`}
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-[#5f6368] mr-2.5 sm:mr-3 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="1.8"
          >
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
          <div className="w-full">
            <CardNumberElement
              options={{
                ...STRIPE_ELEMENT_OPTIONS,
                placeholder: "1234 5678 9101 1121",
                showIcon: false,
              }}
              onChange={(e) => handleElementChange(e, setNumComplete)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[12.5px] sm:text-[13px] font-medium text-[#3c4043] mb-1.5">
            Expiry Date *
          </label>
          <div
            className={`flex items-center px-3.5 py-2.5 sm:py-3 bg-[#f8f9fa] focus-within:bg-white border rounded-[12px] transition-all ${
              expComplete
                ? "border-[#34a853] ring-2 ring-[#e6f4ea]"
                : "border-[#dadce0] focus-within:border-[#1a73e8] focus-within:ring-2 focus-within:ring-[#e8f0fe]"
            }`}
          >
            <div className="w-full">
              <CardExpiryElement
                options={STRIPE_ELEMENT_OPTIONS}
                onChange={(e) => handleElementChange(e, setExpComplete)}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[12.5px] sm:text-[13px] font-medium text-[#3c4043] mb-1.5">
            CVV / CVC *
          </label>
          <div
            className={`flex items-center px-3.5 py-2.5 sm:py-3 bg-[#f8f9fa] focus-within:bg-white border rounded-[12px] transition-all ${
              cvcComplete
                ? "border-[#34a853] ring-2 ring-[#e6f4ea]"
                : "border-[#dadce0] focus-within:border-[#1a73e8] focus-within:ring-2 focus-within:ring-[#e8f0fe]"
            }`}
          >
            <div className="w-full">
              <CardCvcElement
                options={{ ...STRIPE_ELEMENT_OPTIONS, placeholder: "CVC" }}
                onChange={(e) => handleElementChange(e, setCvcComplete)}
              />
            </div>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-[12px] bg-[#fce8e6] border border-[#fad2cf] text-[#d93025] text-[12px] sm:text-[12.5px] font-medium">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="gw-font-display w-full h-[48px] sm:h-[50px] bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-full font-medium text-[14.5px] sm:text-[15px] transition-all shadow-[0_6px_20px_rgba(26,115,232,0.25)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {isProcessing
          ? "Verifying & Processing..."
          : `Pay $${totalAmount.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} USD`}
      </button>
    </form>
  );
}

// --- POPUP 2 & POPUP 3: ORDER DETAILS + THANK YOU & 3 TEAM CONTACTS ---
function OrderOnboardingFlowModal({
  isOpen,
  paymentData,
  selectedPackages,
  totalLinks,
  finalTotal,
  onClose,
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [contactPlatform, setContactPlatform] = useState("WhatsApp");
  const [contactHandle, setContactHandle] = useState("");
  const [targetUrls, setTargetUrls] = useState("");
  const [anchorTexts, setAnchorTexts] = useState("");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStep3ThankYou, setIsStep3ThankYou] = useState(false);

  useEffect(() => {
    if (isOpen) setIsStep3ThankYou(false);
  }, [isOpen, paymentData]);

  if (!isOpen || !paymentData) return null;

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!contactHandle.trim()) return;

    setIsSubmitting(true);
    try {
      await axios.post(`${BACKEND_URL}/api/submit-order`, {
        transactionId: paymentData.transactionId,
        paymentMethod: paymentData.method,
        totalAmount: finalTotal,
        totalLinks,
        packages: selectedPackages,
        customer: {
          fullName,
          email,
          contactPlatform,
          contactHandle,
          targetUrls,
          anchorTexts,
          notes,
        },
      });
    } catch (err) {
      console.warn(
        "Order recorded; backend email notification pending:",
        err.message,
      );
    } finally {
      setIsSubmitting(false);
      setIsStep3ThankYou(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-[#202124]/65 backdrop-blur-[4px]" />

      <div className="relative w-full max-w-[580px] max-h-[92dvh] overflow-y-auto bg-white rounded-t-[24px] sm:rounded-[24px] shadow-[0_24px_60px_rgba(0,0,0,0.28)] border border-[#dadce0] animate-in fade-in zoom-in-95 duration-200">
        <div className="grid grid-cols-4 h-[4px] w-full sticky top-0 z-20">
          <div className="bg-[#4285F4]" />
          <div className="bg-[#EA4335]" />
          <div className="bg-[#FBBC04]" />
          <div className="bg-[#34A853]" />
        </div>

        {isStep3ThankYou ? (
          <div className="p-5 sm:p-8">
            <div className="text-center mb-5 sm:mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e6f4ea] text-[#1e8e3e] text-[11.5px] sm:text-[12px] font-semibold mb-3">
                Step 3 of 3 • Order Complete
              </div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#e6f4ea] text-[#1e8e3e] flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="gw-font-display text-[22px] sm:text-[26px] font-medium text-[#202124] mb-1.5 sm:mb-2">
                Thank You, {fullName}!
              </h2>
              <p className="gw-font-text text-[13.5px] sm:text-[14.5px] text-[#5f6368] max-w-[460px] mx-auto leading-[1.55]">
                Your campaign requirements and{" "}
                <strong className="text-[#202124]">{contactPlatform}</strong>{" "}
                contact (
                <strong className="text-[#1a73e8]">{contactHandle}</strong>)
                have been received. Confirmation emails have been dispatched.
              </p>
            </div>

            <div className="mb-5 sm:mb-6">
              <h2 className="gw-font-display text-[14.5px] sm:text-[15px] font-medium text-[#202124] text-center mb-1">
                Need Instant Assistance? Contact Our Team:
              </h2>
              <p className="gw-font-text text-[12px] sm:text-[12.5px] text-[#5f6368] text-center mb-3.5 sm:mb-4">
                Reach out to us anytime via WhatsApp, Telegram, or Support Desk:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                <a
                  href={TEAM_CONTACTS.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex sm:flex-col items-center justify-between sm:justify-center px-4 py-3 sm:p-4 rounded-[14px] sm:rounded-[16px] bg-[#f8f9fa] hover:bg-[#e6f4ea]/60 border border-[#e8eaed] hover:border-[#34a853] transition-all text-center"
                >
                  <span className="gw-font-display text-[13.5px] font-medium text-[#202124]">
                    WhatsApp
                  </span>
                  <span className="text-[12px] sm:text-[11.5px] text-[#1e8e3e] font-medium sm:mt-0.5">
                    {TEAM_CONTACTS.whatsappLabel}
                  </span>
                </a>

                <a
                  href={TEAM_CONTACTS.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex sm:flex-col items-center justify-between sm:justify-center px-4 py-3 sm:p-4 rounded-[14px] sm:rounded-[16px] bg-[#f8f9fa] hover:bg-[#e8f0fe]/60 border border-[#e8eaed] hover:border-[#1a73e8] transition-all text-center"
                >
                  <span className="gw-font-display text-[13.5px] font-medium text-[#202124]">
                    Telegram
                  </span>
                  <span className="text-[12px] sm:text-[11.5px] text-[#1a73e8] font-medium sm:mt-0.5">
                    {TEAM_CONTACTS.telegramLabel}
                  </span>
                </a>

                <a
                  href={`mailto:${TEAM_CONTACTS.supportEmail}`}
                  className="flex sm:flex-col items-center justify-between sm:justify-center px-4 py-3 sm:p-4 rounded-[14px] sm:rounded-[16px] bg-[#f8f9fa] hover:bg-[#fef7e0]/60 border border-[#e8eaed] hover:border-[#fbbc04] transition-all text-center"
                >
                  <span className="gw-font-display text-[13.5px] font-medium text-[#202124]">
                    Support Team
                  </span>
                  <span className="text-[12px] sm:text-[11.5px] text-[#f29900] font-medium sm:mt-0.5 truncate max-w-[180px] sm:max-w-full">
                    {TEAM_CONTACTS.supportEmail}
                  </span>
                </a>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="gw-font-display w-full h-[48px] sm:h-[50px] rounded-full bg-[#202124] hover:bg-[#3c4043] text-white font-medium text-[14.5px] sm:text-[15px] transition-colors cursor-pointer"
            >
              Done & Return to Page
            </button>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-[#e6f4ea] via-[#f1faf4] to-[#e8f0fe] px-4 py-4 sm:px-6 sm:py-5 border-b border-[#ceead6]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#34a853] text-white flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2.8"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="gw-font-display text-[17px] sm:text-[20px] font-medium text-[#137333]">
                      Payment Successful
                    </span>
                    <span className="text-[10.5px] sm:text-[11px] font-semibold bg-white text-[#1e8e3e] px-2 py-0.5 rounded-full border border-[#ceead6]">
                      Step 2 of 3
                    </span>
                  </div>
                  <p className="text-[12px] sm:text-[12.5px] text-[#3c4043] mt-0.5 truncate">
                    Paid{" "}
                    <strong>
                      $
                      {finalTotal.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      USD
                    </strong>{" "}
                    ({totalLinks.toLocaleString()} Links) • TXN:{" "}
                    <span className="font-mono">
                      {paymentData.transactionId}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-7">
              <div className="mb-3.5 sm:mb-4 p-3 sm:p-3.5 rounded-[12px] sm:rounded-[14px] bg-[#fef7e0] border border-[#fde293] text-[12px] sm:text-[12.5px] text-[#3c4043] leading-[1.5]">
                <strong className="text-[#202124]">
                  Adding your WhatsApp or Telegram contact is mandatory:
                </strong>{" "}
                We use this to send instant campaign updates and your live
                white-label tracking sheet.
              </div>

              <form
                onSubmit={handleOrderSubmit}
                className="space-y-3.5 sm:space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                  <div>
                    <label className="block text-[12.5px] sm:text-[13px] font-medium text-[#3c4043] mb-1">
                      Your Name / Agency Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-3.5 py-2.5 bg-[#f8f9fa] focus:bg-white border border-[#dadce0] rounded-[10px] focus:outline-none focus:border-[#1a73e8] text-[14px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[12.5px] sm:text-[13px] font-medium text-[#3c4043] mb-1">
                      Email for Report & Receipt *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@agency.com"
                      className="w-full px-3.5 py-2.5 bg-[#f8f9fa] focus:bg-white border border-[#dadce0] rounded-[10px] focus:outline-none focus:border-[#1a73e8] text-[14px]"
                    />
                  </div>
                </div>

                <div className="p-3 sm:p-3.5 rounded-[12px] sm:rounded-[14px] bg-[#f8fbff] border border-[#d2e3fc]">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <label className="block text-[12.5px] sm:text-[13px] font-semibold text-[#1a73e8]">
                      WhatsApp or Telegram (Required) *
                    </label>
                    <div className="inline-flex rounded-full bg-white p-0.5 border border-[#dadce0]">
                      {["WhatsApp", "Telegram"].map((platform) => (
                        <button
                          key={platform}
                          type="button"
                          onClick={() => setContactPlatform(platform)}
                          className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-[11.5px] font-medium cursor-pointer ${
                            contactPlatform === platform
                              ? "bg-[#1a73e8] text-white"
                              : "text-[#5f6368]"
                          }`}
                        >
                          {platform}
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="text"
                    required
                    value={contactHandle}
                    onChange={(e) => setContactHandle(e.target.value)}
                    placeholder={
                      contactPlatform === "WhatsApp"
                        ? "e.g. +1 234 567 8900"
                        : "e.g. @yourusername"
                    }
                    className="w-full px-3.5 py-2.5 bg-white border border-[#dadce0] rounded-[10px] focus:outline-none focus:border-[#1a73e8] text-[14px]"
                  />
                </div>

                <div>
                  <label className="block text-[12.5px] sm:text-[13px] font-medium text-[#3c4043] mb-1">
                    Target URLs (One URL per line) *
                  </label>
                  <textarea
                    rows="2"
                    required
                    value={targetUrls}
                    onChange={(e) => setTargetUrls(e.target.value)}
                    placeholder={`https://yourclient.com/\nhttps://yourclient.com/services`}
                    className="w-full px-3.5 py-2 bg-[#f8f9fa] focus:bg-white border border-[#dadce0] rounded-[10px] focus:outline-none focus:border-[#1a73e8] text-[13.5px] sm:text-[14px]"
                  />
                </div>

                <div>
                  <label className="block text-[12.5px] sm:text-[13px] font-medium text-[#3c4043] mb-1">
                    Target Keywords / Anchor Texts *
                  </label>
                  <textarea
                    rows="2"
                    required
                    value={anchorTexts}
                    onChange={(e) => setAnchorTexts(e.target.value)}
                    placeholder="best seo agency, digital marketing services"
                    className="w-full px-3.5 py-2 bg-[#f8f9fa] focus:bg-white border border-[#dadce0] rounded-[10px] focus:outline-none focus:border-[#1a73e8] text-[13.5px] sm:text-[14px]"
                  />
                </div>

                <div>
                  <label className="block text-[12.5px] sm:text-[13px] font-medium text-[#3c4043] mb-1">
                    Special Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Drip-feed over 7 days..."
                    className="w-full px-3.5 py-2.5 bg-[#f8f9fa] focus:bg-white border border-[#dadce0] rounded-[10px] focus:outline-none focus:border-[#1a73e8] text-[13.5px] sm:text-[14px]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="gw-font-display w-full h-[48px] sm:h-[52px] rounded-full bg-[#1a73e8] text-white font-medium text-[14.5px] sm:text-[15px] hover:bg-[#1557b0] shadow-md transition-all cursor-pointer"
                >
                  {isSubmitting
                    ? "Submitting Campaign..."
                    : "Submit Order Details & View Confirmation →"}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// --- MAIN DYNAMIC SERVICE DETAIL PAGE COMPONENT ---
export default function ServiceDetail({ forcedSlug }) {
  const { slug: routeSlug } = useParams();
  const location = useLocation();

  // Resolve current service from route param, forcedSlug prop, or URL pathname
  const rawSlug =
    forcedSlug ||
    routeSlug ||
    location.pathname.split("/").filter(Boolean).pop() ||
    "homepage-post";

  const currentService =
    SERVICE_PAGES_DATA.find(
      (s) =>
        s.slug === rawSlug.toLowerCase() ||
        s.id === rawSlug.toLowerCase() ||
        (s.aliases && s.aliases.includes(rawSlug.toLowerCase())),
    ) || SERVICE_PAGES_DATA[0];

  // Dedicated Hero Configurator Quantity State
  const [heroQty, setHeroQty] = useState(50);

  // Master Bulk Calculator Cart State (Pre-populated with current service)
  const [checkoutCart, setCheckoutCart] = useState({
    [currentService.id]: 50,
  });
  const [calcCategory, setCalcCategory] = useState("all");
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Checkout Modal & Gateway States
  const [isCheckoutGatewayOpen, setIsCheckoutGatewayOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [isInitializing, setIsInitializing] = useState(false);
  const [isRedirectingBoomFi, setIsRedirectingBoomFi] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  // Post-Payment Onboarding Flow (Popup 2 & 3)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [completedPayment, setCompletedPayment] = useState(null);

  // Reset Hero & Calculator default selection when navigating between the 12 service pages
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setHeroQty(50);
    setCheckoutCart({ [currentService.id]: 50 });
    setOpenFaqIndex(0);
    setPaymentError("");
  }, [currentService.id]);

  // Handle BoomFi Redirect Return
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (
      params.get("payment") === "crypto_success" ||
      params.get("boomfi_status") === "success"
    ) {
      const txId =
        params.get("tx") ||
        params.get("payment_id") ||
        `BOOMFI-${Date.now().toString().slice(-8)}`;
      setCompletedPayment({
        transactionId: txId,
        method: "BoomFi Crypto Gateway",
      });
      setIsOrderModalOpen(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const heroSliderPos = qtyToSliderPos(heroQty);
  const heroFillPercent = Math.min(
    100,
    Math.max(0, (heroSliderPos / 600) * 100),
  );
  const heroTotalAmount = heroQty * currentService.price;

  const updateHeroQty = (rawVal) => {
    let parsed = parseInt(rawVal, 10);
    if (isNaN(parsed) || parsed < 50) parsed = 50;
    if (parsed > 5000) parsed = 5000;
    setHeroQty(parsed);
    setCheckoutCart((prev) => ({ ...prev, [currentService.id]: parsed }));
  };

  const handleHeroSliderChange = (posVal) => {
    const mapped = sliderPosToQty(posVal);
    updateHeroQty(mapped < 50 ? 50 : mapped);
  };

  // Master Calculator Quantity Setter
  const setCalcServiceQty = (id, rawVal) => {
    let val = parseInt(rawVal, 10);
    if (isNaN(val) || val <= 0) {
      setCheckoutCart((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      return;
    }
    if (val > 0 && val < 50) val = 50;
    if (val > 5000) val = 5000;
    setCheckoutCart((prev) => ({ ...prev, [id]: val }));
    if (id === currentService.id) setHeroQty(val);
  };

  const handleCalcSliderPosChange = (id, sliderPosValue) => {
    const mappedQty = sliderPosToQty(sliderPosValue);
    setCalcServiceQty(id, mappedQty);
  };

  const openCheckoutModalWithCart = async (cartObj) => {
    setIsInitializing(true);
    setPaymentError("");
    setIsCheckoutGatewayOpen(true);
    document.body.style.overflow = "hidden";

    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/create-stripe-intent`,
        { cart: cartObj },
      );
      setClientSecret(data.clientSecret);
    } catch (err) {
      setPaymentError(
        err.response?.data?.error ||
          "Could not initialise card gateway. You can still use PayPal or Crypto below.",
      );
    } finally {
      setIsInitializing(false);
    }
  };

  const handleHeroDirectOrder = async () => {
    const singleCart = { [currentService.id]: heroQty };
    setCheckoutCart(singleCart);
    await openCheckoutModalWithCart(singleCart);
  };

  const handleBoomFiDirectCheckout = async (cartToUse) => {
    setIsRedirectingBoomFi(true);
    setPaymentError("");
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/create-boomfi-charge`,
        { cart: cartToUse },
      );
      if (data && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setPaymentError(
          "BoomFi gateway did not return a payment link. Please verify BOOMFI_API_KEY on backend.",
        );
      }
    } catch (err) {
      setPaymentError(
        err.response?.data?.error ||
          "Unable to initialise BoomFi Crypto Checkout.",
      );
    } finally {
      setIsRedirectingBoomFi(false);
    }
  };

  const closeGatewayModal = () => {
    setIsCheckoutGatewayOpen(false);
    document.body.style.overflow = "auto";
  };

  const selectedPackagesDetailed = Object.entries(checkoutCart)
    .filter(([, q]) => q > 0)
    .map(([id, qty]) => {
      const svc = SERVICE_PAGES_DATA.find((s) => s.id === id);
      return {
        id,
        name: svc ? svc.name : id,
        qty,
        price: svc ? svc.price : 0,
        subtotal: svc ? svc.price * qty : 0,
      };
    });

  const selectedPackagesCount = selectedPackagesDetailed.length;
  const finalTotal = selectedPackagesDetailed.reduce(
    (sum, item) => sum + item.subtotal,
    0,
  );
  const totalLinks = selectedPackagesDetailed.reduce(
    (sum, item) => sum + item.qty,
    0,
  );

  const handlePaymentSuccess = (transactionId, method) => {
    setIsCheckoutGatewayOpen(false);
    setCompletedPayment({ transactionId, method });
    setIsOrderModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const calcCategories = [
    { id: "all", label: "All Services (12)", shortLabel: "All (12)" },
    { id: "standard", label: "Standard PBN (3)", shortLabel: "Standard (3)" },
    { id: "id_net", label: ".ID Regional (3)", shortLabel: ".ID Net (3)" },
    { id: "edu_gov", label: "EDU & GOV (3)", shortLabel: "EDU/GOV (3)" },
    { id: "solutions", label: "SEO Packages (3)", shortLabel: "Packages (3)" },
  ];

  const filteredCalcServices =
    calcCategory === "all"
      ? SERVICE_PAGES_DATA
      : SERVICE_PAGES_DATA.filter((s) => s.category === calcCategory);

  const quickPresets = [50, 100, 250, 500, 1000];

  return (
    <main className="w-full bg-[#fcfcfc] relative overflow-x-clip pt-[68px] sm:pt-[80px] pb-20 sm:pb-0">
      <style>{`
        .bg-dotted-grid { background-image: radial-gradient(circle, #d0d7de 1px, transparent 1px); background-size: 28px 28px; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f3f4; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #dadce0; border-radius: 4px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; height: 22px; width: 22px; border-radius: 50%;
          background: #ffffff; border: 3px solid #1a73e8; cursor: pointer;
          box-shadow: 0 2px 6px rgba(26, 115, 232, 0.35); transition: transform 0.15s ease;
        }
        input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.12); }
        input[type=range]::-moz-range-thumb {
          height: 22px; width: 22px; border-radius: 50%;
          background: #ffffff; border: 3px solid #1a73e8; cursor: pointer;
          box-shadow: 0 2px 6px rgba(26, 115, 232, 0.35); transition: transform 0.15s ease;
        }
      `}</style>

      {/* --- 1. DEDICATED 2-COLUMN SERVICE HERO & INSTANT ORDER CONFIGURATOR --- */}
      <section className="relative w-full bg-white py-8 sm:py-14 lg:py-20 px-4 sm:px-6 border-b border-[#e8eaed] overflow-hidden">
        <div className="absolute inset-0 bg-dotted-grid [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] opacity-45 pointer-events-none" />

        <div className="max-w-[1200px] mx-auto relative z-10">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-[12px] sm:text-[13px] text-[#5f6368] mb-5 overflow-x-auto no-scrollbar whitespace-nowrap">
            <Link to="/" className="hover:text-[#1a73e8] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              to="/services"
              className="hover:text-[#1a73e8] transition-colors"
            >
              Services
            </Link>
            <span>/</span>
            <span className="text-[#202124] font-medium">
              {currentService.name}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* LEFT 7 COLUMNS: SERVICE OVERVIEW & TECHNICAL SPECS */}
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span
                  className={`text-[11.5px] sm:text-[12px] font-semibold px-3 py-1 rounded-full ${currentService.badgeColor}`}
                >
                  {currentService.badge}
                </span>
                <span className="text-[11.5px] sm:text-[12px] font-medium bg-[#f8f9fa] text-[#3c4043] border border-[#dadce0] px-3 py-1 rounded-full">
                  {currentService.categoryLabel}
                </span>
                <span className="text-[11.5px] sm:text-[12px] font-semibold bg-[#e6f4ea] text-[#1e8e3e] border border-[#ceead6] px-3 py-1 rounded-full">
                  ● Verified {currentService.metric}
                </span>
              </div>

              <h2 className="gw-font-display text-[28px] sm:text-[42px] lg:text-[48px] font-medium text-[#202124] leading-[1.12] tracking-[-0.025em] mb-4">
                {currentService.heroHeadline}{" "}
                <span className="text-[#1a73e8]">
                  {currentService.heroHighlight}
                </span>
              </h2>

              <p className="gw-font-text text-[14.5px] sm:text-[16.5px] text-[#5f6368] leading-[1.65] mb-6">
                {currentService.desc}
              </p>

              {/* Key Technical Metadata Strip */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-4 p-3.5 sm:p-4 rounded-[18px] bg-[#f8f9fa] border border-[#e8eaed] mb-6">
                <div>
                  <span className="block text-[10.5px] sm:text-[11px] uppercase tracking-wider text-[#5f6368] font-medium">
                    Price Per Link
                  </span>
                  <span className="gw-font-display text-[17px] sm:text-[22px] font-semibold text-[#1a73e8]">
                    ${currentService.price.toFixed(2)} USD
                  </span>
                </div>
                <div className="border-x border-[#dadce0] px-2.5 sm:px-4">
                  <span className="block text-[10.5px] sm:text-[11px] uppercase tracking-wider text-[#5f6368] font-medium">
                    Supported TLDs
                  </span>
                  <span className="gw-font-display text-[13px] sm:text-[15px] font-semibold text-[#202124] block mt-0.5">
                    {currentService.tlds}
                  </span>
                </div>
                <div>
                  <span className="block text-[10.5px] sm:text-[11px] uppercase tracking-wider text-[#5f6368] font-medium">
                    Turnaround
                  </span>
                  <span className="gw-font-display text-[13px] sm:text-[15px] font-semibold text-[#1e8e3e] block mt-0.5">
                    ⏱ {currentService.turnaround}
                  </span>
                </div>
              </div>

              {/* 4 Included Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {currentService.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3.5 rounded-[14px] bg-white border border-[#e8eaed] shadow-[0_1px_3px_rgba(60,64,67,0.03)]"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#e6f4ea] text-[#1e8e3e] flex items-center justify-center shrink-0 mt-0.5">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2.8"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="text-[13px] sm:text-[13.5px] text-[#3c4043] font-medium leading-snug">
                      {feat}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-[12.5px] text-[#5f6368]">
                <span>Want to combine this with other placements?</span>
                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById("estimator")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="text-[#1a73e8] font-semibold hover:underline cursor-pointer"
                >
                  Open Multi-Service Bulk Calculator Below ↓
                </button>
              </div>
            </div>

            {/* RIGHT 5 COLUMNS: DEDICATED INSTANT ORDER CONFIGURATOR CARD */}
            <div className="lg:col-span-5 w-full">
              <div className="bg-white rounded-[24px] border border-[#dadce0] shadow-[0_16px_44px_rgba(60,64,67,0.10)] overflow-hidden">
                <div className="grid grid-cols-4 h-[4px] w-full">
                  <div className="bg-[#4285F4]" />
                  <div className="bg-[#EA4335]" />
                  <div className="bg-[#FBBC04]" />
                  <div className="bg-[#34A853]" />
                </div>

                <div className="p-5 sm:p-6 lg:p-7">
                  <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-[#e8eaed]">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1a73e8] block">
                        Instant Campaign Configurator
                      </span>
                      <h2 className="gw-font-display text-[19px] sm:text-[21px] font-medium text-[#202124]">
                        {currentService.name}
                      </h2>
                    </div>
                    <span className="gw-font-display text-[14px] font-semibold text-[#1a73e8] bg-[#e8f0fe] px-3 py-1 rounded-full">
                      ${currentService.price.toFixed(2)}/link
                    </span>
                  </div>

                  {/* Quick Volume Pills */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[12.5px] font-medium text-[#5f6368]">
                        Select Volume (Min 50 Links):
                      </span>
                      <span className="text-[12px] font-semibold text-[#1e8e3e]">
                        {heroQty.toLocaleString()} Links Selected
                      </span>
                    </div>
                    <div className="grid grid-cols-5 gap-1.5">
                      {quickPresets.map((vol) => (
                        <button
                          key={vol}
                          type="button"
                          onClick={() => updateHeroQty(vol)}
                          className={`py-2 rounded-[10px] text-[12px] font-medium border transition-all cursor-pointer ${
                            heroQty === vol
                              ? "bg-[#1a73e8] border-[#1a73e8] text-white font-semibold shadow-sm"
                              : "bg-[#f8f9fa] border-[#e8eaed] text-[#3c4043] hover:border-[#d2e3fc]"
                          }`}
                        >
                          {vol === 1000 ? "1k" : vol}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Piecewise Slider inside Hero Card */}
                  <div className="mb-5 bg-[#f8f9fa] p-3.5 rounded-[16px] border border-[#e8eaed]">
                    <div className="relative flex items-center h-6">
                      <input
                        type="range"
                        min="100"
                        max="600"
                        step="1"
                        value={Math.max(100, heroSliderPos)}
                        onChange={(e) => handleHeroSliderChange(e.target.value)}
                        className="w-full h-[8px] bg-[#e8eaed] rounded-full appearance-none cursor-pointer focus:outline-none relative z-20"
                        style={{
                          background: `linear-gradient(to right, #1a73e8 0%, #1a73e8 ${
                            ((Math.max(100, heroSliderPos) - 100) / 500) * 100
                          }%, #dadce0 ${
                            ((Math.max(100, heroSliderPos) - 100) / 500) * 100
                          }%, #dadce0 100%)`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10.5px] text-[#5f6368] font-medium mt-1 px-0.5">
                      <span>50 (Min)</span>
                      <span>1k</span>
                      <span>2k</span>
                      <span>3k</span>
                      <span>4k</span>
                      <span>5k</span>
                    </div>
                  </div>

                  {/* Custom Quantity Stepper & Live Total Box */}
                  <div className="bg-[#f8fbff] rounded-[16px] p-4 border border-[#d2e3fc] mb-5 flex items-center justify-between gap-3">
                    <div>
                      <span className="block text-[11px] font-medium text-[#5f6368] mb-1">
                        Exact Link Quantity
                      </span>
                      <div className="flex items-center bg-white border border-[#dadce0] rounded-full p-0.5">
                        <button
                          type="button"
                          onClick={() => updateHeroQty(heroQty - 50)}
                          className="w-7 h-7 rounded-full text-[#5f6368] hover:bg-[#f1f3f4] flex items-center justify-center font-bold cursor-pointer"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="50"
                          max="5000"
                          step="50"
                          value={heroQty}
                          onChange={(e) => updateHeroQty(e.target.value)}
                          className="w-[58px] text-center bg-transparent text-[13.5px] font-bold text-[#202124] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => updateHeroQty(heroQty + 50)}
                          className="w-7 h-7 rounded-full text-[#1a73e8] hover:bg-[#e8f0fe] flex items-center justify-center font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="block text-[11px] font-medium text-[#5f6368]">
                        Total Investment
                      </span>
                      <span className="gw-font-display text-[26px] sm:text-[28px] font-semibold text-[#1a73e8] leading-none">
                        $
                        {heroTotalAmount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                      <span className="block text-[10.5px] text-[#1e8e3e] font-medium mt-0.5">
                        ● White-Label Report Included
                      </span>
                    </div>
                  </div>

                  {/* Direct Instant Checkout Gateways */}
                  <div className="space-y-2.5">
                    <button
                      type="button"
                      onClick={handleHeroDirectOrder}
                      disabled={isInitializing || isRedirectingBoomFi}
                      className="gw-font-display w-full h-[48px] sm:h-[50px] rounded-full bg-[#635bff] hover:bg-[#635bff] text-[#f6f9fc] font-medium text-[14.5px] sm:text-[15px] shadow-[0_6px_20px_rgba(26,115,232,0.25)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <svg
  className="w-8   h-4"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 468 222.5"
  fill="white"
  role="img"
  aria-label="Stripe"
>
  <g>
    <path d="M414,113.4c0-25.6-12.4-45.8-36.1-45.8c-23.8,0-38.2,20.2-38.2,45.6c0,30.1,17,45.3,41.4,45.3c11.9,0,20.9-2.7,27.7-6.5v-20c-6.8,3.4-14.6,5.5-24.5,5.5c-9.7,0-18.3-3.4-19.4-15.2h48.9C413.8,121,414,115.8,414,113.4z M364.6,103.9c0-11.3,6.9-16,13.2-16c6.1,0,12.6,4.7,12.6,16H364.6z" />
    <path d="M301.1,67.6c-9.8,0-16.1,4.6-19.6,7.8l-1.3-6.2h-22v116.6l25-5.3l0.1-28.3c3.6,2.6,8.9,6.3,17.7,6.3c17.9,0,34.2-14.4,34.2-46.1C335.1,83.4,318.6,67.6,301.1,67.6z M295.1,136.5c-5.9,0-9.4-2.1-11.8-4.7l-0.1-37.1c2.6-2.9,6.2-4.9,11.9-4.9c9.1,0,15.4,10.2,15.4,23.3C310.5,126.5,304.3,136.5,295.1,136.5z" />
    <polygon points="223.8,61.7 248.9,56.3 248.9,36 223.8,41.3" />
    <rect x="223.8" y="69.3" width="25.1" height="87.5" />
    <path d="M196.9,76.7l-1.6-7.4h-21.6v87.5h25V97.5c5.9-7.7,15.9-6.3,19-5.2v-23C214.5,68.1,202.8,65.9,196.9,76.7z" />
    <path d="M146.9,47.6l-24.4,5.2l-0.1,80.1c0,14.8,11.1,25.7,25.9,25.7c8.2,0,14.2-1.5,17.5-3.3V135c-3.2,1.3-19,5.9-19-8.9V90.6h19V69.3h-19L146.9,47.6z" />
    <path d="M79.3,94.7c0-3.9,3.2-5.4,8.5-5.4c7.6,0,17.2,2.3,24.8,6.4V72.2c-8.3-3.3-16.5-4.6-24.8-4.6C67.5,67.6,54,78.2,54,95.9c0,27.6,38,23.2,38,35.1c0,4.6-4,6.1-9.6,6.1c-8.3,0-18.9-3.4-27.3-8v23.8c9.3,4,18.7,5.7,27.3,5.7c20.8,0,35.1-10.3,35.1-28.2C117.4,100.6,79.3,105.9,79.3,94.7z" />
  </g>
</svg>
                      <span>
                        Order {heroQty.toLocaleString()} Links ($
                        {heroTotalAmount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                        )
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleBoomFiDirectCheckout({
                          [currentService.id]: heroQty,
                        })
                      }
                      disabled={isInitializing || isRedirectingBoomFi}
                      className="gw-font-display w-full h-[44px] sm:h-[46px] rounded-full border border-[#dadce0] bg-[#d5ff2e] hover:bg-[#c2ed1] text-[#202124] font-medium text-[13.5px] sm:text-[14px] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <svg
  className="w-4 h-4 text-black"
  xmlns="http://www.w3.org/2000/svg"
  width="100%"
  height="100%"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth={2}
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M6 6h8a3 3 0 0 1 0 6a3 3 0 0 1 0 6h-8" />
  <path d="M8 6v12" />
  <path d="M8 12h6" />
  <path d="M9 3v3" />
  <path d="M13 3v3" />
  <path d="M9 18v3" />
  <path d="M13 18v3" />
</svg>
                      {isRedirectingBoomFi
                        ? "Redirecting to BoomFi Gateway..."
                        : "Pay with Crypto (BoomFi)"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 2. SERVICE DELIVERABLES & TECHNICAL ARCHITECTURE SECTION --- */}
      <section className="w-full bg-white py-12 sm:py-16 px-4 sm:px-6 border-b border-[#e8eaed]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-[720px] mx-auto mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f8f9fa] border border-[#e8eaed] text-[#5f6368] text-[12px] font-medium mb-3">
              Technical Specifications
            </div>
            <h2 className="gw-font-display text-[24px] sm:text-[34px] font-medium text-[#202124] leading-[1.15]">
              Why agencies choose our{" "}
              <span className="text-[#1a73e8]">{currentService.name}.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {currentService.deliverables.map((item, i) => (
              <div
                key={i}
                className="bg-[#f8f9fa] hover:bg-white rounded-[20px] sm:rounded-[24px] p-6 sm:p-7 border border-[#e8eaed] hover:border-[#d2e3fc] hover:shadow-[0_12px_32px_rgba(26,115,232,0.06)] transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-[12px] bg-[#e8f0fe] text-[#1a73e8] font-bold text-[14px] flex items-center justify-center mb-4">
                  0{i + 1}
                </div>
                <h2 className="gw-font-display text-[18px] sm:text-[20px] font-medium text-[#202124] mb-2">
                  {item.title}
                </h2>
                <p className="gw-font-text text-[13.5px] sm:text-[14.5px] text-[#5f6368] leading-[1.6]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 3. INTERACTIVE BULK COST CALCULATOR (COMBINE WITH OTHER SERVICES) --- */}
      <section
        id="estimator"
        className="w-full bg-[#f8f9fa] py-12 sm:py-20 px-4 sm:px-6 border-b border-[#e8eaed]"
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-8 sm:mb-10 max-w-[740px] mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#e8f0fe] text-[#1a73e8] text-[11.5px] sm:text-[12.5px] font-medium mb-3">
              <span className="w-2 h-2 rounded-full bg-[#1a73e8] animate-pulse" />
              Multi-Service Bundle Calculator
            </div>
            <h2 className="gw-font-display text-[26px] sm:text-[36px] md:text-[42px] font-medium text-[#202124] leading-[1.15] tracking-[-0.025em] mb-2.5">
              Combine <span className="text-[#1a73e8]">{currentService.name}</span>{" "}
              with other networks.
            </h2>
            <p className="gw-font-text text-[14px] sm:text-[16px] text-[#5f6368] leading-[1.6]">
              Your current selection is pre-loaded below. Add any other PBN,
              .ID, or EDU/GOV placements to build a custom agency bundle.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start gap-6 sm:gap-8 xl:gap-10 relative">
            {/* Left Column: Sliders Builder */}
            <div className="flex-1 w-full min-w-0">
              <div className="bg-white p-3.5 sm:p-4 rounded-[20px] border border-[#e8eaed] shadow-[0_1px_3px_rgba(60,64,67,0.03)] mb-4 sm:mb-5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                    {calcCategories.map((cat) => {
                      const active = calcCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCalcCategory(cat.id)}
                          className={`text-[12px] sm:text-[12.5px] font-medium px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap cursor-pointer ${
                            active
                              ? "bg-[#1a73e8] text-white shadow-sm"
                              : "bg-[#f8f9fa] text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4]"
                          }`}
                        >
                          <span className="sm:hidden">{cat.shortLabel}</span>
                          <span className="hidden sm:inline">{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Calculator Slider Rows */}
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                {filteredCalcServices.map((service) => {
                  const currentQty = checkoutCart[service.id] || 0;
                  const isActive = currentQty > 0;
                  const isCurrentPageService = service.id === currentService.id;
                  const sliderPos = qtyToSliderPos(currentQty);
                  const fillPercent = Math.min(
                    100,
                    Math.max(0, (sliderPos / 600) * 100),
                  );

                  return (
                    <div
                      key={service.id}
                      className={`rounded-[18px] sm:rounded-[20px] border transition-all duration-200 ${
                        isActive
                          ? "p-4 sm:p-5 bg-[#f8fbff] border-[#1a73e8] ring-2 ring-[#e8f0fe]/70"
                          : "p-3.5 sm:p-5 bg-white border-[#e8eaed] hover:border-[#dadce0]"
                      }`}
                    >
                      <div
                        onClick={() => {
                          if (!isActive) setCalcServiceQty(service.id, 50);
                        }}
                        className={`flex justify-between items-center gap-2 ${
                          isActive ? "mb-3 sm:mb-4" : "sm:mb-4 cursor-pointer"
                        }`}
                      >
                        <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCalcServiceQty(service.id, isActive ? 0 : 50);
                            }}
                            className={`mt-0.5 w-5 h-5 rounded-[6px] flex items-center justify-center border transition-colors cursor-pointer shrink-0 ${
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
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                              <h2 className="gw-font-display text-[15px] sm:text-[17px] font-medium text-[#202124] leading-snug">
                                {service.name}
                              </h2>
                              {isCurrentPageService && (
                                <span className="text-[10px] font-semibold bg-[#e6f4ea] text-[#1e8e3e] px-2 py-0.5 rounded-full">
                                  Current Page
                                </span>
                              )}
                              <span className="text-[10px] sm:text-[11px] font-medium bg-[#f1f3f4] text-[#5f6368] px-1.5 sm:px-2 py-0.5 rounded-md">
                                {service.metric}
                              </span>
                            </div>
                            <p className="gw-font-text text-[12px] sm:text-[13px] text-[#5f6368] mt-0.5 leading-snug truncate sm:whitespace-normal">
                              {service.shortSubtitle}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="gw-font-display text-[13px] sm:text-[14.5px] font-medium text-[#1a73e8] bg-white border border-[#d2e3fc] px-2.5 sm:px-3 py-1 rounded-full whitespace-nowrap">
                            ${service.price.toFixed(2)}
                            <span className="text-[10.5px] sm:text-[12px] font-normal text-[#5f6368]">
                              /link
                            </span>
                          </span>
                        </div>
                      </div>

                      <div
                        className={`${
                          isActive ? "flex" : "hidden sm:flex"
                        } flex-col sm:flex-row sm:items-center gap-3.5 sm:gap-5 mt-2`}
                      >
                        <div className="flex-1">
                          <div className="relative flex items-center h-7">
                            <div className="absolute inset-x-[10px] flex justify-between items-center pointer-events-none z-10">
                              {SLIDER_STOPS.map((stopVal, idx) => {
                                const stopPos = idx * 100;
                                const isReached =
                                  sliderPos >= stopPos && currentQty > 0;
                                return (
                                  <span
                                    key={stopVal}
                                    className={`w-2 h-2 rounded-full transition-colors ${
                                      isReached
                                        ? "bg-white ring-2 ring-[#1a73e8]"
                                        : "bg-[#bdc1c6]"
                                    }`}
                                  />
                                );
                              })}
                            </div>

                            <input
                              type="range"
                              min="0"
                              max="600"
                              step="1"
                              value={sliderPos}
                              onChange={(e) =>
                                handleCalcSliderPosChange(
                                  service.id,
                                  e.target.value,
                                )
                              }
                              className="w-full h-[8px] bg-[#e8eaed] rounded-full appearance-none cursor-pointer focus:outline-none relative z-20 touch-pan-y"
                              style={{
                                background: `linear-gradient(to right, #1a73e8 0%, #1a73e8 ${fillPercent}%, #e8eaed ${fillPercent}%, #e8eaed 100%)`,
                              }}
                            />
                          </div>

                          <div className="relative h-6 mt-1">
                            {SLIDER_STOPS.map((stopVal, idx) => {
                              const leftPct = (idx / 6) * 100;
                              const isCurrentStop =
                                currentQty === stopVal &&
                                (stopVal > 0 || currentQty === 0);
                              const alignClass =
                                idx === 0
                                  ? "left-0 translate-x-0"
                                  : idx === 6
                                    ? "right-0 translate-x-0"
                                    : "-translate-x-1/2";

                              return (
                                <button
                                  key={stopVal}
                                  type="button"
                                  onClick={() =>
                                    setCalcServiceQty(service.id, stopVal)
                                  }
                                  style={
                                    idx > 0 && idx < 6
                                      ? { left: `${leftPct}%` }
                                      : undefined
                                  }
                                  className={`absolute top-0 ${alignClass} text-[10.5px] sm:text-[11px] font-medium px-1.5 py-0.5 rounded-full transition-colors cursor-pointer whitespace-nowrap ${
                                    isCurrentStop && stopVal > 0
                                      ? "bg-[#1a73e8] text-white font-semibold"
                                      : "text-[#5f6368] hover:text-[#1a73e8] hover:bg-[#e8f0fe]/70"
                                  }`}
                                >
                                  {stopVal === 0 ? (
                                    "Off"
                                  ) : stopVal === 50 ? (
                                    <>
                                      50
                                      <span className="hidden sm:inline">
                                        {" "}
                                        (Min)
                                      </span>
                                    </>
                                  ) : (
                                    `${stopVal / 1000}k`
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#e8eaed]/80">
                          <div className="flex items-center bg-white border border-[#dadce0] rounded-full p-0.5 sm:p-1">
                            <button
                              type="button"
                              onClick={() =>
                                setCalcServiceQty(
                                  service.id,
                                  currentQty === 50 ? 0 : currentQty - 50,
                                )
                              }
                              className="w-7 h-7 rounded-full text-[#5f6368] hover:bg-[#f1f3f4] flex items-center justify-center cursor-pointer font-medium"
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
                                setCalcServiceQty(service.id, e.target.value)
                              }
                              className="w-[54px] sm:w-[60px] text-center bg-transparent text-[13.5px] sm:text-[14px] font-semibold text-[#202124] focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setCalcServiceQty(
                                  service.id,
                                  currentQty === 0 ? 50 : currentQty + 50,
                                )
                              }
                              className="w-7 h-7 rounded-full text-[#1a73e8] hover:bg-[#e8f0fe] flex items-center justify-center cursor-pointer font-medium"
                            >
                              +
                            </button>
                          </div>

                          <div className="min-w-[82px] text-right">
                            <span className="block text-[10px] sm:text-[11px] text-[#5f6368]">
                              Subtotal
                            </span>
                            <span
                              className={`gw-font-display text-[14px] sm:text-[15px] font-semibold ${
                                isActive ? "text-[#1a73e8]" : "text-[#9aa0a6]"
                              }`}
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

            {/* Right Column: Sticky Order Summary */}
            <aside className="w-full lg:w-[390px] xl:w-[420px] shrink-0 lg:sticky lg:top-[96px] self-start">
              <div className="bg-white rounded-[22px] sm:rounded-[24px] border border-[#dadce0] shadow-[0_12px_36px_rgba(60,64,67,0.08)] overflow-hidden flex flex-col">
                <div className="grid grid-cols-4 h-[4px] w-full">
                  <div className="bg-[#4285F4]" />
                  <div className="bg-[#EA4335]" />
                  <div className="bg-[#FBBC04]" />
                  <div className="bg-[#34A853]" />
                </div>

                <div className="p-5 sm:p-6 lg:p-7 flex flex-col">
                  <div className="flex items-center justify-between mb-4 border-b border-[#e8eaed] pb-3.5">
                    <div>
                      <h2 className="gw-font-display text-[19px] sm:text-[20px] font-medium text-[#202124]">
                        Bundle Summary
                      </h2>
                      <p className="text-[12px] text-[#5f6368] mt-0.5">
                        {selectedPackagesCount}{" "}
                        {selectedPackagesCount === 1
                          ? "service selected"
                          : "services selected"}
                      </p>
                    </div>
                    {selectedPackagesCount > 0 && (
                      <button
                        type="button"
                        onClick={() => setCheckoutCart({})}
                        className="text-[12px] font-medium text-[#d93025] hover:bg-[#fce8e6] px-3 py-1 rounded-full transition-colors cursor-pointer"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto max-h-[240px] mb-4 pr-1 space-y-2 custom-scrollbar">
                    {selectedPackagesDetailed.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center bg-[#f8f9fa] px-3 py-2.5 rounded-[12px] border border-[#e8eaed]"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-[11.5px] font-bold bg-[#e8f0fe] text-[#1a73e8] px-2 py-0.5 rounded-full shrink-0">
                            {item.qty.toLocaleString()}
                          </span>
                          <span className="text-[13px] font-medium text-[#202124] truncate">
                            {item.name}
                          </span>
                        </div>
                        <span className="text-[13px] font-semibold text-[#202124] pl-2">
                          $
                          {item.subtotal.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#f8f9fa] rounded-[16px] p-4 mb-4 border border-[#e8eaed]">
                    <div className="flex justify-between items-center mb-2 text-[12.5px] text-[#5f6368]">
                      <span>Total Volume</span>
                      <span className="font-semibold text-[#1a73e8] bg-[#e8f0fe] px-2.5 py-0.5 rounded-full">
                        {totalLinks.toLocaleString()} Backlinks
                      </span>
                    </div>
                    <div className="flex justify-between items-end pt-2 border-t border-[#dadce0]">
                      <span className="gw-font-display text-[14.5px] font-medium text-[#202124]">
                        Estimated Total
                      </span>
                      <span className="gw-font-display text-[26px] font-medium text-[#1a73e8] leading-none">
                        $
                        {finalTotal.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        <span className="text-[12px] text-[#5f6368]">USD</span>
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <button
                      type="button"
                      onClick={() => openCheckoutModalWithCart(checkoutCart)}
                      disabled={totalLinks === 0 || isInitializing}
                      className="gw-font-display w-full h-[48px] sm:h-[50px] rounded-full bg-[#635bff] text-[#f6f9fc] font-medium text-[14.5px] sm:text-[15px] hover:bg-[#635bff] hover:shadow-[0_4px_14px_rgba(26,115,232,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Pay with Card (Instant)
                    </button>

                    {totalLinks > 0 && (
                      <PayPalScriptProvider
                        options={{
                          "client-id": PAYPAL_CLIENT_ID,
                          currency: "USD",
                          intent: "capture",
                        }}
                      >
                        <PayPalButtons
                          style={{
                            layout: "horizontal",
                            height: 46,
                            color: "gold",
                            shape: "pill",
                            tagline: false,
                          }}
                          createOrder={async () => {
                            const { data } = await axios.post(
                              `${BACKEND_URL}/api/create-paypal-order`,
                              { cart: checkoutCart },
                            );
                            return data.id;
                          }}
                          onApprove={async (data) => {
                            const res = await axios.post(
                              `${BACKEND_URL}/api/capture-paypal-order`,
                              { orderID: data.orderID },
                            );
                            handlePaymentSuccess(
                              res.data?.captureId || data.orderID,
                              "PayPal Checkout",
                            );
                          }}
                        />
                      </PayPalScriptProvider>
                    )}

                    <button
                      type="button"
                      onClick={() => handleBoomFiDirectCheckout(checkoutCart)}
                      disabled={totalLinks === 0 || isRedirectingBoomFi}
                      className="gw-font-display w-full h-[46px] rounded-full border border-[#dadce0] bg-[#d5ff2e] hover:bg-[#f8f9fa] text-[#202124] font-medium text-[14px] cursor-pointer disabled:opacity-50"
                    >
                      {isRedirectingBoomFi
                        ? "Redirecting to BoomFi Gateway..."
                        : "Pay with Crypto (BoomFi)"}
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* --- 4. SERVICE-SPECIFIC FAQ SECTION --- */}
      <section className="w-full bg-white py-12 sm:py-16 px-4 sm:px-6 border-b border-[#e8eaed]">
        <div className="max-w-[860px] mx-auto">
          <div className="text-center mb-8">
            <h2 className="gw-font-display text-[24px] sm:text-[32px] font-medium text-[#202124]">
              {currentService.name}{" "}
              <span className="text-[#1a73e8]">FAQs.</span>
            </h2>
          </div>
          <div className="space-y-3">
            {currentService.faqs.map((faq, idx) => {
              const open = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-[16px] border transition-all ${
                    open
                      ? "bg-[#f8fbff] border-[#d2e3fc]"
                      : "bg-white border-[#e8eaed]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(open ? -1 : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="gw-font-display text-[15px] sm:text-[16.5px] font-medium text-[#202124]">
                      {faq.q}
                    </span>
                    <span className="text-[#1a73e8] font-bold">
                      {open ? "−" : "+"}
                    </span>
                  </button>
                  {open && (
                    <div className="px-5 pb-4 text-[13.5px] sm:text-[14.5px] text-[#5f6368] leading-[1.6]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- 5. EXPLORE ALL 12 DEDICATED SERVICES DIRECTORY --- */}
      <section className="w-full bg-[#f8f9fa] py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-7">
            <div>
              <h2 className="gw-font-display text-[22px] sm:text-[28px] font-medium text-[#202124]">
                Explore All 12{" "}
                <span className="text-[#1a73e8]">SEO & PBN Services</span>
              </h2>
              <p className="text-[13.5px] text-[#5f6368]">
                Switch between any of our dedicated placement and managed
                campaign pages below:
              </p>
            </div>
            <Link
              to="/services"
              className="text-[13px] font-semibold text-[#1a73e8] hover:underline"
            >
              View Full Catalogue →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {SERVICE_PAGES_DATA.map((item) => {
              const active = item.id === currentService.id;
              return (
                <Link
                  key={item.id}
                  to={`/services/${item.slug}`}
                  className={`p-4 rounded-[16px] border transition-all flex flex-col justify-between ${
                    active
                      ? "bg-[#e8f0fe]/60 border-[#1a73e8] shadow-sm"
                      : "bg-white border-[#e8eaed] hover:border-[#d2e3fc] hover:shadow-sm"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10.5px] font-semibold text-[#5f6368] uppercase">
                        {item.categoryLabel}
                      </span>
                      <span className="text-[12px] font-bold text-[#1a73e8]">
                        ${item.price.toFixed(2)}/link
                      </span>
                    </div>
                    <h2 className="gw-font-display text-[15px] font-medium text-[#202124]">
                      {item.name}
                    </h2>
                    <p className="text-[12px] text-[#5f6368] mt-0.5">
                      {item.shortSubtitle}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- POPUP 1: UNIFIED CHECKOUT GATEWAY MODAL --- */}
      {isCheckoutGatewayOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="absolute inset-0 bg-[#202124]/55 backdrop-blur-[3px]"
            onClick={closeGatewayModal}
          />
          <div className="relative w-full max-w-[460px] max-h-[92dvh] overflow-y-auto bg-white rounded-t-[24px] sm:rounded-[24px] shadow-[0_24px_60px_rgba(0,0,0,0.25)] border border-[#dadce0] animate-in fade-in zoom-in-95 duration-200">
            <div className="grid grid-cols-4 h-[4px] w-full sticky top-0 z-20">
              <div className="bg-[#4285F4]" />
              <div className="bg-[#EA4335]" />
              <div className="bg-[#FBBC04]" />
              <div className="bg-[#34A853]" />
            </div>

            <div className="bg-[#f8fbff] px-5 py-4 sm:px-6 sm:py-5 border-b border-[#e8eaed] relative">
              <button
                type="button"
                onClick={closeGatewayModal}
                className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-1.5 rounded-full hover:bg-[#e8eaed] text-[#5f6368] cursor-pointer"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e8f0fe] text-[#1a73e8] text-[11px] font-medium mb-1.5">
                Step 1 of 3 • Secure Checkout
              </div>
              <p className="text-[#5f6368] text-[12.5px] mb-0.5 pr-6 truncate">
                {selectedPackagesDetailed.map((p) => p.name).join(" + ")} (
                {totalLinks.toLocaleString()} Links)
              </p>
              <h2 className="gw-font-display text-[28px] sm:text-[32px] font-medium text-[#202124] leading-none">
                $
                {finalTotal.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                <span className="text-[12.5px] font-normal text-[#5f6368]">
                  USD
                </span>
              </h2>
            </div>

            <div className="p-5 sm:p-6 space-y-4">
              {isInitializing ? (
                <div className="py-8 text-center text-[13.5px] text-[#5f6368]">
                  Preparing secure 256-bit payment session...
                </div>
              ) : clientSecret ? (
                <Elements stripe={stripePromise}>
                  <CustomStripeCardForm
                    clientSecret={clientSecret}
                    totalAmount={finalTotal}
                    onSuccess={handlePaymentSuccess}
                  />
                </Elements>
              ) : null}

              {paymentError && (
                <div className="p-3 rounded-[12px] bg-[#fce8e6] border border-[#fad2cf] text-[#d93025] text-[12px]">
                  {paymentError}
                </div>
              )}

              <div className="pt-3 border-t border-[#e8eaed] space-y-2.5">
                <p className="text-[11.5px] text-[#5f6368] text-center font-medium">
                  Or express checkout with PayPal / Crypto
                </p>

                <PayPalScriptProvider
                  options={{
                    "client-id": PAYPAL_CLIENT_ID,
                    currency: "USD",
                    intent: "capture",
                  }}
                >
                  <PayPalButtons
                    style={{
                      layout: "horizontal",
                      height: 44,
                      color: "gold",
                      shape: "pill",
                      tagline: false,
                    }}
                    createOrder={async () => {
                      const { data } = await axios.post(
                        `${BACKEND_URL}/api/create-paypal-order`,
                        { cart: checkoutCart },
                      );
                      return data.id;
                    }}
                    onApprove={async (data) => {
                      const res = await axios.post(
                        `${BACKEND_URL}/api/capture-paypal-order`,
                        { orderID: data.orderID },
                      );
                      handlePaymentSuccess(
                        res.data?.captureId || data.orderID,
                        "PayPal Checkout",
                      );
                    }}
                  />
                </PayPalScriptProvider>

                <button
                  type="button"
                  onClick={() => handleBoomFiDirectCheckout(checkoutCart)}
                  disabled={isRedirectingBoomFi}
                  className="gw-font-display w-full h-[48px] sm:h-[50px] rounded-full border border-[#dadce0] bg-[#d5ff2e] text-[#202124] font-medium text-[14px] sm:text-[14.5px] hover:bg-[#c2ed15] hover:border-[#bdc1c6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <svg
  className="w-4 h-4 text-black"
  xmlns="http://www.w3.org/2000/svg"
  width="100%"
  height="100%"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth={2}
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M6 6h8a3 3 0 0 1 0 6a3 3 0 0 1 0 6h-8" />
  <path d="M8 6v12" />
  <path d="M8 12h6" />
  <path d="M9 3v3" />
  <path d="M13 3v3" />
  <path d="M9 18v3" />
  <path d="M13 18v3" />
</svg>
                  {isRedirectingBoomFi
                    ? "Redirecting to BoomFi Gateway..."
                    : "Pay with Crypto (BoomFi)"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- POPUP 2 & POPUP 3: ORDER INTAKE + THANK YOU & 3 TEAM CONTACTS --- */}
      <OrderOnboardingFlowModal
        isOpen={isOrderModalOpen}
        paymentData={completedPayment}
        selectedPackages={selectedPackagesDetailed}
        totalLinks={totalLinks}
        finalTotal={finalTotal}
        onClose={() => {
          setIsOrderModalOpen(false);
          setCompletedPayment(null);
          document.body.style.overflow = "auto";
        }}
      />
    </main>
  );
}