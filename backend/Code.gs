const COURSE_NAME = 'foundation-infinitive'
const RATING_MIN = 800
const PLAYER_HEADERS = ['playerKey', 'name', 'rating', 'answered', 'updatedAt', 'pinSecret', 'tokenHash']
const ANSWER_HEADERS = ['playerKey', 'course', 'questionId', 'correct', 'delta', 'answeredAt']
const COURSE_PROFILE_HEADERS = ['playerKey', 'course', 'rating', 'answered', 'updatedAt']

function doGet(e) {
  const params = e && e.parameter ? e.parameter : {}
  const action = params.action || 'leaderboard'
  if (action === 'register') return registerPlayer_(params)
  if (action === 'login') return loginPlayer_(params)
  if (action === 'answer') return recordAnswer_(params)
  return getLeaderboard_(params.course || COURSE_NAME, params.callback)
}

function setup() {
  const props = PropertiesService.getScriptProperties()
  if (!props.getProperty('SHEET_ID')) {
    const book = SpreadsheetApp.create('Grammar Arena Scores')
    props.setProperty('SHEET_ID', book.getId())
  }
  const book = getBook_()
  const players = getOrCreateSheet_(book, 'Players', PLAYER_HEADERS)
  const answers = getOrCreateSheet_(book, 'Answers', ANSWER_HEADERS)
  const courseProfiles = getOrCreateSheet_(book, 'CourseProfiles', COURSE_PROFILE_HEADERS)
  return { spreadsheetUrl: book.getUrl(), players: players.getName(), answers: answers.getName(), courseProfiles: courseProfiles.getName() }
}

function getBook_() {
  const id = PropertiesService.getScriptProperties().getProperty('SHEET_ID')
  if (!id) {
    setup()
    return getBook_()
  }
  return SpreadsheetApp.openById(id)
}

function getOrCreateSheet_(book, name, headers) {
  const sheet = book.getSheetByName(name) || book.insertSheet(name)
  if (sheet.getLastRow() === 0) sheet.getRange(1, 1, 1, headers.length).setValues([headers])
  const currentHeaders = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), headers.length)).getValues()[0]
  headers.forEach((header, index) => {
    if (String(currentHeaders[index] || '') !== header) sheet.getRange(1, index + 1).setValue(header)
  })
  return sheet
}

function registerPlayer_(params) {
  const name = cleanName_(params.name)
  const playerKey = keyFor_(name)
  const pinHash = cleanPinHash_(params.pinHash)
  const course = params.course || COURSE_NAME
  if (!name || !playerKey || !pinHash) return json_({ ok: false, reason: 'invalid-input' }, params.callback)

  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    const book = getBook_()
    const players = getOrCreateSheet_(book, 'Players', PLAYER_HEADERS)
    const answers = getOrCreateSheet_(book, 'Answers', ANSWER_HEADERS)
    const courseProfiles = getOrCreateSheet_(book, 'CourseProfiles', COURSE_PROFILE_HEADERS)
    const rows = players.getDataRange().getValues()
    const playerIndex = rows.findIndex((row, index) => index > 0 && row[0] === playerKey)
    const now = new Date()
    const token = Utilities.getUuid()
    const pinSecret = pinSecretFor_(pinHash, playerKey)
    if (playerIndex >= 0) {
      if (String(rows[playerIndex][5] || '')) return json_({ ok: false, reason: 'already-registered' }, params.callback)
      const rating = Number(rows[playerIndex][2]) || 1240
      const answered = Number(rows[playerIndex][3]) || 0
      players.getRange(playerIndex + 1, 2, 1, 6).setValues([[name, rating, answered, now, pinSecret, tokenHashFor_(token, playerKey)]])
      return json_(profile_(players, answers, courseProfiles, playerIndex, playerKey, course, token), params.callback)
    }
    players.appendRow([playerKey, name, 1240, 0, now, pinSecret, tokenHashFor_(token, playerKey)])
    const newIndex = players.getLastRow() - 1
    return json_(profile_(players, answers, courseProfiles, newIndex, playerKey, course, token), params.callback)
  } finally {
    lock.releaseLock()
  }
}

