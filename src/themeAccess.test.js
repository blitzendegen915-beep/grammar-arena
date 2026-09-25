import assert from 'node:assert/strict'
import test from 'node:test'
import { shouldResetThemeSelection } from './themeAccess.js'

const hiddenThemeIds = new Set(['moon', 'crystallium', 'dignity'])

test('keeps Dignity selected for an authenticated account that unlocked it', () => {
  assert.equal(shouldResetThemeSelection('dignity', true, ['dignity'], hiddenThemeIds), false)
})

test('does not apply unlock checks to ordinary selectable themes', () => {
  assert.equal(shouldResetThemeSelection('ascention', true, [], hiddenThemeIds), false)
})

test('resets a hidden theme that the account has not unlocked', () => {
  assert.equal(shouldResetThemeSelection('moon', true, [], hiddenThemeIds), true)
})

test('resets hidden themes when there is no authenticated session', () => {
  assert.equal(shouldResetThemeSelection('dignity', false, ['dignity'], hiddenThemeIds), true)
})
