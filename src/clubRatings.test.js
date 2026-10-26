import assert from 'node:assert/strict'
import test from 'node:test'
import { calculateOverallRating, getProvisionalOverallRating } from './clubRatings.js'

test('overall uses only positive course rating above baseline', () => {
  assert.equal(calculateOverallRating({ 'foundation-course': 1300, 'regular-english-practice': 1200, 'regular-english-practice-2kimatsu': 1275 }), 1335)
})

test('missing ratings contribute zero and pending deltas apply once', () => {
  assert.equal(calculateOverallRating({ 'foundation-course': 1240 }, [18, -7]), 1251)
  assert.equal(getProvisionalOverallRating(1400, { 'foundation-course': 1400 }, [{ course: 'foundation-course', delta: 18 }]), 1418)
})

test('falls back to calculated server summary when overall is absent', () => {
  assert.equal(getProvisionalOverallRating(null, { 'regular-english-practice': 1300 }), 1300)
})

test('pending losses respect the course floor and do not subtract from gains in other courses', () => {
  assert.equal(getProvisionalOverallRating(1300, { 'foundation-course': 1300, 'regular-english-practice': 1200 }, [{ course: 'regular-english-practice', delta: -20 }]), 1300)
})

test('does not guess a pending course change when its starting rating is missing', () => {
  assert.equal(getProvisionalOverallRating(1250, {}, [{ course: 'foundation-course', delta: -16 }]), 1250)
})

