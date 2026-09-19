import { StrictMode, useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import { FOUNDATION_TRANSLATIONS } from './foundationTranslations'
import { loadQuestionBank } from './questionBankLoader'
import { inputSlotCount, isBlankPlaceholder, withBlankCount } from './questionQuality'
import { getQuestionTranslation } from './questionPresentation'
import { isModerationBlocked, MODERATION_NOTICE } from './contentModeration'
import { buildRatingChartModel, projectSessionRating } from './ratingHistory'
import { AUTH_REQUEST_TIMEOUT_MS, requestAuthWithRetry } from './authRetry'
import {
  ANSWER_SYNC_MAX_ATTEMPTS,
  ANSWER_SYNC_TIMEOUT_MS,
  applyProvisionalRating,
  createPendingAnswer,
  enqueueAnswer,
  flushAnswerQueue,
  getAnswerForQuestion,
  getAnswerSyncSummary,
  getSyncKey,
  mergeQueueSnapshot,
  prepareAnswerRetry,
  recoverAnswerQueue,
  rekeyAnswersForAuth,
} from './answerSync'

const STORAGE_KEY = 'grammar-arena-v1'
const SCORE_API_URL = import.meta.env.VITE_SCORE_API_URL || 'https://script.google.com/macros/s/AKfycbw0HAcZcaqv8vRsU4uz02rKB7-jdsWM-xZrNwlHTlEyGOEdCSTWnaDBlqCuCv4Ho8AelQ/exec'
const DEFAULT_RATING = 1240
const SESSION_LENGTH = 10
const DEFAULT_MODE_ID = 'foundation-infinitive'
const DEFAULT_THEME_ID = 'ascention'

const THEME_OPTIONS = [
  { id: 'ascention', label: 'Ascention', description: 'The original yellow and black theme' },
  { id: 'moon', label: 'Moon', description: 'Midnight blue with a cool cyan glow' },
  { id: 'crystallium', label: 'Crystallium', description: 'Pearl light, prism facets, and jewel tones' },
]

function normalizeThemeId(value) {
  return THEME_OPTIONS.some((theme) => theme.id === value) ? value : DEFAULT_THEME_ID
}

const HIDDEN_THEME_IDS = new Set(['moon', 'crystallium'])

function normalizeUnlockedThemes(value) {
  return Array.isArray(value) ? [...new Set(value.filter((themeId) => HIDDEN_THEME_IDS.has(themeId)))] : []
}

function unlockSeenKey(name, themeId) {
  return `${String(name || '').trim().toLowerCase()}::${themeId}`
}

const DEFAULT_PERSISTED = {
  rating: DEFAULT_RATING,
  streak: 0,
  history: [],
  autoExplanation: true,
  studentName: '',
  authToken: '',
  answeredIds: [],
  publicLeaderboard: [],
  ratingsByCourse: {},
  ratingsByScope: {},
  authoritativeRatingsBySyncKey: {},
  authoritativeRatingsByScope: {},
  rankingPoolId: 'foundation',
  poolIds: [],
  grade: '',
  className: '',
  foundationMember: false,
  answerSyncQueue: [],
  studyTimeByDate: {},
  modeId: DEFAULT_MODE_ID,
  themeId: DEFAULT_THEME_ID,
  unlockedThemes: [],
  unlockCelebrationSeen: {},
}

const QUESTIONS = [
  {
    id: 'l13-01', lesson: 'LESSON 13', topic: '名詞的用法', difficulty: 'starter', type: 'reorder',
    prompt: '日本語の意味に合うように、語句を並べかえなさい。',
    japanese: '私たちの目的は貧しい人を助けることです。',
    words: ['Our', 'purpose', 'is', 'to', 'help', 'the', 'poor.'],
    answer: 'Our purpose is to help the poor.',
    answerLabel: 'Our purpose is to help the poor.',
    explanation: '「〜すること」が文の主語や補語になるとき、不定詞の名詞的用法を使います。ここでは to help the poor 全体が「目的」の内容です。',
    source: '英語演習I 2中・Exercise 13 A(1)'
  },
  {
    id: 'l13-02', lesson: 'LESSON 13', topic: '形容詞的用法', difficulty: 'starter', type: 'choice',
    prompt: '空所に入る最も適切なものを選びなさい。',
    sentence: 'I have a lot of friends (　　　).',
    choices: ['to talk with', 'talking with', 'to talk'], answer: 'to talk with',
    answerLabel: 'to talk with',
    explanation: 'to talk with が直前の friends を説明し、「話をする友だち」という意味になります。前置詞 with まで忘れないのがポイントです。',
    source: '英語演習I 2中・Exercise 13 B(1)'
  },
  {
    id: 'l13-03', lesson: 'LESSON 13', topic: '形容詞的用法', difficulty: 'starter', type: 'choice',
    prompt: '下線部の意味として最も近い日本語を選びなさい。',
    sentence: "I'm hungry. I want something to eat.",
    choices: ['食べるものがほしい', '食べながら何かがほしい', '食べ終わったものがほしい'], answer: '食べるものがほしい',
    answerLabel: '食べるものがほしい',
    explanation: 'something to eat は「食べるための何か」つまり「食べるもの」です。to eat が something の具体的な内容を説明しています。',
    source: '英語演習I 2中・Exercise 13 総合(5)'
  },
  {
    id: 'l13-04', lesson: 'LESSON 13', topic: '名詞的用法', difficulty: 'starter', type: 'input',
    prompt: '空所に入る語句を入力しなさい。',
    sentence: 'Our purpose is ______ the poor.', answer: 'to help', accepted: ['to help'], answerLabel: 'to help',
    explanation: 'be動詞の後ろで「目的の中身」を説明しています。「助けること」は to help と表します。',
    source: '英語演習I 2中・Exercise 13 A(1)'
  },
  {
    id: 'l14-01', lesson: 'LESSON 14', topic: '副詞的用法', difficulty: 'standard', type: 'choice',
    prompt: '下線部の働きに注意して、日本語の意味を選びなさい。',
    sentence: 'I went to Harajuku to buy some clothes yesterday.',
    choices: ['服を買うために原宿へ行った', '服を買ったので原宿へ行った', '服を買い終えて原宿へ行った'], answer: '服を買うために原宿へ行った',
    answerLabel: '服を買うために原宿へ行った',
    explanation: 'to buy some clothes は「何のために行ったのか」を表す目的の副詞的用法です。',
    source: '英語演習I 2中・Exercise 14 A(1)'
  },
  {
    id: 'l14-02', lesson: 'LESSON 14', topic: 'SVO + 不定詞', difficulty: 'standard', type: 'choice',
    prompt: '空所に入る最も適切な語句を選びなさい。',
    sentence: 'The police officer (　　　) (　　　) (　　　) home.',
    choices: ['told us to go', 'told to us go', 'told us going'], answer: 'told us to go',
    answerLabel: 'told us to go',
    explanation: 'tell は tell + 人 + to do の形をとります。「私たちに帰るように言った」なので told us to go です。',
    source: '英語演習I 2中・Exercise 14 B(2)'
  },
  {
    id: 'l14-03', lesson: 'LESSON 14', topic: '意味上の主語', difficulty: 'standard', type: 'reorder',
    prompt: '日本語の意味に合うように、語句を並べかえなさい。',
    japanese: '他人の気持ちを理解するのは簡単ではない。',
    words: ['It', 'is', 'not', 'easy', 'to', 'understand', "others'", 'feelings.'],
    answer: 'It is not easy to understand others\' feelings.',
    answerLabel: "It is not easy to understand others' feelings.",
    explanation: 'It is + 形容詞 + to do の形です。意味の中心は to understand others\' feelings で、it は仮の主語です。',
    source: '英語演習I 2中・Exercise 14 C(2)'
  },
  {
    id: 'l14-04', lesson: 'LESSON 14', topic: '否定の位置', difficulty: 'standard', type: 'input',
    prompt: '空所に入る語句を入力しなさい。',
    sentence: 'We decided ______ take part in the game.', answer: 'not to', accepted: ['not to'], answerLabel: 'not to',
    explanation: '不定詞を否定するときは、to の直前に not を置きます。not to take part で「参加しないこと」です。',
    source: '英語演習I 2中・Exercise 14 C(4)'
  },
  {
    id: 'l15-01', lesson: 'LESSON 15', topic: '使役動詞', difficulty: 'standard', type: 'choice',
    prompt: '意味の通る英文になるように、適切な語句を選びなさい。',
    sentence: "I didn't ______ me go out.",
    choices: ['make', 'let', 'have'], answer: 'let', answerLabel: 'let',
    explanation: 'let + O + 動詞の原形で「Oに〜させておく／許す」です。didn\'t let me go で「私を外出させてくれなかった」。',
    source: '英語演習I 2中・Exercise 15 A(2)'
  },
  {
    id: 'l15-02', lesson: 'LESSON 15', topic: '知覚動詞', difficulty: 'standard', type: 'choice',
    prompt: '意味の通る英文になるように、適切な語句を選びなさい。',
    sentence: 'I heard my sister (　　　) something in her sleep.',
    choices: ['say', 'to say', 'saying to'], answer: 'say', answerLabel: 'say',
    explanation: 'hear + O + 動詞の原形で「Oが〜するのを聞く」です。知覚動詞の後ろでは to を置きません。',
    source: '英語演習I 2中・Exercise 15 A(4)'
  },
  {
    id: 'l15-03', lesson: 'LESSON 15', topic: '完了形の不定詞', difficulty: 'advanced', type: 'choice',
    prompt: '空所に入る最も適切な語句を選びなさい。',
    sentence: 'I seemed (　　　) (　　　) my glasses somewhere.',
    choices: ['to have left', 'to leave', 'to be leaving'], answer: 'to have left', answerLabel: 'to have left',
    explanation: 'seem の時点より前に「置き忘れた」ので、完了形の不定詞 to have + 過去分詞を使います。',
    source: '英語演習I 2中・Exercise 15 B(3)'
  },
  {
    id: 'l15-04', lesson: 'LESSON 15', topic: 'seem + 不定詞', difficulty: 'advanced', type: 'reorder',
    prompt: '日本語の意味に合うように、語句を並べかえなさい。',
    japanese: 'シンジは今、公園でサッカーをしているようだ。',
    words: ['Shinji', 'seems', 'to', 'be', 'playing', 'soccer', 'in', 'the', 'park', 'now.'],
    answer: 'Shinji seems to be playing soccer in the park now.',
    answerLabel: 'Shinji seems to be playing soccer in the park now.',
    explanation: '今まさに進行中のことを seem で表すため、to be + 動詞-ing を使います。',
    source: '英語演習I 2中・Exercise 15 総合(5)'
  },
  {
    id: 'plus-01', lesson: 'PLUS', topic: '独立不定詞', difficulty: 'advanced', type: 'choice',
    prompt: '文の意味に合う語句を選びなさい。',
    sentence: '______ you the truth, that jacket doesn\'t suit you.',
    choices: ['To tell', 'Telling', 'To telling'], answer: 'To tell', answerLabel: 'To tell',
    explanation: 'To tell you the truth は「正直に言うと」という文全体にかかる独立不定詞です。',
    source: '英語演習I 2中・Plus Exercise C(9)'
  },
  {
    id: 'plus-02', lesson: 'PLUS', topic: 'be to 不定詞', difficulty: 'advanced', type: 'reorder',
    prompt: '日本語の意味に合うように、語句を並べかえなさい。',
    japanese: 'フランス大統領は来月、日本を訪問する予定です。',
    words: ['The', 'French', 'President', 'is', 'to', 'visit', 'Japan', 'next', 'month.'],
    answer: 'The French President is to visit Japan next month.',
    answerLabel: 'The French President is to visit Japan next month.',
    explanation: 'be to do は「予定・義務・可能」などを表します。ここでは公的な予定を表しています。',
    source: '英語演習I 2中・Plus Exercise 2(1)'
  },
  {
    id: 'plus-03', lesson: 'PLUS', topic: 'too ... to / enough to', difficulty: 'advanced', type: 'choice',
    prompt: '空所に入る最も適切なものを選びなさい。',
    sentence: 'The shop is (　　　) (　　　) (　　　).',
    choices: ['easy to find', 'easy for find', 'easily to finding'], answer: 'easy to find', answerLabel: 'easy to find',
    explanation: 'It is easy to find the shop. を書き換えると The shop is easy to find. になります。形容詞 + to do の形です。',
    source: '英語演習I 2中・Plus Exercise 3(1)'
  },
  {
    id: 'plus-04', lesson: 'PLUS', topic: '疑問詞 + to 不定詞', difficulty: 'advanced', type: 'input',
    prompt: '空所に入る語句を入力しなさい。',
    sentence: "She didn't know ______ ______ go.", answer: 'where to', accepted: ['where to'], answerLabel: 'where to',
    explanation: 'where she should go を where to go に短くできます。疑問詞 + to 不定詞で「どこへ行くべきか」です。',
    source: '英語演習I 2中・Plus Exercise 3(2)'
  },
]

const DIFFICULTY = {
  all: { label: 'すべて', short: 'ALL' },
  starter: { label: '基礎', short: 'STARTER' },
  standard: { label: '標準', short: 'STANDARD' },
  advanced: { label: '発展', short: 'ADVANCED' },
}

const STUDENTS = [
  { id: 'tanaka-hanako', name: '田中 花子', grade: '高1' },
  { id: 'sato-taro', name: '佐藤 太郎', grade: '高1' },
  { id: 'suzuki-hana', name: '鈴木 はな', grade: '高2' },
]

const COURSE_MODES = [
  { id: 'foundation-infinitive', label: '基礎講座 - 不定詞', available: true },
  { id: 'foundation-gerund', label: '基礎講座 - 動名詞', available: true },
  { id: 'foundation-participles', label: '基礎講座 - 分詞', available: true },
  { id: 'regular-english-practice', label: '英語演習 - 平常授業', available: true },
]

const FOUNDATION_QUESTIONS = QUESTIONS.map((question) => withBlankCount({
  ...question,
  japanese: question.japanese || '',
  translation: FOUNDATION_TRANSLATIONS[question.id] || question.japanese || '',
}))

const COURSE_DETAILS = {
  'foundation-infinitive': { label: '基礎講座', eyebrow: 'FOUNDATION COURSE', unit: 'UNIT 01', name: '不定詞', title: '不定詞を、解いて、理解する。', rankingId: 'foundation-course' },
  'foundation-gerund': { label: '基礎講座', eyebrow: 'FOUNDATION COURSE', unit: 'UNIT 02', name: '動名詞', title: '動名詞を、解いて、理解する。', rankingId: 'foundation-course' },
  'foundation-participles': { label: '基礎講座', eyebrow: 'FOUNDATION COURSE', unit: 'UNIT 03', name: '分詞', title: '分詞を、解いて、理解する。', rankingId: 'foundation-course' },
  'regular-english-practice': { label: '英語演習', eyebrow: 'ENGLISH PRACTICE', unit: 'REGULAR CLASS', name: '平常授業', title: '平常授業を、解いて、理解する。', rankingId: 'regular-english-practice' },
}

const GRADE_OPTIONS = ['1', '2', '3']
const CLASS_OPTIONS = 'ABCDEFGHIJKLM'.split('')
const RANKING_POOL_OPTIONS = [
  { id: 'foundation', label: '基礎講座' },
  ...GRADE_OPTIONS.flatMap((grade) => CLASS_OPTIONS.map((className) => ({ id: `${grade}-${className}`, label: `${grade}-${className}` }))),
]

function getCourseDetails(modeId) {
  return COURSE_DETAILS[modeId] || COURSE_DETAILS['foundation-infinitive']
}

function getRankingCourseId(modeId) {
  return getCourseDetails(modeId).rankingId
}

const RATING_POINTS = { starter: 12, standard: 18, advanced: 26 }
const RATING_LOSS = { starter: 7, standard: 11, advanced: 16 }

function Icon({ name, size = 20 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  const paths = {
    practice: <><path d="M4 19.5V5.8a1.8 1.8 0 0 1 1.8-1.8H20v15.5H5.8A1.8 1.8 0 0 0 4 21.3"/><path d="M4 19.5c0-1 0.8-1.8 1.8-1.8H20"/><path d="m8 8 2 2 4-4"/></>,
    history: <><circle cx="12" cy="12" r="8.8"/><path d="M12 7v5l3.2 2"/><path d="M4.5 5.5 3 4"/></>,
    leaderboard: <><path d="M4 20h16"/><path d="M6.5 17V9h3v8M10.5 17v-5h3v5M14.5 17V5h3v12"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.7 1.7-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V20h-2.4v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L8 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H6v-2.4h.8a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L8 8.6l1.7-1.7.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V5h2.4v.7a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.7 1.7-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.8V14h-.8a1.7 1.7 0 0 0-1.6 1Z"/></>,
    chart: <><path d="M4 19V9"/><path d="M10 19V5"/><path d="M16 19v-8"/><path d="M22 19V3"/></>,
    streak: <path d="M12.2 21c3.9-.2 6.8-2.7 6.8-6.5 0-3-1.6-5.1-4.1-7.2.1 2-.5 3.2-1.5 4.2-.1-3.9-2.3-6.7-5.1-8.5.4 3.9-3.2 5.7-3.2 9.7C5.1 17.7 8 21 12.2 21Z"/>,
    arrow: <><path d="M5 12h13"/><path d="m13 6 6 6-6 6"/></>,
    check: <><path d="m5 12 4.2 4L19 6"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    calendar: <><rect x="4" y="5.5" width="16" height="15" rx="1.5"/><path d="M8 3.5v4M16 3.5v4M4 9.5h16"/></>,
    clock: <><circle cx="12" cy="12" r="8.8"/><path d="M12 7v5l3 2"/></>,
    document: <><path d="M6 3.5h8l4 4V20.5H6z"/><path d="M14 3.5v4h4M9 12h6M9 15.5h6"/></>,
  }
  return <svg {...common}>{paths[name]}</svg>
}

function readPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_PERSISTED }
    const parsed = JSON.parse(raw)
    const restored = { ...DEFAULT_PERSISTED, ...parsed }
    const restoredPoolIds = restored.grade && restored.className ? preferredPoolIds(restored) : []
    const restoredPoolId = restoredPoolIds.includes(restored.rankingPoolId)
      ? restored.rankingPoolId
      : restoredPoolIds[0] || 'foundation'
    return {
      ...restored,
      // Never render a cached name list before the authenticated pool is re-read.
      publicLeaderboard: [],
      poolIds: restoredPoolIds,
      rankingPoolId: restoredPoolId,
      answerSyncQueue: recoverAnswerQueue(Array.isArray(parsed.answerSyncQueue) ? parsed.answerSyncQueue : []),
    }
  } catch { return { ...DEFAULT_PERSISTED } }
}

