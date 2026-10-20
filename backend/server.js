require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");
const crypto = require("crypto");

// IMPORTING OUR PREMIUM TEMPLATES
const {
  getClientEmailHtml,
  getAdminEmailHtml,
  getContactAdminHtml,
  getContactClientHtml,
} = require("./templates/emailTemplates");

const stripe = process.env.STRIPE_SECRET_KEY
  ? require("stripe")(process.env.STRIPE_SECRET_KEY)
  : null;

const app = express();
app.use(cors());
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// MONGODB CONNECTION & SCHEMAS
const dbURI =
  process.env.MONGODB_URI ||
  "mongodb+srv://rafayoutreach_db_user:KEkvLMCSt71UokgN@cluster0.9plzeku.mongodb.net/jasabacklinks?retryWrites=true&w=majority";

const Order = mongoose.model(
  "Order",
  new mongoose.Schema(
    {
      id: { type: String, required: true },
      transactionId: { type: String, required: true },
      paymentMethod: { type: String, required: true },
      totalAmount: { type: Number, required: true },
      totalLinks: { type: Number, required: true },
      packages: {
        type: [
          new mongoose.Schema(
            {
              id: String,
              name: String,
              qty: Number,
              price: Number,
              subtotal: Number,
              isGuestPost: Boolean,
            },
            { strict: false }
          ),
        ],
        default: [],
      },
      customer: new mongoose.Schema(
        {
          fullName: String,
          email: String,
          contactPlatform: String,
          contactHandle: String,
          targetUrls: String,
          anchorTexts: String,
          notes: String,
        },
        { strict: false }
      ),
      createdAt: { type: Date, default: Date.now },
    },
    { strict: false }
  )
);

const Enquiry = mongoose.model(
  "Enquiry",
  new mongoose.Schema(
    {
      id: String,
      enquiryType: String,
      fullName: String,
      email: String,
      contactPlatform: String,
      contactHandle: String,
      volumeTier: String,
      websiteUrl: String,
      message: String,
      createdAt: Date,
    },
    { strict: false }
  )
);

const Blog = mongoose.model(
  "Blog",
  new mongoose.Schema(
    {
      id: String,
      title: String,
      seoTitle: String,
      slug: String,
      focusKeyword: String,
      category: String,
      readTime: String,
      author: String,
      authorRole: String,
      publishedAt: String,
      status: String,
      featured: Boolean,
      seoScore: Number,
      tags: [String],
      image: String,
      imageAlt: String,
      excerpt: String,
      content: String,
    },
    { strict: false }
  )
);

const Category = mongoose.model(
  "Category",
  new mongoose.Schema(
    {
      id: String,
      name: String,
      color: String,
    },
    { strict: false }
  )
);

const Media = mongoose.model(
  "Media",
  new mongoose.Schema(
    {
      id: String,
      name: String,
      alt: String,
      url: String,
      uploadedAt: String,
    },
    { strict: false }
  )
);

const DEFAULT_CATEGORIES = [
  { id: "cat-1", name: "PBN Strategy", color: "blue" },
  { id: "cat-2", name: "Regional .ID SEO", color: "red" },
  { id: "cat-3", name: "EDU & GOV Authority", color: "purple" },
  { id: "cat-4", name: "Case Studies", color: "green" },
];

const DEFAULT_MEDIA = [];
const DEFAULT_BLOGS = [];

mongoose
  .connect(dbURI)
  .then(async () => {
    console.log("✅ MongoDB Connected Successfully");
    try {
      const count = await Category.countDocuments();
      if (count === 0) {
        await Category.insertMany(DEFAULT_CATEGORIES);
      }
    } catch (seedErr) {
      console.warn("Category seed warning:", seedErr.message);
    }
  })
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

const PAYPAL_API_BASE =
  process.env.PAYPAL_BASE_URL ||
  process.env.PAYPAL_API_BASE ||
  "https://api-m.sandbox.paypal.com";

