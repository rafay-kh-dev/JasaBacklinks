jest.mock("axios", () => ({ post: jest.fn().mockResolvedValue({}) }));

const axios = require("axios");
const { sendContactEnquiry, sendOrderEmailsIfReady } = require("./mailer");

describe("sendOrderEmailsIfReady", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.RESEND_API_KEY = "test-api-key";
    process.env.SENDER_EMAIL = "orders@example.com";
    process.env.ADMIN_EMAIL = "ops@example.com";
  });

  describe("sendContactEnquiry", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      process.env.RESEND_API_KEY = "test-api-key";
      process.env.SENDER_EMAIL = "hello@example.com";
      process.env.ADMIN_EMAIL = "ops@example.com";
    });

    it("sends an escaped admin notification and client confirmation", async () => {
      await sendContactEnquiry({
        enquiryType: "General Enquiry",
        fullName: "<img src=x onerror=alert(1)>",
        email: "client@example.com",
        contactPlatform: "WhatsApp",
        contactHandle: "+44 123456789",
        volumeTier: "50 – 250 Links",
        websiteUrl: "https://example.com",
        message: "<script>alert(1)</script>",
      });

      expect(axios.post).toHaveBeenCalledTimes(2);
      const adminEmail = axios.post.mock.calls[0][1];
      const clientEmail = axios.post.mock.calls[1][1];
      expect(adminEmail).toMatchObject({
        to: "ops@example.com",
        reply_to: "client@example.com",
      });
      expect(adminEmail.html).toContain("&lt;img src=x onerror=alert(1)&gt;");
      expect(adminEmail.html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
      expect(clientEmail).toMatchObject({
        to: "client@example.com",
        reply_to: "hello@example.com",
      });
      expect(clientEmail.html).toContain(
        "&lt;script&gt;alert(1)&lt;/script&gt;",
      );
    });
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
