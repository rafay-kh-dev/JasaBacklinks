const express = require("express");
const cors = require("cors");
const axios = require("axios");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
require("dotenv").config();

// IMPORTING OUR PREMIUM TEMPLATES
const {
  getClientEmailHtml,
  getAdminEmailHtml,
  getContactAdminHtml,
  getContactClientHtml
} = require("./templates/emailTemplates");

const stripe = process.env.STRIPE_SECRET_KEY
  ? require("stripe")(process.env.STRIPE_SECRET_KEY)
  : null;

const app = express();
app.use(cors());
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

const PAYPAL_API_BASE =
  process.env.PAYPAL_BASE_URL ||
  process.env.PAYPAL_API_BASE ||
  "https://api-m.sandbox.paypal.com";

// ==========================================
// CENTRALIZED BULLETPROOF SMTP TRANSPORTER
// ==========================================
function createMailTransporter() {
  const host = (process.env.SMTP_HOST || "").trim();
  const user = (process.env.SMTP_USER || "").trim();
  const pass = (process.env.SMTP_PASS || "").trim();
  const port = Number((process.env.SMTP_PORT || "465").trim());

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465 (SSL), false for 587 (STARTTLS)
    auth: { user, pass },
    tls: {
      rejectUnauthorized: false, // Prevents SSL handshake blocks
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
    debug: false, // Production mode mein isay false rakhein
    logger: false, // Production mode mein isay false rakhein
  });
}

// Live SMTP Diagnostic Route for Testing
app.get("/api/verify-smtp", async (req, res) => {
  try {
    const transporter = createMailTransporter();
    if (!transporter) {
      return res.status(503).json({
        connected: false,
        error: "Missing SMTP_HOST, SMTP_USER, or SMTP_PASS in your backend .env file.",
      });
    }

    await transporter.verify();
    return res.json({
      connected: true,
      message: "SMTP Server is authenticated and ready to dispatch emails!",
    });
  } catch (err) {
    console.error("SMTP Verification Failed:", err);
    return res.status(500).json({
      connected: false,
      error: err.message,
    });
  }
});

