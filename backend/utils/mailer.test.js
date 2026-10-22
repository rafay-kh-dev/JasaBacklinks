jest.mock("axios", () => ({ post: jest.fn().mockResolvedValue({}) }));

const axios = require("axios");
const { sendOrderEmailsIfReady } = require("./mailer");

describe("sendOrderEmailsIfReady", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.RESEND_API_KEY = "test-api-key";
    process.env.SENDER_EMAIL = "orders@example.com";
    process.env.ADMIN_EMAIL = "ops@example.com";
  });

  it("sends client and admin emails before marking them dispatched", async () => {
    const order = {
      customer: { email: "buyer@example.com", fullName: "Buyer" },
      transactionId: "capture-123",
      paymentMethod: "PayPal Checkout",
      totalLinks: 1,
      totalAmount: 1,
      packages: [],
      emailsDispatched: false,
      save: jest.fn().mockResolvedValue(undefined),
    };

    await sendOrderEmailsIfReady(order);

    expect(axios.post).toHaveBeenCalledTimes(2);
    expect(axios.post).toHaveBeenNthCalledWith(
      1,
      "https://api.resend.com/emails",
      expect.objectContaining({
        from: "orders@example.com",
        to: "buyer@example.com",
      }),
      expect.any(Object),
    );
    expect(axios.post).toHaveBeenNthCalledWith(
      2,
      "https://api.resend.com/emails",
      expect.objectContaining({ to: "ops@example.com" }),
      expect.any(Object),
    );
    expect(order.emailsDispatched).toBe(true);
    expect(order.save).toHaveBeenCalledTimes(1);
  });

  it("waits for campaign details and does not mark the order dispatched", async () => {
    const order = {
      customer: {},
      emailsDispatched: false,
      save: jest.fn(),
    };

    await sendOrderEmailsIfReady(order);

    expect(axios.post).not.toHaveBeenCalled();
    expect(order.emailsDispatched).toBe(false);
    expect(order.save).not.toHaveBeenCalled();
  });

  it("surfaces provider errors without marking emails dispatched", async () => {
    const order = {
      customer: { email: "buyer@example.com" },
      emailsDispatched: false,
      save: jest.fn(),
    };
    axios.post.mockRejectedValueOnce(new Error("Resend unavailable"));

    await expect(sendOrderEmailsIfReady(order)).rejects.toThrow(
      "Resend unavailable",
    );
    expect(order.emailsDispatched).toBe(false);
    expect(order.save).not.toHaveBeenCalled();
  });
});