function loginPlayer_(params) {
  const name = cleanName_(params.name)
  const playerKey = keyFor_(name)
  const pinHash = cleanPinHash_(params.pinHash)
  const course = params.course || COURSE_NAME
  if (!name || !playerKey || !pinHash) return json_({ ok: false, reason: 'invalid-input' }, params.callback)

  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    const book = getBook_()
    const players = getOrCreateSheet_(book, 'Players', PLAYER_HEADERS)
    const answers = getOrCreateSheet_(book, 'Answers', ANSWER_HEADERS)
    const courseProfiles = getOrCreateSheet_(book, 'CourseProfiles', COURSE_PROFILE_HEADERS)
    const rows = players.getDataRange().getValues()
    const playerIndex = rows.findIndex((row, index) => index > 0 && row[0] === playerKey)
    if (playerIndex < 0) return json_({ ok: false, reason: 'not-found' }, params.callback)
    if (!String(rows[playerIndex][5] || '')) return json_({ ok: false, reason: 'not-registered' }, params.callback)
    if (String(rows[playerIndex][5]) !== pinSecretFor_(pinHash, playerKey)) return json_({ ok: false, reason: 'wrong-pin' }, params.callback)

    const token = Utilities.getUuid()
    const now = new Date()
    players.getRange(playerIndex + 1, 5).setValue(now)
    players.getRange(playerIndex + 1, 7).setValue(tokenHashFor_(token, playerKey))
    return json_(profile_(players, answers, courseProfiles, playerIndex, playerKey, course, token), params.callback)
  } finally {
    lock.releaseLock()
  }
}

function profile_(players, answers, courseProfiles, playerIndex, playerKey, course, token) {
  const row = players.getDataRange().getValues()[playerIndex]
  const courseProfile = ensureCourseProfile_(courseProfiles, playerKey, course, Number(row[2]) || 1240, Number(row[3]) || 0)
  return {
    ok: true,
    name: String(row[1]),
    rating: courseProfile.rating,
    answered: courseProfile.answered,
    answeredIds: answeredIds_(answers, playerKey, course),
    authToken: token,
    players: leaderboard_(players, courseProfiles, course),
  }
}

function rankingCourses_(course) {
  const value = String(course || COURSE_NAME)
  if (value === 'foundation-course') return ['foundation-course', 'foundation-infinitive', 'foundation-gerund', 'foundation-participles']
  return [value]
}

function ensureCourseProfile_(sheet, playerKey, course, fallbackRating, fallbackAnswered) {
  const rows = sheet.getDataRange().getValues()
  const rowIndex = rows.findIndex((row, index) => index > 0 && row[0] === playerKey && row[1] === course)
  if (rowIndex >= 0) {
    return {
      sheetRow: rowIndex + 1,
      rating: Number(rows[rowIndex][2]) || 1240,
      answered: Number(rows[rowIndex][3]) || 0,
    }
  }
  const rating = course === 'foundation-course' ? Number(fallbackRating) || 1240 : 1240
  const answered = course === 'foundation-course' ? Number(fallbackAnswered) || 0 : 0
  sheet.appendRow([playerKey, course, rating, answered, new Date()])
  return { sheetRow: sheet.getLastRow(), rating, answered }
}

function authenticate_(players, name, token) {
  const playerKey = keyFor_(name)
  const rows = players.getDataRange().getValues()
  const playerIndex = rows.findIndex((row, index) => index > 0 && row[0] === playerKey)
  if (playerIndex < 0 || !token || String(rows[playerIndex][6] || '') !== tokenHashFor_(token, playerKey)) return null
  return { playerKey, playerIndex }
}

