const express = require("express");
const cors = require("cors");
const axios = require("axios");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
require("dotenv").config();


// IMPORTING OUR PREMIUM TEMPLATES
const { getClientEmailHtml, getAdminEmailHtml } = require("./templates/emailTemplates");

const stripe = process.env.STRIPE_SECRET_KEY ? require("stripe")(process.env.STRIPE_SECRET_KEY) : null;

const app = express();
app.use(cors());
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Adapting to your .env variable name for PayPal
const PAYPAL_API_BASE = process.env.PAYPAL_BASE_URL || process.env.PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com";

// SECURE SERVER-SIDE PRICING CATALOG
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

const hasUnpricedGuestPostingItems = (cart = {}) =>
  Object.keys(cart || {}).some((id) => id.startsWith("guestpost_"));

// ==========================================
// 🧪 EMAIL TEMPLATE TESTING ROUTES
// ==========================================

// This route actually SENDS the emails to your inbox for live testing
app.get("/api/send-test-emails", async (req, res) => {
  try {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return res.status(503).send("Error: SMTP configuration is incomplete.");
    }

    const smtpPort = Number(process.env.SMTP_PORT || 465);
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    const myEmailAddress = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

    // Dummy data for the test emails
    const dummyCustomer = { 
        fullName: "Test Agency Profile", 
        email: myEmailAddress, // Sending the client email to you for testing
        contactPlatform: "Telegram", 
        contactHandle: "@test_agency_handle",
        targetUrls: "https://example.com.au/page1\nhttps://example.com.au/page2",
        anchorTexts: "best seo service, digital marketing",
        notes: "Drip feed over 14 days please."
    };
    
    const dummyPackages = [
      { name: "Homepage Post", qty: 1000, subtotal: 100 },
      { name: "EDU PBN Blogroll", qty: 50, subtotal: 250 }
    ];

    const clientHtml = getClientEmailHtml({
      customer: dummyCustomer,
      transactionId: "TXN-TEST-987654",
      paymentMethod: "Stripe Card",
      totalLinks: 1050,
      totalAmount: 350.00,
      packages: dummyPackages
    });

    const adminHtml = getAdminEmailHtml({
      customer: dummyCustomer,
      transactionId: "TXN-TEST-987654",
      paymentMethod: "Stripe Card",
      totalLinks: 1050,
      totalAmount: 350.00,
      packages: dummyPackages
    });

    // Send both emails simultaneously
    await Promise.all([
      transporter.sendMail({
        from: `"Jasa Backlinks" <${process.env.SMTP_USER}>`,
        to: myEmailAddress,
        subject: `[TEST] Payment Receipt #TXN-TEST - Jasa Backlinks`,
        html: clientHtml,
      }),
      transporter.sendMail({
        from: `"Jasa Orders" <${process.env.SMTP_USER}>`,
        to: myEmailAddress,
        subject: `[TEST] 🔔 NEW ORDER: $350.00 from ${dummyCustomer.fullName}`,
        html: adminHtml,
      }),
    ]);

    res.send(`<h3 style="color: green; font-family: sans-serif;">✅ Success! Both premium test emails have been dispatched to <b>${myEmailAddress}</b>. Please check your inbox.</h3>`);
  } catch (error) {
    console.error("Test Email Delivery Error:", error);
    res.send(`<h3 style="color: red; font-family: sans-serif;">❌ Failed to send emails: ${error.message}</h3>`);
  }
});

