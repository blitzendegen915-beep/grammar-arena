import test from 'node:test'
import assert from 'node:assert/strict'
import {
  getLeaderboardRefreshDelay,
  LEADERBOARD_REFRESH_MAX_MS,
  LEADERBOARD_REFRESH_MIN_MS,
} from './leaderboardRefresh.js'

test('leaderboard refresh delay is randomized within the requested 15-to-30 second range', () => {
  assert.equal(getLeaderboardRefreshDelay(() => 0), LEADERBOARD_REFRESH_MIN_MS)
  assert.equal(getLeaderboardRefreshDelay(() => 0.5), 22500)
  assert.equal(getLeaderboardRefreshDelay(() => 1), LEADERBOARD_REFRESH_MAX_MS)
  for (const sample of [0.001, 0.1, 0.33, 0.75, 0.999]) {
    const delay = getLeaderboardRefreshDelay(() => sample)
    assert.ok(delay >= LEADERBOARD_REFRESH_MIN_MS && delay <= LEADERBOARD_REFRESH_MAX_MS)
  }
})

test('leaderboard refresh delay safely handles invalid random samples', () => {
  assert.equal(getLeaderboardRefreshDelay(() => NaN), 22500)
  assert.equal(getLeaderboardRefreshDelay(() => -1), LEADERBOARD_REFRESH_MIN_MS)
  assert.equal(getLeaderboardRefreshDelay(() => 2), LEADERBOARD_REFRESH_MAX_MS)
})
