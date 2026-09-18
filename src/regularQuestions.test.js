import test from 'node:test'
import assert from 'node:assert/strict'
import { REGULAR_QUESTIONS } from './regularQuestions.js'

test('平常授業バンクは全問題を一意なIDで持つ', () => {
  assert.equal(REGULAR_QUESTIONS.length, 155)
  assert.equal(new Set(REGULAR_QUESTIONS.map((question) => question.id)).size, REGULAR_QUESTIONS.length)
})

test('英語演習I 2中の二学期範囲を全問収録している', () => {
  const expectedByLesson = {
    'Lesson 27': 35,
    'Lesson 13': 14,
    'Lesson 14': 14,
    'Lesson 15': 16,
    Plus: 16,
    'Lesson 16': 13,
    'Lesson 17': 16,
    'Option 4': 15,
    'Option 7': 16,
  }
  const actualByLesson = Object.groupBy(REGULAR_QUESTIONS, ({ lesson }) => lesson)
  assert.deepEqual(
    Object.fromEntries(Object.entries(actualByLesson).map(([lesson, questions]) => [lesson, questions.length])),
    expectedByLesson,
  )
})

test('訳問題は正答1つとダミー3つの4択になっている', () => {
  const translationQuestions = REGULAR_QUESTIONS.filter(({ prompt }) => prompt === '下線部に注意して、正しい日本語訳を選びなさい。')
  assert.equal(translationQuestions.length, 21)
  for (const question of translationQuestions) {
    assert.equal(question.type, 'choice', question.id)
    assert.equal(question.choices.length, 4, question.id)
    assert.equal(new Set(question.choices).size, 4, question.id)
    assert.ok(question.choices.includes(question.answer), question.id)
  }
})

test('平常授業バンクは出題に必要な正答を持つ', () => {
  for (const question of REGULAR_QUESTIONS) {
    assert.ok(question.answer, question.id)
    if (question.type === 'choice') assert.ok(question.choices.includes(question.answer), question.id)
    if (question.type === 'reorder') assert.ok(question.words.length > 1, question.id)
  }
})

test('訳問題は正答を選択肢として明示する', () => {
  const question = REGULAR_QUESTIONS.find(({ id }) => id === 'reg27-29')
  assert.equal(question.answer, '彼女は昨夜とても忙しかったのかもしれない。')
  assert.ok(question.choices.includes(question.answer))
  assert.equal(question.choices.length, 4)
})