// ==========================================
// 1. STRIPE API
// ==========================================
app.post("/api/create-stripe-intent", async (req, res) => {
  try {
    if (!stripe) return res.status(500).json({ error: "STRIPE_SECRET_KEY missing." });
    const { cart } = req.body;
    if (hasUnpricedGuestPostingItems(cart)) {
      return res.status(503).json({
        error: "Guest Posting checkout is unavailable until final rates are configured.",
      });
    }
    const totalAmount = calculateSecureTotal(cart);
    if (totalAmount <= 0) return res.status(400).json({ error: "Invalid cart total." });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });
    res.json({ clientSecret: paymentIntent.client_secret, total: totalAmount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 2. PAYPAL API
// ==========================================
async function getPayPalAccessToken() {
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) throw new Error("PayPal keys missing");
  const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");
  const response = await axios.post(`${PAYPAL_API_BASE}/v1/oauth2/token`, "grant_type=client_credentials", {
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
  });
  return response.data.access_token;
}

app.post("/api/create-paypal-order", async (req, res) => {
  try {
    const { cart } = req.body;
    if (hasUnpricedGuestPostingItems(cart)) {
      return res.status(503).json({
        error: "Guest Posting checkout is unavailable until final rates are configured.",
      });
    }
    const totalAmount = calculateSecureTotal(cart);
    if (totalAmount <= 0) return res.status(400).json({ error: "Invalid total." });

    const accessToken = await getPayPalAccessToken();
    const response = await axios.post(
      `${PAYPAL_API_BASE}/v2/checkout/orders`,
      { intent: "CAPTURE", purchase_units: [{ amount: { currency_code: "USD", value: totalAmount.toFixed(2) } }] },
      { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } }
    );
    res.json({ id: response.data.id, total: totalAmount });
  } catch (error) {
    res.status(500).json({ error: "Failed to create PayPal order." });
  }
});

app.post("/api/capture-paypal-order", async (req, res) => {
  try {
    const { orderID } = req.body;
    const accessToken = await getPayPalAccessToken();
    const response = await axios.post(
      `${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`,
      {},
      { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } }
    );
    res.json({ status: "COMPLETED", captureId: response.data.id });
  } catch (error) {
    res.status(500).json({ error: "Failed to capture PayPal order." });
  }
});

