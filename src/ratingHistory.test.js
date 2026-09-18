import test from 'node:test'
import assert from 'node:assert/strict'
import { buildRatingChartModel, projectSessionRating } from './ratingHistory.js'

test('rating chart uses chronological history and the current rating', () => {
  const model = buildRatingChartModel([
    { id: '2', date: '2026-09-17', ratingStart: 1260, ratingDelta: -11, ratingAfter: 1249 },
    { id: '1', date: '2026-09-16', ratingStart: 1240, ratingDelta: 20, ratingAfter: 1260 },
  ], 24179)

  assert.deepEqual(model.points.map((point) => point.value), [1240, 1260, 1249, 24179])
  assert.equal(model.currentRating, 24179)
  assert.ok(model.labels.every((label) => ![1000, 1200, 1300].includes(label.value)))
  assert.ok(model.linePath.length > 0)
  assert.equal(model.points.length, 4)
})

test('rating chart falls back to the current rating without history', () => {
  const model = buildRatingChartModel([], 24179)
  assert.deepEqual(model.points.map((point) => point.value), [24179])
  assert.equal(model.currentRating, 24179)
  assert.ok(model.min < 24179 && model.max > 24179)
})

test('session projection ignores practice-only repeats and clamps at the floor', () => {
  assert.equal(projectSessionRating(1000, [
    { delta: -300 },
    { delta: -300 },
    { delta: 12, practiceOnly: true },
  ]), 800)
})
