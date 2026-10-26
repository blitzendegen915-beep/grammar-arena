import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { REGULAR_QUESTIONS } from './regularQuestions.js'
import { WORKBOOK_QUESTIONS } from './workbookQuestionData.js'
import { REGULAR_2KIMATSU_QUESTIONS } from './regular2kimatsuQuestions.js'
import { countSentenceBlanks } from './questionQuality.js'
import { loadQuestionBank } from './questionBankLoader.js'
import { isCorrectAnswer, normalizeAnswer } from './answerGrading.js'

const COURSE = 'regular-english-practice-2kimatsu'
const normalize = (value = '') => String(value).trim().toLowerCase().replace(/[.,!?。、「」]/g, '').replace(/\s+/g, ' ')

test('2学期期末は既存講座から分離した432問の講座として読み込める', async () => {
  const loaded = await loadQuestionBank(COURSE)
  assert.equal(loaded.length, 432)
  assert.deepEqual(loaded.map(({ id }) => id), REGULAR_2KIMATSU_QUESTIONS.map(({ id }) => id))
  assert.equal(new Set(loaded.map(({ id }) => id)).size, loaded.length)
  assert.equal(loaded.some(({ id }) => REGULAR_QUESTIONS.some((question) => question.id === id)), false)
  assert.equal(loaded.some(({ id }) => WORKBOOK_QUESTIONS.some((question) => question.id === id)), false)
  assert.deepEqual(Object.fromEntries(['input', 'reorder', 'choice'].map((type) => [type, loaded.filter((question) => question.type === type).length])), {
    input: 272,
    reorder: 82,
    choice: 78,
  })
})

test('空欄数・解答・選択肢がバンク内で一致する', () => {
  const ids = new Set()
  const sourceKeys = new Set()

  for (const question of REGULAR_2KIMATSU_QUESTIONS) {
    assert.match(question.id, /^term2k-(eg|wb)-/)
    assert.equal(ids.has(question.id), false, `${question.id} is duplicated`)
    assert.equal(sourceKeys.has(question.sourceKey), false, `${question.sourceKey} is duplicated`)
    ids.add(question.id)
    sourceKeys.add(question.sourceKey)

    assert.ok(question.answer, `${question.sourceKey} has no answer`)
    assert.ok(question.accepted.includes(question.answer), `${question.sourceKey} does not accept its displayed answer`)
    assert.ok(question.explanation, `${question.sourceKey} has no explanation`)
    assert.equal(countSentenceBlanks(question.sentence), question.blankCount, `${question.sourceKey} blank count differs from its sentence`)

    if (question.type === 'input') assert.ok(question.blankCount >= 0)
    if (question.type === 'choice') {
      assert.ok(question.choices.includes(question.answer), `${question.sourceKey} answer is not an option`)
      assert.equal(new Set(question.choices.map(normalize)).size, question.choices.length, `${question.sourceKey} has duplicate choices`)
    }
    if (question.type === 'reorder') {
      assert.ok(question.words.length > 0, `${question.sourceKey} has no word bank`)
      assert.equal(question.sentence.includes('['), false, `${question.sourceKey} shows the source word bank in the sentence`)
    }
    if (question.translationChoice) {
      assert.equal(question.type, 'choice')
      assert.equal(question.choices.length, 4, `${question.sourceKey} should have one answer and three distractors`)
      const accepted = new Set(question.accepted.map(normalize))
      assert.equal(question.choices.filter((choice) => accepted.has(normalize(choice))).length, 1, `${question.sourceKey} has more than one correct choice`)
    }
  }

  assert.deepEqual(Object.fromEntries([0, 1, 2, 3, 4].map((count) => [count, REGULAR_2KIMATSU_QUESTIONS.filter((question) => question.type === 'input' && question.blankCount === count).length])), {
    0: 15,
    1: 147,
    2: 44,
    3: 58,
    4: 8,
  })
})

test('Workbook p.65の手紙は全文を示し、各設問で対象空欄を一つだけ残す', () => {
  const letterQuestions = REGULAR_2KIMATSU_QUESTIONS.filter(({ contextualPassage }) => contextualPassage)
  assert.equal(letterQuestions.length, 5)

  for (const question of letterQuestions) {
    assert.equal(question.blankCount, 1)
    assert.match(question.prompt, /空欄（[1-5]）/)
    assert.match(question.sentence, /Hi Lucy,[\s\S]*Kind regards,[\s\S]*Emma/)
    assert.match(question.sentence, /old temples and shrines/)
  }
})

