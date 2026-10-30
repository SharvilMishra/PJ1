import type { PreferenceCategory, RecommendationPersona } from "../auth/UserPreferencesProvider";
import type { Phone } from "../types/phone";

export type Criterion = "price" | "rating" | "ramGb" | "storageGb" | "batteryMah" | "cameraMainMp" | "displaySizeIn";
type CriterionWeight = { metric: Criterion; label: string; weight: number; higherIsBetter: boolean };
export type HybridWeights = { wsm: number; topsis: number; similarity: number };
export const DEFAULT_HYBRID_WEIGHTS: Readonly<HybridWeights> = Object.freeze({ wsm: 0.4, topsis: 0.35, similarity: 0.25 });

/** Component weights are normalized at use time, so callers can tune them safely. */
export const personaWeights: Record<RecommendationPersona, CriterionWeight[]> = {
  student: [
    { metric: "price", label: "Affordable price", weight: 35, higherIsBetter: false },
    { metric: "batteryMah", label: "Battery", weight: 20, higherIsBetter: true },
    { metric: "storageGb", label: "Storage", weight: 15, higherIsBetter: true },
    { metric: "ramGb", label: "RAM", weight: 10, higherIsBetter: true },
    { metric: "rating", label: "Rating", weight: 10, higherIsBetter: true },
    { metric: "cameraMainMp", label: "Camera", weight: 10, higherIsBetter: true },
  ],
  creator: [
    { metric: "cameraMainMp", label: "Camera", weight: 35, higherIsBetter: true },
    { metric: "storageGb", label: "Storage", weight: 20, higherIsBetter: true },
    { metric: "ramGb", label: "RAM", weight: 15, higherIsBetter: true },
    { metric: "rating", label: "Rating", weight: 15, higherIsBetter: true },
    { metric: "batteryMah", label: "Battery", weight: 10, higherIsBetter: true },
    { metric: "price", label: "Affordable price", weight: 5, higherIsBetter: false },
  ],
  gaming: [
    { metric: "ramGb", label: "RAM", weight: 30, higherIsBetter: true },
    { metric: "batteryMah", label: "Battery", weight: 20, higherIsBetter: true },
    { metric: "rating", label: "Rating", weight: 15, higherIsBetter: true },
    { metric: "storageGb", label: "Storage", weight: 15, higherIsBetter: true },
    { metric: "price", label: "Affordable price", weight: 10, higherIsBetter: false },
    { metric: "cameraMainMp", label: "Camera", weight: 10, higherIsBetter: true },
  ],
  business: [
    { metric: "rating", label: "Rating", weight: 25, higherIsBetter: true },
    { metric: "batteryMah", label: "Battery", weight: 25, higherIsBetter: true },
    { metric: "ramGb", label: "RAM", weight: 15, higherIsBetter: true },
    { metric: "storageGb", label: "Storage", weight: 15, higherIsBetter: true },
    { metric: "price", label: "Affordable price", weight: 10, higherIsBetter: false },
    { metric: "cameraMainMp", label: "Camera", weight: 10, higherIsBetter: true },
  ],
  senior: [
    { metric: "batteryMah", label: "Battery", weight: 25, higherIsBetter: true },
    { metric: "price", label: "Affordable price", weight: 20, higherIsBetter: false },
    { metric: "rating", label: "Rating", weight: 20, higherIsBetter: true },
    { metric: "displaySizeIn", label: "Large display", weight: 15, higherIsBetter: true },
    { metric: "cameraMainMp", label: "Camera", weight: 10, higherIsBetter: true },
    { metric: "storageGb", label: "Storage", weight: 5, higherIsBetter: true },
    { metric: "ramGb", label: "RAM", weight: 5, higherIsBetter: true },
  ],
};

const priorityMetric: Partial<Record<PreferenceCategory, Criterion>> = {
  gaming: "ramGb", battery: "batteryMah", camera: "cameraMainMp", budget: "price", flagship: "rating",
};

export function normalizedWeights(weights: number[]): number[] {
  const safe = weights.map((weight) => Number.isFinite(weight) && weight > 0 ? weight : 0);
  const total = safe.reduce((sum, weight) => sum + weight, 0);
  return total ? safe.map((weight) => weight / total) : safe.map(() => 0);
}

/** Min-max scale into [0, 1]. A constant criterion is neutral for present values. */
export function normalizeCriterion(value: number | null | undefined, values: number[], higherIsBetter: boolean): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const available = values.filter(Number.isFinite);
  if (!available.length) return null;
  const min = Math.min(...available);
  const max = Math.max(...available);
  if (max === min) return 1;
  const score = (value - min) / (max - min);
  return Math.max(0, Math.min(1, higherIsBetter ? score : 1 - score));
}

export function weightedSumScore(scores: number[], weights: number[]): number {
  const normalized = normalizedWeights(weights);
  if (!scores.length || scores.length !== normalized.length) return 0;
  return scores.reduce((total, score, index) => total + (Number.isFinite(score) ? Math.max(0, Math.min(1, score)) : 0) * normalized[index], 0);
}

