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
  row[6] = `session-hash:${key}:session:${key}`
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
  backend.json_ = (payload) => payload
  return { backend, players, answers, courseProfiles, poolProfiles, properties, cache, audit }
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

test('password rotation rejects existing and legacy admin sessions without affecting student login tokens', () => {
  const { backend, players, properties, cache } = configuredBackend()
  const owner = { name: 'おとめ座', authToken: 'session:おとめ座' }
  const oldLogin = backend.adminAuth_({ ...owner, password: 'old-test-password' })
  const oldSession = { ...owner, adminToken: oldLogin.adminToken }
  assert.ok(backend.authenticatedAdmin_(players, oldSession))
  const before = JSON.stringify(players.rows)
  properties.set('ADMIN_PASSWORD_SALT', 'rotated-test-salt')
  properties.set('ADMIN_PASSWORD_HASH', backend.adminPasswordHash_('rotated-test-salt', 'new-test-password'))
  assert.equal(backend.authenticatedAdmin_(players, oldSession), null)
  assert.equal(backend.adminAuth_({ ...owner, password: 'old-test-password' }).reason, 'admin-password-wrong')
  const newLogin = backend.adminAuth_({ ...owner, password: 'new-test-password' })
  assert.equal(newLogin.ok, true)
  const newSession = { ...owner, adminToken: newLogin.adminToken }
  assert.ok(backend.authenticatedAdmin_(players, newSession))
  const legacy = JSON.parse(cache.get(`admin-session:${newLogin.adminToken}`))
  delete legacy.credentialVersion
  cache.set(`admin-session:${newLogin.adminToken}`, JSON.stringify(legacy))
  assert.equal(backend.authenticatedAdmin_(players, newSession), null)
  assert.ok(backend.authenticate_(players, 'Alice', 'session:alice'))
  assert.equal(JSON.stringify(players.rows), before)
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

function teacherSession(backend) {
  const login = backend.adminAuth_({ name: 'おとめ座', authToken: 'session:おとめ座', password: 'test-owner-secret' })
  return { name: 'おとめ座', authToken: 'session:おとめ座', adminToken: login.adminToken, course: 'foundation-course' }
}

test('whole-course rankings reject students, forged identities, expired admin sessions and reused admin tokens', () => {
  const { backend, cache } = configuredBackend()
  const owner = teacherSession(backend)
  for (const params of [
    { ...owner, name: 'Alice', authToken: 'session:alice' },
    { ...owner, name: 'おとめ座', authToken: 'session:alice' },
    { ...owner, adminToken: '' },
    { ...owner, authToken: 'rotated-owner-token' },
  ]) {
    const result = backend.adminRanking_(params)
    assert.equal(result.ok, false)
    assert.equal(result.reason, 'admin-session-required')
    assert.equal(result.students.length, 0)
  }
  cache.delete(`admin-session:${owner.adminToken}`)
  assert.equal(backend.adminRanking_(owner).ok, false)
})

test('teacher ranking is read-only, course-scoped, one row per account, and returns only display fields', () => {
  const { backend, players, poolProfiles, courseProfiles, audit } = configuredBackend()
  const before = JSON.stringify([players.rows, poolProfiles.rows, courseProfiles.rows])
  const params = teacherSession(backend)
  const result = backend.adminRanking_(params)
  assert.equal(result.ok, true)
  assert.equal(result.total, 3)
  assert.equal(result.rankedTotal, 2)
  assert.deepEqual(Array.from(result.students, (student) => [student.name, student.rating, student.rank]), [['Bob', 1300, 1], ['Alice', 1240, 2], ['おとめ座', null, null]])
  assert.deepEqual(Object.keys(result.students[0]).sort(), ['className', 'foundationMember', 'grade', 'name', 'rank', 'rating', 'ratingPoolId'])
  assert.equal(JSON.stringify([players.rows, poolProfiles.rows, courseProfiles.rows]), before)
  assert.equal(audit.size, 0)
  const regular = backend.adminRanking_({ ...params, course: 'regular-english-practice' })
  assert.equal(regular.rankedTotal, 1)
  assert.equal(regular.students[0].name, 'Alice')
  assert.equal(regular.students[0].rating, 1800)
})

test('search and grade/class filters preserve global ranks including ties and full-width search text', () => {
  const { backend, poolProfiles } = configuredBackend()
  poolProfiles.rows[3][3] = 1300 // foundation member also has a separate class score
  poolProfiles.rows[1][3] = 1300
  const params = teacherSession(backend)
  const all = backend.adminRanking_(params)
  assert.deepEqual(Array.from(all.students, (student) => student.rank), [1, 1, null])
  const filtered = backend.adminRanking_({ ...params, query: 'Ｂｏｂ', grade: '2', className: 'B' })
  assert.equal(filtered.filteredTotal, 1)
  assert.equal(filtered.students[0].rank, 1)
  poolProfiles.rows[1][3] = 1500
  const second = backend.adminRanking_({ ...params, query: 'Bob' })
  assert.equal(second.students[0].rank, 2)
  const classSearch = backend.adminRanking_({ ...params, query: '２－Ｂ' })
  assert.equal(classSearch.students[0].name, 'Bob')
})

test('regular course prioritizes current class; stale pools and other-course ratings never leak into the rank', () => {
  const { backend, poolProfiles, courseProfiles, players } = configuredBackend()
  poolProfiles.appendRow(['alice', 'regular-english-practice', '1-A', 1900, 2])
  poolProfiles.appendRow(['bob', 'regular-english-practice', '1-A', 99999, 99]) // not Bob's current class
  courseProfiles.appendRow(['bob', 'regular-english-practice', 1600, 2])
  players.rows[1][2] = 57452 // Players.rating does not identify a course
  const result = backend.adminRanking_({ ...teacherSession(backend), course: 'regular-english-practice' })
  assert.deepEqual(Array.from(result.students, (student) => [student.name, student.rating, student.ratingPoolId]), [
    ['Alice', 1900, '1-A'], ['Bob', 1600, 'legacy'], ['おとめ座', null, ''],
  ])
})

test('legacy foundation course aliases do not duplicate accounts or override canonical records', () => {
  const { backend, poolProfiles, courseProfiles, players } = configuredBackend()
  players.appendRow(player('Legacy', { grade: '', className: '', foundationMember: true }))
  poolProfiles.appendRow(['alice', 'foundation-infinitive', 'foundation', 99999, 2])
  courseProfiles.appendRow(['legacy', 'foundation-gerund', 1700, 2])
  const params = teacherSession(backend)
  const result = backend.adminRanking_(params)
  assert.equal(result.students.find((student) => student.name === 'Alice').rating, 1240)
  const unassigned = backend.adminRanking_({ ...params, grade: 'unassigned', className: 'unassigned' })
  assert.equal(unassigned.students.length, 1)
  assert.equal(unassigned.students[0].name, 'Legacy')
  assert.equal(unassigned.students[0].rank, 1)
})

test('pagination works beyond the old 25-person limit and retains ranks on later pages and searches', () => {
  const { backend, players, poolProfiles } = configuredBackend()
  for (let index = 0; index < 110; index += 1) {
    const name = `Student-${String(index).padStart(3, '0')}`
    players.appendRow(player(name))
    poolProfiles.appendRow([name.toLowerCase(), 'foundation-course', '1-A', 3000 - index, 1])
  }
  const params = teacherSession(backend)
  const later = backend.adminRanking_({ ...params, page: 2, pageSize: 50 })
  assert.equal(later.total, 113)
  assert.equal(later.pageCount, 3)
  assert.equal(later.students.length, 50)
  assert.equal(later.students[0].rank, 51)
  const search = backend.adminRanking_({ ...params, query: 'Student-099' })
  assert.equal(search.students[0].rank, 100)
  const none = backend.adminRanking_({ ...params, query: 'Not found', page: 9 })
  assert.equal(none.students.length, 0)
  assert.equal(none.page, 1)
})

test('teacher ranking rejects invalid course, filters and unbounded page sizes', () => {
  const { backend } = configuredBackend()
  const params = teacherSession(backend)
  for (const invalid of [{ course: 'unknown' }, { grade: '9' }, { className: 'Z' }, { page: -1 }, { page: 'NaN' }, { pageSize: 10000 }, { query: 'x'.repeat(81) }]) {
    assert.equal(backend.adminRanking_({ ...params, ...invalid }).reason, 'invalid-input')
  }
})

function deletionRequest(backend, owner, targetName = 'Alice') {
  const preview = backend.adminDeletePreview_({ ...owner, targetName })
  assert.equal(preview.ok, true)
  assert.deepEqual(Object.keys(preview.student).sort(), ['className', 'foundationMember', 'grade', 'name'])
  return { ...owner, targetName, confirmName: targetName, confirmationToken: preview.confirmationToken, reason: '重複登録の整理' }
}

test('deletion preview and execution require the live owner admin session; the owner cannot delete itself', () => {
  const { backend, players, audit } = configuredBackend()
  const owner = teacherSession(backend)
  const request = deletionRequest(backend, owner)
  for (const invalid of [
    { ...request, name: 'Alice', authToken: 'session:alice' },
    { ...request, authToken: 'fake-token' },
    { ...request, adminToken: '' },
  ]) {
    assert.equal(backend.adminDeletePreview_(invalid).reason, 'admin-session-required')
    assert.equal(backend.adminDeleteAccount_(invalid).reason, 'admin-session-required')
  }
  assert.equal(backend.adminDeletePreview_({ ...owner, targetName: 'おとめ座' }).reason, 'owner-protected')
  assert.equal(backend.adminDeleteAccount_({ ...request, targetName: 'おとめ座' }).reason, 'owner-protected')
  assert.equal(players.rows[2][11], undefined)
  assert.equal(audit.size, 0)
})

test('deletion binds confirmation to one target and admin session and requires the exact name and a reason', () => {
  const { backend, players, audit, cache } = configuredBackend()
  const owner = teacherSession(backend)
  const request = deletionRequest(backend, owner)
  for (const [change, expected] of [
    [{ targetName: 'Bob', confirmName: 'Bob' }, 'delete-confirmation-required'],
    [{ confirmName: 'alice' }, 'confirmation-name-mismatch'],
    [{ reason: ' ' }, 'invalid-input'],
    [{ reason: 'x'.repeat(241) }, 'invalid-input'],
    [{ confirmationToken: '' }, 'invalid-input'],
  ]) assert.equal(backend.adminDeleteAccount_({ ...request, ...change }).reason, expected)
  const otherAdminSession = teacherSession(backend)
  assert.equal(backend.adminDeleteAccount_({ ...request, adminToken: otherAdminSession.adminToken }).reason, 'delete-confirmation-required')
  cache.delete(`admin-delete:${request.confirmationToken}`)
  assert.equal(backend.adminDeleteAccount_(request).reason, 'delete-confirmation-required')
  assert.equal(players.rows[2][11], undefined)
  assert.equal(audit.size, 0)
})

test('deletion invalidates login, registration and old tokens, hides every course and pool, and preserves other students and history', () => {
  const { backend, players, answers, poolProfiles, courseProfiles, audit } = configuredBackend()
  const owner = teacherSession(backend)
  const ownerBefore = JSON.stringify(players.rows[1])
  const bobBefore = JSON.stringify(players.rows[3])
  const historiesBefore = JSON.stringify([answers.rows, poolProfiles.rows, courseProfiles.rows])
  const request = deletionRequest(backend, owner)
  const deleted = backend.adminDeleteAccount_(request)
  assert.equal(deleted.ok, true)
  assert.equal(deleted.deleted, true)
  assert.equal(players.rows[2][6], '')
  assert.ok(players.rows[2][11])
  assert.equal(players.rows[2][12], 'おとめ座')
  assert.equal(players.rows[2][13], '重複登録の整理')
  assert.equal(backend.authenticate_(players, 'Alice', 'session:alice'), null)
  const pupil = { name: 'Alice', pinHash: 'a'.repeat(64), grade: '1', className: 'A' }
  assert.equal(backend.loginPlayer_(pupil).reason, 'account-deleted')
  assert.equal(backend.registerPlayer_(pupil).reason, 'account-deleted')
  assert.equal(backend.adminSearch_({ ...owner, query: 'Alice' }).students.length, 0)
  assert.equal(backend.adminRanking_(owner).total, 2)
  for (const course of ['foundation-course', 'regular-english-practice']) {
    for (const pool of ['foundation', '1-A', 'all']) {
      const rows = backend.leaderboard_(players, courseProfiles, poolProfiles, course, pool)
      assert.equal(rows.some((row) => /alice/i.test(row.name)), false)
    }
  }
  assert.equal(JSON.stringify(players.rows[1]), ownerBefore)
  assert.equal(JSON.stringify(players.rows[3]), bobBefore)
  assert.equal(JSON.stringify([answers.rows, poolProfiles.rows, courseProfiles.rows]), historiesBefore)
  assert.equal(audit.get('AdminAudit').rows[1][3], 'account-delete-request')
  assert.equal(audit.get('AdminAudit').rows[1][7], request.confirmationToken)
})

test('deletion retries are idempotent and do not rewrite deletion metadata or audit entries', () => {
  const { backend, players, audit } = configuredBackend()
  const request = deletionRequest(backend, teacherSession(backend))
  assert.equal(backend.adminDeleteAccount_(request).ok, true)
  const after = JSON.stringify(players.rows)
  const repeated = backend.adminDeleteAccount_(request)
  assert.equal(repeated.ok, true)
  assert.equal(repeated.alreadyDeleted, true)
  assert.equal(JSON.stringify(players.rows), after)
  assert.equal(audit.get('AdminAudit').rows.length, 2)
})

test('identity changes require a new preview, while ordinary rating changes do not', () => {
  const { backend, players } = configuredBackend()
  const owner = teacherSession(backend)
  const request = deletionRequest(backend, owner)
  players.rows[2][8] = 'B'
  assert.equal(backend.adminDeleteAccount_(request).reason, 'target-changed')
  const refreshed = deletionRequest(backend, owner)
  players.rows[2][2] += 18
  assert.equal(backend.adminDeleteAccount_(refreshed).ok, true)
})

test('deletion stops safely when reserved columns are already used or audit recording fails', () => {
  const { backend, players, audit } = configuredBackend()
  const request = deletionRequest(backend, teacherSession(backend))
  players.rows[0][11] = 'another-column'
  assert.equal(backend.adminDeleteAccount_(request).reason, 'deletion-columns-conflict')
  players.rows[0][11] = ''
  const unavailableAudit = sheet([['headers']])
  unavailableAudit.appendRow = () => { throw new Error('audit-unavailable') }
  audit.set('AdminAudit', unavailableAudit)
  assert.throws(() => backend.adminDeleteAccount_(request), /audit-unavailable/)
  assert.equal(players.rows[2][11], undefined)
  assert.ok(backend.authenticate_(players, 'Alice', 'session:alice'))
})
