const COURSE_NAME = 'foundation-infinitive'
const RATING_MIN = 800
const PLAYER_HEADERS = ['playerKey', 'name', 'rating', 'answered', 'updatedAt']
const ANSWER_HEADERS = ['playerKey', 'course', 'questionId', 'correct', 'delta', 'answeredAt']

function doGet(e) {
  const params = e && e.parameter ? e.parameter : {}
  const action = params.action || 'leaderboard'
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
  return sheet
}

function recordAnswer_(params) {
  const name = cleanName_(params.name)
  const playerKey = keyFor_(name)
  const course = params.course || COURSE_NAME
  const questionId = String(params.questionId || '')
  const correct = params.correct === 'true'
  const requestedDelta = Number(params.delta || 0)
  if (!name || !playerKey || !questionId) return json_({ ok: false, reason: 'invalid-input' }, params.callback)

  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    const book = getBook_()
    const answers = getOrCreateSheet_(book, 'Answers', ANSWER_HEADERS)
    const rows = answers.getDataRange().getValues()
    const duplicate = rows.slice(1).some((row) => row[0] === playerKey && row[1] === course && row[2] === questionId)
    if (duplicate) return json_({ ok: false, reason: 'already-answered' }, params.callback)

    const players = getOrCreateSheet_(book, 'Players', PLAYER_HEADERS)
    const playerRows = players.getDataRange().getValues()
    const playerIndex = playerRows.findIndex((row, index) => index > 0 && row[0] === playerKey)
    const previousRating = playerIndex >= 0 ? Number(playerRows[playerIndex][2]) || 1240 : 1240
    const safeDelta = Math.max(-50, Math.min(50, requestedDelta))
    const rating = Math.max(RATING_MIN, previousRating + safeDelta)
    const now = new Date()
    answers.appendRow([playerKey, course, questionId, correct, safeDelta, now])
    if (playerIndex >= 0) {
      players.getRange(playerIndex + 1, 2, 1, 4).setValues([[name, rating, Number(playerRows[playerIndex][3] || 0) + 1, now]])
    } else {
      players.appendRow([playerKey, name, rating, 1, now])
    }
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
