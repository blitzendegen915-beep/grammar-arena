import assert from 'node:assert/strict'
import test from 'node:test'
import { isSameRequestScope } from './requestScope.js'

const accountA = {
  name: 'Student A',
  token: 'token-a',
  course: 'foundation-course',
  poolId: '1-a',
}

test('rejects a slow account A response after logout and account B login', () => {
  const activeAfterLogout = { ...accountA, name: '', token: '' }
  const activeAfterBLogin = { ...accountA, name: 'Student B', token: 'token-b' }

  assert.equal(isSameRequestScope(accountA, activeAfterLogout), false)
  assert.equal(isSameRequestScope(accountA, activeAfterBLogin), false)
})

test('rejects a response after the active pool changes', () => {
  assert.equal(isSameRequestScope(accountA, { ...accountA, poolId: '2-b' }), false)
})

test('rejects a response after the active course changes', () => {
  assert.equal(isSameRequestScope(accountA, { ...accountA, course: 'regular-english-practice' }), false)
})

test('allows a response when name, token, course, and pool are unchanged', () => {
  assert.equal(isSameRequestScope(accountA, { ...accountA }), true)
})

test('requires both name and token to be nonempty', () => {
  assert.equal(isSameRequestScope({ ...accountA, name: '' }, accountA), false)
  assert.equal(isSameRequestScope({ ...accountA, token: '' }, accountA), false)
  assert.equal(isSameRequestScope(accountA, { ...accountA, name: '' }), false)
  assert.equal(isSameRequestScope(accountA, { ...accountA, token: '' }), false)
})
