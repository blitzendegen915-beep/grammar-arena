const CHART = {
  left: 30,
  right: 268,
  top: 10,
  bottom: 110,
}

function finiteNumber(value) {
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function sessionTime(session, fallbackIndex) {
  const completedAt = Date.parse(session.completedAt || '')
  if (Number.isFinite(completedAt)) return completedAt
  const date = Date.parse(session.date || '')
  if (Number.isFinite(date)) return date
  const id = Number(session.id)
  return Number.isFinite(id) ? id : fallbackIndex
}

function formatRating(value) {
  return Math.round(value).toLocaleString('ja-JP')
}

function pathFor(points) {
  return points.map((point, index) => `${index ? 'L' : 'M'}${point.x} ${point.y}`).join(' ')
}

export function projectSessionRating(startRating, reviews = []) {
  let rating = finiteNumber(startRating) ?? 0
  reviews.forEach((review) => {
    if (review.practiceOnly) return
    const delta = finiteNumber(review.delta)
    if (delta === null) return
    rating = Math.max(800, rating + delta)
  })
  return rating
}

export function buildRatingChartModel(history = [], currentRating, maxPoints = 8) {
  const current = finiteNumber(currentRating)
  const sessions = (Array.isArray(history) ? history : [])
    .map((session, index) => ({ session, index }))
    .filter(({ session }) => finiteNumber(session.ratingAfter) !== null)
    .sort((left, right) => sessionTime(left.session, left.index) - sessionTime(right.session, right.index) || left.index - right.index)

  const rawPoints = []
  if (sessions.length) {
    const first = sessions[0].session
    const firstAfter = finiteNumber(first.ratingAfter)
    const firstStart = finiteNumber(first.ratingStart)
      ?? (firstAfter !== null && finiteNumber(first.ratingDelta) !== null ? firstAfter - Number(first.ratingDelta) : firstAfter)
    if (firstStart !== null) rawPoints.push({ value: firstStart, label: '開始' })
    sessions.forEach(({ session }) => rawPoints.push({
      value: Number(session.ratingAfter),
      label: session.date || session.completedAt || '',
    }))
  } else if (current !== null) {
    rawPoints.push({ value: current, label: '現在' })
  }

  if (current !== null && (!rawPoints.length || rawPoints[rawPoints.length - 1].value !== current)) {
    rawPoints.push({ value: current, label: '現在' })
  }

  const safePoints = rawPoints.length ? rawPoints : [{ value: 0, label: '現在' }]
  const visiblePoints = safePoints.slice(-Math.max(1, maxPoints))
  const values = visiblePoints.map((point) => point.value)
  const rawMin = Math.min(...values)
  const rawMax = Math.max(...values)
  const span = Math.max(100, rawMax - rawMin)
  const padding = Math.max(20, span * 0.15)
  let min = Math.floor((rawMin - padding) / 100) * 100
  let max = Math.ceil((rawMax + padding) / 100) * 100
  if (min === max) max += 100
  if (max - min < 200) {
    const center = (min + max) / 2
    min = Math.floor((center - 100) / 100) * 100
    max = min + 200
  }

  const xRange = CHART.right - CHART.left
  const yRange = CHART.bottom - CHART.top
  const points = visiblePoints.map((point, index) => {
    const x = visiblePoints.length === 1
      ? (CHART.left + CHART.right) / 2
      : CHART.left + (xRange * index) / (visiblePoints.length - 1)
    const y = CHART.bottom - ((point.value - min) / (max - min)) * yRange
    return { ...point, x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) }
  })
  const linePath = pathFor(points)
  const areaPath = `${linePath} L${CHART.right} ${CHART.bottom} L${CHART.left} ${CHART.bottom} Z`
  const labels = [max, Math.round((max + min) / 2), min].map((value) => ({ value, text: formatRating(value) }))
  const grid = labels.map((label, index) => ({
    value: label.value,
    y: CHART.top + (yRange * index) / 2,
    path: `M${CHART.left} ${CHART.top + (yRange * index) / 2}H${CHART.right}`,
  }))

  return {
    points,
    linePath,
    areaPath,
    grid,
    labels,
    min,
    max,
    currentRating: current ?? visiblePoints[visiblePoints.length - 1].value,
  }
}
