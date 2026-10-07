import fs from 'node:fs'
import test from 'node:test'
import assert from 'node:assert/strict'
import { countSentenceBlanks, inputSlotCount, withBlankCount } from './questionQuality.js'
import { GERUND_QUESTIONS, PARTICIPLE_QUESTIONS } from './questionBanks.js'
import { REGULAR_QUESTIONS } from './regularQuestions.js'
import { WORKBOOK_QUESTIONS } from './workbookQuestionData.js'

const mainSource = fs.readFileSync(new URL('./main.jsx', import.meta.url), 'utf8')
const foundationSource = mainSource.match(/const QUESTIONS = ([\s\S]*?)\r?\n\r?\nconst DIFFICULTY/)?.[1]
const FOUNDATION_QUESTIONS = Function(`return (${foundationSource})`)().map(withBlankCount)

const REGULAR_SOURCE_BLANK_COUNTS = {
  'reg27-01': 2, 'reg27-02': 1, 'reg27-03': 1, 'reg27-04': 2, 'reg27-05': 2,
  'reg27-06': 2, 'reg27-07': 2, 'reg27-08': 1, 'reg27-09': 3, 'reg27-10': 3,
  'reg27-11': 2, 'reg27-16': 1, 'reg27-17': 1, 'reg27-18': 1, 'reg27-19': 1,
  'reg27-20': 1, 'reg27-21': 1,
  'reg13-05': 3, 'reg13-06': 2, 'reg13-07': 2, 'reg13-08': 3,
  'reg14-06': 4, 'reg14-07': 4, 'reg14-08': 4, 'reg14-09': 4,
  'reg15-02': 1, 'reg15-07': 2, 'reg15-08': 3, 'reg15-09': 3, 'reg15-10': 4,
  'regplus-06': 3, 'regplus-07': 2, 'regplus-08': 3, 'regplus-09': 2,
  'regplus-10': 2, 'regplus-11': 3, 'regplus-12': 2, 'regplus-13': 2,
  'regplus-14': 2, 'regplus-15': 1, 'regplus-16': 2,
  'reg16-01': 1, 'reg16-02': 1, 'reg16-03': 1, 'reg16-04': 1, 'reg16-05': 1,
  'reg16-10': 2, 'reg16-11': 2, 'reg16-12': 1,
  'reg17-01': 3, 'reg17-02': 3, 'reg17-03': 3, 'reg17-04': 2,
  'reg17-12': 1, 'reg17-13': 2, 'reg17-14': 1, 'reg17-15': 1,
  'regopt4-01': 2, 'regopt4-02': 2, 'regopt4-03': 2, 'regopt4-04': 3, 'regopt4-05': 2,
  'regopt7-01': 1, 'regopt7-02': 1, 'regopt7-03': 1, 'regopt7-04': 1, 'regopt7-05': 2,
}

test('every question carries a blank count matching its visible sentence slots', () => {
  const banks = [...FOUNDATION_QUESTIONS, ...GERUND_QUESTIONS, ...PARTICIPLE_QUESTIONS, ...REGULAR_QUESTIONS]
  for (const question of banks) {
    assert.equal(typeof question.blankCount, 'number', question.id)
    assert.equal(question.blankCount, countSentenceBlanks(question.sentence || ''), question.id)
  }
})

test('regular-class app blank counts are exhaustive and reviewed', () => {
  const actual = Object.fromEntries(
    REGULAR_QUESTIONS
      .filter((question) => question.blankCount > 0)
      .map((question) => [question.id, question.blankCount]),
  )
  assert.deepEqual(Object.keys(actual).sort(), Object.keys(REGULAR_SOURCE_BLANK_COUNTS).sort())
  assert.deepEqual(actual, REGULAR_SOURCE_BLANK_COUNTS)
})

test('each cloze has a correct answer that fits one word per input', () => {
  const banks = [...FOUNDATION_QUESTIONS, ...GERUND_QUESTIONS, ...PARTICIPLE_QUESTIONS, ...REGULAR_QUESTIONS]
  for (const question of banks.filter((q) => q.type === 'input' && q.blankCount > 0)) {
    const answers = question.accepted || [question.answer]
    assert.ok(answers.some((answer) => String(answer).replace(/\.{3}|…/g, ' ').trim().split(/\s+/).length === question.blankCount), question.id)
  }
})

