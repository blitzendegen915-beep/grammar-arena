import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'

const backendSource = readFileSync(fileURLToPath(new URL('../backend/Code.gs', import.meta.url)), 'utf8')

function loadBackend() {
  const context = vm.createContext({})
  vm.runInContext(backendSource, context)
  return context
}

function sheet(rows) {
  return {
    rows: rows.map((row) => [...row]),
    getDataRange() {
      return { getValues: () => this.rows }
    },
    getRange(row, column) {
      return {
        setValue: (value) => { this.rows[row - 1][column - 1] = value },
      }
    },
    appendRow(row) {
      this.rows.push([...row])
    },
  }
}

function playerRow(name, rating, unlockedThemes = '[]') {
  const row = Array(11).fill('')
  row[0] = name.toLowerCase()
  row[1] = name
  row[2] = rating
  row[10] = unlockedThemes
  return row
}

function configureThemeUnlockRequest(backend, players) {
  const answers = sheet([['playerKey', 'course', 'questionId', 'correct', 'delta', 'answeredAt', 'answerId']])
  const courseProfiles = sheet([['playerKey', 'course', 'rating', 'answered', 'updatedAt']])
  const poolProfiles = sheet([['playerKey', 'course', 'poolId', 'rating', 'answered', 'updatedAt']])
  backend.LockService = { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) }
  backend.getBook_ = () => ({})
  backend.getRuntimeSheets_ = () => ({ players, answers, courseProfiles, poolProfiles })
  backend.cleanName_ = (value) => String(value || '').trim()
  backend.cleanCourse_ = (value) => String(value || '')
  backend.cleanPoolId_ = (value) => String(value || '')
  backend.authenticate_ = () => ({ playerKey: 'alice', playerIndex: 1 })
  backend.json_ = (payload) => payload
  backend.profile_ = () => ({ ok: true, unlockedThemes: backend.themeUnlocksFromRow_(players.rows[1]) })
}

test('Crystallium uses this account’s legacy and current ratings and preserves Moon', () => {
  const backend = loadBackend()
  const players = sheet([Array(11).fill('header'), playerRow('Alice', 1200, '["moon"]')])
  const courseProfiles = sheet([
    ['playerKey', 'course', 'rating', 'answered', 'updatedAt'],
    ['alice', 'regular-english-practice', 10000, 5, ''],
    ['bob', 'regular-english-practice', 50000, 10, ''],
  ])
  const poolProfiles = sheet([
    ['playerKey', 'course', 'poolId', 'rating', 'answered', 'updatedAt'],
    ['alice', 'foundation-course', 'foundation', 9999, 4, ''],
    ['bob', 'foundation-course', 'foundation', 60000, 12, ''],
  ])

  const unlocks = backend.eligibleThemeUnlocks_(players, courseProfiles, poolProfiles, 1, 'alice')

  assert.deepEqual(Array.from(unlocks), ['moon', 'crystallium'])
  assert.equal(players.rows[1][10], '["moon","crystallium"]')
  assert.equal(players.rows[1][2], 1200)
  assert.equal(courseProfiles.rows[1][2], 10000)
  assert.equal(poolProfiles.rows[1][3], 9999)
})

test('current pool rating at exactly 10,000 also unlocks Crystallium', () => {
  const backend = loadBackend()
  const players = sheet([Array(11).fill('header'), playerRow('Alice', 1200)])
  const courseProfiles = sheet([['playerKey', 'course', 'rating', 'answered', 'updatedAt']])
  const poolProfiles = sheet([
    ['playerKey', 'course', 'poolId', 'rating', 'answered', 'updatedAt'],
    ['alice', 'foundation-course', 'foundation', 10000, 4, ''],
  ])

  const unlocks = backend.eligibleThemeUnlocks_(players, courseProfiles, poolProfiles, 1, 'alice')

  assert.deepEqual(Array.from(unlocks), ['crystallium'])
})

