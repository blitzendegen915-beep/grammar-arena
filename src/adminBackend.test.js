import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'

const source = readFileSync(fileURLToPath(new URL('../backend/Code.gs', import.meta.url)), 'utf8')

function sheet(rows = []) {
  return {
    rows: rows.map((row) => [...row]),
    getDataRange() { return { getValues: () => this.rows } },
    getLastRow() { return this.rows.length },
    getLastColumn() { return Math.max(0, ...this.rows.map((row) => row.length)) },
    getRange(row, column, rowCount = 1, columnCount = 1) {
      const current = this
      return {
        getValue() { return current.rows[row - 1]?.[column - 1] ?? '' },
        getValues() { return Array.from({ length: rowCount }, (_, rowOffset) => Array.from({ length: columnCount }, (_, columnOffset) => current.rows[row - 1 + rowOffset]?.[column - 1 + columnOffset] ?? '')) },
        setValue(value) {
          while (current.rows.length < row) current.rows.push([])
          current.rows[row - 1][column - 1] = value
        },
        setValues(values) {
          values.forEach((valuesRow, rowOffset) => {
            while (current.rows.length < row + rowOffset) current.rows.push([])
            valuesRow.forEach((value, columnOffset) => { current.rows[row - 1 + rowOffset][column - 1 + columnOffset] = value })
          })
        },
      }
    },
    appendRow(row) { this.rows.push([...row]) },
  }
}

function player(name, { grade = '1', className = 'A', foundationMember = false } = {}) {
  const key = name.toLowerCase()
  const row = Array(11).fill('')
  row[0] = key
  row[1] = name
  row[2] = 1240
  row[3] = 0
  row[5] = 'pin-hash'
  row[6] = `session-hash:${key}`
  row[7] = grade
  row[8] = className
  row[9] = foundationMember
  row[10] = '[]'
  return row
}

function configuredBackend() {
  const backend = vm.createContext({})
  vm.runInContext(source, backend)
  const players = sheet([
    ['playerKey', 'name', 'rating', 'answered', 'updatedAt', 'pinSecret', 'tokenHash', 'grade', 'className', 'foundationMember', 'unlockedThemes'],
    player('おとめ座'),
    player('Alice', { foundationMember: true }),
    player('Bob', { grade: '2', className: 'B' }),
  ])
  const courseProfiles = sheet([['playerKey', 'course', 'rating', 'answered', 'updatedAt']])
  const poolProfiles = sheet([
    ['playerKey', 'course', 'poolId', 'rating', 'answered', 'updatedAt'],
    ['alice', 'foundation-course', 'foundation', 1240, 8, new Date(1)],
    ['alice', 'regular-english-practice', 'foundation', 1800, 10, new Date(1)],
    ['alice', 'foundation-course', '1-A', 1500, 6, new Date(1)],
    ['bob', 'foundation-course', '2-B', 1300, 2, new Date(1)],
  ])
  const answers = sheet([['playerKey', 'course', 'questionId', 'correct', 'delta', 'answeredAt', 'answerId']])
  const audit = new Map()
  const book = {
    getSheetByName(name) { return audit.get(name) || null },
    insertSheet(name) { const created = sheet(); created.name = name; audit.set(name, created); return created },
  }
  const properties = new Map()
  const cache = new Map()
  let sequence = 0
  backend.LockService = { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) }
  backend.PropertiesService = { getScriptProperties: () => ({ getProperty: (key) => properties.get(key) || null, setProperties: (values) => Object.entries(values).forEach(([key, value]) => properties.set(key, String(value))) }) }
  backend.CacheService = { getScriptCache: () => ({
    get: (key) => cache.get(key) || null,
    put: (key, value) => cache.set(key, String(value)),
    remove: (key) => cache.delete(key),
  }) }
  backend.Utilities = {
    DigestAlgorithm: { SHA_256: 'SHA_256' },
    Charset: { UTF_8: 'UTF_8' },
    getUuid: () => `uuid-${++sequence}`,
    computeDigest: (_algorithm, value) => Array.from(String(value), (char) => char.charCodeAt(0) % 255),
    base64EncodeWebSafe: (bytes) => Array.from(bytes).map((value) => value.toString(16).padStart(2, '0')).join(''),
  }
  backend.tokenHashFor_ = (token, key) => `session-hash:${key}:${token}`
  backend.getBook_ = () => book
  backend.getRuntimeSheets_ = () => ({ players, answers, courseProfiles, poolProfiles })
  backend.authenticate_ = (_players, name, token) => {
    const key = String(name || '').trim().toLowerCase()
    const index = players.rows.findIndex((row, rowIndex) => rowIndex > 0 && row[0] === key)
    return index > 0 && token === `session:${key}` ? { playerKey: key, playerIndex: index } : null
  }
  backend.json_ = (payload) => payload
  return { backend, players, courseProfiles, poolProfiles, properties, cache, audit }
}

