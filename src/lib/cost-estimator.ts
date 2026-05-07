// ============================================================
// Cost Estimator — bathroom / kitchen remodels (US, 2026 figures)
//
// Pure functions only. No I/O. Easy to unit-test and swap with a
// vision-AI backend later.
// ============================================================

export type ProjectType = "bathroom" | "kitchen" | "roofing" | "painting";
export type Tier = "basic" | "mid" | "premium";

// National-average cost ranges (2026 dollars).
const BASE_RANGES: Record<ProjectType, Record<Tier, [number, number]>> = {
  bathroom: {
    basic: [5_000, 15_000],
    mid: [15_000, 35_000],
    premium: [35_000, 80_000],
  },
  kitchen: {
    basic: [15_000, 30_000],
    mid: [30_000, 75_000],
    premium: [75_000, 150_000],
  },
  roofing: {
    basic: [5_000, 15_000],     // 3-tab asphalt, like-for-like
    mid: [10_000, 25_000],      // architectural / dimensional shingles
    premium: [25_000, 80_000],  // metal, slate, tile
  },
  painting: {
    basic: [1_500, 5_000],      // walls only, single coat
    mid: [4_000, 12_000],       // full prep, premium paint, walls + trim
    premium: [10_000, 30_000],  // full skim, designer paint, walls + trim + cabinets + ceilings
  },
};

// Average size in sqft — used when the homeowner skips the size input.
// For roofing, "size" = roof area sqft. For painting, "size" = home living area.
const AVG_SQFT: Record<ProjectType, number> = {
  bathroom: 50,
  kitchen: 150,
  roofing: 1_800,
  painting: 1_500,
};

// Cost-of-living multiplier by first digit of US ZIP code.
// (Approximate; tuned to match RSMeans / Remodeling magazine 2025 regional spreads.)
const REGION_MULTIPLIER: Record<string, number> = {
  "0": 1.30, // CT MA ME NH NJ PR RI VT
  "1": 1.25, // DE NY PA
  "2": 1.10, // DC MD NC SC VA WV
  "3": 0.95, // AL FL GA MS TN
  "4": 0.95, // IN KY MI OH
  "5": 0.90, // IA MN MT ND SD WI
  "6": 0.90, // IL KS MO NE
  "7": 0.95, // AR LA OK TX
  "8": 1.05, // AZ CO ID NM NV UT WY
  "9": 1.35, // AK CA HI OR WA
};

const TIER_LABEL: Record<Tier, string> = {
  basic: "Basic / Builder-Grade",
  mid: "Mid-Range / Quality",
  premium: "Premium / Luxury",
};

const TIER_INCLUSIONS: Record<ProjectType, Record<Tier, string[]>> = {
  bathroom: {
    basic: [
      "Stock vanity & medicine cabinet",
      "Standard ceramic tile",
      "Builder-grade fixtures (Moen / Delta entry-level)",
      "Like-for-like tub or shower replacement",
      "Vinyl or basic ceramic floor",
    ],
    mid: [
      "Semi-custom vanity with stone top",
      "Porcelain or large-format tile",
      "Mid-tier fixtures (Moen, Delta, Kohler)",
      "Walk-in shower or freestanding tub upgrade",
      "Heated towel rack & upgraded lighting",
    ],
    premium: [
      "Custom millwork vanity",
      "Marble or large-format porcelain",
      "High-end fixtures (Kohler, Brizo, Toto)",
      "Frameless glass enclosure",
      "Heated tile floor & smart fixtures",
    ],
  },
  kitchen: {
    basic: [
      "Stock cabinets",
      "Laminate countertops",
      "Vinyl plank flooring",
      "Standard appliance package",
      "Like-for-like layout (no wall changes)",
    ],
    mid: [
      "Semi-custom cabinets",
      "Quartz countertops",
      "Hardwood or LVP flooring",
      "Mid-tier appliances (Bosch, KitchenAid, GE Profile)",
      "Subway or porcelain backsplash",
    ],
    premium: [
      "Fully custom cabinets & millwork",
      "Stone slab counters (quartzite, marble)",
      "Wide-plank hardwood",
      "Pro-grade appliances (Wolf, Sub-Zero, Miele)",
      "Custom island & walk-in pantry",
    ],
  },
  roofing: {
    basic: [
      "3-tab asphalt shingles (15–20 yr warranty)",
      "Standard 15-lb felt underlayment",
      "Like-for-like flashing & vents",
      "Gutter cleaning included",
    ],
    mid: [
      "Architectural / dimensional shingles (30 yr warranty)",
      "Synthetic underlayment",
      "Ice & water shield at eaves and valleys",
      "New ridge vents + drip edge",
    ],
    premium: [
      "Metal, slate, or clay tile",
      "50-yr+ manufacturer warranty",
      "Full deck inspection & repair",
      "Custom flashing, copper accents",
      "Solar-ready prep available",
    ],
  },
  painting: {
    basic: [
      "Walls only (no trim or ceilings)",
      "One coat of builder-grade paint",
      "Patch & sand obvious nail holes",
      "Drop cloths and basic furniture move",
    ],
    mid: [
      "Two coats with quality primer",
      "Premium paint (Sherwin-Williams Cashmere, Benjamin Moore Regal)",
      "Walls + trim + doors",
      "Full prep: caulk, sand, fill, mask",
    ],
    premium: [
      "Full skim coat for smooth walls",
      "Designer paint (Farrow & Ball, Benjamin Moore Aura)",
      "Walls + trim + ceilings + cabinets",
      "On-site color consultation",
      "Lead-safe practices for older homes",
    ],
  },
};

