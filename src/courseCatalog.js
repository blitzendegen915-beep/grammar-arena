export const DEFAULT_MODE_ID = 'regular-english-practice'

export const COURSE_MODES = [
  { id: 'regular-english-practice', label: '英語演習 - 平常授業', available: true },
  { id: 'regular-english-practice-2kimatsu', label: '英語演習 - 2学期期末', available: true },
]

const RETIRED_FOUNDATION_MODES = new Set([
  'foundation-infinitive', 'foundation-gerund', 'foundation-participles', 'foundation-course',
])

export function restoreActiveCourseProfile(profile, poolId, defaultRating = 1240) {
  if (COURSE_MODES.some(({ id }) => id === profile.modeId)) return profile

  const ratingsByCourse = { ...(profile.ratingsByCourse || {}) }
  const ratingsByScope = { ...(profile.ratingsByScope || {}) }
  const answeredByCourse = { ...(profile.answeredByCourse || {}) }
  const previousPool = profile.rankingPoolId || poolId || 'foundation'
  if (RETIRED_FOUNDATION_MODES.has(profile.modeId) && Number.isFinite(Number(profile.rating))) {
    ratingsByCourse['foundation-course'] = Number(profile.rating)
    ratingsByScope[`foundation-course::${previousPool}`] = Number(profile.rating)
  }
  if (RETIRED_FOUNDATION_MODES.has(profile.modeId)) {
    answeredByCourse['foundation-course'] = [...new Set([
      ...(answeredByCourse['foundation-course'] || []), ...(profile.answeredIds || []),
    ])]
  }

  const nextScope = `${DEFAULT_MODE_ID}::${poolId || 'foundation'}`
  const rating = Number(ratingsByScope[nextScope]) || Number(ratingsByCourse[DEFAULT_MODE_ID]) || defaultRating
  return {
    ...profile,
    modeId: DEFAULT_MODE_ID,
    rating,
    ratingsByCourse,
    ratingsByScope,
    answeredByCourse,
    answeredIds: [...(answeredByCourse[DEFAULT_MODE_ID] || [])],
  }
}
