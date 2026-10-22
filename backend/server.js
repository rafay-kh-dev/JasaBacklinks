require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const mongoose = require("mongoose");
const { corsOptions } = require("./config/corsOptions");
const { apiLimiter, checkoutLimiter } = require("./middlewares/rateLimiter");
const webhookController = require("./controllers/webhookController");
const paymentController = require("./controllers/paymentController");
const {
  validateBody,
  cartSchema,
  submitOrderSchema,
} = require("./middlewares/validate");

const app = express();

// 1. SECURITY HEADERS & STRICT CORS WHITELIST
app.use(helmet());
app.use(cors(corsOptions));

// 2. STRIPE WEBHOOK MUST RECEIVE RAW BODY BEFORE express.json()
app.post(
  "/api/webhooks/stripe",
  express.raw({ type: "application/json" }),
  webhookController.handleStripeWebhook
);

// 3. STANDARD JSON PARSER & GLOBAL RATE LIMITER
app.use(
  express.json({
    limit: "15mb",
    verify: (req, res, buffer) => {
      if (req.path === "/api/webhooks/boomfi") {
        req.rawBody = Buffer.from(buffer);
      }
    },
  })
);
app.use(express.urlencoded({ extended: true, limit: "15mb" }));
app.use("/api", apiLimiter);

// 4. HEALTH CHECK FOR RENDER & UPTIMEROBOT
app.get("/", (req, res) => {
  res.status(200).send("Jasa Backlinks API is Live and Running!");
});

// 5. PAYPAL & BOOMFI WEBHOOKS
app.post("/api/webhooks/paypal", webhookController.handlePayPalWebhook);
app.post("/api/webhooks/boomfi", webhookController.handleBoomFiWebhook);

// 6. CHECKOUT & ORDER ROUTES (With Zod Validation & Rate Limiting)
app.post(
  "/api/create-stripe-intent",
  checkoutLimiter,
  validateBody(cartSchema),
  paymentController.createStripeIntent
);
app.post(
  "/api/create-paypal-order",
  checkoutLimiter,
  validateBody(cartSchema),
  paymentController.createPayPalOrder
);
app.post(
  "/api/capture-paypal-order",
  checkoutLimiter,
  paymentController.capturePayPalOrder
);
app.post(
  "/api/create-boomfi-charge",
  checkoutLimiter,
  validateBody(cartSchema),
  paymentController.createBoomFiCharge
);
app.get(
  "/api/payments/session/:transactionId",
  paymentController.getPaymentSession
);
app.post(
  "/api/submit-order",
  validateBody(submitOrderSchema),
  paymentController.submitOrderDetails
);

// 7. DATABASE CONNECTION (NO HARDCODED FALLBACK CREDENTIALS)
if (!process.env.MONGODB_URI) {
  console.error("❌ CRITICAL: MONGODB_URI is missing in .env!");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Enterprise MVC Backend running on port ${PORT}`);
});