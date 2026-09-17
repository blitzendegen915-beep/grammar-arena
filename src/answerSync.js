export const ANSWER_SYNC_MAX_ATTEMPTS = 4
export const ANSWER_SYNC_TIMEOUT_MS = 7000
export const ANSWER_SYNC_BASE_BACKOFF_MS = 1000
export const ANSWER_SYNC_MAX_BACKOFF_MS = 15000

function normalizedName(value = '') {
  return String(value).trim().toLowerCase()
}

export function getSyncKey({ name = '', authToken = '', course = '' } = {}) {
  return JSON.stringify([normalizedName(name), String(authToken), String(course)])
}

export function createPendingAnswer({ name, authToken, course, questionId, correct, delta }, now = Date.now()) {
  const syncKey = getSyncKey({ name, authToken, course })
  return {
    id: JSON.stringify([syncKey, String(questionId)]),
    syncKey,
    name: String(name || '').trim(),
    authToken: String(authToken || ''),
    course: String(course || ''),
    questionId: String(questionId || ''),
    correct: Boolean(correct),
    delta: Number(delta) || 0,
    status: 'pending',
    attempt: 0,
    nextAttemptAt: Number(now) || Date.now(),
    lastError: '',
  }
}

export function enqueueAnswer(queue = [], answer) {
  if (!answer?.id || queue.some((item) => item.id === answer.id)) return queue
  return [...queue, answer]
}

export function recoverAnswerQueue(queue = [], now = Date.now()) {
  return queue
    .filter((item) => item && item.id && item.syncKey && item.questionId)
    .map((item) => item.status === 'syncing'
      ? { ...item, status: 'pending', nextAttemptAt: Number(now) || Date.now() }
      : item)
}

export function getAnswerForQuestion(queue = [], identity, questionId) {
  const syncKey = typeof identity === 'string' ? identity : getSyncKey(identity)
  return queue.find((item) => item.syncKey === syncKey && item.questionId === String(questionId)) || null
}

export function applyProvisionalRating(baseRating, queue = [], identity) {
  const syncKey = typeof identity === 'string' ? identity : getSyncKey(identity)
  return queue
    .filter((item) => item.syncKey === syncKey && item.status !== 'synced')
    .reduce((rating, item) => Math.max(800, rating + (Number(item.delta) || 0)), Number(baseRating) || 1240)
}

export function getProvisionalDelta(baseRating, queue = [], identity) {
  const rating = Number(baseRating) || 1240
  return applyProvisionalRating(rating, queue, identity) - rating
}

export function getAnswerSyncSummary(queue = [], identity, now = Date.now()) {
  const syncKey = typeof identity === 'string' ? identity : getSyncKey(identity)
  const entries = queue.filter((item) => item.syncKey === syncKey)
  const unresolved = entries.filter((item) => item.status !== 'synced')
  const pending = unresolved.filter((item) => item.status === 'pending' || item.status === 'syncing')
  const errors = unresolved.filter((item) => item.status === 'error')
  const first = unresolved[0]
  const firstAttemptAt = Number(first?.nextAttemptAt)
  const blocked = Boolean(first && (
    (first.status !== 'pending' && first.status !== 'error')
    || first.nextAttemptAt === null
    || !Number.isFinite(firstAttemptAt)
    || firstAttemptAt > now
  ))
  const futureAttempts = unresolved
    .map((item) => Number(item.nextAttemptAt))
    .filter((value) => Number.isFinite(value) && value > now)
  return {
    total: unresolved.length,
    pending: pending.length,
    errors: errors.length,
    blocked,
    provisionalDelta: unresolved.reduce((sum, item) => sum + (Number(item.delta) || 0), 0),
    nextAttemptAt: blocked && firstAttemptAt > now ? firstAttemptAt : (futureAttempts.length ? Math.min(...futureAttempts) : null),
  }
}

export function backoffMs(attempt) {
  return Math.min(ANSWER_SYNC_MAX_BACKOFF_MS, ANSWER_SYNC_BASE_BACKOFF_MS * (2 ** Math.max(0, Number(attempt) - 1)))
}

export function prepareAnswerRetry(queue = [], answerId, now = Date.now()) {
  return queue.map((item) => item.id === answerId && item.status === 'error'
    ? { ...item, status: 'pending', attempt: 0, nextAttemptAt: Number(now) || Date.now(), lastError: '' }
    : item)
}

