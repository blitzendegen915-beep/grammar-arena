import assert from 'node:assert/strict'
import test from 'node:test'
import { CLUB_OPTIONS, clubPoolId, getClubLabel, preferredPoolIdsForProfile } from './clubCatalog.js'

test('catalog contains all 37 named clubs and no-membership option', () => {
  assert.equal(CLUB_OPTIONS.length, 38)
  assert.equal(CLUB_OPTIONS.filter((club) => club.group === '体育局').length, 24)
  assert.equal(CLUB_OPTIONS.filter((club) => club.group === '文化局').length, 13)
  assert.deepEqual(CLUB_OPTIONS.at(-1), { id: 'none', label: '無所属', group: 'その他' })
})

test('club pool IDs preserve the distinct none choice', () => {
  assert.equal(clubPoolId('english'), 'club:english')
  assert.equal(clubPoolId('none'), 'club:none')
  assert.equal(getClubLabel('english'), '英語部')
})

test('restored profile pools include only an allowed club and retain class/foundation pools', () => {
  assert.deepEqual(preferredPoolIdsForProfile({ grade: '2', className: 'B', foundationMember: true, clubId: 'english' }), ['foundation', '2-B', 'club:english'])
  assert.deepEqual(preferredPoolIdsForProfile({ clubId: 'none' }), ['club:none'])
  assert.deepEqual(preferredPoolIdsForProfile({ clubId: 'invalid' }), [])
})
