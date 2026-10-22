import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

function CheckBadgeIcon() {
  return (
    <span className="w-4 h-4 rounded-full bg-[#1e8e3e] text-white inline-flex items-center justify-center shrink-0 shadow-2xs">
      <svg
        className="w-2.5 h-2.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="3.2"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
  );
}

function PlusBadgeIcon() {
  return (
    <span className="w-4 h-4 rounded-full bg-white/20 text-white inline-flex items-center justify-center shrink-0">
      <svg
        className="w-3 h-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="2.8"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </span>
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

// SLIDER HELPERS FOR GUEST POSTING (1 TO 1,000)
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

// SIGNATURE PIECEWISE SLIDER HELPERS FOR STANDARD SERVICES (1 TO 5,000)
const CARD_SLIDER_STOPS = [1, 50, 250, 1000, 2500, 5000];

function cardQtyToSliderPos(qty) {
  const q = Number(qty) || 1;
  if (q <= 1) return 0;
  if (q >= 5000) return 500;
  for (let i = 0; i < CARD_SLIDER_STOPS.length - 1; i++) {
    const start = CARD_SLIDER_STOPS[i];
    const end = CARD_SLIDER_STOPS[i + 1];
    if (q >= start && q <= end) {
      return i * 100 + ((q - start) / (end - start)) * 100;
    }
  }
  return 0;
}

function cardSliderPosToQty(pos) {
  const numPos = Math.max(0, Math.min(500, Number(pos) || 0));
  for (let i = 0; i < CARD_SLIDER_STOPS.length; i++) {
    const targetPos = i * 100;
    if (Math.abs(numPos - targetPos) <= 8) {
      return CARD_SLIDER_STOPS[i];
    }
  }
  const segIndex = Math.min(4, Math.floor(numPos / 100));
  const segFraction = (numPos - segIndex * 100) / 100;
  const start = CARD_SLIDER_STOPS[segIndex];
  const end = CARD_SLIDER_STOPS[segIndex + 1];
  const raw = start + segFraction * (end - start);
  return Math.max(1, Math.min(5000, Math.round(raw)));
}

// POPUP 1: DEDICATED 3-FIELD STRIPE CARD FORM
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

// POPUP 2 & POPUP 3: ORDER INTAKE + THANK YOU & 3 TEAM CONTACTS
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
                Your multi-service campaign requirements and{" "}
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mt-3">
                <a
                  href={TEAM_CONTACTS.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex sm:flex-col items-center justify-between sm:justify-center px-4 py-3 sm:p-4 rounded-[14px] bg-[#f8f9fa] hover:bg-[#e6f4ea]/60 border border-[#e8eaed] hover:border-[#34a853] transition-all text-center"
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
                  className="flex sm:flex-col items-center justify-between sm:justify-center px-4 py-3 sm:p-4 rounded-[14px] bg-[#f8f9fa] hover:bg-[#e8f0fe]/60 border border-[#e8eaed] hover:border-[#1a73e8] transition-all text-center"
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
                  className="flex sm:flex-col items-center justify-between sm:justify-center px-4 py-3 sm:p-4 rounded-[14px] bg-[#f8f9fa] hover:bg-[#fef7e0]/60 border border-[#e8eaed] hover:border-[#fbbc04] transition-all text-center"
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
              Done & Return to Catalogue
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
                    placeholder="e.g. Split links across URLs, drip-feed over 7 days..."
                    className="w-full px-3.5 py-2.5 bg-[#f8f9fa] focus:bg-white border border-[#dadce0] rounded-[10px] focus:outline-none focus:border-[#1a73e8] text-[13.5px] sm:text-[14px]"
                  />
                </div>

                {submissionError && (
                  <div
                    role="alert"
                    className="rounded-[12px] border border-[#fad2cf] bg-[#fce8e6] p-3 text-[13px] font-medium text-[#d93025]"
                  >
                    {submissionError}
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

export default function Services() {
  const [activeCategory, setActiveCategory] = useState("all");

  // Guest Posting Configurator State
  const [guestPostOptions, setGuestPostOptions] = useState({
    dadr: "50",
    niche: "general",
    traffic: "1k",
  });
  const [guestPostQty, setGuestPostQty] = useState(5);

  // Per-Card Draft Quantities
  const [draftQuantities, setDraftQuantities] = useState(() => {
    const initial = {};
    SERVICE_PAGES_DATA.forEach((s) => {
      if (s.id !== "guest_posting") initial[s.id] = 50;
    });
    return initial;
  });

  // Master Multi-Service Campaign Cart
  const [boomfiReturn] = useState(readBoomFiReturnState);
  const [checkoutCart, setCheckoutCart] = useState(() => {
    if (
      boomfiReturn.savedOrder?.cart &&
      Object.keys(boomfiReturn.savedOrder.cart).length > 0
    ) {
      return boomfiReturn.savedOrder.cart;
    }
    return { hp_post: 50 };
  });

  // Checkout Modal & Gateway States
  const [isCheckoutGatewayOpen, setIsCheckoutGatewayOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [isInitializing, setIsInitializing] = useState(false);
  const [isRedirectingBoomFi, setIsRedirectingBoomFi] = useState(false);
  const [paymentError, setPaymentError] = useState(
    boomfiReturn.status === "failed"
      ? "Crypto payment was cancelled or not completed. Your campaign bundle has been restored."
      : "",
  );

  const returnPayment =
    boomfiReturn.status === "success" && boomfiReturn.transactionId
      ? {
          transactionId: boomfiReturn.transactionId,
          method: "BoomFi Crypto Gateway",
        }
      : null;

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(
    Boolean(returnPayment),
  );
  const [completedPayment, setCompletedPayment] = useState(returnPayment);

  // Restore BoomFi session from DB if available
  useEffect(() => {
    if (boomfiReturn.status === "success" && boomfiReturn.transactionId) {
      axios
        .get(
          `${BACKEND_URL}/api/payments/session/${boomfiReturn.transactionId}`,
        )
        .then(({ data }) => {
          if (data?.cart && Object.keys(data.cart).length > 0) {
            setCheckoutCart(data.cart);
          }
        })
        .catch(() => {});
    }
    if (boomfiReturn.status === "success" || boomfiReturn.status === "failed") {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [boomfiReturn.status, boomfiReturn.transactionId]);

  // Guest Posting Calculations
  const currentGuestPostId = `guestpost_${guestPostOptions.dadr}_${guestPostOptions.dadr}_${guestPostOptions.niche}_${guestPostOptions.traffic}`;
  const currentGuestPostUnitPrice = getGuestPostingPrice(guestPostOptions);
  const currentGuestPostSubtotal = currentGuestPostUnitPrice * guestPostQty;
  const currentNicheObj =
    GUEST_POSTING_OPTIONS.niches.find((n) => n.id === guestPostOptions.niche) ||
    GUEST_POSTING_OPTIONS.niches[0];
  const gpSliderPos = gpQtyToSliderPos(guestPostQty);
  const gpFillPercent = Math.min(100, Math.max(0, (gpSliderPos / 600) * 100));
  const isCurrentGpInCart = Boolean(checkoutCart[currentGuestPostId] > 0);

  const updateGuestPostQty = (rawVal) => {
    let parsed = parseInt(rawVal, 10);
    if (isNaN(parsed) || parsed < 1) parsed = 1;
    if (parsed > 1000) parsed = 1000;
    setGuestPostQty(parsed);
    if (checkoutCart[currentGuestPostId]) {
      setCheckoutCart((prev) => ({ ...prev, [currentGuestPostId]: parsed }));
    }
  };

  const toggleGuestPostInCampaign = () => {
    setCheckoutCart((prev) => {
      const next = { ...prev };
      if (next[currentGuestPostId]) {
        delete next[currentGuestPostId];
      } else {
        next[currentGuestPostId] = guestPostQty;
      }
      return next;
    });
  };

  // Standard Card Quantity & Campaign Toggle Handlers
  const updateCardQuantity = (serviceId, rawVal) => {
    let parsed = parseInt(rawVal, 10);
    if (isNaN(parsed) || parsed < 1) parsed = 1;
    if (parsed > 5000) parsed = 5000;

    setDraftQuantities((prev) => ({ ...prev, [serviceId]: parsed }));
    if (checkoutCart[serviceId]) {
      setCheckoutCart((prev) => ({ ...prev, [serviceId]: parsed }));
    }
  };

  const toggleServiceInCampaign = (serviceId) => {
    const qtyToUse = draftQuantities[serviceId] || 50;
    setCheckoutCart((prev) => {
      const next = { ...prev };
      if (next[serviceId]) {
        delete next[serviceId];
      } else {
        next[serviceId] = qtyToUse;
      }
      return next;
    });
  };

  const removeCartItem = (id) => {
    setCheckoutCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  // Detailed Cart Breakdown
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
        detail: svc ? `${svc.metric} • ${svc.tlds}` : "Authority Placement",
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

  // Checkout Gateway Handlers
  const openStripeCheckoutModal = async (cartToUse = checkoutCart) => {
    setIsInitializing(true);
    setPaymentError("");
    setIsCheckoutGatewayOpen(true);
    document.body.style.overflow = "hidden";

    try {
      const [{ data }] = await Promise.all([
        axios.post(`${BACKEND_URL}/api/create-stripe-intent`, {
          cart: cartToUse,
        }),
        getStripePromise(),
      ]);
      setClientSecret(data.clientSecret);
    } catch (err) {
      setPaymentError(
        err.response?.data?.error ||
          "Could not initialise card gateway. Please try PayPal or Crypto.",
      );
    } finally {
      setIsInitializing(false);
    }
  };

  const handleBoomFiCheckout = async (cartToUse = checkoutCart) => {
    setIsRedirectingBoomFi(true);
    setPaymentError("");
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
              transactionId: data.transactionId,
              timestamp: Date.now(),
            }),
          );
        } catch (e) {
          console.warn("Storage warning:", e);
        }
        window.location.href = data.checkoutUrl;
      } else {
        setPaymentError("BoomFi did not return a valid payment link.");
      }
    } catch (err) {
      setPaymentError(
        err.response?.data?.error || "Unable to initialise Crypto Checkout.",
      );
    } finally {
      setIsRedirectingBoomFi(false);
    }
  };

  const handlePaymentSuccess = (transactionId, method) => {
    setIsCheckoutGatewayOpen(false);
    setCompletedPayment({ transactionId, method });
    setIsOrderModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const categories = [
    { id: "all", label: "All Services (13)", shortLabel: "All (13)" },
    { id: "guest_post", label: "★ Guest Posting", shortLabel: "★ Guest Post" },
    { id: "standard", label: "Standard PBN (3)", shortLabel: "Standard (3)" },
    { id: "id_net", label: ".ID Regional (3)", shortLabel: ".ID Net (3)" },
    { id: "edu_gov", label: "EDU & GOV (3)", shortLabel: "EDU/GOV (3)" },
    { id: "solutions", label: "SEO Packages (3)", shortLabel: "Packages (3)" },
  ];

  const nonGuestServices = SERVICE_PAGES_DATA.filter(
    (s) => s.id !== "guest_posting",
  );
  const filteredServices =
    activeCategory === "all"
      ? nonGuestServices
      : activeCategory === "guest_post"
        ? []
        : nonGuestServices.filter((s) => s.category === activeCategory);

  const showGuestPostingCard =
    activeCategory === "all" || activeCategory === "guest_post";

  return (
    <PayPalScriptProvider
      options={{
        "client-id": PAYPAL_CLIENT_ID,
        currency: "USD",
        intent: "capture",
      }}
    >
      <main className="w-full bg-[#f8f9fa] relative overflow-x-clip pt-[56px] pb-28 lg:pb-16">
        <style>{`
          .bg-dotted-grid { background-image: radial-gradient(circle, #d0d7de 1px, transparent 1px); background-size: 28px 28px; }
          .custom-scrollbar::-webkit-scrollbar { width: 5px; }
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

        {/* 1. ENTERPRISE HERO SECTION */}
        <section className="relative w-full bg-white py-8 sm:py-12 px-4 sm:px-6 border-b border-[#e8eaed] overflow-hidden">
          <div className="absolute inset-0 bg-dotted-grid [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] opacity-45 pointer-events-none" />
          <div className="max-w-[1280px] mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#e8f0fe] border border-[#d2e3fc] mb-3.5">
              <span className="w-2 h-2 rounded-full bg-[#1a73e8] animate-pulse" />
              <span className="text-[12px] font-semibold text-[#1a73e8]">
                Multi-Service Campaign Builder
              </span>
            </div>
            <h2 className="gw-font-display text-[28px] sm:text-[42px] lg:text-[48px] font-medium text-[#202124] leading-[1.12] tracking-[-0.025em] max-w-[820px] mx-auto mb-3">
              Select & combine any{" "}
              <span className="text-[#1a73e8]">SEO backlink services</span> in
              one checkout.
            </h2>
            <p className="gw-font-text text-[14px] sm:text-[16px] text-[#5f6368] max-w-[680px] mx-auto leading-[1.6]">
              Mix Real-Traffic Guest Posts, Homepage PBNs, Regional .ID
              placements, and .EDU/.GOV authority links into a single custom
              campaign with instant white-label reporting.
            </p>
          </div>
        </section>

        {/* 2. NON-STICKY INTEGRATED CATEGORY FILTER TOOLBAR + SPLIT-SCREEN CAMPAIGN BUILDER */}
        <section className="w-full py-6 sm:py-9 px-4 sm:px-6">
          <div className="max-w-[1280px] mx-auto">
            {/* Sleek Non-Sticky Filter Bar (Scrolls naturally, zero screen clutter) */}
            <div className="bg-white rounded-[20px] border border-[#e8eaed] p-2.5 sm:px-4 sm:py-3 mb-6 shadow-[0_2px_10px_rgba(60,64,67,0.03)] flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {categories.map((cat) => {
                  const active = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-3.5 py-2 rounded-full text-[12.5px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                        active
                          ? "bg-[#1a73e8] text-white shadow-[0_2px_8px_rgba(26,115,232,0.25)]"
                          : "bg-[#f8f9fa] text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4]"
                      }`}
                    >
                      <span className="sm:hidden">{cat.shortLabel}</span>
                      <span className="hidden sm:inline">{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="hidden md:flex items-center gap-2 text-[12.5px] font-medium text-[#5f6368] shrink-0">
                <span>Active Bundle:</span>
                <span className="bg-[#e8f0fe] text-[#1a73e8] font-semibold px-3 py-1 rounded-full border border-[#d2e3fc]">
                  {selectedPackagesCount}{" "}
                  {selectedPackagesCount === 1 ? "Service" : "Services"} •{" "}
                  {totalLinks.toLocaleString()} Links
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
              {/* LEFT 8 COLUMNS: GUEST POSTING CONFIGURATOR + 12 INTERACTIVE SERVICE CARDS */}
              <div className="lg:col-span-8 space-y-6">
                {/* FEATURED GUEST POSTING MULTI-TIER CONFIGURATOR */}
                {showGuestPostingCard && (
                  <div
                    className={`bg-white rounded-[24px] border-2 transition-all overflow-hidden shadow-[0_10px_32px_rgba(26,115,232,0.07)] ${
                      isCurrentGpInCart
                        ? "border-[#1a73e8] ring-3 ring-[#e8f0fe]"
                        : "border-[#d2e3fc]"
                    }`}
                  >
                    <div className="grid grid-cols-4 h-[4px] w-full">
                      <div className="bg-[#4285F4]" />
                      <div className="bg-[#EA4335]" />
                      <div className="bg-[#FBBC04]" />
                      <div className="bg-[#34A853]" />
                    </div>

                    <div className="bg-gradient-to-r from-[#f8fbff] via-[#eef5ff] to-[#f1faf4] px-5 py-4 border-b border-[#d2e3fc] flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-[14px] bg-white border border-[#d2e3fc] flex items-center justify-center shadow-xs shrink-0">
                          <img
                            src="/favicon.svg"
                            alt="Guest Posting"
                            className="w-6 h-6 object-contain"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="gw-font-display text-[18px] sm:text-[20px] font-semibold text-[#202124]">
                              Editorial Guest Posting
                            </h2>
                            <span className="text-[11px] font-semibold bg-[#1a73e8] text-white px-2.5 py-0.5 rounded-full">
                              ★ #1 Flagship
                            </span>
                            <span className="text-[11px] font-semibold bg-[#fce8e6] text-[#d93025] border border-[#fad2cf] px-2.5 py-0.5 rounded-full">
                              DA/DR 30+ to 50+ Free Choice
                            </span>
                          </div>
                          <p className="text-[12.5px] text-[#5f6368] mt-0.5">
                            Real authority placements with verified organic
                            traffic—add multiple tiers to your campaign!
                          </p>
                        </div>
                      </div>

                      <Link
                        to="/services/guest-posting"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-[#d2e3fc] text-[12px] font-semibold text-[#1a73e8] hover:bg-[#e8f0fe] transition-colors"
                      >
                        Dedicated Page →
                      </Link>
                    </div>

                    <div className="p-5 sm:p-6 space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Step 1: Niche */}
                        <div>
                          <label className="block text-[12.5px] font-semibold text-[#202124] mb-2">
                            1. Website Niche
                          </label>
                          <div className="grid grid-cols-2 gap-2.5">
                            {GUEST_POSTING_OPTIONS.niches.map((n) => {
                              const active = guestPostOptions.niche === n.id;
                              const isIgaming = n.id === "igaming";
                              return (
                                <button
                                  key={n.id}
                                  type="button"
                                  onClick={() =>
                                    setGuestPostOptions((prev) => ({
                                      ...prev,
                                      niche: n.id,
                                    }))
                                  }
                                  className={`p-3 rounded-[14px] border-2 text-left transition-all cursor-pointer ${
                                    active
                                      ? isIgaming
                                        ? "bg-[#faf5ff] border-[#9334e6] shadow-2xs"
                                        : "bg-[#f8fbff] border-[#1a73e8] shadow-2xs"
                                      : "bg-white border-[#dadce0] hover:border-[#bdc1c6]"
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="block text-[13.5px] font-semibold text-[#202124]">
                                      {n.cardLabel}
                                    </span>
                                    <span
                                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                        active
                                          ? isIgaming
                                            ? "bg-[#9334e6] border-[#9334e6]"
                                            : "bg-[#1a73e8] border-[#1a73e8]"
                                          : "border-[#bdc1c6]"
                                      }`}
                                    >
                                      {active && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                      )}
                                    </span>
                                  </div>
                                  <span
                                    className={`text-[11.5px] font-bold block mt-0.5 ${
                                      isIgaming
                                        ? "text-[#9334e6]"
                                        : "text-[#1a73e8]"
                                    }`}
                                  >
                                    From ${n.basePrice}/post
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Step 2: DA/DR (UPDATED TO VIBRANT GOOGLE RED ACTIVE BUTTON) */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-[12.5px] font-semibold text-[#202124]">
                              2. Target Authority
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
                                      setGuestPostOptions((prev) => ({
                                        ...prev,
                                        dadr: tier,
                                      }))
                                    }
                                    className={`py-2.5 px-2 rounded-[10px] text-[12.5px] font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
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
                      </div>

                      {/* Step 3: Monthly Organic Traffic */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[12.5px] font-semibold text-[#202124]">
                            3. Verified Monthly Organic Traffic (2x Tier
                            Progression)
                          </label>
                          <span className="text-[12px] font-bold text-[#1a73e8] bg-[#e8f0fe] px-2.5 py-0.5 rounded-full">
                            ${currentGuestPostUnitPrice}/post
                          </span>
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                          {GUEST_POSTING_OPTIONS.trafficTiers.map((tTier) => {
                            const active =
                              guestPostOptions.traffic === tTier.id;
                            const price =
                              currentNicheObj.basePrice * tTier.multiplier;
                            return (
                              <button
                                key={tTier.id}
                                type="button"
                                onClick={() =>
                                  setGuestPostOptions((prev) => ({
                                    ...prev,
                                    traffic: tTier.id,
                                  }))
                                }
                                className={`py-2.5 px-1.5 rounded-[12px] border-2 text-center transition-all cursor-pointer ${
                                  active
                                    ? "bg-[#1a73e8] border-[#1a73e8] text-white shadow-xs"
                                    : "bg-[#f8f9fa] border-[#e8eaed] text-[#202124] hover:border-[#1a73e8]"
                                }`}
                              >
                                <span className="block text-[12.5px] font-bold">
                                  {tTier.label}
                                </span>
                                <span
                                  className={`block text-[11px] font-semibold mt-0.5 ${
                                    active ? "text-white/95" : "text-[#1a73e8]"
                                  }`}
                                >
                                  ${price}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Step 4: Signature Dot-Stop Slider + Add to Campaign Action */}
                      <div className="pt-4 border-t border-[#e8eaed] bg-[#f8fbff] -mx-5 sm:-mx-6 -mb-5 sm:-mb-6 p-5 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[12.5px] font-semibold text-[#202124]">
                                4. Quantity:{" "}
                                <strong className="text-[#1a73e8]">
                                  {guestPostQty} Guest Posts
                                </strong>
                              </span>
                              <span className="gw-font-display text-[15px] font-bold text-[#1a73e8]">
                                Subtotal: $
                                {currentGuestPostSubtotal.toLocaleString(
                                  "en-US",
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  },
                                )}
                              </span>
                            </div>

                            {/* Signature Dot-Stop Slider Bar */}
                            <div className="relative flex items-center h-6">
                              <div className="absolute inset-x-[10px] flex justify-between items-center pointer-events-none z-10">
                                {GP_SLIDER_STOPS.map((s, i) => (
                                  <span
                                    key={s}
                                    className={`w-2 h-2 rounded-full transition-colors ${
                                      gpSliderPos >= i * 100
                                        ? "bg-white ring-2 ring-[#1a73e8]"
                                        : "bg-[#bdc1c6]"
                                    }`}
                                  />
                                ))}
                              </div>
                              <input
                                type="range"
                                aria-label="Guest post quantity"
                                min="0"
                                max="600"
                                step="1"
                                value={gpSliderPos}
                                onChange={(e) =>
                                  updateGuestPostQty(
                                    gpSliderPosToQty(e.target.value),
                                  )
                                }
                                className="w-full h-[8px] bg-[#e8eaed] rounded-full appearance-none cursor-pointer relative z-20"
                                style={{
                                  background: `linear-gradient(to right, #1a73e8 0%, #1a73e8 ${gpFillPercent}%, #e8eaed ${gpFillPercent}%, #e8eaed 100%)`,
                                }}
                              />
                            </div>

                            {/* Clickable Stop Pills */}
                            <div className="relative h-5 mt-1">
                              {GP_SLIDER_STOPS.map((s, i) => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => updateGuestPostQty(s)}
                                  style={{
                                    left:
                                      i > 0 && i < 6
                                        ? `${(i / 6) * 100}%`
                                        : undefined,
                                  }}
                                  className={`absolute top-0 ${
                                    i === 0
                                      ? "left-0"
                                      : i === 6
                                        ? "right-0"
                                        : "-translate-x-1/2"
                                  } text-[10.5px] font-medium px-1.5 py-0.5 rounded-full cursor-pointer transition-colors ${
                                    guestPostQty === s
                                      ? "bg-[#1a73e8] text-white font-semibold"
                                      : "text-[#5f6368] hover:text-[#1a73e8]"
                                  }`}
                                >
                                  {s === 1000 ? "1k" : s}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 shrink-0 pt-2 sm:pt-0">
                            <div className="flex items-center bg-white border border-[#dadce0] rounded-full p-1 shadow-2xs">
                              <button
                                type="button"
                                aria-label="Decrease guest post quantity"
                                onClick={() =>
                                  updateGuestPostQty(guestPostQty - 1)
                                }
                                className="w-7 h-7 rounded-full text-[#5f6368] hover:bg-[#f1f3f4] font-bold cursor-pointer"
                              >
                                −
                              </button>
                              <input
                                type="number"
                                aria-label="Guest post quantity"
                                min="1"
                                max="1000"
                                value={guestPostQty}
                                onChange={(e) =>
                                  updateGuestPostQty(e.target.value)
                                }
                                className="w-12 text-center bg-transparent text-[13px] font-bold text-[#202124] focus:outline-none"
                              />
                              <button
                                type="button"
                                aria-label="Increase guest post quantity"
                                onClick={() =>
                                  updateGuestPostQty(guestPostQty + 1)
                                }
                                className="w-7 h-7 rounded-full text-[#1a73e8] hover:bg-[#e8f0fe] font-bold cursor-pointer"
                              >
                                +
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={toggleGuestPostInCampaign}
                              className={`h-[40px] px-4 rounded-full text-[13px] font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                                isCurrentGpInCart
                                  ? "bg-[#e6f4ea] text-[#137333] border border-[#ceead6] hover:bg-[#ceead6]/60"
                                  : "bg-[#1a73e8] hover:bg-[#1557b0] text-white shadow-[0_4px_12px_rgba(26,115,232,0.25)]"
                              }`}
                            >
                              {isCurrentGpInCart ? (
                                <>
                                  <CheckBadgeIcon />
                                  <span>In Campaign</span>
                                </>
                              ) : (
                                <>
                                  <PlusBadgeIcon />
                                  <span>Add to Campaign</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 12 PBN & MANAGED SEO SERVICE CARDS (2-COLUMN ENTERPRISE GRID) */}
                {filteredServices.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredServices.map((service) => {
                      const isAdded = Boolean(checkoutCart[service.id] > 0);
                      const currentQty =
                        checkoutCart[service.id] ||
                        draftQuantities[service.id] ||
                        50;
                      const sliderPos = cardQtyToSliderPos(currentQty);
                      const fillPct = Math.min(
                        100,
                        Math.max(0, (sliderPos / 500) * 100),
                      );
                      const cardSubtotal = currentQty * service.price;

                      return (
                        <div
                          key={service.id}
                          className={`bg-white rounded-[22px] border transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                            isAdded
                              ? "border-2 border-[#1a73e8] ring-3 ring-[#e8f0fe]/90 shadow-[0_10px_28px_rgba(26,115,232,0.10)]"
                              : "border-[#e8eaed] hover:border-[#d2e3fc] hover:shadow-[0_8px_24px_rgba(60,64,67,0.06)] shadow-[0_2px_10px_rgba(60,64,67,0.03)]"
                          }`}
                        >
                          <div>
                            <div
                              className={`h-[4px] w-full ${
                                service.topAccent || "bg-[#1a73e8]"
                              }`}
                            />
                            <div className="p-5 sm:p-6">
                              {/* Top Badges & Price */}
                              <div className="flex items-center justify-between gap-2 mb-3">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span
                                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${service.badgeColor}`}
                                  >
                                    {service.badge}
                                  </span>
                                  <span className="text-[11px] font-semibold bg-[#e6f4ea] text-[#1e8e3e] px-2.5 py-0.5 rounded-full">
                                    ● {service.metric}
                                  </span>
                                </div>
                                <div className="text-right shrink-0">
                                  <span className="gw-font-display text-[18px] font-bold text-[#1a73e8]">
                                    ${service.price.toFixed(2)}
                                  </span>
                                  <span className="text-[11px] font-medium text-[#5f6368]">
                                    /link
                                  </span>
                                </div>
                              </div>

                              {/* Title & Dedicated Page Link */}
                              <div className="flex items-start justify-between gap-2">
                                <h2 className="gw-font-display text-[18px] font-semibold text-[#202124] leading-snug">
                                  {service.name}
                                </h2>
                                <Link
                                  to={`/services/${service.slug}`}
                                  className="text-[11.5px] font-semibold text-[#1a73e8] bg-[#f8fbff] hover:bg-[#e8f0fe] border border-[#d2e3fc] px-2.5 py-0.5 rounded-full shrink-0 transition-colors"
                                >
                                  Details →
                                </Link>
                              </div>
                              <p className="text-[12.5px] text-[#5f6368] mt-1.5 line-clamp-2 leading-[1.55]">
                                {service.desc}
                              </p>

                              {/* TLD & Turnaround Metadata Strip */}
                              <div className="grid grid-cols-2 gap-2 mt-3.5 p-2.5 rounded-[12px] bg-[#f8f9fa] border border-[#e8eaed] text-[11.5px]">
                                <div>
                                  <span className="text-[#5f6368] block text-[10px] uppercase font-semibold">
                                    Supported TLDs
                                  </span>
                                  <span className="font-semibold text-[#202124] truncate block">
                                    {service.tlds}
                                  </span>
                                </div>
                                <div className="border-l border-[#dadce0] pl-2.5">
                                  <span className="text-[#5f6368] block text-[10px] uppercase font-semibold">
                                    Turnaround
                                  </span>
                                  <span className="font-semibold text-[#1e8e3e] block">
                                    ⏱ {service.turnaround}
                                  </span>
                                </div>
                              </div>

                              {/* Compact Features List */}
                              <ul className="mt-3.5 space-y-1.5 pt-1">
                                {service.features.slice(0, 3).map((feat, i) => (
                                  <li
                                    key={i}
                                    className="flex items-center gap-2 text-[12px] text-[#3c4043]"
                                  >
                                    <span className="w-4 h-4 rounded-full bg-[#e6f4ea] text-[#1e8e3e] inline-flex items-center justify-center shrink-0 text-[10px] font-bold">
                                      ✓
                                    </span>
                                    <span className="truncate">{feat}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Card Bottom Signature Slider & Multi-Select Footer */}
                          <div
                            className={`px-5 py-4 border-t transition-colors ${
                              isAdded
                                ? "bg-[#f8fbff] border-[#d2e3fc]"
                                : "bg-[#fcfcfc] border-[#e8eaed]"
                            }`}
                          >
                            <div className="flex items-center justify-between text-[12px] mb-2">
                              <span className="font-medium text-[#5f6368]">
                                Quantity:{" "}
                                <strong className="text-[#202124]">
                                  {currentQty.toLocaleString()} Links
                                </strong>
                              </span>
                              <span className="gw-font-display text-[14.5px] font-bold text-[#1a73e8]">
                                $
                                {cardSubtotal.toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </span>
                            </div>

                            {/* Signature Dot-Stop Slider Bar */}
                            <div className="relative flex items-center h-6">
                              <div className="absolute inset-x-[10px] flex justify-between items-center pointer-events-none z-10">
                                {CARD_SLIDER_STOPS.map((stopVal, idx) => (
                                  <span
                                    key={stopVal}
                                    className={`w-2 h-2 rounded-full transition-colors ${
                                      sliderPos >= idx * 100
                                        ? "bg-white ring-2 ring-[#1a73e8]"
                                        : "bg-[#bdc1c6]"
                                    }`}
                                  />
                                ))}
                              </div>
                              <input
                                type="range"
                                aria-label={`${service.name} quantity`}
                                min="0"
                                max="500"
                                step="1"
                                value={sliderPos}
                                onChange={(e) =>
                                  updateCardQuantity(
                                    service.id,
                                    cardSliderPosToQty(e.target.value),
                                  )
                                }
                                className="w-full h-[8px] bg-[#e8eaed] rounded-full appearance-none cursor-pointer relative z-20"
                                style={{
                                  background: `linear-gradient(to right, #1a73e8 0%, #1a73e8 ${fillPct}%, #e8eaed ${fillPct}%, #e8eaed 100%)`,
                                }}
                              />
                            </div>

                            {/* Clickable Stop Labels */}
                            <div className="relative h-5 mt-0.5 mb-3">
                              {CARD_SLIDER_STOPS.map((stopVal, idx) => {
                                const leftPct = (idx / 5) * 100;
                                return (
                                  <button
                                    key={stopVal}
                                    type="button"
                                    onClick={() =>
                                      updateCardQuantity(service.id, stopVal)
                                    }
                                    style={
                                      idx > 0 && idx < 5
                                        ? { left: `${leftPct}%` }
                                        : undefined
                                    }
                                    className={`absolute top-0 ${
                                      idx === 0
                                        ? "left-0"
                                        : idx === 5
                                          ? "right-0"
                                          : "-translate-x-1/2"
                                    } text-[10px] font-medium px-1.5 py-0.5 rounded-full cursor-pointer transition-colors ${
                                      currentQty === stopVal
                                        ? "bg-[#1a73e8] text-white font-semibold"
                                        : "text-[#5f6368] hover:text-[#1a73e8]"
                                    }`}
                                  >
                                    {stopVal >= 1000
                                      ? `${stopVal / 1000}k`
                                      : stopVal}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Stepper + Clean Pill Campaign Button */}
                            <div className="flex items-center justify-between gap-2.5">
                              <div className="flex items-center bg-white border border-[#dadce0] rounded-full p-0.5 shadow-2xs">
                                <button
                                  type="button"
                                  aria-label={`Decrease ${service.name} quantity`}
                                  onClick={() =>
                                    updateCardQuantity(
                                      service.id,
                                      currentQty - 50,
                                    )
                                  }
                                  className="w-7 h-7 rounded-full text-[#5f6368] hover:bg-[#f1f3f4] text-[14px] font-bold cursor-pointer flex items-center justify-center"
                                >
                                  −
                                </button>
                                <input
                                  type="number"
                                  aria-label={`${service.name} quantity`}
                                  min="1"
                                  max="5000"
                                  value={currentQty}
                                  onChange={(e) =>
                                    updateCardQuantity(
                                      service.id,
                                      e.target.value,
                                    )
                                  }
                                  className="w-13 text-center bg-transparent text-[13px] font-bold text-[#202124] focus:outline-none"
                                />
                                <button
                                  type="button"
                                  aria-label={`Increase ${service.name} quantity`}
                                  onClick={() =>
                                    updateCardQuantity(
                                      service.id,
                                      currentQty + 50,
                                    )
                                  }
                                  className="w-7 h-7 rounded-full text-[#1a73e8] hover:bg-[#e8f0fe] text-[14px] font-bold cursor-pointer flex items-center justify-center"
                                >
                                  +
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  toggleServiceInCampaign(service.id)
                                }
                                className={`flex-1 h-[38px] px-3.5 rounded-full text-[12.5px] font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 focus:outline-none ${
                                  isAdded
                                    ? "bg-[#e6f4ea] text-[#137333] border border-[#ceead6] hover:bg-[#d9f0dc]"
                                    : "bg-[#1a73e8] hover:bg-[#1557b0] text-white shadow-[0_3px_10px_rgba(26,115,232,0.22)]"
                                }`}
                              >
                                {isAdded ? (
                                  <>
                                    <CheckBadgeIcon />
                                    <span>In Campaign</span>
                                  </>
                                ) : (
                                  <>
                                    <PlusBadgeIcon />
                                    <span>Add to Campaign</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* RIGHT 4 COLUMNS: STICKY MULTI-SERVICE CAMPAIGN CHECKOUT DOCK */}
              <aside
                id="campaign-checkout-dock"
                className="lg:col-span-4 w-full lg:sticky lg:top-[84px] self-start"
              >
                <div className="bg-white rounded-[24px] border border-[#dadce0] shadow-[0_16px_40px_rgba(60,64,67,0.10)] overflow-hidden">
                  <div className="grid grid-cols-4 h-[4px] w-full">
                    <div className="bg-[#4285F4]" />
                    <div className="bg-[#EA4335]" />
                    <div className="bg-[#FBBC04]" />
                    <div className="bg-[#34A853]" />
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="flex items-center justify-between border-b border-[#e8eaed] pb-3.5 mb-4">
                      <div>
                        <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[#1a73e8] block">
                          Multi-Service Checkout
                        </span>
                        <h2 className="gw-font-display text-[19px] font-semibold text-[#202124]">
                          Your Campaign Bundle
                        </h2>
                      </div>
                      {selectedPackagesCount > 0 && (
                        <button
                          type="button"
                          onClick={() => setCheckoutCart({})}
                          className="text-[11.5px] font-medium text-[#d93025] hover:bg-[#fce8e6] px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                        >
                          Clear All
                        </button>
                      )}
                    </div>

                    {/* Selected Services List */}
                    {selectedPackagesCount === 0 ? (
                      <div className="py-8 px-4 text-center rounded-[16px] bg-[#f8f9fa] border border-dashed border-[#dadce0] mb-4">
                        <p className="text-[13.5px] font-medium text-[#3c4043]">
                          No services selected yet
                        </p>
                        <p className="text-[12px] text-[#5f6368] mt-1">
                          Click &ldquo;Add to Campaign&rdquo; on any service
                          card on the left to build your custom bundle.
                        </p>
                      </div>
                    ) : (
                      <div className="max-h-[260px] overflow-y-auto pr-1 space-y-2 mb-4 custom-scrollbar">
                        {selectedPackagesDetailed.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-2 bg-[#f8fbff] px-3 py-2.5 rounded-[12px] border border-[#d2e3fc]"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[11px] font-bold bg-[#1a73e8] text-white px-2 py-0.5 rounded-full shrink-0">
                                  {item.qty.toLocaleString()}x
                                </span>
                                <span className="text-[13px] font-semibold text-[#202124] truncate">
                                  {item.name}
                                </span>
                              </div>
                              <span className="block text-[11px] text-[#5f6368] mt-0.5 truncate">
                                {item.detail} (${item.price.toFixed(2)}/link)
                              </span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="gw-font-display text-[13.5px] font-bold text-[#1a73e8]">
                                $
                                {item.subtotal.toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeCartItem(item.id)}
                                className="w-6 h-6 rounded-full text-[#5f6368] hover:bg-[#fce8e6] hover:text-[#d93025] flex items-center justify-center text-[14px] cursor-pointer"
                                title="Remove from campaign"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Total Investment Box */}
                    <div className="bg-[#f8f9fa] rounded-[16px] p-4 mb-4 border border-[#e8eaed]">
                      <div className="flex justify-between items-center text-[12.5px] text-[#5f6368] mb-1.5">
                        <span>Total Selected Services</span>
                        <span className="font-semibold text-[#202124]">
                          {selectedPackagesCount}{" "}
                          {selectedPackagesCount === 1 ? "Service" : "Services"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[12.5px] text-[#5f6368] mb-2.5">
                        <span>Total Backlinks Volume</span>
                        <span className="font-semibold text-[#1a73e8] bg-[#e8f0fe] px-2.5 py-0.5 rounded-full">
                          {totalLinks.toLocaleString()} Links
                        </span>
                      </div>
                      <div className="flex justify-between items-end pt-2.5 border-t border-[#dadce0]">
                        <div>
                          <span className="gw-font-display text-[14px] font-medium text-[#202124] block">
                            Total Investment
                          </span>
                          <span className="text-[10.5px] text-[#1e8e3e] font-medium">
                            ● White-Label Report Included
                          </span>
                        </div>
                        <span className="gw-font-display text-[26px] font-bold text-[#1a73e8] leading-none">
                          $
                          {finalTotal.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          <span className="text-[11.5px] font-normal text-[#5f6368]">
                            USD
                          </span>
                        </span>
                      </div>
                    </div>

                    {paymentError && (
                      <div className="mb-3 p-3 rounded-[12px] bg-[#fce8e6] border border-[#fad2cf] text-[#d93025] text-[12px] font-medium">
                        {paymentError}
                      </div>
                    )}

                    {/* Unified 3 Payment Gateways */}
                    <div className="space-y-2.5">
                      <button
                        type="button"
                        onClick={() => openStripeCheckoutModal(checkoutCart)}
                        disabled={
                          totalLinks === 0 ||
                          isInitializing ||
                          isRedirectingBoomFi
                        }
                        className="gw-font-display w-full h-[48px] rounded-full bg-[#635bff] hover:bg-[#5249f5] text-white font-medium text-[14.5px] shadow-[0_6px_20px_rgba(99,91,255,0.28)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <StripeWordmarkIcon />
                        <span>Pay with Card (Instant)</span>
                      </button>

                      {totalLinks > 0 && (
                        <div className="w-full relative z-0">
                          <PayPalButtons
                            style={{
                              layout: "horizontal",
                              height: 45,
                              color: "gold",
                              shape: "pill",
                              tagline: false,
                            }}
                            forceReRender={[
                              totalLinks,
                              finalTotal,
                              selectedPackagesCount,
                            ]}
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
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => handleBoomFiCheckout(checkoutCart)}
                        disabled={
                          totalLinks === 0 ||
                          isInitializing ||
                          isRedirectingBoomFi
                        }
                        className="gw-font-display w-full h-[46px] rounded-full border border-[#dadce0] bg-[#d5ff2e] hover:bg-[#c2ed15] text-[#202124] font-medium text-[14px] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CryptoCoinIcon />
                        <span>
                          {isRedirectingBoomFi
                            ? "Redirecting to BoomFi..."
                            : "Pay with Crypto (BoomFi)"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* 3. COMPACT NETWORK ARCHITECTURE COMPARISON TABLE */}
        <section className="w-full bg-white py-12 px-4 sm:px-6 border-t border-[#e8eaed]">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-center max-w-[680px] mx-auto mb-8">
              <h2 className="gw-font-display text-[24px] sm:text-[32px] font-medium text-[#202124]">
                Compare Our{" "}
                <span className="text-[#1a73e8]">Link Building Tiers.</span>
              </h2>
              <p className="text-[14px] text-[#5f6368] mt-1.5">
                Every placement is backed by our 12-month link replacement
                guarantee and unbranded agency Excel reporting.
              </p>
            </div>

            <div className="overflow-x-auto rounded-[20px] border border-[#e8eaed]">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="bg-[#f8f9fa] border-b border-[#e8eaed] text-[12px] font-semibold uppercase tracking-wider text-[#5f6368]">
                    <th className="py-3.5 px-5">Network Tier</th>
                    <th className="py-3.5 px-5">Domain Metrics</th>
                    <th className="py-3.5 px-5">Supported TLDs</th>
                    <th className="py-3.5 px-5">Turnaround SLA</th>
                    <th className="py-3.5 px-5 text-right">Starting Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8eaed] text-[13.5px] text-[#3c4043]">
                  <tr className="bg-[#f8fbff]/60">
                    <td className="py-3.5 px-5 font-semibold text-[#1a73e8]">
                      ★ Editorial Guest Posting
                    </td>
                    <td className="py-3.5 px-5">
                      DA/DR 30+ to 50+ (1K–50K+ Organic Traffic)
                    </td>
                    <td className="py-3.5 px-5">.COM • .NET • .ORG • .ID</td>
                    <td className="py-3.5 px-5 text-[#1e8e3e] font-medium">
                      3–5 Days
                    </td>
                    <td className="py-3.5 px-5 text-right font-bold text-[#202124]">
                      $15.00 / link
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-5 font-semibold text-[#202124]">
                      Standard PBN Network
                    </td>
                    <td className="py-3.5 px-5">
                      Verified Moz DA 50+ / DR 50+
                    </td>
                    <td className="py-3.5 px-5">.COM • .NET • .ORG</td>
                    <td className="py-3.5 px-5 text-[#1e8e3e] font-medium">
                      3–7 Days
                    </td>
                    <td className="py-3.5 px-5 text-right font-bold text-[#202124]">
                      $1.00 / link
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-5 font-semibold text-[#202124]">
                      Regional Indonesian (.ID)
                    </td>
                    <td className="py-3.5 px-5">
                      Verified Moz DA 50+ / DR 50+
                    </td>
                    <td className="py-3.5 px-5">.ID • .CO.ID • .WEB.ID</td>
                    <td className="py-3.5 px-5 text-[#1e8e3e] font-medium">
                      3–7 Days
                    </td>
                    <td className="py-3.5 px-5 text-right font-bold text-[#202124]">
                      $2.00 / link
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-5 font-semibold text-[#202124]">
                      EDU & GOV Authority Tier
                    </td>
                    <td className="py-3.5 px-5">
                      DA 50–85+ Institutional Trust
                    </td>
                    <td className="py-3.5 px-5">
                      .EDU • .AC.ID • .SCH.ID • .GO.ID
                    </td>
                    <td className="py-3.5 px-5 text-[#1e8e3e] font-medium">
                      3–7 Days
                    </td>
                    <td className="py-3.5 px-5 text-right font-bold text-[#202124]">
                      $3.00 / link
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* MOBILE STICKY BOTTOM CAMPAIGN CHECKOUT BAR */}
        {selectedPackagesCount > 0 && (
          <div
            className="lg:hidden fixed bottom-0 left-0 right-0 z-[90] bg-white border-t border-[#dadce0] px-3 sm:px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.10)] flex items-center justify-between gap-2 sm:gap-3"
            data-testid="services-mobile-checkout-bar"
          >
            <div className="min-w-0 flex-1">
              <span className="text-[10px] sm:text-[11px] font-semibold text-[#1a73e8] block truncate">
                {selectedPackagesCount}{" "}
                {selectedPackagesCount === 1 ? "Service" : "Services"} •{" "}
                {totalLinks.toLocaleString()} Links
              </span>
              <span className="gw-font-display text-[18px] sm:text-[20px] font-bold text-[#202124] leading-none whitespace-nowrap">
                $
                {finalTotal.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                <span className="text-[11px] font-normal text-[#5f6368]">
                  USD
                </span>
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("campaign-checkout-dock")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-2.5 sm:px-3.5 py-2.5 rounded-full border border-[#dadce0] text-[11px] sm:text-[12.5px] font-semibold text-[#3c4043] bg-[#f8f9fa] whitespace-nowrap"
              >
                <span className="sm:hidden">Review</span>
                <span className="hidden sm:inline">Review Bundle</span>
              </button>
              <button
                type="button"
                onClick={() => openStripeCheckoutModal(checkoutCart)}
                className="px-3 sm:px-4 py-2.5 rounded-full bg-[#1a73e8] text-white text-[11px] sm:text-[12.5px] font-semibold shadow-sm whitespace-nowrap"
              >
                <span className="sm:hidden">Checkout</span>
                <span className="hidden sm:inline">Checkout Now →</span>
              </button>
            </div>
          </div>
        )}

        {/* POPUP 1: STRIPE CARD CHECKOUT MODAL */}
        {isCheckoutGatewayOpen && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div
              className="absolute inset-0 bg-[#202124]/55 backdrop-blur-[3px]"
              onClick={() => {
                setIsCheckoutGatewayOpen(false);
                document.body.style.overflow = "auto";
              }}
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
                  onClick={() => {
                    setIsCheckoutGatewayOpen(false);
                    document.body.style.overflow = "auto";
                  }}
                  className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-1.5 rounded-full hover:bg-[#e8eaed] text-[#5f6368] cursor-pointer"
                >
                  ✕
                </button>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e8f0fe] text-[#1a73e8] text-[11px] font-medium mb-1.5">
                  Step 1 of 3 • Multi-Service Card Checkout
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

        {/* POPUP 2 & POPUP 3: ORDER INTAKE & THANK YOU */}
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
