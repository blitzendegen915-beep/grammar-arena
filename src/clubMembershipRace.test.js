import fs from 'node:fs'
import test from 'node:test'
import assert from 'node:assert/strict'

const source = fs.readFileSync(new URL('./main.jsx', import.meta.url), 'utf8').replace(/\r\n/g, '\n')
const handler = source.match(/const changeClub = async \(clubId\) => \{([\s\S]*?)\n  \}\n\n  const restart/)[1]

test('a delayed club update preserves answers and scores saved while the request was in flight', async () => {
  let state = { studentName: 'A', authToken: 'token', clubId: 'soccer', rankingPoolId: 'club:soccer', rating: 1500, overallRating: 1500, answerSyncQueue: [{ id: 'pending' }], poolIds: ['1-A', 'club:soccer'] }
  const original = state
  let pool = state.rankingPoolId, resolve
  const activeRef = { current: { name: 'A', token: 'token' } }
  const promise = Function('context', `with(context) { return (async () => {${handler}})() }`)({
    clubId: 'kendo', CLUB_OPTIONS: [{ id: 'kendo' }], hasSession: true, persisted: original,
    rankingPoolId: pool, modeId: 'course', getRankingCourseId: id => id, activeRef,
    setAuthBusy() {}, setNotice() {}, AUTH_REQUEST_TIMEOUT_MS: 1000,
    requestAuthWithRetry: action => action(), requestScoreApi: () => new Promise(r => { resolve = r }),
    preferredPoolIds: () => [], setPersisted: update => { state = update(state) },
    setRankingPoolId: update => { pool = update(pool) },
  })
  state = { ...state, rating: 1518, overallRating: 1518, answerSyncQueue: [] }
  resolve({ ok: true, name: 'A', authToken: 'token', clubId: 'kendo', clubLabel: '剣道部', poolIds: ['1-A', 'club:kendo'], poolId: '1-A', rating: 1500, overallRating: 1500 })
  await promise
  assert.equal(state.clubId, 'kendo')
  assert.equal(state.rating, 1518)
  assert.equal(state.overallRating, 1518)
  assert.deepEqual(state.answerSyncQueue, [])
  assert.equal(pool, '1-A')
  assert.deepEqual(state.publicLeaderboard, [])
})
