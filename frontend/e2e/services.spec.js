import { expect, test } from "@playwright/test";
import { SERVICE_PAGES_DATA } from "../src/data/serviceCatalog.js";

test.beforeEach(async ({ page }) => {
  await page.route(/paypal\.com\/sdk\/js/, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/javascript",
      body: `window.paypal = {
        Buttons: () => ({
          render: () => Promise.resolve(),
          close: () => Promise.resolve(),
          isEligible: () => false,
        }),
        FUNDING: { CARD: "card" },
      };`,
    }),
  );
});

test("builds a bundle with multiple Guest Posting configurations", async ({
  page,
}) => {
  await page.goto("/services");

  await page.getByRole("button", { name: "Add to Campaign", exact: true }).first().click();
  await page.getByRole("button", { name: "iGaming & Casino" }).click();
  await page.getByRole("button", { name: /10K\+ \$120/ }).click();
  await page.getByRole("button", { name: "Add to Campaign", exact: true }).first().click();

  const dock = page.locator("#campaign-checkout-dock");
  await expect(dock).toContainText("Guest Posting (General");
  await expect(dock).toContainText("Guest Posting (iGaming");
  await expect(dock).toContainText("3 Services");
  await expect(dock).toContainText("52 Links");
  await expect(dock).toContainText("$185.00 USD");
});

test("accessible service quantity control updates the checkout dock", async ({
  page,
}) => {
  await page.goto("/services");

  await page
    .getByRole("spinbutton", {
      name: "Homepage Post quantity",
      exact: true,
    })
    .fill("100");

  const dock = page.locator("#campaign-checkout-dock");
  await expect(dock).toContainText("100 Links");
  await expect(dock).toContainText("$100.00 USD");
});

