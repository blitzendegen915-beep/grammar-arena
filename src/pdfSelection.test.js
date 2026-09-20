import test from 'node:test'
import assert from 'node:assert/strict'
import { reviewSelectionKey, selectReviewsForPdf } from './pdfSelection.js'

test('partial PDF selection keeps session order and original question numbers', () => {
  const reviews = [1, 2, 3, 4].map((id) => ({ id: `review-${id}`, question: { id: `q-${id}` } }))
  const selected = selectReviewsForPdf(reviews, ['review-4', 'review-2'])

  assert.deepEqual(selected.map(({ review, questionNumber }) => [review.question.id, questionNumber]), [
    ['q-2', 2],
    ['q-4', 4],
  ])
})

test('PDF selection keys fall back to question id and session index', () => {
  const review = { question: { id: 'q-3' } }
  const reviews = [{ question: { id: 'q-1' } }, { question: { id: 'q-2' } }, review]
  assert.equal(reviewSelectionKey(review, 2), 'q-3-2')
  assert.deepEqual(selectReviewsForPdf(reviews, ['q-3-2']), [{ review, questionNumber: 3 }])
})