function normalize(value = '') {
  return value.trim().toLowerCase().replace(/[’']/g, "'").replace(/[。．,，!！?？]/g, '').replace(/\s+/g, ' ')
}

function normalizeAnswer(value = '') {
  return normalize(value).replace(/[.,!?。、「」]/g, '')
}

function isCorrectAnswer(question, userAnswer) {
  const candidates = question.accepted?.length ? question.accepted : [question.answer]
  return candidates.some((answer) => normalizeAnswer(answer) === normalizeAnswer(userAnswer))
}

function addAnsweredId(profile, courseId, questionId) {
  const answeredIds = [...new Set([...(profile.answeredIds || []), questionId])]
  return {
    ...profile,
    answeredIds,
    answeredByCourse: { ...(profile.answeredByCourse || {}), [courseId]: answeredIds },
  }
}

function cleanStudentName(value = '') {
  return value.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 20)
}

function localDateKey(value = new Date()) {
  const parts = new Intl.DateTimeFormat('ja-JP', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(value)
  const values = Object.fromEntries(parts.filter((part) => part.type !== 'literal').map((part) => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}

function ratingScopeKey(course, poolId) {
  return `${course}::${poolId || 'foundation'}`
}

function poolLabel(poolId) {
  return RANKING_POOL_OPTIONS.find((pool) => pool.id === poolId)?.label || 'ランキング'
}

function classPoolId(grade, className) {
  return grade && className ? `${grade}-${className}` : ''
}

function preferredPoolId({ grade = '', className = '', foundationMember = false } = {}) {
  return foundationMember ? 'foundation' : classPoolId(grade, className) || 'foundation'
}

function preferredPoolIds({ grade = '', className = '', foundationMember = false } = {}) {
  const classPool = classPoolId(grade, className)
  if (foundationMember) return classPool ? ['foundation', classPool] : ['foundation']
  return classPool ? [classPool] : []
}

function ratingsToScopeMap(ratings = {}, course, existing = {}) {
  return Object.entries(ratings).reduce((next, [poolId, value]) => {
    const rating = Number(value?.rating)
    return Number.isFinite(rating) ? { ...next, [ratingScopeKey(course, poolId)]: rating } : next
  }, { ...existing })
}

function getAuthoritativeRating(profile, syncKey, poolId) {
  const scopedRating = Number(profile.authoritativeRatingsByScope?.[`${syncKey}::${poolId || 'foundation'}`])
  if (Number.isFinite(scopedRating)) return scopedRating
  const rating = Number(profile.authoritativeRatingsBySyncKey?.[syncKey])
  return Number.isFinite(rating) ? rating : Number(profile.rating) || DEFAULT_RATING
}

async function hashPin(pin) {
  const bytes = new TextEncoder().encode(pin)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function requestScoreApi(params, { signal, timeoutMs = 15000 } = {}) {
  if (!SCORE_API_URL) return Promise.reject(new Error('score-api-not-configured'))
  // Keep URLSearchParams as the body object so fetch sets the form content
  // type Apps Script uses to populate e.parameter. Passing .toString() here
  // turns it into text/plain and makes every POST look like a leaderboard read.
  const body = new URLSearchParams(params)
  const controller = signal ? null : typeof AbortController === 'undefined' ? null : new AbortController()
  const timeout = controller ? window.setTimeout(() => controller.abort(), timeoutMs) : null
  return fetch(SCORE_API_URL, { method: 'POST', body, cache: 'no-store', signal: signal || controller?.signal }).then((response) => {
    if (!response.ok) throw new Error('score-api-response')
    return response.json()
  }).finally(() => { if (timeout) window.clearTimeout(timeout) })
}

function shuffle(items) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function shuffleDifferent(items) {
  if (items.length < 2) return [...items]
  const shuffled = shuffle(items)
  return shuffled.every((item, index) => item === items[index]) ? [...items.slice(1), items[0]] : shuffled
}

function diversifiedSample(items, count, seed = []) {
  const selected = [...seed]
  const selectedIds = new Set(selected.map((item) => item.id))
  const remaining = shuffle(items.filter((item) => !selectedIds.has(item.id)))
  const counts = { lesson: new Map(), topic: new Map(), type: new Map() }
  selected.forEach((item) => {
    ;['lesson', 'topic', 'type'].forEach((key) => {
      const value = String(item[key] || 'unknown')
      counts[key].set(value, (counts[key].get(value) || 0) + 1)
    })
  })
  while (selected.length < seed.length + count && remaining.length) {
    const scored = remaining.map((item, index) => {
      const lesson = String(item.lesson || 'unknown')
      const topic = String(item.topic || 'unknown')
      const type = String(item.type || 'unknown')
      return {
        item,
        index,
        score: (counts.lesson.get(lesson) || 0) * 100
          + (counts.topic.get(topic) || 0) * 10
          + (counts.type.get(type) || 0),
      }
    })
    const bestScore = Math.min(...scored.map((entry) => entry.score))
    const candidates = scored.filter((entry) => entry.score === bestScore)
    const picked = candidates[Math.floor(Math.random() * candidates.length)]
    selected.push(picked.item)
    remaining.splice(picked.index, 1)
    ;[['lesson', picked.item.lesson], ['topic', picked.item.topic], ['type', picked.item.type]].forEach(([key, rawValue]) => {
      const value = String(rawValue || 'unknown')
      counts[key].set(value, (counts[key].get(value) || 0) + 1)
    })
  }
  return selected.slice(seed.length)
}

function buildQueue(filter, answeredIds = [], questionBank = FOUNDATION_QUESTIONS) {
  // Answer history is for statistics only. Every session may draw from the
  // complete bank so repeated practice can continue to affect the rating.
  // The sample is still random, but its scoring avoids clustering the same
  // lesson, topic, and question type at the start of a session.
  const preferred = filter === 'all' ? questionBank : questionBank.filter((question) => question.difficulty === filter)
  const selected = diversifiedSample(preferred, SESSION_LENGTH)
  if (selected.length < SESSION_LENGTH) {
    const supplemental = questionBank.filter((question) => !selected.some((picked) => picked.id === question.id))
    selected.push(...diversifiedSample(supplemental, SESSION_LENGTH - selected.length, selected))
  }
  if (selected.length >= SESSION_LENGTH || !questionBank.length) return selected
  const repeatPool = shuffle(filter === 'all'
    ? questionBank
    : [...questionBank.filter((question) => question.difficulty === filter), ...questionBank.filter((question) => question.difficulty !== filter)])
  const repeats = Array.from({ length: SESSION_LENGTH - selected.length }, (_, index) => {
    const source = repeatPool[index % repeatPool.length]
    return { ...source, reviewInstance: `${source.id}-${Date.now()}-${index}` }
  })
  return [...selected, ...repeats]
}

function App() {
  const [persisted, setPersisted] = useState(readPersisted)
  const [view, setView] = useState(() => {
    const initial = readPersisted()
    return initial.studentName && initial.authToken ? 'lobby' : 'landing'
  })
  const [modeId, setModeId] = useState(() => {
    const initial = readPersisted()
    return COURSE_DETAILS[initial.modeId] ? initial.modeId : DEFAULT_MODE_ID
  })
  const [themeId, setThemeId] = useState(() => normalizeThemeId(readPersisted().themeId))
  const [rankingPoolId, setRankingPoolId] = useState(() => {
    const initial = readPersisted()
    return initial.rankingPoolId || preferredPoolId(initial)
  })
  const [filter, setFilter] = useState('all')
  const [queue, setQueue] = useState(() => {
    const initial = readPersisted()
    return buildQueue('all', initial.answeredIds, FOUNDATION_QUESTIONS)
  })
  const [questionBank, setQuestionBank] = useState(() => FOUNDATION_QUESTIONS)
  const [loadedBankModeId, setLoadedBankModeId] = useState(DEFAULT_MODE_ID)
  const [bankLoading, setBankLoading] = useState(false)
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState('')
  const [tokens, setTokens] = useState([])
  const [inputParts, setInputParts] = useState([])
  const [submitted, setSubmitted] = useState(null)
  const [sessionScore, setSessionScore] = useState({ correct: 0, answered: 0 })
  const [sessionAnswers, setSessionAnswers] = useState([])
  const [sessionRatingStart, setSessionRatingStart] = useState(persisted.rating)
  const [sessionCompletedAt, setSessionCompletedAt] = useState('')
  const [todaySeconds, setTodaySeconds] = useState(() => {
    const initial = readPersisted()
    return Number(initial.studyTimeByDate?.[localDateKey()]) || 0
  })
  const [notice, setNotice] = useState('')
  const [unlockCelebration, setUnlockCelebration] = useState(null)
  const [authMode, setAuthMode] = useState('login')
  const [authName, setAuthName] = useState(() => readPersisted().studentName || '')
  const [authPin, setAuthPin] = useState('')
  const [authGrade, setAuthGrade] = useState(() => readPersisted().grade || '1')
  const [authClassName, setAuthClassName] = useState(() => readPersisted().className || 'A')
  const [authFoundationMember, setAuthFoundationMember] = useState(() => Boolean(readPersisted().foundationMember))
  const [placementSetup, setPlacementSetup] = useState(null)
  const [authBusy, setAuthBusy] = useState(false)
  const leaderboardRequestRef = useRef(0)
  const leaderboardInFlightRef = useRef(false)
  const bankRequestRef = useRef(0)
  const answerSyncRunningRef = useRef(false)
  const answerSyncTimerRef = useRef(null)
  const [answerSyncTick, setAnswerSyncTick] = useState(0)
  const todaySecondsRef = useRef(todaySeconds)
  todaySecondsRef.current = todaySeconds
  const logoTapTimesRef = useRef([])
  const celebratedUnlocksRef = useRef(new Set())
  const activeRef = useRef(null)
  activeRef.current = { name: persisted.studentName, token: persisted.authToken, course: getRankingCourseId(modeId), poolId: rankingPoolId }
  const submitLock = useRef(false)
  const submitting = false

  const question = queue[index]
  const isComplete = !question
  const hasSession = Boolean(cleanStudentName(persisted.studentName) && persisted.authToken)
  const answerSyncIdentity = hasSession ? {
    name: cleanStudentName(persisted.studentName),
    authToken: persisted.authToken,
    course: getRankingCourseId(modeId),
  } : null
  const answerSyncKey = answerSyncIdentity ? getSyncKey(answerSyncIdentity) : ''
  const answerSyncSummary = getAnswerSyncSummary(persisted.answerSyncQueue, answerSyncKey)
  const authoritativeRating = hasSession ? getAuthoritativeRating(persisted, answerSyncKey, rankingPoolId) : DEFAULT_RATING
  const provisionalDelta = hasSession ? persisted.rating - authoritativeRating : 0
  const hasActivePractice = hasSession && view === 'practice' && !isComplete
  const allowedPoolOptions = hasSession
    ? RANKING_POOL_OPTIONS.filter((pool) => Array.isArray(persisted.poolIds) && persisted.poolIds.includes(pool.id))
    : []
  const student = { name: hasSession ? persisted.studentName : '未ログイン', grade: hasSession ? 'STUDENT' : 'NAME REQUIRED' }

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted))
  }, [persisted])

  useEffect(() => {
    setPersisted((current) => current.modeId === modeId ? current : { ...current, modeId })
  }, [modeId])

  useEffect(() => {
    setPersisted((current) => current.themeId === themeId ? current : { ...current, themeId })
  }, [themeId])

  useEffect(() => {
    const unlockedThemes = normalizeUnlockedThemes(persisted.unlockedThemes)
    if (themeId !== DEFAULT_THEME_ID && (!hasSession || !unlockedThemes.includes(themeId))) setThemeId(DEFAULT_THEME_ID)
  }, [themeId, hasSession, persisted.unlockedThemes])

  useEffect(() => {
    if (!hasSession || view !== 'practice' || isComplete) return undefined
    const timer = window.setInterval(() => {
      if (document.hidden) return
      setTodaySeconds((seconds) => seconds + 1)
    }, 1000)
    return () => window.clearInterval(timer)
  }, [hasSession, isComplete, view])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPersisted((current) => ({
        ...current,
        studyTimeByDate: { ...(current.studyTimeByDate || {}), [localDateKey()]: todaySecondsRef.current },
      }))
    }, 10000)
    return () => window.clearInterval(timer)
  }, [])

  const todaySessions = useMemo(() => {
    const today = localDateKey()
    return persisted.history.filter((item) => item.date === today)
  }, [persisted.history])

  const todayAnswered = todaySessions.reduce((sum, item) => sum + item.total, 0) + (sessionCompletedAt ? 0 : sessionScore.answered)
  const todayCorrect = todaySessions.reduce((sum, item) => sum + item.correct, 0) + (sessionCompletedAt ? 0 : sessionScore.correct)
  const todayRate = todayAnswered ? Math.round((todayCorrect / todayAnswered) * 100) : 0

  const applyAuthResult = (result, fallbackName) => {
    const rankingId = getRankingCourseId(modeId)
    const nextAuthToken = String(result.authToken || '')
    const nextName = result.name || fallbackName
    const serverAnsweredIds = Array.isArray(result.answeredIds) ? result.answeredIds : []
    const migratedQueue = rekeyAnswersForAuth(persisted.answerSyncQueue, {
      name: fallbackName,
      newAuthToken: nextAuthToken,
    })
    const nextPoolId = result.poolId || preferredPoolId(result)
    const nextSyncKey = getSyncKey({ name: nextName, authToken: nextAuthToken, course: rankingId })
    const serverRating = Number(result.rating) || DEFAULT_RATING
    const displayedRating = applyProvisionalRating(serverRating, migratedQueue, nextSyncKey)
    const nextUnlockedThemes = normalizeUnlockedThemes(result.unlockedThemes)
    const newUnlock = nextUnlockedThemes.find((themeId) => !persisted.unlockedThemes.includes(themeId))
    const newUnlockSeenKey = newUnlock ? unlockSeenKey(nextName, newUnlock) : ''
    const shouldCelebrateUnlock = Boolean(newUnlock && !persisted.unlockCelebrationSeen?.[newUnlockSeenKey])
    if (shouldCelebrateUnlock && !celebratedUnlocksRef.current.has(newUnlockSeenKey)) {
      celebratedUnlocksRef.current.add(newUnlockSeenKey)
      setThemeId(newUnlock)
      setUnlockCelebration(newUnlock)
    }
    const serverScopeRatings = ratingsToScopeMap(result.ratings, rankingId)
    serverScopeRatings[ratingScopeKey(rankingId, nextPoolId)] = serverRating
    const authoritativeScopeRatings = Object.entries(result.ratings || {}).reduce((next, [poolId, value]) => {
      const rating = Number(value?.rating)
      return Number.isFinite(rating) ? { ...next, [`${nextSyncKey}::${poolId}`]: rating } : next
    }, {})
    authoritativeScopeRatings[`${nextSyncKey}::${nextPoolId}`] = serverRating
    const nextAnsweredIds = [...new Set([...serverAnsweredIds, ...migratedQueue.filter((entry) => entry.syncKey === nextSyncKey).map((entry) => entry.questionId)])]
    setPersisted((current) => ({
      ...current,
      studentName: nextName,
      authToken: nextAuthToken,
      rating: displayedRating,
      grade: result.grade || current.grade,
      className: result.className || current.className,
      foundationMember: typeof result.foundationMember === 'boolean' ? result.foundationMember : current.foundationMember,
      unlockedThemes: nextUnlockedThemes,
      unlockCelebrationSeen: shouldCelebrateUnlock ? { ...(current.unlockCelebrationSeen || {}), [newUnlockSeenKey]: true } : current.unlockCelebrationSeen,
      rankingPoolId: nextPoolId,
      poolIds: Array.isArray(result.poolIds) ? result.poolIds : current.poolIds,
      ratingsByCourse: { ...(current.ratingsByCourse || {}), [rankingId]: displayedRating },
      ratingsByScope: { ...(current.ratingsByScope || {}), ...serverScopeRatings },
      authoritativeRatingsBySyncKey: { ...(current.authoritativeRatingsBySyncKey || {}), [nextSyncKey]: serverRating },
      authoritativeRatingsByScope: { ...(current.authoritativeRatingsByScope || {}), ...authoritativeScopeRatings },
      answerSyncQueue: migratedQueue,
      answeredIds: nextAnsweredIds,
      answeredByCourse: { ...(current.studentName?.toLowerCase() === fallbackName.toLowerCase() ? current.answeredByCourse : {}), [rankingId]: nextAnsweredIds },
      publicLeaderboard: Array.isArray(result.players) ? result.players : current.publicLeaderboard,
    }))
    setRankingPoolId(nextPoolId)
    setAuthName(nextName)
    setAuthPin('')
    setSessionRatingStart(serverRating)
    return { name: nextName, token: nextAuthToken, needsPlacement: Boolean(result.needsPlacement) }
  }

  const unlockAccountTheme = async (requestedThemeId) => {
    if (!hasSession) {
      setNotice('テーマ解放はログイン後に行えます。')
      return
    }
    if (normalizeUnlockedThemes(persisted.unlockedThemes).includes(requestedThemeId)) return
    setNotice('')
    try {
      const result = await requestScoreApi({
        action: 'unlock-theme',
        course: getRankingCourseId(modeId),
        poolId: rankingPoolId,
        name: persisted.studentName,
        authToken: persisted.authToken,
        themeId: requestedThemeId,
      }, { timeoutMs: AUTH_REQUEST_TIMEOUT_MS })
      const unlockedThemes = normalizeUnlockedThemes(result.unlockedThemes)
      if (!result.ok || !unlockedThemes.includes(requestedThemeId)) {
        setNotice(result.reason === 'rating-threshold' ? 'Crystalliumはレート10,000到達で解放されます。' : 'テーマを解放できませんでした。数秒後にもう一度お試しください。')
        return
      }
      const seenKey = unlockSeenKey(persisted.studentName, requestedThemeId)
      celebratedUnlocksRef.current.add(seenKey)
      setPersisted((current) => ({
        ...current,
        unlockedThemes,
        unlockCelebrationSeen: { ...(current.unlockCelebrationSeen || {}), [seenKey]: true },
      }))
      setThemeId(requestedThemeId)
      setUnlockCelebration(requestedThemeId)
    } catch {
      setNotice('テーマ解放の確認に失敗しました。数秒後にもう一度お試しください。')
    }
  }

  const handleBrandTap = () => {
    if (!hasSession) {
      setNotice('Moonはログイン後に解放できます。')
      return
    }
    const now = Date.now()
    const previous = logoTapTimesRef.current
    if (previous.length && now - previous[previous.length - 1] < 3000) {
      logoTapTimesRef.current = []
      return
    }
    const next = [...previous, now]
    if (next.length >= 4) {
      logoTapTimesRef.current = []
      void unlockAccountTheme('moon')
      return
    }
    logoTapTimesRef.current = next
  }

  const submitAuth = async () => {
    const isPlacement = Boolean(placementSetup)
    const name = cleanStudentName(placementSetup?.name || authName)
    if (!name) {
      setNotice('生徒名を入力してください。')
      return
    }
    if (isModerationBlocked(name)) {
      setNotice(MODERATION_NOTICE)
      return
    }
    if (!isPlacement && !/^\d{4,8}$/.test(authPin)) {
      setNotice('暗証番号は4〜8桁の数字で設定してください。')
      return
    }
    if ((isPlacement || authMode === 'register') && (!GRADE_OPTIONS.includes(authGrade) || !CLASS_OPTIONS.includes(authClassName))) {
      setNotice('学年とクラスを選択してください。')
      return
    }
    setAuthBusy(true)
    setNotice('')
    try {
      const params = isPlacement
        ? { action: 'update-profile', course: getRankingCourseId(modeId), name, authToken: placementSetup.token, grade: authGrade, className: authClassName, foundationMember: String(authFoundationMember), poolId: preferredPoolId({ grade: authGrade, className: authClassName, foundationMember: authFoundationMember }) }
        : { action: authMode, course: getRankingCourseId(modeId), name, pinHash: await hashPin(authPin), ...(authMode === 'register' ? { grade: authGrade, className: authClassName, foundationMember: String(authFoundationMember), poolId: preferredPoolId({ grade: authGrade, className: authClassName, foundationMember: authFoundationMember }) } : {}) }
      const result = await requestAuthWithRetry(
        () => requestScoreApi(params, { timeoutMs: AUTH_REQUEST_TIMEOUT_MS }),
      )
      if (!result.ok) {
        const messages = {
          'already-registered': 'この生徒名は登録済みです。ログインを選んでください。',
          'not-found': '登録されていない生徒名です。初回登録を選んでください。',
          'not-registered': 'この生徒名には暗証番号が設定されていません。初回登録を選んでください。',
          'wrong-pin': '暗証番号が一致しません。',
          'placement-required': '学年とクラスを選択してください。',
          'invalid-session': '登録情報を確認できませんでした。もう一度ログインしてください。',
          'inappropriate-content': MODERATION_NOTICE,
          'server-busy': '現在アクセスが集中しています。自動で再接続しましたが、数秒後にもう一度お試しください。',
          'service-unavailable': '共有サーバーが一時的に混み合っています。数秒後にもう一度お試しください。',
        }
        setNotice(messages[result.reason] || 'ログインできませんでした。入力内容を確認してください。')
        return
      }
      if (!result.authToken) {
        setNotice('ログイン情報を受け取れませんでした。管理者がApps Scriptを更新してから再試行してください。')
        return
      }
      const applied = applyAuthResult(result, name)
      if (applied.needsPlacement) {
        setPlacementSetup({ name: applied.name, token: applied.token })
        setAuthGrade(result.grade || '1')
        setAuthClassName(result.className || 'A')
        setAuthFoundationMember(Boolean(result.foundationMember))
        setNotice('所属情報を設定すると、クラスランキングに参加できます。')
        setView('landing')
        return
      }
      setPlacementSetup(null)
      setNotice('')
      setView('lobby')
    } catch {
      setNotice('共有サーバーが混み合っています。入力内容は保持されています。数秒後にもう一度お試しください。')
    } finally {
      setAuthBusy(false)
    }
  }

  const answeredIdsForCourse = (modeOrCourseId) => {
    const rankingId = getRankingCourseId(modeOrCourseId)
    const keys = rankingId === 'foundation-course'
      ? ['foundation-course', 'foundation-infinitive', 'foundation-gerund', 'foundation-participles']
      : [rankingId, modeOrCourseId]
    const stored = [...new Set(keys.flatMap((key) => persisted.answeredByCourse?.[key] || []))]
    return stored.length ? stored : (rankingId === 'foundation-course' ? persisted.answeredIds : [])
  }

  const loadBankForMode = async (nextModeId, nextFilter = 'all', nextAnsweredIds = answeredIdsForCourse(nextModeId)) => {
    const requestId = ++bankRequestRef.current
    if (loadedBankModeId === nextModeId && questionBank.length) {
      setQueue(buildQueue(nextFilter, nextAnsweredIds, questionBank))
      return
    }
    setBankLoading(true)
    setQueue([])
    try {
      const bank = await loadQuestionBank(nextModeId, FOUNDATION_QUESTIONS)
      if (requestId !== bankRequestRef.current) return
      setQuestionBank(bank)
      setLoadedBankModeId(nextModeId)
      setQueue(buildQueue(nextFilter, nextAnsweredIds, bank))
    } catch {
      if (requestId !== bankRequestRef.current) return
      setNotice('この単元の問題を読み込めませんでした。通信状態を確認して再試行してください。')
    } finally {
      if (requestId === bankRequestRef.current) setBankLoading(false)
    }
  }

  useEffect(() => {
    void loadBankForMode(modeId, 'all', answeredIdsForCourse(modeId))
  }, [modeId])

  const changeMode = (nextModeId) => {
    if (nextModeId === modeId) return
    if (hasActivePractice && !window.confirm('進行中の10問を破棄して講座を変更しますか？')) return
    const nextAnsweredIds = answeredIdsForCourse(nextModeId)
    const currentRankingId = getRankingCourseId(modeId)
    const nextRankingId = getRankingCourseId(nextModeId)
    const currentScope = ratingScopeKey(currentRankingId, rankingPoolId)
    const nextScope = ratingScopeKey(nextRankingId, rankingPoolId)
    const ratingsByCourse = { ...(persisted.ratingsByCourse || {}), [currentRankingId]: persisted.rating }
    const ratingsByScope = { ...(persisted.ratingsByScope || {}), [currentScope]: persisted.rating }
    const nextRating = ratingsByScope[nextScope] || ratingsByCourse[nextRankingId] || DEFAULT_RATING
    setModeId(nextModeId)
    const nextSyncKey = hasSession ? getSyncKey({ name: persisted.studentName, authToken: persisted.authToken, course: nextRankingId }) : ''
    const storedAuthoritative = getAuthoritativeRating({ ...persisted, rating: nextRating }, nextSyncKey, rankingPoolId)
    const nextSessionRating = Number.isFinite(storedAuthoritative) ? storedAuthoritative : nextRating
    setPersisted((current) => ({ ...current, modeId: nextModeId, rating: nextRating, ratingsByCourse, ratingsByScope, answeredIds: nextAnsweredIds, publicLeaderboard: [] }))
    setSessionRatingStart(nextSessionRating)
    setFilter('all')
    setQueue([])
    setIndex(0)
    setSelected('')
    setTokens([])
    setInputParts([])
    setSubmitted(null)
    setSessionScore({ correct: 0, answered: 0 })
    setSessionAnswers([])
    setSessionCompletedAt('')
    setNotice('')
    setView(hasSession ? 'lobby' : 'landing')
  }

  const changeRankingPool = (nextPoolId) => {
    if (!RANKING_POOL_OPTIONS.some((pool) => pool.id === nextPoolId) || nextPoolId === rankingPoolId) return
    if (!hasSession || !Array.isArray(persisted.poolIds) || !persisted.poolIds.includes(nextPoolId)) {
      setNotice('所属プールのみ表示できます。')
      return
    }
    if (hasActivePractice && !window.confirm('進行中の10問を破棄してランキング対象を変更しますか？')) return
    const currentCourse = getRankingCourseId(modeId)
    const currentScope = ratingScopeKey(currentCourse, rankingPoolId)
    const nextScope = ratingScopeKey(currentCourse, nextPoolId)
    const ratingsByScope = { ...(persisted.ratingsByScope || {}), [currentScope]: persisted.rating }
    const nextBaseRating = Number(ratingsByScope[nextScope]) || DEFAULT_RATING
    const nextSyncKey = hasSession ? getSyncKey({ name: persisted.studentName, authToken: persisted.authToken, course: currentCourse }) : ''
    const nextAuthoritative = hasSession ? getAuthoritativeRating({ ...persisted, rating: nextBaseRating }, nextSyncKey, nextPoolId) : DEFAULT_RATING
    const nextDisplayedRating = hasSession ? applyProvisionalRating(nextBaseRating, persisted.answerSyncQueue, nextSyncKey) : DEFAULT_RATING
    setRankingPoolId(nextPoolId)
    setPersisted((current) => ({ ...current, rankingPoolId: nextPoolId, rating: nextDisplayedRating, ratingsByScope, publicLeaderboard: [] }))
    setSessionRatingStart(nextAuthoritative)
    setNotice('')
    if (hasSession && !isComplete) {
      setFilter('all')
      void loadBankForMode(modeId, 'all', answeredIdsForCourse(modeId))
      setIndex(0)
      setSelected('')
      setTokens([])
      setInputParts([])
      setSubmitted(null)
      setSessionScore({ correct: 0, answered: 0 })
      setSessionAnswers([])
      setSessionCompletedAt('')
      setView('lobby')
    }
  }

  const restart = (nextFilter = filter) => {
    if (nextFilter !== filter && hasActivePractice && !window.confirm('進行中の10問を破棄して難易度を変更しますか？')) return
    setFilter(nextFilter)
    void loadBankForMode(modeId, nextFilter, answeredIdsForCourse(modeId))
    setIndex(0)
    setSelected('')
    setTokens([])
    setInputParts([])
    setSubmitted(null)
    setSessionScore({ correct: 0, answered: 0 })
    setSessionAnswers([])
    setSessionCompletedAt('')
    setSessionRatingStart(authoritativeRating)
    setNotice('')
    setView(hasSession ? 'practice' : 'landing')
  }

  const selectNav = (nextView) => {
    if (['practice', 'history'].includes(nextView) && !hasSession) {
      setNotice('この画面を使うには、先に生徒名と暗証番号でログインしてください。')
      setView('landing')
      return
    }
    setView(nextView)
    if (nextView === 'practice' && isComplete) restart(filter)
  }

  const startPractice = () => {
    if (!hasSession) {
      setNotice('先に生徒名と暗証番号でログインしてください。')
      setView('landing')
      return
    }
    if (Array.isArray(persisted.poolIds) && persisted.poolIds.length && !persisted.poolIds.includes(rankingPoolId)) {
      setNotice(`この生徒は${poolLabel(rankingPoolId)}ランキングに参加していません。所属ランキングを選択してください。`)
      setView('lobby')
      return
    }
    restart('all')
    setView('practice')
  }

  const logout = () => {
    if (hasActivePractice && !window.confirm('進行中のセッションを破棄してログアウトしますか？')) return
    setPersisted((current) => ({
      ...current,
      studentName: '',
      authToken: '',
      rating: DEFAULT_RATING,
      streak: 0,
      answeredIds: [],
      answeredByCourse: {},
      ratingsByCourse: {},
      ratingsByScope: {},
      authoritativeRatingsBySyncKey: {},
      authoritativeRatingsByScope: {},
      rankingPoolId: 'foundation',
      poolIds: [],
      grade: '',
      className: '',
      foundationMember: false,
      unlockedThemes: [],
      publicLeaderboard: [],
    }))
    setThemeId(DEFAULT_THEME_ID)
    setAuthName('')
    setAuthPin('')
    setSessionScore({ correct: 0, answered: 0 })
    setSessionAnswers([])
    setSessionCompletedAt('')
    setView('landing')
    setNotice('ログアウトしました。保存待ちの回答は、同じ表示名で再ログインすると再送されます。')
  }

  const refreshLeaderboard = async () => {
    if (!hasSession || !persisted.studentName || !persisted.authToken) {
      setPersisted((current) => current.publicLeaderboard.length ? { ...current, publicLeaderboard: [] } : current)
      return
    }
    if (!SCORE_API_URL) {
      setNotice('共有ランキングはサーバー接続後に表示されます。')
      return
    }
    if (!Array.isArray(persisted.poolIds) || !persisted.poolIds.includes(rankingPoolId)) {
      setPersisted((current) => current.publicLeaderboard.length ? { ...current, publicLeaderboard: [] } : current)
      return
    }
    if (leaderboardInFlightRef.current) return
    leaderboardInFlightRef.current = true
    const requestId = ++leaderboardRequestRef.current
    const rankingId = getRankingCourseId(modeId)
    try {
      const data = await requestScoreApi({ action: 'leaderboard', course: rankingId, poolId: rankingPoolId, name: persisted.studentName, authToken: persisted.authToken })
      if (requestId !== leaderboardRequestRef.current) return
      if (data.ok && Array.isArray(data.players)) setPersisted((current) => ({ ...current, publicLeaderboard: data.players }))
      else setPersisted((current) => ({ ...current, publicLeaderboard: [] }))
    } catch {
      if (requestId === leaderboardRequestRef.current) setNotice('公開ランキングを読み込めませんでした。')
    } finally {
      leaderboardInFlightRef.current = false
    }
  }

  useEffect(() => {
    if (SCORE_API_URL && hasSession) refreshLeaderboard()
    if (!hasSession) setPersisted((current) => current.publicLeaderboard.length ? { ...current, publicLeaderboard: [] } : current)
  }, [modeId, rankingPoolId, hasSession, persisted.studentName, persisted.authToken, persisted.poolIds])

  useEffect(() => {
    if (!SCORE_API_URL || !hasSession || view !== 'leaderboard') return undefined
    const timer = window.setInterval(() => {
      if (!document.hidden) void refreshLeaderboard()
    }, 20000)
    return () => window.clearInterval(timer)
  }, [view, modeId, rankingPoolId, hasSession, persisted.studentName, persisted.authToken])

  useEffect(() => {
    if (!SCORE_API_URL || !hasSession || !answerSyncIdentity) return undefined
    const identity = { ...answerSyncIdentity }
    const controller = typeof AbortController === 'undefined' ? null : new AbortController()
    requestScoreApi({ action: 'session', course: identity.course, poolId: rankingPoolId, name: identity.name, authToken: identity.authToken }, { signal: controller?.signal })
      .then((result) => {
        if (!result.ok || activeRef.current.token !== identity.authToken || activeRef.current.course !== identity.course || activeRef.current.poolId !== rankingPoolId) return
        const nextPoolId = result.poolId || preferredPoolId(result)
        if (nextPoolId && nextPoolId !== rankingPoolId) setRankingPoolId(nextPoolId)
        const serverRating = Number(result.rating) || DEFAULT_RATING
        const syncKey = getSyncKey(identity)
        setPersisted((current) => {
          const displayedRating = applyProvisionalRating(serverRating, current.answerSyncQueue, syncKey)
          const serverAnsweredIds = Array.isArray(result.answeredIds) ? result.answeredIds : []
          return {
            ...current,
            rating: displayedRating,
            rankingPoolId: nextPoolId || current.rankingPoolId,
            ratingsByCourse: { ...(current.ratingsByCourse || {}), [identity.course]: displayedRating },
            ratingsByScope: { ...(current.ratingsByScope || {}), ...ratingsToScopeMap(result.ratings, identity.course, { [ratingScopeKey(identity.course, rankingPoolId)]: displayedRating }) },
            authoritativeRatingsBySyncKey: { ...(current.authoritativeRatingsBySyncKey || {}), [syncKey]: serverRating },
            authoritativeRatingsByScope: { ...(current.authoritativeRatingsByScope || {}), ...Object.entries(result.ratings || {}).reduce((next, [poolId, value]) => Number.isFinite(Number(value?.rating)) ? { ...next, [`${syncKey}::${poolId}`]: Number(value.rating) } : next, {}) },
            grade: result.grade || current.grade,
            className: result.className || current.className,
            foundationMember: typeof result.foundationMember === 'boolean' ? result.foundationMember : current.foundationMember,
            unlockedThemes: Array.isArray(result.unlockedThemes) ? normalizeUnlockedThemes(result.unlockedThemes) : current.unlockedThemes,
            poolIds: Array.isArray(result.poolIds) ? result.poolIds : current.poolIds,
            answeredIds: identity.course === 'foundation-course' ? serverAnsweredIds : current.answeredIds,
            answeredByCourse: { ...(current.answeredByCourse || {}), [identity.course]: serverAnsweredIds },
            publicLeaderboard: Array.isArray(result.players) ? result.players : current.publicLeaderboard,
          }
        })
      })
      .catch(() => {})
    return () => controller?.abort()
  }, [answerSyncKey, hasSession, modeId, rankingPoolId])

  const setSubmittedSync = (questionId, patch) => {
    setSubmitted((current) => current?.questionId === questionId ? { ...current, ...patch } : current)
  }

  const retryAnswer = (questionId) => {
    if (!answerSyncKey) return
    const entry = getAnswerForQuestion(persisted.answerSyncQueue, answerSyncKey, questionId)
    if (!entry || entry.status !== 'error') return
    const nextAttemptAt = Date.now()
    setPersisted((current) => ({
      ...current,
      answerSyncQueue: prepareAnswerRetry(current.answerSyncQueue, entry.id, nextAttemptAt),
    }))
    setSubmittedSync(questionId, { syncStatus: 'pending', syncError: '' })
  }

  const retryFailedAnswers = () => {
    if (!answerSyncKey) return
    const nextAttemptAt = Date.now()
    setPersisted((current) => ({
      ...current,
      answerSyncQueue: current.answerSyncQueue.reduce((nextQueue, entry) => (
        entry.syncKey === answerSyncKey && entry.status === 'error'
          ? prepareAnswerRetry(nextQueue, entry.id, nextAttemptAt)
          : nextQueue
      ), current.answerSyncQueue),
    }))
    if (submitted?.questionId) setSubmittedSync(submitted.questionId, { syncStatus: 'pending', syncError: '' })
  }

  useEffect(() => {
    if (answerSyncTimerRef.current) {
      window.clearTimeout(answerSyncTimerRef.current)
      answerSyncTimerRef.current = null
    }
    if (!SCORE_API_URL || !hasSession || !answerSyncIdentity || !answerSyncSummary.total || answerSyncRunningRef.current) return undefined
    if (answerSyncSummary.nextAttemptAt && answerSyncSummary.nextAttemptAt > Date.now()) {
      answerSyncTimerRef.current = window.setTimeout(() => setAnswerSyncTick((value) => value + 1), Math.max(50, answerSyncSummary.nextAttemptAt - Date.now()))
      return () => window.clearTimeout(answerSyncTimerRef.current)
    }
    if (answerSyncSummary.blocked) return undefined

    const queueSnapshot = persisted.answerSyncQueue
    const initialIds = new Set(queueSnapshot.filter((entry) => entry.syncKey === answerSyncKey).map((entry) => entry.id))
    answerSyncRunningRef.current = true
    void flushAnswerQueue({
      queue: queueSnapshot,
      identity: answerSyncKey,
      timeoutMs: ANSWER_SYNC_TIMEOUT_MS,
      maxAttempts: ANSWER_SYNC_MAX_ATTEMPTS,
      send: (entry, { signal } = {}) => requestScoreApi({
        action: 'answer',
        compact: 'true',
        course: entry.course,
        name: entry.name,
        authToken: entry.authToken,
        questionId: entry.questionId,
        answer: entry.answer || '',
        answerId: entry.answerId || '',
        legacyCorrect: String(entry.correct),
        correct: String(entry.correct),
        delta: String(entry.delta),
        poolId: entry.poolId || rankingPoolId,
      }, { signal }),
      onChange: (nextQueue) => setPersisted((current) => current.authToken !== answerSyncIdentity.authToken ? current : ({
        ...current,
        answerSyncQueue: mergeQueueSnapshot(current.answerSyncQueue, nextQueue, answerSyncKey, initialIds),
      })),
      onResult: ({ type, entry, result, queue: nextQueue }) => {
        const hasAuthoritativeRating = result?.rating != null && Number.isFinite(Number(result.rating))
        const syncStatus = type === 'synced'
          ? (hasAuthoritativeRating ? 'synced' : 'synced-unconfirmed')
          : type === 'duplicate'
            ? (hasAuthoritativeRating ? 'duplicate' : 'duplicate-unconfirmed')
            : type === 'blocked' ? 'blocked'
            : type === 'retry-scheduled' ? 'pending' : 'error'
        const syncError = type === 'invalid-session' || type === 'rejected' ? (result?.reason || 'server-rejected') : type === 'failed' ? entry.lastError : ''
        const resultUnlockedThemes = Array.isArray(result?.unlockedThemes) ? normalizeUnlockedThemes(result.unlockedThemes) : null
        const newResultUnlock = resultUnlockedThemes?.find((themeId) => !normalizeUnlockedThemes(persisted.unlockedThemes).includes(themeId))
        const resultUnlockKey = newResultUnlock ? unlockSeenKey(persisted.studentName, newResultUnlock) : ''
        if (newResultUnlock && !celebratedUnlocksRef.current.has(resultUnlockKey)) {
          celebratedUnlocksRef.current.add(resultUnlockKey)
          setThemeId(newResultUnlock)
          setUnlockCelebration(newResultUnlock)
        }
        setPersisted((current) => {
          if (current.authToken !== entry.authToken || current.studentName.toLowerCase() !== entry.name.toLowerCase()) return current
          const mergedQueue = mergeQueueSnapshot(current.answerSyncQueue, nextQueue, answerSyncKey, initialIds)
          if (!hasAuthoritativeRating) return { ...current, answerSyncQueue: mergedQueue }
          const serverRating = Number(result.rating)
          const displayedRating = applyProvisionalRating(serverRating, mergedQueue, entry.syncKey)
          const resultPoolId = result.poolId || rankingPoolId
          const resultScopeRatings = ratingsToScopeMap(result.ratings, entry.course)
          if (Number.isFinite(serverRating)) resultScopeRatings[ratingScopeKey(entry.course, resultPoolId)] = serverRating
          const resultAuthoritative = Object.entries(result.ratings || {}).reduce((next, [poolId, value]) => Number.isFinite(Number(value?.rating)) ? { ...next, [`${entry.syncKey}::${poolId}`]: Number(value.rating) } : next, {})
          resultAuthoritative[`${entry.syncKey}::${resultPoolId}`] = serverRating
          return {
            ...current,
            answerSyncQueue: mergedQueue,
            rating: activeRef.current.course === entry.course && activeRef.current.poolId === resultPoolId ? displayedRating : current.rating,
            ratingsByCourse: { ...(current.ratingsByCourse || {}), [entry.course]: displayedRating },
            ratingsByScope: { ...(current.ratingsByScope || {}), ...resultScopeRatings },
            authoritativeRatingsBySyncKey: { ...(current.authoritativeRatingsBySyncKey || {}), [entry.syncKey]: serverRating },
            authoritativeRatingsByScope: { ...(current.authoritativeRatingsByScope || {}), ...resultAuthoritative },
            unlockedThemes: resultUnlockedThemes || current.unlockedThemes,
            unlockCelebrationSeen: newResultUnlock ? { ...(current.unlockCelebrationSeen || {}), [resultUnlockKey]: true } : current.unlockCelebrationSeen,
          }
        })
        if (activeRef.current.token !== entry.authToken || activeRef.current.course !== entry.course) return
        if (type === 'invalid-session') setNotice('回答は端末に保管されています。再ログインして保存を再開してください。')
        if (type === 'blocked') setNotice(MODERATION_NOTICE)
        if (type === 'rejected') setNotice(result?.reason === 'invalid-question'
          ? 'この問題はサーバー側に登録されていないため、レート保存できません。管理者に連絡してください。'
          : result?.reason === 'pool-forbidden'
            ? '現在のランキング対象に保存できません。ランキングを選び直して再送してください。'
            : '所属情報が未設定のため、レート保存できません。')
        setSubmittedSync(entry.questionId, {
          ...(result?.serverValidated === true && typeof result.correct === 'boolean' ? { correct: result.correct } : {}),
          syncStatus,
          syncError,
          delta: Number.isFinite(Number(result?.delta)) ? Number(result.delta) : entry.delta,
        })
      },
    }).finally(() => {
      answerSyncRunningRef.current = false
      setAnswerSyncTick((value) => value + 1)
    })

    return undefined
  }, [answerSyncKey, answerSyncSummary.blocked, answerSyncSummary.errors, answerSyncSummary.nextAttemptAt, answerSyncSummary.pending, answerSyncSummary.total, answerSyncTick, hasSession, modeId, rankingPoolId, persisted.answerSyncQueue])

  const currentAnswer = () => {
    if (question.type === 'reorder') return tokens.join(' ')
    if (question.type === 'input') return inputParts.join(' ').trim()
    return selected
  }

  const submit = () => {
    if (submitted || submitLock.current || !question) return
    if (!hasSession) {
      setNotice('先にログインしてください。')
      setView('landing')
      return
    }
    const userAnswer = currentAnswer()
    if (!userAnswer.trim()) return
    if (isModerationBlocked(userAnswer)) {
      setNotice(MODERATION_NOTICE)
      return
    }
    const correct = isCorrectAnswer(question, userAnswer)
    const delta = correct ? RATING_POINTS[question.difficulty] : -RATING_LOSS[question.difficulty]
    submitLock.current = true
    setNotice('')
    const rated = !question.practiceOnly
    const entry = rated ? createPendingAnswer({ ...answerSyncIdentity, poolId: rankingPoolId, questionId: question.id, answer: userAnswer, correct, delta }) : null
    const nextRating = rated ? Math.max(800, persisted.rating + delta) : persisted.rating
    const nextState = rated ? addAnsweredId({ ...persisted, rating: nextRating,
      ratingsByCourse: { ...persisted.ratingsByCourse, [answerSyncIdentity.course]: nextRating },
      ratingsByScope: { ...(persisted.ratingsByScope || {}), [ratingScopeKey(answerSyncIdentity.course, rankingPoolId)]: nextRating },
      streak: correct ? persisted.streak + 1 : 0,
      answerSyncQueue: enqueueAnswer(persisted.answerSyncQueue, entry),
    }, answerSyncIdentity.course, question.id) : persisted
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState)) }
    catch { submitLock.current = false; setNotice('端末に回答を保存できません。空き容量やブラウザの保存設定を確認してください。'); return }
    setPersisted(nextState)
    setSessionScore((score) => ({ correct: score.correct + (correct ? 1 : 0), answered: score.answered + 1 }))
    setSessionAnswers((answers) => [...answers, {
      id: `${question.id}-${Date.now()}`,
      question,
      userAnswer,
      correct,
      delta: rated ? delta : 0,
      practiceOnly: !rated,
      correctAnswer: question.answerLabel || question.answer,
    }])
    setSubmitted({ questionId: question.id, correct, userAnswer, delta: rated ? delta : 0, correctAnswer: question.answerLabel || question.answer, syncStatus: rated ? 'pending' : 'not-rated' })
  }

  const nextQuestion = () => {
    submitLock.current = false
    if (index === queue.length - 1) {
      const completedAt = new Date().toISOString()
      const sessionRatingAfter = projectSessionRating(sessionRatingStart, sessionAnswers)
      const session = {
        id: `${Date.now()}`,
        date: localDateKey(new Date(completedAt)),
        completedAt,
        label: filter === 'all' ? 'ミックス演習' : `${DIFFICULTY[filter].label}演習`,
        correct: sessionScore.correct,
        total: sessionScore.answered,
        ratingStart: sessionRatingStart,
        ratingDelta: sessionRatingAfter - sessionRatingStart,
        ratingAfter: sessionRatingAfter,
      }
      setPersisted((current) => ({ ...current, history: [session, ...current.history].slice(0, 20), studyTimeByDate: { ...(current.studyTimeByDate || {}), [localDateKey()]: todaySecondsRef.current } }))
      setSessionCompletedAt(completedAt)
      setIndex(index + 1)
      return
    }
    setIndex((current) => current + 1)
    setSelected('')
    setTokens([])
    setInputParts([])
    setSubmitted(null)
  }

  const useWord = (word) => {
    if (submitted) return
    setTokens((current) => [...current, word])
  }

  const removeWord = (position) => {
    if (submitted) return
    setTokens((current) => current.filter((_, indexValue) => indexValue !== position))
  }

  const answerPreview = question ? (question.type === 'reorder' ? tokens.join(' ') : currentAnswer()) : ''

  return (
    <>
    <div className={`app-shell theme-${themeId}`} data-theme={themeId}>
      <aside className="sidebar">
        <button type="button" className="brand-block" aria-label="Grammar Arena" onClick={handleBrandTap}>
          <div className="brand-mark"><Icon name="practice" size={30} /></div>
          <div><div className="brand-name">GRAMMAR</div><div className="brand-name">ARENA</div></div>
        </button>
        <nav className="main-nav" aria-label="メインナビゲーション">
          <NavItem icon="practice" label="演習" active={view === 'practice' || view === 'landing' || view === 'lobby'} onClick={() => selectNav('practice')} />
          <NavItem icon="leaderboard" label="ランキング" active={view === 'leaderboard'} onClick={() => selectNav('leaderboard')} />
          <NavItem icon="history" label="履歴" active={view === 'history'} onClick={() => selectNav('history')} />
          <NavItem icon="settings" label="設定" active={view === 'settings'} onClick={() => selectNav('settings')} />
        </nav>
        <div className="sidebar-footer"><div className="footer-line" /><div className="footer-message"><span className="footer-cap">◆</span><span>学びが、未来をつくる。</span></div></div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="top-stat"><Icon name="chart" size={28} /><div className="rating-stack"><span>{hasSession && answerSyncSummary.total > 0 ? '確定レート' : '現在レート'}</span><strong>{hasSession ? authoritativeRating.toLocaleString() : '—'}</strong>{hasSession && answerSyncSummary.total > 0 && <small>暫定 {persisted.rating.toLocaleString()}（{provisionalDelta >= 0 ? '+' : ''}{provisionalDelta}）</small>}</div>{hasSession && submitted && <span className={`rating-delta ${submitted.delta >= 0 ? 'positive' : ''}`}>{`${submitted.delta >= 0 ? '▲ +' : '▼ '}${submitted.delta}`}</span>}</div>
          <div className="top-divider" />
          <div className="top-stat streak-stat"><Icon name="streak" size={27} /><div><span>連続正解</span><strong>{persisted.streak}</strong></div></div>
          <div className="topbar-spacer" />
          <div className="selector-stack name-stack"><label htmlFor="student-name">生徒</label><div id="student-name" className="name-display">{persisted.studentName || '未ログイン'}</div><span>{hasSession ? 'ログイン中 / ランキングに表示' : '暗証番号でログイン'}</span></div>
          <div className="selector-stack course-switcher"><label htmlFor="course-selector">講座</label><select id="course-selector" value={modeId} onChange={(event) => changeMode(event.target.value)}>{COURSE_MODES.map((course) => <option key={course.id} value={course.id} disabled={!course.available}>{course.label}</option>)}</select><span>講座と所属別にランキングが分かれます</span></div>
          {hasSession && allowedPoolOptions.length > 0 && <div className="selector-stack pool-switcher"><label htmlFor="ranking-pool-selector">ランキング</label><select id="ranking-pool-selector" value={rankingPoolId} onChange={(event) => changeRankingPool(event.target.value)}>{allowedPoolOptions.map((pool) => <option key={pool.id} value={pool.id}>{pool.label}</option>)}</select><span>{poolLabel(rankingPoolId)}の参加者を表示</span></div>}
          {hasSession && <button type="button" className="logout-button" onClick={logout}>ログアウト</button>}
          <div className="profile-orb" aria-hidden="true">{student.name.slice(0, 1)}</div>
        </header>

        <div className="content-wrap">
          {view === 'landing' && <LandingView {...{ course: getCourseDetails(modeId), authMode, setAuthMode, authName, setAuthName, authPin, setAuthPin, authGrade, setAuthGrade, authClassName, setAuthClassName, authFoundationMember, setAuthFoundationMember, placementSetup, submitAuth, authBusy, notice, setNotice, leaderboard: hasSession ? persisted.publicLeaderboard : [], rankingPoolId }} />}
          {view === 'lobby' && <LobbyView course={getCourseDetails(modeId)} studentName={persisted.studentName} rating={authoritativeRating} leaderboard={hasSession ? persisted.publicLeaderboard : []} rankingPoolId={rankingPoolId} startPractice={startPractice} openLeaderboard={() => setView('leaderboard')} />}
          {view === 'practice' && <PracticeView {...{ course: getCourseDetails(modeId), question, queue, index, filter, setFilter: restart, submitted, submit, nextQuestion, selected, setSelected, tokens, useWord, removeWord, inputParts, setInputParts, answerPreview, isComplete, bankLoading, restart, sessionScore, sessionAnswers, sessionRatingStart, sessionCompletedAt, rating: persisted.rating, authoritativeRating, history: persisted.history, todayCorrect, todayAnswered, todaySeconds, submitting, notice, leaderboard: hasSession ? persisted.publicLeaderboard : [], rankingPoolId, studentName: persisted.studentName, openLeaderboard: () => setView('leaderboard'), answerSyncSummary, retryAnswer, retryFailedAnswers }} />}
          {view === 'leaderboard' && <LeaderboardView course={getCourseDetails(modeId)} players={hasSession ? persisted.publicLeaderboard : []} rating={authoritativeRating} studentName={persisted.studentName} rankingPoolId={rankingPoolId} refresh={refreshLeaderboard} notice={notice} />}
          {view === 'history' && <HistoryView history={persisted.history} rating={authoritativeRating} />}
          {view === 'settings' && <SettingsView filter={filter} setFilter={restart} autoExplanation={persisted.autoExplanation} setAutoExplanation={(value) => setPersisted((current) => ({ ...current, autoExplanation: value }))} themeId={themeId} setThemeId={setThemeId} hasSession={hasSession} unlockedThemes={persisted.unlockedThemes} />}
        </div>
      </main>
    </div>
    {unlockCelebration && <ThemeUnlockOverlay themeId={unlockCelebration} onClose={() => setUnlockCelebration(null)} />}
    </>
  )
}

