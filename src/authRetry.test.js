import test from 'node:test'
import assert from 'node:assert/strict'
import { authRetryDelay, isRetryableAuthResult, requestAuthWithRetry } from './authRetry.js'

test('認証APIの一時的な混雑エラーだけを再試行する', async () => {
  assert.equal(isRetryableAuthResult({ ok: false, reason: 'server-busy' }), true)
  assert.equal(isRetryableAuthResult({ ok: false, reason: 'wrong-pin' }), false)
  assert.equal(isRetryableAuthResult({ ok: false, reason: 'server-error', retryable: false }), false)

  let calls = 0
  const delays = []
  const result = await requestAuthWithRetry(async () => {
    calls += 1
    return calls < 3 ? { ok: false, reason: 'server-busy' } : { ok: true, authToken: 'token' }
  }, { sleep: async (milliseconds) => delays.push(milliseconds), random: () => 0 })

  assert.equal(result.ok, true)
  assert.equal(calls, 3)
  assert.deepEqual(delays, [700, 1400])
})

test('通信例外は上限回数まで再試行し、その後に返す', async () => {
  let calls = 0
  await assert.rejects(
    requestAuthWithRetry(async () => {
      calls += 1
      throw new Error('network')
    }, { maxAttempts: 3, sleep: async () => {}, random: () => 0 }),
    /network/,
  )
  assert.equal(calls, 3)
  assert.ok(authRetryDelay(0, 0) < authRetryDelay(1, 0))
})
