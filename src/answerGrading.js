export function normalizeAnswer(value = '') {
  return String(value || '').trim().toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[.。．,，!！?？、「」]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function isCorrectAnswer(question, userAnswer) {
  const candidates = question.accepted?.length ? question.accepted : [question.answer]
  return candidates.some((answer) => normalizeAnswer(answer) === normalizeAnswer(userAnswer))
}
