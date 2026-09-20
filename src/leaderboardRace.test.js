import fs from 'node:fs'
import test from 'node:test'
import assert from 'node:assert/strict'
import { isSameRequestScope } from './requestScope.js'

// Exercise the actual request handler, not a second implementation of its guard.
const source = fs.readFileSync(new URL('./main.jsx', import.meta.url), 'utf8').replace(/\r\n/g, '\n')
const handler = source.match(/const refreshLeaderboard = async \(\) => \{([\s\S]*?)\n  \}\n\n  useEffect/)[1]

function harness() {
  let state = { studentName: 'A', authToken: 'token-A', poolIds: ['1-A'], publicLeaderboard: [] }
  const activeRef = { current: { name: 'A', token: 'token-A', course: 'course', poolId: '1-A' } }
  const leaderboardInFlightRef = { current: null }
  const leaderboardRequestRef = { current: 0 }
  const requests = []
  const notices = []
  const refresh = () => Function('context', `with(context) { return (async () => {${handler}})() }`)({
    hasSession: Boolean(state.authToken), persisted: state, rankingPoolId: activeRef.current.poolId,
    modeId: 'course', SCORE_API_URL: 'local-mock', getRankingCourseId: (id) => id,
    activeRef, leaderboardInFlightRef, leaderboardRequestRef, isSameRequestScope,
    setPersisted: (update) => { state = update(state) }, setNotice: (notice) => notices.push(notice),
    requestScoreApi: () => new Promise((resolve, reject) => requests.push({ resolve, reject })),
  })
  return {
    refresh, requests, notices, state: () => state,
    switchTo(name, token, poolId) {
      activeRef.current = { name, token, course: 'course', poolId }
      state = { studentName: name, authToken: token, poolIds: [poolId], publicLeaderboard: [] }
    },
  }
}

test('late account A roster cannot appear after account B login', async () => {
  const h = harness()
  const old = h.refresh()
  h.switchTo('B', 'token-B', '1-B')
  const fresh = h.refresh()
  assert.equal(h.requests.length, 2, 'new scope must not be blocked by old request')
  h.requests[1].resolve({ ok: true, players: [{ name: 'B roster' }] })
  await fresh
  h.requests[0].resolve({ ok: true, players: [{ name: 'A private roster' }] })
  await old
  assert.deepEqual(h.state().publicLeaderboard, [{ name: 'B roster' }])
})

test('logout discards late rosters and late errors', async () => {
  for (const reject of [false, true]) {
    const h = harness()
    const old = h.refresh()
    h.switchTo('', '', '')
    if (reject) h.requests[0].reject(new Error('offline'))
    else h.requests[0].resolve({ ok: true, players: [{ name: 'private' }] })
    await old
    assert.deepEqual(h.state().publicLeaderboard, [])
    assert.deepEqual(h.notices, [])
  }
})

test('same-scope refresh is deduplicated; pool switches are not', async () => {
  const h = harness()
  const old = h.refresh()
  await h.refresh()
  assert.equal(h.requests.length, 1)
  h.switchTo('A', 'token-A', 'foundation')
  const fresh = h.refresh()
  h.requests[0].resolve({ ok: true, players: [{ name: 'old class' }] })
  await old
  assert.deepEqual(h.state().publicLeaderboard, [])
  await h.refresh()
  assert.equal(h.requests.length, 2, 'old finally must not clear current in-flight request')
  h.requests[1].resolve({ ok: true, players: [{ name: 'foundation' }] })
  await fresh
  assert.deepEqual(h.state().publicLeaderboard, [{ name: 'foundation' }])
})
