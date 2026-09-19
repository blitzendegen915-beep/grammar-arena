import test from 'node:test'
import assert from 'node:assert/strict'
import { REGULAR_QUESTIONS } from './regularQuestions.js'

test('so as to input question renders only the cloze sentence', () => {
  const question = REGULAR_QUESTIONS.find(({ id }) => id === 'regplus-09')

  assert.equal(question.sentence, 'The man was so kind as (　　　) (　　　) me the way.')
  assert.equal(question.blankCount, 2)
  assert.equal((question.sentence.match(/The man was so kind as/g) || []).length, 1)
})

test('full-sentence English answers use an instruction that is not about blanks', () => {
  const fullSentenceInputIds = [
    'reg27-32', 'reg27-33', 'reg27-34', 'reg27-35',
    'reg13-14', 'reg14-14', 'reg15-16', 'reg16-13', 'reg17-16',
  ]

  for (const id of fullSentenceInputIds) {
    const question = REGULAR_QUESTIONS.find((item) => item.id === id)
    assert.equal(question.type, 'input', id)
    assert.equal(question.blankCount, 0, id)
    assert.equal(question.prompt, '日本語に合う英文を入力しなさい。', id)
  }
})

test('rewrite questions carry the rewrite instruction and metadata', () => {
  const rewriteIds = [
    'reg27-07', 'reg27-08', 'reg27-09', 'reg27-10', 'reg27-11',
    'reg15-07', 'reg15-08', 'reg15-09', 'reg15-10',
    'regplus-06', 'regplus-07', 'regplus-08',
    'regopt4-01', 'regopt4-02', 'regopt4-03', 'regopt4-04', 'regopt4-05',
  ]

  for (const id of rewriteIds) {
    const question = REGULAR_QUESTIONS.find((item) => item.id === id)
    assert.equal(question.rewrite, true, id)
    assert.match(question.prompt, /同じ意味/, id)
    assert.ok(question.sentence.includes('. ') || question.sentence.includes('? '), id)
  }
})

test('every multi-sentence input question is explicitly reviewed', () => {
  const reviewedIds = new Set([
    'reg27-02', 'reg27-05', 'reg27-07', 'reg27-08', 'reg27-09', 'reg27-10', 'reg27-11',
    'reg15-07', 'reg15-08', 'reg15-09', 'reg15-10',
    'regplus-06', 'regplus-07', 'regplus-08', 'reg17-03',
    'regopt4-01', 'regopt4-02', 'regopt4-03', 'regopt4-04', 'regopt4-05',
  ])
  const actualIds = REGULAR_QUESTIONS
    .filter((question) => question.type === 'input' && (question.sentence.match(/[.?!]/g) || []).length >= 2)
    .map((question) => question.id)
  assert.deepEqual(new Set(actualIds), reviewedIds)
})
