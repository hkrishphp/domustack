// ============================================================
// Service types matching the HireRight Project Intake Spec
// ============================================================

export type ServiceType = {
  slug: string;
  name: string;
  icon: string;
};

export const SERVICE_TYPES: ServiceType[] = [
  { slug: "plumbing", name: "Plumbing", icon: "🔧" },
  { slug: "electrical", name: "Electrical", icon: "⚡" },
  { slug: "painting", name: "Painting", icon: "🎨" },
  { slug: "drywall", name: "Drywall", icon: "🧱" },
  { slug: "roofing", name: "Roofing", icon: "🏠" },
  { slug: "flooring", name: "Flooring", icon: "🪵" },
  { slug: "hvac", name: "HVAC", icon: "❄️" },
  { slug: "landscaping", name: "Landscaping", icon: "🌿" },
  { slug: "fencing", name: "Fencing", icon: "🏗️" },
  { slug: "concrete", name: "Concrete", icon: "🧱" },
  { slug: "carpentry", name: "Carpentry", icon: "🪚" },
  { slug: "handyman", name: "General Handyman", icon: "🔨" },
];

// ============================================================
// Property types
// ============================================================

export type PropertyType = {
  slug: string;
  name: string;
  icon: string;
};

export const PROPERTY_TYPES: PropertyType[] = [
  { slug: "residential", name: "Residential", icon: "🏡" },
  { slug: "commercial", name: "Commercial", icon: "🏢" },
  { slug: "multi-family", name: "Multi-Family", icon: "🏘️" },
];

// ============================================================
// Budget ranges
// ============================================================

export const BUDGET_RANGES = [
  { value: "under_500", label: "Under $500" },
  { value: "500_1000", label: "$500 – $1,000" },
  { value: "1000_5000", label: "$1K – $5K" },
  { value: "5000_10000", label: "$5K – $10K" },
  { value: "10000_plus", label: "$10,000+" },
  { value: "not_sure", label: "Not sure" },
];

// ============================================================
// Timeline / urgency options
// ============================================================

export const TIMELINE_OPTIONS = [
  { value: "emergency", label: "Emergency (ASAP)", urgent: true },
  { value: "within_week", label: "Within a week", urgent: false },
  { value: "within_month", label: "Within a month", urgent: false },
  { value: "flexible", label: "Flexible / No rush", urgent: false },
  { value: "future_date", label: "Scheduling for future date", urgent: false },
];

// ============================================================
// Contact method options
// ============================================================

export const CONTACT_METHODS = [
  { value: "in_app", label: "In-App Message", icon: "💬" },
  { value: "email", label: "Email", icon: "📧" },
  { value: "phone", label: "Phone Call", icon: "📞" },
  { value: "sms", label: "Text / SMS", icon: "📱" },
];

// ============================================================
// US States
// ============================================================

export const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming",
];

// ============================================================
// Helpers
// ============================================================

export function getServiceLabel(slug: string): string {
  return SERVICE_TYPES.find((s) => s.slug === slug)?.name ?? slug;
}

export function getPropertyLabel(slug: string): string {
  return PROPERTY_TYPES.find((p) => p.slug === slug)?.name ?? slug;
}

export function getBudgetLabel(value: string): string {
  return BUDGET_RANGES.find((b) => b.value === value)?.label ?? value;
}

export function getTimelineLabel(value: string): string {
  return TIMELINE_OPTIONS.find((t) => t.value === value)?.label ?? value;
}

export function getContactMethodLabel(value: string): string {
  return CONTACT_METHODS.find((c) => c.value === value)?.label ?? value;
}
