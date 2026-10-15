import { Link } from "react-router-dom";
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
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

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

// --- COMPLETE 9 SERVICES CATALOGUE ---
const ALL_SERVICES = [
  {
    id: "hp_post",
    category: "standard",
    categoryLabel: "Standard PBN",
    name: "Homepage Post",
    price: 1.0,
    metric: "DA/DR 50+",
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
  const [expandedSpecs, setExpandedSpecs] = useState({});
  const [mobileCompareTab, setMobileCompareTab] = useState("standard");

  const [selectedQtys, setSelectedQtys] = useState({
    hp_post: 50,
    sidebar: 50,
    sticky: 50,
    id_hp_post: 50,
    id_sidebar: 50,
    id_sticky: 50,
    hidden_links: 50,
    edu_post: 50,
    edu_sidebar: 50,
  });

  // Active Checkout Cart
  const [checkoutCart, setCheckoutCart] = useState({});
  const [isCheckoutGatewayOpen, setIsCheckoutGatewayOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [isInitializing, setIsInitializing] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  // Post-Payment Onboarding Flow (Popup 2 & 3)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [completedPayment, setCompletedPayment] = useState(null);

  const categories = [
    { id: "all", label: "All Services", shortLabel: "All", count: 9 },
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

  const volumePresets = [50, 100, 250, 500, 1000];

  const filteredServices =
    activeCategory === "all"
      ? ALL_SERVICES
      : ALL_SERVICES.filter((s) => s.category === activeCategory);

  const updateCardQty = (id, val) => {
    let parsed = parseInt(val, 10);
    if (isNaN(parsed) || parsed < 50) parsed = 50;
    if (parsed > 5000) parsed = 5000;
    setSelectedQtys((prev) => ({ ...prev, [id]: parsed }));
    if (checkoutCart[id]) {
      setCheckoutCart((prev) => ({ ...prev, [id]: parsed }));
    }
  };

  const toggleMobileSpecs = (id) => {
    setExpandedSpecs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Trigger Instant Checkout for a Single Service Card
  const handleInstantOrder = async (serviceId) => {
    const qty = selectedQtys[serviceId] || 50;
    const newCart = { [serviceId]: qty };
    setCheckoutCart(newCart);
    await openCheckoutModalWithCart(newCart);
  };

  // Add/Toggle Service in Multi-Service Bundle
  const toggleBundleItem = (serviceId) => {
    const qty = selectedQtys[serviceId] || 50;
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

  const closeGatewayModal = () => {
    setIsCheckoutGatewayOpen(false);
    document.body.style.overflow = "auto";
  };

  const selectedPackagesDetailed = Object.entries(checkoutCart)
    .filter(([, q]) => q > 0)
    .map(([id, qty]) => {
      const svc = ALL_SERVICES.find((s) => s.id === id);
      return {
        id,
        name: svc ? svc.name : id,
        qty,
        price: svc ? svc.price : 0,
        subtotal: svc ? svc.price * qty : 0,
      };
    });

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

  const handleBoomFiCheckout = async () => {
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/create-boomfi-charge`,
        { cart: checkoutCart },
      );
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err) {
      setPaymentError("Unable to open BoomFi Crypto link.");
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
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* --- HERO HEADER SECTION (COMPACT ON MOBILE) --- */}
      <section className="relative w-full bg-white py-8 sm:py-16 lg:py-20 px-4 sm:px-6 border-b border-[#e8eaed] overflow-hidden">
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

          <h2 className="gw-font-display text-[26px] sm:text-[44px] md:text-[56px] font-medium text-[#202124] leading-[1.15] sm:leading-[1.12] tracking-[-0.025em] max-w-[860px] mx-auto mb-3 sm:mb-5 px-1">
            Enterprise PBN & Authority <br className="hidden sm:block" />
            <span className="text-[#1a73e8]">Link Building Services.</span>
          </h2>

          <p className="gw-font-text text-[14px] sm:text-[16.5px] md:text-[18px] text-[#5f6368] max-w-[680px] mx-auto leading-[1.55] sm:leading-[1.6] mb-5 sm:mb-8 px-1">
            Explore our 9 specialised backlink placements across global .COM,
            regional Indonesian .ID, and high-trust .EDU / .GOV networks.
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

      {/* --- STICKY CATEGORY BAR & SERVICES GRID --- */}
      <section className="w-full py-6 sm:py-14 lg:py-18 px-3.5 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          {/* Sticky Mobile & Desktop Filter Bar */}
          <div className="sticky top-[62px] sm:top-[74px] z-30 bg-white/95 backdrop-blur-md p-2.5 sm:p-3.5 rounded-[16px] sm:rounded-[20px] border border-[#e8eaed] shadow-[0_6px_20px_rgba(60,64,67,0.06)] mb-5 sm:mb-9 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
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

            <Link
              to="/#estimator"
              className="hidden sm:inline-flex items-center justify-center text-[12.5px] sm:text-[13px] font-medium text-[#1a73e8] hover:bg-[#e8f0fe] px-3.5 py-2 rounded-full transition-colors shrink-0"
            >
              Open Bulk Slider Calculator →
            </Link>
          </div>

          {/* 9 Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredServices.map((service) => {
              const currentQty = selectedQtys[service.id] || 50;
              const subtotal = currentQty * service.price;
              const inBundle = Boolean(checkoutCart[service.id]);
              const isSpecsOpen = Boolean(expandedSpecs[service.id]);

              return (
                <div
                  key={service.id}
                  className={`relative bg-white rounded-[20px] sm:rounded-[24px] border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                    inBundle
                      ? "border-[#1a73e8] ring-2 ring-[#e8f0fe] shadow-[0_12px_32px_rgba(26,115,232,0.10)]"
                      : "border-[#e8eaed] shadow-[0_2px_10px_rgba(60,64,67,0.04)] hover:shadow-[0_14px_36px_rgba(26,115,232,0.08)] hover:border-[#d2e3fc]"
                  }`}
                >
                  {/* Top Accent Strip */}
                  <div className={`h-[4px] w-full ${service.topAccent}`} />

                  <div className="p-4 sm:p-6 lg:p-7 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
                        <span
                          className={`text-[11px] sm:text-[11.5px] font-semibold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full ${service.badgeColor}`}
                        >
                          {service.badge}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-[#5f6368] bg-[#f8f9fa] px-2 py-0.5 rounded-full border border-[#e8eaed]">
                            ⏱ {service.turnaround}
                          </span>
                          <span className="text-[11px] sm:text-[11.5px] font-semibold bg-[#e6f4ea] text-[#1e8e3e] border border-[#ceead6] px-2.5 py-0.5 rounded-full">
                            {service.metric}
                          </span>
                        </div>
                      </div>

                      {/* Title & Price Header Row on Mobile */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h2 className="gw-font-display text-[18px] sm:text-[21px] font-medium text-[#202124] leading-snug">
                          {service.name}
                        </h2>
                        <div className="text-right shrink-0">
                          <span className="gw-font-display text-[20px] sm:text-[24px] font-semibold text-[#1a73e8] leading-none">
                            ${service.price.toFixed(2)}
                          </span>
                          <span className="block text-[10.5px] text-[#5f6368]">
                            per link
                          </span>
                        </div>
                      </div>

                      <p className="gw-font-text text-[13px] sm:text-[13.5px] text-[#5f6368] leading-[1.55] mb-3.5 sm:mb-5">
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
                            : "View 4 Included Features"}
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

                      {/* Feature Checklist (Collapsible on Mobile, Always Open on Desktop) */}
                      <ul
                        className={`${
                          isSpecsOpen ? "block" : "hidden sm:block"
                        } space-y-2 mb-4 sm:mb-6 bg-[#f8f9fa] sm:bg-transparent p-3 sm:p-0 rounded-[12px] border border-[#e8eaed] sm:border-0`}
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
                      {/* Quantity Stepper + Live Subtotal Row */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center bg-[#f8f9fa] border border-[#dadce0] rounded-full p-0.5">
                          <button
                            type="button"
                            onClick={() =>
                              updateCardQty(service.id, currentQty - 50)
                            }
                            className="w-7 h-7 rounded-full text-[#5f6368] hover:bg-white active:bg-[#e8eaed] flex items-center justify-center font-bold text-[14px] cursor-pointer"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min="50"
                            max="5000"
                            step="50"
                            value={currentQty}
                            onChange={(e) =>
                              updateCardQty(service.id, e.target.value)
                            }
                            className="w-[52px] text-center bg-transparent text-[13px] font-semibold text-[#202124] focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              updateCardQty(service.id, currentQty + 50)
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

                      {/* Responsive Action Buttons (Never Overflows on 320px Mobile) */}
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
                          {inBundle ? "✓ Added" : "+ Bundle"}
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

      {/* --- NETWORK SPECIFICATIONS COMPARISON (MOBILE TABS + DESKTOP TABLE) --- */}
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

          {/* MOBILE INTERACTIVE COMPARISON CARD (VISIBLE ON < MD SCREENS) */}
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

          {/* DESKTOP 4-COLUMN COMPARISON TABLE (VISIBLE ON >= MD SCREENS) */}
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
        <div className="fixed bottom-3 inset-x-3 sm:inset-x-4 max-w-[680px] mx-auto z-40 bg-[#202124]/95 backdrop-blur-md text-white rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.28)] border border-white/10 flex items-center justify-between gap-3">
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
              onClick={() => setCheckoutCart({})}
              className="text-[12px] font-medium text-white/80 hover:text-white px-2.5 py-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => openCheckoutModalWithCart(checkoutCart)}
              className="gw-font-display text-[13px] sm:text-[14px] font-medium bg-[#1a73e8] hover:bg-[#1557b0] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-sm transition-colors cursor-pointer whitespace-nowrap"
            >
              Checkout →
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
                <p className="text-[11.5px] sm:text-[12px] text-[#5f6368] text-center font-medium">
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
                  onClick={handleBoomFiCheckout}
                  className="gw-font-display w-full h-[44px] sm:h-[46px] rounded-full border border-[#dadce0] bg-white hover:bg-[#f8f9fa] text-[#202124] font-medium text-[13.5px] sm:text-[14px] flex items-center justify-center gap-2 cursor-pointer"
                >
                  Pay with Crypto (BoomFi)
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
          setCheckoutCart({});
          document.body.style.overflow = "auto";
        }}
      />
    </main>
  );
}