test('another player’s 10,000+ rating cannot unlock Crystallium', () => {
  const backend = loadBackend()
  const players = sheet([Array(11).fill('header'), playerRow('Alice', 9999)])
  const courseProfiles = sheet([
    ['playerKey', 'course', 'rating', 'answered', 'updatedAt'],
    ['bob', 'regular-english-practice', 50000, 10, ''],
  ])
  const poolProfiles = sheet([
    ['playerKey', 'course', 'poolId', 'rating', 'answered', 'updatedAt'],
    ['bob', 'foundation-course', 'foundation', 60000, 12, ''],
  ])

  const unlocks = backend.eligibleThemeUnlocks_(players, courseProfiles, poolProfiles, 1, 'alice')

  assert.deepEqual(Array.from(unlocks), [])
  assert.equal(players.rows[1][10], '[]')
})

test('the owner account receives every hidden theme on authenticated profile checks', () => {
  const backend = loadBackend()
  const owner = 'おとめ座'
  const players = sheet([Array(11).fill('header'), playerRow(owner, 1200)])
  const courseProfiles = sheet([['playerKey', 'course', 'rating', 'answered', 'updatedAt']])
  const poolProfiles = sheet([['playerKey', 'course', 'poolId', 'rating', 'answered', 'updatedAt']])

  const unlocks = backend.eligibleThemeUnlocks_(players, courseProfiles, poolProfiles, 1, backend.keyFor_(owner), sheet([['playerKey', 'course', 'questionId', 'correct', 'delta', 'answeredAt', 'answerId']]))

  assert.deepEqual(Array.from(unlocks), ['moon', 'crystallium', 'dignity', 'archive', 'eclipse', 'verdant', 'ember', 'aurora'])
  assert.equal(players.rows[1][10], JSON.stringify(Array.from(unlocks)))
})

test('achievement themes unlock from this player’s history and cannot be granted by another player’s attempts', () => {
  const backend = loadBackend()
  const players = sheet([Array(11).fill('header'), playerRow('Alice', 1200)])
  const answerRows = [['playerKey', 'course', 'questionId', 'correct', 'delta', 'answeredAt', 'answerId']]
  for (let index = 1; index <= 50; index += 1) {
    const unit = 13 + (index % 3)
    answerRows.push(['alice', 'foundation-course', `l${unit}-${String(index).padStart(2, '0')}`, index > 5, 0, new Date(index), `a-${index}`])
  }
  for (let index = 1; index <= 5; index += 1) {
    const unit = 13 + (index % 3)
    answerRows.push(['alice', 'foundation-course', `l${unit}-${String(index).padStart(2, '0')}`, true, 0, new Date(100 + index), `retry-${index}`])
  }
  answerRows.push(['alice', 'foundation-course', 'plus-51', false, 0, new Date(200), 'a-51'])
  for (let index = 1; index <= 200; index += 1) answerRows.push(['bob', 'foundation-course', `l13-${String(index).padStart(3, '0')}`, true, 0, new Date(index), `bob-${index}`])
  const courseProfiles = sheet([['playerKey', 'course', 'rating', 'answered', 'updatedAt']])
  const poolProfiles = sheet([['playerKey', 'course', 'poolId', 'rating', 'answered', 'updatedAt']])

  const unlocks = backend.eligibleThemeUnlocks_(players, courseProfiles, poolProfiles, 1, 'alice', sheet(answerRows))

  assert.deepEqual(Array.from(unlocks), ['archive', 'verdant', 'ember', 'aurora'])
})

test('Eclipse unlocks after ten consecutive correct attempts, and achievement requests are checked on the server', () => {
  const backend = loadBackend()
  const players = sheet([Array(11).fill('header'), playerRow('Alice', 1200)])
  const answerRows = [['playerKey', 'course', 'questionId', 'correct', 'delta', 'answeredAt', 'answerId'], ['alice', 'foundation-course', 'l13-00', false, 0, new Date(1), 'before']]
  for (let index = 1; index <= 10; index += 1) answerRows.push(['alice', 'foundation-course', `l13-${String(index).padStart(2, '0')}`, true, 0, new Date(index + 1), `a-${index}`])
  const courseProfiles = sheet([['playerKey', 'course', 'rating', 'answered', 'updatedAt']])
  const poolProfiles = sheet([['playerKey', 'course', 'poolId', 'rating', 'answered', 'updatedAt']])

  const unlocks = backend.eligibleThemeUnlocks_(players, courseProfiles, poolProfiles, 1, 'alice', sheet(answerRows))
  assert.deepEqual(Array.from(unlocks), ['eclipse'])

  const deniedPlayers = sheet([Array(11).fill('header'), playerRow('Alice', 1200)])
  configureThemeUnlockRequest(backend, deniedPlayers)
  const denied = backend.unlockTheme_({ name: 'Alice', authToken: 'session-token', themeId: 'ember' })
  assert.equal(denied.ok, false)
  assert.equal(denied.reason, 'criteria-not-met')
})

