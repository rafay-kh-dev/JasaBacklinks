import { Link, useParams, useLocation } from "react-router-dom";
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
import { SERVICE_PAGES_DATA } from "../data/serviceCatalog";
import {
  GUEST_POSTING_OPTIONS,
  getGuestPostingItem,
  getGuestPostingPrice,
} from "../config/guestPosting";

// ENVIRONMENT & API CONFIGURATION
const STRIPE_PUBLIC_KEY =
  import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_placeholder";
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || "test";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const BOOMFI_ORDER_STORAGE_KEY = "jasa_pending_boomfi_order";

// CLEAN SVG ICONS
function StripeWordmarkIcon() {
  return (
    <svg
      className="w-8 h-4 shrink-0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 468 222.5"
      fill="white"
      role="img"
      aria-label="Stripe"
    >
      <path d="M414,113.4c0-25.6-12.4-45.8-36.1-45.8c-23.8,0-38.2,20.2-38.2,45.6c0,30.1,17,45.3,41.4,45.3c11.9,0,20.9-2.7,27.7-6.5v-20c-6.8,3.4-14.6,5.5-24.5,5.5c-9.7,0-18.3-3.4-19.4-15.2h48.9C413.8,121,414,115.8,414,113.4z M364.6,103.9c0-11.3,6.9-16,13.2-16c6.1,0,12.6,4.7,12.6,16H364.6z" />
      <path d="M301.1,67.6c-9.8,0-16.1,4.6-19.6,7.8l-1.3-6.2h-22v116.6l25-5.3l0.1-28.3c3.6,2.6,8.9,6.3,17.7,6.3c17.9,0,34.2-14.4,34.2-46.1C335.1,83.4,318.6,67.6,301.1,67.6z M295.1,136.5c-5.9,0-9.4-2.1-11.8-4.7l-0.1-37.1c2.6-2.9,6.2-4.9,11.9-4.9c9.1,0,15.4,10.2,15.4,23.3C310.5,126.5,304.3,136.5,295.1,136.5z" />
      <polygon points="223.8,61.7 248.9,56.3 248.9,36 223.8,41.3" />
      <rect x="223.8" y="69.3" width="25.1" height="87.5" />
      <path d="M196.9,76.7l-1.6-7.4h-21.6v87.5h25V97.5c5.9-7.7,15.9-6.3,19-5.2v-23C214.5,68.1,202.8,65.9,196.9,76.7z" />
      <path d="M146.9,47.6l-24.4,5.2l-0.1,80.1c0,14.8,11.1,25.7,25.9,25.7c8.2,0,14.2-1.5,17.5-3.3V135c-3.2,1.3-19,5.9-19-8.9V90.6h19V69.3h-19L146.9,47.6z" />
      <path d="M79.3,94.7c0-3.9,3.2-5.4,8.5-5.4c7.6,0,17.2,2.3,24.8,6.4V72.2c-8.3-3.3-16.5-4.6-24.8-4.6C67.5,67.6,54,78.2,54,95.9c0,27.6,38,23.2,38,35.1c0,4.6-4,6.1-9.6,6.1c-8.3,0-18.9-3.4-27.3-8v23.8c9.3,4,18.7,5.7,27.3,5.7c20.8,0,35.1-10.3,35.1-28.2C117.4,100.6,79.3,105.9,79.3,94.7z" />
    </svg>
  );
}

function CryptoCoinIcon() {
  return (
    <svg
      className="w-4 h-4 text-black shrink-0"
      xmlns="http://www.w3.org/2000/svg"
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
  );
}

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

// PIECEWISE SLIDER MAPPING HELPERS FOR STANDARD SERVICES (UP TO 5,000)
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

// PIECEWISE SLIDER MAPPING HELPERS FOR GUEST POSTING (1 TO 1,000 LINKS)
const GP_SLIDER_STOPS = [1, 25, 50, 100, 250, 500, 1000];

function gpQtyToSliderPos(qty) {
  const q = Number(qty) || 1;
  if (q <= 1) return 0;
  if (q >= 1000) return 600;
  for (let i = 0; i < GP_SLIDER_STOPS.length - 1; i++) {
    const start = GP_SLIDER_STOPS[i];
    const end = GP_SLIDER_STOPS[i + 1];
    if (q >= start && q <= end) {
      return i * 100 + ((q - start) / (end - start)) * 100;
    }
  }
  return 0;
}