function LandingView({ course, authMode, setAuthMode, authName, setAuthName, authPin, setAuthPin, authGrade, setAuthGrade, authClassName, setAuthClassName, authFoundationMember, setAuthFoundationMember, placementSetup, submitAuth, authBusy, notice, setNotice, leaderboard, rankingPoolId }) {
  return <div className="landing-view">
    <div className="landing-layout">
      <section className="landing-hero">
        <div className="landing-eyebrow"><span className="landing-mark"><Icon name="practice" size={25} /></span><span>WELCOME TO GRAMMAR ARENA</span></div>
      <p className="section-kicker">{course.eyebrow} / {course.unit}</p>
        <h1>レートを確認して、<br /><em>対戦を始める。</em></h1>
        <p className="landing-copy">{placementSetup ? '所属情報を登録すると、クラスごとのランキングに参加できます。' : `表示名と暗証番号で確認してから、${course.label}・${course.name}の10問対戦を始められます。`}</p>
        {!placementSetup && <div className="auth-tabs" role="tablist" aria-label="アカウント操作">
          <button type="button" className={authMode === 'login' ? 'selected' : ''} onClick={() => { setAuthMode('login'); setNotice('') }}>ログイン</button>
          <button type="button" className={authMode === 'register' ? 'selected' : ''} onClick={() => { setAuthMode('register'); setNotice('') }}>初回登録</button>
        </div>}
        <form className="landing-form" onSubmit={(event) => { event.preventDefault(); submitAuth() }}>
          {!placementSetup && <>
            <label htmlFor="landing-student-name">表示名（ランキングに表示）</label>
            <input id="landing-student-name" value={authName} onChange={(event) => setAuthName(event.target.value)} placeholder="例：山田 太郎" maxLength={20} autoComplete="username" />
            <label htmlFor="landing-pin">暗証番号（4〜8桁）</label>
            <input id="landing-pin" type="password" inputMode="numeric" value={authPin} onChange={(event) => setAuthPin(event.target.value.replace(/\D/g, '').slice(0, 8))} placeholder="数字のみ" maxLength={8} autoComplete={authMode === 'login' ? 'current-password' : 'new-password'} />
          </>}
          {(placementSetup || authMode === 'register') && <>
            <div className="placement-grid">
              <div><label htmlFor="landing-grade">学年</label><select id="landing-grade" value={authGrade} onChange={(event) => setAuthGrade(event.target.value)}>{GRADE_OPTIONS.map((grade) => <option key={grade} value={grade}>{grade}年</option>)}</select></div>
              <div><label htmlFor="landing-class">クラス</label><select id="landing-class" value={authClassName} onChange={(event) => setAuthClassName(event.target.value)}>{CLASS_OPTIONS.map((className) => <option key={className} value={className}>{className}組</option>)}</select></div>
            </div>
            <label className="placement-check"><input type="checkbox" checked={authFoundationMember} onChange={(event) => setAuthFoundationMember(event.target.checked)} /><span>基礎講座受講中</span></label>
            <p className="placement-help">チェックを入れると基礎講座ランキング、入れない場合は所属クラスランキングに参加します。</p>
          </>}
          {notice && <p className="auth-notice" role="alert">{notice}</p>}
          <button type="submit" className="primary-button landing-start" disabled={authBusy}>{authBusy ? '確認中…' : placementSetup ? '所属情報を保存して開始' : authMode === 'login' ? 'ログインしてレート確認' : '登録してレート対戦へ'}<Icon name="arrow" size={21} /></button>
          {!placementSetup && <p className="landing-note">本名ではなく、授業で使うニックネームや出席番号の利用を推奨します。暗証番号は画面に表示されず、照合用の情報だけを保存します。</p>}
        </form>
      </section>
      <PublicLeaderboard players={leaderboard} currentName={authName} courseLabel={course.label} poolLabel={poolLabel(rankingPoolId)} limit={5} />
    </div>
    <div className="landing-footer"><span>NOW PLAYING</span><strong>{course.label} - {course.name}</strong><span className="landing-footer-muted">講座と所属別にランキングが分かれます</span></div>
  </div>
}