test('a duplicate answer retry returns newly eligible themes without scoring twice', () => {
  const backend = loadBackend()
  const players = sheet([Array(11).fill('header'), playerRow('Alice', 1200)])
  const answers = sheet([
    ['playerKey', 'course', 'questionId', 'correct', 'delta', 'answeredAt', 'answerId'],
    ['alice', 'foundation-course', 'q-1', true, 12, new Date(), 'attempt-1'],
  ])
  const courseProfiles = sheet([
    ['playerKey', 'course', 'rating', 'answered', 'updatedAt'],
    ['alice', 'foundation-course', 10000, 20, ''],
  ])
  const poolProfiles = sheet([
    ['playerKey', 'course', 'poolId', 'rating', 'answered', 'updatedAt'],
    ['alice', 'foundation-course', 'foundation', 10000, 20, ''],
  ])

  backend.LockService = { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) }
  backend.getBook_ = () => ({})
  backend.getRuntimeSheets_ = () => ({ players, answers, courseProfiles, poolProfiles })
  backend.cleanName_ = (value) => String(value || '').trim()
  backend.cleanCourse_ = (value) => String(value || '')
  backend.cleanPoolId_ = (value) => String(value || '')
  backend.questionFor_ = () => ({ id: 'q-1', difficulty: 'starter' })
  backend.authenticate_ = () => ({ playerKey: 'alice', playerIndex: 1 })
  backend.playerPools_ = () => ['foundation']
  backend.ensurePoolProfile_ = () => ({ sheetRow: 2, rating: 10000, answered: 20 })
  backend.isInappropriateContent_ = () => false
  backend.rankingCourses_ = () => ['foundation-course']
  backend.json_ = (payload) => payload

  const result = backend.recordAnswer_({
    name: 'Alice',
    course: 'foundation-course',
    questionId: 'q-1',
    answerId: 'attempt-1',
    poolId: 'foundation',
    authToken: 'session-token',
  })

  assert.equal(result.reason, 'already-answered')
  assert.equal(result.delta, 0)
  assert.deepEqual(Array.from(result.unlockedThemes), ['crystallium'])
  assert.equal(answers.rows.length, 2)
  assert.equal(players.rows[1][2], 1200)
  assert.equal(players.rows[1][10], '["crystallium"]')
})

test('Dignity cannot be unlocked until the player confirms a saved PDF', () => {
  const backend = loadBackend()
  const players = sheet([Array(11).fill('header'), playerRow('Alice', 1200)])
  configureThemeUnlockRequest(backend, players)

  const result = backend.unlockTheme_({ name: 'Alice', authToken: 'session-token', themeId: 'dignity' })

  assert.equal(result.ok, false)
  assert.equal(result.reason, 'pdf-required')
  assert.deepEqual(Array.from(result.unlockedThemes), [])
  assert.equal(players.rows[1][10], '[]')
})

test('confirmed PDF save unlocks Dignity persistently and the grant is idempotent', () => {
  const backend = loadBackend()
  const players = sheet([Array(11).fill('header'), playerRow('Alice', 1200)])
  configureThemeUnlockRequest(backend, players)

  const first = backend.unlockTheme_({ name: 'Alice', authToken: 'session-token', themeId: 'dignity', pdfSaved: 'true' })
  const repeat = backend.unlockTheme_({ name: 'Alice', authToken: 'session-token', themeId: 'dignity' })

  assert.equal(first.ok, true)
  assert.deepEqual(Array.from(first.unlockedThemes), ['dignity'])
  assert.equal(players.rows[1][10], '["dignity"]')
  assert.equal(repeat.ok, true)
  assert.deepEqual(Array.from(repeat.unlockedThemes), ['dignity'])
})