function recordAnswer_(params) {
  const name = cleanName_(params.name)
  const course = params.course || COURSE_NAME
  const questionId = String(params.questionId || '')
  const correct = params.correct === 'true'
  const requestedDelta = Number(params.delta || 0)
  if (!name || !questionId) return json_({ ok: false, reason: 'invalid-input' }, params.callback)

  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    const book = getBook_()
    const players = getOrCreateSheet_(book, 'Players', PLAYER_HEADERS)
    const answers = getOrCreateSheet_(book, 'Answers', ANSWER_HEADERS)
    const courseProfiles = getOrCreateSheet_(book, 'CourseProfiles', COURSE_PROFILE_HEADERS)
    const auth = authenticate_(players, name, String(params.authToken || ''))
    if (!auth) return json_({ ok: false, reason: 'invalid-session' }, params.callback)
    const playerKey = auth.playerKey
    const rows = answers.getDataRange().getValues()
    const duplicate = rows.slice(1).some((row) => row[0] === playerKey && rankingCourses_(course).includes(String(row[1])) && row[2] === questionId)
    if (duplicate) return json_({ ok: false, reason: 'already-answered' }, params.callback)

    const playerRows = players.getDataRange().getValues()
    const playerIndex = auth.playerIndex
    const courseProfile = ensureCourseProfile_(courseProfiles, playerKey, course, Number(playerRows[playerIndex][2]) || 1240, Number(playerRows[playerIndex][3]) || 0)
    const previousRating = courseProfile.rating
    const safeDelta = Math.max(-50, Math.min(50, requestedDelta))
    const rating = Math.max(RATING_MIN, previousRating + safeDelta)
    const now = new Date()
    answers.appendRow([playerKey, course, questionId, correct, safeDelta, now])
    courseProfiles.getRange(courseProfile.sheetRow, 3, 1, 3).setValues([[rating, courseProfile.answered + 1, now]])
    players.getRange(playerIndex + 1, 2).setValue(name)
    players.getRange(playerIndex + 1, 5).setValue(now)
    return json_({ ok: true, rating, delta: safeDelta, players: leaderboard_(players, courseProfiles, course) }, params.callback)
  } finally {
    lock.releaseLock()
  }
}

function getLeaderboard_(course, callback) {
  const book = getBook_()
  const players = getOrCreateSheet_(book, 'Players', PLAYER_HEADERS)
  const courseProfiles = getOrCreateSheet_(book, 'CourseProfiles', COURSE_PROFILE_HEADERS)
  return json_({ ok: true, course, players: leaderboard_(players, courseProfiles, course) }, callback)
}

function leaderboard_(playersSheet, courseProfilesSheet, course) {
  const playerRows = playersSheet.getDataRange().getValues().slice(1).filter((row) => row[0] && row[1])
  const names = new Map(playerRows.map((row) => [String(row[0]), String(row[1])]))
  const rankingCourses = rankingCourses_(course)
  const profileRows = courseProfilesSheet.getDataRange().getValues().slice(1)
    .filter((row) => row[0] && rankingCourses.includes(String(row[1])))
  const profileKeys = new Set(profileRows.map((row) => String(row[0])))
  const ranked = profileRows.map((row) => ({ name: names.get(String(row[0])) || String(row[0]), rating: Number(row[2]) || 1240, answered: Number(row[3]) || 0 }))
  if (course === 'foundation-course') {
    playerRows.forEach((row) => {
      const playerKey = String(row[0])
      if (!profileKeys.has(playerKey)) ranked.push({ name: String(row[1]), rating: Number(row[2]) || 1240, answered: Number(row[3]) || 0 })
    })
  }
  return ranked
    .sort((a, b) => b.rating - a.rating || b.answered - a.answered || a.name.localeCompare(b.name, 'ja'))
}

function cleanName_(value) {
  return String(value || '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 20)
}

function cleanPinHash_(value) {
  const hash = String(value || '').trim().toLowerCase()
  return /^[a-f0-9]{64}$/.test(hash) ? hash : ''
}

function pinSecretFor_(pinHash, playerKey) {
  return digest_(pinHash + ':' + playerKey)
}

function tokenHashFor_(token, playerKey) {
  return digest_(token + ':' + playerKey)
}

function digest_(value) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value, Utilities.Charset.UTF_8)
    .map((byte) => ('0' + ((byte + 256) % 256).toString(16)).slice(-2))
    .join('')
}

function answeredIds_(sheet, playerKey, course) {
  return sheet.getDataRange().getValues().slice(1)
    .filter((row) => row[0] === playerKey && rankingCourses_(course).includes(String(row[1])) && row[2])
    .map((row) => String(row[2]))
}

function keyFor_(name) {
  return name.toLowerCase()
}

function json_(payload, callback = '') {
  callback = String(callback || '')
  const body = JSON.stringify(payload).replace(/</g, '\\u003c')
  if (callback && /^[a-zA-Z_$][\w$]*$/.test(callback)) {
    return ContentService.createTextOutput(callback + '(' + body + ')').setMimeType(ContentService.MimeType.JAVASCRIPT)
  }
  return ContentService.createTextOutput(body).setMimeType(ContentService.MimeType.JSON)
}
