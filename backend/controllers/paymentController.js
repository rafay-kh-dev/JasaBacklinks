const crypto = require("crypto");
const axios = require("axios");
const Order = require("../models/Order");
const { normaliseAndPriceCart } = require("../config/pricing");
const { ALLOWED_ORIGINS } = require("../config/corsOptions");
const { sendOrderEmailsIfReady } = require("../utils/mailer");

const stripe = process.env.STRIPE_SECRET_KEY
  ? require("stripe")(process.env.STRIPE_SECRET_KEY)
  : null;

const PAYPAL_API_BASE =
  process.env.PAYPAL_BASE_URL ||
  process.env.PAYPAL_API_BASE ||
  "https://api-m.sandbox.paypal.com";

function getAllowedFrontendBase(candidateUrl) {
  let frontendUrl;
  try {
    frontendUrl = new URL(candidateUrl);
  } catch {
    throw new Error("Invalid BoomFi return URL.");
  }

  if (!ALLOWED_ORIGINS.includes(frontendUrl.origin)) {
    throw new Error("BoomFi return URL origin is not allowed.");
  }

  return `${frontendUrl.origin}${frontendUrl.pathname.replace(/\/$/, "")}`;
}

async function getPayPalAccessToken() {
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    throw new Error("PayPal credentials missing in .env");
  }
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

// 1. CREATE STRIPE INTENT (Saves Pending Order in MongoDB)
exports.createStripeIntent = async (req, res) => {
  try {
    if (!stripe) return res.status(500).json({ error: "STRIPE_SECRET_KEY missing." });

    const { cart, customer } = req.validatedBody;
    const priced = normaliseAndPriceCart(cart);
    const internalOrderId = `ord-${Date.now()}-${crypto.randomBytes(2).toString("hex")}`;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: priced.totalCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        orderId: internalOrderId,
        totalLinks: String(priced.totalLinks),
      },
    });

    await Order.create({
      id: internalOrderId,
      transactionId: paymentIntent.id,
      gatewayOrderId: paymentIntent.id,
      paymentMethod: "Credit / Debit Card",
      status: "pending_payment",
      totalAmount: priced.totalAmount,
      totalCents: priced.totalCents,
      totalLinks: priced.totalLinks,
      cart: priced.cartMap,
      packages: priced.packages,
      customer: customer || {},
    });

    return res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      total: priced.totalAmount,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// 2. CREATE PAYPAL ORDER (Saves Pending Order in MongoDB)
