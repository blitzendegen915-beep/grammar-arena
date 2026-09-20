export function reviewSelectionKey(review, index) {
  return review.id || `${review.question.id}-${index}`
}

export function selectReviewsForPdf(reviews = [], selectedIds = []) {
  const selectedKeys = new Set(selectedIds)
  return reviews.flatMap((review, index) => (
    selectedKeys.has(reviewSelectionKey(review, index))
      ? [{ review, questionNumber: index + 1 }]
      : []
  ))
}