// BULLETPROOF HTTP EMAIL GATEWAY (NO SMTP NEEDED)
const sendMailOverAPI = async ({ from, to, replyTo, subject, html }) => {
  const apiKey = (
    process.env.RESEND_API_KEY ||
    process.env.SMTP_PASS ||
    ""
  ).trim();
  if (!apiKey) throw new Error("Missing RESEND_API_KEY in .env file.");

  const payload = {
    from,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
  };

  if (replyTo) payload.reply_to = replyTo;

  try {
    const response = await axios.post("https://api.resend.com/emails", payload, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Resend API Delivery Error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to send email via API"
    );
  }
};

// Live API Diagnostic Route for Testing
app.get("/api/verify-smtp", (req, res) => {
  const apiKey = (
    process.env.RESEND_API_KEY ||
    process.env.SMTP_PASS ||
    ""
  ).trim();
  if (!apiKey) {
    return res.status(503).json({
      connected: false,
      error: "Missing RESEND_API_KEY in your backend .env file.",
    });
  }
  return res.json({
    connected: true,
    message: "HTTP Email API Gateway is authenticated and ready to dispatch!",
  });
});

// Email Testing Route
app.get("/api/send-test-emails", async (req, res) => {
  try {
    const senderEmail = (
      process.env.SENDER_EMAIL || "hello@jasabacklinks.net"
    ).trim();
    const myEmailAddress = (process.env.ADMIN_EMAIL || senderEmail).trim();

    const dummyCustomer = {
      fullName: "Test Agency Profile",
      email: myEmailAddress,
      contactPlatform: "Telegram",
      contactHandle: "@test_agency_handle",
      targetUrls: "https://example.com/page1",
      anchorTexts: "best seo service",
      notes: "Drip feed over 14 days please.",
    };

    const dummyPackages = [{ name: "Homepage Post", qty: 1000, subtotal: 100 }];

    const clientHtml = getClientEmailHtml({
      customer: dummyCustomer,
      transactionId: "TXN-TEST-987654",
      paymentMethod: "Stripe Card",
      totalLinks: 1000,
      totalAmount: 100.0,
      packages: dummyPackages,
    });

    const adminHtml = getAdminEmailHtml({
      customer: dummyCustomer,
      transactionId: "TXN-TEST-987654",
      paymentMethod: "Stripe Card",
      totalLinks: 1000,
      totalAmount: 100.0,
      packages: dummyPackages,
    });

    await Promise.all([
      sendMailOverAPI({
        from: `"Jasa Backlinks" <${senderEmail}>`,
        to: myEmailAddress,
        subject: `[TEST] Payment Receipt #TXN-TEST - Jasa Backlinks`,
        html: clientHtml,
      }),
      sendMailOverAPI({
        from: `"Jasa Orders" <${senderEmail}>`,
        to: myEmailAddress,
        subject: `[TEST] NEW ORDER: $100.00 from ${dummyCustomer.fullName}`,
        html: adminHtml,
      }),
    ]);

    res.send(
      `<h3 style="color: green;">Success! Test emails sent via HTTP API to <b>${myEmailAddress}</b>.</h3>`
    );
  } catch (error) {
    console.error("Test Email Delivery Error:", error);
    res.send(
      `<h3 style="color: red;">Failed to send emails via API: <br><br> ${error.message}</h3>`
    );
  }
});

const SERVICES = {
  hp_post: { name: "Homepage Post", price: 1.0 },
  sidebar: { name: "Sidebar Blogroll", price: 2.0 },
  sticky: { name: "Homepage Sticky Post", price: 2.0 },
  id_hp_post: { name: ".ID Homepage Post", price: 2.0 },
  id_sidebar: { name: ".ID Sidebar Blogroll", price: 3.0 },
  id_sticky: { name: ".ID Sticky Post", price: 2.5 },
  hidden_links: { name: "Hidden Links (AC.ID, SCH.ID, GO.ID)", price: 20.0 },
  edu_post: { name: "EDU PBN Blogpost", price: 3.0 },
  edu_sidebar: { name: "EDU PBN Blogroll", price: 5.0 },
  complete_seo: { name: "Complete SEO Package", price: 5.0 },
  rank_first_page: { name: "Rank on First Page Campaign", price: 8.0 },
  custom_seo: { name: "Custom SEO Solutions", price: 4.0 },
};