function gpSliderPosToQty(pos) {
  const numPos = Math.max(0, Math.min(600, Number(pos) || 0));
  for (let i = 0; i < GP_SLIDER_STOPS.length; i++) {
    const targetPos = i * 100;
    if (Math.abs(numPos - targetPos) <= 6) {
      return GP_SLIDER_STOPS[i];
    }
  }
  const segIndex = Math.min(5, Math.floor(numPos / 100));
  const segFraction = (numPos - segIndex * 100) / 100;
  const start = GP_SLIDER_STOPS[segIndex];
  const end = GP_SLIDER_STOPS[segIndex + 1];
  return Math.max(
    1,
    Math.min(1000, Math.round(start + segFraction * (end - start))),
  );
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

// POPUP 2 & POPUP 3: ORDER DETAILS + THANK YOU & 3 TEAM CONTACTS
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

// MAIN DYNAMIC SERVICE DETAIL PAGE COMPONENT
export default function ServiceDetail({ forcedSlug }) {
  const { slug: routeSlug } = useParams();
  const location = useLocation();

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

  return (
    <ServiceDetailPage
      key={currentService.id}
      currentService={currentService}
    />
  );
}

function ServiceDetailPage({ currentService }) {
  const isGuestPostingPage = currentService.id === "guest_posting";

  // Guest Posting Configurator State (Used when viewing /services/guest-posting)
  const [guestPostOptions, setGuestPostOptions] = useState({
    dadr: "50",
    niche: "general",
    traffic: "1k",
  });

  const activeGuestPostCartId = `guestpost_${guestPostOptions.dadr}_${guestPostOptions.dadr}_${guestPostOptions.niche}_${guestPostOptions.traffic}`;
  const activeHeroCartKey = isGuestPostingPage
    ? activeGuestPostCartId
    : currentService.id;
  const activeHeroUnitPrice = isGuestPostingPage
    ? getGuestPostingPrice(guestPostOptions)
    : currentService.price;

  // Dedicated Hero Configurator Quantity State
  const [boomfiReturn] = useState(readBoomFiReturnState);
  const defaultInitialCart = isGuestPostingPage
    ? { [activeGuestPostCartId]: 1 }
    : { [currentService.id]: 1 };

  const restoredCart =
    boomfiReturn.savedOrder?.cart &&
    Object.keys(boomfiReturn.savedOrder.cart).length > 0
      ? boomfiReturn.savedOrder.cart
      : defaultInitialCart;

  const restoredHeroQty =
    restoredCart[activeHeroCartKey] || boomfiReturn.savedOrder?.heroQty || 1;

  const returnPayment =
    boomfiReturn.status === "success" && boomfiReturn.transactionId
      ? {
          transactionId: boomfiReturn.transactionId,
          method: "BoomFi Crypto Gateway",
        }
      : null;

  const [heroQty, setHeroQty] = useState(restoredHeroQty);
  const [checkoutCart, setCheckoutCart] = useState(restoredCart);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Checkout Modal & Gateway States
  const [isCheckoutGatewayOpen, setIsCheckoutGatewayOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [isInitializing, setIsInitializing] = useState(false);
  const [isRedirectingBoomFi, setIsRedirectingBoomFi] = useState(false);
  const [paymentError, setPaymentError] = useState(
    boomfiReturn.status === "failed"
      ? "Crypto payment was cancelled or not completed. Your selected package has been restored."
      : boomfiReturn.status === "success" && !boomfiReturn.transactionId
        ? "Could not identify the BoomFi transaction. Please contact support before submitting an order."
        : "",
  );

  // Post-Payment Onboarding Flow (Popup 2 & 3)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(
    Boolean(returnPayment),
  );
  const [completedPayment, setCompletedPayment] = useState(returnPayment);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (boomfiReturn.status === "success" && boomfiReturn.transactionId) {
      document.body.style.overflow = "hidden";
    }
    if (boomfiReturn.status === "success" || boomfiReturn.status === "failed") {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [boomfiReturn.status, boomfiReturn.transactionId]);

  // Keep Guest Posting option changes synced in the cart
  const updateGuestPostOption = (field, value) => {
    const nextOptions = { ...guestPostOptions, [field]: value };
    const nextGpId = `guestpost_${nextOptions.dadr}_${nextOptions.dadr}_${nextOptions.niche}_${nextOptions.traffic}`;
    setGuestPostOptions(nextOptions);
    setCheckoutCart({ [nextGpId]: heroQty });
  };

  const maxHeroQty = isGuestPostingPage ? 1000 : 5000;
  const heroSliderPos = isGuestPostingPage
    ? gpQtyToSliderPos(heroQty)
    : qtyToSliderPos(heroQty);
  const heroTotalAmount = heroQty * activeHeroUnitPrice;
  const currentNicheObj =
    GUEST_POSTING_OPTIONS.niches.find((n) => n.id === guestPostOptions.niche) ||
    GUEST_POSTING_OPTIONS.niches[0];

  const updateHeroQty = (rawVal) => {
    let parsed = parseInt(rawVal, 10);
    if (isNaN(parsed) || parsed < 1) parsed = 1;
    if (parsed > maxHeroQty) parsed = maxHeroQty;
    setHeroQty(parsed);
    setCheckoutCart({ [activeHeroCartKey]: parsed });
  };

  const handleHeroSliderChange = (posVal) => {
    if (isGuestPostingPage) {
      const mappedGp = gpSliderPosToQty(posVal);
      updateHeroQty(mappedGp);
    } else {
      const mapped = sliderPosToQty(posVal);
      updateHeroQty(mapped < 1 ? 1 : mapped);
    }
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
          "Could not initialise card gateway. You can still use PayPal or Crypto.",
      );
    } finally {
      setIsInitializing(false);
    }
  };

  const handleHeroDirectOrder = async () => {
    const singleCart = { [activeHeroCartKey]: heroQty };
    setCheckoutCart(singleCart);
    await openCheckoutModalWithCart(singleCart);
  };

  const handleBoomFiDirectCheckout = async (cartToUse) => {
    setIsRedirectingBoomFi(true);
    setPaymentError("");
    setCheckoutCart(cartToUse);
    try {
      const currentPageOrigin = `${window.location.origin}${window.location.pathname}`;
      const { data } = await axios.post(
        `${BACKEND_URL}/api/create-boomfi-charge`,
        {
          cart: cartToUse,
          originUrl: currentPageOrigin,
        },
      );
      if (data?.checkoutUrl && data.transactionId) {
        try {
          localStorage.setItem(
            BOOMFI_ORDER_STORAGE_KEY,
            JSON.stringify({
              cart: cartToUse,
              heroQty,
              serviceId: activeHeroCartKey,
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

  const closeGatewayModal = () => {
    setIsCheckoutGatewayOpen(false);
    document.body.style.overflow = "auto";
  };

  const selectedPackagesDetailed = Object.entries(checkoutCart)
    .filter(([, q]) => q > 0)
    .map(([id, qty]) => {
      const gpItem = getGuestPostingItem(id);
      if (gpItem) {
        return {
          ...gpItem,
          qty,
          subtotal: gpItem.price * qty,
          isGuestPost: true,
        };
      }
      const svc = SERVICE_PAGES_DATA.find((s) => s.id === id);
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

  const quickPresets = [50, 100, 250, 500, 1000];

  return (
    <PayPalScriptProvider
      options={{
        "client-id": PAYPAL_CLIENT_ID,
        currency: "USD",
        intent: "capture",
      }}
    >
      <main className="w-full bg-[#fcfcfc] relative overflow-x-clip pt-[56px] pb-20 sm:pb-0">
        <style>{`
          .bg-dotted-grid { background-image: radial-gradient(circle, #d0d7de 1px, transparent 1px); background-size: 28px 28px; }
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

        {/* 1. DEDICATED 2-COLUMN SERVICE HERO & INSTANT ORDER CONFIGURATOR */}
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
                      ${activeHeroUnitPrice.toFixed(2)} USD
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
                  <span>Want to bundle this with other placements?</span>
                  <Link
                    to="/services"
                    className="text-[#1a73e8] font-semibold hover:underline cursor-pointer"
                  >
                    Open Multi-Service Campaign Builder →
                  </Link>
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
                        ${activeHeroUnitPrice.toFixed(2)}/link
                      </span>
                    </div>

                    {isGuestPostingPage ? (
                      <>
                        {/* Guest Posting Step 1: Select Niche */}
                        <div className="mb-4">
                          <label className="block text-[12px] font-semibold text-[#3c4043] mb-1.5">
                            1. Select Website Niche
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {GUEST_POSTING_OPTIONS.niches.map((nicheItem) => {
                              const active =
                                guestPostOptions.niche === nicheItem.id;
                              const isIgaming = nicheItem.id === "igaming";
                              return (
                                <button
                                  key={nicheItem.id}
                                  type="button"
                                  onClick={() =>
                                    updateGuestPostOption("niche", nicheItem.id)
                                  }
                                  className={`flex items-center justify-between px-3 py-2.5 rounded-[12px] border-2 transition-all cursor-pointer ${
                                    active
                                      ? isIgaming
                                        ? "bg-[#faf5ff] border-[#9334e6] shadow-sm"
                                        : "bg-[#f8fbff] border-[#1a73e8] shadow-sm"
                                      : "bg-white border-[#dadce0] hover:border-[#bdc1c6]"
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                                        active
                                          ? isIgaming
                                            ? "border-[#9334e6] bg-[#9334e6]"
                                            : "border-[#1a73e8] bg-[#1a73e8]"
                                          : "border-[#bdc1c6] bg-white"
                                      }`}
                                    >
                                      {active && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                      )}
                                    </span>
                                    <span className="text-[13px] font-semibold text-[#202124]">
                                      {nicheItem.label}
                                    </span>
                                  </div>
                                  <span
                                    className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                                      isIgaming
                                        ? "bg-[#f3e8fd] text-[#9334e6]"
                                        : "bg-[#e8f0fe] text-[#1a73e8]"
                                    }`}
                                  >
                                    ${nicheItem.basePrice}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Guest Posting Step 2: Target DA/DR (RED ACTIVE BUTTON WITHOUT TICK) */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-[12px] font-semibold text-[#3c4043]">
                              2. Target DA / DR Metric
                            </label>
                            <span className="text-[10.5px] font-semibold text-[#1e8e3e] bg-[#e6f4ea] border border-[#ceead6] px-2.5 py-0.5 rounded-full">
                              $0 Free Upgrade
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-1.5 bg-[#f8f9fa] p-1.5 rounded-[14px] border border-[#dadce0]">
                            {GUEST_POSTING_OPTIONS.authorityTiers.map(
                              (tier) => {
                                const active = guestPostOptions.dadr === tier;
                                return (
                                  <button
                                    key={tier}
                                    type="button"
                                    onClick={() =>
                                      updateGuestPostOption("dadr", tier)
                                    }
                                    className={`py-2 px-2 rounded-[10px] text-[12px] font-semibold transition-all cursor-pointer flex items-center justify-center ${
                                      active
                                        ? "bg-[#ea4335] text-white shadow-[0_4px_12px_rgba(234,67,53,0.32)]"
                                        : "text-[#5f6368] hover:text-[#ea4335] hover:bg-white"
                                    }`}
                                  >
                                    <span>DA/DR {tier}+</span>
                                  </button>
                                );
                              },
                            )}
                          </div>
                        </div>

                        {/* Guest Posting Step 3: Monthly Organic Traffic (2x Rate) */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-[12px] font-semibold text-[#3c4043]">
                              3. Monthly Organic Traffic
                            </label>
                            <span className="text-[11px] text-[#5f6368]">
                              2x Rate Per Tier
                            </span>
                          </div>
                          <div className="grid grid-cols-5 gap-1.5">
                            {GUEST_POSTING_OPTIONS.trafficTiers.map((tTier) => {
                              const active =
                                guestPostOptions.traffic === tTier.id;
                              const tierPrice =
                                currentNicheObj.basePrice * tTier.multiplier;
                              return (
                                <button
                                  key={tTier.id}
                                  type="button"
                                  onClick={() =>
                                    updateGuestPostOption("traffic", tTier.id)
                                  }
                                  className={`py-2 px-1 rounded-[10px] border text-center transition-all cursor-pointer ${
                                    active
                                      ? "bg-[#1a73e8] border-[#1a73e8] text-white font-semibold shadow-sm"
                                      : "bg-[#f8f9fa] border-[#dadce0] text-[#3c4043] hover:border-[#1a73e8]"
                                  }`}
                                >
                                  <span className="text-[11.5px] font-bold block leading-tight">
                                    {tTier.label}
                                  </span>
                                  <span
                                    className={`text-[10px] block mt-0.5 ${
                                      active
                                        ? "text-white/95"
                                        : "text-[#1a73e8] font-semibold"
                                    }`}
                                  >
                                    ${tierPrice}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Guest Posting Step 4: Slider up to 1,000 Links */}
                        <div className="mb-5 bg-[#f8f9fa] p-3.5 rounded-[16px] border border-[#e8eaed]">
                          <div className="relative flex items-center h-6">
                            <input
                              type="range"
                              aria-label="Guest post quantity"
                              min="0"
                              max="600"
                              step="1"
                              value={heroSliderPos}
                              onChange={(e) =>
                                handleHeroSliderChange(e.target.value)
                              }
                              className="w-full h-[8px] bg-[#e8eaed] rounded-full appearance-none cursor-pointer focus:outline-none relative z-20"
                              style={{
                                background: `linear-gradient(to right, #1a73e8 0%, #1a73e8 ${
                                  (heroSliderPos / 600) * 100
                                }%, #dadce0 ${
                                  (heroSliderPos / 600) * 100
                                }%, #dadce0 100%)`,
                              }}
                            />
                          </div>
                          <div className="flex justify-between items-center text-[10.5px] text-[#5f6368] font-medium mt-1 px-0.5">
                            {GP_SLIDER_STOPS.map((stopVal) => (
                              <button
                                key={stopVal}
                                type="button"
                                onClick={() => updateHeroQty(stopVal)}
                                className={`cursor-pointer hover:text-[#1a73e8] ${
                                  heroQty === stopVal
                                    ? "text-[#1a73e8] font-bold"
                                    : ""
                                }`}
                              >
                                {stopVal === 1000 ? "1k" : stopVal}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Standard Service Quick Volume Pills */}
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[12.5px] font-medium text-[#5f6368]">
                              Select Volume:
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

                        {/* Standard Service Piecewise Slider */}
                        <div className="mb-5 bg-[#f8f9fa] p-3.5 rounded-[16px] border border-[#e8eaed]">
                          <div className="relative flex items-center h-6">
                            <input
                              type="range"
                              aria-label={`${currentService.name} quantity`}
                              min="100"
                              max="600"
                              step="1"
                              value={Math.max(100, heroSliderPos)}
                              onChange={(e) =>
                                handleHeroSliderChange(e.target.value)
                              }
                              className="w-full h-[8px] bg-[#e8eaed] rounded-full appearance-none cursor-pointer focus:outline-none relative z-20"
                              style={{
                                background: `linear-gradient(to right, #1a73e8 0%, #1a73e8 ${
                                  ((Math.max(100, heroSliderPos) - 100) / 500) *
                                  100
                                }%, #dadce0 ${
                                  ((Math.max(100, heroSliderPos) - 100) / 500) *
                                  100
                                }%, #dadce0 100%)`,
                              }}
                            />
                          </div>
                          <div className="flex justify-between items-center text-[10.5px] text-[#5f6368] font-medium mt-1 px-0.5">
                            <span>1 (Min)</span>
                            <span>1k</span>
                            <span>2k</span>
                            <span>3k</span>
                            <span>4k</span>
                            <span>5k</span>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Custom Quantity Stepper & Live Total Box */}
                    <div className="bg-[#f8fbff] rounded-[16px] p-4 border border-[#d2e3fc] mb-5 flex items-center justify-between gap-3">
                      <div>
                        <span className="block text-[11px] font-medium text-[#5f6368] mb-1">
                          Exact Link Quantity
                        </span>
                        <div className="flex items-center bg-white border border-[#dadce0] rounded-full p-0.5">
                          <button
                            type="button"
                            aria-label={`Decrease ${currentService.name} quantity`}
                            onClick={() =>
                              updateHeroQty(
                                heroQty - (isGuestPostingPage ? 1 : 50),
                              )
                            }
                            className="w-7 h-7 rounded-full text-[#5f6368] hover:bg-[#f1f3f4] flex items-center justify-center font-bold cursor-pointer"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            aria-label={`${currentService.name} quantity`}
                            min="1"
                            max={maxHeroQty}
                            step="1"
                            value={heroQty}
                            onChange={(e) => updateHeroQty(e.target.value)}
                            className="w-[58px] text-center bg-transparent text-[13.5px] font-bold text-[#202124] focus:outline-none"
                          />
                          <button
                            type="button"
                            aria-label={`Increase ${currentService.name} quantity`}
                            onClick={() =>
                              updateHeroQty(
                                heroQty + (isGuestPostingPage ? 1 : 50),
                              )
                            }
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

                    {paymentError && (
                      <div className="mb-3 p-3 rounded-[12px] bg-[#fce8e6] border border-[#fad2cf] text-[#d93025] text-[12px] font-medium">
                        {paymentError}
                      </div>
                    )}

                    {/* Direct Instant Checkout Gateways */}
                    <div className="space-y-2.5">
                      <button
                        type="button"
                        onClick={handleHeroDirectOrder}
                        disabled={isInitializing || isRedirectingBoomFi}
                        className="gw-font-display w-full h-[48px] sm:h-[50px] rounded-full bg-[#635bff] hover:bg-[#5249f5] text-[#f6f9fc] font-medium text-[14.5px] sm:text-[15px] shadow-[0_6px_20px_rgba(26,115,232,0.25)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <StripeWordmarkIcon />
                        <span>Pay with Card (Instant)</span>
                      </button>

                      <div className="w-full relative z-0">
                        <PayPalButtons
                          style={{
                            layout: "horizontal",
                            height: 46,
                            color: "gold",
                            shape: "pill",
                            tagline: false,
                          }}
                          forceReRender={[
                            activeHeroCartKey,
                            heroQty,
                            heroTotalAmount,
                          ]}
                          createOrder={async () => {
                            setPaymentError("");
                            const singleCart = { [activeHeroCartKey]: heroQty };
                            setCheckoutCart(singleCart);
                            const { data } = await axios.post(
                              `${BACKEND_URL}/api/create-paypal-order`,
                              { cart: singleCart },
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
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleBoomFiDirectCheckout({
                            [activeHeroCartKey]: heroQty,
                          })
                        }
                        disabled={isInitializing || isRedirectingBoomFi}
                        className="gw-font-display w-full h-[44px] sm:h-[46px] rounded-full border border-[#dadce0] bg-[#d5ff2e] hover:bg-[#c2ed15] text-[#202124] font-medium text-[13.5px] sm:text-[14px] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <CryptoCoinIcon />
                        <span>
                          {isRedirectingBoomFi
                            ? "Redirecting to BoomFi Gateway..."
                            : "Pay with Crypto (BoomFi)"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. SERVICE DELIVERABLES & TECHNICAL ARCHITECTURE SECTION */}
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

        {/* 3. SERVICE-SPECIFIC FAQ SECTION */}
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

        {/* 4. EXPLORE ALL DEDICATED SERVICES DIRECTORY */}
        <section className="w-full bg-[#f8f9fa] py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-7">
              <div>
                <h2 className="gw-font-display text-[22px] sm:text-[28px] font-medium text-[#202124]">
                  Explore All{" "}
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
                Open Multi-Service Builder →
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

        {/* POPUP 1: DEDICATED CARD CHECKOUT MODAL (ONLY STRIPE CARD FORM) */}
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
                  Step 1 of 3 • Secure Card Checkout
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
                    Preparing secure 256-bit card payment session...
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
              </div>
            </div>
          </div>
        )}

        {/* POPUP 2 & POPUP 3: ORDER INTAKE + THANK YOU & 3 TEAM CONTACTS */}
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
            localStorage.removeItem(BOOMFI_ORDER_STORAGE_KEY);
            document.body.style.overflow = "auto";
          }}
        />
      </main>
    </PayPalScriptProvider>
  );
}
