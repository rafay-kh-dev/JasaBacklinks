export const GUEST_POSTING_OPTIONS = {
  authorityTiers: ["30", "40", "50"],
  niches: [
    {
      id: "general",
      label: "General",
      cardLabel: "General Niche",
      shortLabel: "General",
      basePrice: 15,
    },
    {
      id: "igaming",
      label: "iGaming",
      cardLabel: "iGaming & Casino",
      shortLabel: "iGaming",
      basePrice: 30,
    },
  ],
  trafficTiers: [
    { id: "1k", label: "1K+", fullLabel: "1,000+ Traffic", multiplier: 1 },
    { id: "5k", label: "5K+", fullLabel: "5,000+ Traffic", multiplier: 2 },
    { id: "10k", label: "10K+", fullLabel: "10,000+ Traffic", multiplier: 4 },
    { id: "25k", label: "25K+", fullLabel: "25,000+ Traffic", multiplier: 8 },
    { id: "50k", label: "50K+", fullLabel: "50,000+ Traffic", multiplier: 16 },
  ],
};

export const getGuestPostingPrice = ({ niche, traffic }) => {
  const nicheOption =
    GUEST_POSTING_OPTIONS.niches.find((option) => option.id === niche) ||
    GUEST_POSTING_OPTIONS.niches[0];
  const trafficOption =
    GUEST_POSTING_OPTIONS.trafficTiers.find(
      (option) => option.id === traffic,
    ) || GUEST_POSTING_OPTIONS.trafficTiers[0];

  return nicheOption.basePrice * trafficOption.multiplier;
};

export const getGuestPostingItem = (id) => {
  const match =
    /^guestpost_(30|40|50)_(30|40|50)_(general|igaming)_(1k|5k|10k|25k|50k)$/.exec(
      id,
    );
  if (!match) return null;

  const [, da, dr, niche, traffic] = match;
  const nicheOption = GUEST_POSTING_OPTIONS.niches.find(
    (option) => option.id === niche,
  );
  const trafficOption = GUEST_POSTING_OPTIONS.trafficTiers.find(
    (option) => option.id === traffic,
  );
  if (!nicheOption || !trafficOption) return null;

  return {
    id,
    name: `Guest Posting (${nicheOption.shortLabel} • DA/DR ${da}+)`,
    detail: trafficOption.fullLabel,
    price: getGuestPostingPrice({ niche, traffic }),
    da,
    dr,
    niche,
    traffic,
  };
};