test('only the authenticated owner account can bootstrap admin access, and the password is never stored in plaintext', () => {
  const { backend, properties, cache } = configuredBackend()
  const denied = backend.adminAuth_({ name: 'Alice', authToken: 'session:alice', password: 'test-owner-secret' })
  assert.equal(denied.reason, 'admin-forbidden')
  assert.equal(properties.size, 0)

  const first = backend.adminAuth_({ name: 'おとめ座', authToken: 'session:おとめ座', password: 'test-owner-secret' })
  assert.equal(first.ok, true)
  assert.ok(first.adminToken)
  assert.equal(properties.get('ADMIN_PASSWORD_HASH').includes('test-owner-secret'), false)
  assert.equal(cache.has(`admin-session:${first.adminToken}`), true)

  const wrong = backend.adminAuth_({ name: 'おとめ座', authToken: 'session:おとめ座', password: 'not-the-password' })
  assert.equal(wrong.reason, 'admin-password-wrong')
  const second = backend.adminAuth_({ name: 'おとめ座', authToken: 'session:おとめ座', password: 'test-owner-secret' })
  assert.equal(second.ok, true)
})

test('student rosters require a live owner-bound admin token and expose no PIN or session secrets', () => {
  const { backend } = configuredBackend()
  const hidden = backend.adminSearch_({ name: 'Alice', authToken: 'session:alice', adminToken: '', query: 'Al' })
  assert.equal(hidden.ok, false)
  assert.deepEqual(Array.from(hidden.students), [])

  const login = backend.adminAuth_({ name: 'おとめ座', authToken: 'session:おとめ座', password: 'test-owner-secret' })
  const visible = backend.adminSearch_({ name: 'おとめ座', authToken: 'session:おとめ座', adminToken: login.adminToken, query: 'Ali' })
  assert.equal(visible.ok, true)
  assert.equal(visible.students.length, 1)
  assert.equal(visible.students[0].name, 'Alice')
  assert.equal(visible.students[0].foundationMember, true)
  assert.equal(Object.hasOwn(visible.students[0], 'pinSecret'), false)
  assert.equal(Object.hasOwn(visible.students[0], 'authToken'), false)
})

test('admin rating corrections are pool-scoped, reasoned, and audited', () => {
  const { backend, players, poolProfiles, audit } = configuredBackend()
  const login = backend.adminAuth_({ name: 'おとめ座', authToken: 'session:おとめ座', password: 'test-owner-secret' })
  const result = backend.adminSetRating_({
    name: 'おとめ座', authToken: 'session:おとめ座', adminToken: login.adminToken,
    targetName: 'Alice', course: 'foundation-course', poolId: 'foundation', rating: '57452', reason: '記録補正',
  })
  assert.equal(result.ok, true)
  assert.equal(result.before, 1240)
  assert.equal(poolProfiles.rows[1][3], 57452)
  assert.equal(players.rows[2][2], 57452)
  assert.equal(audit.get('AdminAudit').rows.length, 2)
  assert.equal(audit.get('AdminAudit').rows[1][3], 'rating-set')

  const forbidden = backend.adminSetRating_({
    name: 'おとめ座', authToken: 'session:おとめ座', adminToken: login.adminToken,
    targetName: 'Alice', course: 'foundation-course', poolId: '1-B', rating: '1000', reason: 'invalid pool',
  })
  assert.equal(forbidden.reason, 'pool-forbidden')
  assert.equal(poolProfiles.rows[3][3], 1500)
})