function LobbyView({ course, studentName, rating, leaderboard, rankingPoolId, startPractice, openLeaderboard }) {
  return <div className="lobby-view">
    <section className="lobby-card">
      <div className="landing-eyebrow"><span className="landing-mark"><Icon name="leaderboard" size={25} /></span><span>READY FOR RATED MATCH</span></div>
      <p className="section-kicker">WELCOME BACK / {studentName}</p>
      <h1>レート対戦の準備完了。</h1>
      <div className="lobby-rate"><span>YOUR CURRENT RATE</span><strong>{rating.toLocaleString()}</strong><small>{studentName} の現在レート / {course.name}</small></div>
      <button type="button" className="primary-button lobby-start" onClick={startPractice}>レート対戦を始める<Icon name="arrow" size={21} /></button>
    </section>
    <PublicLeaderboard players={leaderboard} currentName={studentName} courseLabel={course.label} poolLabel={poolLabel(rankingPoolId)} limit={5} onOpen={openLeaderboard} />
  </div>
}

function NavItem({ icon, label, active, onClick }) {
  return <button type="button" className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}><Icon name={icon} size={22} /><span>{label}</span></button>
}

function PracticeView({ course, question, queue, index, filter, setFilter, submitted, submit, nextQuestion, selected, setSelected, tokens, useWord, removeWord, inputParts, setInputParts, answerPreview, isComplete, bankLoading, restart, sessionScore, sessionAnswers, sessionRatingStart, sessionCompletedAt, rating, authoritativeRating, history, todayCorrect, todayAnswered, todaySeconds, submitting, notice, leaderboard, rankingPoolId, studentName, openLeaderboard, answerSyncSummary, retryAnswer, retryFailedAnswers }) {
  return <div className="practice-layout">
    <section className="practice-column">
      <div className="course-banner"><div><span className="course-banner-label">{course.eyebrow}</span><strong>{course.label}</strong><span className="course-banner-unit">{course.unit} / {course.name}</span></div><span className="course-stamp">STUDY</span></div>
      <div className="section-heading"><div><p className="section-kicker">{course.label} / {course.name}</p><h1>{course.title}</h1><p className="session-hint">1セッション {SESSION_LENGTH}問 / {filter === 'all' ? '全レベルミックス' : `${DIFFICULTY[filter].label}を優先して出題`}</p></div><div className="difficulty-tabs" role="tablist" aria-label="難易度"><DifficultyTab value="all" current={filter} onClick={setFilter} label="すべて" /><DifficultyTab value="starter" current={filter} onClick={setFilter} label="基礎" /><DifficultyTab value="standard" current={filter} onClick={setFilter} label="標準" /><DifficultyTab value="advanced" current={filter} onClick={setFilter} label="発展" /></div></div>
      {notice && <div className="app-notice" role="status">{notice}</div>}
      {answerSyncSummary.total > 0 && <div className={`sync-status ${answerSyncSummary.errors && !answerSyncSummary.pending ? 'has-error' : ''}`} role="status"><span>{answerSyncSummary.errors && !answerSyncSummary.pending ? `保存エラー ${answerSyncSummary.errors}問` : answerSyncSummary.errors ? `保存待ち ${answerSyncSummary.total}問（自動再送中）` : `保存待ち ${answerSyncSummary.total}問`}</span><small>解答と判定は画面に反映済みです。</small>{answerSyncSummary.errors > 0 && <button type="button" onClick={retryFailedAnswers}>再送する</button>}</div>}
      {bankLoading ? <LoadingQuestionState /> : isComplete && sessionAnswers.length === 0 ? <EmptyQuestionState restart={() => restart(filter)} /> : isComplete ? <CompleteCard {...{ score: sessionScore, queue, reviews: sessionAnswers, course, studentName, ratingStart: sessionRatingStart, ratingAfter: authoritativeRating, provisionalRating: rating, completedAt: sessionCompletedAt, restart: () => restart(filter) }} /> : <QuestionCard {...{ question, queue, index, submitted, nextQuestion, selected, setSelected, tokens, useWord, removeWord, inputParts, setInputParts, submit, answerPreview, submitting, retryAnswer }} />}
      {!isComplete && sessionAnswers.length > 0 && <div className="partial-session-tools"><span>ここまでの解説を保存</span><SessionPdfPicker {...{ reviews: sessionAnswers, course, studentName, ratingStart: sessionRatingStart, ratingAfter: authoritativeRating, completedAt: sessionCompletedAt }} /></div>}
    </section>
    <div className="right-column"><DailyRail correct={todayCorrect} answered={todayAnswered} seconds={todaySeconds} history={history} rating={rating} /><PublicLeaderboard players={leaderboard} currentName={studentName} courseLabel={course.label} poolLabel={poolLabel(rankingPoolId)} onOpen={openLeaderboard} /></div>
  </div>
}

