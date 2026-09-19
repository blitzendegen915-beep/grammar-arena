export const AUTH_REQUEST_MAX_ATTEMPTS = 4
export const AUTH_REQUEST_TIMEOUT_MS = 20000
export const AUTH_RETRY_BASE_DELAY_MS = 700
export const AUTH_RETRY_MAX_DELAY_MS = 5000

const RETRYABLE_REASONS = new Set([
  'server-busy',
  'service-unavailable',
  'quota-exceeded',
])

export function isRetryableAuthResult(result) {
  return Boolean(result && result.ok === false && (result.retryable === true || RETRYABLE_REASONS.has(result.reason)))
}

export function authRetryDelay(attempt, random = Math.random()) {
  const exponential = Math.min(AUTH_RETRY_MAX_DELAY_MS, AUTH_RETRY_BASE_DELAY_MS * (2 ** Math.max(0, Number(attempt) || 0)))
  return Math.round(exponential + Math.max(0, Math.min(1, Number(random) || 0)) * 700)
}

export async function requestAuthWithRetry(request, {
  maxAttempts = AUTH_REQUEST_MAX_ATTEMPTS,
  sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds)),
  random = Math.random,
} = {}) {
  let lastError
  const attempts = Math.max(1, Number(maxAttempts) || AUTH_REQUEST_MAX_ATTEMPTS)
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const result = await request(attempt)
      if (!isRetryableAuthResult(result) || attempt === attempts - 1) return result
    } catch (error) {
      lastError = error
      if (attempt === attempts - 1) throw error
    }
    await sleep(authRetryDelay(attempt, random()))
  }
  throw lastError || new Error('auth-request-failed')
}
