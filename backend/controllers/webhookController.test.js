const crypto = require("crypto");

jest.mock("axios", () => ({ post: jest.fn() }));
jest.mock("../models/Order", () => ({ findOne: jest.fn() }));
jest.mock("stripe", () => {
  const constructEvent = jest.fn();
  const stripeFactory = jest.fn(() => ({ webhooks: { constructEvent } }));
  stripeFactory.constructEvent = constructEvent;
  return stripeFactory;
});
jest.mock("../utils/mailer", () => ({
  sendOrderEmailsIfReady: jest.fn().mockResolvedValue(undefined),
}));

const axios = require("axios");
const Order = require("../models/Order");
const Stripe = require("stripe");
const { sendOrderEmailsIfReady } = require("../utils/mailer");
process.env.STRIPE_SECRET_KEY = "test-stripe-key";
process.env.STRIPE_WEBHOOK_SECRET = "test-webhook-secret";
const webhookController = require("./webhookController");

const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
});
process.env.BOOMFI_WEBHOOK_PUBLIC_KEY = publicKey
  .export({ type: "spki", format: "pem" })
  .toString();
process.env.BOOMFI_ORG_ID = "test-org-id";
process.env.PAYPAL_WEBHOOK_ID = "test-webhook-id";
process.env.PAYPAL_CLIENT_ID = "test-client-id";
process.env.PAYPAL_CLIENT_SECRET = "test-client-secret";

function createOrder() {
  return {
    status: "pending_payment",
    totalCents: 100,
    customer: {},
    save: jest.fn().mockResolvedValue(undefined),
  };
}

function createResponse() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
}

function signBoomFiBody(body, timestamp) {
  const rawBody = Buffer.from(JSON.stringify(body));
  const message = Buffer.concat([
    Buffer.from(`${timestamp}.`, "utf8"),
    rawBody,
  ]);

  return {
    rawBody,
    signature: crypto.sign("RSA-SHA256", message, privateKey).toString("base64"),
  };
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Stripe webhook", () => {
  it("only marks an order paid for the expected USD amount", async () => {
    const order = createOrder();
    Order.findOne.mockResolvedValue(order);
    Stripe.constructEvent.mockReturnValue({
      type: "payment_intent.succeeded",
      data: {
        object: {
          id: "payment-intent-id",
          amount: 100,
          currency: "usd",
          metadata: { orderId: "internal-order-id" },
        },
      },
    });
    const res = createResponse();

    await webhookController.handleStripeWebhook(
      { headers: { "stripe-signature": "signature" }, body: Buffer.from("{}") },
      res,
    );

    expect(order.status).toBe("paid_pending_details");
    expect(order.save).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ received: true });
  });

  it("does not mark a Stripe payment with a mismatched amount paid", async () => {
    const order = createOrder();
    Order.findOne.mockResolvedValue(order);
    Stripe.constructEvent.mockReturnValue({
      type: "payment_intent.succeeded",
      data: {
        object: {
          id: "payment-intent-id",
          amount: 99,
          currency: "usd",
          metadata: { orderId: "internal-order-id" },
        },
      },
    });
    const res = createResponse();

    await webhookController.handleStripeWebhook(
      { headers: { "stripe-signature": "signature" }, body: Buffer.from("{}") },
      res,
    );

    expect(order.status).toBe("pending_payment");
    expect(order.save).not.toHaveBeenCalled();
  });
});

