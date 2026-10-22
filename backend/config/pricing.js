const SERVICES = {
  hp_post: { name: "Homepage Post", price: 1.0 },
  sidebar: { name: "Sidebar Blogroll", price: 2.0 },
  sticky: { name: "Homepage Sticky Post", price: 2.0 },
  id_hp_post: { name: ".ID Homepage Post", price: 2.0 },
  id_sidebar: { name: ".ID Sidebar Blogroll", price: 3.0 },
  id_sticky: { name: ".ID Sticky Post", price: 2.5 },
  hidden_links: { name: "Hidden Links (AC.ID, SCH.ID, GO.ID)", price: 20.0 },
  edu_post: { name: "EDU PBN Blogpost", price: 3.0 },
  edu_sidebar: { name: "EDU PBN Blogroll", price: 5.0 },
  complete_seo: { name: "Complete SEO Package", price: 5.0 },
  rank_first_page: { name: "Rank on First Page Campaign", price: 8.0 },
  custom_seo: { name: "Custom SEO Solutions", price: 4.0 },
};

// Map slugs to IDs so even if frontend sends a slug, backend prices it accurately
const SLUG_TO_ID_MAP = {
  "homepage-post": "hp_post",
  "sidebar-blogroll": "sidebar",
  "homepage-sticky-post": "sticky",
  "id-homepage-post": "id_hp_post",
  "id-sidebar-blogroll": "id_sidebar",
  "id-sticky-post": "id_sticky",
  "edu-gov-backlink": "hidden_links",
  "edu-pbn-blogpost": "edu_post",
  "edu-pbn-blogroll": "edu_sidebar",
  "complete-seo-package": "complete_seo",
  "rank-on-first-page": "rank_first_page",
  "custom-seo-solutions": "custom_seo",
};

const GUEST_POSTING_ID_PATTERN =
  /^guestpost_(30|40|50)_(30|40|50)_(general|igaming)_(1k|5k|10k|25k|50k)$/;
const GUEST_POSTING_BASE_PRICES = { general: 15, igaming: 30 };
const GUEST_POSTING_TRAFFIC_MULTIPLIERS = {
  "1k": 1,
  "5k": 2,
  "10k": 4,
  "25k": 8,
  "50k": 16,
};
const GUEST_POSTING_NICHE_LABELS = {
  general: "General",
  igaming: "iGaming",
};

const normaliseServiceId = (rawId = "") => {
  const clean = String(rawId || "").trim();
  return Object.prototype.hasOwnProperty.call(SLUG_TO_ID_MAP, clean)
    ? SLUG_TO_ID_MAP[clean]
    : clean;
};

const parseGuestPostingId = (id = "") => {
  if (typeof id !== "string") return null;
  const match = GUEST_POSTING_ID_PATTERN.exec(id.trim());
  if (!match) return null;

  const [, da, dr, niche, traffic] = match;
  const basePrice = GUEST_POSTING_BASE_PRICES[niche] || 0;
  const multiplier = GUEST_POSTING_TRAFFIC_MULTIPLIERS[traffic] || 1;
  const price = basePrice * multiplier;

  return {
    id: id.trim(),
    da,
    dr,
    niche,
    traffic,
    basePrice,
    multiplier,
    price,
    name: `Guest Posting (${GUEST_POSTING_NICHE_LABELS[niche] || niche} • DA/DR ${da}+)`,
    isGuestPost: true,
  };
};

const normaliseAndPriceCart = (rawCart = {}) => {
  if (!rawCart || typeof rawCart !== "object" || Array.isArray(rawCart)) {
    throw new Error("Cart must be a valid object of packageId: quantity.");
  }

  const pricedPackages = [];
  const normalisedCartMap = {};
  let totalAmount = 0;
  let totalLinks = 0;

  for (const [rawKey, rawQty] of Object.entries(rawCart)) {
    const qty = Number(rawQty);
    if (!Number.isInteger(qty) || qty <= 0) {
      throw new Error(`Invalid quantity for package "${rawKey}". Must be a positive integer.`);
    }

    const id = normaliseServiceId(rawKey);
    const standardSvc = Object.prototype.hasOwnProperty.call(SERVICES, id)
      ? SERVICES[id]
      : null;
    const guestPostSvc = parseGuestPostingId(id);

    if (!standardSvc && !guestPostSvc) {
      throw new Error(`Unrecognised or tampered package ID: "${rawKey}".`);
    }

    const maxAllowed = guestPostSvc ? 1000 : 5000;
    if (qty > maxAllowed) {
      throw new Error(`Quantity for "${id}" exceeds maximum limit (${maxAllowed}).`);
    }

    const unitPrice = standardSvc ? standardSvc.price : guestPostSvc.price;
    const itemName = standardSvc ? standardSvc.name : guestPostSvc.name;
    const subtotal = Number((unitPrice * qty).toFixed(2));

    normalisedCartMap[id] = (normalisedCartMap[id] || 0) + qty;
    totalAmount = Number((totalAmount + subtotal).toFixed(2));
    totalLinks += qty;

    pricedPackages.push({
      id,
      name: itemName,
      qty,
      price: unitPrice,
      subtotal,
      isGuestPost: Boolean(guestPostSvc),
    });
  }

  if (pricedPackages.length === 0 || totalAmount <= 0) {
    throw new Error("Cart cannot be empty.");
  }

  return {
    cartMap: normalisedCartMap,
    packages: pricedPackages,
    totalAmount,
    totalCents: Math.round(totalAmount * 100),
    totalLinks,
  };
};

module.exports = {
  SERVICES,
  parseGuestPostingId,
  normaliseAndPriceCart,
};