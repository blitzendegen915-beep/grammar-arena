export const LEADERBOARD_REFRESH_MIN_MS = 15000
export const LEADERBOARD_REFRESH_MAX_MS = 30000

export function getLeaderboardRefreshDelay(random = Math.random) {
  const sample = Number(random())
  const normalized = Number.isFinite(sample) ? Math.min(1, Math.max(0, sample)) : 0.5
  return Math.round(LEADERBOARD_REFRESH_MIN_MS + normalized * (LEADERBOARD_REFRESH_MAX_MS - LEADERBOARD_REFRESH_MIN_MS))
}