function DifficultyTab({ value, current, onClick, label }) {
  return <button type="button" className={`difficulty-tab ${current === value ? 'selected' : ''}`} onClick={() => onClick(value)}>{label}</button>
}

function EmptyQuestionState({ restart }) {
  return <article className="empty-question-state"><Icon name="history" size={32} /><h2>出題できる問題がありません。</h2><p>この講座の未回答問題がなくなりました。復習問題を追加するか、別の講座を選んでください。</p><button type="button" className="primary-button" onClick={restart}>もう一度確認する<Icon name="arrow" size={21} /></button></article>
}

function LoadingQuestionState() {
  return <article className="empty-question-state"><Icon name="clock" size={32} /><h2>問題を読み込んでいます。</h2><p>この単元の問題を準備しています。少しだけお待ちください。</p></article>
}

function QuestionCard({ question: sourceQuestion, queue, index, submitted, submit, nextQuestion, selected, setSelected, tokens, useWord, removeWord, inputParts, setInputParts, answerPreview, submitting, retryAnswer }) {
  const [shuffledWords, setShuffledWords] = useState(() => sourceQuestion.type === 'reorder' ? shuffleDifferent(sourceQuestion.words) : [])
  const [shuffledChoices, setShuffledChoices] = useState(() => sourceQuestion.type === 'choice' ? shuffleDifferent(sourceQuestion.choices) : [])
  const question = sourceQuestion.type === 'choice' && shuffledChoices.length ? { ...sourceQuestion, choices: shuffledChoices } : sourceQuestion
  useEffect(() => {
    setShuffledWords(question.type === 'reorder' ? shuffleDifferent(question.words) : [])
  }, [question.id, question.type])
  useEffect(() => {
    setShuffledChoices(sourceQuestion.type === 'choice' ? shuffleDifferent(sourceQuestion.choices) : [])
  }, [sourceQuestion.id, sourceQuestion.type])
  const wordSource = shuffledWords.length ? shuffledWords : question.words
  const remainingWords = question.type === 'reorder' ? wordSource.filter((word, wordIndex) => {
    const usedCount = tokens.filter((token) => token === word).length
    const priorCount = wordSource.slice(0, wordIndex).filter((item) => item === word).length
    return usedCount < priorCount + 1
  }) : []
  const questionNumber = String(index + 1).padStart(2, '0')
  return <article className="question-card">
    <div className="question-head"><div><div className="lesson-label">{question.lesson} <span>•</span> {question.topic}</div><div className="question-type">{question.practiceOnly ? 'REVIEW' : 'QUESTION'} {questionNumber}</div></div><div className="progress-block"><span>{index + 1} / {queue.length}</span><div className="progress-track"><span style={{ width: `${((index + 1) / queue.length) * 100}%` }} /></div></div></div>
    <div className="question-body"><p className="prompt">{question.prompt}</p>{question.type === 'input' && getQuestionTranslation(question) && <p className="japanese-prompt input-translation"><span>日本語訳</span>{getQuestionTranslation(question)}</p>}{question.type !== 'input' && question.japanese && <p className="japanese-prompt">{question.japanese}</p>}{question.sentence && <p className="sentence">{renderSentence(question.sentence, question.inputPrefix)}</p>}
      {question.type === 'choice' && <div className="choices">{question.choices.map((choice, choiceIndex) => <button type="button" key={choice} className={`choice-button ${selected === choice ? 'chosen' : ''} ${submitted && isCorrectAnswer(question, choice) ? 'correct-choice' : ''} ${submitted && selected === choice && !isCorrectAnswer(question, selected) ? 'wrong-choice' : ''}`} onClick={() => !submitted && setSelected(choice)}><span className="choice-letter">{String.fromCharCode(65 + choiceIndex)}</span><span>{choice}</span>{submitted && isCorrectAnswer(question, choice) && <Icon name="check" size={19} />}</button>)}</div>}
      {question.type === 'reorder' && <div className="reorder-area"><div className={`answer-line ${submitted ? (submitted.correct ? 'answer-correct' : 'answer-wrong') : ''}`}>{tokens.length ? tokens.map((token, tokenIndex) => <button type="button" key={`${token}-${tokenIndex}`} className="token selected-token" onClick={() => removeWord(tokenIndex)}>{token}</button>) : <span className="answer-placeholder">ここに語句を並べます</span>}</div><div className="word-bank">{remainingWords.map((word, wordIndex) => <button type="button" key={`${word}-${wordIndex}`} className="token" onClick={() => useWord(word)}>{word}</button>)}</div></div>}
      {question.type === 'input' && <InputAnswerFields question={question} inputParts={inputParts} setInputParts={setInputParts} submit={submit} submitted={submitted} />}
      {submitted && <Feedback question={question} result={submitted} onRetry={() => retryAnswer(question.id)} />}
    </div>
    <div className="question-actions"><button type="button" className="primary-button" onClick={submitted ? nextQuestion : submit} disabled={submitting}>{submitted ? (index === queue.length - 1 ? '結果を見る' : '次の問題へ') : submitting ? '共有中…' : '答えを確定する'}<Icon name="arrow" size={21} /></button>{submitted && <button type="button" className="secondary-button" onClick={() => document.getElementById('explanation')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}><Icon name="document" size={18} />解説を見る</button>}</div>
  </article>
}