describe("PayPal webhook", () => {
  const paypalHeaders = {
    "paypal-transmission-id": "transmission-id",
    "paypal-transmission-time": "2026-10-21T10:00:00Z",
    "paypal-cert-url": "https://api.paypal.com/cert",
    "paypal-auth-algo": "SHA256withRSA",
    "paypal-transmission-sig": "signature",
  };

  function mockPayPalVerification(verificationStatus = "SUCCESS") {
    axios.post
      .mockResolvedValueOnce({ data: { access_token: "access-token" } })
      .mockResolvedValueOnce({
        data: { verification_status: verificationStatus },
      });
  }

  it("marks a verified completed capture paid only when its amount matches", async () => {
    const order = createOrder();
    Order.findOne.mockResolvedValue(order);
    mockPayPalVerification();
    const req = {
      headers: paypalHeaders,
      body: {
        event_type: "PAYMENT.CAPTURE.COMPLETED",
        resource: {
          id: "capture-id",
          status: "COMPLETED",
          custom_id: "internal-order-id",
          amount: { value: "1.00", currency_code: "USD" },
        },
      },
    };
    const res = createResponse();

    await webhookController.handlePayPalWebhook(req, res);

    expect(axios.post).toHaveBeenCalledTimes(2);
    expect(Order.findOne).toHaveBeenCalledWith(
      expect.objectContaining({ $or: expect.any(Array) }),
    );
    expect(order.status).toBe("paid_pending_details");
    expect(order.transactionId).toBe("capture-id");
    expect(order.save).toHaveBeenCalledTimes(1);
    expect(sendOrderEmailsIfReady).toHaveBeenCalledWith(order);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("rejects a PayPal event whose signature is not verified", async () => {
    mockPayPalVerification("FAILURE");
    const res = createResponse();

    await webhookController.handlePayPalWebhook(
      { headers: paypalHeaders, body: { event_type: "PAYMENT.CAPTURE.COMPLETED" } },
      res,
    );

    expect(res.status).toHaveBeenCalledWith(401);
    expect(Order.findOne).not.toHaveBeenCalled();
  });

  it("does not treat order approval as a completed payment", async () => {
    mockPayPalVerification();
    const res = createResponse();

    await webhookController.handlePayPalWebhook(
      { headers: paypalHeaders, body: { event_type: "CHECKOUT.ORDER.APPROVED" } },
      res,
    );

    expect(Order.findOne).not.toHaveBeenCalled();
  });

  it("does not mark a capture paid when its currency or amount differs", async () => {
    const order = createOrder();
    Order.findOne.mockResolvedValue(order);
    mockPayPalVerification();
    const res = createResponse();

    await webhookController.handlePayPalWebhook(
      {
        headers: paypalHeaders,
        body: {
          event_type: "PAYMENT.CAPTURE.COMPLETED",
          resource: {
            id: "capture-id",
            status: "COMPLETED",
            custom_id: "internal-order-id",
            amount: { value: "1.00", currency_code: "EUR" },
          },
        },
      },
      res,
    );

    expect(order.status).toBe("pending_payment");
    expect(order.save).not.toHaveBeenCalled();
  });
});

describe("BoomFi webhook", () => {
  it("updates an order only for a fresh, valid RSA-signed raw request", async () => {
    const order = createOrder();
    Order.findOne.mockResolvedValue(order);
    const body = {
      event: "Payment.Updated",
      org_id: "test-org-id",
      data: {
        status: "Succeeded",
        metadata: { txReference: "BF-123" },
      },
    };
    const timestamp = String(Math.floor(Date.now() / 1000));
    const signed = signBoomFiBody(body, timestamp);
    const res = createResponse();

    await webhookController.handleBoomFiWebhook(
      {
        headers: {
          "x-boomfi-timestamp": timestamp,
          "x-boomfi-signature": signed.signature,
        },
        rawBody: signed.rawBody,
        body,
      },
      res,
    );

    expect(order.status).toBe("paid_pending_details");
    expect(order.save).toHaveBeenCalledTimes(1);
    expect(sendOrderEmailsIfReady).toHaveBeenCalledWith(order);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("retries failed post-payment email dispatch on a duplicate webhook", async () => {
    const order = createOrder();
    Order.findOne.mockResolvedValue(order);
    sendOrderEmailsIfReady.mockRejectedValueOnce(new Error("Email provider down"));
    const body = {
      event: "Payment.Updated",
      org_id: "test-org-id",
      data: {
        status: "Succeeded",
        metadata: { txReference: "BF-123" },
      },
    };
    const timestamp = String(Math.floor(Date.now() / 1000));
    const signed = signBoomFiBody(body, timestamp);
    const req = {
      headers: {
        "x-boomfi-timestamp": timestamp,
        "x-boomfi-signature": signed.signature,
      },
      rawBody: signed.rawBody,
      body,
    };
    const firstResponse = createResponse();

    await webhookController.handleBoomFiWebhook(req, firstResponse);
    const retryResponse = createResponse();
    await webhookController.handleBoomFiWebhook(req, retryResponse);

    expect(order.status).toBe("paid_pending_details");
    expect(order.save).toHaveBeenCalledTimes(1);
    expect(sendOrderEmailsIfReady).toHaveBeenCalledTimes(2);
    expect(firstResponse.status).toHaveBeenCalledWith(500);
    expect(retryResponse.status).toHaveBeenCalledWith(200);
  });

  it.each(["missing", "invalid", "stale"])(
    "rejects a %s signature before looking up orders",
    async (signatureState) => {
      const body = {
        event: "Payment.Updated",
        org_id: "test-org-id",
        data: { status: "Succeeded", reference: "BF-123" },
      };
      const timestamp =
        signatureState === "stale"
          ? String(Math.floor(Date.now() / 1000) - 301)
          : String(Math.floor(Date.now() / 1000));
      const signed = signBoomFiBody(body, timestamp);
      const signature =
        signatureState === "missing"
          ? undefined
          : signatureState === "invalid"
            ? "not-a-valid-signature"
            : signed.signature;
      const res = createResponse();
      const headers = { "x-boomfi-timestamp": timestamp };
      if (signature) headers["x-boomfi-signature"] = signature;

      await webhookController.handleBoomFiWebhook(
        { headers, rawBody: signed.rawBody, body },
        res,
      );

      expect(res.status).toHaveBeenCalledWith(401);
      expect(Order.findOne).not.toHaveBeenCalled();
    },
  );
});