exports.createPayPalOrder = async (req, res) => {
  try {
    const { cart, customer } = req.validatedBody;
    const priced = normaliseAndPriceCart(cart);
    const internalOrderId = `ord-${Date.now()}-${crypto.randomBytes(2).toString("hex")}`;

    const accessToken = await getPayPalAccessToken();
    const response = await axios.post(
      `${PAYPAL_API_BASE}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            custom_id: internalOrderId,
            amount: {
              currency_code: "USD",
              value: priced.totalAmount.toFixed(2),
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

    const paypalOrderId = response.data?.id;
    if (!paypalOrderId) {
      return res.status(502).json({ error: "PayPal returned no order ID." });
    }

    await Order.create({
      id: internalOrderId,
      transactionId: paypalOrderId,
      gatewayOrderId: paypalOrderId,
      paymentMethod: "PayPal Checkout",
      status: "pending_payment",
      totalAmount: priced.totalAmount,
      totalCents: priced.totalCents,
      totalLinks: priced.totalLinks,
      cart: priced.cartMap,
      packages: priced.packages,
      customer: customer || {},
    });

    return res.json({ id: paypalOrderId, total: priced.totalAmount });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Failed to create PayPal order." });
  }
};

// 3. CAPTURE PAYPAL ORDER
exports.capturePayPalOrder = async (req, res) => {
  try {
    const { orderID } = req.body;
    const orderDoc = await Order.findOne({ gatewayOrderId: orderID });
    if (!orderDoc) {
      return res.status(404).json({ error: "PayPal order session not found in database." });
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
      Math.round(Number(capture.amount?.value) * 100) !== orderDoc.totalCents
    ) {
      return res.status(402).json({ error: "PayPal payment capture incomplete." });
    }

    orderDoc.transactionId = capture.id;
    if (orderDoc.status === "pending_payment") {
      orderDoc.status = "paid_pending_details";
      orderDoc.paidAt = new Date();
    }
    await orderDoc.save();

    return res.json({ status: result.status, captureId: capture.id });
  } catch (error) {
    return res.status(500).json({ error: "Failed to capture PayPal order." });
  }
};

// 4. CREATE BOOMFI CRYPTO CHARGE (Saves Pending Order in MongoDB instead of relying on localStorage)
exports.createBoomFiCharge = async (req, res) => {
  try {
    const { cart, originUrl, customer } = req.validatedBody;
    const priced = normaliseAndPriceCart(cart);

    if (!process.env.BOOMFI_API_KEY) {
      return res.status(500).json({ error: "BOOMFI_API_KEY is missing in .env file." });
    }

    const boomfiBaseUrl = process.env.BOOMFI_API_BASE || "https://mapi.boomfi.xyz/v1";
    const txReference = `BF-${crypto.randomBytes(6).toString("hex").toUpperCase()}`;
    const internalOrderId = `ord-${Date.now()}-${crypto.randomBytes(2).toString("hex")}`;

    const frontendBase = getAllowedFrontendBase(
      originUrl ||
      req.headers.origin ||
      process.env.FRONTEND_URL ||
      "https://www.jasabacklinks.net"
    );

    const returnUrl = `${frontendBase}/?boomfi_status=success&tx=${txReference}`;
    const failureUrl = `${frontendBase}/?boomfi_status=failed&tx=${txReference}`;

    const response = await axios.post(
      `${boomfiBaseUrl}/paylinks`,
      {
        name: `Jasa Backlinks SEO Campaign (${txReference})`,
        description: `Bulk Link Placement Order ($${priced.totalAmount.toFixed(2)} USD)`,
        amount: priced.totalAmount.toFixed(2),
        currency: "USD",
        type: "OneTime",
        metadata: {
          orderId: internalOrderId,
          txReference,
        },
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
      return res.status(500).json({ error: "BoomFi did not return a valid checkout URL." });
    }

    await Order.create({
      id: internalOrderId,
      transactionId: txReference,
      gatewayOrderId: paylinkId || txReference,
      paymentMethod: "BoomFi Crypto Gateway",
      status: "pending_payment",
      totalAmount: priced.totalAmount,
      totalCents: priced.totalCents,
      totalLinks: priced.totalLinks,
      cart: priced.cartMap,
      packages: priced.packages,
      customer: customer || {},
    });

    return res.json({
      checkoutUrl: rawCheckoutUrl,
      total: priced.totalAmount,
      transactionId: txReference,
      returnUrl,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Failed to initialise BoomFi." });
  }
};

// 5. RESTORE PENDING/PAID ORDER FROM DB (Replaces localStorage dependency)
exports.getPaymentSession = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const orderDoc = await Order.findOne(
      {
        $or: [{ transactionId }, { gatewayOrderId: transactionId }],
      },
      { _id: 0, __v: 0 }
    ).lean();

    if (!orderDoc) {
      return res.status(404).json({ error: "Order session not found." });
    }

    return res.json({
      transactionId: orderDoc.transactionId,
      status: orderDoc.status,
      paymentMethod: orderDoc.paymentMethod,
      totalAmount: orderDoc.totalAmount,
      totalLinks: orderDoc.totalLinks,
      cart: orderDoc.cart,
      packages: orderDoc.packages,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch payment session." });
  }
};

// 6. SUBMIT CAMPAIGN DETAILS (Step 2 Form Submission)
exports.submitOrderDetails = async (req, res) => {
  try {
    const { transactionId, customer } = req.validatedBody;

    const orderDoc = await Order.findOne({
      $or: [{ transactionId }, { gatewayOrderId: transactionId }],
    });

    if (!orderDoc) {
      return res.status(404).json({
        success: false,
        error: "Payment session not found.",
      });
    }

    if (orderDoc.status === "completed") {
      await sendOrderEmailsIfReady(orderDoc);
      return res.status(409).json({
        success: false,
        error: "Order details have already been submitted for this transaction.",
      });
    }

    // If Stripe webhook hasn't arrived yet, verify directly with Stripe API
    if (
      orderDoc.paymentMethod === "Credit / Debit Card" &&
      orderDoc.status === "pending_payment"
    ) {
      const pi = await stripe.paymentIntents.retrieve(orderDoc.gatewayOrderId);
      if (
        pi.status === "succeeded" &&
        pi.amount === orderDoc.totalCents &&
        pi.currency === "usd"
      ) {
        orderDoc.status = "paid_pending_details";
        orderDoc.paidAt = new Date();
      }
    }

    if (orderDoc.status !== "paid_pending_details") {
      return res.status(402).json({
        success: false,
        error: "Payment has not been confirmed by the gateway yet. Please wait a moment and retry.",
      });
    }

    orderDoc.customer = customer;
    orderDoc.status = "completed";
    await orderDoc.save();

    await sendOrderEmailsIfReady(orderDoc);

    return res.json({
      success: true,
      message: "Order recorded securely in MongoDB.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};