export function rekeyAnswersForAuth(queue = [], { name, oldAuthToken = '', newAuthToken, now = Date.now() } = {}) {
  if (!name || !newAuthToken) return queue
  const seen = new Set()
  const next = queue.map((item) => {
    if (normalizedName(item.name) !== normalizedName(name)) return item
    if (oldAuthToken && item.authToken !== oldAuthToken) return item
    const syncKey = getSyncKey({ name, authToken: newAuthToken, course: item.course })
    return {
      ...item,
      id: JSON.stringify([syncKey, item.questionId]),
      syncKey,
      name: String(name).trim(),
      authToken: String(newAuthToken),
      status: item.status === 'syncing' ? 'pending' : item.status,
      nextAttemptAt: item.status === 'syncing' ? (Number(now) || Date.now()) : item.nextAttemptAt,
    }
  })
  return next.filter((item) => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })
}

export function mergeQueueSnapshot(currentQueue = [], nextQueue = [], syncKey, initialIds = new Set()) {
  const currentScopeAdditions = currentQueue.filter((item) => item.syncKey === syncKey && !initialIds.has(item.id))
  const untouched = currentQueue.filter((item) => item.syncKey !== syncKey)
  const seen = new Set()
  return [...untouched, ...nextQueue.filter((item) => item.syncKey === syncKey), ...currentScopeAdditions]
    .filter((item) => {
      if (seen.has(item.id)) return false
      seen.add(item.id)
      return true
    })
}

function replaceEntry(queue, id, patch) {
  return queue.map((item) => item.id === id ? { ...item, ...patch } : item)
}

function waitFor(promise, timeoutMs, onTimeout) {
  return new Promise((resolve, reject) => {
    let settled = false
    const timer = setTimeout(() => {
      if (settled) return
      settled = true
      onTimeout?.()
      reject(new Error('answer-sync-timeout'))
    }, timeoutMs)
    Promise.resolve(promise).then((value) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      resolve(value)
    }, (error) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      reject(error)
    })
  })
}

export async function flushAnswerQueue({
  queue = [],
  identity,
  send,
  onChange = () => {},
  onResult = () => {},
  now = () => Date.now(),
  timeoutMs = ANSWER_SYNC_TIMEOUT_MS,
  maxAttempts = ANSWER_SYNC_MAX_ATTEMPTS,
} = {}) {
  const syncKey = typeof identity === 'string' ? identity : getSyncKey(identity)
  let working = [...queue]

  while (true) {
    const currentTime = Number(now()) || Date.now()
    // Keep answers in submission order. A paused or delayed first answer must
    // not let a later provisional delta overtake it on the server.
    const entry = working.find((item) => item.syncKey === syncKey && item.status !== 'synced')
    if (!entry || (entry.status !== 'pending' && entry.status !== 'error')) break
    if (entry.nextAttemptAt === null || !Number.isFinite(Number(entry.nextAttemptAt)) || Number(entry.nextAttemptAt) > currentTime) break

    working = replaceEntry(working, entry.id, { status: 'syncing', lastError: '' })
    onChange(working)
    const controller = typeof AbortController === 'function' ? new AbortController() : null

    try {
      const result = await waitFor(send(entry, { signal: controller?.signal }), timeoutMs, () => controller?.abort())
      if (result?.ok === true) {
        working = working.filter((item) => item.id !== entry.id)
        onChange(working)
        onResult({ type: 'synced', entry, result, queue: working })
        continue
      }
      if (result?.reason === 'already-answered') {
        working = working.filter((item) => item.id !== entry.id)
        onChange(working)
        onResult({ type: 'duplicate', entry, result, queue: working })
        continue
      }
      if (result?.reason === 'invalid-session') {
        const invalidSessionEntry = { ...entry, status: 'error', lastError: 'invalid-session', nextAttemptAt: null }
        working = replaceEntry(working, entry.id, invalidSessionEntry)
        onChange(working)
        onResult({ type: 'invalid-session', entry: invalidSessionEntry, result, queue: working })
        break
      }
      throw new Error(result?.reason || 'score-api-rejected')
    } catch (error) {
      const attempt = (Number(entry.attempt) || 0) + 1
      const exhausted = attempt >= maxAttempts
      const retryAt = exhausted ? null : (Number(now()) || Date.now()) + backoffMs(attempt)
      const failedEntry = {
        ...entry,
        status: 'error',
        attempt,
        nextAttemptAt: retryAt,
        lastError: String(error?.message || 'score-api-error'),
      }
      working = replaceEntry(working, entry.id, failedEntry)
      onChange(working)
      onResult({ type: exhausted ? 'failed' : 'retry-scheduled', entry: failedEntry, error, queue: working })
    }
  }

  return working
}