// Email Testing Route
app.get("/api/send-test-emails", async (req, res) => {
  try {
    const transporter = createMailTransporter();
    if (!transporter) return res.status(503).send("Error: SMTP incomplete.");

    const smtpUser = process.env.SMTP_USER.trim();
    const myEmailAddress = (process.env.ADMIN_EMAIL || smtpUser).trim();

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
      transporter.sendMail({
        from: `"Jasa Backlinks" <${smtpUser}>`,
        to: myEmailAddress,
        subject: `[TEST] Payment Receipt #TXN-TEST - Jasa Backlinks`,
        html: clientHtml,
      }),
      transporter.sendMail({
        from: `"Jasa Orders" <${smtpUser}>`,
        to: myEmailAddress,
        subject: `[TEST] NEW ORDER: $100.00 from ${dummyCustomer.fullName}`,
        html: adminHtml,
      }),
    ]);

    res.send(`<h3 style="color: green;">Success! Test emails sent to <b>${myEmailAddress}</b>.</h3>`);
  } catch (error) {
    console.error("Test Email Delivery Error:", error);
    res.send(`<h3 style="color: red;">Failed to send emails: <br><br> ${error.message}</h3>`);
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

const hasUnpricedGuestPostingItems = (cart = {}) =>
  Object.keys(cart || {}).some((id) => id.startsWith("guestpost_"));

// ==========================================
// 1. STRIPE API
// ==========================================
app.post("/api/create-stripe-intent", async (req, res) => {
  try {
    if (!stripe)
      return res.status(500).json({ error: "STRIPE_SECRET_KEY missing." });
    const { cart } = req.body;
    if (hasUnpricedGuestPostingItems(cart)) {
      return res.status(503).json({
        error: "Guest Posting checkout is unavailable until final rates are configured.",
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
    res.json({
      clientSecret: paymentIntent.client_secret,
      total: totalAmount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 2. PAYPAL API
// ==========================================
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
        error: "Guest Posting checkout is unavailable until final rates are configured.",
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
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.json({ status: "COMPLETED", captureId: response.data.id });
  } catch (error) {
    res.status(500).json({ error: "Failed to capture PayPal order." });
  }
});

// ==========================================
// 3. BOOMFI CRYPTO API
// ==========================================
app.post("/api/create-boomfi-charge", async (req, res) => {
  try {
    const { cart } = req.body;
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
    const checkoutUrl = payload.url || payload.payment_link || payload.checkout_url || (paylinkId ? `https://pay.boomfi.xyz/${paylinkId}` : null);

    if (!checkoutUrl) {
      return res.status(500).json({ error: "BoomFi did not return a valid checkout URL." });
    }

    return res.json({ checkoutUrl, total: totalAmount });
  } catch (error) {
    console.error("BoomFi API Error:", error.response?.data || error.message);
    return res.status(500).json({ error: "Failed to initialize BoomFi Crypto Gateway." });
  }
});

// ==========================================
// 4. SUBMIT ORDER & SEND PREMIUM EMAILS
// ==========================================
const ORDERS_FILE = path.join(__dirname, "orders.json");

app.post("/api/submit-order", async (req, res) => {
  try {
    const { transactionId, paymentMethod, totalAmount, totalLinks, packages, customer } = req.body;

    if (!customer?.email || !customer?.targetUrls) {
      return res.status(400).json({ error: "Customer email and target URLs are required." });
    }

    // 1. BULLETPROOF BACKUP: Always save order to disk first
    try {
      const existingOrders = fs.existsSync(ORDERS_FILE)
        ? JSON.parse(fs.readFileSync(ORDERS_FILE, "utf8") || "[]")
        : [];
      existingOrders.unshift({
        id: `ord-${Date.now()}`,
        transactionId: transactionId || "N/A",
        paymentMethod: paymentMethod || "Unknown",
        totalAmount,
        totalLinks,
        packages,
        customer,
        createdAt: new Date().toISOString(),
      });
      fs.writeFileSync(ORDERS_FILE, JSON.stringify(existingOrders, null, 2));
    } catch (fileErr) {
      console.warn("Could not save order to orders.json:", fileErr.message);
    }

    // 2. EMAIL DISPATCH (Graceful handling)
    const transporter = createMailTransporter();
    if (!transporter) {
      console.warn("SMTP missing. Order saved locally, email skipped.");
      return res.json({ success: true, message: "Order recorded securely." });
    }

    const smtpUser = process.env.SMTP_USER.trim();
    const adminEmail = (process.env.ADMIN_EMAIL || smtpUser).trim();

    const clientHtml = getClientEmailHtml({
      customer,
      transactionId,
      paymentMethod,
      totalLinks,
      totalAmount,
      packages,
    });
    const adminHtml = getAdminEmailHtml({
      customer,
      transactionId,
      paymentMethod,
      totalLinks,
      totalAmount,
      packages,
    });

    const emailResults = await Promise.allSettled([
      transporter.sendMail({
        from: `"Jasa Backlinks" <${smtpUser}>`,
        to: customer.email,
        subject: `Payment Receipt #${String(transactionId || "ORDER").slice(-8)} - Jasa Backlinks`,
        html: clientHtml,
      }),
      transporter.sendMail({
        from: `"Jasa Orders" <${smtpUser}>`,
        to: adminEmail,
        subject: `NEW ORDER: $${Number(totalAmount).toFixed(2)} from ${customer.fullName}`,
        html: adminHtml,
      }),
    ]);

    // Error Logging for Diagnosis
    emailResults.forEach((result, idx) => {
      if (result.status === "rejected") {
        console.error(`ORDER MAIL ERROR [${idx === 0 ? 'Client' : 'Admin'}]:`, result.reason);
      }
    });

    res.json({ success: true, message: "Order recorded securely." });
  } catch (error) {
    console.error("Order Submit Error:", error);
    res.json({ success: true, message: "Order saved with minor warnings." });
  }
});

// ==========================================
// 5. CONTACT US ENQUIRY EMAIL ROUTE
// ==========================================
const ENQUIRIES_FILE = path.join(__dirname, "enquiries.json");

app.post("/api/contact", async (req, res) => {
  try {
    const { enquiryType, fullName, email, contactPlatform, contactHandle, volumeTier, websiteUrl, message } = req.body || {};

    if (!email || !message) {
      return res.status(400).json({ error: "Email and message are required." });
    }

    // Backup Save
    try {
      const existingEnquiries = fs.existsSync(ENQUIRIES_FILE)
        ? JSON.parse(fs.readFileSync(ENQUIRIES_FILE, "utf8") || "[]")
        : [];
      existingEnquiries.unshift({
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
      fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify(existingEnquiries, null, 2));
    } catch (fileErr) {}

    const transporter = createMailTransporter();
    if (!transporter) {
      return res.json({ success: true, confirmationSent: false });
    }

    const smtpUser = process.env.SMTP_USER.trim();
    const adminEmail = (process.env.ADMIN_EMAIL || "hello@jasabacklinks.net" || smtpUser).trim();

    const escapeHtml = (value = "") =>
      String(value).replace(
        /[&<>"']/g,
        (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
      );

    const escapedName = escapeHtml(fullName || "there");
    const escapedEnquiryType = escapeHtml(enquiryType || "General Enquiry");
    const escapedMessage = escapeHtml(message).replace(/\r?\n/g, "<br>");

    // PREMIUM HTML GENERATION
    const adminContactHtml = getContactAdminHtml({
      enquiryType: escapedEnquiryType,
      fullName: escapedName,
      email: escapeHtml(email),
      contactPlatform: escapeHtml(contactPlatform),
      contactHandle: escapeHtml(contactHandle),
      volumeTier: escapeHtml(volumeTier),
      websiteUrl: escapeHtml(websiteUrl),
      message: escapedMessage
    });

    const clientContactHtml = getContactClientHtml({
      fullName: escapedName,
      message: escapedMessage
    });

    const emailResults = await Promise.allSettled([
      transporter.sendMail({
        from: `"Jasa Backlinks Desk" <${smtpUser}>`,
        to: adminEmail,
        replyTo: email.trim(),
        subject: `[${escapedEnquiryType}] New Enquiry from ${escapedName}`,
        html: adminContactHtml,
      }),
      transporter.sendMail({
        from: `"Jasa Backlinks" <${smtpUser}>`,
        to: email.trim(),
        replyTo: adminEmail,
        subject: "We've received your enquiry - Jasa Backlinks",
        html: clientContactHtml,
      }),
    ]);

    // Error Logging for Diagnosis
    emailResults.forEach((result, idx) => {
      if (result.status === "rejected") {
        console.error(`CONTACT MAIL ERROR [${idx === 0 ? 'Admin' : 'Client'}]:`, result.reason);
      }
    });

    res.json({ success: true, confirmationSent: emailResults[1].status === "fulfilled" });
  } catch (error) {
    console.error("Contact Form Error:", error);
    res.json({ success: true, confirmationSent: false });
  }
});

// ==========================================
// 6. BULLETPROOF ADMIN AUTH, BLOGS, CATEGORIES & MEDIA API
// ==========================================
const BLOGS_FILE = path.join(__dirname, "blogs.json");
const CATEGORIES_FILE = path.join(__dirname, "categories.json");
const MEDIA_FILE = path.join(__dirname, "media.json");

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

const DEFAULT_CATEGORIES = [
  { id: "cat-1", name: "PBN Strategy", color: "blue" },
  { id: "cat-2", name: "Regional .ID SEO", color: "red" },
  { id: "cat-3", name: "EDU & GOV Authority", color: "purple" },
  { id: "cat-4", name: "Case Studies", color: "green" },
];

const DEFAULT_MEDIA = [];
const DEFAULT_BLOGS = [];

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
  } catch (err) {}
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
    image: image || "",
    imageAlt: imageAlt || focusKeyword || title,
    excerpt: excerpt || content.replace(/<[^>]+>/g, "").slice(0, 155) + "...",
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

// Remove 'if (require.main === module)' condition temporarily to force execution
const server = app.listen(PORT, () => {
  console.log(`Enterprise Backend running on port ${PORT}`);
});

// --- SILENT CRASH CATCHER ---
server.on('error', (err) => {
  console.error('Server Port Error:', err);
});

process.on('exit', (code) => {
  console.log(`Terminal closed automatically with exit code: ${code}`);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception (Silent Crash):', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection (Silent Crash):', reason);
});

module.exports = app;