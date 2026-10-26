const BASELINE = 1240
const COURSE_IDS = ['foundation-course', 'regular-english-practice', 'regular-english-practice-2kimatsu']

export function calculateOverallRating(courseRatings = {}, pendingDeltas = []) {
  const total = COURSE_IDS.reduce((sum, courseId) => {
    const value = Number(courseRatings?.[courseId])
    return sum + (Number.isFinite(value) ? Math.max(0, value - BASELINE) : 0)
  }, 0)
  const pending = pendingDeltas.reduce((sum, delta) => sum + (Number.isFinite(Number(delta)) ? Number(delta) : 0), 0)
  return BASELINE + total + pending
}

export function getProvisionalOverallRating(serverOverall, courseRatings, pendingDeltas = []) {
  const base = serverOverall === null || serverOverall === undefined || serverOverall === '' ? NaN : Number(serverOverall)
  const ratings = { ...(courseRatings || {}) }
  const initial = COURSE_IDS.reduce((sum, courseId) => {
    const value = Number(ratings[courseId])
    return sum + (Number.isFinite(value) ? Math.max(0, value - BASELINE) : 0)
  }, 0)
  for (const item of pendingDeltas) {
    const courseId = typeof item === 'object' ? item.course : ''
    const delta = typeof item === 'object' ? item.delta : item
    if (!Number.isFinite(Number(delta))) continue
    if (COURSE_IDS.includes(courseId) && Number.isFinite(Number(ratings[courseId]))) {
      ratings[courseId] = Math.max(800, Number(ratings[courseId]) + Number(delta))
    } else {
      // Without that course's starting rating, the effect on its above-baseline
      // gain cannot be known safely. Keep the server summary until it is available.
    }
  }
  const projected = COURSE_IDS.reduce((sum, courseId) => {
    const value = Number(ratings[courseId])
    return sum + (Number.isFinite(value) ? Math.max(0, value - BASELINE) : 0)
  }, 0)
  return (Number.isFinite(base) ? base : BASELINE + initial) + (projected - initial)
}
