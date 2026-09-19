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
