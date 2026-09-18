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

test('平常授業バンクは出題に必要な正答を持つ', () => {
  for (const question of REGULAR_QUESTIONS) {
    assert.ok(question.answer, question.id)
    if (question.type === 'choice') assert.ok(question.choices.includes(question.answer), question.id)
    if (question.type === 'reorder') assert.ok(question.words.length > 1, question.id)
  }
})

test('日本語訳問題は同じ意味の自然な訳を複数正答として持てる', () => {
  const question = REGULAR_QUESTIONS.find(({ id }) => id === 'reg27-29')
  assert.deepEqual(question.accepted, [
    '彼女は昨夜とても忙しかったのかもしれない。',
    '彼女は昨日の夜とても忙しかったのかもしれない。',
    '彼女は昨晩とても忙しかったのかもしれない。',
  ])
})
