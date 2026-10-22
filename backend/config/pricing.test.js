const { normaliseAndPriceCart } = require("./pricing");

describe("normaliseAndPriceCart", () => {
  it("prices supported service IDs and slugs on the server", () => {
    const result = normaliseAndPriceCart({
      hp_post: 2,
      "sidebar-blogroll": "1",
    });

    expect(result.totalAmount).toBe(4);
    expect(result.totalCents).toBe(400);
    expect(result.cartMap).toEqual({ hp_post: 2, sidebar: 1 });
  });

  it.each(["constructor", "toString", "__proto__"])(
    "rejects inherited object properties as service IDs (%s)",
    (serviceId) => {
      expect(() => normaliseAndPriceCart({ [serviceId]: 1 })).toThrow(
        /Unrecognised or tampered package ID/,
      );
    },
  );

  it("rejects invalid quantities and unsupported IDs", () => {
    expect(() => normaliseAndPriceCart({ hp_post: 0 })).toThrow(
      /positive integer/,
    );
    expect(() => normaliseAndPriceCart({ client_price: 1 })).toThrow(
      /Unrecognised or tampered package ID/,
    );
  });

  it("calculates guest posting prices from the server-side tier", () => {
    const result = normaliseAndPriceCart({
      guestpost_30_50_igaming_10k: 2,
    });

    expect(result.totalAmount).toBe(240);
    expect(result.packages[0]).toMatchObject({
      price: 120,
      subtotal: 240,
      isGuestPost: true,
    });
  });
});
