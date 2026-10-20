import { useState, useEffect } from "react";
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
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const BOOMFI_ORDER_STORAGE_KEY = "jasa_pending_boomfi_order";

function readBoomFiReturnState() {
  const params = new URLSearchParams(window.location.search);
  const status = params.get("boomfi_status");
  let savedOrder = null;

  try {
    const rawOrder = localStorage.getItem(BOOMFI_ORDER_STORAGE_KEY);
    savedOrder = rawOrder ? JSON.parse(rawOrder) : null;
  } catch (error) {
    console.warn("Could not restore pending BoomFi order:", error);
  }

  return {
    status,
    savedOrder,
    transactionId:
      params.get("tx") ||
      params.get("payment_id") ||
      savedOrder?.transactionId ||
      null,
  };
}

// --- YOUR 3 OFFICIAL TEAM CONTACTS (SHOWN IN POPUP 3) ---
const TEAM_CONTACTS = {
  whatsappUrl: "https://wa.me/447598789693",
  whatsappLabel: "+44 7598789693",
  telegramUrl: "https://t.me/SEOHUBLTD",
  telegramLabel: "@SEOHUBLTD",
  supportEmail: "hello@jasabacklinks.net",
};

const GUEST_POSTING_OPTIONS = {
  da: [30, 40, 50, 60],
  dr: [30, 40, 50, 60],
  niches: [
    { id: "general", label: "General" },
    { id: "business", label: "Business" },
    { id: "technology", label: "Technology" },
    { id: "health", label: "Health & Wellness" },
    { id: "finance", label: "Finance" },
    { id: "travel", label: "Travel" },
    { id: "lifestyle", label: "Lifestyle" },
    { id: "other", label: "Other" },
  ],
  extensions: [
    { id: "com", label: ".COM" },
    { id: "net", label: ".NET" },
    { id: "org", label: ".ORG" },
    { id: "co_uk", label: ".CO.UK" },
    { id: "com_au", label: ".COM.AU" },
    { id: "id", label: ".ID" },
  ],
};

const GUEST_POSTING_SAMPLE_RATES = {
  base: 5,
  perDaTier: 2,
  perDrTier: 2,
  niche: {
    general: 0,
    business: 1,
    technology: 1,
    health: 2,
    finance: 3,
    travel: 1,
    lifestyle: 1,
    other: 0,
  },
  extension: { com: 0, net: 0, org: 1, co_uk: 2, com_au: 2, id: 1 },
};

const getGuestPostingPrice = ({ da, dr, niche, extension }) =>
  GUEST_POSTING_SAMPLE_RATES.base +
  ((Number(da) - 30) / 10) * GUEST_POSTING_SAMPLE_RATES.perDaTier +
  ((Number(dr) - 30) / 10) * GUEST_POSTING_SAMPLE_RATES.perDrTier +
  GUEST_POSTING_SAMPLE_RATES.niche[niche] +
  GUEST_POSTING_SAMPLE_RATES.extension[extension];

const getGuestPostingItem = (id) => {
  const match =
    /^guestpost_(30|40|50|60)_(30|40|50|60)_([a-z]+)_([a-z_]+)$/.exec(id);
  if (!match) return null;

  const [, da, dr, niche, extension] = match;
  const nicheOption = GUEST_POSTING_OPTIONS.niches.find(
    (option) => option.id === niche,
  );
  const extensionOption = GUEST_POSTING_OPTIONS.extensions.find(
    (option) => option.id === extension,
  );
  if (!nicheOption || !extensionOption) return null;

  const options = { da, dr, niche, extension };
  return {
    id,
    name: `Guest Post • DA ${da}+ / DR ${dr}+`,
    detail: `${nicheOption.label} • ${extensionOption.label}`,
    price: getGuestPostingPrice(options),
    ...options,
  };
};

let stripePromise;
const getStripePromise = () => {
  if (!stripePromise) {
    stripePromise = import("@stripe/stripe-js")
      .then(({ loadStripe }) => loadStripe(STRIPE_PUBLIC_KEY))
      .catch((error) => {
        stripePromise = undefined;
        throw error;
      });
  }
  return stripePromise;
};

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

// --- PIECEWISE SLIDER MAPPING HELPERS (LOCKS THUMB TO EXACT VISUAL LABELS) ---
const SLIDER_STOPS = [0, 1, 1000, 2000, 3000, 4000, 5000];

function qtyToSliderPos(qty) {
  if (!qty || qty <= 0) return 0;
  if (qty <= 1) return 100;
  if (qty <= 1000) {
    return 100 + (qty / 1000) * 100;
  }
  return Math.min(600, 200 + ((qty - 1000) / 1000) * 100);
}

function sliderPosToQty(pos) {
  const numPos = Number(pos) || 0;
  if (numPos < 50) return 0;
  if (numPos <= 105) return 1;

  for (let i = 2; i <= 6; i++) {
    const targetPos = i * 100;
    if (Math.abs(numPos - targetPos) <= 6) {
      return (i - 1) * 1000;
    }
  }

  if (numPos <= 200) {
    const raw = ((numPos - 100) / 100) * 1000;
    const snapped = Math.round(raw / 50) * 50;
    return Math.max(1, Math.min(1000, snapped));
  }

  const rawAbove1k = 1000 + ((numPos - 200) / 100) * 1000;
  const snappedAbove1k = Math.round(rawAbove1k / 50) * 50;
  return Math.max(1000, Math.min(5000, snappedAbove1k));
}