test('cloze answers match the exact text produced by joining the visible input fields', () => {
  const banks = [...FOUNDATION_QUESTIONS, ...GERUND_QUESTIONS, ...PARTICIPLE_QUESTIONS, ...REGULAR_QUESTIONS]
  const normalizeAnswer = (value) => String(value)
    .trim()
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[。．,，!！?？]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/[.,!?。、「」]/g, '')

  for (const question of banks.filter((item) => item.type === 'input' && item.blankCount > 0)) {
    const answerFromFields = String(question.answer).replace(/\.{3}|…/g, ' ').replace(/\s+/g, ' ').trim()
    const accepted = question.accepted?.length ? question.accepted : [question.answer]
    assert.ok(accepted.some((answer) => normalizeAnswer(answer) === normalizeAnswer(answerFromFields)), `${question.id}: ${answerFromFields}`)
  }
})

test('reorder answer uses every displayed word exactly once', () => {
  const banks = [...FOUNDATION_QUESTIONS, ...GERUND_QUESTIONS, ...PARTICIPLE_QUESTIONS, ...REGULAR_QUESTIONS]
  const sortWords = (words) => words.map((word) => word.toLowerCase()).sort()

  for (const question of banks.filter((item) => item.type === 'reorder')) {
    assert.deepEqual(sortWords(question.answer.trim().split(/\s+/)), sortWords(question.words), question.id)
  }
})

test('choice questions have distinct choices and include their keyed answer', () => {
  const banks = [...FOUNDATION_QUESTIONS, ...GERUND_QUESTIONS, ...PARTICIPLE_QUESTIONS, ...REGULAR_QUESTIONS]

  for (const question of banks.filter((item) => item.type === 'choice')) {
    assert.ok(question.choices.length >= 2, question.id)
    assert.equal(new Set(question.choices).size, question.choices.length, question.id)
    assert.ok(question.choices.includes(question.answer), question.id)
  }
})

test('input questions render one input field per visible blank', () => {
  const inputQuestions = [...FOUNDATION_QUESTIONS, ...GERUND_QUESTIONS, ...PARTICIPLE_QUESTIONS, ...REGULAR_QUESTIONS]
    .filter((question) => question.type === 'input')
  for (const question of inputQuestions) {
    assert.equal(inputSlotCount(question), Math.max(1, question.blankCount), question.id)
  }

  const soAs = REGULAR_QUESTIONS.find((question) => question.id === 'regplus-13')
  assert.equal(inputSlotCount(soAs), 2)
})

test('Workbook regular-class questions keep their displayed slots, answer keys, and explanations aligned', () => {
  assert.equal(WORKBOOK_QUESTIONS.length, 213)
  assert.equal(new Set(WORKBOOK_QUESTIONS.map(({ id }) => id)).size, 213)

  for (const question of WORKBOOK_QUESTIONS) {
    assert.ok(question.id.startsWith('workbook-'), question.id)
    assert.ok(question.explanation.trim(), `${question.id} has no explanation`)

    if (question.type === 'input') {
      assert.equal(question.blankCount, countSentenceBlanks(question.sentence || ''), question.id)
      assert.equal(inputSlotCount(question), Math.max(1, question.blankCount), question.id)
      assert.ok((question.accepted || [question.answer]).includes(question.answer), question.id)
    } else if (question.type === 'choice') {
      assert.ok(question.choices.length >= 2, question.id)
      assert.equal(new Set(question.choices).size, question.choices.length, question.id)
      assert.ok(question.choices.includes(question.answer), question.id)
    } else if (question.type === 'reorder') {
      const normalize = (value) => String(value)
        .toLowerCase()
        .replace(/[.,!?;:]/g, '')
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/\s+/g, ' ')
        .trim()
      const words = question.words.flatMap((word) => normalize(word).split(/\s+/)).sort()
      const answerWords = normalize(question.answer).split(/\s+/).sort()
      assert.deepEqual(words, answerWords, question.id)
    } else {
      assert.fail(`${question.id} has unsupported type ${question.type}`)
    }
  }
})
