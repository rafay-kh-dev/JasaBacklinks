# Jasa Backlinks frontend

## Development and verification

From this directory:

```sh
npm run dev
npm run lint
npm run test:unit
npm run test:e2e
npm run build
```

Install the Playwright Chromium browser once before running browser tests:

```sh
npx playwright install chromium
```

The browser suite checks the campaign builder, mobile navigation, accessible
quantity controls, and service SEO metadata. It stubs the PayPal SDK request.
Backend payment-session tests mock provider API responses; verify Stripe,
PayPal, and BoomFi against provider sandbox credentials separately before
production release.

Route components are loaded on demand so visitors download only the code
required for the page they open.

Production builds prerender the sitemap routes and every service detail route
into static HTML with route-specific metadata without requiring a browser
binary or system packages. If `VITE_SITE_URL` is set, it must match the
canonical host used in `public/sitemap.xml`.
