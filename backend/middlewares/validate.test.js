const {
  cartSchema,
  submitOrderSchema,
  validateBody,
} = require("./validate");

describe("checkout request validation", () => {
  it("accepts cart quantities as numbers or numeric strings", () => {
    expect(
      cartSchema.safeParse({
        cart: { hp_post: 2, sidebar: "1" },
        originUrl: "https://www.jasabacklinks.net",
      }).success,
    ).toBe(true);
  });

  it("rejects unsupported quantity types and invalid campaign details", () => {
    expect(cartSchema.safeParse({ cart: { hp_post: null } }).success).toBe(
      false,
    );
    expect(
      submitOrderSchema.safeParse({
        transactionId: "transaction-123",
        customer: {
          fullName: "A",
          email: "invalid",
          contactHandle: "",
          targetUrls: "",
          anchorTexts: "",
        },
      }).success,
    ).toBe(false);
  });

  it("returns a 400 with the first validation issue and does not continue", () => {
    const req = { body: { cart: { hp_post: null } } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    validateBody(cartSchema)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.stringContaining("cart"),
      }),
    );
    expect(next).not.toHaveBeenCalled();
  });
});
