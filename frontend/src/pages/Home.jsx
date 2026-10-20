import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
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

// ENVIRONMENT & API CONFIGURATION
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

  const transactionId =
    params.get("tx") ||
    params.get("payment_id") ||
    params.get("pid") ||
    savedOrder?.transactionId ||
    null;

  return { status, savedOrder, transactionId };
}

// YOUR 3 OFFICIAL TEAM CONTACTS (SHOWN IN POPUP 3)
const TEAM_CONTACTS = {
  whatsappUrl: "https://wa.me/447598789693",
  whatsappLabel: "+44 7598789693",
  telegramUrl: "https://t.me/SEOHUBLTD",
  telegramLabel: "@SEOHUBLTD",
  supportEmail: "hello@jasabacklinks.net",
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

// Custom Google Workspace Typography & Styling for Stripe Individual Fields
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

// PIECEWISE SLIDER MAPPING HELPERS (LOCKS THUMB TO EXACT VISUAL LABELS)
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

// POPUP 1: DEDICATED 3-FIELD CUSTOM STRIPE CARD FORM
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Field 1: Card Number */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-[13px] font-medium text-[#3c4043]">
            Card Number *
          </label>
          <span className="text-[11px] font-medium text-[#5f6368] uppercase tracking-wider">
            {cardBrand !== "unknown" ? cardBrand : "Visa • Mastercard • Amex"}
          </span>
        </div>
        <div
          className={`flex items-center px-3.5 py-3 bg-[#f8f9fa] focus-within:bg-white border rounded-[12px] transition-all ${
            numComplete
              ? "border-[#34a853] ring-2 ring-[#e6f4ea]"
              : "border-[#dadce0] focus-within:border-[#1a73e8] focus-within:ring-2 focus-within:ring-[#e8f0fe]"
          }`}
        >
          <svg
            className="w-5 h-5 text-[#5f6368] mr-3 shrink-0"
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
          {numComplete && (
            <svg
              className="w-4 h-4 text-[#34a853] ml-2 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
      </div>

      {/* Field 2 & 3: Expiry Date + CVV */}
      <div className="grid grid-cols-2 gap-3.5">
        <div>
          <label className="block text-[13px] font-medium text-[#3c4043] mb-1.5">
            Expiry Date *
          </label>
          <div
            className={`flex items-center px-3.5 py-3 bg-[#f8f9fa] focus-within:bg-white border rounded-[12px] transition-all ${
              expComplete
                ? "border-[#34a853] ring-2 ring-[#e6f4ea]"
                : "border-[#dadce0] focus-within:border-[#1a73e8] focus-within:ring-2 focus-within:ring-[#e8f0fe]"
            }`}
          >
            <svg
              className="w-4 h-4 text-[#5f6368] mr-2.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="1.8"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <div className="w-full">
              <CardExpiryElement
                options={STRIPE_ELEMENT_OPTIONS}
                onChange={(e) => handleElementChange(e, setExpComplete)}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-medium text-[#3c4043] mb-1.5">
            CVV / CVC *
          </label>
          <div
            className={`flex items-center px-3.5 py-3 bg-[#f8f9fa] focus-within:bg-white border rounded-[12px] transition-all ${
              cvcComplete
                ? "border-[#34a853] ring-2 ring-[#e6f4ea]"
                : "border-[#dadce0] focus-within:border-[#1a73e8] focus-within:ring-2 focus-within:ring-[#e8f0fe]"
            }`}
          >
            <svg
              className="w-4 h-4 text-[#5f6368] mr-2.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="1.8"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <div className="w-full">
              <CardCvcElement
                options={{
                  ...STRIPE_ELEMENT_OPTIONS,
                  placeholder: "CVC",
                }}
                onChange={(e) => handleElementChange(e, setCvcComplete)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Live Validation Error Alert */}
      {errorMessage && (
        <div className="p-3 rounded-[12px] bg-[#fce8e6] border border-[#fad2cf] text-[#d93025] text-[12.5px] font-medium flex items-center gap-2">
          <svg
            className="w-4 h-4 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="gw-font-display w-full h-[52px] bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-full font-medium text-[15px] transition-all shadow-[0_6px_20px_rgba(26,115,232,0.25)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Verifying & Processing...</span>
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2.2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>
                Pay $
                {totalAmount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                USD
              </span>
            </>
          )}
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 pt-1 text-[11.5px] text-[#5f6368]">
        <svg
          className="w-3.5 h-3.5 text-[#34a853]"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        <span>256-bit SSL Encrypted • Instant Step 2 Onboarding</span>
      </div>
    </form>
  );
}

// POPUP 2 & POPUP 3: POST-PAYMENT ORDER DETAILS + THANK YOU & TEAM CONTACTS
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

      <div className="relative w-full max-w-[580px] max-h-[94vh] overflow-y-auto bg-white rounded-t-[24px] sm:rounded-[24px] shadow-[0_24px_60px_rgba(0,0,0,0.28)] border border-[#dadce0] animate-in fade-in zoom-in-95 duration-200">
        {/* Google 4-Colour Top Strip */}
        <div className="grid grid-cols-4 h-[4px] w-full">
          <div className="bg-[#4285F4]" />
          <div className="bg-[#EA4335]" />
          <div className="bg-[#FBBC04]" />
          <div className="bg-[#34A853]" />
        </div>

        {isStep3ThankYou ? (
          <div className="p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e6f4ea] text-[#1e8e3e] text-[12px] font-semibold mb-3">
                Step 3 of 3 • Order Complete
              </div>
              <div className="w-16 h-16 rounded-full bg-[#e6f4ea] text-[#1e8e3e] flex items-center justify-center mx-auto mb-4 shadow-sm">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="gw-font-display text-[26px] sm:text-[28px] font-medium text-[#202124] mb-2">
                Thank You, {fullName}!
              </h3>
              <p className="gw-font-text text-[14.5px] text-[#5f6368] max-w-[460px] mx-auto leading-[1.6]">
                Your campaign requirements and{" "}
                <strong className="text-[#202124]">{contactPlatform}</strong>{" "}
                contact (
                <strong className="text-[#1a73e8]">{contactHandle}</strong>)
                have been received. Our SEO team has started processing your{" "}
                <strong className="text-[#202124]">
                  {totalLinks.toLocaleString()} backlinks
                </strong>
                .
              </p>
            </div>

            {/* Order Receipt Summary Box */}
            <div className="bg-[#f8f9fa] rounded-[16px] p-4 border border-[#e8eaed] mb-6 text-[13px] text-[#5f6368] space-y-2">
              <div className="flex justify-between items-center">
                <span>Transaction Reference:</span>
                <span className="font-mono font-semibold text-[#202124] bg-white px-2.5 py-0.5 rounded border border-[#dadce0]">
                  {paymentData.transactionId}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Amount Paid:</span>
                <span className="font-semibold text-[#1e8e3e]">
                  $
                  {finalTotal.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  USD (Verified)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Your Registered Contact:</span>
                <span className="font-medium text-[#202124]">
                  {contactPlatform}: {contactHandle}
                </span>
              </div>
            </div>

            {/* OUR 3 DIRECT TEAM CONTACTS */}
            <div className="mb-6">
              <h4 className="gw-font-display text-[15px] font-medium text-[#202124] text-center mb-1">
                Need Instant Assistance or Custom Drip-Feed?
              </h4>
              <p className="gw-font-text text-[12.5px] text-[#5f6368] text-center mb-4">
                Reach out to our team directly on any of our 3 official channels
                below:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. WhatsApp */}
                <a
                  href={TEAM_CONTACTS.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-4 rounded-[16px] bg-[#f8f9fa] hover:bg-[#e6f4ea]/60 border border-[#e8eaed] hover:border-[#34a853] transition-all group text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-[#e6f4ea] text-[#1e8e3e] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z" />
                    </svg>
                  </div>
                  <span className="gw-font-display text-[13.5px] font-medium text-[#202124]">
                    WhatsApp Priority
                  </span>
                  <span className="text-[11.5px] text-[#1e8e3e] font-medium mt-0.5">
                    {TEAM_CONTACTS.whatsappLabel}
                  </span>
                </a>

                {/* 2. Telegram */}
                <a
                  href={TEAM_CONTACTS.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-4 rounded-[16px] bg-[#f8f9fa] hover:bg-[#e8f0fe]/60 border border-[#e8eaed] hover:border-[#1a73e8] transition-all group text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                  </div>
                  <span className="gw-font-display text-[13.5px] font-medium text-[#202124]">
                    Telegram Agency
                  </span>
                  <span className="text-[11.5px] text-[#1a73e8] font-medium mt-0.5">
                    {TEAM_CONTACTS.telegramLabel}
                  </span>
                </a>

                {/* 3. Direct Support Team */}
                <a
                  href={`mailto:${TEAM_CONTACTS.supportEmail}`}
                  className="flex flex-col items-center justify-center p-4 rounded-[16px] bg-[#f8f9fa] hover:bg-[#fef7e0]/60 border border-[#e8eaed] hover:border-[#fbbc04] transition-all group text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-[#fef7e0] text-[#f29900] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <span className="gw-font-display text-[13.5px] font-medium text-[#202124]">
                    Enterprise Support
                  </span>
                  <span className="text-[11.5px] text-[#f29900] font-medium mt-0.5 break-all">
                    {TEAM_CONTACTS.supportEmail}
                  </span>
                </a>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="gw-font-display w-full h-[50px] rounded-full bg-[#202124] hover:bg-[#3c4043] text-white font-medium text-[15px] transition-colors cursor-pointer"
            >
              Done & Return to Website
            </button>
          </div>
        ) : (
          <>
            {/* Top Premium Payment Successful Banner */}
            <div className="bg-gradient-to-r from-[#e6f4ea] via-[#f1faf4] to-[#e8f0fe] px-6 py-5 border-b border-[#ceead6]">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#34a853] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2.8"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="gw-font-display text-[18px] sm:text-[20px] font-medium text-[#137333]">
                        Payment Successful
                      </span>
                      <span className="text-[11px] font-semibold bg-white text-[#1e8e3e] px-2.5 py-0.5 rounded-full border border-[#ceead6]">
                        Step 2 of 3
                      </span>
                    </div>
                    <p className="text-[12.5px] text-[#3c4043] mt-0.5">
                      Paid{" "}
                      <strong>
                        $
                        {finalTotal.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        USD
                      </strong>{" "}
                      for <strong>{totalLinks.toLocaleString()} Links</strong> •
                      TXN:{" "}
                      <span className="font-mono text-[12px]">
                        {paymentData.transactionId}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-7">
              <div className="mb-4">
                <h3 className="gw-font-display text-[20px] sm:text-[22px] font-medium text-[#202124]">
                  Submit Your Order & Contact Details
                </h3>
                <p className="gw-font-text text-[13.5px] text-[#5f6368] mt-0.5">
                  Please provide your target URLs, anchor texts, and direct
                  contact below so we can begin placements immediately.
                </p>
              </div>

              {/* Mandatory Contact Notice Banner */}
              <div className="mb-5 p-3.5 rounded-[14px] bg-[#fef7e0] border border-[#fde293] flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-[#f29900] shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="gw-font-text text-[12.5px] text-[#3c4043] leading-[1.5]">
                  <strong className="text-[#202124]">
                    Adding your WhatsApp or Telegram contact is mandatory:
                  </strong>{" "}
                  Our project manager uses this to send you instant campaign
                  updates and your live white-label tracking sheet.
                </p>
              </div>

              <form onSubmit={handleOrderSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[13px] font-medium text-[#3c4043] mb-1.5">
                      Your Name / Agency Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-3.5 py-2.5 bg-[#f8f9fa] focus:bg-white border border-[#dadce0] rounded-[10px] focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#e8f0fe] text-[14px] text-[#202124]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[#3c4043] mb-1.5">
                      Email for Report & Receipt *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@agency.com"
                      className="w-full px-3.5 py-2.5 bg-[#f8f9fa] focus:bg-white border border-[#dadce0] rounded-[10px] focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#e8f0fe] text-[14px] text-[#202124]"
                    />
                  </div>
                </div>

                {/* REQUIRED WHATSAPP OR TELEGRAM CONTACT FIELD */}
                <div className="p-3.5 rounded-[14px] bg-[#f8fbff] border border-[#d2e3fc]">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <label className="block text-[13px] font-semibold text-[#1a73e8]">
                      Your WhatsApp Number or Telegram Username (Required) *
                    </label>
                    <div className="inline-flex rounded-full bg-white p-0.5 border border-[#dadce0]">
                      {["WhatsApp", "Telegram"].map((platform) => (
                        <button
                          key={platform}
                          type="button"
                          onClick={() => setContactPlatform(platform)}
                          className={`px-3 py-1 rounded-full text-[11.5px] font-medium transition-all cursor-pointer ${
                            contactPlatform === platform
                              ? "bg-[#1a73e8] text-white"
                              : "text-[#5f6368] hover:text-[#202124]"
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
                        ? "e.g. +44 7598 789693 (with country code)"
                        : "e.g. @yourusername"
                    }
                    className="w-full px-3.5 py-2.5 bg-white border border-[#dadce0] rounded-[10px] focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#e8f0fe] text-[14px] text-[#202124]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#3c4043] mb-1.5">
                    Target URLs (One URL per line) *
                  </label>
                  <textarea
                    rows="2"
                    required
                    value={targetUrls}
                    onChange={(e) => setTargetUrls(e.target.value)}
                    placeholder={`https://yourclient.com/\nhttps://yourclient.com/services`}
                    className="w-full px-3.5 py-2.5 bg-[#f8f9fa] focus:bg-white border border-[#dadce0] rounded-[10px] focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#e8f0fe] text-[14px] text-[#202124]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#3c4043] mb-1.5">
                    Target Keywords / Anchor Texts *
                  </label>
                  <textarea
                    rows="2"
                    required
                    value={anchorTexts}
                    onChange={(e) => setAnchorTexts(e.target.value)}
                    placeholder="best seo agency, digital marketing services, brand name"
                    className="w-full px-3.5 py-2.5 bg-[#f8f9fa] focus:bg-white border border-[#dadce0] rounded-[10px] focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#e8f0fe] text-[14px] text-[#202124]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#3c4043] mb-1.5">
                    Special Instructions / Drip-Feed Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Drip-feed over 7 days, Bahasa Indonesia articles..."
                    className="w-full px-3.5 py-2.5 bg-[#f8f9fa] focus:bg-white border border-[#dadce0] rounded-[10px] focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#e8f0fe] text-[14px] text-[#202124]"
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
                  className="gw-font-display w-full h-[52px] rounded-full bg-[#1a73e8] text-white font-medium text-[15px] hover:bg-[#1557b0] shadow-[0_6px_20px_rgba(26,115,232,0.25)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Saving Order Details..."
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

// LIVE PACKAGE ESTIMATOR & CHECKOUT SECTION
function PackageEstimator() {
  const [boomfiReturn] = useState(readBoomFiReturnState);
  const restoredCart =
    boomfiReturn.savedOrder?.cart &&
    Object.keys(boomfiReturn.savedOrder.cart).length > 0
      ? boomfiReturn.savedOrder.cart
      : { hp_post: 1 };
  const returnPayment =
    boomfiReturn.status === "success" && boomfiReturn.transactionId
      ? {
          transactionId: boomfiReturn.transactionId,
          method: "BoomFi Crypto Gateway",
        }
      : null;
  const [cart, setCart] = useState(restoredCart);
  const [activeCategory, setActiveCategory] = useState("all");

  // Payment & Modal States
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);
  const [isRedirectingBoomFi, setIsRedirectingBoomFi] = useState(false);
  const [paymentError, setPaymentError] = useState(
    boomfiReturn.status === "failed"
      ? "Crypto payment was cancelled or expired. You can try again below."
      : boomfiReturn.status === "success" && !boomfiReturn.transactionId
        ? "Could not identify the BoomFi transaction. Please contact support before submitting an order."
        : "",
  );

  // Post-Payment Order Form Modal State (Popup 2 & Popup 3)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(Boolean(returnPayment));
  const [completedPayment, setCompletedPayment] = useState(returnPayment);

  const services = [
    {
      id: "hp_post",
      category: "standard",
      name: "Homepage Post",
      price: 1.0,
      desc: "Contextual homepage placement",
      metric: "DA/DR 50+",
      tag: "Popular",
    },
    {
      id: "sidebar",
      category: "standard",
      name: "Sidebar Blogroll",
      price: 2.0,
      desc: "High-authority sitewide sidebar link",
      metric: "DA/DR 50+",
    },
    {
      id: "sticky",
      category: "standard",
      name: "Homepage Sticky Post",
      price: 2.0,
      desc: "Pinned on homepage for maximum link juice",
      metric: "DA/DR 50+",
    },
    {
      id: "id_hp_post",
      category: "id_net",
      name: ".ID Homepage Post",
      price: 2.0,
      desc: "Indonesian regional contextual homepage link",
      metric: "DA/DR 50+",
      tag: "Regional .ID",
    },
    {
      id: "id_sidebar",
      category: "id_net",
      name: ".ID Sidebar Blogroll",
      price: 3.0,
      desc: "Local .ID sitewide blogroll placement",
      metric: "DA/DR 50+",
    },
    {
      id: "id_sticky",
      category: "id_net",
      name: ".ID Sticky Post",
      price: 2.5,
      desc: "Pinned .ID homepage placement",
      metric: "DA/DR 50+",
    },
    {
      id: "hidden_links",
      category: "edu_gov",
      name: "Hidden Links (AC.ID, SCH.ID, GO.ID)",
      price: 20.0,
      desc: "Official academic & government domains",
      metric: "High Trust",
      tag: "Exclusive",
    },
    {
      id: "edu_post",
      category: "edu_gov",
      name: "EDU PBN Blogpost",
      price: 3.0,
      desc: "Academic contextual article placement",
      metric: "DA/DR 50+",
    },
    {
      id: "edu_sidebar",
      category: "edu_gov",
      name: "EDU PBN Blogroll",
      price: 5.0,
      desc: "University sidebar sitewide placement",
      metric: "DA/DR 50+",
    },
  ];

  const categories = [
    { id: "all", label: "All Placements (9)" },
    { id: "standard", label: "Standard PBN (3)" },
    { id: "id_net", label: ".ID Regional (3)" },
    { id: "edu_gov", label: "EDU & GOV (3)" },
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

  // Clean the return parameters after initializing restored state.
  useEffect(() => {
    if (boomfiReturn.status === "success" && boomfiReturn.transactionId) {
      document.body.style.overflow = "hidden";
    }
    if (boomfiReturn.status === "success" || boomfiReturn.status === "failed") {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [boomfiReturn.status, boomfiReturn.transactionId]);

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
    if (val > 5000) val = 5000;

    setCart((prev) => ({ ...prev, [id]: val }));
  };

  const handleSliderPosChange = (id, sliderPosValue) => {
    const mappedQty = sliderPosToQty(sliderPosValue);
    setServiceQty(id, mappedQty);
  };

  const clearCart = () => setCart({});

  const filteredServices =
    activeCategory === "all"
      ? services
      : services.filter((s) => s.category === activeCategory);

  const selectedEntries = Object.entries(cart).filter(([, qty]) => qty > 0);
  const selectedPackagesCount = selectedEntries.length;

  const selectedPackagesDetailed = selectedEntries.map(([id, qty]) => {
    const svc = services.find((s) => s.id === id);
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

  const totalLinks = selectedEntries.reduce((sum, [, qty]) => sum + qty, 0);

  // 1. STRIPE CHECKOUT INITIATION
  const handleStripeCheckoutClick = async () => {
    setIsInitializingPayment(true);
    setPaymentError("");
    try {
      const [{ data }] = await Promise.all([
        axios.post(`${BACKEND_URL}/api/create-stripe-intent`, { cart }),
        getStripePromise(),
      ]);
      setClientSecret(data.clientSecret);
      setIsStripeModalOpen(true);
      document.body.style.overflow = "hidden";
    } catch (error) {
      console.error("Failed to initialise Stripe:", error);
      setPaymentError(
        error.response?.data?.error ||
          "Unable to connect to payment server. Please check your connection.",
      );
    } finally {
      setIsInitializingPayment(false);
    }
  };

  // 2. BOOMFI CRYPTO GATEWAY (SAME-TAB REDIRECT -> AUTO RETURN -> STEP 2 POPUP)
  const handleBoomFiSubmit = async () => {
    setIsRedirectingBoomFi(true);
    setPaymentError("");
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/create-boomfi-charge`,
        {
          cart,
          originUrl: window.location.origin,
        },
      );

      if (data?.checkoutUrl && data.transactionId) {
        const txId = data.transactionId;

        // Save selected cart & transaction ID before leaving page
        try {
          localStorage.setItem(
            BOOMFI_ORDER_STORAGE_KEY,
            JSON.stringify({
              cart,
              transactionId: txId,
              timestamp: Date.now(),
            }),
          );
        } catch (error) {
          console.error("Could not save pending BoomFi order:", error);
          setPaymentError(
            "Your browser could not save this order for the return flow. Enable local storage and try again.",
          );
          setIsRedirectingBoomFi(false);
          return;
        }

        // Open BoomFi in the exact same tab
        window.location.href = data.checkoutUrl;
      } else {
        setPaymentError(
          "BoomFi did not return a valid payment link and transaction reference. Please verify the backend configuration.",
        );
        setIsRedirectingBoomFi(false);
      }
    } catch (error) {
      console.error("BoomFi Gateway Error:", error);
      setPaymentError(
        error.response?.data?.error ||
          "Unable to initialise BoomFi Crypto Checkout. Please verify your BoomFi API key in backend .env.",
      );
      setIsRedirectingBoomFi(false);
    }
  };

  const closeStripeModal = () => {
    setIsStripeModalOpen(false);
    document.body.style.overflow = "auto";
  };

  // SEAMLESS TRANSITION FROM POPUP 1 -> POPUP 2
  const handlePaymentSuccess = (
    transactionId,
    method = "Credit / Debit Card",
  ) => {
    setIsStripeModalOpen(false);
    setCompletedPayment({
      transactionId,
      method,
    });
    setIsOrderModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeOrderModal = () => {
    localStorage.removeItem(BOOMFI_ORDER_STORAGE_KEY);
    setIsOrderModalOpen(false);
    setCompletedPayment(null);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      <section
        id="estimator"
        className="w-full bg-[#fcfcfc] py-10 sm:py-16 lg:py-20 px-4 sm:px-6 border-t border-[#e8eaed]"
      >
        <div className="max-w-[1200px] mx-auto">
          {/* Header */}
          <div className="mb-7 sm:mb-10 max-w-[740px] mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#e8f0fe] text-[#1a73e8] text-[11.5px] sm:text-[12.5px] font-medium mb-3">
              <span className="w-2 h-2 rounded-full bg-[#1a73e8] animate-pulse" />
              Interactive Cost Calculator
            </div>
            <h2 className="gw-font-display text-[28px] sm:text-[36px] md:text-[44px] font-medium text-[#202124] leading-[1.15] tracking-[-0.025em] mb-2.5">
              Customise your{" "}
              <span className="text-[#1a73e8]">PBN package.</span>
            </h2>
            <p className="gw-font-text text-[14.5px] sm:text-[16px] text-[#5f6368] leading-[1.6]">
              Tap any placement to start from 50 links or slide up to 5,000
              links. Combine multiple packages in real-time.
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
                      const active = activeCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setActiveCategory(cat.id)}
                          className={`text-[12px] sm:text-[12.5px] font-medium px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap cursor-pointer ${
                            active
                              ? "bg-[#1a73e8] text-white shadow-sm"
                              : "bg-[#f8f9fa] text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4]"
                          }`}
                        >
                          {cat.label}
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
                    Presets:
                  </span>
                  {presets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setActiveCategory("all");
                        setCart(preset.config);
                      }}
                      className="text-[11.5px] font-medium bg-[#f8f9fa] hover:bg-[#e8f0fe] text-[#3c4043] hover:text-[#1a73e8] border border-[#dadce0] hover:border-[#d2e3fc] px-2.5 py-1 rounded-full transition-all cursor-pointer whitespace-nowrap shrink-0"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Service Rows */}
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                {filteredServices.map((service) => {
                  const currentQty = cart[service.id] || 0;
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
                          if (!isActive) setServiceQty(service.id, 1);
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
                              setServiceQty(service.id, isActive ? 0 : 1);
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
                              {service.tag && (
                                <span className="text-[10px] sm:text-[11px] font-medium bg-[#e8f0fe] text-[#1a73e8] px-1.5 sm:px-2 py-0.5 rounded-md">
                                  {service.tag}
                                </span>
                              )}
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
                                setServiceQty(service.id, 1);
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
                                    setServiceQty(service.id, stopVal)
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
                                setServiceQty(
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
                                setServiceQty(service.id, e.target.value)
                              }
                              className="w-[54px] sm:w-[60px] text-center bg-transparent text-[13.5px] sm:text-[14px] font-semibold text-[#202124] focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setServiceQty(
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
              </div>
            </div>

            {/* Right Column: Sticky Order Summary on Desktop */}
            <aside
              id="order-summary-card"
              className="w-full lg:w-[390px] xl:w-[420px] shrink-0 lg:sticky lg:top-[96px] self-start transition-all duration-300 mt-2 lg:mt-0"
            >
              <div className="bg-white rounded-[22px] sm:rounded-[24px] border border-[#dadce0] shadow-[0_12px_36px_rgba(60,64,67,0.08)] overflow-hidden flex flex-col lg:max-h-[calc(100vh-88px)]">
                <div className="grid grid-cols-4 h-[4px] w-full shrink-0">
                  <div className="bg-[#4285F4]" />
                  <div className="bg-[#EA4335]" />
                  <div className="bg-[#FBBC04]" />
                  <div className="bg-[#34A853]" />
                </div>

                <div className="p-4 sm:p-5 flex flex-col flex-1 min-h-0">
                  <div className="flex items-center justify-between mb-3 border-b border-[#e8eaed] pb-2.5 shrink-0">
                    <div>
                      <h3 className="gw-font-display text-[18px] sm:text-[19px] font-medium text-[#202124] leading-tight">
                        Order Summary
                      </h3>
                      <p className="text-[11.5px] sm:text-[12px] text-[#5f6368] mt-0.5">
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

                  <div className="flex-1 overflow-y-auto max-h-[135px] xl:max-h-[175px] mb-3 pr-1 space-y-1.5 gw-font-text custom-scrollbar">
                    {selectedPackagesCount === 0 ? (
                      <div className="text-center py-4 px-3 bg-[#f8f9fa] rounded-[14px] border border-dashed border-[#dadce0]">
                        <p className="text-[13px] text-[#5f6368] font-medium">
                          No placements selected
                        </p>
                        <p className="text-[11.5px] text-[#9aa0a6] mt-0.5">
                          Tap any placement or preset to start from 50 links.
                        </p>
                      </div>
                    ) : (
                      selectedEntries.map(([id, qty]) => {
                        const svc = services.find((s) => s.id === id);
                        if (!svc) return null;
                        return (
                          <div
                            key={id}
                            className="flex justify-between items-center bg-[#f8f9fa] hover:bg-[#f1f3f4]/70 px-3 py-2 rounded-[12px] border border-[#e8eaed] transition-colors"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-[11px] font-bold bg-[#e8f0fe] text-[#1a73e8] px-2 py-0.5 rounded-full shrink-0">
                                {qty.toLocaleString()}
                              </span>
                              <div className="min-w-0">
                                <p className="text-[12.5px] sm:text-[13px] font-medium text-[#202124] truncate">
                                  {svc.name}
                                </p>
                                <p className="text-[10.5px] text-[#5f6368]">
                                  ${svc.price.toFixed(2)} / link
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0 pl-2">
                              <span className="text-[12.5px] sm:text-[13px] font-semibold text-[#202124]">
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

                  <div className="bg-[#f8f9fa] rounded-[14px] sm:rounded-[16px] p-3.5 mb-3 border border-[#e8eaed] shrink-0">
                    <div className="flex justify-between items-center mb-1.5 text-[12px] sm:text-[12.5px] text-[#5f6368]">
                      <span>Selected Services</span>
                      <span className="font-medium text-[#202124]">
                        {selectedPackagesCount}{" "}
                        {selectedPackagesCount === 1 ? "Service" : "Services"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2 pb-2 border-b border-[#dadce0] text-[12px] sm:text-[12.5px] text-[#5f6368]">
                      <span>Total Volume</span>
                      <span className="font-semibold text-[#1a73e8] bg-[#e8f0fe] px-2.5 py-0.5 rounded-full">
                        {totalLinks.toLocaleString()} Backlinks
                      </span>
                    </div>
                    <div className="flex justify-between items-end pt-0.5">
                      <div>
                        <span className="gw-font-display text-[14px] sm:text-[14.5px] font-medium text-[#202124] block">
                          Estimated Total
                        </span>
                        <span className="text-[10.5px] sm:text-[11px] text-[#1e8e3e] font-medium">
                          Instant Setup Included
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="gw-font-display text-[24px] sm:text-[27px] font-medium text-[#1a73e8] leading-none">
                          $
                          {finalTotal.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                        <span className="gw-font-text text-[11.5px] text-[#5f6368] font-medium ml-1">
                          USD
                        </span>
                      </div>
                    </div>
                  </div>

                  {paymentError && (
                    <div className="mb-2.5 p-2.5 rounded-[12px] bg-[#fce8e6] border border-[#fad2cf] text-[#d93025] text-[12px] font-medium shrink-0">
                      {paymentError}
                    </div>
                  )}

                  {/* API Checkout Buttons */}
                  <div className="space-y-2 shrink-0">
                    {/* 1. Stripe Card Checkout Button */}
                    <button
                      type="button"
                      onClick={handleStripeCheckoutClick}
                      disabled={
                        totalLinks === 0 ||
                        isInitializingPayment ||
                        isRedirectingBoomFi
                      }
                      className="gw-font-display w-full h-[44px] rounded-full bg-[#635bff] text-[#f6f9fc] font-medium text-[14px] sm:text-[14.5px] hover:bg-[#635bff] hover:shadow-[0_4px_14px_rgba(26,115,232,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isInitializingPayment ? (
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

                    {/* 2. PayPal Smart Buttons */}
                    <div className="w-full relative z-0">
                      {totalLinks > 0 ? (
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
                              setPaymentError("");
                              try {
                                const { data } = await axios.post(
                                  `${BACKEND_URL}/api/create-paypal-order`,
                                  { cart },
                                );
                                return data.id;
                              } catch (err) {
                                setPaymentError(
                                  err.response?.data?.error ||
                                    "Could not initiate PayPal order. Check backend connection.",
                                );
                                throw err;
                              }
                            }}
                            onApprove={async (data) => {
                              try {
                                const res = await axios.post(
                                  `${BACKEND_URL}/api/capture-paypal-order`,
                                  { orderID: data.orderID },
                                );
                                handlePaymentSuccess(
                                  res.data?.captureId || data.orderID,
                                  "PayPal Checkout",
                                );
                              } catch {
                                setPaymentError(
                                  "Failed to capture PayPal payment.",
                                );
                              }
                            }}
                          />
                        </PayPalScriptProvider>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="w-full h-[44px] rounded-full bg-[#FFC439] opacity-50 cursor-not-allowed flex items-center justify-center"
                        >
                          <span className="gw-font-display text-[14px] font-semibold text-[#003087]">
                            PayPal
                          </span>
                        </button>
                      )}
                    </div>

                    {/* 3. BoomFi Crypto Gateway Button (Same-Tab Redirect) */}
                    <button
                      type="button"
                      onClick={handleBoomFiSubmit}
                      disabled={
                        totalLinks === 0 ||
                        isInitializingPayment ||
                        isRedirectingBoomFi
                      }
                      className="gw-font-display w-full h-[44px] rounded-full border border-[#dadce0] bg-[#d5ff2e] text-[#202124] font-medium text-[14px] hover:bg-[#c2ed15] hover:border-[#bdc1c6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
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

      {/* FLOATING MOBILE QUICK-SUMMARY BAR */}
      {totalLinks > 0 && !isStripeModalOpen && !isOrderModalOpen && (
        <div className="lg:hidden fixed bottom-3 inset-x-3 z-40 bg-[#202124]/95 backdrop-blur-md text-white rounded-2xl px-4 py-3 shadow-[0_12px_32px_rgba(0,0,0,0.28)] border border-white/10 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#9aa0a6]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34a853]" />
              <span>
                {selectedPackagesCount}{" "}
                {selectedPackagesCount === 1 ? "Service" : "Services"} •{" "}
                {totalLinks.toLocaleString()} Links
              </span>
            </div>
            <div className="gw-font-display text-[18px] font-semibold text-white leading-tight">
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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("order-summary-card")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="text-[12px] font-medium text-white/90 bg-white/10 hover:bg-white/15 px-3 py-2 rounded-full transition-colors"
            >
              Summary
            </button>
            <button
              type="button"
              onClick={handleStripeCheckoutClick}
              className="gw-font-display text-[13px] font-medium bg-[#1a73e8] hover:bg-[#1557b0] text-white px-4 py-2 rounded-full shadow-sm transition-colors"
            >
              Checkout
            </button>
          </div>
        </div>
      )}

      {/* POPUP 1: CUSTOM 3-FIELD STRIPE CARD MODAL */}
      {isStripeModalOpen && clientSecret && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="absolute inset-0 bg-[#202124]/55 backdrop-blur-[3px] transition-opacity"
            onClick={closeStripeModal}
          />
          <div className="relative w-full max-w-[440px] bg-white rounded-t-[24px] sm:rounded-[24px] shadow-[0_24px_60px_rgba(0,0,0,0.25)] border border-[#dadce0] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="grid grid-cols-4 h-[4px] w-full">
              <div className="bg-[#4285F4]" />
              <div className="bg-[#EA4335]" />
              <div className="bg-[#FBBC04]" />
              <div className="bg-[#34A853]" />
            </div>

            <div className="bg-[#f8fbff] px-6 py-5 border-b border-[#e8eaed] relative">
              <button
                type="button"
                onClick={closeStripeModal}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#e8eaed] transition-colors text-[#5f6368] hover:text-[#202124] cursor-pointer"
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

              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e8f0fe] text-[#1a73e8] text-[11.5px] font-medium mb-2">
                Step 1 of 3 • Secure Card Checkout
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[#5f6368] text-[13px] mb-0.5 font-medium">
                    Jasa Backlinks ({totalLinks.toLocaleString()} Links)
                  </p>
                  <h4 className="gw-font-display text-[32px] font-medium text-[#202124] leading-none tracking-tight">
                    $
                    {finalTotal.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    <span className="text-[13px] font-normal text-[#5f6368]">
                      USD
                    </span>
                  </h4>
                </div>
              </div>
            </div>

            <div className="p-6">
              <Elements stripe={getStripePromise()}>
                <CustomStripeCardForm
                  clientSecret={clientSecret}
                  totalAmount={finalTotal}
                  onSuccess={handlePaymentSuccess}
                />
              </Elements>
            </div>
          </div>
        </div>
      )}

      {/* POPUP 2 & POPUP 3: ORDER DETAILS + THANK YOU & CONTACTS */}
      <OrderOnboardingFlowModal
        key={completedPayment?.transactionId || "no-payment"}
        isOpen={isOrderModalOpen}
        paymentData={completedPayment}
        selectedPackages={selectedPackagesDetailed}
        totalLinks={totalLinks}
        finalTotal={finalTotal}
        onClose={closeOrderModal}
      />
    </>
  );
}

// TRUST METRICS SECTION
function TrustMetricsSection() {
  const metrics = [
    {
      title: "4.9 out of 5",
      description: "Average rating from 4,000+ verified agency reviews",
      badge: "Top Rated",
      icon: (
        <svg
          className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px]"
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
          className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px]"
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
          className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px]"
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
          className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px]"
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
    <section className="relative w-full bg-white py-12 sm:py-20 lg:py-28 px-4 sm:px-6 border-t border-[#e8eaed]">
      <div className="max-w-[1200px] mx-auto text-center">
        <div className="max-w-[720px] mx-auto mb-10 sm:mb-14 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#f8f9fa] border border-[#e8eaed] text-[#5f6368] text-[11.5px] sm:text-[12.5px] font-medium mb-3 sm:mb-4">
            <span className="w-2 h-2 rounded-full bg-[#34a853]" />
            Enterprise-Grade Link Infrastructure
          </div>
          <h2 className="gw-font-display text-[28px] sm:text-[36px] md:text-[44px] lg:text-[50px] font-medium text-[#202124] leading-[1.15] tracking-[-0.025em] mb-3 sm:mb-4">
            Trusted by Businesses. <br />
            <span className="text-[#1a73e8]">Built to Scale.</span>
          </h2>
          <p className="gw-font-text text-[14.5px] sm:text-[16px] md:text-[18px] text-[#5f6368] leading-[1.6] px-1">
            When you partner with Jasa Backlinks, you get more than SEO—you get
            visibility that adapts to how people search today. Build trust with
            search engines, AI systems, and real customers.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {metrics.map((item, index) => (
            <div
              key={index}
              className="relative overflow-hidden bg-white rounded-[20px] sm:rounded-[24px] p-4 sm:p-6 lg:p-8 border border-[#e8eaed] shadow-[0_1px_3px_rgba(60,64,67,0.04)] hover:shadow-[0_14px_36px_rgba(26,115,232,0.08)] hover:border-[#d2e3fc] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center group cursor-default"
            >
              <div
                className={`absolute top-0 inset-x-0 h-[3px] ${item.topBar} opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              <div
                className={`w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] rounded-[12px] sm:rounded-[16px] ${item.bgColor} ${item.accentColor} flex items-center justify-center mb-3 sm:mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                {item.icon}
              </div>

              <span className="text-[10px] sm:text-[11px] font-medium text-[#5f6368] bg-[#f8f9fa] border border-[#e8eaed] px-2 sm:px-2.5 py-0.5 rounded-full mb-2 sm:mb-3">
                {item.badge}
              </span>

              <h3 className="gw-font-display text-[17px] sm:text-[24px] lg:text-[26px] font-medium text-[#202124] tracking-tight mb-1 sm:mb-2 leading-snug">
                {item.title}
              </h3>

              <p className="gw-font-text text-[11.5px] sm:text-[13.5px] lg:text-[14px] text-[#5f6368] font-normal leading-[1.45] sm:leading-[1.55] max-w-[210px]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// BENTO GRID SECTION
function AudienceBentoSection() {
  return (
    <section className="relative w-full bg-[#f8f9fa] py-12 sm:py-20 lg:py-28 px-4 sm:px-6 border-t border-[#e8eaed] overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[400px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#e8f0fe]/60 via-[#f8f9fa]/20 to-transparent opacity-90 pointer-events-none" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="mb-10 sm:mb-14 lg:mb-16 flex flex-col items-center sm:items-start text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white border border-[#e8eaed] text-[#1a73e8] text-[11.5px] sm:text-[12.5px] font-medium mb-3 sm:mb-4 shadow-[0_1px_2px_rgba(60,64,67,0.04)]">
            <span className="w-2 h-2 rounded-full bg-[#1a73e8]" />
            Solutions by Business Type
          </div>
          <h2 className="gw-font-display text-[28px] sm:text-[36px] md:text-[44px] lg:text-[50px] font-medium text-[#202124] leading-[1.15] tracking-[-0.025em] max-w-[700px]">
            Smarter visibility for <br className="hidden sm:block" />
            <span className="text-[#1a73e8]">every kind of business.</span>
          </h2>
          <p className="gw-font-text mt-3 sm:mt-4 md:mt-5 text-[14.5px] sm:text-[16px] md:text-[18px] text-[#5f6368] leading-[1.6] max-w-[650px]">
            From local storefronts to national brands and scaling agencies, Jasa
            Backlinks gives you the flexibility to build authority your way.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 auto-rows-auto md:auto-rows-[minmax(220px,auto)]">
          {/* Card 1 */}
          <div className="col-span-1 bg-white rounded-[20px] sm:rounded-[24px] p-5 sm:p-8 border border-[#e8eaed] shadow-[0_1px_3px_rgba(60,64,67,0.03)] hover:shadow-[0_14px_36px_rgba(26,115,232,0.07)] hover:border-[#d2e3fc] hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between cursor-default">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <div className="w-[42px] h-[42px] sm:w-[46px] sm:h-[46px] rounded-[12px] sm:rounded-[14px] bg-[#e8f0fe] flex items-center justify-center text-[#1a73e8]">
                <svg
                  className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px]"
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
              <span className="text-[11px] sm:text-[11.5px] font-medium text-[#1a73e8] bg-[#e8f0fe]/80 px-2.5 py-1 rounded-full">
                Local Maps & AEO
              </span>
            </div>
            <div>
              <h3 className="gw-font-display text-[18px] sm:text-[21px] md:text-[22px] font-medium text-[#202124] mb-1.5 sm:mb-2">
                Local Businesses
              </h3>
              <p className="gw-font-text text-[13.5px] sm:text-[14.5px] text-[#5f6368] leading-[1.55]">
                Show up in local search and AI Overviews when customers ask for
                services near them.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="col-span-1 bg-white rounded-[20px] sm:rounded-[24px] p-5 sm:p-8 border border-[#e8eaed] shadow-[0_1px_3px_rgba(60,64,67,0.03)] hover:shadow-[0_14px_36px_rgba(52,168,83,0.07)] hover:border-[#ceead6] hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between cursor-default">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <div className="w-[42px] h-[42px] sm:w-[46px] sm:h-[46px] rounded-[12px] sm:rounded-[14px] bg-[#e6f4ea] flex items-center justify-center text-[#1e8e3e]">
                <svg
                  className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px]"
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
              <span className="text-[11px] sm:text-[11.5px] font-medium text-[#1e8e3e] bg-[#e6f4ea] px-2.5 py-1 rounded-full">
                High-Intent SERPs
              </span>
            </div>
            <div>
              <h3 className="gw-font-display text-[18px] sm:text-[21px] md:text-[22px] font-medium text-[#202124] mb-1.5 sm:mb-2">
                E-Commerce Stores
              </h3>
              <p className="gw-font-text text-[13.5px] sm:text-[14.5px] text-[#5f6368] leading-[1.55]">
                Get your products recommended by AI systems and featured in
                high-converting search results.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="col-span-1 bg-white rounded-[20px] sm:rounded-[24px] p-5 sm:p-8 border border-[#e8eaed] shadow-[0_1px_3px_rgba(60,64,67,0.03)] hover:shadow-[0_14px_36px_rgba(147,52,230,0.07)] hover:border-[#e9d2fc] hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between cursor-default">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <div className="w-[42px] h-[42px] sm:w-[46px] sm:h-[46px] rounded-[12px] sm:rounded-[14px] bg-[#f3e8fd] flex items-center justify-center text-[#9334e6]">
                <svg
                  className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px]"
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
              <span className="text-[11px] sm:text-[11.5px] font-medium text-[#9334e6] bg-[#f3e8fd] px-2.5 py-1 rounded-full">
                100% White-Label
              </span>
            </div>
            <div>
              <h3 className="gw-font-display text-[18px] sm:text-[21px] md:text-[22px] font-medium text-[#202124] mb-1.5 sm:mb-2">
                Agencies & Resellers
              </h3>
              <p className="gw-font-text text-[13.5px] sm:text-[14.5px] text-[#5f6368] leading-[1.55]">
                Expand your services with fully managed, wholesale PBN and AI
                visibility campaigns.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="col-span-1 md:col-span-2 bg-white rounded-[20px] sm:rounded-[24px] p-5 sm:p-8 md:p-10 border border-[#e8eaed] shadow-[0_1px_3px_rgba(60,64,67,0.03)] hover:shadow-[0_14px_36px_rgba(217,48,37,0.06)] hover:border-[#fad2cf] hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden cursor-default">
            <div className="flex flex-wrap justify-between items-center gap-3 mb-4 sm:mb-8 relative z-10">
              <div className="w-[42px] h-[42px] sm:w-[48px] sm:h-[48px] rounded-[12px] sm:rounded-[14px] bg-[#fce8e6] flex items-center justify-center text-[#d93025]">
                <svg
                  className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px]"
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

              <div className="flex items-center gap-2 sm:gap-3 bg-[#f8f9fa] border border-[#e8eaed] rounded-full px-3 py-1 sm:px-3.5 sm:py-1.5">
                <span className="flex items-center gap-1.5 text-[11px] sm:text-[12px] font-medium text-[#202124]">
                  <span className="w-2 h-2 rounded-full bg-[#34a853]" />
                  DR 50+
                </span>
                <span className="w-[1px] h-3 bg-[#dadce0]" />
                <span className="text-[11px] sm:text-[12px] font-medium text-[#1a73e8]">
                  .COM • .ID • .EDU
                </span>
              </div>
            </div>

            <div className="relative z-10 sm:max-w-[90%]">
              <h3 className="gw-font-display text-[19px] sm:text-[24px] md:text-[26px] font-medium text-[#202124] mb-1.5 sm:mb-2">
                National & Enterprise Brands
              </h3>
              <p className="gw-font-text text-[13.5px] sm:text-[15px] md:text-[16px] text-[#5f6368] leading-[1.55]">
                Simplify multi-channel AEO and SEO with data-driven link
                strategies that scale across diverse teams, regional domains,
                and highly competitive keywords.
              </p>
            </div>
          </div>

          {/* Card 5 */}
          <div className="col-span-1 bg-white rounded-[20px] sm:rounded-[24px] p-5 sm:p-8 md:p-10 border border-[#e8eaed] shadow-[0_1px_3px_rgba(60,64,67,0.03)] hover:shadow-[0_14px_36px_rgba(60,64,67,0.08)] hover:border-[#dadce0] hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between cursor-default">
            <div className="flex justify-between items-center mb-4 sm:mb-8 relative z-10">
              <div className="w-[42px] h-[42px] sm:w-[48px] sm:h-[48px] rounded-[12px] sm:rounded-[14px] bg-[#f1f3f4] flex items-center justify-center text-[#5f6368]">
                <svg
                  className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px]"
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
              <span className="text-[11px] sm:text-[11.5px] font-medium text-[#5f6368] bg-[#f1f3f4] px-2.5 py-1 rounded-full">
                Multi-Region
              </span>
            </div>
            <div className="relative z-10">
              <h3 className="gw-font-display text-[19px] sm:text-[24px] md:text-[26px] font-medium text-[#202124] mb-1.5 sm:mb-2">
                Franchises
              </h3>
              <p className="gw-font-text text-[13.5px] sm:text-[15px] md:text-[16px] text-[#5f6368] leading-[1.55]">
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

// 3-STEP WORKFLOW (HOW IT WORKS)
function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Select Placements & Volume",
      desc: "Use our live estimator above to mix Homepage, Blogroll, .ID regional, or EDU/GOV links starting from 50 placements.",
      badge: "Instant Pricing",
      color: "bg-[#e8f0fe] text-[#1a73e8]",
    },
    {
      step: "02",
      title: "Submit Target URLs & Contact",
      desc: "Complete your checkout and enter your target URLs, anchor texts, and WhatsApp/Telegram handle in our onboarding popup.",
      badge: "100% Footprint-Free",
      color: "bg-[#fef7e0] text-[#f29900]",
    },
    {
      step: "03",
      title: "Live Indexing & White-Label Report",
      desc: "Our team publishes your contextual links across aged DA/DR 50+ domains and delivers a clean, verifiable tracking sheet.",
      badge: "5–7 Days Turnaround",
      color: "bg-[#e6f4ea] text-[#1e8e3e]",
    },
  ];

  return (
    <section className="w-full bg-white py-12 sm:py-20 px-4 sm:px-6 border-t border-[#e8eaed]">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4 text-center md:text-left">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f8f9fa] border border-[#e8eaed] text-[#5f6368] text-[11.5px] sm:text-[12px] font-medium mb-3">
              <span className="w-2 h-2 rounded-full bg-[#1a73e8]" />
              Streamlined Execution
            </div>
            <h2 className="gw-font-display text-[26px] sm:text-[34px] md:text-[40px] font-medium text-[#202124] leading-[1.15] tracking-[-0.02em]">
              How your campaign{" "}
              <span className="text-[#1a73e8]">goes live.</span>
            </h2>
          </div>
          <p className="gw-font-text text-[14px] sm:text-[15.5px] text-[#5f6368] max-w-[440px] mx-auto md:mx-0">
            Zero manual outreach headaches. We handle content creation, niche
            placement, and safe indexing from start to finish.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#f8f9fa] hover:bg-white rounded-[20px] sm:rounded-[24px] p-5 sm:p-7 border border-[#e8eaed] hover:border-[#d2e3fc] hover:shadow-[0_10px_30px_rgba(26,115,232,0.06)] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <span
                    className={`gw-font-display text-[13px] font-bold px-3 py-1 rounded-full ${item.color}`}
                  >
                    Step {item.step}
                  </span>
                  <span className="text-[11px] font-medium text-[#5f6368] bg-white px-2.5 py-1 rounded-full border border-[#e8eaed]">
                    {item.badge}
                  </span>
                </div>
                <h3 className="gw-font-display text-[18px] sm:text-[20px] font-medium text-[#202124] mb-2">
                  {item.title}
                </h3>
                <p className="gw-font-text text-[13.5px] sm:text-[14.5px] text-[#5f6368] leading-[1.6]">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// REVIEWS SECTION
function ReviewsSection() {
  const sliderRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const reviews = [
    {
      text: "Super simple and easy to use interface to select what I need — well done! The DA/DR 50+ metrics were exactly as promised.",
      name: "Anthony",
      role: "SEO Agency Lead",
      time: "28 days ago",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      text: "The custom placements you guys do for .ID domains are unmatched. Being able to scale local authority instantly is a game changer.",
      name: "Fridolin Haemmer",
      role: "Head of Growth",
      time: "33 days ago",
      avatar: "https://randomuser.me/api/portraits/men/46.jpg",
    },
    {
      text: "No need to follow-up. The system is transparent and the calculator makes ordering bulk placements effortless.",
      name: "Alyssa Douglas",
      role: "Digital Marketing Director",
      time: "35 days ago",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      text: "We ordered 1,000 homepage and EDU placements for a competitive fintech client. Rankings jumped into the top 3 within 4 weeks.",
      name: "Marcus Vance",
      role: "Founder, Vance Media",
      time: "41 days ago",
      avatar: "https://randomuser.me/api/portraits/men/85.jpg",
    },
  ];

  const ratingBars = [
    { label: "5 Stars", width: "w-[88%]" },
    { label: "4 Stars", width: "w-[9%]" },
    { label: "3 Stars", width: "w-[2%]" },
    { label: "2 Stars", width: "w-[1%]" },
    { label: "1 Star", width: "w-[0%]" },
  ];

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, clientWidth } = sliderRef.current;
    const index = Math.round(scrollLeft / (clientWidth * 0.82));
    setActiveSlide(Math.min(reviews.length - 1, Math.max(0, index)));
  };

  const scrollToSlide = (index) => {
    if (!sliderRef.current) return;
    const cardWidth = sliderRef.current.clientWidth * 0.85;
    sliderRef.current.scrollTo({
      left: index * cardWidth,
      behavior: "smooth",
    });
    setActiveSlide(index);
  };

  return (
    <section className="relative w-full bg-[#f8f9fa] py-12 sm:py-20 lg:py-28 px-4 sm:px-6 border-t border-[#e8eaed]">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-8 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white border border-[#e8eaed] text-[#5f6368] text-[11.5px] sm:text-[12.5px] font-medium mb-3 sm:mb-4">
            <span className="w-2 h-2 rounded-full bg-[#fbbc04]" />
            Verified Client Feedback
          </div>
          <h2 className="gw-font-display text-[28px] sm:text-[36px] md:text-[44px] font-medium text-[#202124] leading-[1.15] tracking-[-0.025em] mb-2.5 sm:mb-3">
            What our <span className="text-[#1a73e8]">customers think.</span>
          </h2>
          <p className="gw-font-text text-[14.5px] sm:text-[16px] md:text-[17px] text-[#5f6368] leading-[1.6]">
            Read verified feedback from Agencies, In-House Marketing Teams & SEO
            Professionals.
          </p>
        </div>

        <div className="bg-white rounded-[20px] sm:rounded-[24px] border border-[#e8eaed] shadow-[0_2px_14px_rgba(60,64,67,0.03)] p-5 sm:p-7 lg:p-10 mb-6 sm:mb-8 grid grid-cols-1 lg:grid-cols-3 items-center gap-5 sm:gap-8">
          <div className="flex items-center justify-between sm:justify-center lg:justify-start gap-4 border-b lg:border-b-0 pb-4 lg:pb-0 border-[#e8eaed]">
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="gw-font-display text-[36px] sm:text-[48px] md:text-[54px] font-medium text-[#202124] leading-none">
                  95%
                </span>
                <span className="text-[11px] sm:text-[12px] font-semibold bg-[#e6f4ea] text-[#1e8e3e] px-2.5 py-0.5 rounded-full">
                  Verified
                </span>
              </div>
              <p className="gw-font-text text-[12.5px] sm:text-[14px] text-[#5f6368] leading-[1.5] max-w-[240px]">
                of buyers give us a 4 or 5-star rating.
              </p>
            </div>

            <div className="lg:hidden text-right">
              <span className="gw-font-display text-[32px] font-medium text-[#202124] leading-none block">
                4.8/5
              </span>
              <div className="flex justify-end gap-0.5 my-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-3.5 h-3.5 text-[#fbbc04]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <span className="text-[11px] text-[#5f6368]">1,636 reviews</span>
            </div>
          </div>

          <div className="hidden lg:flex flex-col items-center justify-center lg:border-x border-[#e8eaed]">
            <span className="gw-font-text text-[14px] font-medium text-[#5f6368] mb-2.5">
              Overall Rating
            </span>
            <div className="flex gap-1.5 mb-2">
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
              Shopper Approved • 1,636 Orders
            </span>
          </div>

          <div className="flex items-center justify-center lg:justify-end gap-6 w-full">
            <div className="hidden lg:block text-center shrink-0">
              <span className="gw-font-display text-[48px] font-medium text-[#202124] leading-none block mb-1">
                4.8/5
              </span>
              <span className="text-[12px] text-[#5f6368]">1,636 reviews</span>
            </div>
            <div className="w-full max-w-full lg:max-w-[210px] space-y-1.5 sm:space-y-2">
              {ratingBars.map((bar) => (
                <div key={bar.label} className="flex items-center gap-2.5">
                  <span className="text-[11.5px] sm:text-[12px] text-[#5f6368] w-[44px] shrink-0">
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

        <div
          ref={sliderRef}
          onScroll={handleScroll}
          className="flex lg:grid lg:grid-cols-4 gap-4 sm:gap-5 overflow-x-auto lg:overflow-visible snap-x snap-mandatory scroll-smooth no-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {reviews.map((review, i) => (
            <div
              key={i}
              className="w-[85vw] sm:w-[320px] lg:w-auto shrink-0 snap-center snap-always bg-white p-6 sm:p-7 rounded-[20px] sm:rounded-[24px] border border-[#e8eaed] shadow-[0_1px_3px_rgba(60,64,67,0.03)] hover:shadow-[0_12px_32px_rgba(26,115,232,0.06)] hover:border-[#d2e3fc] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-3.5">
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
                  <span className="gw-font-text text-[11.5px] sm:text-[12px] text-[#9aa0a6]">
                    {review.time}
                  </span>
                </div>
                <p className="gw-font-text text-[14px] sm:text-[14.5px] text-[#3c4043] leading-[1.6] mb-5">
                  "{review.text}"
                </p>
              </div>
              <div className="border-t border-[#f1f3f4] pt-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover border border-[#e8eaed]"
                  />
                  <div>
                    <span className="gw-font-display text-[13.5px] sm:text-[14px] font-medium text-[#202124] block leading-tight">
                      {review.name}
                    </span>
                    <span className="text-[11px] sm:text-[11.5px] text-[#5f6368]">
                      {review.role}
                    </span>
                  </div>
                </div>
                <span className="text-[10.5px] sm:text-[11px] font-medium text-[#1e8e3e] bg-[#e6f4ea] px-2 py-0.5 rounded-full">
                  Verified
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex lg:hidden items-center justify-between mt-4 px-1">
          <div className="flex items-center gap-1.5">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToSlide(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeSlide === idx ? "w-6 bg-[#1a73e8]" : "w-2 bg-[#dadce0]"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollToSlide(Math.max(0, activeSlide - 1))}
              className="w-8 h-8 rounded-full bg-white border border-[#dadce0] flex items-center justify-center text-[#5f6368] active:bg-[#f1f3f4]"
              aria-label="Previous review"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() =>
                scrollToSlide(Math.min(reviews.length - 1, activeSlide + 1))
              }
              className="w-8 h-8 rounded-full bg-white border border-[#dadce0] flex items-center justify-center text-[#5f6368] active:bg-[#f1f3f4]"
              aria-label="Next review"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// GOOGLE WORKSPACE STYLE FAQ ACCORDION
function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "Are all PBN placements genuinely guaranteed DA/DR 50+?",
      a: "Yes. Every domain in our standard, .ID regional, and EDU/GOV inventory is vetted for clean backlink profiles, zero spam score, and verified Moz DA 50+ and Ahrefs DR 50+ metrics prior to placement.",
    },
    {
      q: "How do I submit my target URLs and anchor texts after checkout?",
      a: "Immediately after completing your payment via Card, PayPal, or BoomFi Crypto, Step 2 opens automatically so you can submit your target URLs, anchor text ratios, and WhatsApp/Telegram contact for instant confirmation.",
    },
    {
      q: "Is your network safe from Google footprints?",
      a: "100%. All domains are hosted across distributed Class-C IP blocks, distinct registrars, unique CMS themes, and human-edited contextual articles so your link profile looks completely natural to search engines and AI crawlers.",
    },
    {
      q: "Can I combine multiple link types for different client websites?",
      a: "Absolutely. When you combine multiple packages in the calculator, you can split your total backlinks across multiple domains or client campaigns at no extra cost—complete with unbranded white-label reports.",
    },
  ];

  return (
    <section className="w-full bg-white py-12 sm:py-20 px-4 sm:px-6 border-t border-[#e8eaed]">
      <div className="max-w-[900px] mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f8f9fa] border border-[#e8eaed] text-[#5f6368] text-[11.5px] sm:text-[12px] font-medium mb-3">
            Common Questions
          </div>
          <h2 className="gw-font-display text-[26px] sm:text-[36px] font-medium text-[#202124] leading-[1.15] tracking-[-0.02em]">
            Frequently asked <span className="text-[#1a73e8]">questions.</span>
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-[18px] border transition-all duration-200 ${
                  isOpen
                    ? "bg-[#f8fbff] border-[#d2e3fc]"
                    : "bg-white border-[#e8eaed] hover:border-[#dadce0]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full px-5 py-4 sm:px-6 sm:py-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="gw-font-display text-[15px] sm:text-[17px] font-medium text-[#202124]">
                    {item.q}
                  </span>
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? "bg-[#1a73e8] text-white rotate-180"
                        : "bg-[#f1f3f4] text-[#5f6368]"
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2.2"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 sm:px-6 sm:pb-5 pt-0">
                    <p className="gw-font-text text-[13.5px] sm:text-[15px] text-[#5f6368] leading-[1.65]">
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// COMPACT & ON-THEME GOOGLE WORKSPACE CTA SECTION
function CTASection() {
  return (
    <section className="w-full bg-[#f8f9fa] py-12 sm:py-20 px-4 sm:px-6 border-t border-[#e8eaed]">
      <div className="max-w-[1200px] mx-auto bg-white rounded-[24px] sm:rounded-[28px] border border-[#dadce0] shadow-[0_12px_40px_rgba(60,64,67,0.06)] overflow-hidden relative p-6 sm:p-10 lg:px-14 lg:py-12">
        <div className="absolute -top-24 -right-24 w-[360px] h-[360px] bg-[#e8f0fe] rounded-full filter blur-[80px] opacity-80 pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-7 sm:gap-8 relative z-10">
          <div className="flex-1 text-center lg:text-left w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f0fe] text-[#1a73e8] text-[11.5px] sm:text-[12px] font-medium mb-3.5 sm:mb-4">
              Ready to scale your rankings?
            </div>
            <h2 className="gw-font-display text-[26px] sm:text-[36px] lg:text-[42px] font-medium text-[#202124] leading-[1.15] tracking-[-0.02em] mb-5 sm:mb-6 max-w-[540px] mx-auto lg:mx-0">
              The no-hassle way to{" "}
              <span className="text-[#1a73e8]">get SEO done.</span>
            </h2>

            <div className="grid grid-cols-3 sm:flex sm:flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-10 mb-6 sm:mb-7 bg-[#f8f9fa] sm:bg-transparent p-3.5 sm:p-0 rounded-2xl border border-[#e8eaed] sm:border-0">
              <div>
                <h3 className="gw-font-display text-[19px] sm:text-[26px] font-medium text-[#202124] leading-none mb-1">
                  2016
                </h3>
                <p className="gw-font-text text-[11.5px] sm:text-[13px] text-[#5f6368]">
                  Founded In
                </p>
              </div>
              <div className="w-[1px] h-8 bg-[#dadce0] hidden sm:block" />
              <div className="border-x border-[#e8eaed] sm:border-0 px-2 sm:px-0">
                <h3 className="gw-font-display text-[19px] sm:text-[26px] font-medium text-[#1a73e8] leading-none mb-1">
                  40k+
                </h3>
                <p className="gw-font-text text-[11.5px] sm:text-[13px] text-[#5f6368]">
                  Agencies
                </p>
              </div>
              <div className="w-[1px] h-8 bg-[#dadce0] hidden sm:block" />
              <div>
                <h3 className="gw-font-display text-[19px] sm:text-[26px] font-medium text-[#202124] leading-none mb-1">
                  20+
                </h3>
                <p className="gw-font-text text-[11.5px] sm:text-[13px] text-[#5f6368]">
                  Services
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
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

          <div className="w-full lg:w-[370px] shrink-0">
            <div className="bg-[#f8f9fa] rounded-[20px] sm:rounded-[22px] border border-[#e8eaed] p-4 sm:p-5 relative">
              <div className="bg-white rounded-[16px] border border-[#e8eaed] p-3.5 sm:p-4 mb-3 shadow-[0_2px_8px_rgba(60,64,67,0.04)]">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#f1f3f4]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center font-bold text-[12px] sm:text-[13px]">
                      SEO
                    </div>
                    <div className="text-left">
                      <p className="text-[13px] sm:text-[13.5px] font-medium text-[#202124]">
                        Authority Campaign
                      </p>
                      <p className="text-[11px] sm:text-[11.5px] text-[#1e8e3e] font-medium">
                        Live Indexing Active
                      </p>
                    </div>
                  </div>
                  <span className="bg-[#fef7e0] text-[#f29900] text-[11px] sm:text-[11.5px] font-bold px-2.5 py-1 rounded-full">
                    DA 50+
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11.5px] sm:text-[12px] text-[#5f6368]">
                  <span>Average SERP Velocity</span>
                  <span className="text-[#1e8e3e] font-semibold">
                    +142% Organic Lift
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between bg-white rounded-[16px] p-3 sm:p-3.5 border border-[#e8eaed] shadow-[0_2px_8px_rgba(60,64,67,0.04)]">
                <div className="flex -space-x-2">
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="Partner"
                    width="32"
                    height="32"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white object-cover"
                  />
                  <img
                    src="https://randomuser.me/api/portraits/men/46.jpg"
                    alt="Partner"
                    width="32"
                    height="32"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white object-cover"
                  />
                  <img
                    src="https://randomuser.me/api/portraits/women/68.jpg"
                    alt="Partner"
                    width="32"
                    height="32"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white object-cover"
                  />
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white bg-[#1a73e8] text-white text-[10px] sm:text-[11px] font-bold flex items-center justify-center">
                    5k+
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="gw-font-display font-bold text-[14px] sm:text-[15px] text-[#202124]">
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

// MAIN HOME COMPONENT
export default function Home() {
  return (
    <main className="w-full bg-[#fcfcfc] relative overflow-x-clip">
      <style>{`
        .bg-dotted-grid { background-image: radial-gradient(circle, #d0d7de 1px, transparent 1px); background-size: 28px 28px; }
        @keyframes floatBlob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.05); } 66% { transform: translate(-20px, 20px) scale(0.95); } 100% { transform: translate(0px, 0px) scale(1); } }
        .animate-blob { animation: floatBlob 18s infinite alternate ease-in-out; }
        .delay-2000 { animation-delay: 2s; } .delay-4000 { animation-delay: 4s; }
        @keyframes pulseNode { 0% { r: 3; opacity: 0.5; } 50% { r: 4.5; opacity: 1; } 100% { r: 3; opacity: 0.5; } }
        .node-pulse { animation: pulseNode 3s infinite ease-in-out; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f3f4; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #dadce0; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #bdc1c6; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

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

      {/* Hero Section */}
      <section className="relative z-10 min-h-[70vh] sm:min-h-[76vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 pb-10 sm:pb-14 pt-[76px] sm:pt-[84px] overflow-hidden">
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
          <div className="absolute top-[10%] md:top-[15%] left-[5%] md:left-[15%] w-[220px] sm:w-[300px] md:w-[450px] h-[220px] sm:h-[300px] md:h-[450px] bg-[#1a73e8] rounded-full mix-blend-multiply filter blur-[80px] sm:blur-[100px] md:blur-[140px] opacity-[0.10] animate-blob" />
          <div className="absolute top-[20%] md:top-[25%] right-[5%] md:right-[10%] w-[200px] sm:w-[250px] md:w-[400px] h-[200px] sm:h-[250px] md:h-[400px] bg-[#34a853] rounded-full mix-blend-multiply filter blur-[80px] sm:blur-[90px] md:blur-[130px] opacity-[0.08] animate-blob delay-2000" />
          <div className="absolute bottom-[5%] left-[20%] md:left-[30%] w-[240px] sm:w-[350px] md:w-[550px] h-[240px] sm:h-[350px] md:h-[550px] bg-[#fbbc04] rounded-full mix-blend-multiply filter blur-[90px] sm:blur-[120px] md:blur-[150px] opacity-[0.06] animate-blob delay-4000" />
        </div>

        <div className="flex flex-col items-center justify-center w-full max-w-[1300px] mt-2 sm:mt-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#dadce0] shadow-[0_2px_8px_rgba(60,64,67,0.05)] mb-4 sm:mb-5 max-w-full">
            <span className="flex items-center gap-1 shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
              <span className="w-2 h-2 rounded-full bg-[#EA4335]" />
              <span className="w-2 h-2 rounded-full bg-[#FBBC04]" />
              <span className="w-2 h-2 rounded-full bg-[#34A853]" />
            </span>
            <span className="gw-font-text text-[11.5px] sm:text-[13px] font-medium text-[#3c4043] truncate">
              Next-Gen PBN Authority • Verified DA/DR 50+
            </span>
          </div>

          <h2 className="gw-font-display text-[32px] sm:text-[52px] md:text-[68px] lg:text-[80px] font-medium leading-[1.12] sm:leading-[1.08] md:leading-[1.06] tracking-[-0.025em] md:tracking-[-0.03em] text-[#202124] mb-4 sm:mb-5 w-full px-1">
            Build organic authority <br className="hidden sm:block" />
            <span className="text-[#1a73e8]">with premium PBN backlinks.</span>
          </h2>

          <p className="gw-font-text text-[15px] sm:text-[17px] md:text-[19px] text-[#5f6368] max-w-[700px] leading-[1.6] mb-6 sm:mb-8 px-2">
            Scale your search rankings and AI Overview visibility with clean,
            high-metric contextual placements across .COM, .ID, .EDU, and .GOV
            domains.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-[340px] sm:max-w-none mb-6 sm:mb-9 z-20">
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("estimator")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="gw-font-display w-full sm:w-[240px] inline-flex h-[50px] sm:h-[54px] items-center justify-center rounded-full bg-[#1a73e8] text-[15px] md:text-[16px] font-medium tracking-[0.2px] text-white shadow-[0_6px_20px_rgba(26,115,232,0.25)] hover:bg-[#1557b0] hover:shadow-[0_8px_28px_rgba(26,115,232,0.35)] transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            >
              Calculate Price Now
            </button>
            <Link
              to="/contact"
              className="gw-font-display w-full sm:w-[240px] inline-flex h-[50px] sm:h-[54px] items-center justify-center rounded-full border border-[#dadce0] bg-white/90 backdrop-blur-md text-[15px] md:text-[16px] font-medium tracking-[0.2px] text-[#3c4043] shadow-[0_2px_10px_rgba(60,64,67,0.04)] hover:bg-white hover:border-[#bdc1c6] hover:text-[#202124] transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Talk to an expert
            </Link>
          </div>

          <div className="flex flex-row items-center gap-3 px-4 sm:px-6 py-2.5 rounded-full bg-white/85 backdrop-blur-xl border border-[#e8eaed] shadow-[0_8px_32px_rgba(32,33,36,0.06)] relative z-20 transition-transform duration-300 hover:scale-105 cursor-default max-w-full">
            <div className="flex -space-x-2 shrink-0">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Agency Partner"
                width="32"
                height="32"
                referrerPolicy="no-referrer"
                className="w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] rounded-full border-2 border-white shadow-sm object-cover"
              />
              <img
                src="https://randomuser.me/api/portraits/men/46.jpg"
                alt="Agency Partner"
                width="32"
                height="32"
                referrerPolicy="no-referrer"
                className="w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] rounded-full border-2 border-white shadow-sm object-cover"
              />
              <img
                src="https://randomuser.me/api/portraits/women/68.jpg"
                alt="Agency Partner"
                width="32"
                height="32"
                referrerPolicy="no-referrer"
                className="w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] rounded-full border-2 border-white shadow-sm object-cover"
              />
              <img
                src="https://randomuser.me/api/portraits/men/85.jpg"
                alt="Agency Partner"
                width="32"
                height="32"
                referrerPolicy="no-referrer"
                className="w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] rounded-full border-2 border-white shadow-sm object-cover"
              />
            </div>
            <div className="flex flex-col items-start text-left">
              <div className="flex items-center gap-0.5 mb-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#fbbc04]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="gw-font-text text-[11.5px] sm:text-[13px] font-medium text-[#5f6368] leading-tight">
                Trusted by 500+ SEO agencies & brands
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 1. TRUST METRICS SECTION */}
      <TrustMetricsSection />

      {/* 2. PACKAGE ESTIMATOR SECTION */}
      <PackageEstimator />

      {/* 3. 3-STEP WORKFLOW SECTION */}
      <HowItWorksSection />

      {/* 4. BENTO GRID SECTION */}
      <AudienceBentoSection />

      {/* 5. REVIEWS SECTION */}
      <ReviewsSection />

      {/* 6. FAQ ACCORDION SECTION */}
      <FAQSection />

      {/* 7. COMPACT CTA SECTION */}
      <CTASection />
    </main>
  );
}
