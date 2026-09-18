import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'

const source = fs.readFileSync(new URL('../backend/Code.gs', import.meta.url), 'utf8')
const start = source.indexOf('function playerPools_(row)')
const end = source.indexOf('function ensurePoolProfile_(')
const context = {
  FOUNDATION_POOL_ID: 'foundation',
  cleanGrade_: (value) => ['1', '2', '3'].includes(String(value)) ? String(value) : '',
  cleanClassName_: (value) => /^[A-M]$/.test(String(value)) ? String(value) : '',
}

vm.runInNewContext(`${source.slice(start, end)}\nthis.playerPools_ = playerPools_`, context)

test('foundation members can access foundation and their own class pool only', () => {
  assert.deepEqual([...context.playerPools_(['key', 'name', 1240, 0, '', '', '', '1', 'L', true])], ['foundation', '1-L'])
})

test('non-foundation members can access only their own class pool', () => {
  assert.deepEqual([...context.playerPools_(['key', 'name', 1240, 0, '', '', '', '1', 'L', false])], ['1-L'])
})

test('foundation membership without placement does not invent a class pool', () => {
  assert.deepEqual([...context.playerPools_(['key', 'name', 1240, 0, '', '', '', '', '', true])], ['foundation'])
})

test('unplaced students have no ranking pool', () => {
  assert.deepEqual([...context.playerPools_(['key', 'name', 1240, 0, '', '', '', '', '', false])], [])
})