function InputAnswerFields({ question, inputParts, setInputParts, submit, submitted }) {
  const slotCount = inputSlotCount(question)
  const updatePart = (slotIndex, value) => {
    setInputParts((current) => {
      const next = [...current]
      next[slotIndex] = value
      return next
    })
  }

  return <div className={`input-wrap ${slotCount > 1 ? 'input-wrap-multi' : ''} ${submitted ? (submitted.correct ? 'input-correct' : 'input-wrong') : ''}`}>
    {Array.from({ length: slotCount }, (_, slotIndex) => <input
      key={slotIndex}
      aria-label={`空欄${slotIndex + 1}`}
      value={inputParts[slotIndex] || ''}
      onChange={(event) => updatePart(slotIndex, event.target.value)}
      onKeyDown={(event) => { if (event.key === 'Enter' && slotIndex === slotCount - 1) submit() }}
      placeholder={slotCount > 1 ? `語${slotIndex + 1}` : '解答を入力'}
      disabled={Boolean(submitted)}
      autoComplete="off"
    />)}
    <span>{slotCount > 1 ? `${slotCount}語` : '語'}</span>
  </div>
}

function renderSentence(sentence = '') {
  if (!sentence) return null
  return sentence.split(/(\(\s*\u3000+\s*\)|\uFF08\s*\u3000+\s*\uFF09|_{2,})/g).map((part, index) => isBlankPlaceholder(part) ? <span key={index} className="sentence-blank">　</span> : <span key={index}>{part}</span>)
}

