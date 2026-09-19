const BLANK_PLACEHOLDER_RE = /\(\s*\u3000+\s*\)|\uFF08\s*\u3000+\s*\uFF09|_{2,}/g

export function countSentenceBlanks(sentence = '') {
  return String(sentence).match(BLANK_PLACEHOLDER_RE)?.length || 0
}

export function isBlankPlaceholder(value = '') {
  return /^(\(\s*\u3000+\s*\)|\uFF08\s*\u3000+\s*\uFF09|_{2,})$/.test(String(value))
}

export function withBlankCount(question) {
  return {
    ...question,
    blankCount: countSentenceBlanks(question.sentence || ''),
  }
}

// Input drills use one field for each visible blank.
export function inputSlotCount(question) {
  return Math.max(1, Number(question?.blankCount) || 0)
}
