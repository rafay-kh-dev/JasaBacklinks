import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const TEAM_CONTACTS = {
  whatsappUrl: "https://wa.me/447598789693",
  whatsappLabel: "+44 7598789693",
  telegramUrl: "https://t.me/SEOHUBLTD",
  telegramLabel: "@SEOHUBLTD",
  supportEmail: "hello@jasabacklinks.net",
};

export default function Contact() {
  // Enquiry Form States
  const [enquiryType, setEnquiryType] = useState("Bulk / Agency Partnership");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [contactPlatform, setContactPlatform] = useState("WhatsApp");
  const [contactHandle, setContactHandle] = useState("");
  const [volumeTier, setVolumeTier] = useState("250 – 1,000 Links");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [message, setMessage] = useState("");

  // Submission & UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedKey, setCopiedKey] = useState("");
  const [openFaq, setOpenFaq] = useState(0);

  const enquiryTypes = [
    "Bulk / Agency Partnership",
    "Custom SEO Campaign",
    "Existing Order Support",
    "General Enquiry",
  ];

  const volumeOptions = [
    "50 – 250 Links",
    "250 – 1,000 Links",
    "1,000 – 5,000+ Links",
    "Custom Monthly Retainer",
  ];

  const faqs = [
    {
      q: "What is your fastest communication channel for urgent campaign updates?",
      a: "Our WhatsApp and Telegram priority desks operate 7 days a week with an average response time under 15 minutes for active agencies and bulk buyers.",
    },
    {
      q: "Can I request a custom PBN or .EDU/.GOV sample list before placing a bulk order?",
      a: "To protect our private network and client placements from competitor footprints, we do not publish public domain lists. However, our team can share anonymised metric snapshots and DR/DA distribution sheets upon request.",
    },
    {
      q: "Do you offer wholesale discounts for SEO agencies ordering 1,000+ links monthly?",
      a: "Yes. Select 'Bulk / Agency Partnership' in the form above or message our Telegram desk (@jasabacklinks) to set up a dedicated white-label agency rate card.",
    },
    {
      q: "I already placed an order. How do I update my target URLs or anchor texts?",
      a: "Select 'Existing Order Support' in the form above and include your Transaction ID, or message us directly on WhatsApp/Telegram with your registered handle.",
    },
  ];

  const handleCopy = (key, value) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(""), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !message.trim()) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const { data } = await axios.post(`${BACKEND_URL}/api/contact`, {
        enquiryType,
        fullName,
        email,
        contactPlatform,
        contactHandle,
        volumeTier,
        websiteUrl,
        message,
      });
      if (!data?.success) {
        throw new Error(
          "The server did not confirm that your enquiry was sent.",
        );
      }
      setIsSubmitted(true);
    } catch (err) {
      console.error("Contact form submission failed:", err);
      setErrorMessage(
        err.response?.data?.error ||
          err.message ||
          "Unable to send your enquiry. Please try again or contact us directly.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="w-full bg-[#fcfcfc] relative overflow-x-clip pt-[68px] sm:pt-[80px] pb-16 sm:pb-0">
      <style>{`
        .bg-dotted-grid { background-image: radial-gradient(circle, #d0d7de 1px, transparent 1px); background-size: 28px 28px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* --- 1. HERO HEADER SECTION --- */}
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
              24/7 Priority Agency Desk • Average Response &lt; 15 Mins
            </span>
          </div>

          <h2 className="gw-font-display text-[26px] sm:text-[44px] md:text-[54px] font-medium text-[#202124] leading-[1.15] sm:leading-[1.12] tracking-[-0.025em] max-w-[820px] mx-auto mb-3 sm:mb-5 px-1">
            Talk to our SEO &{" "}
            <span className="text-[#1a73e8]">link building specialists.</span>
          </h2>

          <p className="gw-font-text text-[14px] sm:text-[16.5px] md:text-[18px] text-[#5f6368] max-w-[680px] mx-auto leading-[1.55] sm:leading-[1.6] mb-6 sm:mb-8 px-1">
            Whether you need a custom 5,000-link enterprise rollout, regional
            .ID / .EDU allocations, or support on an active campaign, our
            engineers are ready to help.
          </p>

          {/* Horizontal Scrollable Status Pills on Mobile */}
          <div className="flex items-center sm:justify-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap pb-1">
            {[
              "● Live WhatsApp & Telegram Desk",
              "✓ 100% White-Label Agency Support",
              "✓ Custom Drip-Feed Planning",
              "✓ Operated by SeoHub Ltd",
            ].map((pill, i) => (
              <span
                key={i}
                className={`text-[11.5px] sm:text-[12.5px] font-medium px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full whitespace-nowrap shrink-0 border ${
                  i === 0
                    ? "bg-[#e6f4ea] text-[#1e8e3e] border-[#ceead6]"
                    : "bg-[#f8f9fa] text-[#3c4043] border-[#e8eaed]"
                }`}
              >
                {pill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* --- 2. THREE DIRECT INSTANT CONTACT CARDS --- */}
      <section className="w-full py-6 sm:py-12 px-3.5 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Card 1: WhatsApp */}
            <div className="bg-white rounded-[20px] sm:rounded-[24px] border border-[#e8eaed] hover:border-[#34a853] shadow-[0_2px_10px_rgba(60,64,67,0.04)] hover:shadow-[0_14px_36px_rgba(52,168,83,0.08)] transition-all duration-300 overflow-hidden flex flex-col justify-between">
              <div className="h-[4px] w-full bg-[#34a853]" />
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="w-11 h-11 rounded-[14px] bg-[#e6f4ea] text-[#1e8e3e] flex items-center justify-center">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-semibold bg-[#e6f4ea] text-[#1e8e3e] border border-[#ceead6] px-2.5 py-0.5 rounded-full">
                    ● Online Now
                  </span>
                </div>

                <h2 className="gw-font-display text-[19px] sm:text-[20px] font-medium text-[#202124] mb-1">
                  WhatsApp Priority Desk
                </h2>
                <p className="gw-font-text text-[13px] text-[#5f6368] mb-4 leading-relaxed">
                  Instant 1-on-1 chat for campaign updates, bulk orders, and
                  live tracking sheet requests.
                </p>

                <div className="bg-[#f8f9fa] rounded-[12px] px-3.5 py-2.5 border border-[#e8eaed] flex items-center justify-between mb-4">
                  <span className="font-mono text-[13px] font-semibold text-[#202124]">
                    {TEAM_CONTACTS.whatsappLabel}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy("whatsapp", TEAM_CONTACTS.whatsappLabel)
                    }
                    className="text-[11.5px] font-semibold text-[#1e8e3e] hover:underline cursor-pointer"
                  >
                    {copiedKey === "whatsapp" ? "✓ Copied" : "Copy"}
                  </button>
                </div>

                <a
                  href={TEAM_CONTACTS.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gw-font-display w-full h-[44px] rounded-full bg-[#1e8e3e] hover:bg-[#137333] text-white text-[13.5px] font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span>Start WhatsApp Chat</span>
                  <span>↗</span>
                </a>
              </div>
            </div>

            {/* Card 2: Telegram */}
            <div className="bg-white rounded-[20px] sm:rounded-[24px] border border-[#e8eaed] hover:border-[#1a73e8] shadow-[0_2px_10px_rgba(60,64,67,0.04)] hover:shadow-[0_14px_36px_rgba(26,115,232,0.08)] transition-all duration-300 overflow-hidden flex flex-col justify-between">
              <div className="h-[4px] w-full bg-[#1a73e8]" />
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="w-11 h-11 rounded-[14px] bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-semibold bg-[#e8f0fe] text-[#1a73e8] border border-[#d2e3fc] px-2.5 py-0.5 rounded-full">
                    Fastest for Agencies
                  </span>
                </div>

                <h2 className="gw-font-display text-[19px] sm:text-[20px] font-medium text-[#202124] mb-1">
                  Telegram Agency Desk
                </h2>
                <p className="gw-font-text text-[13px] text-[#5f6368] mb-4 leading-relaxed">
                  Preferred by SEO agencies, crypto/iGaming teams, and resellers
                  for rapid file & anchor sharing.
                </p>

                <div className="bg-[#f8f9fa] rounded-[12px] px-3.5 py-2.5 border border-[#e8eaed] flex items-center justify-between mb-4">
                  <span className="font-mono text-[13px] font-semibold text-[#202124]">
                    {TEAM_CONTACTS.telegramLabel}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy("telegram", TEAM_CONTACTS.telegramLabel)
                    }
                    className="text-[11.5px] font-semibold text-[#1a73e8] hover:underline cursor-pointer"
                  >
                    {copiedKey === "telegram" ? "✓ Copied" : "Copy"}
                  </button>
                </div>

                <a
                  href={TEAM_CONTACTS.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gw-font-display w-full h-[44px] rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-[13.5px] font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span>Message on Telegram</span>
                  <span>↗</span>
                </a>
              </div>
            </div>

            {/* Card 3: Official Support Email */}
            <div className="bg-white rounded-[20px] sm:rounded-[24px] border border-[#e8eaed] hover:border-[#fbbc04] shadow-[0_2px_10px_rgba(60,64,67,0.04)] hover:shadow-[0_14px_36px_rgba(251,188,4,0.10)] transition-all duration-300 overflow-hidden flex flex-col justify-between">
              <div className="h-[4px] w-full bg-[#fbbc04]" />
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="w-11 h-11 rounded-[14px] bg-[#fef7e0] text-[#f29900] flex items-center justify-center">
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
                  <span className="text-[11px] font-semibold bg-[#fef7e0] text-[#b06000] border border-[#fde293] px-2.5 py-0.5 rounded-full">
                    Official Billing & Support
                  </span>
                </div>

                <h2 className="gw-font-display text-[19px] sm:text-[20px] font-medium text-[#202124] mb-1">
                  Enterprise Support Desk
                </h2>
                <p className="gw-font-text text-[13px] text-[#5f6368] mb-4 leading-relaxed">
                  Send detailed spreadsheets, custom RFP briefs, billing
                  enquiries, or white-label report requests.
                </p>

                <div className="bg-[#f8f9fa] rounded-[12px] px-3.5 py-2.5 border border-[#e8eaed] flex items-center justify-between gap-2 mb-4">
                  <span className="font-mono text-[12px] sm:text-[12.5px] font-semibold text-[#202124] truncate">
                    {TEAM_CONTACTS.supportEmail}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy("email", TEAM_CONTACTS.supportEmail)
                    }
                    className="text-[11.5px] font-semibold text-[#f29900] hover:underline shrink-0 cursor-pointer"
                  >
                    {copiedKey === "email" ? "✓ Copied" : "Copy"}
                  </button>
                </div>

                <a
                  href={`mailto:${TEAM_CONTACTS.supportEmail}`}
                  className="gw-font-display w-full h-[44px] rounded-full bg-[#202124] hover:bg-[#3c4043] text-white text-[13.5px] font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span>Send Direct Email</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. MAIN 2-COLUMN ENQUIRY FORM & ENTERPRISE SLA SIDEBAR --- */}
      <section className="w-full py-6 sm:py-12 lg:py-16 px-3.5 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-start">
            {/* LEFT 7 COLUMNS: INTERACTIVE CAMPAIGN & SUPPORT ENQUIRY FORM */}
            <div className="lg:col-span-7 w-full">
              <div className="bg-white rounded-[22px] sm:rounded-[26px] border border-[#dadce0] shadow-[0_12px_36px_rgba(60,64,67,0.06)] overflow-hidden">
                <div className="grid grid-cols-4 h-[4px] w-full">
                  <div className="bg-[#4285F4]" />
                  <div className="bg-[#EA4335]" />
                  <div className="bg-[#FBBC04]" />
                  <div className="bg-[#34A853]" />
                </div>

                {isSubmitted ? (
                  <div className="p-6 sm:p-10 text-center">
                    <div className="w-16 h-16 rounded-full bg-[#e6f4ea] text-[#1e8e3e] flex items-center justify-center mx-auto mb-4">
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
                    <span className="inline-block text-[11.5px] font-semibold bg-[#e6f4ea] text-[#1e8e3e] px-3 py-1 rounded-full mb-2">
                      Enquiry Received
                    </span>
                    <h2 className="gw-font-display text-[24px] sm:text-[28px] font-medium text-[#202124] mb-2">
                      Thank you, {fullName}!
                    </h2>
                    <p className="gw-font-text text-[14px] sm:text-[15px] text-[#5f6368] max-w-[460px] mx-auto leading-[1.6] mb-6">
                      Our senior SEO specialist has received your{" "}
                      <strong className="text-[#202124]">{enquiryType}</strong>{" "}
                      request and will reach out to you via{" "}
                      <strong className="text-[#1a73e8]">
                        {contactHandle
                          ? `${contactPlatform} (${contactHandle})`
                          : email}
                      </strong>{" "}
                      shortly.
                    </p>

                    <div className="bg-[#f8f9fa] rounded-[16px] p-4 border border-[#e8eaed] max-w-[440px] mx-auto mb-6 text-left text-[13px] text-[#3c4043] space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-[#5f6368]">Enquiry Topic:</span>
                        <span className="font-semibold text-[#202124]">
                          {enquiryType}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5f6368]">
                          Estimated Volume:
                        </span>
                        <span className="font-semibold text-[#1a73e8]">
                          {volumeTier}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5f6368]">
                          Registered Email:
                        </span>
                        <span className="font-medium text-[#202124]">
                          {email}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsSubmitted(false);
                          setMessage("");
                        }}
                        className="gw-font-display w-full sm:w-auto px-6 h-[46px] rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-[14px] font-medium transition-colors cursor-pointer"
                      >
                        Send Another Message
                      </button>
                      <Link
                        to="/services"
                        className="gw-font-display w-full sm:w-auto px-6 h-[46px] rounded-full border border-[#dadce0] bg-white hover:bg-[#f8f9fa] text-[#202124] text-[14px] font-medium flex items-center justify-center"
                      >
                        Explore All Services →
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 sm:p-8">
                    <div className="mb-5 sm:mb-6">
                      <span className="text-[11.5px] font-semibold uppercase tracking-wider text-[#1a73e8] block mb-1">
                        Direct Campaign & Support Intake
                      </span>
                      <h2 className="gw-font-display text-[22px] sm:text-[26px] font-medium text-[#202124]">
                        Send us a message
                      </h2>
                      <p className="gw-font-text text-[13.5px] sm:text-[14px] text-[#5f6368] mt-0.5">
                        Select your enquiry topic below and our team will get
                        back to you via email and WhatsApp/Telegram.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Enquiry Topic Selector Pills */}
                      <div>
                        <label className="block text-[12.5px] sm:text-[13px] font-medium text-[#3c4043] mb-2">
                          What can we help you with? *
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {enquiryTypes.map((type) => {
                            const active = enquiryType === type;
                            return (
                              <button
                                key={type}
                                type="button"
                                onClick={() => setEnquiryType(type)}
                                className={`py-2.5 px-3.5 rounded-[12px] text-[12.5px] sm:text-[13px] font-medium border text-left transition-all flex items-center justify-between cursor-pointer ${
                                  active
                                    ? "bg-[#e8f0fe]/70 border-[#1a73e8] text-[#1a73e8] font-semibold shadow-xs"
                                    : "bg-[#f8f9fa] border-[#e8eaed] text-[#3c4043] hover:bg-[#f1f3f4]"
                                }`}
                              >
                                <span className="truncate">{type}</span>
                                <span
                                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                                    active
                                      ? "border-[#1a73e8] bg-[#1a73e8] text-white"
                                      : "border-[#bdc1c6] bg-white"
                                  }`}
                                >
                                  {active && (
                                    <svg
                                      className="w-2.5 h-2.5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      strokeWidth="3"
                                    >
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                  )}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Name & Email Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-[12.5px] sm:text-[13px] font-medium text-[#3c4043] mb-1.5">
                            Your Name / Agency Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="e.g. Alex Morgan / Apex SEO"
                            className="w-full px-3.5 py-2.5 bg-[#f8f9fa] focus:bg-white border border-[#dadce0] rounded-[12px] focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#e8f0fe] text-[14px] text-[#202124]"
                          />
                        </div>
                        <div>
                          <label className="block text-[12.5px] sm:text-[13px] font-medium text-[#3c4043] mb-1.5">
                            Business Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@agency.com"
                            className="w-full px-3.5 py-2.5 bg-[#f8f9fa] focus:bg-white border border-[#dadce0] rounded-[12px] focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#e8f0fe] text-[14px] text-[#202124]"
                          />
                        </div>
                      </div>

                      {/* WhatsApp / Telegram Instant Contact Box */}
                      <div className="p-3.5 rounded-[14px] bg-[#f8fbff] border border-[#d2e3fc]">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <label className="block text-[12.5px] sm:text-[13px] font-semibold text-[#1a73e8]">
                            Your WhatsApp or Telegram (For Faster Reply) *
                          </label>
                          <div className="inline-flex rounded-full bg-white p-0.5 border border-[#dadce0]">
                            {["WhatsApp", "Telegram"].map((platform) => (
                              <button
                                key={platform}
                                type="button"
                                onClick={() => setContactPlatform(platform)}
                                className={`px-3 py-1 rounded-full text-[11px] sm:text-[11.5px] font-medium transition-all cursor-pointer ${
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
                              ? "e.g. +61 400 000 000 (with country code)"
                              : "e.g. @yourusername"
                          }
                          className="w-full px-3.5 py-2.5 bg-white border border-[#dadce0] rounded-[10px] focus:outline-none focus:border-[#1a73e8] text-[14px] text-[#202124]"
                        />
                      </div>

                      {/* Estimated Link Volume & Target Website Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-[12.5px] sm:text-[13px] font-medium text-[#3c4043] mb-1.5">
                            Estimated Link Volume
                          </label>
                          <select
                            value={volumeTier}
                            onChange={(e) => setVolumeTier(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-[#f8f9fa] focus:bg-white border border-[#dadce0] rounded-[12px] focus:outline-none focus:border-[#1a73e8] text-[14px] text-[#202124]"
                          >
                            {volumeOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[12.5px] sm:text-[13px] font-medium text-[#3c4043] mb-1.5">
                            Target Website / Domain (Optional)
                          </label>
                          <input
                            type="text"
                            value={websiteUrl}
                            onChange={(e) => setWebsiteUrl(e.target.value)}
                            placeholder="https://yourclient.com"
                            className="w-full px-3.5 py-2.5 bg-[#f8f9fa] focus:bg-white border border-[#dadce0] rounded-[12px] focus:outline-none focus:border-[#1a73e8] text-[14px] text-[#202124]"
                          />
                        </div>
                      </div>

                      {/* Message / Campaign Brief */}
                      <div>
                        <label className="block text-[12.5px] sm:text-[13px] font-medium text-[#3c4043] mb-1.5">
                          Campaign Details / Message *
                        </label>
                        <textarea
                          rows="4"
                          required
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Tell us about your target market (.COM, .ID, or .EDU/.GOV), desired link volume, or custom drip-feed requirements..."
                          className="w-full px-3.5 py-2.5 bg-[#f8f9fa] focus:bg-white border border-[#dadce0] rounded-[12px] focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#e8f0fe] text-[14px] text-[#202124]"
                        />
                      </div>

                      {errorMessage && (
                        <div className="p-3 rounded-[12px] bg-[#fce8e6] border border-[#fad2cf] text-[#d93025] text-[12.5px] font-medium">
                          {errorMessage}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="gw-font-display w-full h-[50px] sm:h-[52px] rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-medium text-[15px] shadow-[0_6px_20px_rgba(26,115,232,0.25)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isSubmitting
                          ? "Dispatching Message..."
                          : "Send Enquiry to Our Team →"}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT 5 COLUMNS: SLA METRICS, WORKFLOW & CORPORATE INFO */}
            <div className="lg:col-span-5 w-full space-y-5">
              {/* Card 1: Response Time & SLA */}
              <div className="bg-white rounded-[22px] sm:rounded-[24px] border border-[#e8eaed] p-5 sm:p-7 shadow-[0_4px_20px_rgba(60,64,67,0.04)]">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e6f4ea] text-[#1e8e3e] text-[11.5px] font-semibold mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#34a853] animate-pulse" />
                  Enterprise Support SLA
                </div>

                <h2 className="gw-font-display text-[20px] sm:text-[22px] font-medium text-[#202124] mb-2">
                  What happens after you reach out?
                </h2>
                <p className="gw-font-text text-[13.5px] text-[#5f6368] leading-[1.6] mb-5">
                  Every enquiry is routed directly to a technical SEO campaign
                  manager—never a generic call centre.
                </p>

                <div className="space-y-4">
                  {[
                    {
                      step: "01",
                      title: "Instant Ticket & Messenger Ping",
                      desc: "You receive an immediate email confirmation and a direct ping on your WhatsApp or Telegram handle.",
                      color: "bg-[#e8f0fe] text-[#1a73e8]",
                    },
                    {
                      step: "02",
                      title: "Custom Inventory & Anchor Review",
                      desc: "We audit your target URLs, recommend optimal DA/DR 50+ placements, and structure a safe drip-feed schedule.",
                      color: "bg-[#fef7e0] text-[#f29900]",
                    },
                    {
                      step: "03",
                      title: "White-Label Execution",
                      desc: "Launch your campaign via our self-serve calculator or custom agency invoice with live tracking.",
                      color: "bg-[#e6f4ea] text-[#1e8e3e]",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3.5 p-3.5 rounded-[16px] bg-[#f8f9fa] border border-[#e8eaed]"
                    >
                      <span
                        className={`gw-font-display text-[12px] font-bold px-2.5 py-1 rounded-full shrink-0 ${item.color}`}
                      >
                        {item.step}
                      </span>
                      <div>
                        <h2 className="gw-font-display text-[14.5px] font-medium text-[#202124]">
                          {item.title}
                        </h2>
                        <p className="text-[12.5px] text-[#5f6368] leading-[1.5] mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 2: Corporate & Brand Infrastructure Info */}
              <div className="bg-white rounded-[22px] sm:rounded-[24px] border border-[#e8eaed] p-5 sm:p-7 shadow-[0_4px_20px_rgba(60,64,67,0.04)]">
                <h2 className="gw-font-display text-[18px] sm:text-[19px] font-medium text-[#202124] mb-3">
                  Corporate & Network Operations
                </h2>

                <div className="space-y-3 text-[13px] text-[#3c4043]">
                  <div className="flex justify-between items-center py-2 border-b border-[#f1f3f4]">
                    <span className="text-[#5f6368]">Operating Brand</span>
                    <span className="font-semibold text-[#202124]">
                      Jasa Backlinks
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[#f1f3f4]">
                    <span className="text-[#5f6368]">Parent Organisation</span>
                    <span className="font-semibold text-[#1a73e8]">
                      SeoHub Ltd
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[#f1f3f4]">
                    <span className="text-[#5f6368]">Support Hours</span>
                    <span className="font-semibold text-[#1e8e3e]">
                      Mon – Sun (24/7 Desk)
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-[#5f6368]">Payment Gateways</span>
                    <span className="font-medium text-[#202124]">
                      Stripe • PayPal • BoomFi Crypto
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#e8eaed]">
                  <Link
                    to="/#estimator"
                    className="gw-font-display w-full h-[44px] rounded-full bg-[#f8fbff] hover:bg-[#e8f0fe] border border-[#d2e3fc] text-[#1a73e8] text-[13.5px] font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Want instant pricing? Open Calculator →</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 4. PRE-SALES & SUPPORT FAQ SECTION --- */}
      <section className="w-full bg-white py-12 sm:py-18 px-4 sm:px-6 border-t border-[#e8eaed]">
        <div className="max-w-[880px] mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f8f9fa] border border-[#e8eaed] text-[#5f6368] text-[12px] font-medium mb-3">
              Support & Pre-Sales Questions
            </div>
            <h2 className="gw-font-display text-[24px] sm:text-[34px] font-medium text-[#202124]">
              Frequently asked{" "}
              <span className="text-[#1a73e8]">questions.</span>
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const open = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-[18px] border transition-all ${
                    open
                      ? "bg-[#f8fbff] border-[#d2e3fc]"
                      : "bg-white border-[#e8eaed]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? -1 : idx)}
                    className="w-full px-5 py-4 sm:px-6 sm:py-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="gw-font-display text-[15px] sm:text-[16.5px] font-medium text-[#202124]">
                      {faq.q}
                    </span>
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                        open
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
                  {open && (
                    <div className="px-5 pb-4 sm:px-6 sm:pb-5 text-[13.5px] sm:text-[14.5px] text-[#5f6368] leading-[1.65]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
