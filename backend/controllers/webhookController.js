const crypto = require("crypto");
const axios = require("axios");
const Order = require("../models/Order");
const { sendOrderEmailsIfReady } = require("../utils/mailer");

const stripe = process.env.STRIPE_SECRET_KEY
  ? require("stripe")(process.env.STRIPE_SECRET_KEY)
  : null;

const PAYPAL_API_BASE =
  process.env.PAYPAL_BASE_URL ||
  process.env.PAYPAL_API_BASE ||
  "https://api-m.sandbox.paypal.com";

async function verifyPayPalWebhook(req) {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  const transmissionId = req.headers["paypal-transmission-id"];
  const transmissionTime = req.headers["paypal-transmission-time"];
  const certUrl = req.headers["paypal-cert-url"];
  const authAlgo = req.headers["paypal-auth-algo"];
  const transmissionSig = req.headers["paypal-transmission-sig"];

  if (!webhookId) {
    throw new Error("PAYPAL_WEBHOOK_ID is not configured.");
  }

  if (
    !transmissionId ||
    !transmissionTime ||
    !certUrl ||
    !authAlgo ||
    !transmissionSig
  ) {
    return false;
  }

  if (!req.body || typeof req.body !== "object") {
    return false;
  }

  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    throw new Error("PayPal credentials missing in .env");
  }

  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");
  const tokenResponse = await axios.post(
    `${PAYPAL_API_BASE}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  const verificationResponse = await axios.post(
    `${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`,
    {
      auth_algo: authAlgo,
      cert_url: certUrl,
      transmission_id: transmissionId,
      transmission_sig: transmissionSig,
      transmission_time: transmissionTime,
      webhook_id: webhookId,
      webhook_event: req.body,
    },
    {
      headers: {
        Authorization: `Bearer ${tokenResponse.data.access_token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return verificationResponse.data?.verification_status === "SUCCESS";
}

async function markOrderPaidAndNotify(orderDoc) {
  if (!orderDoc || orderDoc.status === "failed") return;

  if (orderDoc.status === "pending_payment") {
    orderDoc.status = orderDoc.customer?.email
      ? "completed"
      : "paid_pending_details";
    orderDoc.paidAt = new Date();
    await orderDoc.save();
  }

  await sendOrderEmailsIfReady(orderDoc);
}

// 1. STRIPE WEBHOOK (Requires express.raw({ type: 'application/json' }))
exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return res.status(500).send("Stripe webhook secret not configured.");
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Signature Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const orderDoc = await Order.findOne({
      $or: [
        { gatewayOrderId: paymentIntent.id },
        { id: paymentIntent.metadata?.orderId },
      ],
    });

    if (
      paymentIntent.amount === orderDoc?.totalCents &&
      paymentIntent.currency === "usd"
    ) {
      await markOrderPaidAndNotify(orderDoc);
    }
  }

  return res.json({ received: true });
};

// 2. PAYPAL WEBHOOK
exports.handlePayPalWebhook = async (req, res) => {
  try {
    const event = req.body;

    if (!(await verifyPayPalWebhook(req))) {
      return res.status(401).json({ error: "Invalid PayPal webhook signature." });
    }

    if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
      const resource = event.resource || {};
      const customOrderId =
        resource.custom_id ||
        resource.purchase_units?.[0]?.custom_id ||
        resource.supplementary_data?.related_ids?.order_id;

      const orderDoc = await Order.findOne({
        $or: [
          { id: customOrderId },
          { gatewayOrderId: resource.id },
          { gatewayOrderId: customOrderId },
        ],
      });
      const amount = Number(resource.amount?.value);
      const currency = resource.amount?.currency_code;

      if (
        orderDoc &&
        resource.status === "COMPLETED" &&
        currency === "USD" &&
        Number.isFinite(amount) &&
        Math.round(amount * 100) === orderDoc.totalCents
      ) {
        if (orderDoc.status === "pending_payment") {
          orderDoc.transactionId = resource.id || orderDoc.transactionId;
        }
        await markOrderPaidAndNotify(orderDoc);
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("PayPal Webhook Error:", error.message);
    return res.status(500).json({ error: "PayPal webhook processing failed." });
  }
};

// 3. BOOMFI CRYPTO WEBHOOK
exports.handleBoomFiWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-boomfi-signature"] || req.headers["x-webhook-signature"];
    const timestamp = req.headers["x-boomfi-timestamp"];
    const publicKey = process.env.BOOMFI_WEBHOOK_PUBLIC_KEY?.replace(/\\n/g, "\n");
    const expectedOrgId = process.env.BOOMFI_ORG_ID;
    const timestampSeconds = Number(timestamp);

    if (!publicKey || !expectedOrgId) {
      return res.status(500).json({ error: "BoomFi webhook configuration is incomplete." });
    }

    if (
      !signature ||
      !timestamp ||
      !Number.isFinite(timestampSeconds) ||
      Math.abs(Date.now() / 1000 - timestampSeconds) > 300 ||
      !Buffer.isBuffer(req.rawBody)
    ) {
      return res.status(401).json({ error: "Invalid BoomFi webhook signature." });
    }

    const message = Buffer.concat([
      Buffer.from(`${timestamp}.`, "utf8"),
      req.rawBody,
    ]);
    let isValidSignature = false;
    try {
      isValidSignature = crypto.verify(
        "RSA-SHA256",
        message,
        publicKey,
        Buffer.from(signature, "base64"),
      );
    } catch {
      isValidSignature = false;
    }
    if (!isValidSignature) {
      return res.status(401).json({ error: "Invalid BoomFi webhook signature." });
    }

    const payload = req.body?.data || req.body || {};
    const orgId =
      req.body?.org_id ||
      req.body?.org?.id ||
      payload.org_id ||
      payload.org?.id;
    if (String(orgId || "") !== expectedOrgId) {
      return res.status(401).json({ error: "BoomFi webhook organisation does not match." });
    }

    const eventType = String(req.body?.event || "").toLowerCase();
    const status = String(payload.status || "").toLowerCase();
    const txRef =
      payload.metadata?.txReference ||
      payload.reference ||
      payload.paylink_id ||
      payload.id;

    if (eventType === "payment.updated" && status === "succeeded" && txRef) {
      const orderDoc = await Order.findOne({
        $or: [{ transactionId: txRef }, { gatewayOrderId: txRef }],
      });

      await markOrderPaidAndNotify(orderDoc);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("BoomFi Webhook Error:", error.message);
    return res.status(500).json({ error: "BoomFi webhook error." });
  }
};