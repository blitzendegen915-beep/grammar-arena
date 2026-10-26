import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'
import { CLUB_OPTIONS } from './clubCatalog.js'

const source = readFileSync(fileURLToPath(new URL('../backend/Code.gs', import.meta.url)), 'utf8')

const CLUB_IDS = [
  'iaido', 'kendo', 'golf', 'soccer', 'judo', 'softball', 'cheer',
  'soft-tennis-boys', 'soft-tennis-girls', 'gymnastics', 'table-tennis', 'tennis',
  'handball', 'basketball-boys', 'basketball-girls', 'badminton', 'volleyball-boys',
  'volleyball-girls', 'baseball', 'rugby', 'track', 'track-distance', 'wandervogel',
  'dance', 'brass-band', 'music', 'home-economics', 'drama', 'art', 'english',
  'broadcasting', 'calligraphy', 'photography', 'science', 'history', 'literature',
  'flower-arrangement', 'none',
]

function sheet(rows = []) {
  return {
    rows: rows.map((row) => [...row]),
    getDataRange() { return { getValues: () => this.rows.map((row) => [...row]) } },
    getLastRow() { return this.rows.length },
    getLastColumn() { return Math.max(0, ...this.rows.map((row) => row.length)) },
    getRange(row, column, rowCount = 1, columnCount = 1) {
      const current = this
      return {
        getValue() { return current.rows[row - 1]?.[column - 1] ?? '' },
        getValues() {
          return Array.from({ length: rowCount }, (_, rowOffset) =>
            Array.from({ length: columnCount }, (_, columnOffset) => current.rows[row - 1 + rowOffset]?.[column - 1 + columnOffset] ?? ''))
        },
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

function player(name, { grade = '1', className = 'A', foundationMember = false, clubId = '', rating = 1240 } = {}) {
  const key = name.toLowerCase()
  const row = Array(16).fill('')
  Object.assign(row, {
    0: key, 1: name, 2: rating, 3: 0, 5: '', 6: '',
    7: grade, 8: className, 9: foundationMember, 10: '[]', 15: clubId,
  })
  return row
}

function configuredBackend({ players: playerRows, courseProfiles: courseRows, poolProfiles: poolRows } = {}) {
  const backend = vm.createContext({})
  vm.runInContext(source, backend)
  const players = sheet(playerRows || [
    ['playerKey', 'name', 'rating', 'answered', 'updatedAt', 'pinSecret', 'tokenHash', 'grade', 'className', 'foundationMember', 'unlockedThemes', 'deletedAt', 'deletedBy', 'deleteReason', 'reserved', 'clubId'],
    player('alice', { clubId: 'soccer', foundationMember: true, rating: 1700 }),
    player('bob', { grade: '2', className: 'B', clubId: 'kendo', rating: 1600 }),
    player('carol', { clubId: 'none', rating: 1500 }),
    player('dave', { clubId: '', rating: 2000 }),
    Object.assign(player('removed', { clubId: 'soccer' }), { 11: 'deleted' }),
  ])
  const courseProfiles = sheet(courseRows || [
    ['playerKey', 'course', 'rating', 'answered', 'updatedAt'],
    ['alice', 'foundation-course', 1600, 4, new Date(1)],
    ['alice', 'regular-english-practice', 1800, 3, new Date(1)],
    ['alice', 'regular-english-practice-2kimatsu', 1700, 2, new Date(1)],
    ['bob', 'foundation-infinitive', 1900, 2, new Date(1)],
  ])
  const poolProfiles = sheet(poolRows || [
    ['playerKey', 'course', 'poolId', 'rating', 'answered', 'updatedAt'],
    ['alice', 'foundation-course', 'foundation', 1650, 4, new Date(1)],
    ['alice', 'regular-english-practice', '1-A', 1810, 3, new Date(1)],
    ['alice', 'regular-english-practice', '2-B', 99998, 99, new Date(1)],
    ['bob', 'foundation-course', 'foundation', 1950, 2, new Date(1)],
  ])
  const answers = sheet([['playerKey', 'course', 'questionId', 'correct', 'delta', 'answeredAt', 'answerId']])
  const bookSheets = new Map([['Players', players], ['Answers', answers], ['CourseProfiles', courseProfiles], ['PoolProfiles', poolProfiles]])
  const book = {
    getSheetByName(name) { return bookSheets.get(name) || null },
    insertSheet(name) { const created = sheet(); bookSheets.set(name, created); return created },
  }
  let id = 0
  backend.LockService = { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) }
  backend.Utilities = {
    DigestAlgorithm: { SHA_256: 'SHA_256' },
    Charset: { UTF_8: 'UTF_8' },
    computeDigest: (_algorithm, value) => Array.from(String(value), (character) => character.charCodeAt(0) % 256),
    getUuid: () => `uuid-${++id}`,
  }
  backend.getBook_ = () => book
  backend.json_ = (payload) => payload
  for (const row of players.rows.slice(1)) {
    if (!row[0]) continue
    row[5] = backend.pinSecretFor_('a'.repeat(64), row[0])
    row[6] = backend.tokenHashFor_(`auth:${row[0]}`, row[0])
  }
  return { backend, players, answers, courseProfiles, poolProfiles, book }
}

test('club IDs are normalized against the complete allowlist; blank and explicit none remain distinct', () => {
  const { backend } = configuredBackend()
  for (const clubId of CLUB_IDS) assert.equal(backend.cleanClubId_(clubId), clubId)
  assert.equal(backend.cleanClubId_(' Soccer '), 'soccer')
  assert.equal(backend.cleanClubId_('none'), 'none')
  assert.equal(backend.cleanClubId_(''), '')
  for (const invalid of ['unknown', 'soccer;admin', '1-A', null]) assert.equal(backend.cleanClubId_(invalid), '')
  assert.equal(backend.clubLabel_('none'), '無所属')
  assert.ok(backend.clubLabel_('soccer'))
})

test('Players column 16 stores club while existing class/foundation pool order and deleted exclusion stay intact', () => {
  const { backend, players } = configuredBackend()
  assert.equal(players.rows[0][15], 'clubId')
  assert.deepEqual(Array.from(backend.playerPools_(players.rows[1])), ['foundation', '1-A', 'club:soccer'])
  assert.deepEqual(Array.from(backend.playerPools_(players.rows[2])), ['2-B', 'club:kendo'])
  assert.deepEqual(Array.from(backend.playerPools_(players.rows[3])), ['1-A', 'club:none'])
  assert.deepEqual(Array.from(backend.playerPools_(players.rows[4])), ['1-A'])
  assert.deepEqual(Array.from(backend.playerPools_(players.rows[5])), [])
})

test('rating summary adds only canonical course gains above 1240 and deduplicates legacy foundation aliases', () => {
  const { backend, players, courseProfiles, poolProfiles } = configuredBackend()
  const summaries = backend.buildRatingSummaryIndex_(players.rows, courseProfiles.rows, poolProfiles.rows)
  const alice = summaries.get('alice')
  assert.deepEqual(Object.keys(alice.courseRatings).sort(), [
    'foundation-course', 'regular-english-practice', 'regular-english-practice-2kimatsu',
  ].sort())
  assert.equal(alice.courseRatings['foundation-course'], 1650)
  assert.equal(alice.courseRatings['regular-english-practice'], 1810)
  assert.equal(alice.courseRatings['regular-english-practice-2kimatsu'], 1700)
  assert.equal(alice.overallRating, 2680)
  assert.equal(summaries.get('bob').courseRatings['foundation-course'], 1900)
  assert.equal(summaries.get('dave').overallRating, 2000)
  assert.equal(summaries.has('removed'), false)
})

test('rating source selection prefers current canonical pools, then current base pool, then canonical and alias profiles', () => {
  const { backend, players } = configuredBackend()
  const courseRows = [
    ['playerKey', 'course', 'rating', 'answered'],
    ['alice', 'foundation-infinitive', 9000, 5],
    ['alice', 'foundation-gerund', 9100, 6],
    ['alice', 'regular-english-practice', 2000, 1],
    ['alice', 'regular-english-practice-2kimatsu', 2100, 1],
  ]
  const poolRows = [
    ['playerKey', 'course', 'poolId', 'rating', 'answered'],
    ['alice', 'foundation-course', 'foundation', 1300, 1],
    ['alice', 'foundation-course', '1-A', 9000, 1],
    ['alice', 'regular-english-practice', '1-A', 1500, 1],
    ['alice', 'regular-english-practice', 'club:soccer', 99999, 100],
    ['alice', 'regular-english-practice', '2-B', 99998, 100],
  ]
  const summary = backend.buildRatingSummaryIndex_(players.rows, courseRows, poolRows).get('alice')
  assert.equal(summary.courseRatings['foundation-course'], 1300)
  assert.equal(summary.courseRatings['regular-english-practice'], 1500)
  assert.equal(summary.courseRatings['regular-english-practice-2kimatsu'], 2100)
  assert.equal(summary.overallRating, 2420)
})

test('course leaderboard defaults to course metric; overall and club views filter current membership only', () => {
  const { backend, players, courseProfiles, poolProfiles } = configuredBackend()
  const beforeRows = poolProfiles.rows.length
  const course = backend.leaderboard_(players, courseProfiles, poolProfiles, 'regular-english-practice', 'club:soccer', 'alice')
  assert.deepEqual(Array.from(course, (entry) => entry.name), ['alice'])
  assert.equal(course[0].rating, 1810)
  assert.equal(course[0].rating, poolProfiles.rows.find((row) => row[0] === 'alice' && row[1] === 'regular-english-practice' && row[2] === '1-A')[3])
  assert.equal(poolProfiles.rows.length, beforeRows)
  const overall = backend.leaderboard_(players, courseProfiles, poolProfiles, 'regular-english-practice', 'club:soccer', 'alice', 'overall')
  assert.equal(overall[0].rating, 2680)
  const noClub = backend.leaderboard_(players, courseProfiles, poolProfiles, 'regular-english-practice', 'club:none', 'carol')
  assert.deepEqual(Array.from(noClub, (entry) => entry.name), ['carol'])
  const hidden = backend.leaderboard_(players, courseProfiles, poolProfiles, 'regular-english-practice', 'club:soccer', 'alice', 'overall')
  assert.equal(hidden.some((entry) => entry.name === 'removed'), false)
})

test('authenticated leaderboard rejects forged class or club pool requests and supports the legacy default metric', () => {
  const { backend } = configuredBackend()
  const allowed = backend.getLeaderboard_('regular-english-practice', 'club:soccer', 'alice', 'auth:alice', '', 'course')
  assert.equal(allowed.ok, true)
  assert.equal(allowed.metric, 'course')
  for (const forgedPool of ['2-B', 'club:kendo', 'all']) {
    const denied = backend.getLeaderboard_('regular-english-practice', forgedPool, 'alice', 'auth:alice', '', 'overall')
    assert.equal(denied.ok, false)
    assert.equal(denied.reason, 'pool-forbidden')
    assert.deepEqual(Array.from(denied.players), [])
  }
  const badCourse = backend.getLeaderboard_('regular-english-practice', 'club:soccer', 'bob', 'auth:bob', '', 'course')
  assert.equal(badCourse.reason, 'pool-forbidden')
})

test('club update requires an authenticated account and changes only Players column 16', () => {
  const { backend, players, poolProfiles, courseProfiles, answers } = configuredBackend()
  const before = JSON.stringify([players.rows.map((row) => [...row].slice(0, 15)), poolProfiles.rows, courseProfiles.rows, answers.rows])
  assert.equal(backend.updateClub_({ name: 'Alice', authToken: 'wrong', clubId: 'kendo' }).reason, 'invalid-session')
  assert.equal(backend.updateClub_({ name: 'Alice', authToken: 'auth:alice', clubId: 'not-a-club' }).reason, 'invalid-club')
  const updated = backend.updateClub_({ name: 'Alice', authToken: 'auth:alice', clubId: 'kendo', course: 'regular-english-practice', poolId: 'club:kendo' })
  assert.equal(updated.ok, true)
  assert.equal(updated.clubId, 'kendo')
  assert.equal(players.rows[1][15], 'kendo')
  assert.equal(JSON.stringify([players.rows.map((row) => [...row].slice(0, 15)), poolProfiles.rows, courseProfiles.rows, answers.rows]), before)
})

test('runtime sheet discovery rejects an occupied incompatible club column without changing its header', () => {
  const { backend, players, book } = configuredBackend()
  players.rows[0][15] = 'existingColumn'
  assert.throws(() => backend.getRuntimeSheets_(book), (error) => error.message === 'club-column-conflict')
  assert.equal(players.rows[0][15], 'existingColumn')
})

test('registration, login and session payloads expose club choice and canonical rating summary fields', () => {
  const { backend, players, answers, courseProfiles, poolProfiles } = configuredBackend()
  const session = backend.sessionPlayer_({ name: 'alice', authToken: 'auth:alice', course: 'regular-english-practice' })
  for (const key of ['clubId', 'clubLabel', 'needsClubSelection', 'courseRatings', 'overallRating']) assert.ok(Object.hasOwn(session, key), `missing ${key}`)
  assert.equal(session.clubId, 'soccer')
  assert.equal(session.needsClubSelection, false)
  assert.equal(session.overallRating, 2680)

  const validPinHash = 'a'.repeat(64)
  const login = backend.loginPlayer_({ name: 'alice', pinHash: validPinHash, clubId: 'kendo', course: 'regular-english-practice' })
  assert.equal(login.clubId, 'kendo')
  assert.equal(players.rows[1][15], 'kendo')
  const failed = backend.loginPlayer_({ name: 'alice', pinHash: 'b'.repeat(64), clubId: 'none' })
  assert.equal(failed.reason, 'wrong-pin')
  assert.equal(players.rows[1][15], 'kendo')
  const unchangedLogin = backend.loginPlayer_({ name: 'alice', pinHash: validPinHash })
  assert.equal(unchangedLogin.clubId, 'kendo')
  assert.equal(players.rows[1][15], 'kendo')

  const registered = backend.registerPlayer_({ name: 'new student', pinHash: 'c'.repeat(64), grade: '1', className: 'C' })
  assert.equal(registered.ok, true)
  assert.equal(registered.clubId, '')
  assert.equal(registered.needsClubSelection, true)
  assert.equal(players.rows.at(-1)[15], '')
  assert.equal(answers.rows.length, 1)
})

test('answer retry is idempotent and updates base pools once even when a club pool is requested', () => {
  const { backend, players, answers, poolProfiles, courseProfiles } = configuredBackend()
  const request = {
    name: 'Alice', authToken: 'auth:alice', course: 'foundation-course',
    questionId: 'l13-01', answer: 'Our purpose is to help the poor.', answerId: 'retry-1', poolId: 'club:soccer', compact: 'true',
  }
  const first = backend.recordAnswer_(request)
  const afterFirst = JSON.stringify([players.rows[1], answers.rows, poolProfiles.rows, courseProfiles.rows])
  const retry = backend.recordAnswer_(request)
  assert.equal(first.ok, true)
  assert.equal(retry.reason, 'already-answered')
  assert.equal(JSON.stringify([players.rows[1], answers.rows, poolProfiles.rows, courseProfiles.rows]), afterFirst)
  assert.equal(typeof first.overallRating, 'number')
  assert.ok(first.courseRatings)
  assert.equal(poolProfiles.rows.some((row) => row[2] === 'club:soccer' && row[0] === 'alice'), false)
  assert.equal(first.ratings.foundation.rating, 1662)
  assert.equal(first.ratings['club:soccer'].rating, first.ratings.foundation.rating)
  assert.equal(first.ratings['1-A'].rating, 1612)
})

test('the frontend club catalog uses exactly the backend club identifiers', () => {
  assert.deepEqual(CLUB_OPTIONS.map(({ id }) => id).sort(), [...CLUB_IDS].sort())
})