// --- COMPLETE 9 SERVICES CATALOGUE (ENHANCED WITH TLDS & SPECS) ---
const ALL_SERVICES = [
  {
    id: "hp_post",
    category: "standard",
    categoryLabel: "Standard PBN",
    name: "Homepage Post",
    price: 1.0,
    metric: "DA/DR 50+",
    tlds: ".COM • .NET • .ORG",
    bestFor: "Global Organic Rankings",
    placementType: "Contextual Article",
    badge: "Most Popular",
    badgeColor: "bg-[#e8f0fe] text-[#1a73e8]",
    topAccent: "bg-[#1a73e8]",
    turnaround: "5–7 Days",
    desc: "Contextual articles published directly on the main homepage of aged, high-authority .COM, .NET, and .ORG domains.",
    features: [
      "400–600 words unique niche-relevant article",
      "Guaranteed Moz DA 50+ & Ahrefs DR 50+",
      "Dofollow contextual link placement",
      "Distributed Class-C IPs & zero footprints",
    ],
  },
  {
    id: "sidebar",
    category: "standard",
    categoryLabel: "Standard PBN",
    name: "Sidebar Blogroll",
    price: 2.0,
    metric: "DA/DR 50+",
    tlds: ".COM • .NET • .ORG",
    bestFor: "Domain Rating & Crawl Power",
    placementType: "Sitewide Widget",
    badge: "High Link Juice",
    badgeColor: "bg-[#e6f4ea] text-[#1e8e3e]",
    topAccent: "bg-[#34a853]",
    turnaround: "3–5 Days",
    desc: "Sitewide sidebar widget placements across aged authority domains, passing maximum link equity from every indexed page.",
    features: [
      "Sitewide homepage & inner-page authority",
      "Low outbound link (OBL) ratio per domain",
      "Instant crawler discovery & fast indexing",
      "Clean backlink profile & zero spam score",
    ],
  },
  {
    id: "sticky",
    category: "standard",
    categoryLabel: "Standard PBN",
    name: "Homepage Sticky Post",
    price: 2.0,
    metric: "DA/DR 50+",
    tlds: ".COM • .NET • .ORG",
    bestFor: "Competitive Tier-1 Keywords",
    placementType: "Pinned Homepage Slot",
    badge: "Pinned Top",
    badgeColor: "bg-[#fef7e0] text-[#f29900]",
    topAccent: "bg-[#fbbc04]",
    turnaround: "5–7 Days",
    desc: "Your contextual post stays permanently pinned at the very top of the homepage so it never rolls off the main page.",
    features: [
      "Permanently pinned in top homepage slot",
      "Maximum homepage crawl priority",
      "Custom anchor text & target URL support",
      "Unbranded white-label Excel report",
    ],
  },
  {
    id: "id_hp_post",
    category: "id_net",
    categoryLabel: ".ID Regional",
    name: ".ID Homepage Post",
    price: 2.0,
    metric: "DA/DR 50+",
    tlds: ".ID • .CO.ID • .WEB.ID",
    bestFor: "Indonesian & SEA SERPs",
    placementType: "Regional Contextual",
    badge: "Regional .ID",
    badgeColor: "bg-[#fce8e6] text-[#d93025]",
    topAccent: "bg-[#ea4335]",
    turnaround: "5–7 Days",
    desc: "Contextual homepage placements on authentic Indonesian (.ID, .CO.ID, .WEB.ID) domains for regional SERP domination.",
    features: [
      "Native Bahasa Indonesia or English articles",
      "Aged .ID & .CO.ID country-code TLDs",
      "Ideal for Southeast Asian & local SERPs",
      "Verified DA/DR 50+ regional authority",
    ],
  },
  {
    id: "id_sidebar",
    category: "id_net",
    categoryLabel: ".ID Regional",
    name: ".ID Sidebar Blogroll",
    price: 3.0,
    metric: "DA/DR 50+",
    tlds: ".ID • .CO.ID • .OR.ID",
    bestFor: "Google.co.id Top 3 Push",
    placementType: "Regional Sitewide",
    badge: "Local Power",
    badgeColor: "bg-[#fce8e6] text-[#d93025]",
    topAccent: "bg-[#ea4335]",
    turnaround: "3–5 Days",
    desc: "High-powered sitewide blogroll links across authoritative Indonesian ccTLD websites to boost competitive local rankings.",
    features: [
      "Direct homepage & sitewide .ID placement",
      "Geo-targeted Indonesian hosting IPs",
      "Strong trust signals for Google.co.id",
      "Full replacement guarantee included",
    ],
  },
  {
    id: "id_sticky",
    category: "id_net",
    categoryLabel: ".ID Regional",
    name: ".ID Sticky Post",
    price: 2.5,
    metric: "DA/DR 50+",
    tlds: ".ID • .CO.ID • .WEB.ID",
    bestFor: "Locked Local Authority",
    placementType: "Pinned .ID Homepage",
    badge: "Pinned .ID",
    badgeColor: "bg-[#fef7e0] text-[#f29900]",
    topAccent: "bg-[#fbbc04]",
    turnaround: "5–7 Days",
    desc: "Pinned contextual articles on top-tier Indonesian domains, locking your link at the top of the homepage feed.",
    features: [
      "Locked top-of-homepage .ID placement",
      "Contextual surround text & niche imagery",
      "Safe drip-feed publishing available",
      "Complete live URL tracking sheet",
    ],
  },
  {
    id: "hidden_links",
    category: "edu_gov",
    categoryLabel: "EDU & GOV",
    name: "Hidden Links (AC.ID, SCH.ID, GO.ID)",
    price: 20.0,
    metric: "High Trust",
    tlds: ".AC.ID • .SCH.ID • .GO.ID",
    bestFor: "Stealth Enterprise Authority",
    placementType: "Stealth Institutional",
    badge: "Exclusive Tier",
    badgeColor: "bg-[#f3e8fd] text-[#9334e6]",
    topAccent: "bg-[#9334e6]",
    turnaround: "5–7 Days",
    desc: "Ultra-high-trust placements on official academic (.AC.ID, .SCH.ID) and government (.GO.ID) properties with stealth formatting.",
    features: [
      "Real .AC.ID, .SCH.ID & .GO.ID extensions",
      "Competitor-proof stealth link integration",
      "Unmatched domain trust & AI citation weight",
      "Strict capacity limits for network safety",
    ],
  },
  {
    id: "edu_post",
    category: "edu_gov",
    categoryLabel: "EDU & GOV",
    name: "EDU PBN Blogpost",
    price: 3.0,
    metric: "DA/DR 50+",
    tlds: ".EDU • .AC.ID",
    bestFor: "E-E-A-T & AI Overviews",
    placementType: "Academic Article",
    badge: "Academic Trust",
    badgeColor: "bg-[#f3e8fd] text-[#9334e6]",
    topAccent: "bg-[#9334e6]",
    turnaround: "5–7 Days",
    desc: "Contextual blog posts published on aged educational PBN domains to skyrocket your domain rating and E-E-A-T signals.",
    features: [
      "Contextual article on aged EDU domains",
      "Boosts Ahrefs DR & organic authority",
      "Natural anchor text integration",
      "100% indexed & footprint-free hosting",
    ],
  },
  {
    id: "edu_sidebar",
    category: "edu_gov",
    categoryLabel: "EDU & GOV",
    name: "EDU PBN Blogroll",
    price: 5.0,
    metric: "DA/DR 50+",
    tlds: ".EDU • .AC.ID",
    bestFor: "Finance, SaaS & iGaming",
    placementType: "University Sitewide",
    badge: "Max Authority",
    badgeColor: "bg-[#f3e8fd] text-[#9334e6]",
    topAccent: "bg-[#9334e6]",
    turnaround: "3–5 Days",
    desc: "University and academic sidebar placements delivering massive sitewide authority to push stubborn keywords to Top 3.",
    features: [
      "Sitewide academic sidebar link equity",
      "High-trust institutional backlink profile",
      "Ideal for finance, SaaS, iGaming & e-com",
      "Priority indexing & white-label delivery",
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
  const [submissionError, setSubmissionError] = useState("");
  const [isStep3ThankYou, setIsStep3ThankYou] = useState(false);

  if (!isOpen || !paymentData) return null;

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setSubmissionError("");

    setIsSubmitting(true);
    try {
      const { data } = await axios.post(`${BACKEND_URL}/api/submit-order`, {
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
      if (!data?.success) {
        throw new Error(
          "The server did not confirm that your order details were received.",
        );
      }
      localStorage.removeItem(BOOMFI_ORDER_STORAGE_KEY);
      setIsStep3ThankYou(true);
    } catch (err) {
      console.error("Order details submission failed:", err);
      setSubmissionError(
        err.response?.data?.error ||
          err.message ||
          "Unable to submit your order details. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
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
              <h3 className="gw-font-display text-[22px] sm:text-[26px] font-medium text-[#202124] mb-1.5 sm:mb-2">
                Thank You, {fullName}!
              </h3>
              <p className="gw-font-text text-[13.5px] sm:text-[14.5px] text-[#5f6368] max-w-[460px] mx-auto leading-[1.55]">
                Your campaign requirements and{" "}
                <strong className="text-[#202124]">{contactPlatform}</strong>{" "}
                contact (
                <strong className="text-[#1a73e8]">{contactHandle}</strong>)
                have been received. Confirmation emails have been dispatched.
              </p>
            </div>

            <div className="mb-5 sm:mb-6">
              <h4 className="gw-font-display text-[14.5px] sm:text-[15px] font-medium text-[#202124] text-center mb-1">
                Need Instant Assistance? Contact Our Team:
              </h4>
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
              Done & Return to Services
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

                {submissionError && (
                  <div
                    role="alert"
                    className="rounded-[12px] border border-[#fad2cf] bg-[#fce8e6] p-3 text-[13px] font-medium text-[#d93025]"
                  >
                    Payment succeeded, but your order details could not be
                    submitted: {submissionError} Please retry or contact support
                    with your transaction ID.
                  </div>
                )}

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

// --- MAIN SERVICES PAGE COMPONENT ---
export default function Services() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [calcCategory, setCalcCategory] = useState("all");
  const [expandedSpecs, setExpandedSpecs] = useState({});
  const [mobileCompareTab, setMobileCompareTab] = useState("standard");
  const [guestPostOptions, setGuestPostOptions] = useState({
    da: "50",
    dr: "50",
    niche: "technology",
    extension: "com",
  });
  const [guestPostQty, setGuestPostQty] = useState(1);

  // Individual Service Card Quick Quantities
  const [boomfiReturn] = useState(readBoomFiReturnState);
  const restoredCart =
    boomfiReturn.savedOrder?.cart &&
    Object.keys(boomfiReturn.savedOrder.cart).length > 0
      ? boomfiReturn.savedOrder.cart
      : { hp_post: 1 };
  const restoredQtys = {
    hp_post: 1,
    sidebar: 1,
    sticky: 1,
    id_hp_post: 1,
    id_sidebar: 1,
    id_sticky: 1,
    hidden_links: 1,
    edu_post: 1,
    edu_sidebar: 1,
    ...(boomfiReturn.savedOrder?.selectedQtys || {}),
  };
  const returnPayment =
    boomfiReturn.status === "success" && boomfiReturn.transactionId
      ? {
          transactionId: boomfiReturn.transactionId,
          method: "BoomFi Crypto Gateway",
        }
      : null;

  const [selectedQtys, setSelectedQtys] = useState(restoredQtys);

  const [checkoutCart, setCheckoutCart] = useState(restoredCart);

  const [isCheckoutGatewayOpen, setIsCheckoutGatewayOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [isInitializing, setIsInitializing] = useState(false);
  const [isRedirectingBoomFi, setIsRedirectingBoomFi] = useState(false);
  const [paymentError, setPaymentError] = useState(
    boomfiReturn.status === "failed"
      ? "Crypto payment was cancelled or not completed. Your selected packages have been restored."
      : boomfiReturn.status === "success" && !boomfiReturn.transactionId
        ? "Could not identify the BoomFi transaction. Please contact support before submitting an order."
        : "",
  );

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(Boolean(returnPayment));
  const [completedPayment, setCompletedPayment] = useState(returnPayment);

  const categories = [
    { id: "all", label: "All Services", shortLabel: "All", count: 10 },
    {
      id: "standard",
      label: "Standard PBN (.COM/.NET)",
      shortLabel: "Standard PBN",
      count: 3,
    },
    {
      id: "id_net",
      label: ".ID Regional Network",
      shortLabel: ".ID Regional",
      count: 3,
    },
    {
      id: "edu_gov",
      label: "EDU & GOV Authority",
      shortLabel: "EDU & GOV",
      count: 3,
    },
  ];

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

  const volumePresets = [50, 100, 250, 500, 1000];

  // Clean return parameters after the state has been initialized from storage.
  useEffect(() => {
    if (boomfiReturn.status === "success" && boomfiReturn.transactionId) {
      document.body.style.overflow = "hidden";
    }
    if (boomfiReturn.status === "success" || boomfiReturn.status === "failed") {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [boomfiReturn.status, boomfiReturn.transactionId]);

  const filteredServices =
    activeCategory === "all"
      ? ALL_SERVICES
      : ALL_SERVICES.filter((s) => s.category === activeCategory);

  const filteredCalcServices =
    calcCategory === "all"
      ? ALL_SERVICES
      : ALL_SERVICES.filter((s) => s.category === calcCategory);

  const updateCardQty = (id, val) => {
    let parsed = parseInt(val, 10);
    if (isNaN(parsed) || parsed < 1) parsed = 1;
    if (parsed > 5000) parsed = 5000;
    setSelectedQtys((prev) => ({ ...prev, [id]: parsed }));
    if (checkoutCart[id]) {
      setCheckoutCart((prev) => ({ ...prev, [id]: parsed }));
    }
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
    if (val > 5000) val = 5000;

    setCheckoutCart((prev) => ({ ...prev, [id]: val }));
    setSelectedQtys((prev) => ({ ...prev, [id]: val }));
  };

  const handleSliderPosChange = (id, sliderPosValue) => {
    const mappedQty = sliderPosToQty(sliderPosValue);
    setCalcServiceQty(id, mappedQty);
  };

  const toggleMobileSpecs = (id) => {
    setExpandedSpecs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Trigger Instant Checkout for a Single Service Card
  const handleInstantOrder = async (serviceId) => {
    const qty = selectedQtys[serviceId] || 1;
    const newCart = { [serviceId]: qty };
    setCheckoutCart(newCart);
    await openCheckoutModalWithCart(newCart);
  };

  // Add/Toggle Service in Calculator Bundle
  const toggleBundleItem = (serviceId) => {
    const qty = selectedQtys[serviceId] || 1;
    setCheckoutCart((prev) => {
      const next = { ...prev };
      if (next[serviceId]) {
        delete next[serviceId];
      } else {
        next[serviceId] = qty;
      }
      return next;
    });
  };

  const openCheckoutModalWithCart = async (cartObj) => {
    setIsInitializing(true);
    setPaymentError("");
    setIsCheckoutGatewayOpen(true);
    document.body.style.overflow = "hidden";

    try {
      const [{ data }] = await Promise.all([
        axios.post(`${BACKEND_URL}/api/create-stripe-intent`, {
          cart: cartObj,
        }),
        getStripePromise(),
      ]);
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

  const closeGatewayModal = () => {
    setIsCheckoutGatewayOpen(false);
    document.body.style.overflow = "auto";
  };

  const selectedPackagesDetailed = Object.entries(checkoutCart)
    .filter(([, q]) => q > 0)
    .map(([id, qty]) => {
      const guestPost = getGuestPostingItem(id);
      if (guestPost) {
        return {
          ...guestPost,
          qty,
          subtotal: guestPost.price * qty,
          isGuestPost: true,
        };
      }
      const svc = ALL_SERVICES.find((s) => s.id === id);
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
  const guestPostItems = selectedPackagesDetailed.filter(
    (item) => item.isGuestPost,
  );
  const hasGuestPostItems = guestPostItems.length > 0;

  const addGuestPostToCart = () => {
    const id = `guestpost_${guestPostOptions.da}_${guestPostOptions.dr}_${guestPostOptions.niche}_${guestPostOptions.extension}`;
    setCheckoutCart((prev) => ({ ...prev, [id]: guestPostQty }));
  };

  const handlePaymentSuccess = (transactionId, method) => {
    setIsCheckoutGatewayOpen(false);
    setCompletedPayment({ transactionId, method });
    setIsOrderModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  // Direct BoomFi Same-Tab Auto-Return Redirect
  const handleBoomFiCheckout = async () => {
    setIsRedirectingBoomFi(true);
    setPaymentError("");
    try {
      const currentPageOrigin = `${window.location.origin}${window.location.pathname}`;
      const { data } = await axios.post(
        `${BACKEND_URL}/api/create-boomfi-charge`,
        {
          cart: checkoutCart,
          originUrl: currentPageOrigin,
        },
      );
      if (data?.checkoutUrl && data.transactionId) {
        try {
          localStorage.setItem(
            BOOMFI_ORDER_STORAGE_KEY,
            JSON.stringify({
              cart: checkoutCart,
              selectedQtys,
              transactionId: data.transactionId,
              timestamp: Date.now(),
            }),
          );
        } catch (storageErr) {
          console.error("Could not save pending BoomFi state:", storageErr);
          setPaymentError(
            "Your browser could not save this order for the return flow. Enable local storage and try again.",
          );
          setIsRedirectingBoomFi(false);
          return;
        }
        window.location.href = data.checkoutUrl;
      } else {
        setPaymentError(
          "BoomFi did not return a valid payment link and transaction reference. Please verify the backend configuration.",
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

  const mobileCompareData = {
    standard: {
      title: "Standard PBN (.COM / .NET)",
      badge: "Global SERPs",
      color: "text-[#1a73e8] bg-[#e8f0fe] border-[#d2e3fc]",
      specs: [
        { label: "Domain Extensions", value: ".COM, .NET, .ORG, .INFO" },
        { label: "Guaranteed Metrics", value: "DA 50+ / DR 50+" },
        { label: "Link Attribute", value: "100% Dofollow & Permanent" },
        { label: "Content Language", value: "English / Multi-Niche" },
        { label: "Reporting Format", value: "White-Label Excel / CSV" },
      ],
    },
    id_net: {
      title: ".ID Regional Network",
      badge: "Local Indonesian Authority",
      color: "text-[#d93025] bg-[#fce8e6] border-[#fad2cf]",
      specs: [
        { label: "Domain Extensions", value: ".ID, .CO.ID, .WEB.ID, .OR.ID" },
        { label: "Guaranteed Metrics", value: "DA 50+ / DR 50+" },
        { label: "Link Attribute", value: "100% Dofollow & Permanent" },
        { label: "Content Language", value: "Bahasa Indonesia & English" },
        { label: "Reporting Format", value: "White-Label Excel / CSV" },
      ],
    },
    edu_gov: {
      title: "EDU & GOV Authority Tier",
      badge: "Maximum Institutional Trust",
      color: "text-[#9334e6] bg-[#f3e8fd] border-[#e9d2fc]",
      specs: [
        { label: "Domain Extensions", value: ".EDU, .AC.ID, .SCH.ID, .GO.ID" },
        {
          label: "Guaranteed Metrics",
          value: "DA 50–85+ / Institutional Trust",
        },
        { label: "Link Attribute", value: "100% Dofollow & Permanent" },
        { label: "Content Language", value: "Academic English & Indonesian" },
        { label: "Reporting Format", value: "White-Label / Stealth Verified" },
      ],
    },
  };

  return (
    <main className="w-full bg-[#fcfcfc] relative overflow-x-clip pt-[68px] sm:pt-[80px] pb-20 sm:pb-0">
      <style>{`
        .bg-dotted-grid { background-image: radial-gradient(circle, #d0d7de 1px, transparent 1px); background-size: 28px 28px; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f3f4; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #dadce0; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #bdc1c6; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        /* Custom Touch-Friendly Slider Styling */
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; height: 22px; width: 22px; border-radius: 50%;
          background: #ffffff; border: 3px solid #1a73e8; cursor: pointer;
          box-shadow: 0 2px 6px rgba(26, 115, 232, 0.35); transition: transform 0.15s ease;
        }
        input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.12); }
        input[type=range]::-webkit-slider-thumb:active { transform: scale(1.2); background: #e8f0fe; }

        input[type=range]::-moz-range-thumb {
          height: 22px; width: 22px; border-radius: 50%;
          background: #ffffff; border: 3px solid #1a73e8; cursor: pointer;
          box-shadow: 0 2px 6px rgba(26, 115, 232, 0.35); transition: transform 0.15s ease;
        }
        input[type=range]::-moz-range-thumb:hover { transform: scale(1.12); }
        input[type=range]::-moz-range-thumb:active { transform: scale(1.2); background: #e8f0fe; }
      `}</style>

      {/* --- HERO HEADER SECTION --- */}
      <section className="relative w-full bg-white py-8 sm:py-14 lg:py-18 px-4 sm:px-6 border-b border-[#e8eaed] overflow-hidden">
        <div className="absolute inset-0 bg-dotted-grid [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] opacity-45 pointer-events-none" />
        <div className="max-w-[1200px] mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#f8f9fa] border border-[#dadce0] shadow-[0_2px_6px_rgba(60,64,67,0.04)] mb-3.5 sm:mb-5 max-w-full">
            <span className="flex items-center gap-1 shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
              <span className="w-2 h-2 rounded-full bg-[#EA4335]" />
              <span className="w-2 h-2 rounded-full bg-[#FBBC04]" />
              <span className="w-2 h-2 rounded-full bg-[#34A853]" />
            </span>
            <span className="gw-font-text text-[11.5px] sm:text-[13px] font-medium text-[#3c4043] truncate">
              Complete Placement Inventory • Verified DA/DR 50+
            </span>
          </div>

          <h2 className="gw-font-display text-[26px] sm:text-[44px] md:text-[54px] font-medium text-[#202124] leading-[1.15] sm:leading-[1.12] tracking-[-0.025em] max-w-[860px] mx-auto mb-3 sm:mb-5 px-1">
            Enterprise PBN & Authority <br className="hidden sm:block" />
            <span className="text-[#1a73e8]">Link Building Services.</span>
          </h2>

          <p className="gw-font-text text-[14px] sm:text-[16.5px] md:text-[18px] text-[#5f6368] max-w-[680px] mx-auto leading-[1.55] sm:leading-[1.6] mb-5 sm:mb-7 px-1">
            Explore 9 specialised backlink placements across global .COM,
            regional Indonesian .ID, and high-trust .EDU / .GOV networks, plus
            our configurable Guest Posting service. Build a custom campaign
            below.
          </p>

          {/* Horizontal Scrollable Trust Pills on Mobile */}
          <div className="flex items-center sm:justify-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap pb-1">
            {[
              "✓ Min Order: 50 Links",
              "✓ 100% Footprint-Free",
              "✓ White-Label Reports",
              "✓ 5–7 Days Turnaround",
            ].map((pill, i) => (
              <span
                key={i}
                className="text-[11.5px] sm:text-[12.5px] font-medium text-[#3c4043] bg-[#f8f9fa] border border-[#e8eaed] px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full whitespace-nowrap shrink-0"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* --- 1. ENHANCED SERVICES CATALOGUE SECTION --- */}
      <section className="w-full py-8 sm:py-14 lg:py-18 px-3.5 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          {/* Sticky Mobile & Desktop Filter Bar */}
          <div className="sticky top-[62px] sm:top-[74px] z-30 bg-white/95 backdrop-blur-md p-2.5 sm:p-3.5 rounded-[16px] sm:rounded-[20px] border border-[#e8eaed] shadow-[0_6px_20px_rgba(60,64,67,0.06)] mb-6 sm:mb-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
              {categories.map((cat) => {
                const active = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[12px] sm:text-[13px] font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      active
                        ? "bg-[#1a73e8] text-white shadow-sm"
                        : "bg-[#f8f9fa] text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4]"
                    }`}
                  >
                    <span className="sm:hidden">{cat.shortLabel}</span>
                    <span className="hidden sm:inline">{cat.label}</span>
                    <span
                      className={`text-[10.5px] sm:text-[11px] px-1.5 py-0.2 rounded-full ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-white text-[#5f6368] border border-[#dadce0]"
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("estimator")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="hidden sm:inline-flex items-center justify-center text-[12.5px] sm:text-[13px] font-medium text-[#1a73e8] bg-[#e8f0fe]/70 hover:bg-[#e8f0fe] px-4 py-2 rounded-full transition-colors shrink-0 cursor-pointer"
            >
              Jump to Bulk Slider Calculator ↓
            </button>
          </div>

          <div className="relative mb-6 sm:mb-8 overflow-hidden rounded-[22px] sm:rounded-[26px] border border-[#d2e3fc] bg-white shadow-[0_8px_28px_rgba(26,115,232,0.08)]">
            <div className="h-1 bg-gradient-to-r from-[#4285F4] via-[#1a73e8] to-[#34a853]" />
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-5 sm:gap-8 p-5 sm:p-8">
              <div className="flex flex-col justify-center">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#e8f0fe] px-3 py-1 text-[11px] font-semibold text-[#1a73e8]">
                  Featured Service
                </span>
                <h2 className="gw-font-display mt-3 text-[23px] sm:text-[30px] font-medium leading-tight text-[#202124]">
                  Guest Posting
                </h2>
                <p className="gw-font-text mt-2 text-[13.5px] sm:text-[14px] leading-relaxed text-[#5f6368]">
                  Place a contextual article on a third-party website relevant
                  to your chosen niche. Select the authority targets, niche,
                  domain extension, and number of posts to build your brief.
                </p>
                <ul className="mt-4 space-y-2 text-[12.5px] text-[#3c4043]">
                  {[
                    "Choose DA and DR targets separately",
                    "Match a website niche and domain extension",
                    "Review your configuration in the campaign cart",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="mt-0.5 text-[#34a853]">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[11.5px] leading-relaxed text-[#5f6368]">
                  Publisher availability and final placement requirements should
                  be confirmed before an order is placed.
                </p>
              </div>

              <div className="rounded-[18px] border border-[#e8eaed] bg-[#f8fbff] p-4 sm:p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="gw-font-display text-[16px] font-semibold text-[#202124]">
                    Configure your guest post
                  </h3>
                  <span className="rounded-full border border-[#fbbc04]/50 bg-[#fef7e0] px-2.5 py-1 text-[10.5px] font-semibold text-[#8a5b00]">
                    SAMPLE RATES
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="text-[12px] font-medium text-[#3c4043]">
                    Target Domain Authority (DA)
                    <select
                      value={guestPostOptions.da}
                      onChange={(event) =>
                        setGuestPostOptions((previous) => ({
                          ...previous,
                          da: event.target.value,
                        }))
                      }
                      className="mt-1.5 w-full rounded-[10px] border border-[#dadce0] bg-white px-3 py-2.5 text-[13px] text-[#202124] focus:border-[#1a73e8] focus:outline-none"
                    >
                      {GUEST_POSTING_OPTIONS.da.map((tier) => (
                        <option key={tier} value={tier}>
                          DA {tier}+
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="text-[12px] font-medium text-[#3c4043]">
                    Target Domain Rating (DR)
                    <select
                      value={guestPostOptions.dr}
                      onChange={(event) =>
                        setGuestPostOptions((previous) => ({
                          ...previous,
                          dr: event.target.value,
                        }))
                      }
                      className="mt-1.5 w-full rounded-[10px] border border-[#dadce0] bg-white px-3 py-2.5 text-[13px] text-[#202124] focus:border-[#1a73e8] focus:outline-none"
                    >
                      {GUEST_POSTING_OPTIONS.dr.map((tier) => (
                        <option key={tier} value={tier}>
                          DR {tier}+
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="text-[12px] font-medium text-[#3c4043]">
                    Website niche
                    <select
                      value={guestPostOptions.niche}
                      onChange={(event) =>
                        setGuestPostOptions((previous) => ({
                          ...previous,
                          niche: event.target.value,
                        }))
                      }
                      className="mt-1.5 w-full rounded-[10px] border border-[#dadce0] bg-white px-3 py-2.5 text-[13px] text-[#202124] focus:border-[#1a73e8] focus:outline-none"
                    >
                      {GUEST_POSTING_OPTIONS.niches.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="text-[12px] font-medium text-[#3c4043]">
                    Domain extension
                    <select
                      value={guestPostOptions.extension}
                      onChange={(event) =>
                        setGuestPostOptions((previous) => ({
                          ...previous,
                          extension: event.target.value,
                        }))
                      }
                      className="mt-1.5 w-full rounded-[10px] border border-[#dadce0] bg-white px-3 py-2.5 text-[13px] text-[#202124] focus:border-[#1a73e8] focus:outline-none"
                    >
                      {GUEST_POSTING_OPTIONS.extensions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="mt-4 flex flex-col gap-3 border-t border-[#e8eaed] pt-4 sm:flex-row sm:items-end sm:justify-between">
                  <label className="text-[12px] font-medium text-[#3c4043]">
                    Number of guest posts
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={guestPostQty}
                      onChange={(event) => {
                        const value = Number.parseInt(event.target.value, 10);
                        setGuestPostQty(
                          Number.isNaN(value)
                            ? 1
                            : Math.max(1, Math.min(100, value)),
                        );
                      }}
                      className="mt-1.5 block w-28 rounded-[10px] border border-[#dadce0] bg-white px-3 py-2 text-[13px] text-[#202124] focus:border-[#1a73e8] focus:outline-none"
                    />
                  </label>
                  <div className="flex items-end justify-between gap-3 sm:justify-end">
                    <div className="text-right">
                      <span className="block text-[10.5px] text-[#5f6368]">
                        Sample estimate
                      </span>
                      <span className="gw-font-display text-[21px] font-semibold text-[#1a73e8]">
                        $
                        {(
                          getGuestPostingPrice(guestPostOptions) * guestPostQty
                        ).toFixed(2)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={addGuestPostToCart}
                      className="h-10 rounded-full bg-[#1a73e8] px-4 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#1557b0]"
                    >
                      Add to Campaign
                    </button>
                  </div>
                </div>
                <p className="mt-3 rounded-[10px] bg-[#fef7e0] px-3 py-2 text-[11px] leading-relaxed text-[#6b5200]">
                  Sample pricing only. Guest Posting checkout is disabled until
                  confirmed rates are configured.
                </p>
              </div>
            </div>
          </div>

          {/* 9 Enhanced Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredServices.map((service) => {
              const currentQty = selectedQtys[service.id] || 1;
              const subtotal = currentQty * service.price;
              const inBundle = Boolean(checkoutCart[service.id]);
              const isSpecsOpen = Boolean(expandedSpecs[service.id]);

              return (
                <div
                  key={service.id}
                  className={`relative bg-white rounded-[22px] sm:rounded-[26px] border transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
                    inBundle
                      ? "border-[#1a73e8] ring-2 ring-[#e8f0fe] shadow-[0_14px_38px_rgba(26,115,232,0.12)]"
                      : "border-[#e8eaed] shadow-[0_2px_12px_rgba(60,64,67,0.04)] hover:shadow-[0_16px_40px_rgba(26,115,232,0.09)] hover:border-[#d2e3fc] hover:-translate-y-1"
                  }`}
                >
                  {/* Top Accent Strip */}
                  <div className={`h-[4px] w-full ${service.topAccent}`} />

                  <div className="p-5 sm:p-6 lg:p-7 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Top Badges & Turnaround */}
                      <div className="flex items-center justify-between gap-2 mb-3.5">
                        <span
                          className={`text-[11px] sm:text-[11.5px] font-semibold px-3 py-1 rounded-full ${service.badgeColor}`}
                        >
                          {service.badge}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-[#5f6368] bg-[#f8f9fa] px-2.5 py-0.5 rounded-full border border-[#e8eaed]">
                            ⏱ {service.turnaround}
                          </span>
                          <span className="text-[11px] sm:text-[11.5px] font-semibold bg-[#e6f4ea] text-[#1e8e3e] border border-[#ceead6] px-2.5 py-0.5 rounded-full">
                            {service.metric}
                          </span>
                        </div>
                      </div>

                      {/* Title & Price Header */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5f6368] block mb-0.5">
                            {service.categoryLabel} • {service.placementType}
                          </span>
                          <h2 className="gw-font-display text-[19px] sm:text-[22px] font-medium text-[#202124] leading-snug">
                            {service.name}
                          </h2>
                        </div>
                        <div className="text-right shrink-0 bg-[#f8fbff] border border-[#d2e3fc] px-3 py-1.5 rounded-[14px]">
                          <span className="gw-font-display text-[20px] sm:text-[23px] font-semibold text-[#1a73e8] leading-none block">
                            ${service.price.toFixed(2)}
                          </span>
                          <span className="block text-[10px] font-medium text-[#5f6368] mt-0.5">
                            USD / link
                          </span>
                        </div>
                      </div>

                      {/* Domain TLD & Use-Case Micro Strip */}
                      <div className="grid grid-cols-2 gap-2 my-3.5 p-2.5 rounded-[14px] bg-[#f8f9fa] border border-[#e8eaed]">
                        <div>
                          <span className="block text-[10px] uppercase tracking-wider text-[#5f6368] font-medium">
                            Supported TLDs
                          </span>
                          <span className="text-[11.5px] sm:text-[12px] font-semibold text-[#202124]">
                            {service.tlds}
                          </span>
                        </div>
                        <div className="border-l border-[#dadce0] pl-2.5">
                          <span className="block text-[10px] uppercase tracking-wider text-[#5f6368] font-medium">
                            Ideal For
                          </span>
                          <span className="text-[11.5px] sm:text-[12px] font-semibold text-[#1a73e8] truncate block">
                            {service.bestFor}
                          </span>
                        </div>
                      </div>

                      <p className="gw-font-text text-[13px] sm:text-[13.5px] text-[#5f6368] leading-[1.55] mb-3.5 sm:mb-4">
                        {service.desc}
                      </p>

                      {/* Mobile Collapsible Specs Toggle Button */}
                      <button
                        type="button"
                        onClick={() => toggleMobileSpecs(service.id)}
                        className="sm:hidden w-full mb-3 py-2 px-3 rounded-[10px] bg-[#f8f9fa] border border-[#e8eaed] flex items-center justify-between text-[12px] font-medium text-[#3c4043] cursor-pointer"
                      >
                        <span>
                          {isSpecsOpen
                            ? "Hide Technical Specs"
                            : "View 4 Included Deliverables"}
                        </span>
                        <svg
                          className={`w-4 h-4 text-[#5f6368] transition-transform duration-200 ${
                            isSpecsOpen ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>

                      {/* Feature Checklist */}
                      <ul
                        className={`${
                          isSpecsOpen ? "block" : "hidden sm:block"
                        } space-y-2 mb-4 sm:mb-5 bg-[#f8f9fa] sm:bg-transparent p-3 sm:p-0 rounded-[12px] border border-[#e8eaed] sm:border-0`}
                      >
                        {service.features.map((feat, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-[12.5px] sm:text-[13px] text-[#3c4043]"
                          >
                            <svg
                              className="w-4 h-4 text-[#34a853] shrink-0 mt-0.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              strokeWidth="2.5"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Interactive Volume Selector & Order Controls */}
                    <div className="pt-3.5 sm:pt-4 border-t border-[#e8eaed]">
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center bg-[#f8f9fa] border border-[#dadce0] rounded-full p-0.5">
                          <button
                            type="button"
                            onClick={() =>
                              updateCardQty(service.id, currentQty - 1)
                            }
                            className="w-7 h-7 rounded-full text-[#5f6368] hover:bg-white active:bg-[#e8eaed] flex items-center justify-center font-bold text-[14px] cursor-pointer"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min="1"
                            max="5000"
                            step="1"
                            value={currentQty}
                            onChange={(e) =>
                              updateCardQty(service.id, e.target.value)
                            }
                            className="w-[52px] text-center bg-transparent text-[13px] font-semibold text-[#202124] focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              updateCardQty(service.id, currentQty + 1)
                            }
                            className="w-7 h-7 rounded-full text-[#1a73e8] hover:bg-white active:bg-[#e8f0fe] flex items-center justify-center font-bold text-[14px] cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="block text-[10.5px] text-[#5f6368]">
                            Package Total
                          </span>
                          <span className="gw-font-display text-[15px] sm:text-[16px] font-bold text-[#202124]">
                            $
                            {subtotal.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Quick Volume Pills */}
                      <div className="grid grid-cols-5 gap-1.5 mb-3">
                        {volumePresets.map((vol) => (
                          <button
                            key={vol}
                            type="button"
                            onClick={() => updateCardQty(service.id, vol)}
                            className={`py-1.5 rounded-[8px] text-[11px] sm:text-[11.5px] font-medium border transition-all cursor-pointer ${
                              currentQty === vol
                                ? "bg-[#1a73e8] border-[#1a73e8] text-white font-semibold"
                                : "bg-[#f8f9fa] border-[#e8eaed] text-[#5f6368] hover:border-[#d2e3fc]"
                            }`}
                          >
                            {vol === 1000 ? "1k" : vol}
                          </button>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleInstantOrder(service.id)}
                          className="gw-font-display flex-1 h-[42px] sm:h-[44px] px-3 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-[13px] sm:text-[13.5px] font-medium transition-all shadow-[0_4px_12px_rgba(26,115,232,0.22)] cursor-pointer truncate"
                        >
                          Order {currentQty} Links • $
                          {subtotal.toLocaleString("en-US", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleBundleItem(service.id)}
                          className={`h-[42px] sm:h-[44px] px-3 sm:px-3.5 rounded-full border text-[12px] sm:text-[12.5px] font-medium transition-all cursor-pointer shrink-0 ${
                            inBundle
                              ? "bg-[#e6f4ea] border-[#34a853] text-[#1e8e3e]"
                              : "bg-white border-[#dadce0] text-[#3c4043] hover:bg-[#f8f9fa]"
                          }`}
                        >
                          {inBundle ? "✓ In Bundle" : "+ Bundle"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- 2. INTERACTIVE BULK COST CALCULATOR SECTION (ADDED DIRECTLY BELOW SERVICES) --- */}
      <section
        id="estimator"
        className="w-full bg-[#f8f9fa] py-12 sm:py-20 px-4 sm:px-6 border-t border-[#e8eaed]"
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-8 sm:mb-12 max-w-[740px] mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#e8f0fe] text-[#1a73e8] text-[11.5px] sm:text-[12.5px] font-medium mb-3">
              <span className="w-2 h-2 rounded-full bg-[#1a73e8] animate-pulse" />
              Interactive Bulk Cost Calculator
            </div>
            <h2 className="gw-font-display text-[26px] sm:text-[36px] md:text-[44px] font-medium text-[#202124] leading-[1.15] tracking-[-0.025em] mb-2.5">
              Build a custom{" "}
              <span className="text-[#1a73e8]">multi-service bundle.</span>
            </h2>
            <p className="gw-font-text text-[14px] sm:text-[16px] text-[#5f6368] leading-[1.6]">
              Combine multiple placements from 50 up to 5,000 links per service
              with real-time agency pricing and instant multi-gateway checkout.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start gap-6 sm:gap-8 xl:gap-10 relative">
            {/* Left Column: Sliders Builder */}
            <div className="flex-1 w-full min-w-0">
              {/* Top Filter & Preset Control Box */}
              <div className="bg-white p-3.5 sm:p-4 rounded-[20px] border border-[#e8eaed] shadow-[0_1px_3px_rgba(60,64,67,0.03)] mb-4 sm:mb-5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                    {categories.map((cat) => {
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
                          {cat.shortLabel} ({cat.count})
                        </button>
                      );
                    })}
                  </div>
                  <span className="hidden sm:inline-block bg-[#e6f4ea] text-[#1e8e3e] text-[11.5px] font-semibold px-3 py-1 rounded-full border border-[#ceead6] shrink-0">
                    DA/DR 50+
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[#f1f3f4] overflow-x-auto no-scrollbar">
                  <span className="text-[11.5px] font-medium text-[#5f6368] shrink-0">
                    Quick Bundles:
                  </span>
                  {presets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setCalcCategory("all");
                        setCheckoutCart(preset.config);
                      }}
                      className="text-[11.5px] font-medium bg-[#f8f9fa] hover:bg-[#e8f0fe] text-[#3c4043] hover:text-[#1a73e8] border border-[#dadce0] hover:border-[#d2e3fc] px-2.5 py-1 rounded-full transition-all cursor-pointer whitespace-nowrap shrink-0"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculator Slider Rows */}
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                {filteredCalcServices.map((service) => {
                  const currentQty = checkoutCart[service.id] || 0;
                  const isActive = currentQty > 0;
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
                          : "p-3.5 sm:p-5 bg-white border-[#e8eaed] hover:border-[#dadce0] hover:shadow-[0_4px_12px_rgba(60,64,67,0.04)]"
                      }`}
                    >
                      <div
                        onClick={() => {
                          if (!isActive) setCalcServiceQty(service.id, 1);
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
                              setCalcServiceQty(service.id, isActive ? 0 : 1);
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
                              <h4 className="gw-font-display text-[15px] sm:text-[17px] font-medium text-[#202124] leading-snug">
                                {service.name}
                              </h4>
                              <span className="text-[10px] sm:text-[11px] font-medium bg-[#f1f3f4] text-[#5f6368] px-1.5 sm:px-2 py-0.5 rounded-md">
                                {service.metric}
                              </span>
                              <span className="text-[10px] sm:text-[11px] font-medium bg-[#e8f0fe] text-[#1a73e8] px-1.5 sm:px-2 py-0.5 rounded-md">
                                {service.tlds}
                              </span>
                            </div>
                            <p className="gw-font-text text-[12px] sm:text-[13px] text-[#5f6368] mt-0.5 leading-snug truncate sm:whitespace-normal">
                              {service.desc}
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
                          {!isActive && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCalcServiceQty(service.id, 1);
                              }}
                              className="sm:hidden text-[11.5px] font-semibold bg-[#e8f0fe] text-[#1a73e8] px-2.5 py-1 rounded-full"
                            >
                              + Add
                            </button>
                          )}
                        </div>
                      </div>

                      <div
                        className={`${
                          isActive ? "flex" : "hidden sm:flex"
                        } flex-col sm:flex-row sm:items-center gap-3.5 sm:gap-5 mt-2`}
                      >
                        <div className="flex-1">
                          {/* Track + 7 Exact-Aligned Milestone Dots */}
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
                                handleSliderPosChange(
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

                          {/* 7 Exact Percentage-Aligned Milestone Labels */}
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
                                  ) : stopVal === 1 ? (
                                    <>
                                      1
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
                          <div className="flex items-center bg-white border border-[#dadce0] rounded-full p-0.5 sm:p-1 shadow-[0_1px_2px_rgba(60,64,67,0.04)]">
                            <button
                              type="button"
                              onClick={() =>
                                setCalcServiceQty(
                                  service.id,
                                  currentQty <= 1 ? 0 : currentQty - 1,
                                )
                              }
                              className="w-7 h-7 rounded-full text-[#5f6368] hover:text-[#202124] active:bg-[#e8eaed] hover:bg-[#f1f3f4] flex items-center justify-center transition-colors cursor-pointer font-medium"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              min="0"
                              max="5000"
                              step="1"
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
                                  currentQty === 0 ? 1 : currentQty + 1,
                                )
                              }
                              className="w-7 h-7 rounded-full text-[#1a73e8] active:bg-[#d2e3fc] hover:bg-[#e8f0fe] flex items-center justify-center transition-colors cursor-pointer font-medium"
                            >
                              +
                            </button>
                          </div>

                          <div className="min-w-[82px] text-right">
                            <span className="block text-[10px] sm:text-[11px] text-[#5f6368]">
                              Subtotal
                            </span>
                            <span
                              className={`gw-font-display text-[14px] sm:text-[15px] font-semibold ${isActive ? "text-[#1a73e8]" : "text-[#9aa0a6]"}`}
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
                {guestPostItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[18px] border border-[#fbbc04] bg-[#fffdf5] p-4 sm:p-5"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="gw-font-display text-[15px] font-semibold text-[#202124]">
                            {item.name}
                          </h4>
                          <span className="rounded-full bg-[#fef7e0] px-2 py-0.5 text-[10px] font-semibold text-[#8a5b00]">
                            SAMPLE RATE
                          </span>
                        </div>
                        <p className="mt-1 text-[12px] text-[#5f6368]">
                          {item.detail} • ${item.price.toFixed(2)} / post
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-3 sm:justify-end">
                        <label className="text-[11px] font-medium text-[#5f6368]">
                          Posts
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={item.qty}
                            onChange={(event) => {
                              const value = Number.parseInt(
                                event.target.value,
                                10,
                              );
                              setCheckoutCart((previous) => ({
                                ...previous,
                                [item.id]: Number.isNaN(value)
                                  ? 1
                                  : Math.max(1, Math.min(100, value)),
                              }));
                            }}
                            className="mt-1 block w-20 rounded-[9px] border border-[#dadce0] bg-white px-2.5 py-1.5 text-[13px] text-[#202124]"
                          />
                        </label>
                        <span className="gw-font-display text-[15px] font-semibold text-[#202124]">
                          ${(item.price * item.qty).toFixed(2)}
                        </span>
                        <button
                          type="button"
                          onClick={() => setCalcServiceQty(item.id, 0)}
                          className="rounded-full p-2 text-[#9aa0a6] transition-colors hover:bg-white hover:text-[#d93025]"
                          aria-label={`Remove ${item.name} from campaign cart`}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Sticky Order Summary on Desktop */}
            <aside
              id="order-summary-card"
              className="w-full lg:w-[390px] xl:w-[420px] shrink-0 lg:sticky lg:top-[96px] self-start transition-all duration-300 mt-2 lg:mt-0"
            >
              <div className="bg-white rounded-[22px] sm:rounded-[24px] border border-[#dadce0] shadow-[0_12px_36px_rgba(60,64,67,0.08)] overflow-hidden flex flex-col">
                <div className="grid grid-cols-4 h-[4px] w-full">
                  <div className="bg-[#4285F4]" />
                  <div className="bg-[#EA4335]" />
                  <div className="bg-[#FBBC04]" />
                  <div className="bg-[#34A853]" />
                </div>

                <div className="p-5 sm:p-6 lg:p-7 flex flex-col">
                  <div className="flex items-center justify-between mb-4 sm:mb-5 border-b border-[#e8eaed] pb-3.5 sm:pb-4">
                    <div>
                      <h3 className="gw-font-display text-[19px] sm:text-[20px] font-medium text-[#202124]">
                        Order Summary
                      </h3>
                      <p className="text-[12px] sm:text-[12.5px] text-[#5f6368] mt-0.5">
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
                        onClick={() => setCheckoutCart({})}
                        className="text-[12px] font-medium text-[#d93025] hover:bg-[#fce8e6] px-3 py-1 rounded-full transition-colors cursor-pointer"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto max-h-[240px] mb-4 sm:mb-5 pr-1 space-y-2 gw-font-text custom-scrollbar">
                    {selectedPackagesCount === 0 ? (
                      <div className="text-center py-7 px-4 bg-[#f8f9fa] rounded-[16px] border border-dashed border-[#dadce0]">
                        <p className="text-[13.5px] text-[#5f6368] font-medium">
                          No placements selected
                        </p>
                        <p className="text-[12px] text-[#9aa0a6] mt-1">
                          Tap any placement or preset to start from 50 links.
                        </p>
                      </div>
                    ) : (
                      selectedPackagesDetailed.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center bg-[#f8f9fa] hover:bg-[#f1f3f4]/70 px-3 py-2.5 rounded-[12px] border border-[#e8eaed] transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-[11.5px] font-bold bg-[#e8f0fe] text-[#1a73e8] px-2 py-0.5 rounded-full shrink-0">
                              {item.qty.toLocaleString()}
                            </span>
                            <div className="min-w-0">
                              <p className="text-[13px] sm:text-[13.5px] font-medium text-[#202124] truncate">
                                {item.name}
                              </p>
                              <p className="text-[11px] text-[#5f6368]">
                                {item.isGuestPost && (
                                  <span className="block truncate">
                                    {item.detail}
                                  </span>
                                )}
                                ${item.price.toFixed(2)} /{" "}
                                {item.isGuestPost ? "post" : "link"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 pl-2">
                            <span className="text-[13px] sm:text-[13.5px] font-semibold text-[#202124]">
                              $
                              {item.subtotal.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                            <button
                              type="button"
                              onClick={() => setCalcServiceQty(item.id, 0)}
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
                      ))
                    )}
                  </div>

                  <div className="bg-[#f8f9fa] rounded-[16px] sm:rounded-[18px] p-4 sm:p-5 mb-4 sm:mb-5 border border-[#e8eaed]">
                    <div className="flex justify-between items-center mb-2 text-[12.5px] sm:text-[13px] text-[#5f6368]">
                      <span>Selected Services</span>
                      <span className="font-medium text-[#202124]">
                        {selectedPackagesCount}{" "}
                        {selectedPackagesCount === 1 ? "Service" : "Services"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-3 pb-3 border-b border-[#dadce0] text-[12.5px] sm:text-[13px] text-[#5f6368]">
                      <span>Total Links & Posts</span>
                      <span className="font-semibold text-[#1a73e8] bg-[#e8f0fe] px-2.5 py-0.5 rounded-full">
                        {totalLinks.toLocaleString()} items
                      </span>
                    </div>
                    <div className="flex justify-between items-end pt-1">
                      <div>
                        <span className="gw-font-display text-[14.5px] sm:text-[15px] font-medium text-[#202124] block">
                          Estimated Total
                        </span>
                        <span className="text-[11px] sm:text-[11.5px] text-[#1e8e3e] font-medium">
                          ● Instant Setup Included
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="gw-font-display text-[26px] sm:text-[30px] font-medium text-[#1a73e8] leading-none">
                          $
                          {finalTotal.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                        <span className="gw-font-text text-[12px] text-[#5f6368] font-medium ml-1">
                          USD
                        </span>
                      </div>
                    </div>
                  </div>

                  {paymentError && (
                    <div className="mb-3 p-3 rounded-[12px] bg-[#fce8e6] border border-[#fad2cf] text-[#d93025] text-[12.5px] font-medium">
                      {paymentError}
                    </div>
                  )}
                  {hasGuestPostItems && (
                    <div
                      role="status"
                      className="mb-3 rounded-[12px] border border-[#fbbc04]/60 bg-[#fef7e0] p-3 text-[12px] leading-relaxed text-[#6b5200]"
                    >
                      Guest Posting uses sample rates right now. Remove it from
                      the cart to pay for other services, or wait until final
                      rates are configured.
                    </div>
                  )}

                  {/* API Checkout Buttons */}
                  <div className="space-y-2.5">
                    <button
                      type="button"
                      onClick={() => openCheckoutModalWithCart(checkoutCart)}
                      disabled={
                        totalLinks === 0 ||
                        isInitializing ||
                        isRedirectingBoomFi ||
                        hasGuestPostItems
                      }
                      className="gw-font-display w-full h-[48px] sm:h-[50px] rounded-full bg-[#635bff] text-[#f6f9fc] font-medium text-[14.5px] sm:text-[15px] hover:bg-[#5249f5] hover:shadow-[0_4px_14px_rgba(26,115,232,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isInitializing ? (
                        "Opening Secure Card Checkout..."
                      ) : (
                        <>
                          <svg
                            className="w-8 h-4"
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
                              <rect
                                x="223.8"
                                y="69.3"
                                width="25.1"
                                height="87.5"
                              />
                              <path d="M196.9,76.7l-1.6-7.4h-21.6v87.5h25V97.5c5.9-7.7,15.9-6.3,19-5.2v-23C214.5,68.1,202.8,65.9,196.9,76.7z" />
                              <path d="M146.9,47.6l-24.4,5.2l-0.1,80.1c0,14.8,11.1,25.7,25.9,25.7c8.2,0,14.2-1.5,17.5-3.3V135c-3.2,1.3-19,5.9-19-8.9V90.6h19V69.3h-19L146.9,47.6z" />
                              <path d="M79.3,94.7c0-3.9,3.2-5.4,8.5-5.4c7.6,0,17.2,2.3,24.8,6.4V72.2c-8.3-3.3-16.5-4.6-24.8-4.6C67.5,67.6,54,78.2,54,95.9c0,27.6,38,23.2,38,35.1c0,4.6-4,6.1-9.6,6.1c-8.3,0-18.9-3.4-27.3-8v23.8c9.3,4,18.7,5.7,27.3,5.7c20.8,0,35.1-10.3,35.1-28.2C117.4,100.6,79.3,105.9,79.3,94.7z" />
                            </g>
                          </svg>
                          <span className="tracking-wide">
                            Pay with Card (Instant)
                          </span>
                        </>
                      )}
                    </button>

                    <div className="w-full relative z-0">
                      {totalLinks > 0 && !hasGuestPostItems ? (
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
                              height: 48,
                              color: "gold",
                              shape: "pill",
                              tagline: false,
                            }}
                            createOrder={async () => {
                              setPaymentError("");
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
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="w-full h-[48px] sm:h-[50px] rounded-full bg-[#FFC439] opacity-50 cursor-not-allowed flex items-center justify-center"
                        >
                          <span className="gw-font-display text-[14.5px] font-semibold text-[#003087]">
                            {hasGuestPostItems
                              ? "PayPal unavailable for sample rates"
                              : "PayPal"}
                          </span>
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleBoomFiCheckout}
                      disabled={
                        totalLinks === 0 ||
                        isInitializing ||
                        isRedirectingBoomFi ||
                        hasGuestPostItems
                      }
                      className="gw-font-display w-full h-[48px] sm:h-[50px] rounded-full border border-[#dadce0] bg-[#d5ff2e] text-[#202124] font-medium text-[14px] sm:text-[14.5px] hover:bg-[#c2ed15] hover:border-[#bdc1c6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isRedirectingBoomFi ? (
                        <>
                          <span className="w-4 h-4 border-2 border-[#1a73e8] border-t-transparent rounded-full animate-spin" />
                          <span>Redirecting to BoomFi Gateway...</span>
                        </>
                      ) : (
                        <>
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
                          <span>Pay with Crypto (BoomFi)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* --- 3. NETWORK SPECIFICATIONS COMPARISON (MOBILE TABS + DESKTOP TABLE) --- */}
      <section className="w-full bg-white py-10 sm:py-20 px-4 sm:px-6 border-t border-[#e8eaed]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-[700px] mx-auto mb-7 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f8f9fa] border border-[#e8eaed] text-[#5f6368] text-[11.5px] sm:text-[12px] font-medium mb-2.5 sm:mb-3">
              Network Architecture
            </div>
            <h2 className="gw-font-display text-[24px] sm:text-[38px] font-medium text-[#202124] leading-[1.15] tracking-[-0.02em] mb-2 sm:mb-3">
              Compare our <span className="text-[#1a73e8]">link networks.</span>
            </h2>
            <p className="gw-font-text text-[13.5px] sm:text-[15px] text-[#5f6368]">
              Every tier is hosted on isolated Class-C IPs with strict quality
              control and verified Ahrefs/Moz metrics.
            </p>
          </div>

          {/* MOBILE INTERACTIVE COMPARISON CARD */}
          <div className="md:hidden">
            <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-[#f8f9fa] rounded-[14px] border border-[#e8eaed] mb-4">
              {[
                { id: "standard", label: "Standard" },
                { id: "id_net", label: ".ID Network" },
                { id: "edu_gov", label: "EDU & GOV" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setMobileCompareTab(tab.id)}
                  className={`py-2 px-2 rounded-[10px] text-[12px] font-medium transition-all cursor-pointer ${
                    mobileCompareTab === tab.id
                      ? "bg-[#1a73e8] text-white shadow-sm"
                      : "text-[#5f6368]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-[20px] border border-[#dadce0] p-5 shadow-[0_6px_20px_rgba(60,64,67,0.05)]">
              <div className="flex items-center justify-between gap-2 pb-3.5 mb-3.5 border-b border-[#e8eaed]">
                <h3 className="gw-font-display text-[17px] font-medium text-[#202124]">
                  {mobileCompareData[mobileCompareTab].title}
                </h3>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${mobileCompareData[mobileCompareTab].color}`}
                >
                  {mobileCompareData[mobileCompareTab].badge}
                </span>
              </div>
              <div className="space-y-3">
                {mobileCompareData[mobileCompareTab].specs.map((row, i) => (
                  <div
                    key={i}
                    className="flex flex-col bg-[#f8f9fa] p-3 rounded-[12px] border border-[#e8eaed]"
                  >
                    <span className="text-[11px] font-medium text-[#5f6368] uppercase tracking-wider">
                      {row.label}
                    </span>
                    <span className="text-[13.5px] font-semibold text-[#202124] mt-0.5">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* DESKTOP 4-COLUMN COMPARISON TABLE */}
          <div className="hidden md:block overflow-x-auto bg-white rounded-[24px] border border-[#dadce0] shadow-[0_8px_28px_rgba(60,64,67,0.05)]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8f9fa] border-b border-[#e8eaed] text-[12.5px] font-semibold text-[#5f6368] uppercase tracking-wider">
                  <th className="py-4 px-6">Specification</th>
                  <th className="py-4 px-6 text-[#1a73e8]">Standard PBN</th>
                  <th className="py-4 px-6 text-[#d93025]">.ID Regional</th>
                  <th className="py-4 px-6 text-[#9334e6]">EDU & GOV Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8eaed] text-[14px] text-[#3c4043]">
                <tr>
                  <td className="py-4 px-6 font-medium text-[#202124]">
                    Domain Extensions (TLDs)
                  </td>
                  <td className="py-4 px-6">.COM, .NET, .ORG, .INFO</td>
                  <td className="py-4 px-6">.ID, .CO.ID, .WEB.ID, .OR.ID</td>
                  <td className="py-4 px-6 font-medium text-[#9334e6]">
                    .EDU, .AC.ID, .SCH.ID, .GO.ID
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-[#202124]">
                    Guaranteed Metrics
                  </td>
                  <td className="py-4 px-6">DA 50+ / DR 50+</td>
                  <td className="py-4 px-6">DA 50+ / DR 50+</td>
                  <td className="py-4 px-6">
                    DA 50–85+ / High Institutional Trust
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-[#202124]">
                    Link Attribute
                  </td>
                  <td className="py-4 px-6">100% Dofollow & Permanent</td>
                  <td className="py-4 px-6">100% Dofollow & Permanent</td>
                  <td className="py-4 px-6">100% Dofollow & Permanent</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-[#202124]">
                    Content Language
                  </td>
                  <td className="py-4 px-6">English / Multi-Niche</td>
                  <td className="py-4 px-6">Bahasa Indonesia & English</td>
                  <td className="py-4 px-6">Academic English & Indonesian</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-[#202124]">
                    Reporting Format
                  </td>
                  <td className="py-4 px-6">White-Label Excel / CSV</td>
                  <td className="py-4 px-6">White-Label Excel / CSV</td>
                  <td className="py-4 px-6">White-Label / Stealth Verified</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* --- FLOATING BUNDLE BAR (OPTIMISED FOR MOBILE & DESKTOP) --- */}
      {totalLinks > 0 && !isCheckoutGatewayOpen && !isOrderModalOpen && (
        <div className="lg:hidden fixed bottom-3 inset-x-3 sm:inset-x-4 max-w-[680px] mx-auto z-40 bg-[#202124]/95 backdrop-blur-md text-white rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.28)] border border-white/10 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] sm:text-[12px] text-[#9aa0a6]">
              <span className="w-2 h-2 rounded-full bg-[#34a853] shrink-0" />
              <span className="truncate">
                {selectedPackagesDetailed.length}{" "}
                {selectedPackagesDetailed.length === 1 ? "Service" : "Services"}{" "}
                • {totalLinks.toLocaleString()} Links
              </span>
            </div>
            <div className="gw-font-display text-[17px] sm:text-[20px] font-semibold text-white leading-tight">
              $
              {finalTotal.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              <span className="text-[11px] font-normal text-[#9aa0a6]">
                USD
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("estimator")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="text-[12px] font-medium text-white/90 bg-white/10 hover:bg-white/15 px-3 py-2 rounded-full transition-colors cursor-pointer"
            >
              Bundle
            </button>
            <button
              type="button"
              onClick={() => openCheckoutModalWithCart(checkoutCart)}
              disabled={hasGuestPostItems}
              className="gw-font-display text-[13px] sm:text-[14px] font-medium bg-[#1a73e8] hover:bg-[#1557b0] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-sm transition-colors cursor-pointer whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-50"
            >
              {hasGuestPostItems ? "Rates pending" : "Checkout →"}
            </button>
          </div>
        </div>
      )}

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

              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e8f0fe] text-[#1a73e8] text-[11px] sm:text-[11.5px] font-medium mb-1.5 sm:mb-2">
                Step 1 of 3 • Secure Checkout
              </div>
              <p className="text-[#5f6368] text-[12.5px] sm:text-[13px] mb-0.5 pr-6 truncate">
                {selectedPackagesDetailed.map((p) => p.name).join(" + ")} (
                {totalLinks.toLocaleString()} Links)
              </p>
              <h4 className="gw-font-display text-[28px] sm:text-[32px] font-medium text-[#202124] leading-none">
                $
                {finalTotal.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                <span className="text-[12.5px] font-normal text-[#5f6368]">
                  USD
                </span>
              </h4>
            </div>

            <div className="p-5 sm:p-6 space-y-4 sm:space-y-5">
              {isInitializing ? (
                <div className="py-8 text-center text-[13.5px] text-[#5f6368]">
                  Preparing secure 256-bit payment session...
                </div>
              ) : clientSecret ? (
                <Elements stripe={getStripePromise()}>
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
                <p className="text-[11.5px] sm:text-[12px] text-[#5f6368] text-center font-medium">
                  Or express checkout with PayPal / Crypto
                </p>

                {hasGuestPostItems ? (
                  <div className="rounded-[12px] bg-[#fef7e0] p-3 text-center text-[12px] text-[#6b5200]">
                    Payment disabled while the cart contains Guest Posting
                    sample rates.
                  </div>
                ) : (
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
                )}

                <button
                  type="button"
                  onClick={handleBoomFiCheckout}
                  disabled={isRedirectingBoomFi || hasGuestPostItems}
                  className="gw-font-display w-full h-[44px] sm:h-[46px] rounded-full border border-[#dadce0] bg-[#d5ff2e] hover:bg-[#c2ed15] text-[#202124] font-medium text-[13.5px] sm:text-[14px] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
        key={completedPayment?.transactionId || "no-payment"}
        isOpen={isOrderModalOpen}
        paymentData={completedPayment}
        selectedPackages={selectedPackagesDetailed}
        totalLinks={totalLinks}
        finalTotal={finalTotal}
        onClose={() => {
          setIsOrderModalOpen(false);
          setCompletedPayment(null);
          setCheckoutCart({});
          localStorage.removeItem(BOOMFI_ORDER_STORAGE_KEY);
          document.body.style.overflow = "auto";
        }}
      />
    </main>
  );
}