test("mobile drawer locks page scroll and exposes its featured service and footer", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await page.getByRole("button", { name: "Toggle Menu" }).click();
  await expect(page.getByText("All SEO & PBN Services")).toBeVisible();
  await expect(page.getByRole("link", { name: /Guest Posting.*#1/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "Explore Packages" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Contact Us" })).toBeVisible();
  await expect
    .poll(() => page.locator("body").evaluate((body) => getComputedStyle(body).overflow))
    .toBe("hidden");

  await page.getByRole("button", { name: /All SEO & PBN Services/ }).click();
  await expect(page.getByText("Guest Posting (Real Traffic)")).toBeVisible();
});

test("floating widgets stay clear of mobile checkout bars", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  for (const route of ["/", "/services"]) {
    await page.goto(route);
    const bar = page.getByTestId(
      route === "/" ? "home-mobile-checkout-bar" : "services-mobile-checkout-bar",
    );
    await expect(bar).toBeVisible();
    if (route === "/services") {
      await expect(page.locator("main main")).toHaveCSS(
        "background-color",
        "rgb(255, 255, 255)",
      );
    }

    for (const widgetName of [
      "floating-contact-widget",
      "floating-review-widget",
    ]) {
      const widget = page.getByTestId(widgetName);
      await expect(widget).toBeVisible();
      const widgetBox = await widget.boundingBox();
      const barBox = await bar.boundingBox();
      expect(widgetBox.y + widgetBox.height).toBeLessThan(barBox.y);
      expect(Math.abs(page.viewportSize().height - widgetBox.y - widgetBox.height - 96))
        .toBeLessThanOrEqual(1);
    }
  }
});

test("home calculator contains all 13 services and configurable Guest Posting", async ({
  page,
}) => {
  await page.goto("/");

  const calculator = page.locator("#estimator");
  await expect(
    calculator.getByRole("button", { name: "All Placements (13)" }),
  ).toBeVisible();
  for (const serviceName of [
    "Guest Posting",
    "Complete SEO Package",
    "Rank on First Page",
    "Custom SEO Solutions",
  ]) {
    await expect(calculator.getByText(serviceName, { exact: false }).first()).toBeVisible();
  }

  await calculator.getByLabel("Guest Posting niche").selectOption("igaming");
  await calculator.getByLabel("Guest Posting traffic").selectOption("1k");
  await expect(calculator).toContainText("$30.00/link");
  await calculator
    .getByRole("spinbutton", { name: "Guest Posting quantity" })
    .fill("1");
  await expect(
    calculator.getByRole("spinbutton", { name: "Guest Posting quantity" }),
  ).toHaveValue("1");
  await expect(calculator).toContainText("$30.00/link");

  const completeSeoQty = calculator.getByRole("spinbutton", {
    name: "Complete SEO Package quantity",
  });
  await completeSeoQty.fill("1");
  await expect(completeSeoQty).toHaveValue("500");
  await expect(calculator.getByText("$250.00", { exact: true }).first()).toBeVisible();
  await expect(calculator).toContainText("Guest Posting (iGaming");
});

test("service detail has dynamic metadata, schema, and labeled quantity controls", async ({
  page,
}) => {
  await page.goto("/services/guest-posting");

  await expect(page).toHaveTitle(/Premium Guest Posting/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/services\/guest-posting$/,
  );
  const schemaTypes = await page
    .locator("#jasa-jsonld-schema")
    .evaluate((script) =>
      JSON.parse(script.textContent)["@graph"].map(
        (item) => item["@type"],
      ),
    );
  expect(schemaTypes).toContain("FAQPage");
  await expect(
    page.getByRole("spinbutton", { name: "Guest Posting quantity" }),
  ).toBeVisible();
});

test("Complete SEO Package enforces the 500-link minimum and $0.50 link price", async ({
  page,
}) => {
  await page.goto("/services/complete-seo-package");

  const quantity = page.getByRole("spinbutton", {
    name: "Complete SEO Package quantity",
  });
  await expect(quantity).toHaveAttribute("min", "500");
  await expect(quantity).toHaveValue("500");
  await expect(page.getByText("$0.50", { exact: false }).first()).toBeVisible();
  for (const belowMinimumPreset of ["50", "100", "250"]) {
    await expect(
      page.getByRole("button", { name: belowMinimumPreset, exact: true }),
    ).toHaveCount(0);
  }
  for (const validPreset of ["500", "1k", "2000", "3000", "5000"]) {
    await expect(
      page.getByRole("button", { name: validPreset, exact: true }),
    ).toBeVisible();
  }
});

test("all service catalogue routes load with service structured data", async ({
  page,
}) => {
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  for (const service of SERVICE_PAGES_DATA) {
    await page.goto(`/services/${service.slug}`);
    await expect(page).toHaveTitle(/\S+/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      new RegExp(`/services/${service.slug}$`),
    );

    const hasServiceSchema = await page
      .locator("#jasa-jsonld-schema")
      .evaluate((script) =>
        JSON.parse(script.textContent)["@graph"].some(
          (item) =>
            Array.isArray(item["@type"]) &&
            item["@type"].includes("Service") &&
            item["@type"].includes("Product"),
        ),
      );
    expect(hasServiceSchema, service.slug).toBe(true);
  }

  expect(pageErrors).toEqual([]);
});

test("recovers paid orders and opens Step 2 on every checkout route", async ({
  browser,
}) => {
  const recoveryRoutes = [
    { path: "/", serviceId: "home" },
    { path: "/services", serviceId: "services" },
    { path: "/services/id-sidebar-blogroll", serviceId: "id-sidebar-blogroll" },
  ];

  for (const [index, recovery] of recoveryRoutes.entries()) {
    const transactionId = `recovery-test-${index}`;
    const context = await browser.newContext();
    const recoveryPage = await context.newPage();
    let sessionRequestCount = 0;
    await context.route(/paypal\.com\/sdk\/js/, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/javascript",
        body: `window.paypal = {
          Buttons: () => ({
            render: () => Promise.resolve(),
            close: () => Promise.resolve(),
            isEligible: () => false,
          }),
          FUNDING: { CARD: "card" },
        };`,
      }),
    );
    await context.route("**/api/payments/session/**", async (route) => {
      sessionRequestCount += 1;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          transactionId,
          status: "paid_pending_details",
          paymentMethod: "PayPal Checkout",
          cart: { id_sidebar: 50 },
        }),
      });
    });
    await recoveryPage.addInitScript(
      ({ transactionId, serviceId }) => {
        if (!localStorage.getItem("jasa_pending_payment")) {
          localStorage.setItem(
            "jasa_pending_payment",
            JSON.stringify({
              transactionId,
              serviceId,
              gateway: "paypal",
              status: "pending",
              timestamp: Date.now() - 24 * 60 * 60 * 1000,
            }),
          );
        }
      },
      { transactionId, serviceId: recovery.serviceId },
    );

    await recoveryPage.goto(recovery.path);
    await expect.poll(() => sessionRequestCount).toBeGreaterThan(0);
    await expect
      .poll(() => new URL(recoveryPage.url()).pathname)
      .toBe(recovery.path);
    await expect(
      recoveryPage.getByText("Step 2 of 3", { exact: true }),
    ).toBeVisible();
    await expect
      .poll(async () =>
        recoveryPage.evaluate(() => {
          const payment = JSON.parse(
            localStorage.getItem("jasa_pending_payment"),
          );
          return payment?.status === "paid" && Number.isFinite(payment.verifiedAt);
        }),
      )
      .toBe(true);
    await expect(recoveryPage.locator("body")).toHaveCSS(
      "overflow",
      "hidden",
    );
    await context.close();
  }
});
