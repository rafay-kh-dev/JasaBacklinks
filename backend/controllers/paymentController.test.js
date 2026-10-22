jest.mock("axios", () => ({ post: jest.fn() }));
jest.mock("../models/Order", () => ({
  create: jest.fn(),
  findOne: jest.fn(),
}));
jest.mock("../utils/mailer", () => ({ sendOrderEmailsIfReady: jest.fn() }));
jest.mock("stripe", () =>
  jest.fn(() => ({ paymentIntents: { create: jest.fn() } })),
);

const originalStripeSecretKey = process.env.STRIPE_SECRET_KEY;
process.env.STRIPE_SECRET_KEY = "test-stripe-secret";
const axios = require("axios");
const Stripe = require("stripe");
const Order = require("../models/Order");
const {
  createBoomFiCharge,
  createPayPalOrder,
  createStripeIntent,
  submitOrderDetails,
} = require("./paymentController");
const stripeClient = Stripe.mock.results[0].value;

const originalBoomFiApiKey = process.env.BOOMFI_API_KEY;

function createResponse() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
}

describe("createBoomFiCharge redirect origins", () => {
  beforeEach(() => {
    process.env.BOOMFI_API_KEY = "test-api-key";
    process.env.PAYPAL_CLIENT_ID = "test-paypal-client";
    process.env.PAYPAL_CLIENT_SECRET = "test-paypal-secret";
    axios.post.mockReset();
    Order.create.mockReset();
    Order.findOne.mockReset();
    stripeClient.paymentIntents.create.mockReset();
  });

  afterAll(() => {
    if (originalBoomFiApiKey === undefined) {
      delete process.env.BOOMFI_API_KEY;
    } else {
      process.env.BOOMFI_API_KEY = originalBoomFiApiKey;
    }
    if (originalStripeSecretKey === undefined) {
      delete process.env.STRIPE_SECRET_KEY;
    } else {
      process.env.STRIPE_SECRET_KEY = originalStripeSecretKey;
    }
  });

  it("creates a Stripe intent and persists a pending order", async () => {
    stripeClient.paymentIntents.create.mockResolvedValue({
      id: "pi_test",
      client_secret: "pi_test_secret",
    });
    Order.create.mockResolvedValue({});
    const res = createResponse();

    await createStripeIntent(
      { validatedBody: { cart: { hp_post: 2 } } },
      res,
    );

    expect(Order.create).toHaveBeenCalledWith(
      expect.objectContaining({
        transactionId: "pi_test",
        status: "pending_payment",
        totalCents: 200,
      }),
    );
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ clientSecret: "pi_test_secret", total: 2 }),
    );
  });

  it("rejects order details while a BoomFi payment is still pending", async () => {
    const pendingOrder = {
      status: "pending_payment",
      paymentMethod: "BoomFi Crypto Gateway",
      save: jest.fn(),
    };
    Order.findOne.mockResolvedValue(pendingOrder);
    const res = createResponse();

    await submitOrderDetails(
      {
        validatedBody: {
          transactionId: "pending-boomfi-tx",
          customer: { fullName: "Test Customer" },
        },
      },
      res,
    );

    expect(res.status).toHaveBeenCalledWith(402);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.stringContaining("Payment has not been confirmed"),
      }),
    );
    expect(pendingOrder.save).not.toHaveBeenCalled();
  });

  it("creates a PayPal order and persists it pending capture", async () => {
    axios.post.mockImplementation((url) => {
      if (url.endsWith("/v1/oauth2/token")) {
        return Promise.resolve({ data: { access_token: "paypal-access-token" } });
      }
      return Promise.resolve({ data: { id: "paypal-order-id" } });
    });
    Order.create.mockResolvedValue({});
    const res = createResponse();

    await createPayPalOrder(
      { validatedBody: { cart: { hp_post: 2 } } },
      res,
    );

    expect(Order.create).toHaveBeenCalledWith(
      expect.objectContaining({
        transactionId: "paypal-order-id",
        status: "pending_payment",
        totalCents: 200,
      }),
    );
    expect(res.json).toHaveBeenCalledWith({
      id: "paypal-order-id",
      total: 2,
    });
  });

  it("rejects client-supplied redirect origins outside the frontend allowlist", async () => {
    const res = createResponse();

    await createBoomFiCharge(
      {
        validatedBody: {
          cart: { hp_post: 1 },
          originUrl: "https://attacker.example/services/guest-posting",
        },
        headers: {},
      },
      res,
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "BoomFi return URL origin is not allowed.",
    });
    expect(axios.post).not.toHaveBeenCalled();
    expect(Order.create).not.toHaveBeenCalled();
  });

  it("preserves the path on an approved frontend origin and saves a pending order", async () => {
    axios.post.mockResolvedValue({
      data: {
        data: {
          id: "boomfi-link-id",
          url: "https://pay.boomfi.xyz/boomfi-link-id",
        },
      },
    });
    Order.create.mockResolvedValue({});
    const res = createResponse();

    await createBoomFiCharge(
      {
        validatedBody: {
          cart: { hp_post: 1 },
          originUrl: "https://www.jasabacklinks.net/services/guest-posting",
        },
        headers: {},
      },
      res,
    );

    const payload = axios.post.mock.calls[0][1];
    expect(payload.after_completion.redirect_url).toMatch(
      /^https:\/\/www\.jasabacklinks\.net\/services\/guest-posting\/\?boomfi_status=success&tx=/,
    );
    expect(payload.after_completion.failure_redirect_url).toMatch(
      /^https:\/\/www\.jasabacklinks\.net\/services\/guest-posting\/\?boomfi_status=failed&tx=/,
    );
    expect(Order.create).toHaveBeenCalledWith(
      expect.objectContaining({ status: "pending_payment" }),
    );
  });
});
