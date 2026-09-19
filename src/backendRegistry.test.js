import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { REGULAR_QUESTIONS } from './regularQuestions.js'

const backendSource = fs.readFileSync(new URL('../backend/Code.gs', import.meta.url), 'utf8')
const marker = 'const QUESTION_REGISTRY = '
const start = backendSource.indexOf(marker) + marker.length
const end = backendSource.indexOf(`${String.fromCharCode(10)}${String.fromCharCode(10)}function doGet`, start)
const QUESTION_REGISTRY = Function(`return (${backendSource.slice(start, end)})`)()

function normalizeAnswer(value = '') {
  return String(value).trim().toLowerCase().replace(/[’']/g, "'").replace(/[.,!?。、「」]/g, '').replace(/\s+/g, ' ')
}

test('every regular frontend question is registered with all of its accepted answers', () => {
  for (const question of REGULAR_QUESTIONS) {
    const backendQuestion = QUESTION_REGISTRY[question.id]
    assert.ok(backendQuestion, `${question.id} is missing from backend/Code.gs`)
    assert.equal(backendQuestion.course, 'regular-english-practice', `${question.id} has the wrong course`)
    const expected = question.accepted?.length ? question.accepted : [question.answer]
    const actual = (backendQuestion.accepted || []).map(normalizeAnswer)
    for (const answer of expected) {
      assert.ok(actual.includes(normalizeAnswer(answer)), `${question.id} does not accept ${answer}`)
    }
  }
})
