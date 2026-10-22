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
  await expect(dock).toContainText("60 Links");
  await expect(dock).toContainText("$725.00 USD");
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