const calculateSecureTotal = (cart = {}) => {
  let total = 0;
  for (const [id, qty] of Object.entries(cart)) {
    const parsedQty = parseInt(qty, 10);
    if (SERVICES[id] && parsedQty > 0) {
      total += SERVICES[id].price * parsedQty;
    }
  }
  return total;
};

const getPricedCart = (cart = {}) =>
  Object.fromEntries(
    Object.entries(cart)
      .filter(([id, qty]) => SERVICES[id] && parseInt(qty, 10) > 0)
      .map(([id, qty]) => [id, parseInt(qty, 10)])
  );

const hasUnpricedGuestPostingItems = (cart = {}) =>
  Object.keys(cart || {}).some((id) => id.startsWith("guestpost_"));

const PAYMENT_SESSION_TTL_MS = 24 * 60 * 60 * 1000;
const paymentSessions = new Map();

const prunePaymentSessions = () => {
  const expiresBefore = Date.now() - PAYMENT_SESSION_TTL_MS;
  for (const [transactionId, session] of paymentSessions) {
    if (session.createdAt < expiresBefore) {
      paymentSessions.delete(transactionId);
    }
  }
};

// 1. STRIPE API
app.post("/api/create-stripe-intent", async (req, res) => {
  try {
    if (!stripe)
      return res.status(500).json({ error: "STRIPE_SECRET_KEY missing." });
    const { cart } = req.body;
    if (hasUnpricedGuestPostingItems(cart)) {
      return res.status(503).json({
        error:
          "Guest Posting checkout is unavailable until final rates are configured.",
      });
    }
    const totalAmount = calculateSecureTotal(cart);
    if (totalAmount <= 0)
      return res.status(400).json({ error: "Invalid cart total." });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });
    prunePaymentSessions();
    paymentSessions.set(paymentIntent.id, {
      method: "Credit / Debit Card",
      status: "pending",
      amount: paymentIntent.amount,
      cart: getPricedCart(cart),
      createdAt: Date.now(),
    });
    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      total: totalAmount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. PAYPAL API
async function getPayPalAccessToken() {
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET)
    throw new Error("PayPal keys missing");
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");
  const response = await axios.post(
    `${PAYPAL_API_BASE}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return response.data.access_token;
}

app.post("/api/create-paypal-order", async (req, res) => {
  try {
    const { cart } = req.body;
    if (hasUnpricedGuestPostingItems(cart)) {
      return res.status(503).json({
        error:
          "Guest Posting checkout is unavailable until final rates are configured.",
      });
    }
    const totalAmount = calculateSecureTotal(cart);
    if (totalAmount <= 0)
      return res.status(400).json({ error: "Invalid total." });

    const accessToken = await getPayPalAccessToken();
    const response = await axios.post(
      `${PAYPAL_API_BASE}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: totalAmount.toFixed(2),
            },
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.data?.id) {
      return res.status(502).json({ error: "PayPal returned no order ID." });
    }
    prunePaymentSessions();
    paymentSessions.set(response.data.id, {
      method: "PayPal Checkout",
      status: "pending",
      amount: Math.round(totalAmount * 100),
      cart: getPricedCart(cart),
      createdAt: Date.now(),
    });
    res.json({ id: response.data.id, total: totalAmount });
  } catch (error) {
    res.status(500).json({ error: "Failed to create PayPal order." });
  }
});

