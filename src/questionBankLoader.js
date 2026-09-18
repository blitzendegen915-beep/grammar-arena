const cache = new Map()

const loaders = {
  'foundation-gerund': () => import('./questionBanks.js').then(({ GERUND_QUESTIONS }) => GERUND_QUESTIONS),
  'foundation-participles': () => import('./questionBanks.js').then(({ PARTICIPLE_QUESTIONS }) => PARTICIPLE_QUESTIONS),
  'regular-english-practice': () => import('./regularQuestions.js').then(({ REGULAR_QUESTIONS }) => REGULAR_QUESTIONS),
}

export function loadQuestionBank(modeId, foundationQuestions = []) {
  if (modeId === 'foundation-infinitive') return Promise.resolve(foundationQuestions)
  if (!cache.has(modeId)) {
    const loader = loaders[modeId]
    cache.set(modeId, loader ? loader() : Promise.resolve(foundationQuestions))
  }
  return cache.get(modeId)
}