export type Permit = {
  name: string;
  description: string;
  usuallyRequired: boolean;
};

// Typical project duration in weeks (low, high) per tier — based on
// industry averages; permitting/lead times can extend the high end.
const TIMELINE_WEEKS: Record<ProjectType, Record<Tier, [number, number]>> = {
  bathroom: {
    basic: [2, 3],
    mid: [3, 5],
    premium: [5, 8],
  },
  kitchen: {
    basic: [4, 6],
    mid: [6, 10],
    premium: [10, 16],
  },
  roofing: {
    basic: [1, 1],
    mid: [1, 2],
    premium: [2, 4],
  },
  painting: {
    basic: [1, 1],
    mid: [1, 2],
    premium: [2, 4],
  },
};

const PERMIT_CHECKLIST: Record<ProjectType, Permit[]> = {
  bathroom: [
    { name: "Building Permit", description: "Required if any structural change (moving walls, adding windows, framing).", usuallyRequired: true },
    { name: "Plumbing Permit", description: "Required when relocating fixtures or running new supply / DWV lines.", usuallyRequired: true },
    { name: "Electrical Permit", description: "Required for new circuits, GFCI outlets, or lighting changes.", usuallyRequired: true },
    { name: "Mechanical / Ventilation Permit", description: "Often required when adding or rerouting an exhaust fan.", usuallyRequired: false },
  ],
  kitchen: [
    { name: "Building Permit", description: "Required if structural changes or wall removals (load-bearing review needed).", usuallyRequired: true },
    { name: "Plumbing Permit", description: "Required for sink, dishwasher, or ice-maker supply work.", usuallyRequired: true },
    { name: "Electrical Permit", description: "Required for new circuits, dedicated appliance lines, recessed lighting.", usuallyRequired: true },
    { name: "Gas Permit", description: "Required when installing or relocating a gas range / cooktop line.", usuallyRequired: false },
    { name: "Mechanical Permit", description: "Required when ducting a new range hood through walls or roof.", usuallyRequired: false },
  ],
  roofing: [
    { name: "Building Permit (Re-Roof)", description: "Required by most US municipalities for full tear-off & replacement.", usuallyRequired: true },
    { name: "Tear-Off / Disposal Permit", description: "Some cities require a separate permit for the dumpster and old-material disposal.", usuallyRequired: false },
    { name: "Wind / Hurricane Code Compliance", description: "Required in coastal and high-wind zones (FL, TX coast, etc.) — extra fasteners, secondary water barrier.", usuallyRequired: false },
    { name: "HOA Approval", description: "If you're in an HOA community, material & color often need ARC (architectural review) approval.", usuallyRequired: false },
  ],
  painting: [
    { name: "No Permit (Most Cases)", description: "Standard interior or exterior repaint of an existing home does not require a permit anywhere in the US.", usuallyRequired: true },
    { name: "Lead-Safe Disclosure (RRP)", description: "Federal EPA rule for homes built before 1978 — your contractor must be RRP-certified.", usuallyRequired: false },
    { name: "HOA Approval", description: "Exterior color changes in an HOA community usually need ARC (architectural review) approval.", usuallyRequired: false },
  ],
};

export type EstimateInput = {
  projectType: ProjectType;
  tier: Tier;
  zipCode: string;
  squareFeet?: number;
};

export type EstimateResult = {
  costLow: number;
  costHigh: number;
  costMid: number;
  regionMultiplier: number;
  sizeMultiplier: number;
  tierLabel: string;
  inclusions: string[];
  permits: Permit[];
  timelineLowWeeks: number;
  timelineHighWeeks: number;
};

const ROUND_TO = 500;
const round = (n: number) => Math.round(n / ROUND_TO) * ROUND_TO;

export function estimate(input: EstimateInput): EstimateResult {
  const [baseLow, baseHigh] = BASE_RANGES[input.projectType][input.tier];
  const region = REGION_MULTIPLIER[input.zipCode[0]] ?? 1.0;
  const avg = AVG_SQFT[input.projectType];
  const sizeM = input.squareFeet
    ? Math.max(0.6, Math.min(1.6, input.squareFeet / avg))
    : 1.0;
  const m = region * sizeM;

  const low = round(baseLow * m);
  const high = round(baseHigh * m);
  const mid = round((low + high) / 2);

  const [tWeeksLow, tWeeksHigh] = TIMELINE_WEEKS[input.projectType][input.tier];

  return {
    costLow: low,
    costHigh: high,
    costMid: mid,
    regionMultiplier: region,
    sizeMultiplier: sizeM,
    tierLabel: TIER_LABEL[input.tier],
    inclusions: TIER_INCLUSIONS[input.projectType][input.tier],
    permits: PERMIT_CHECKLIST[input.projectType],
    timelineLowWeeks: tWeeksLow,
    timelineHighWeeks: tWeeksHigh,
  };
}

export function formatUSD(amount: number): string {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}
