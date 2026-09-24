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