function Feedback({ question, result, onRetry }) {
  const syncCopy = result.syncStatus === 'not-rated' ? '復習問題（レート変動なし）' : result.syncStatus === 'pending' ? '保存待ち（次の問題へ進めます）' : result.syncStatus === 'blocked' ? '不適切な表現のため保存されませんでした' : result.syncStatus === 'error' ? '保存できませんでした' : result.syncStatus === 'synced' || result.syncStatus === 'duplicate' ? 'レート保存済み' : ''
  return <div id="explanation" className={`feedback ${result.correct ? 'feedback-correct' : 'feedback-wrong'}`}><div className="feedback-title"><span className="feedback-icon"><Icon name={result.correct ? 'check' : 'close'} size={17} /></span><strong>{result.correct ? '正解です' : '今回は不正解'}</strong><span className="feedback-delta">{result.delta > 0 ? `レート +${result.delta}` : `レート ${result.delta}`}</span></div>{syncCopy && <div className={`feedback-sync ${result.syncStatus === 'error' ? 'is-error' : ''}`}><span>{syncCopy}</span>{result.syncStatus === 'error' && <button type="button" onClick={onRetry}>この問題を再送</button>}</div>}<div className="correction"><span>正答</span><strong>{result.correctAnswer}</strong></div>{question.translation && question.type !== 'input' && <div className="translation"><span>日本語訳</span><p>{question.translation}</p></div>}<p>{question.explanation}</p><small>{question.source}</small></div>
}

function CompleteCard({ score, queue, reviews, course, studentName, ratingStart, ratingAfter, provisionalRating, completedAt, restart }) {
  const percentage = score.answered ? Math.round((score.correct / score.answered) * 100) : 0
  const [showReview, setShowReview] = useState(false)
  return <>
    <article className="complete-card"><div className="complete-icon"><Icon name="check" size={32} /></div><p className="section-kicker">SESSION COMPLETE</p><h2>今日の{queue.length}問、完了。</h2><div className="result-grid"><div><span>正答数</span><strong>{score.correct} / {queue.length}</strong></div><div><span>正答率</span><strong>{percentage}%</strong></div><div><span>学習モード</span><strong>{course.name}</strong></div></div><div className="complete-actions"><button type="button" className="primary-button" onClick={restart}>続きを解く<Icon name="arrow" size={21} /></button><button type="button" className="secondary-button" onClick={() => setShowReview((current) => !current)}><Icon name="history" size={19} />{showReview ? '復習を閉じる' : '復習する'}</button><SessionPdfPicker {...{ reviews, course, studentName, ratingStart, ratingAfter, completedAt }} /></div><p className="complete-actions-help">「続きを解く」は新しい10問を始めます。今回の問題を見直すときは「復習する」を選んでください。</p></article>
    {showReview && <section className="session-review"><div className="session-review-head"><div><p className="section-kicker">SESSION REVIEW</p><h2>今回の{reviews.length}問を復習する</h2><p>解いた問題の正答・日本語訳・解説をまとめています。</p></div><div className="session-review-meta"><span>{formatJapaneseDate(completedAt)}</span><strong>{studentName}</strong><small>確定レート {ratingStart.toLocaleString()} → {ratingAfter.toLocaleString()}</small>{provisionalRating !== ratingAfter && <small>暫定レート {provisionalRating.toLocaleString()}</small>}</div></div><div className="review-list">{reviews.map((review, index) => <ReviewItem key={review.id || `${review.question.id}-${index}`} review={review} index={index} />)}</div></section>}
  </>
}

function ReviewItem({ review, index }) {
  const { question } = review
  const translation = getQuestionTranslation(question)
  return <article className={`review-item ${review.correct ? 'review-correct' : 'review-wrong'}`}><div className="review-item-head"><div><span className="review-number">QUESTION {String(index + 1).padStart(2, '0')}</span><strong>{question.lesson} ・ {question.topic}</strong></div><span className="review-result">{review.correct ? '正解' : '不正解'}</span></div><p className="review-prompt">{question.prompt}</p>{question.sentence && <p className="review-sentence">{renderSentence(question.sentence)}</p>}{question.type === 'reorder' && <p className="review-sentence review-reorder">並べ替え：{question.words.join(' / ')}</p>}<div className="review-answers"><div><span>あなたの解答</span><strong>{review.userAnswer || '（未回答）'}</strong></div><div><span>正答</span><strong>{review.correctAnswer}</strong></div></div>{translation && <div className="review-translation"><span>日本語訳</span><p>{translation}</p></div>}<div className="review-explanation"><span>解説</span><p>{question.explanation}</p></div><small>{question.source}</small></article>
}

function formatJapaneseDate(value) {
  const date = value ? new Date(value) : new Date()
  return new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }).format(date)
}

