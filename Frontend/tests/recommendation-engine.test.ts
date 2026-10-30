import assert from "node:assert/strict";
import test from "node:test";
import type { Phone } from "../src/types/phone.ts";
import { combineHybridScores, cosineSimilarity, DEFAULT_HYBRID_WEIGHTS, normalizeCriterion, normalizedWeights, personaWeights, rankHybridRecommendations, topsisScores, weightedSumScore } from "../src/data/recommendationEngine.ts";

const phone = (id: string, values: Partial<Phone> = {}): Phone => ({
  id, brand: "Test", model: id, name: id, rating: 4, price: 500, categories: [],
  cameraMainMp: 50, displayType: "AMOLED", ramGb: 8, storageGb: 128,
  batteryMah: 5000, displaySizeIn: 6.5, weightG: 180, processor: null, os: null, imageUrl: null,
  ...values,
});

test("normalizes benefits, costs, missing values, zero and constant columns safely", () => {
  assert.equal(normalizeCriterion(10, [10, 20], true), 0);
  assert.equal(normalizeCriterion(20, [10, 20], true), 1);
  assert.equal(normalizeCriterion(10, [10, 20], false), 1);
  assert.equal(normalizeCriterion(20, [10, 20], false), 0);
  assert.equal(normalizeCriterion(0, [0, 10], true), 0);
  assert.equal(normalizeCriterion(8, [8, 8], true), 1);
  assert.equal(normalizeCriterion(null, [1, 2], true), null);
  assert.equal(normalizeCriterion(Number.NaN, [1, 2], true), null);
  assert.equal(normalizeCriterion(1, [], true), null);
});

test("normalizes persona and user-priority weights to one", () => {
  const weights = normalizedWeights(personaWeights.student.map((item) => item.weight));
  assert.ok(Math.abs(weights.reduce((sum, item) => sum + item, 0) - 1) < 1e-12);
  assert.deepEqual(normalizedWeights([0, -2, Number.NaN]), [0, 0, 0]);
  const [ranked] = rankHybridRecommendations([phone("A")], "student", ["camera", "battery"]);
  assert.ok(Math.abs(ranked.criteria.reduce((sum, item) => sum + item.weight, 0) - 100) < 1e-9);
  assert.ok(ranked.criteria.find((item) => item.metric === "cameraMainMp")!.weight > 10);
});

test("weighted sum respects weights and treats missing values as zero", () => {
  assert.equal(weightedSumScore([1, 0], [0.75, 0.25]), 0.75);
  assert.equal(weightedSumScore([1, 1], [0, 0]), 0);
  assert.equal(weightedSumScore([1], [1, 1]), 0);
});

test("TOPSIS favors the positive ideal and returns neutral closeness for identical rows", () => {
  const scores = topsisScores([[1, 0], [0, 1]], [0.8, 0.2]);
  assert.ok(scores[0] > scores[1]);
  assert.deepEqual(topsisScores([[0.5, 0.5], [0.5, 0.5]], [0.5, 0.5]), [0.5, 0.5]);
  assert.deepEqual(topsisScores([[0, 1]], [1, 1]), [0.5]);
  assert.deepEqual(topsisScores([[1], [0, 1]], [1]), [0.5, 0.5]);
});

test("cosine similarity handles orthogonal and zero vectors", () => {
  assert.equal(cosineSimilarity([1, 0], [1, 0]), 1);
  assert.equal(cosineSimilarity([1, 0], [0, 1]), 0);
  assert.equal(cosineSimilarity([0, 0], [1, 1]), 0);
  assert.equal(cosineSimilarity([1], [1, 2]), 0);
});

test("hybrid score is configurable, bounded, and deterministic", () => {
  assert.equal(combineHybridScores({ wsm: 1, topsis: 1, similarity: 1 }), 100);
  assert.equal(combineHybridScores({ wsm: 0, topsis: 0, similarity: 0 }), 0);
  assert.equal(combineHybridScores({ wsm: 1, topsis: 0, similarity: 0 }, { wsm: 1, topsis: 0, similarity: 0 }), 100);
  assert.ok(Math.abs(DEFAULT_HYBRID_WEIGHTS.wsm + DEFAULT_HYBRID_WEIGHTS.topsis + DEFAULT_HYBRID_WEIGHTS.similarity - 1) < 1e-12);
  assert.equal(combineHybridScores({ wsm: 2, topsis: -1, similarity: Number.NaN }), 40);
});

test("cost versus benefit ranking, saved priorities, missing values, budget, and ties work", () => {
  const lowPrice = phone("low", { price: 100, cameraMainMp: 12, ramGb: 4, batteryMah: 4000 });
  const cameraPhone = phone("camera", { price: 900, cameraMainMp: 200, ramGb: 12, batteryMah: 6000 });
  const unknown = phone("unknown", { price: 400, cameraMainMp: null });

  const student = rankHybridRecommendations([lowPrice, cameraPhone], "student");
  const creator = rankHybridRecommendations([lowPrice, cameraPhone], "creator");
  assert.equal(student[0].phone.id, "low");
  assert.equal(creator[0].phone.id, "camera");
  assert.equal(rankHybridRecommendations([lowPrice, cameraPhone], "student", ["camera"])[0].phone.id, "camera");

  const withinBudget = rankHybridRecommendations([lowPrice, cameraPhone], "creator", [], 500);
  assert.deepEqual(withinBudget.map((item) => item.phone.id), ["low"]);
  assert.deepEqual(rankHybridRecommendations([lowPrice, cameraPhone], "student", [], 0), []);

  const missing = rankHybridRecommendations([lowPrice, unknown], "creator").find((item) => item.phone.id === "unknown")!;
  assert.equal(missing.criteria.find((item) => item.metric === "cameraMainMp")?.missing, true);
  assert.equal(missing.criteria.find((item) => item.metric === "cameraMainMp")?.contribution, 0);
  assert.ok(missing.score >= 0 && missing.score <= 100);

  const one = rankHybridRecommendations([phone("same1"), phone("same2")], "student");
  assert.deepEqual(one.map((item) => item.rank), [1, 2]);
  assert.equal(one[0].score, one[1].score);
});
