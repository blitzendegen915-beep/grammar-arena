import test from 'node:test'
import assert from 'node:assert/strict'
import { getQuestionTranslation, splitRewriteSentences } from './questionPresentation.js'
import { REGULAR_QUESTIONS } from './regularQuestions.js'

test('翻訳表示はtranslationを優先し、japaneseとの二重表示を作らない', () => {
  assert.equal(getQuestionTranslation({ translation: '正しい訳', japanese: '同じ訳' }), '正しい訳')
  assert.equal(getQuestionTranslation({ japanese: 'フォールバック訳' }), 'フォールバック訳')
  assert.equal(getQuestionTranslation({ translation: '  訳  ' }), '訳')
})

test('平常授業の入力問題は日本語訳を一つのフィールドだけで持つ', () => {
  for (const question of REGULAR_QUESTIONS.filter((item) => item.type === 'input')) {
    assert.equal(question.japanese, undefined, question.id)
  }
})

test('rewrite questions are split into two vertical sentences without breaking titles', () => {
  assert.deepEqual(splitRewriteSentences('It seemed Mr. Inoue was looking for something. Mr. Inoue seemed to be looking for something.'), [
    'It seemed Mr. Inoue was looking for something.',
    'Mr. Inoue seemed to be looking for something.',
  ])
})
