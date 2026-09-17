import test from 'node:test'
import assert from 'node:assert/strict'
import { REGULAR_QUESTIONS } from './regularQuestions.js'

test('平常授業バンクは全問題を一意なIDで持つ', () => {
  assert.ok(REGULAR_QUESTIONS.length >= 100)
  assert.equal(new Set(REGULAR_QUESTIONS.map((question) => question.id)).size, REGULAR_QUESTIONS.length)
})

test('平常授業バンクは出題に必要な正答を持つ', () => {
  for (const question of REGULAR_QUESTIONS) {
    assert.ok(question.answer, question.id)
    if (question.type === 'choice') assert.ok(question.choices.includes(question.answer), question.id)
    if (question.type === 'reorder') assert.ok(question.words.length > 1, question.id)
  }
})