app.post("/api/capture-paypal-order", async (req, res) => {
  try {
    const { orderID } = req.body;
    prunePaymentSessions();
    const orderSession = paymentSessions.get(orderID);
    if (
      !orderSession ||
      orderSession.method !== "PayPal Checkout" ||
      orderSession.status !== "pending"
    ) {
      return res.status(400).json({ error: "Unknown or expired PayPal order." });
    }

    const accessToken = await getPayPalAccessToken();
    const response = await axios.post(
      `${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    const result = response.data;
    const capture = result.purchase_units?.[0]?.payments?.captures?.[0];
    if (
      result.status !== "COMPLETED" ||
      capture?.status !== "COMPLETED" ||
      capture.amount?.currency_code !== "USD" ||
      Math.round(Number(capture.amount?.value) * 100) !== orderSession.amount
    ) {
      return res
        .status(402)
        .json({ error: "PayPal payment is not completed." });
    }

    orderSession.status = "captured";
    paymentSessions.set(capture.id, {
      ...orderSession,
      status: "completed",
      createdAt: Date.now(),
    });
    res.json({ status: result.status, captureId: capture.id });
  } catch (error) {
    res.status(500).json({ error: "Failed to capture PayPal order." });
  }
});

// 3. BOOMFI CRYPTO API (SAME-TAB AUTO REDIRECT)
app.post("/api/create-boomfi-charge", async (req, res) => {
  try {
    const { cart, originUrl } = req.body;
    if (hasUnpricedGuestPostingItems(cart)) {
      return res.status(503).json({
        error:
          "Guest Posting checkout is unavailable until final rates are configured.",
      });
    }

    const totalAmount = calculateSecureTotal(cart);
    if (totalAmount <= 0) {
      return res.status(400).json({ error: "Invalid cart total." });
    }

    if (!process.env.BOOMFI_API_KEY) {
      return res
        .status(500)
        .json({ error: "BOOMFI_API_KEY is missing in .env file." });
    }

    const boomfiBaseUrl =
      process.env.BOOMFI_API_BASE || "https://mapi.boomfi.xyz/v1";
    const txReference = `BF-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    const planName = `Jasa Backlinks SEO Campaign (${txReference})`;

    const frontendBase = (
      originUrl ||
      req.headers.origin ||
      process.env.FRONTEND_URL ||
      "https://www.jasabacklinks.net"
    ).replace(/\/$/, "");

    const returnUrl = `${frontendBase}/?boomfi_status=success&tx=${txReference}`;
    const failureUrl = `${frontendBase}/?boomfi_status=failed`;

    const response = await axios.post(
      `${boomfiBaseUrl}/paylinks`,
      {
        name: planName,
        description: `Bulk Link Placement Order ($${totalAmount.toFixed(2)} USD)`,
        amount: totalAmount.toFixed(2),
        currency: "USD",
        type: "OneTime",
        after_completion: {
          type: "redirect",
          redirect_url: returnUrl,
          failure_redirect_url: failureUrl,
        },
      },
      {
        headers: {
          "X-API-KEY": process.env.BOOMFI_API_KEY.trim(),
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    const payload = response.data?.data || response.data || {};
    const paylinkId = payload.id || payload.paylink_id || payload.link_id;
    const rawCheckoutUrl =
      payload.url ||
      payload.payment_link ||
      payload.checkout_url ||
      (paylinkId ? `https://pay.boomfi.xyz/${paylinkId}` : null);

    if (!rawCheckoutUrl) {
      return res
        .status(500)
        .json({ error: "BoomFi did not return a valid checkout URL." });
    }

    prunePaymentSessions();
    paymentSessions.set(txReference, {
      method: "BoomFi Crypto Gateway",
      status: "issued",
      amount: Math.round(totalAmount * 100),
      cart: getPricedCart(cart),
      createdAt: Date.now(),
    });

    return res.json({
      checkoutUrl: rawCheckoutUrl,
      total: totalAmount,
      transactionId: txReference,
      returnUrl,
    });
  } catch (error) {
    console.error("BoomFi API Error:", error.response?.data || error.message);
    return res
      .status(500)
      .json({ error: "Failed to initialise BoomFi Crypto Gateway." });
  }
});

// 4. SUBMIT ORDER & SEND PREMIUM EMAILS
app.post("/api/submit-order", async (req, res) => {
  try {
    const {
      transactionId,
      totalAmount,
      totalLinks,
      packages,
      customer,
    } = req.body;

    if (!customer?.email || !customer?.targetUrls) {
      return res
        .status(400)
        .json({ error: "Customer email and target URLs are required." });
    }

    prunePaymentSessions();
    const session = paymentSessions.get(transactionId);
    if (!session || session.status === "consumed") {
      return res.status(402).json({
        success: false,
        error: "Payment transaction is unknown, expired, or already used.",
      });
    }
    if (Math.round(Number(totalAmount) * 100) !== session.amount) {
      return res.status(402).json({
        success: false,
        error: "Submitted order total does not match the payment.",
      });
    }
    if (!Array.isArray(packages) || packages.length !== Object.keys(session.cart).length) {
      return res.status(400).json({
        success: false,
        error: "Submitted packages do not match the payment.",
      });
    }
    const submittedCart = new Map();
    for (const item of packages) {
      if (
        !item?.id ||
        submittedCart.has(item.id) ||
        !Number.isInteger(Number(item.qty)) ||
        Number(item.qty) <= 0
      ) {
        return res.status(400).json({
          success: false,
          error: "Submitted packages do not match the payment.",
        });
      }
      submittedCart.set(item.id, Number(item.qty));
    }
    const expectedEntries = Object.entries(session.cart);
    if (
      expectedEntries.some(([id, qty]) => submittedCart.get(id) !== qty) ||
      Number(totalLinks) !== expectedEntries.reduce((sum, [, qty]) => sum + qty, 0)
    ) {
      return res.status(400).json({
        success: false,
        error: "Submitted packages do not match the payment.",
      });
    }

    const verifiedPackages = expectedEntries.map(([id, qty]) => ({
      id,
      name: SERVICES[id].name,
      qty,
      price: SERVICES[id].price,
      subtotal: SERVICES[id].price * qty,
    }));
    const verifiedPaymentMethod = session.method;

    if (session.method === "Credit / Debit Card") {
      if (!stripe || !transactionId.startsWith("pi_")) {
        return res.status(402).json({
          success: false,
          error: "Stripe payment cannot be verified.",
        });
      }
      const paymentIntent = await stripe.paymentIntents.retrieve(transactionId);
      if (
        paymentIntent.status !== "succeeded" ||
        paymentIntent.amount !== session.amount
      ) {
        return res.status(402).json({
          success: false,
          error: "Stripe payment is not completed.",
        });
      }
    } else if (session.status !== "completed" && session.method !== "BoomFi Crypto Gateway") {
      return res.status(402).json({
        success: false,
        error: "Payment is not completed.",
      });
    }

    try {
      await Order.create({
        id: `ord-${Date.now()}`,
        transactionId,
        paymentMethod: verifiedPaymentMethod,
        totalAmount,
        totalLinks,
        packages: verifiedPackages,
        customer,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Could not save order to MongoDB:", error);
      return res.status(503).json({
        success: false,
        error: "Database error: could not save record.",
      });
    }
    session.status = "consumed";

    const senderEmail = (
      process.env.SENDER_EMAIL || "hello@jasabacklinks.net"
    ).trim();
    const adminEmail = (process.env.ADMIN_EMAIL || senderEmail).trim();

    const clientHtml = getClientEmailHtml({
      customer,
      transactionId,
      paymentMethod: verifiedPaymentMethod,
      totalLinks,
      totalAmount,
      packages: verifiedPackages,
    });
    const adminHtml = getAdminEmailHtml({
      customer,
      transactionId,
      paymentMethod: verifiedPaymentMethod,
      totalLinks,
      totalAmount,
      packages: verifiedPackages,
    });

    const emailResults = await Promise.allSettled([
      sendMailOverAPI({
        from: `"Jasa Backlinks" <${senderEmail}>`,
        to: customer.email,
        subject: `Payment Receipt #${String(transactionId || "ORDER").slice(-8)} - Jasa Backlinks`,
        html: clientHtml,
      }),
      sendMailOverAPI({
        from: `"Jasa Orders" <${senderEmail}>`,
        to: adminEmail,
        subject: `NEW ORDER: $${Number(totalAmount).toFixed(2)} from ${customer.fullName}`,
        html: adminHtml,
      }),
    ]);

    emailResults.forEach((result, idx) => {
      if (result.status === "rejected") {
        console.error(
          `ORDER MAIL ERROR [${idx === 0 ? "Client" : "Admin"}]:`,
          result.reason
        );
      }
    });

    res.json({ success: true, message: "Order recorded securely." });
  } catch (error) {
    console.error("Order Submit Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. CONTACT US ENQUIRY EMAIL ROUTE
app.post("/api/contact", async (req, res) => {
  try {
    const {
      enquiryType,
      fullName,
      email,
      contactPlatform,
      contactHandle,
      volumeTier,
      websiteUrl,
      message,
    } = req.body || {};

    if (!email || !message) {
      return res.status(400).json({ error: "Email and message are required." });
    }

    try {
      await Enquiry.create({
        id: `enq-${Date.now()}`,
        enquiryType: enquiryType || "General",
        fullName: fullName || "",
        email,
        contactPlatform: contactPlatform || "WhatsApp",
        contactHandle: contactHandle || "",
        volumeTier: volumeTier || "",
        websiteUrl: websiteUrl || "",
        message,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Could not save enquiry to MongoDB:", error);
      return res.status(503).json({
        success: false,
        error: "Database error: could not save record.",
      });
    }

    const senderEmail = (
      process.env.SENDER_EMAIL || "hello@jasabacklinks.net"
    ).trim();
    const adminEmail = (
      process.env.ADMIN_EMAIL || "hello@jasabacklinks.net"
    ).trim();

    const escapeHtml = (value = "") =>
      String(value).replace(
        /[&<>"']/g,
        (c) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
          })[c]
      );

    const escapedName = escapeHtml(fullName || "there");
    const escapedEnquiryType = escapeHtml(enquiryType || "General Enquiry");
    const escapedMessage = escapeHtml(message).replace(/\r?\n/g, "<br>");

    const adminContactHtml = getContactAdminHtml({
      enquiryType: escapedEnquiryType,
      fullName: escapedName,
      email: escapeHtml(email),
      contactPlatform: escapeHtml(contactPlatform),
      contactHandle: escapeHtml(contactHandle),
      volumeTier: escapeHtml(volumeTier),
      websiteUrl: escapeHtml(websiteUrl),
      message: escapedMessage,
    });

    const clientContactHtml = getContactClientHtml({
      fullName: escapedName,
      message: escapedMessage,
    });

    const emailResults = await Promise.allSettled([
      sendMailOverAPI({
        from: `"Jasa Backlinks Desk" <${senderEmail}>`,
        to: adminEmail,
        replyTo: email.trim(),
        subject: `[${escapedEnquiryType}] New Enquiry from ${escapedName}`,
        html: adminContactHtml,
      }),
      sendMailOverAPI({
        from: `"Jasa Backlinks" <${senderEmail}>`,
        to: email.trim(),
        replyTo: adminEmail,
        subject: "We've received your enquiry - Jasa Backlinks",
        html: clientContactHtml,
      }),
    ]);

    emailResults.forEach((result, idx) => {
      if (result.status === "rejected") {
        console.error(
          `CONTACT MAIL ERROR [${idx === 0 ? "Admin" : "Client"}]:`,
          result.reason
        );
      }
    });

    res.json({
      success: true,
      confirmationSent: emailResults[1].status === "fulfilled",
    });
  } catch (error) {
    console.error("Contact Form Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. BULLETPROOF ADMIN AUTH, BLOGS, CATEGORIES & MEDIA API
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "SeoHubAdmin2026";

const LOGIN_ATTEMPTS = new Map();
const ACTIVE_SESSIONS = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

function getClientIp(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "unknown-ip"
  );
}

function timingSafeCompare(a, b) {
  const bufA = Buffer.from(String(a || ""));
  const bufB = Buffer.from(String(b || ""));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function verifyAdminAuth(req, res, next) {
  const authHeader = req.headers["authorization"] || "";
  const bearerToken = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : req.headers["x-admin-token"];

  if (!bearerToken || !ACTIVE_SESSIONS.has(bearerToken)) {
    return res.status(401).json({
      error: "Unauthorised: Session expired or invalid security token.",
    });
  }

  const session = ACTIVE_SESSIONS.get(bearerToken);
  if (Date.now() > session.expiresAt) {
    ACTIVE_SESSIONS.delete(bearerToken);
    return res.status(401).json({
      error: "Unauthorised: Admin session has expired. Please log in again.",
    });
  }

  next();
}

app.post("/api/admin/login", (req, res) => {
  const ip = getClientIp(req);
  const now = Date.now();
  const record = LOGIN_ATTEMPTS.get(ip) || { count: 0, lockUntil: 0 };

  if (record.lockUntil > now) {
    const remainingSeconds = Math.ceil((record.lockUntil - now) / 1000);
    return res.status(429).json({
      error: `Too many failed login attempts. IP locked for ${Math.ceil(
        remainingSeconds / 60
      )} minute(s).`,
      lockedUntil: record.lockUntil,
      remainingSeconds,
    });
  }

  const { password } = req.body;
  if (!timingSafeCompare(password, ADMIN_PASSWORD)) {
    const nextCount = record.count + 1;
    const isNowLocked = nextCount >= MAX_LOGIN_ATTEMPTS;
    const lockUntil = isNowLocked ? now + LOCKOUT_DURATION_MS : 0;

    LOGIN_ATTEMPTS.set(ip, {
      count: isNowLocked ? 0 : nextCount,
      lockUntil,
    });

    const attemptsLeft = Math.max(0, MAX_LOGIN_ATTEMPTS - nextCount);
    return res.status(401).json({
      error: isNowLocked
        ? "Maximum 5 failed attempts reached. Your IP is locked for 15 minutes."
        : `Invalid Admin Password. ${attemptsLeft} attempt(s) remaining before 15-minute lockout.`,
      attemptsLeft,
      lockedUntil: lockUntil || null,
    });
  }

  LOGIN_ATTEMPTS.delete(ip);
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = now + SESSION_TTL_MS;
  ACTIVE_SESSIONS.set(token, { createdAt: now, expiresAt, ip });

  return res.json({
    success: true,
    token,
    expiresAt,
  });
});

app.post("/api/admin/logout", verifyAdminAuth, (req, res) => {
  const authHeader = req.headers["authorization"] || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : req.headers["x-admin-token"];
  if (token) ACTIVE_SESSIONS.delete(token);
  res.json({ success: true });
});

app.get("/api/admin/verify", verifyAdminAuth, (req, res) => {
  res.json({ valid: true });
});

// CATEGORIES ROUTES (MONGODB)
app.get("/api/categories", async (req, res) => {
  try {
    const cats = await Category.find({}, { _id: 0, __v: 0 }).lean();
    res.json(cats.length ? cats : DEFAULT_CATEGORIES);
  } catch (err) {
    res.json(DEFAULT_CATEGORIES);
  }
});

app.post("/api/categories", verifyAdminAuth, async (req, res) => {
  try {
    const { name, color } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Category name is required." });
    }
    const existingCats = await Category.find({}, { _id: 0, __v: 0 }).lean();
    const exists = existingCats.some(
      (c) => c.name?.toLowerCase() === name.trim().toLowerCase()
    );
    if (exists) {
      return res.status(400).json({ error: "Category already exists." });
    }

    const newCat = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
      color: color || "blue",
    };
    await Category.create(newCat);
    const categories = await Category.find({}, { _id: 0, __v: 0 }).lean();
    res.json({ success: true, categories, category: newCat });
  } catch (err) {
    res.status(500).json({ error: "Failed to create category." });
  }
});

app.delete("/api/categories/:id", verifyAdminAuth, async (req, res) => {
  try {
    await Category.deleteOne({
      $or: [{ id: req.params.id }, { name: req.params.id }],
    });
    const categories = await Category.find({}, { _id: 0, __v: 0 }).lean();
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete category." });
  }
});

// MEDIA ROUTES (MONGODB)
app.get("/api/media", verifyAdminAuth, async (req, res) => {
  try {
    const media = await Media.find({}, { _id: 0, __v: 0 })
      .sort({ _id: -1 })
      .lean();
    res.json(media);
  } catch (err) {
    res.json(DEFAULT_MEDIA);
  }
});

app.post("/api/media", verifyAdminAuth, async (req, res) => {
  try {
    const { name, alt, url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "Image data or URL is required." });
    }
    const newItem = {
      id: `media-${Date.now()}`,
      name: name || "Uploaded Image",
      alt: alt || name || "Jasa Backlinks SEO Image",
      url,
      uploadedAt: new Date().toISOString().split("T")[0],
    };
    await Media.create(newItem);
    const media = await Media.find({}, { _id: 0, __v: 0 })
      .sort({ _id: -1 })
      .lean();
    res.json({ success: true, item: newItem, media });
  } catch (err) {
    res.status(500).json({ error: "Failed to save media." });
  }
});

app.delete("/api/media/:id", verifyAdminAuth, async (req, res) => {
  try {
    await Media.deleteOne({ id: req.params.id });
    const media = await Media.find({}, { _id: 0, __v: 0 })
      .sort({ _id: -1 })
      .lean();
    res.json({ success: true, media });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete media." });
  }
});

// BLOGS ROUTES (MONGODB)
app.get("/api/blogs", async (req, res) => {
  try {
    const allBlogs = await Blog.find({}, { _id: 0, __v: 0 })
      .sort({ _id: -1 })
      .lean();
    const authHeader = req.headers["authorization"] || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : req.headers["x-admin-token"];
    const isAdmin = token && ACTIVE_SESSIONS.has(token);

    const visible = isAdmin
      ? allBlogs
      : allBlogs.filter((b) => b.status !== "draft");
    res.json(visible);
  } catch (err) {
    res.json(DEFAULT_BLOGS);
  }
});

app.get("/api/blogs/:slug", async (req, res) => {
  try {
    const allBlogs = await Blog.find({}, { _id: 0, __v: 0 }).lean();
    const blog = allBlogs.find(
      (b) => b.slug?.toLowerCase() === req.params.slug.toLowerCase()
    );
    if (!blog) return res.status(404).json({ error: "Article not found." });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch article." });
  }
});

app.post("/api/blogs", verifyAdminAuth, async (req, res) => {
  try {
    const {
      title,
      seoTitle,
      slug,
      focusKeyword,
      category,
      readTime,
      author,
      authorRole,
      image,
      imageAlt,
      excerpt,
      content,
      tags,
      status,
      featured,
      seoScore,
    } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ error: "Title and content are required." });
    }

    const cleanSlug =
      (slug || title)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || `post-${Date.now()}`;

    const newPost = {
      id: `blog-${Date.now()}`,
      title,
      seoTitle: seoTitle || title,
      slug: cleanSlug,
      focusKeyword: focusKeyword || "",
      category: category || "PBN Strategy",
      readTime: readTime || "5 min read",
      author: author || "SeoHub Editorial Team",
      authorRole: authorRole || "Senior SEO Strategist",
      publishedAt: new Date().toISOString().split("T")[0],
      status: status || "published",
      featured: Boolean(featured),
      seoScore: Number(seoScore) || 85,
      tags: Array.isArray(tags) ? tags : [],
      image: image || "",
      imageAlt: imageAlt || focusKeyword || title,
      excerpt: excerpt || content.replace(/<[^>]+>/g, "").slice(0, 155) + "...",
      content,
    };

    if (newPost.featured) {
      await Blog.updateMany({}, { $set: { featured: false } });
    }

    await Blog.create(newPost);
    res.json({ success: true, post: newPost });
  } catch (err) {
    res.status(500).json({ error: "Failed to publish blog post." });
  }
});

app.put("/api/blogs/:id", verifyAdminAuth, async (req, res) => {
  try {
    const existing = await Blog.findOne(
      { id: req.params.id },
      { _id: 0, __v: 0 }
    ).lean();
    if (!existing) return res.status(404).json({ error: "Post not found." });

    const updated = {
      ...existing,
      ...req.body,
    };

    if (updated.featured) {
      await Blog.updateMany({}, { $set: { featured: false } });
      updated.featured = true;
    }

    await Blog.updateOne({ id: req.params.id }, { $set: updated });
    res.json({ success: true, post: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update blog post." });
  }
});

app.delete("/api/blogs/:id", verifyAdminAuth, async (req, res) => {
  try {
    await Blog.deleteOne({ id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete blog post." });
  }
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Enterprise Backend running on port ${PORT}`);
});

server.on("error", (err) => {
  console.error("Server Port Error:", err);
});

process.on("exit", (code) => {
  console.log(`Terminal closed automatically with exit code: ${code}`);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception (Silent Crash):", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection (Silent Crash):", reason);
});

module.exports = app;