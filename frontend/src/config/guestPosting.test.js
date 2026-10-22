import assert from "node:assert/strict";
import test from "node:test";
import {
  GUEST_POSTING_OPTIONS,
  getGuestPostingItem,
  getGuestPostingPrice,
} from "./guestPosting.js";

test("prices every niche and traffic tier consistently", () => {
  for (const niche of GUEST_POSTING_OPTIONS.niches) {
    for (const traffic of GUEST_POSTING_OPTIONS.trafficTiers) {
      assert.equal(
        getGuestPostingPrice({ niche: niche.id, traffic: traffic.id }),
        niche.basePrice * traffic.multiplier,
      );
    }
  }
});

test("Guest Posting IDs retain DA/DR metadata without affecting pricing", () => {
  for (const authority of GUEST_POSTING_OPTIONS.authorityTiers) {
    const item = getGuestPostingItem(
      `guestpost_${authority}_${authority}_igaming_10k`,
    );
    assert.equal(item.price, 120);
    assert.equal(item.da, authority);
    assert.equal(item.dr, authority);
  }
});

test("rejects malformed Guest Posting cart IDs", () => {
  assert.equal(getGuestPostingItem("guestpost_99_99_general_1k"), null);
  assert.equal(getGuestPostingItem("guestpost_30_30_general_unknown"), null);
});