function SessionPdfPicker({ reviews = [], course, studentName, ratingStart, ratingAfter, completedAt }) {
  const [open, setOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [printReviews, setPrintReviews] = useState(null)
  const reviewKey = (review, index) => review.id || `${review.question.id}-${index}`
  const selectedReviews = reviews.filter((review, index) => selectedIds.includes(reviewKey(review, index)))

  useEffect(() => {
    if (!printReviews?.length) return undefined
    const originalTitle = document.title
    const datePart = (completedAt || new Date().toISOString()).slice(0, 10)
    document.title = `Grammar Arena_${studentName || 'student'}_${datePart}`
    const printTimer = window.setTimeout(() => window.print(), 60)
    const cleanupTimer = window.setTimeout(() => {
      document.title = originalTitle
      setPrintReviews(null)
    }, 1000)
    return () => {
      window.clearTimeout(printTimer)
      window.clearTimeout(cleanupTimer)
      document.title = originalTitle
    }
  }, [completedAt, printReviews, studentName])

  const openPicker = () => {
    setSelectedIds(reviews.map(reviewKey))
    setOpen(true)
  }
  const toggleReview = (reviewId) => {
    setSelectedIds((current) => current.includes(reviewId) ? current.filter((id) => id !== reviewId) : [...current, reviewId])
  }
  const selectedScore = { correct: selectedReviews.filter((review) => review.correct).length, answered: selectedReviews.length }

  return <>
    <button type="button" className="secondary-button pdf-picker-trigger" onClick={openPicker} disabled={!reviews.length}><Icon name="document" size={19} />PDFを選ぶ</button>
    {open && <div className="pdf-picker" role="dialog" aria-modal="true" aria-label="PDFにする問題を選択"><div className="pdf-picker-head"><div><p className="section-kicker">PDF EXPORT</p><h3>出力する問題を選択</h3><p>必要な問題だけにチェックを入れてPDF化できます。</p></div><button type="button" className="pdf-picker-close" onClick={() => setOpen(false)} aria-label="閉じる">×</button></div><div className="pdf-picker-actions"><button type="button" className="text-button" onClick={() => setSelectedIds(reviews.map(reviewKey))}>すべて選択</button><button type="button" className="text-button" onClick={() => setSelectedIds([])}>すべて解除</button><span>{selectedReviews.length} / {reviews.length}問を選択中</span></div><div className="pdf-picker-list">{reviews.map((review, index) => { const id = reviewKey(review, index); return <label key={id} className="pdf-picker-row"><input type="checkbox" checked={selectedIds.includes(id)} onChange={() => toggleReview(id)} /><span>QUESTION {String(index + 1).padStart(2, '0')}</span><strong>{review.question.lesson} ・ {review.question.topic}</strong><small>{review.correct ? '正解' : '不正解'}</small></label> })}</div><div className="pdf-picker-footer"><button type="button" className="secondary-button" onClick={() => setOpen(false)}>キャンセル</button><button type="button" className="primary-button" disabled={!selectedReviews.length} onClick={() => { setOpen(false); setPrintReviews(selectedReviews) }}><Icon name="document" size={19} />選択した{selectedReviews.length}問をPDF出力</button></div></div>}
    {printReviews?.length > 0 && <SessionPrintView reviews={printReviews} score={selectedScore} course={course} studentName={studentName} ratingStart={ratingStart} ratingAfter={ratingAfter} completedAt={completedAt} />}
  </>
}

function SessionPrintView({ reviews, score, course, studentName, ratingStart, ratingAfter, completedAt }) {
  const percentage = score.answered ? Math.round((score.correct / score.answered) * 100) : 0
  return <section className="print-sheet"><header className="print-header"><p>GRAMMAR ARENA / SESSION REVIEW</p><h1>{course.label} ・ {course.name}</h1><div className="print-meta"><div><span>年月日</span><strong>{formatJapaneseDate(completedAt)}</strong></div><div><span>名前</span><strong>{studentName}</strong></div><div><span>正答数</span><strong>{score.correct} / {score.answered}</strong></div><div><span>正答率</span><strong>{percentage}%</strong></div><div><span>レート</span><strong>{ratingStart.toLocaleString()} → {ratingAfter.toLocaleString()}</strong></div></div></header><div className="print-list">{reviews.map((review, index) => <ReviewItem key={review.id || `${review.question.id}-${index}`} review={review} index={index} />)}</div><footer className="print-footer">GRAMMAR ARENA / {course.label} ・ {course.name}</footer></section>
}

function DailyRail({ correct, answered, seconds, history, rating }) {
  const incorrect = Math.max(0, answered - correct)
  const rate = answered ? `${Math.round((correct / answered) * 100)}%` : '—'
  const minutes = `${Math.max(1, Math.round(seconds / 60))}分`
  return <aside className="daily-rail"><div className="rail-card"><div className="rail-title"><Icon name="calendar" size={21} /><h2>今日の記録</h2><span className="study-stamp">STUDY</span></div><div className="metric-list"><Metric icon="check" label="正解数" value={correct} /><Metric icon="close" label="不正解数" value={incorrect} /><Metric icon="chart" label="正答率" value={rate} /><Metric icon="clock" label="学習時間" value={minutes} /></div><div className="rail-divider" /><h3>レートの推移</h3><RatingChart history={history} rating={rating} /></div><div className="rail-note"><Icon name="chart" size={25} /><p>コツコツ積み重ねて、<br />もっと高いレベルへ。</p></div></aside>
}

function PublicLeaderboard({ players = [], currentName = '', courseLabel = '基礎講座', poolLabel: rankingLabel = '基礎講座', limit = 5, onOpen }) {
  const visiblePlayers = players.length ? players.slice(0, limit) : [{ name: 'まだ参加者はいません', rating: '—', answered: 0 }]
  return <section className="leaderboard-card"><div className="leaderboard-head"><div><span className="section-kicker">PUBLIC RATE / {rankingLabel}</span><h2>みんなのレート</h2></div><span className="leaderboard-live">LIVE</span></div><p className="leaderboard-copy">{courseLabel}・{rankingLabel}に参加している生徒の現在レート</p><div className="leaderboard-list">{visiblePlayers.map((player, index) => <div className={`leaderboard-row ${player.name === currentName ? 'current' : ''}`} key={`${player.name}-${index}`}><span className="leaderboard-rank">{String(index + 1).padStart(2, '0')}</span><span className="leaderboard-name">{player.name}</span><strong>{typeof player.rating === 'number' ? player.rating.toLocaleString() : player.rating}</strong></div>)}</div>{onOpen && <button type="button" className="leaderboard-link" onClick={onOpen}>全体ランキングを見る <Icon name="arrow" size={16} /></button>}</section>
}

function LeaderboardView({ course, players = [], rating, studentName, rankingPoolId, refresh, notice }) {
  return <div className="leaderboard-page">
    <div className="leaderboard-page-head"><div><p className="section-kicker">PUBLIC RATEBOARD / {poolLabel(rankingPoolId)}</p><h1>{course.label}・{poolLabel(rankingPoolId)}のランキング</h1><p className="subcopy">講座と所属プールを切り替えて、生徒のレートを確認できます。</p></div><button type="button" className="secondary-button leaderboard-refresh" onClick={refresh}><Icon name="history" size={18} />ランキングを更新</button></div>
    {notice && <div className="app-notice" role="status">{notice}</div>}
    <div className="leaderboard-overview"><div className="leaderboard-you"><span>YOUR RATE</span><strong>{rating.toLocaleString()}</strong><small>{studentName ? `${studentName} の現在レート` : '名前を入力すると参加できます'}</small></div><div className="leaderboard-rule"><span>RANKING RULE</span><strong>正答で上昇 / 不正解で下降</strong><small>同じ問題も、解答するたびにレートへ反映されます。</small></div></div>
    <section className="leaderboard-table-card"><div className="leaderboard-table-head"><h2>参加者一覧</h2><span>{players.length ? `${players.length}人` : '共有データなし'}</span></div>{players.length ? <div className="leaderboard-table"><div className="leaderboard-table-row leaderboard-table-label"><span>RANK</span><span>PLAYER</span><span>ANSWERED（自分のみ）</span><span>RATE</span></div>{players.map((player, index) => <div className={`leaderboard-table-row ${player.name === studentName ? 'current' : ''}`} key={`${player.name}-${index}`}><strong>{String(index + 1).padStart(2, '0')}</strong><span>{player.name}</span><span>{player.name === studentName && Number.isFinite(Number(player.answered)) ? player.answered : '—'}</span><strong>{typeof player.rating === 'number' ? player.rating.toLocaleString() : player.rating}</strong></div>)}</div> : <div className="leaderboard-empty"><Icon name="leaderboard" size={34} /><h3>まだ共有ランキングがありません。</h3><p>共有サーバーに接続すると、所属プールのレートがここに表示されます。</p></div>}</section>
  </div>
}

function Metric({ icon, label, value }) {
  return <div className="metric-row"><span className={`metric-icon metric-${icon}`}><Icon name={icon} size={16} /></span><span>{label}</span><strong>{value}</strong></div>
}

function RatingChart({ history, rating }) {
  const model = buildRatingChartModel(history, rating)
  return <div className="rating-chart"><svg viewBox="0 0 280 130" role="img" aria-label={`レートの推移。現在${model.currentRating.toLocaleString()}レート`}><path d="M30 10v100h238" className="chart-axis" />{model.grid.map((line) => <path key={line.value} d={line.path} className="chart-grid" />)}<path d={model.areaPath} className="chart-area" /><path d={model.linePath} className="chart-line" />{model.points.map((point, index) => <circle key={`${point.x}-${point.y}-${index}`} cx={point.x} cy={point.y} r="4.5" className="chart-dot" />)}{model.labels.map((label, index) => <text key={label.value} x="0" y={index === 0 ? 12 : index === 1 ? 62 : 114}>{label.text}</text>)}</svg></div>
}

function HistoryView({ history, rating }) {
  return <div className="simple-view"><div className="section-heading"><div><p className="section-kicker">YOUR PROGRESS</p><h1>学習履歴</h1><p className="subcopy">解いた記録を見返して、伸び方をつかもう。</p></div><div className="history-current"><span>現在レート</span><strong>{rating.toLocaleString()}</strong></div></div><div className="history-panel"><div className="history-panel-head"><h2>最近のセッション</h2><span>{history.length}件</span></div>{history.length ? <div className="history-list">{history.map((item) => <div className="history-row" key={item.id}><div className="history-date"><span>{item.date.replaceAll('-', '.')}</span><strong>{item.label}</strong></div><div className="history-result"><strong>{item.correct} / {item.total}</strong><span>正答</span></div><div className="history-change"><strong className={item.ratingDelta >= 0 ? 'up' : 'down'}>{item.ratingDelta >= 0 ? '+' : ''}{item.ratingDelta}</strong><span>レート変動</span></div><div className="history-after"><span>終了時</span><strong>{item.ratingAfter.toLocaleString()}</strong></div></div>)}</div> : <div className="empty-history"><Icon name="history" size={34} /><h3>まだ履歴がありません。</h3><p>演習を終えると、ここにレートと正答数が記録されます。</p></div>}</div></div>
}

function ThemeUnlockOverlay({ themeId, onClose }) {
  const theme = THEME_OPTIONS.find((option) => option.id === themeId) || THEME_OPTIONS[0]
  const headline = `${theme.label} unlocked`
  const message = themeId === 'crystallium' ? 'A new realm has crystallized around your progress.' : 'The night mode has answered your call.'
  return <div className={`theme-unlock-overlay theme-unlock-${themeId}`} role="dialog" aria-modal="true" aria-label={headline}><div className="theme-unlock-card"><span className="theme-unlock-kicker">SECRET THEME UNLOCKED</span><span className="theme-unlock-symbol" aria-hidden="true">✦</span><h2>{headline}</h2><p>{message}</p><button type="button" className="theme-unlock-button" onClick={onClose}>ENTER THEME <span aria-hidden="true">→</span></button></div></div>
}

function SettingsView({ filter, setFilter, autoExplanation, setAutoExplanation, themeId, setThemeId, hasSession, unlockedThemes }) {
  const availableThemes = THEME_OPTIONS.filter((theme) => theme.id === DEFAULT_THEME_ID || (hasSession && normalizeUnlockedThemes(unlockedThemes).includes(theme.id)))
  return <div className="simple-view"><div className="section-heading"><div><p className="section-kicker">SETTINGS</p><h1>設定</h1><p className="subcopy">出題レベル、表示方法、テーマを自分の学習スタイルに合わせて変更できます。</p></div></div><div className="settings-grid"><section className="settings-panel"><h2>テーマ変更</h2><p>演習画面の色と雰囲気を切り替えます。解放したテーマはこのアカウントに保存されます。</p><div className="theme-options" role="radiogroup" aria-label="テーマ変更">{availableThemes.map((theme) => <button type="button" role="radio" aria-checked={theme.id === themeId} key={theme.id} className={`theme-option theme-option-${theme.id} ${theme.id === themeId ? 'selected' : ''}`} onClick={() => setThemeId(theme.id)}><span className="theme-preview" aria-hidden="true"><span /></span><span className="theme-option-copy"><strong>{theme.label}</strong><small>{theme.description}</small></span><span className="theme-radio" aria-hidden="true" /></button>)}</div></section><section className="settings-panel"><h2>出題レベル</h2><p>演習画面のタブからいつでも変更できます。</p><div className="settings-options">{Object.entries(DIFFICULTY).map(([key, value]) => <button type="button" key={key} className={`setting-option ${filter === key ? 'selected' : ''}`} onClick={() => setFilter(key)}><span className="setting-radio" /> <span><strong>{value.label}</strong><small>{key === 'all' ? 'Lesson 13〜15・Plus' : key === 'starter' ? 'まずは基本から' : key === 'standard' ? '使い分けを練習' : '一歩進んだ表現'}</small></span></button>)}</div></section><section className="settings-panel settings-panel-display"><h2>学習の表示</h2><p>解答後の画面の見え方を設定します。</p><label className="toggle-row"><span><strong>解説を自動で表示</strong><small>正誤判定のあとに解説を開きます</small></span><button type="button" className={`toggle ${autoExplanation ? 'on' : ''}`} aria-pressed={autoExplanation} onClick={() => setAutoExplanation(!autoExplanation)}><span /></button></label><div className="rule-note"><Icon name="document" size={19} /><span>正答数に応じてレートが変動し、履歴に保存されます。</span></div></section></div></div>
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