/// ==========================================
// 3. BOOMFI CRYPTO API (OFFICIAL GATEWAY)
// ==========================================
app.post("/api/create-boomfi-charge", async (req, res) => {
  try {
    const { cart } = req.body;
    if (hasUnpricedGuestPostingItems(cart)) {
      return res.status(503).json({
        error: "Guest Posting checkout is unavailable until final rates are configured.",
      });
    }
    const totalAmount = calculateSecureTotal(cart);
    if (totalAmount <= 0) {
      return res.status(400).json({ error: "Invalid cart total." });
    }

    if (!process.env.BOOMFI_API_KEY) {
      return res.status(500).json({ error: "BOOMFI_API_KEY is missing in .env file." });
    }

    const boomfiBaseUrl = process.env.BOOMFI_API_BASE || "https://mapi.boomfi.xyz/v1";
    const planName = `Jasa Backlinks SEO Campaign ${crypto.randomBytes(6).toString("hex")}`;

    const response = await axios.post(
      `${boomfiBaseUrl}/paylinks`,
      {
        name: planName,
        description: `Bulk Link Placement Order ($${totalAmount.toFixed(2)} USD)`,
        amount: totalAmount.toFixed(2),
        currency: "USD",
        type: "OneTime",
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
    const checkoutUrl =
      payload.url ||
      payload.payment_link ||
      payload.checkout_url ||
      (paylinkId ? `https://pay.boomfi.xyz/${paylinkId}` : null);

    if (!checkoutUrl) {
      return res.status(500).json({ error: "BoomFi did not return a valid checkout URL." });
    }

    return res.json({
      checkoutUrl,
      total: totalAmount,
    });
  } catch (error) {
    console.error("BoomFi API Error:", error.response?.data || error.message);
    return res.status(500).json({
      error:
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to initialize BoomFi Crypto Gateway.",
    });
  }
});

// ==========================================
// 4. SUBMIT ORDER & SEND PREMIUM EMAILS
// ==========================================
app.post("/api/submit-order", async (req, res) => {
  try {
    const { transactionId, paymentMethod, totalAmount, totalLinks, packages, customer } = req.body;

    if (!customer?.email || !customer?.targetUrls) {
      return res.status(400).json({ error: "Customer email and target URLs are required." });
    }

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return res.status(503).json({
        error: "Order email service is not configured. Please contact support with your payment transaction ID.",
      });
    }

    const smtpPort = Number(process.env.SMTP_PORT || 465);
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

    const clientHtml = getClientEmailHtml({ customer, transactionId, paymentMethod, totalLinks, totalAmount, packages });
    const adminHtml = getAdminEmailHtml({ customer, transactionId, paymentMethod, totalLinks, totalAmount, packages });

    await Promise.all([
      transporter.sendMail({
        from: `"Jasa Backlinks" <${process.env.SMTP_USER}>`,
        to: customer.email,
        subject: `Payment Receipt #${transactionId.slice(-8)} - Jasa Backlinks`,
        html: clientHtml,
      }),
      transporter.sendMail({
        from: `"Jasa Orders" <${process.env.SMTP_USER}>`,
        to: adminEmail,
        subject: `🔔 NEW ORDER: $${Number(totalAmount).toFixed(2)} from ${customer.fullName}`,
        html: adminHtml,
      }),
    ]);

    res.json({ success: true, message: "Order recorded securely." });
  } catch (error) {
    console.error("Order Submit Error:", error);
    res.status(500).json({ error: "Failed to process order details." });
  }
});

// ==========================================
// 5. CONTACT US ENQUIRY EMAIL ROUTE
// ==========================================
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
    } = req.body;

    if (!email || !message) {
      return res.status(400).json({ error: "Email and message are required." });
    }

    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS
    ) {
      return res.status(503).json({
        error: "Contact email service is not configured. Please try again later.",
      });
    }

    const smtpPort = Number(process.env.SMTP_PORT || 465);
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
    const escapeHtml = (value = "") =>
      String(value).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;",
      })[character]);

    const escapedName = escapeHtml(fullName || "there");
    const escapedEnquiryType = escapeHtml(enquiryType || "General Enquiry");
    const escapedMessage = escapeHtml(message).replace(/\r?\n/g, "<br>");

    await Promise.all([
      transporter.sendMail({
        from: `"Jasa Backlinks Desk" <${process.env.SMTP_USER}>`,
        to: adminEmail,
        replyTo: email,
        subject: `📩 [${enquiryType}] New Enquiry from ${fullName}`,
        html: `
          <div style="font-family: 'Google Sans', Roboto, Arial, sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #dadce0; border-radius: 18px; overflow: hidden;">
            <div style="height: 4px; background: linear-gradient(90deg, #4285F4 25%, #EA4335 25% 50%, #FBBC04 50% 75%, #34A853 75%);"></div>
            <div style="padding: 24px 28px; background: #f8fbff; border-bottom: 1px solid #e8eaed;">
              <span style="display: inline-block; background: #e8f0fe; color: #1a73e8; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 99px; margin-bottom: 8px;">${enquiryType}</span>
              <h2 style="margin: 0; font-size: 22px; color: #202124;">New Contact Enquiry Received</h2>
            </div>
            <div style="padding: 24px 28px; color: #3c4043; font-size: 14px; line-height: 1.6;">
              <p><strong>Name / Agency:</strong> ${fullName}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #1a73e8;">${email}</a></p>
              <p><strong>Direct Contact (${contactPlatform || "N/A"}):</strong> <span style="color: #1e8e3e; font-weight: 600;">${contactHandle || "Not provided"}</span></p>
              <p><strong>Estimated Volume:</strong> ${volumeTier || "N/A"}</p>
              <p><strong>Target Website:</strong> ${websiteUrl || "N/A"}</p>
              <div style="margin-top: 16px; padding: 16px; background: #f8f9fa; border: 1px solid #e8eaed; border-radius: 12px;">
                <strong style="display: block; margin-bottom: 6px; color: #202124;">Message / Brief:</strong>
                <div style="white-space: pre-wrap;">${message}</div>
              </div>
            </div>
          </div>
        `,
      }),
      transporter.sendMail({
        from: `"Jasa Backlinks" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "We received your message - Jasa Backlinks",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #dadce0; border-radius: 18px; overflow: hidden; color: #3c4043;">
            <div style="height: 4px; background: linear-gradient(90deg, #4285F4 25%, #EA4335 25% 50%, #FBBC04 50% 75%, #34A853 75%);"></div>
            <div style="padding: 24px 28px; background: #f8fbff; border-bottom: 1px solid #e8eaed;">
              <h2 style="margin: 0; font-size: 22px; color: #202124;">Thanks for contacting us, ${escapedName}.</h2>
            </div>
            <div style="padding: 24px 28px; font-size: 14px; line-height: 1.6;">
              <p>We received your <strong>${escapedEnquiryType}</strong> enquiry. Our team will review it and get back to you as soon as possible.</p>
              <div style="margin-top: 16px; padding: 16px; background: #f8f9fa; border: 1px solid #e8eaed; border-radius: 12px;">
                <strong style="display: block; margin-bottom: 6px; color: #202124;">Your message:</strong>
                <div>${escapedMessage}</div>
              </div>
              <p style="margin-top: 20px;">Jasa Backlinks Support</p>
            </div>
          </div>
        `,
      }),
    ]);

    res.json({ success: true });
  } catch (error) {
    console.error("Contact Form Error:", error);
    res.status(500).json({ error: "Failed to dispatch contact enquiry." });
  }
});

// ==========================================
// 6. BULLETPROOF ADMIN AUTH, BLOGS, CATEGORIES & MEDIA API
// ==========================================
const BLOGS_FILE = path.join(__dirname, "blogs.json");
const CATEGORIES_FILE = path.join(__dirname, "categories.json");
const MEDIA_FILE = path.join(__dirname, "media.json");

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "SeoHubAdmin2026";

