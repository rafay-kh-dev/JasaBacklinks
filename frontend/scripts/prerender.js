import { chromium } from "@playwright/test";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { loadEnv, preview } from "vite";
import { SERVICE_PAGES_DATA } from "../src/data/serviceCatalog.js";

const root = process.cwd();
const outputDirectory = path.join(root, "dist");
const env = loadEnv("production", root, "");
const siteUrl = (env.VITE_SITE_URL || "https://www.jasabacklinks.net").replace(
  /\/$/,
  "",
);
const sitemap = await readFile(
  path.join(root, "public", "sitemap.xml"),
  "utf8",
);
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
  ([, location]) => new URL(location),
);
if (
  sitemapUrls.length === 0 ||
  sitemapUrls.some((url) => url.origin !== new URL(siteUrl).origin)
) {
  throw new Error(
    `Sitemap URLs must use the configured canonical host ${siteUrl}`,
  );
}
const routes = new Set(
  sitemapUrls.map((url) => url.pathname.replace(/\/$/, "") || "/"),
);

for (const service of SERVICE_PAGES_DATA) {
  routes.add(`/services/${service.slug}`);
}

const server = await preview({
  preview: {
    host: "127.0.0.1",
    port: 4173,
    strictPort: true,
  },
  logLevel: "error",
});
const browser = await chromium.launch({ headless: true });

try {
  const renderedRoutes = [];

  for (const route of routes) {
    const page = await browser.newPage();
    await page.route("**/sdk/js**", (request) =>
      request.fulfill({
        status: 200,
        contentType: "application/javascript",
        body: `window.paypal = {
        Buttons: () => ({ render: () => Promise.resolve(), close: () => Promise.resolve(), isEligible: () => false }),
        FUNDING: { CARD: "card" },
      };`,
      }),
    );

    try {
      await page.goto(`http://127.0.0.1:4173${route}`, {
        waitUntil: "domcontentloaded",
        timeout: 60_000,
      });
      await page.waitForFunction(
        () =>
          document.querySelector("#root")?.innerText.trim().length > 100 &&
          document.querySelector('link[rel="canonical"]'),
        { timeout: 60_000 },
      );

      const canonicalLinks = page.locator('link[rel="canonical"]');
      const canonicalCount = await canonicalLinks.count();
      const canonical =
        canonicalCount === 1
          ? await canonicalLinks.first().getAttribute("href")
          : null;
      const expectedCanonical = `${siteUrl}${route === "/" ? "" : route}`;
      if (canonical !== expectedCanonical) {
        throw new Error(
          `Unexpected canonical for ${route}: expected one ${expectedCanonical}, received ${canonicalCount} link(s) with ${canonical}`,
        );
      }

      renderedRoutes.push({ route, html: await page.content() });
    } finally {
      await page.close();
    }
  }

  for (const { route, html } of renderedRoutes) {
    const outputPath =
      route === "/"
        ? path.join(outputDirectory, "index.html")
        : path.join(outputDirectory, `${route.slice(1)}.html`);
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, html);
    console.log(`Prerendered ${route}`);
  }
} finally {
  await browser.close();
  await new Promise((resolve, reject) => {
    server.httpServer.close((error) => (error ? reject(error) : resolve()));
  });
}
