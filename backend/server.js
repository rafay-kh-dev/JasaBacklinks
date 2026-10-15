const express = require("express");
const cors = require("cors");
const axios = require("axios");
const nodemailer = require("nodemailer");
require("dotenv").config();

// IMPORTING OUR PREMIUM TEMPLATES
const { getClientEmailHtml, getAdminEmailHtml } = require("./templates/emailTemplates");

const stripe = process.env.STRIPE_SECRET_KEY ? require("stripe")(process.env.STRIPE_SECRET_KEY) : null;

const app = express();
app.use(cors());
app.use(express.json());

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

// ==========================================
// 🧪 EMAIL TEMPLATE TESTING ROUTES
// ==========================================

// This route actually SENDS the emails to your inbox for live testing
app.get("/api/send-test-emails", async (req, res) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return res.send("❌ Error: SMTP credentials are missing in your .env file.");
    }

    // FIXED: Using Custom SMTP Host instead of Gmail
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 465,
      secure: true, 
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

// ==========================================
// 3. BOOMFI CRYPTO API
// ==========================================
app.post("/api/create-boomfi-charge", async (req, res) => {
  try {
    const { cart } = req.body;
    const totalAmount = calculateSecureTotal(cart);
    if (totalAmount <= 0) return res.status(400).json({ error: "Invalid total." });

    if (process.env.BOOMFI_API_KEY) {
      const response = await axios.post(
        "https://api.boomfi.xyz/v1/paylinks",
        { amount: totalAmount.toFixed(2), currency: "USD", name: "Jasa Backlinks Campaign" },
        { headers: { "x-api-key": process.env.BOOMFI_API_KEY, "Content-Type": "application/json" } }
      );
      return res.json({ checkoutUrl: response.data?.data?.url || response.data?.checkout_url, total: totalAmount, isFallback: false });
    }
    res.json({ isFallback: true, walletAddress: process.env.CRYPTO_WALLET_TRC20 || "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE", total: totalAmount });
  } catch (error) {
    res.json({ isFallback: true, walletAddress: process.env.CRYPTO_WALLET_TRC20 || "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE", total: calculateSecureTotal(req.body.cart) });
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

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 465,
        secure: true, // true for 465, false for 587
        auth: { 
          user: process.env.SMTP_USER, 
          pass: process.env.SMTP_PASS 
        },
      });

      const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

      // Passing raw 'packages' array directly to our clean external templates
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
    }

    res.json({ success: true, message: "Order recorded securely." });
  } catch (error) {
    console.error("Order Submit Error:", error);
    res.status(500).json({ error: "Failed to process order details." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Enterprise Backend running on port ${PORT}`);
});