// Brute-Force Rate Limiter & Cryptographic Session Store
const LOGIN_ATTEMPTS = new Map(); // ip -> { count, lockUntil }
const ACTIVE_SESSIONS = new Map(); // token -> { createdAt, expiresAt }
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 Minutes Lockout
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 Hours Session

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

const DEFAULT_CATEGORIES = [
  { id: "cat-1", name: "PBN Strategy", color: "blue" },
  { id: "cat-2", name: "Regional .ID SEO", color: "red" },
  { id: "cat-3", name: "EDU & GOV Authority", color: "purple" },
  { id: "cat-4", name: "Case Studies", color: "green" },
];

const DEFAULT_MEDIA = [
  {
    id: "media-1",
    name: "SEO Analytics Dashboard",
    alt: "DA DR 50+ PBN SEO Analytics Dashboard",
    url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    uploadedAt: "2026-10-12",
  },
  {
    id: "media-2",
    name: "Regional .ID SERP Growth",
    alt: "Indonesian Regional .ID Backlink Growth Chart",
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    uploadedAt: "2026-10-14",
  },
  {
    id: "media-3",
    name: "Academic EDU Authority",
    alt: "High Trust EDU and GOV Backlink Infrastructure",
    url: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80",
    uploadedAt: "2026-10-16",
  },
];

const DEFAULT_BLOGS = [
  {
    id: "blog-1",
    title: "How DA/DR 50+ Homepage PBN Backlinks Drive Page-1 Rankings in 2026",
    seoTitle: "How DA/DR 50+ Homepage PBN Backlinks Drive Page-1 Rankings (2026)",
    slug: "how-da-dr-50-homepage-pbn-backlinks-drive-rankings",
    focusKeyword: "homepage pbn backlinks",
    category: "PBN Strategy",
    readTime: "6 min read",
    author: "SeoHub Technical Team",
    authorRole: "Senior Link Strategist",
    publishedAt: "2026-10-12",
    status: "published",
    featured: true,
    seoScore: 94,
    tags: ["DA/DR 50+", "Homepage Links", "Class-C IPs"],
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "homepage pbn backlinks analytics dashboard",
    excerpt:
      "Discover why homepage pbn backlinks on aged, footprint-free .COM and .NET domains remain the fastest catalyst for organic SERP and AI Overview visibility.",
    content: `
      <h2>Why Homepage PBN Backlinks Matter More Than Ever</h2>
      <p>Modern search algorithms evaluate both topical relevance and domain-level trust signals. When your target URL receives dofollow <strong>homepage pbn backlinks</strong> directly from the root page of an aged Moz DA 50+ and Ahrefs DR 50+ domain, link equity passes with minimal crawl decay.</p>
      <blockquote>Root-level homepage placements pass up to 4x more direct PageRank equity compared to unlinked inner archive pages.</blockquote>
      <h2>Zero-Footprint Network Architecture</h2>
      <p>At Jasa Backlinks (operated by SeoHub Ltd), every domain in our inventory is isolated across independent Class-C IP blocks, unique WHOIS records, and custom CMS themes. Explore our <a href="/services/homepage-post">Homepage Post service</a> or compare authority tiers on <a href="https://ahrefs.com" target="_blank" rel="noopener noreferrer">Ahrefs</a>.</p>
      <ul>
        <li><strong>Contextual Relevance:</strong> Every placement includes a 400–600 word niche-aligned article.</li>
        <li><strong>Low Outbound Links (OBL):</strong> Strictly capped outbound links preserve maximum PageRank flow.</li>
        <li><strong>White-Label Reporting:</strong> Unbranded Excel and CSV sheets ready for client delivery.</li>
      </ul>
    `,
  },
];

function readJsonFile(filePath, defaultData) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultData;
  } catch {
    return defaultData;
  }
}

function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err.message);
  }
}

// 1. SECURE RATE-LIMITED ADMIN LOGIN
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

  // Reset failed attempts on success & issue 256-bit cryptographic session token
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

// 2. CATEGORIES API
app.get("/api/categories", (req, res) => {
  res.json(readJsonFile(CATEGORIES_FILE, DEFAULT_CATEGORIES));
});

