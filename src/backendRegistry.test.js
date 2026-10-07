import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { REGULAR_QUESTIONS } from './regularQuestions.js'
import { WORKBOOK_QUESTIONS } from './workbookQuestionData.js'

const backendSource = fs.readFileSync(new URL('../backend/Code.gs', import.meta.url), 'utf8')
const marker = 'const QUESTION_REGISTRY = '
const start = backendSource.indexOf(marker) + marker.length
const end = backendSource.indexOf(`${String.fromCharCode(10)}${String.fromCharCode(10)}function doGet`, start)
const QUESTION_REGISTRY = Function(`return (${backendSource.slice(start, end)})`)()

function normalizeAnswer(value = '') {
  return String(value).trim().toLowerCase().replace(/[’']/g, "'").replace(/[.,!?。、「」]/g, '').replace(/\s+/g, ' ')
}

test('every regular frontend question is registered with all of its accepted answers', () => {
  assert.equal(Object.keys(QUESTION_REGISTRY).filter((id) => id.startsWith('workbook-')).length, WORKBOOK_QUESTIONS.length)

  for (const question of [...REGULAR_QUESTIONS, ...WORKBOOK_QUESTIONS]) {
    const backendQuestion = QUESTION_REGISTRY[question.id]
    assert.ok(backendQuestion, `${question.id} is missing from backend/Code.gs`)
    assert.equal(backendQuestion.course, 'regular-english-practice', `${question.id} has the wrong course`)
    assert.equal(backendQuestion.difficulty, question.difficulty, `${question.id} has the wrong difficulty`)
    const expected = question.accepted?.length ? question.accepted : [question.answer]
    const actual = (backendQuestion.accepted || []).map(normalizeAnswer)
    for (const answer of expected) {
      assert.ok(actual.includes(normalizeAnswer(answer)), `${question.id} does not accept ${answer}`)
    }
  }
})

test('backend excludes known answer variants that duplicate displayed words or break the sentence', () => {
  const invalidVariants = {
    'reg13-08': 'to live in it',
    'reg16-11': 'being compared with',
    'reg27-10': 'Do I have to',
  }

  for (const [questionId, invalidAnswer] of Object.entries(invalidVariants)) {
    const accepted = (QUESTION_REGISTRY[questionId].accepted || []).map(normalizeAnswer)
    assert.equal(accepted.includes(normalizeAnswer(invalidAnswer)), false, questionId)
  }
})

test('the grammatical gerund alternative for regopt4-02 remains accepted by both app and backend', () => {
  const frontendQuestion = REGULAR_QUESTIONS.find(({ id }) => id === 'regopt4-02')
  const backendQuestion = QUESTION_REGISTRY['regopt4-02']

  assert.ok(frontendQuestion.accepted.includes('your accepting'))
  assert.ok((backendQuestion.accepted || []).map(normalizeAnswer).includes('your accepting'))
  assert.match(frontendQuestion.explanation, /your accepting of my invitation/)
})