test('2学期期末の全解答が専用コースとしてApps Scriptに登録されている', () => {
  const source = fs.readFileSync(new URL('../backend/Code.gs', import.meta.url), 'utf8').replace(/\r\n/g, '\n')
  const registryStart = source.indexOf('const QUESTION_REGISTRY = ') + 'const QUESTION_REGISTRY = '.length
  const registryEnd = source.indexOf('\n\nfunction doGet', registryStart)
  const registry = Function(`return (${source.slice(registryStart, registryEnd)})`)()
  const allowed = source.match(/const ALLOWED_COURSES = \[([^\]]+)\]/)?.[1] || ''

  assert.match(allowed, new RegExp(COURSE))
  const termFinalIds = Object.keys(registry).filter((id) => id.startsWith('term2k-'))
  assert.equal(termFinalIds.length, REGULAR_2KIMATSU_QUESTIONS.length)

  for (const question of REGULAR_2KIMATSU_QUESTIONS) {
    const backendQuestion = registry[question.id]
    assert.ok(backendQuestion, `${question.id} is missing from the backend registry`)
    assert.equal(backendQuestion.course, COURSE)
    assert.equal(backendQuestion.difficulty, question.difficulty)
    const accepted = (backendQuestion.accepted || []).map(normalize)
    for (const answer of question.accepted) assert.ok(accepted.includes(normalize(answer)), `${question.id} does not accept ${answer}`)
  }
})

test('frontend and server grading match UI token joins and keep superlative article tolerance scoped', () => {
  const source = fs.readFileSync(new URL('../backend/Code.gs', import.meta.url), 'utf8').replace(/\r\n/g, '\n')
  const normalizeSource = source.match(/function normalizeAnswer_\(value\) \{[\s\S]*?\n\}/)?.[0]
  const correctSource = source.match(/function isAnswerCorrect_\(question, submittedAnswer\) \{[\s\S]*?\n\}/)?.[0]
  assert.ok(normalizeSource)
  assert.ok(correctSource)
  const { normalizeAnswer_, isAnswerCorrect_ } = new Function(`${normalizeSource}\n${correctSource}\nreturn { normalizeAnswer_, isAnswerCorrect_ }`)()
  const registryStart = source.indexOf('const QUESTION_REGISTRY = ') + 'const QUESTION_REGISTRY = '.length
  const registryEnd = source.indexOf('\n\nfunction doGet', registryStart)
  const registry = Function(`return (${source.slice(registryStart, registryEnd)})`)()

  const reorder = REGULAR_2KIMATSU_QUESTIONS.find(({ id }) => id === 'term2k-wb-p53-plus-s2-1-5')
  const backendReorder = registry[reorder.id]
  const selectedLabels = ['when', 'fishing', 'at', 'the riverside']
  const selectedTokens = selectedLabels.map((label) => reorder.words.find((word) => word.toLowerCase() === label))
  assert.ok(selectedTokens.every(Boolean), 'the UI answer uses tokens from the word bank')
  const uiAnswer = selectedTokens.join(' ')

  assert.deepEqual(backendReorder.accepted, reorder.accepted)
  assert.equal(isCorrectAnswer(reorder, uiAnswer), true)
  assert.equal(isAnswerCorrect_(backendReorder, uiAnswer), true)
  assert.equal(isCorrectAnswer(reorder, reorder.answerLabel), false)
  assert.equal(isAnswerCorrect_(backendReorder, reorder.answerLabel), false)

  for (const sample of [' answer. ', 'Answer.', 'ANSWER']) {
    assert.equal(normalizeAnswer(sample), normalizeAnswer_(sample))
  }
  assert.equal(normalizeAnswer(' answer. '), 'answer')

  const careful = REGULAR_2KIMATSU_QUESTIONS.find(({ id }) => id === 'term2k-wb-p56-check-1-14s')
  const backendCareful = registry[careful.id]
  assert.deepEqual(backendCareful.accepted, careful.accepted)
  assert.equal(isCorrectAnswer(careful, 'the most careful'), true)
  assert.equal(isAnswerCorrect_(backendCareful, 'the most careful'), true)

  const comparative = REGULAR_2KIMATSU_QUESTIONS.find(({ id }) => id === 'term2k-wb-p56-check-1-14c')
  const generalBlank = REGULAR_2KIMATSU_QUESTIONS.find(({ id }) => id === 'term2k-wb-p57-check-4-2')
  const backendGeneralBlank = registry[generalBlank.id]
  assert.equal(isCorrectAnswer(comparative, 'the more careful'), false)
  assert.equal(isAnswerCorrect_(registry[comparative.id], 'the more careful'), false)
  assert.equal(isCorrectAnswer(generalBlank, 'deepest'), false)
  assert.equal(isAnswerCorrect_(backendGeneralBlank, 'deepest'), false)
  assert.equal(isCorrectAnswer(generalBlank, 'the deepest'), true)
  assert.equal(isAnswerCorrect_(backendGeneralBlank, 'the deepest'), true)
})
