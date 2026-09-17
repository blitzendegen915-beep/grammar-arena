const COURSE_NAME = 'foundation-infinitive'
const RATING_MIN = 800
const PLAYER_HEADERS = ['playerKey', 'name', 'rating', 'answered', 'updatedAt', 'pinSecret', 'tokenHash']
const ANSWER_HEADERS = ['playerKey', 'course', 'questionId', 'correct', 'delta', 'answeredAt']

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
  return { spreadsheetUrl: book.getUrl(), players: players.getName(), answers: answers.getName() }
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
      return json_(profile_(players, answers, playerIndex, playerKey, course, token), params.callback)
    }
    players.appendRow([playerKey, name, 1240, 0, now, pinSecret, tokenHashFor_(token, playerKey)])
    const newIndex = players.getLastRow() - 1
    return json_(profile_(players, answers, newIndex, playerKey, course, token), params.callback)
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

  const book = getBook_()
  const players = getOrCreateSheet_(book, 'Players', PLAYER_HEADERS)
  const answers = getOrCreateSheet_(book, 'Answers', ANSWER_HEADERS)
  const rows = players.getDataRange().getValues()
  const playerIndex = rows.findIndex((row, index) => index > 0 && row[0] === playerKey)
  if (playerIndex < 0) return json_({ ok: false, reason: 'not-found' }, params.callback)
  if (!String(rows[playerIndex][5] || '')) return json_({ ok: false, reason: 'not-registered' }, params.callback)
  if (String(rows[playerIndex][5]) !== pinSecretFor_(pinHash, playerKey)) return json_({ ok: false, reason: 'wrong-pin' }, params.callback)

  const token = Utilities.getUuid()
  const now = new Date()
  players.getRange(playerIndex + 1, 5).setValue(now)
  players.getRange(playerIndex + 1, 7).setValue(tokenHashFor_(token, playerKey))
  return json_(profile_(players, answers, playerIndex, playerKey, course, token), params.callback)
}

function profile_(players, answers, playerIndex, playerKey, course, token) {
  const row = players.getDataRange().getValues()[playerIndex]
  return {
    ok: true,
    name: String(row[1]),
    rating: Number(row[2]) || 1240,
    answered: Number(row[3]) || 0,
    answeredIds: answeredIds_(answers, playerKey, course),
    authToken: token,
    players: leaderboard_(players),
  }
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
    const auth = authenticate_(players, name, String(params.authToken || ''))
    if (!auth) return json_({ ok: false, reason: 'invalid-session' }, params.callback)
    const playerKey = auth.playerKey
    const rows = answers.getDataRange().getValues()
    const duplicate = rows.slice(1).some((row) => row[0] === playerKey && row[1] === course && row[2] === questionId)
    if (duplicate) return json_({ ok: false, reason: 'already-answered' }, params.callback)

    const playerRows = players.getDataRange().getValues()
    const playerIndex = auth.playerIndex
    const previousRating = Number(playerRows[playerIndex][2]) || 1240
    const safeDelta = Math.max(-50, Math.min(50, requestedDelta))
    const rating = Math.max(RATING_MIN, previousRating + safeDelta)
    const now = new Date()
    answers.appendRow([playerKey, course, questionId, correct, safeDelta, now])
    players.getRange(playerIndex + 1, 2, 1, 4).setValues([[name, rating, Number(playerRows[playerIndex][3] || 0) + 1, now]])
    return json_({ ok: true, rating, delta: safeDelta, players: leaderboard_(players) }, params.callback)
  } finally {
    lock.releaseLock()
  }
}

function getLeaderboard_(course, callback) {
  const book = getBook_()
  const players = getOrCreateSheet_(book, 'Players', PLAYER_HEADERS)
  return json_({ ok: true, course, players: leaderboard_(players) }, callback)
}

function leaderboard_(sheet) {
  return sheet.getDataRange().getValues().slice(1)
    .filter((row) => row[0] && row[1])
    .map((row) => ({ name: String(row[1]), rating: Number(row[2]) || 1240, answered: Number(row[3]) || 0 }))
    .sort((a, b) => b.rating - a.rating || b.answered - a.answered || a.name.localeCompare(b.name, 'ja'))
    .slice(0, 20)
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
    .filter((row) => row[0] === playerKey && row[1] === course && row[2])
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
