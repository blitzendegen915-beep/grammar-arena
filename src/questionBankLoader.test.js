import assert from 'node:assert/strict'
import test from 'node:test'
import { loadQuestionBank } from './questionBankLoader.js'

test('問題バンクは単元を選んだときに読み込める', async () => {
  const regular = await loadQuestionBank('regular-english-practice')
  const gerund = await loadQuestionBank('foundation-gerund')
  const participles = await loadQuestionBank('foundation-participles')

  assert.equal(regular.length, 154)
  assert.equal(gerund.length, 12)
  assert.equal(participles.length, 12)
  assert.equal(regular[0].id, 'reg27-01')
})

test('未知の単元は渡されたフォールバックを使う', async () => {
  const fallback = [{ id: 'fallback-01' }]
  assert.deepEqual(await loadQuestionBank('future-unit', fallback), fallback)
})
