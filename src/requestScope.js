export function isSameRequestScope(left, right) {
  if (!left || !right || !left.name || !left.token || !right.name || !right.token) return false
  return ['name', 'token', 'course', 'poolId'].every((field) => left[field] === right[field])
}
