export function getQuestionTranslation(question = {}) {
  return String(question.translation || question.japanese || '').trim()
}

export function splitRewriteSentences(sentence = '') {
  const protectedSentence = String(sentence).replace(/\b(Mr|Mrs|Ms|Dr)\.\s+/g, '$1\u0000 ')
  return protectedSentence
    .split(/(?<=[.?!])\s+/)
    .map((part) => part.replace(/\u0000/g, '.').trim())
    .filter(Boolean)
}
