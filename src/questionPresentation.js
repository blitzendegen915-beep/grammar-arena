export function getQuestionTranslation(question = {}) {
  return String(question.translation || question.japanese || '').trim()
}