/** TOPSIS closeness using already min-max normalized, benefit-oriented criteria. */
export function topsisScores(matrix: number[][], weights: number[]): number[] {
  if (!matrix.length || !matrix[0]?.length || matrix.some((row) => row.length !== matrix[0].length)) return matrix.map(() => 0.5);
  const normalized = normalizedWeights(weights);
  if (normalized.length !== matrix[0].length || normalized.every((weight) => weight === 0)) return matrix.map(() => 0.5);
  const weighted = matrix.map((row) => row.map((value, column) => Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0)) * normalized[column]));
  const positive = normalized.map((_, column) => Math.max(...weighted.map((row) => row[column])));
  const negative = normalized.map((_, column) => Math.min(...weighted.map((row) => row[column])));
  return weighted.map((row) => {
    const distancePositive = Math.sqrt(row.reduce((sum, value, column) => sum + (value - positive[column]) ** 2, 0));
    const distanceNegative = Math.sqrt(row.reduce((sum, value, column) => sum + (value - negative[column]) ** 2, 0));
    const denominator = distancePositive + distanceNegative;
    return denominator === 0 ? 0.5 : distanceNegative / denominator;
  });
}

/** Cosine match between a normalized preference-weight vector and normalized phone features. */
export function cosineSimilarity(preferences: number[], features: number[]): number {
  if (!preferences.length || preferences.length !== features.length) return 0;
  const dot = preferences.reduce((sum, value, index) => sum + value * features[index], 0);
  const preferenceNorm = Math.sqrt(preferences.reduce((sum, value) => sum + value ** 2, 0));
  const featureNorm = Math.sqrt(features.reduce((sum, value) => sum + value ** 2, 0));
  if (!preferenceNorm || !featureNorm) return 0;
  return Math.max(0, Math.min(1, dot / (preferenceNorm * featureNorm)));
}

export function combineHybridScores(components: { wsm: number; topsis: number; similarity: number }, weights: HybridWeights = DEFAULT_HYBRID_WEIGHTS): number {
  const componentWeights = normalizedWeights([weights.wsm, weights.topsis, weights.similarity]);
  if (componentWeights.every((weight) => weight === 0)) return 0;
  const values = [components.wsm, components.topsis, components.similarity].map((value) => Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0)));
  return Math.max(0, Math.min(100, 100 * values.reduce((total, value, index) => total + value * componentWeights[index], 0)));
}

export type RecommendationRow = {
  phone: Phone;
  rank: number;
  score: number;
  wsmScore: number;
  topsisScore: number;
  similarityScore: number;
  criteria: { metric: Criterion; label: string; weight: number; value: number | null; normalized: number | null; contribution: number; missing: boolean }[];
};

export function rankHybridRecommendations(
  catalog: Phone[],
  persona: RecommendationPersona,
  categories: PreferenceCategory[] = [],
  maxPrice = Number.POSITIVE_INFINITY,
  hybridWeights: HybridWeights = DEFAULT_HYBRID_WEIGHTS,
): RecommendationRow[] {
  const eligible = catalog.filter((phone) => typeof phone.price === "number" && Number.isFinite(phone.price) && phone.price <= maxPrice);
  if (!eligible.length) return [];

  const base = personaWeights[persona];
  const weightByMetric = new Map<Criterion, number>();
  for (const item of base) weightByMetric.set(item.metric, item.weight);
  for (const category of new Set(categories)) {
    const metric = priorityMetric[category];
    if (metric && weightByMetric.has(metric)) weightByMetric.set(metric, (weightByMetric.get(metric) ?? 0) + 15);
  }
  const criteria = base.map((item) => ({ ...item, weight: weightByMetric.get(item.metric) ?? 0 }));
  const weights = normalizedWeights(criteria.map((item) => item.weight));
  const normalizedMatrix = eligible.map((phone) => criteria.map((item) => {
    const values = eligible.map((candidate) => candidate[item.metric]).filter((value): value is number => typeof value === "number" && Number.isFinite(value));
    return normalizeCriterion(phone[item.metric], values, item.higherIsBetter) ?? 0;
  }));
  const topsis = topsisScores(normalizedMatrix, weights);
  const rows = eligible.map((phone, index) => {
    const featureVector = normalizedMatrix[index];
    const wsm = weightedSumScore(featureVector, weights);
    const similarity = cosineSimilarity(weights, featureVector);
    return {
      phone,
      rank: 0,
      wsmScore: wsm,
      topsisScore: topsis[index],
      similarityScore: similarity,
      score: combineHybridScores({ wsm, topsis: topsis[index], similarity }, hybridWeights),
      criteria: criteria.map((item, column) => {
        const value = phone[item.metric];
        const normalized = typeof value === "number" && Number.isFinite(value) ? featureVector[column] : null;
        return {
          metric: item.metric, label: item.label, weight: weights[column] * 100,
          value: typeof value === "number" && Number.isFinite(value) ? value : null,
          normalized, contribution: featureVector[column] * weights[column] * 100,
          missing: normalized === null,
        };
      }),
    };
  }).sort((left, right) => right.score - left.score
    || (right.phone.rating ?? 0) - (left.phone.rating ?? 0)
    || (left.phone.price ?? Infinity) - (right.phone.price ?? Infinity)
    || left.phone.id.localeCompare(right.phone.id));
  return rows.map((row, index) => ({ ...row, rank: index + 1 }));
}
