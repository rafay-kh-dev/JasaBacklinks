const { normaliseAndPriceCart } = require("./pricing");

describe("normaliseAndPriceCart", () => {
  it("prices supported service IDs and slugs on the server", () => {
    const result = normaliseAndPriceCart({
      hp_post: 50,
      "sidebar-blogroll": "50",
    });

    expect(result.totalAmount).toBe(150);
    expect(result.totalCents).toBe(15000);
    expect(result.cartMap).toEqual({ hp_post: 50, sidebar: 50 });
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

  it("enforces package minimums and prices Complete SEO at $0.50 per link", () => {
    expect(() => normaliseAndPriceCart({ hp_post: 49 })).toThrow(
      /minimum limit \(50\)/,
    );
    expect(() => normaliseAndPriceCart({ complete_seo: 499 })).toThrow(
      /minimum limit \(500\)/,
    );

    const result = normaliseAndPriceCart({ complete_seo: 500 });
    expect(result.totalAmount).toBe(250);
    expect(result.totalCents).toBe(25000);
    expect(result.packages[0]).toMatchObject({
      price: 0.5,
      qty: 500,
      subtotal: 250,
    });
  });

  it("calculates guest posting prices from the server-side tier", () => {
    const result = normaliseAndPriceCart({
      guestpost_30_50_igaming_10k: 1,
    });

    expect(result.totalAmount).toBe(120);
    expect(result.packages[0]).toMatchObject({
      price: 120,
      qty: 1,
      subtotal: 120,
      isGuestPost: true,
    });
  });
});