app.post("/api/categories", verifyAdminAuth, (req, res) => {
  const { name, color } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Category name is required." });
  }
  const categories = readJsonFile(CATEGORIES_FILE, DEFAULT_CATEGORIES);
  const exists = categories.some(
    (c) => c.name.toLowerCase() === name.trim().toLowerCase()
  );
  if (exists) {
    return res.status(400).json({ error: "Category already exists." });
  }

  const newCat = {
    id: `cat-${Date.now()}`,
    name: name.trim(),
    color: color || "blue",
  };
  categories.push(newCat);
  writeJsonFile(CATEGORIES_FILE, categories);
  res.json({ success: true, categories, category: newCat });
});

app.delete("/api/categories/:id", verifyAdminAuth, (req, res) => {
  const categories = readJsonFile(CATEGORIES_FILE, DEFAULT_CATEGORIES);
  const filtered = categories.filter(
    (c) => c.id !== req.params.id && c.name !== req.params.id
  );
  writeJsonFile(CATEGORIES_FILE, filtered);
  res.json({ success: true, categories: filtered });
});

// 3. MEDIA LIBRARY API
app.get("/api/media", verifyAdminAuth, (req, res) => {
  res.json(readJsonFile(MEDIA_FILE, DEFAULT_MEDIA));
});

app.post("/api/media", verifyAdminAuth, (req, res) => {
  const { name, alt, url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "Image data or URL is required." });
  }
  const mediaList = readJsonFile(MEDIA_FILE, DEFAULT_MEDIA);
  const newItem = {
    id: `media-${Date.now()}`,
    name: name || "Uploaded Image",
    alt: alt || name || "Jasa Backlinks SEO Image",
    url,
    uploadedAt: new Date().toISOString().split("T")[0],
  };
  mediaList.unshift(newItem);
  writeJsonFile(MEDIA_FILE, mediaList);
  res.json({ success: true, item: newItem, media: mediaList });
});

app.delete("/api/media/:id", verifyAdminAuth, (req, res) => {
  const mediaList = readJsonFile(MEDIA_FILE, DEFAULT_MEDIA);
  const nextMedia = mediaList.filter((m) => m.id !== req.params.id);
  writeJsonFile(MEDIA_FILE, nextMedia);
  res.json({ success: true, media: nextMedia });
});

// 4. BLOG POSTS API
app.get("/api/blogs", (req, res) => {
  const allBlogs = readJsonFile(BLOGS_FILE, DEFAULT_BLOGS);
  const authHeader = req.headers["authorization"] || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : req.headers["x-admin-token"];
  const isAdmin = token && ACTIVE_SESSIONS.has(token);

  const visible = isAdmin
    ? allBlogs
    : allBlogs.filter((b) => b.status !== "draft");
  res.json(visible);
});

app.get("/api/blogs/:slug", (req, res) => {
  const allBlogs = readJsonFile(BLOGS_FILE, DEFAULT_BLOGS);
  const blog = allBlogs.find(
    (b) => b.slug.toLowerCase() === req.params.slug.toLowerCase()
  );
  if (!blog) return res.status(404).json({ error: "Article not found." });
  res.json(blog);
});

app.post("/api/blogs", verifyAdminAuth, (req, res) => {
  const blogs = readJsonFile(BLOGS_FILE, DEFAULT_BLOGS);
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
    return res.status(400).json({ error: "Title and content are required." });
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
    image:
      image ||
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    imageAlt: imageAlt || focusKeyword || title,
    excerpt:
      excerpt || content.replace(/<[^>]+>/g, "").slice(0, 155) + "...",
    content,
  };

  if (newPost.featured) {
    blogs.forEach((b) => (b.featured = false));
  }

  blogs.unshift(newPost);
  writeJsonFile(BLOGS_FILE, blogs);
  res.json({ success: true, post: newPost });
});

app.put("/api/blogs/:id", verifyAdminAuth, (req, res) => {
  const blogs = readJsonFile(BLOGS_FILE, DEFAULT_BLOGS);
  const idx = blogs.findIndex((b) => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Post not found." });

  const updated = {
    ...blogs[idx],
    ...req.body,
  };

  if (updated.featured) {
    blogs.forEach((b) => (b.featured = false));
    updated.featured = true;
  }

  blogs[idx] = updated;
  writeJsonFile(BLOGS_FILE, blogs);
  res.json({ success: true, post: updated });
});

app.delete("/api/blogs/:id", verifyAdminAuth, (req, res) => {
  const blogs = readJsonFile(BLOGS_FILE, DEFAULT_BLOGS);
  const nextBlogs = blogs.filter((b) => b.id !== req.params.id);
  writeJsonFile(BLOGS_FILE, nextBlogs);
  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Enterprise Backend running on port ${PORT}`);
});