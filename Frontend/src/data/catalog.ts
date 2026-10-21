import catalogData from "./phones.json";
import type { Phone } from "../types/phone";
import { preferenceCategories, type PreferenceCategory } from "../auth/UserPreferencesProvider";

export const phones = catalogData as unknown as Phone[];
export const phoneById = new Map(phones.map((phone) => [phone.id, phone]));
export const catalogPriceBounds = phones.reduce(
  (bounds, phone) => phone.price === null
    ? bounds
    : { min: Math.min(bounds.min, phone.price), max: Math.max(bounds.max, phone.price) },
  { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
);
export const catalogBrands = [...new Set(phones.map((phone) => phone.brand))].sort((a, b) => a.localeCompare(b));

export function formatPrice(price: number | null): string {
  return price === null ? "Price unavailable" : price.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export function formatRating(rating: number | null): string {
  return rating === null ? "Not rated" : rating.toFixed(1);
}

export function formatProcessor(processor: string | null): string {
  if (!processor) return "Processor not listed";
  return processor.replace(/Processor$/i, "").replace(/([a-z])([A-Z])/g, "$1 $2").replace(/([A-Za-z])(\d)/g, "$1 $2").replace(/(\d)([A-Za-z])/g, "$1 $2").replace(/\s+/g, " ").trim().replace(/,$/, "");
}

export function phoneSpecs(phone: Phone): string[] {
  return [
    phone.ramGb === null ? null : `${phone.ramGb} GB RAM`,
    phone.storageGb === null ? null : `${phone.storageGb} GB storage`,
    phone.batteryMah === null ? null : `${phone.batteryMah.toLocaleString()} mAh`,
    phone.cameraMainMp === null ? null : `${phone.cameraMainMp} MP camera`,
  ].filter((value): value is string => value !== null);
}

export function preferenceMatchCount(phone: Phone, selected: string[]): number {
  return phone.categories.filter((category) => selected.includes(category)).length;
}

export function rankPhones(selected: string[] = []): Phone[] {
  if (!selected.length) return [...phones].sort((left, right) => (right.rating ?? 0) - (left.rating ?? 0) || (left.price ?? Infinity) - (right.price ?? Infinity));
  return [...phones].sort((left, right) => recommendationScore(right, selected) - recommendationScore(left, selected)
    || (right.rating ?? 0) - (left.rating ?? 0) || (left.price ?? Infinity) - (right.price ?? Infinity));
}

const preferenceMetric: Record<PreferenceCategory, { field: "ramGb" | "batteryMah" | "cameraMainMp" | "price" | "rating"; higherIsBetter: boolean }> = {
  gaming: { field: "ramGb", higherIsBetter: true },
  battery: { field: "batteryMah", higherIsBetter: true },
  camera: { field: "cameraMainMp", higherIsBetter: true },
  budget: { field: "price", higherIsBetter: false },
  flagship: { field: "rating", higherIsBetter: true },
};
const preferenceBounds = Object.fromEntries(Object.values(preferenceMetric).map(({ field }) => {
  const values = phones.map((phone) => phone[field]).filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  return [field, { min: Math.min(...values), max: Math.max(...values) }];
})) as Record<(typeof preferenceMetric)[PreferenceCategory]["field"], { min: number; max: number }>;

/** Equal-weight average of selected category scores; each category combines its catalog tag and normalized spec. */
export function recommendationScore(phone: Phone, selected: string[]): number {
  if (!selected.length) return 0;
  const active = selected.filter((category): category is PreferenceCategory =>
    (preferenceCategories as readonly string[]).includes(category),
  );
  if (!active.length) return 0;
  const scores = active.map((category) => {
    const { field, higherIsBetter } = preferenceMetric[category];
    const { min, max } = preferenceBounds[field];
    const raw = phone[field];
    const hasMetric = typeof raw === "number" && Number.isFinite(raw) && max > min;
    const metricScore = hasMetric ? ((raw - min) / (max - min)) * (higherIsBetter ? 1 : -1) + (higherIsBetter ? 0 : 1) : null;
    const tagScore = phone.categories.includes(category) ? 1 : 0;
    return metricScore === null ? tagScore * 100 : (tagScore * 0.5 + metricScore * 0.5) * 100;
  });
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}
