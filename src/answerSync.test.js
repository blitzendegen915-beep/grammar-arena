import test from 'node:test'
import assert from 'node:assert/strict'
import {
  ANSWER_SYNC_MAX_ATTEMPTS,
  ANSWER_SYNC_TIMEOUT_MS,
  applyProvisionalRating,
  createPendingAnswer,
  enqueueAnswer,
  flushAnswerQueue,
  getAnswerSyncSummary,
  getSyncKey,
  prepareAnswerRetry,
  rekeyAnswersForAuth,
} from './answerSync.js'

function answer(overrides = {}) {
  return createPendingAnswer({
    name: '田中 花子',
    authToken: 'token-a',
    course: 'foundation-course',
    questionId: 'l13-01',
    correct: true,
    delta: 12,
    ...overrides,
  }, 1000)
}

test('同じ問題でも試行IDが違えば別の解答として保存できる', () => {
  const first = answer({ poolId: '1-L', attemptId: 'attempt-a' })
  const second = answer({ attemptId: 'attempt-b' })
  const duplicate = answer({ attemptId: 'attempt-a' })
  const queue = enqueueAnswer(enqueueAnswer(enqueueAnswer([], first), second), duplicate)

  assert.equal(queue.length, 2)
  assert.equal(queue[0].id, first.id)
  assert.equal(queue[0].poolId, '1-L')
  assert.equal(getAnswerSyncSummary(queue, getSyncKey(first)).provisionalDelta, 24)
})

test('provisional rating applies every queued delta in order with the 800 floor', () => {
  const first = answer({ delta: -1000 })
  const second = answer({ questionId: 'l13-02', delta: 12 })

  assert.equal(applyProvisionalRating(805, [first, second], first.syncKey), 812)
})

test('queue flush is serialized and accepts authoritative success and duplicate responses', async () => {
  const first = answer({ questionId: 'l13-01', delta: 12 })
  const duplicate = answer({ questionId: 'l13-02', delta: 18 })
  const queue = [first, duplicate]
  const events = []
  const inFlight = []
  let maxInFlight = 0
  const result = await flushAnswerQueue({
    queue,
    identity: first.syncKey,
    timeoutMs: ANSWER_SYNC_TIMEOUT_MS,
    send: async (entry) => {
      inFlight.push(entry.questionId)
      maxInFlight = Math.max(maxInFlight, inFlight.length)
      await Promise.resolve()
      inFlight.pop()
      return entry.questionId === 'l13-01'
        ? { ok: true, rating: 1252, delta: 12 }
        : { ok: false, reason: 'already-answered', rating: 1270, delta: 0 }
    },
    onResult: (event) => events.push(event.type),
  })

  assert.equal(maxInFlight, 1)
  assert.deepEqual(events, ['synced', 'duplicate'])
  assert.deepEqual(result, [])
})

test('transient failures use bounded retry state and manual retry resets the budget', async () => {
  const pending = answer()
  let now = 1000
  let attempts = 0
  let result = await flushAnswerQueue({
    queue: [pending],
    identity: pending.syncKey,
    now: () => now,
    send: async () => {
      attempts += 1
      throw new Error('offline')
    },
  })

  assert.equal(attempts, 1)
  assert.equal(result[0].status, 'error')
  assert.equal(result[0].attempt, 1)
  assert.equal(result[0].nextAttemptAt, 2000)

  result = prepareAnswerRetry(result, pending.id, now)
  now = 2000
  result = await flushAnswerQueue({
    queue: result,
    identity: pending.syncKey,
    now: () => now,
    send: async () => ({ ok: true, rating: 1252, delta: 12 }),
  })
  assert.deepEqual(result, [])
})

test('timeout becomes an error and never exceeds the configured attempt bound', async () => {
  const pending = answer()
  let now = 1000
  let attempts = 0
  let queue = [pending]
  for (let index = 0; index < ANSWER_SYNC_MAX_ATTEMPTS; index += 1) {
    queue = await flushAnswerQueue({
      queue,
      identity: pending.syncKey,
      now: () => now,
      timeoutMs: 5,
      send: () => new Promise(() => {}),
    })
    attempts += 1
    if (queue[0].nextAttemptAt === null) break
    now = queue[0].nextAttemptAt
  }

  assert.equal(attempts, ANSWER_SYNC_MAX_ATTEMPTS)
  assert.equal(queue[0].status, 'error')
  assert.equal(queue[0].attempt, ANSWER_SYNC_MAX_ATTEMPTS)
  assert.equal(queue[0].nextAttemptAt, null)
})

test('paused or delayed first answer blocks later answers in the same scope', async () => {
  const first = { ...answer(), status: 'error', nextAttemptAt: null }
  const second = answer({ questionId: 'l13-02', delta: 18 })
  let calls = 0
  const result = await flushAnswerQueue({
    queue: [first, second],
    identity: first.syncKey,
    send: async () => {
      calls += 1
      return { ok: true, rating: 1270, delta: 18 }
    },
  })

  assert.equal(calls, 0)
  assert.equal(result[0].nextAttemptAt, null)
  assert.equal(result[1].status, 'pending')
})

test('permanent moderation rejection is removed without retrying', async () => {
  const pending = answer()
  const events = []
  const result = await flushAnswerQueue({
    queue: [pending],
    identity: pending.syncKey,
    send: async () => ({ ok: false, reason: 'inappropriate-content', rating: 1240, delta: 0 }),
    onResult: (event) => events.push(event.type),
  })

  assert.deepEqual(result, [])
  assert.deepEqual(events, ['blocked'])
})

test('deterministic server rejection stops without wasting retry attempts', async () => {
  const pending = answer()
  const events = []
  let calls = 0
  const result = await flushAnswerQueue({
    queue: [pending],
    identity: pending.syncKey,
    send: async () => {
      calls += 1
      return { ok: false, reason: 'invalid-question' }
    },
    onResult: (event) => events.push(event.type),
  })

  assert.equal(calls, 1)
  assert.deepEqual(events, ['rejected'])
  assert.equal(result[0].status, 'error')
  assert.equal(result[0].nextAttemptAt, null)
  assert.equal(result[0].lastError, 'invalid-question')
})

test('pending answers can move to a freshly issued auth token without crossing names', () => {
  const pending = answer()
  const untouched = answer({ name: '佐藤 太郎', questionId: 'l13-02' })
  const rekeyed = rekeyAnswersForAuth([pending, untouched], {
    name: '田中 花子',
    oldAuthToken: 'token-a',
    newAuthToken: 'token-b',
    now: 2000,
  })

  assert.equal(rekeyed[0].authToken, 'token-b')
  assert.equal(rekeyed[0].syncKey, getSyncKey({ name: '田中 花子', authToken: 'token-b', course: 'foundation-course' }))
  assert.equal(rekeyed[1].authToken, 'token-a')
})
