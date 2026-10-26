import test from 'node:test'
import assert from 'node:assert/strict'
import { COURSE_MODES, DEFAULT_MODE_ID, restoreActiveCourseProfile } from './courseCatalog.js'

test('only regular-class courses remain selectable', () => {
  assert.deepEqual(COURSE_MODES.map(({ id }) => id), ['regular-english-practice', 'regular-english-practice-2kimatsu'])
  assert.equal(DEFAULT_MODE_ID, 'regular-english-practice')
})

test('all three retired courses restore the regular-class rating and preserve legacy records', () => {
  for (const modeId of ['foundation-infinitive', 'foundation-gerund', 'foundation-participles']) {
    const profile = {
      modeId, rankingPoolId: '1-A', rating: 12000, studentName: 'QA', authToken: 'test-only',
      history: [{ id: 'legacy-session' }], answerSyncQueue: [{ id: 'pending-answer' }],
      ratingsByCourse: { 'regular-english-practice': 1500 },
      ratingsByScope: { 'regular-english-practice::1-A': 1800 },
      answeredIds: ['old-foundation-answer'], answeredByCourse: { 'regular-english-practice': ['reg13-01'] },
    }
    const restored = restoreActiveCourseProfile(profile, '1-A')
    assert.equal(restored.modeId, DEFAULT_MODE_ID)
    assert.equal(restored.rating, 1800)
    assert.equal(restored.ratingsByCourse['foundation-course'], 12000)
    assert.equal(restored.ratingsByScope['foundation-course::1-A'], 12000)
    assert.deepEqual(restored.answeredIds, ['reg13-01'])
    assert.deepEqual(restored.answeredByCourse['foundation-course'], ['old-foundation-answer'])
    assert.deepEqual(restored.answeredByCourse['regular-english-practice'], ['reg13-01'])
    for (const key of ['history', 'answerSyncQueue', 'studentName', 'authToken']) assert.equal(restored[key], profile[key])
    assert.equal(profile.modeId, modeId)
  }
})

test('retired-course scores never become the starting regular-class rating', () => {
  const restored = restoreActiveCourseProfile({ modeId: 'foundation-infinitive', rating: 50000 }, '1-A')
  assert.equal(restored.rating, 1240)
  assert.equal(restored.ratingsByCourse['foundation-course'], 50000)
})

test('an active course and its current state are kept as-is', () => {
  for (const { id: modeId } of COURSE_MODES) {
    const profile = { modeId, rating: 1700, answeredIds: ['existing'] }
    assert.equal(restoreActiveCourseProfile(profile, '1-A'), profile)
  }
})
