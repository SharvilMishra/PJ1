import catalogData from "./phones.json";
import type { Phone } from "../types/phone";

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
  return [...phones].sort((left, right) => {
    const matchDelta = preferenceMatchCount(right, selected) - preferenceMatchCount(left, selected);
    return matchDelta || (right.rating ?? 0) - (left.rating ?? 0) || (left.price ?? Infinity) - (right.price ?? Infinity);
  });
}
