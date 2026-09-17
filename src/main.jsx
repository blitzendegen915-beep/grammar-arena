import { StrictMode, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const STORAGE_KEY = 'grammar-arena-v1'
const SCORE_API_URL = import.meta.env.VITE_SCORE_API_URL || 'https://script.google.com/macros/s/AKfycbw0HAcZcaqv8vRsU4uz02rKB7-jdsWM-xZrNwlHTlEyGOEdCSTWnaDBlqCuCv4Ho8AelQ/exec'
const DEFAULT_RATING = 1240
const SESSION_LENGTH = 10

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
  { id: 'foundation-gerund', label: '基礎講座 - 動名詞', available: false },
  { id: 'foundation-participles', label: '基礎講座 - 分詞', available: false },
]

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
    if (!raw) return { rating: DEFAULT_RATING, streak: 0, history: [], autoExplanation: true, studentName: '', authToken: '', answeredIds: [], publicLeaderboard: [] }
    return { rating: DEFAULT_RATING, streak: 0, history: [], autoExplanation: true, studentName: '', authToken: '', answeredIds: [], publicLeaderboard: [], ...JSON.parse(raw) }
  } catch { return { rating: DEFAULT_RATING, streak: 0, history: [], autoExplanation: true, studentName: '', authToken: '', answeredIds: [], publicLeaderboard: [] } }
}

function normalize(value = '') {
  return value.trim().toLowerCase().replace(/[’']/g, "'").replace(/[。．,，!！?？]/g, '').replace(/\s+/g, ' ')
}

function cleanStudentName(value = '') {
  return value.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 20)
}

async function hashPin(pin) {
  const bytes = new TextEncoder().encode(pin)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function requestScoreApi(params) {
  if (!SCORE_API_URL) return Promise.reject(new Error('score-api-not-configured'))
  const query = new URLSearchParams(params).toString()
  return fetch(`${SCORE_API_URL}?${query}`, { cache: 'no-store' }).then((response) => {
    if (!response.ok) throw new Error('score-api-response')
    return response.json()
  })
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

function buildQueue(filter, answeredIds = []) {
  const available = QUESTIONS.filter((question) => !answeredIds.includes(question.id))
  if (filter === 'all') return shuffle(available).slice(0, SESSION_LENGTH)
  const preferred = shuffle(available.filter((question) => question.difficulty === filter))
  const supplemental = shuffle(available.filter((question) => question.difficulty !== filter))
  return [...preferred, ...supplemental].slice(0, SESSION_LENGTH)
}

function App() {
  const [persisted, setPersisted] = useState(readPersisted)
  const [view, setView] = useState(() => {
    const initial = readPersisted()
    return initial.studentName && initial.authToken ? 'lobby' : 'landing'
  })
  const [modeId, setModeId] = useState('foundation-infinitive')
  const [filter, setFilter] = useState('all')
  const [queue, setQueue] = useState(() => {
    const initial = readPersisted()
    return buildQueue('all', initial.answeredIds)
  })
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState('')
  const [tokens, setTokens] = useState([])
  const [input, setInput] = useState('')
  const [submitted, setSubmitted] = useState(null)
  const [sessionScore, setSessionScore] = useState({ correct: 0, answered: 0 })
  const [sessionRatingStart, setSessionRatingStart] = useState(persisted.rating)
  const [todaySeconds, setTodaySeconds] = useState(25 * 60)
  const [submitting, setSubmitting] = useState(false)
  const [notice, setNotice] = useState('')
  const [authMode, setAuthMode] = useState('login')
  const [authName, setAuthName] = useState(() => readPersisted().studentName || '')
  const [authPin, setAuthPin] = useState('')
  const [authBusy, setAuthBusy] = useState(false)

  const question = queue[index]
  const isComplete = !question
  const hasSession = Boolean(cleanStudentName(persisted.studentName) && persisted.authToken)
  const student = { name: hasSession ? persisted.studentName : '未ログイン', grade: hasSession ? 'STUDENT' : 'NAME REQUIRED' }

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted))
  }, [persisted])

  useEffect(() => {
    const timer = window.setInterval(() => setTodaySeconds((seconds) => seconds + 1), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const todaySessions = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    return persisted.history.filter((item) => item.date === today)
  }, [persisted.history])

  const todayAnswered = todaySessions.reduce((sum, item) => sum + item.total, 0) + sessionScore.answered
  const todayCorrect = todaySessions.reduce((sum, item) => sum + item.correct, 0) + sessionScore.correct
  const todayRate = todayAnswered ? Math.round((todayCorrect / todayAnswered) * 100) : 0

  const submitAuth = async () => {
    const name = cleanStudentName(authName)
    if (!name) {
      setNotice('生徒名を入力してください。')
      return
    }
    if (!/^\d{4,8}$/.test(authPin)) {
      setNotice('暗証番号は4〜8桁の数字で設定してください。')
      return
    }
    setAuthBusy(true)
    setNotice('')
    try {
      const pinHash = await hashPin(authPin)
      const result = await requestScoreApi({ action: authMode, course: modeId, name, pinHash })
      if (!result.ok) {
        const messages = {
          'already-registered': 'この生徒名は登録済みです。ログインを選んでください。',
          'not-found': '登録されていない生徒名です。初回登録を選んでください。',
          'not-registered': 'この生徒名には暗証番号が設定されていません。初回登録を選んでください。',
          'wrong-pin': '暗証番号が一致しません。',
        }
        setNotice(messages[result.reason] || 'ログインできませんでした。入力内容を確認してください。')
        return
      }
      if (!result.authToken) {
        setNotice('ログイン情報を受け取れませんでした。管理者がApps Scriptを更新してから再試行してください。')
        return
      }
      setPersisted((current) => ({
        ...current,
        studentName: result.name,
        authToken: result.authToken,
        rating: Number(result.rating) || DEFAULT_RATING,
        answeredIds: Array.isArray(result.answeredIds) ? result.answeredIds : [],
        publicLeaderboard: Array.isArray(result.players) ? result.players : current.publicLeaderboard,
      }))
      setAuthName(result.name)
      setAuthPin('')
      setSessionRatingStart(Number(result.rating) || DEFAULT_RATING)
      setNotice('')
      setView('lobby')
    } catch {
      setNotice('共有サーバーに接続できませんでした。時間をおいて再試行してください。')
    } finally {
      setAuthBusy(false)
    }
  }

  const restart = (nextFilter = filter) => {
    setFilter(nextFilter)
    setQueue(buildQueue(nextFilter, persisted.answeredIds))
    setIndex(0)
    setSelected('')
    setTokens([])
    setInput('')
    setSubmitted(null)
    setSessionScore({ correct: 0, answered: 0 })
    setSessionRatingStart(persisted.rating)
    setNotice('')
    setView(hasSession ? 'practice' : 'landing')
  }

  const selectNav = (nextView) => {
    if (['practice', 'history', 'settings'].includes(nextView) && !hasSession) {
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
    restart('all')
    setView('practice')
  }

  const refreshLeaderboard = async () => {
    if (!SCORE_API_URL) {
      setNotice('共有ランキングはサーバー接続後に表示されます。')
      return
    }
    try {
      const data = await requestScoreApi({ action: 'leaderboard', course: modeId })
      if (data.ok && Array.isArray(data.players)) setPersisted((current) => ({ ...current, publicLeaderboard: data.players }))
    } catch {
      setNotice('公開ランキングを読み込めませんでした。')
    }
  }

  useEffect(() => {
    if (SCORE_API_URL) refreshLeaderboard()
  }, [modeId])

  const currentAnswer = () => {
    if (question.type === 'reorder') return tokens.join(' ')
    if (question.type === 'input') return input
    return selected
  }

  const submit = async () => {
    if (submitted || submitting) return
    if (!hasSession) {
      setNotice('先にログインしてください。')
      setView('landing')
      return
    }
    const userAnswer = currentAnswer()
    if (!userAnswer.trim()) return
    const correct = question.type === 'input'
      ? question.accepted.some((answer) => normalize(answer) === normalize(userAnswer))
      : normalize(userAnswer) === normalize(question.answer)
    const delta = correct ? RATING_POINTS[question.difficulty] : -RATING_LOSS[question.difficulty]
    setSubmitting(true)
    setNotice('')
    let nextRating = Math.max(800, persisted.rating + delta)
    let serverDelta = delta
    if (SCORE_API_URL) {
      try {
        const params = new URLSearchParams({
          action: 'answer',
          course: modeId,
          name: cleanStudentName(persisted.studentName),
          authToken: persisted.authToken,
          questionId: question.id,
          correct: String(correct),
          delta: String(delta),
        })
        const result = await requestScoreApi(Object.fromEntries(params.entries()))
        if (!result.ok && result.reason === 'already-answered') {
          setPersisted((current) => ({ ...current, answeredIds: [...new Set([...current.answeredIds, question.id])] }))
          setNotice('この問題はすでに回答済みです。次の問題へ進みます。')
          setSubmitting(false)
          return
        }
        if (!result.ok && result.reason === 'invalid-session') {
          setPersisted((current) => ({ ...current, authToken: '' }))
          setNotice('ログインの有効期限が切れました。もう一度ログインしてください。')
          setView('landing')
          setSubmitting(false)
          return
        }
        if (!result.ok) throw new Error('score-api')
        nextRating = result.rating
        serverDelta = result.delta
        if (Array.isArray(result.players)) setPersisted((current) => ({ ...current, publicLeaderboard: result.players }))
      } catch {
        setNotice('共有サーバーに接続できないため、この回答は保存されていません。再試行してください。')
        setSubmitting(false)
        return
      }
    }
    setPersisted((current) => ({ ...current, rating: nextRating, streak: correct ? current.streak + 1 : 0 }))
    setPersisted((current) => ({ ...current, answeredIds: [...new Set([...current.answeredIds, question.id])] }))
    setSessionScore((score) => ({ correct: score.correct + (correct ? 1 : 0), answered: score.answered + 1 }))
    setSubmitted({ correct, userAnswer, delta: serverDelta, correctAnswer: question.answerLabel })
    setSubmitting(false)
  }

  const nextQuestion = () => {
    if (index === queue.length - 1) {
      const session = {
        id: `${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        label: filter === 'all' ? 'ミックス演習' : `${DIFFICULTY[filter].label}演習`,
        correct: sessionScore.correct,
        total: sessionScore.answered,
        ratingDelta: persisted.rating - sessionRatingStart,
        ratingAfter: persisted.rating,
      }
      setPersisted((current) => ({ ...current, history: [session, ...current.history].slice(0, 20) }))
      setIndex(index + 1)
      return
    }
    setIndex((current) => current + 1)
    setSelected('')
    setTokens([])
    setInput('')
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
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark"><Icon name="practice" size={30} /></div>
          <div><div className="brand-name">GRAMMAR</div><div className="brand-name">ARENA</div></div>
        </div>
        <nav className="main-nav" aria-label="メインナビゲーション">
          <NavItem icon="practice" label="演習" active={view === 'practice' || view === 'landing' || view === 'lobby'} onClick={() => selectNav('practice')} />
          <NavItem icon="leaderboard" label="ランキング" active={view === 'leaderboard'} onClick={() => selectNav('leaderboard')} />
          <NavItem icon="history" label="履歴" active={view === 'history'} onClick={() => selectNav('history')} />
          <NavItem icon="settings" label="出題設定" active={view === 'settings'} onClick={() => selectNav('settings')} />
        </nav>
        <div className="sidebar-footer"><div className="footer-line" /><div className="footer-message"><span className="footer-cap">◆</span><span>学びが、未来をつくる。</span></div></div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="top-stat"><Icon name="chart" size={28} /><div><span>現在レート</span><strong>{hasSession ? persisted.rating.toLocaleString() : '—'}</strong></div>{hasSession && <span className={`rating-delta ${submitted?.delta >= 0 ? 'positive' : ''}`}>{submitted ? `${submitted.delta >= 0 ? '▲ +' : '▼ '}${submitted.delta}` : '▲ +20'}</span>}</div>
          <div className="top-divider" />
          <div className="top-stat streak-stat"><Icon name="streak" size={27} /><div><span>連続正解</span><strong>{persisted.streak}</strong></div></div>
          <div className="topbar-spacer" />
          <div className="selector-stack name-stack"><label htmlFor="student-name">生徒</label><div id="student-name" className="name-display">{persisted.studentName || '未ログイン'}</div><span>{hasSession ? 'ログイン中 / ランキングに表示' : '暗証番号でログイン'}</span></div>
          <div className="selector-stack course-switcher"><label htmlFor="course-selector">講座</label><select id="course-selector" value={modeId} onChange={(event) => setModeId(event.target.value)}>{COURSE_MODES.map((course) => <option key={course.id} value={course.id} disabled={!course.available}>{course.label}</option>)}</select><span>他の単元は後日追加</span></div>
          <div className="profile-orb">{student.name.slice(0, 1)}</div>
        </header>

        <div className="content-wrap">
          {view === 'landing' && <LandingView {...{ authMode, setAuthMode, authName, setAuthName, authPin, setAuthPin, submitAuth, authBusy, notice, leaderboard: persisted.publicLeaderboard }} />}
          {view === 'lobby' && <LobbyView studentName={persisted.studentName} rating={persisted.rating} leaderboard={persisted.publicLeaderboard} startPractice={startPractice} openLeaderboard={() => setView('leaderboard')} />}
          {view === 'practice' && <PracticeView {...{ question, queue, index, filter, setFilter: restart, submitted, submit, nextQuestion, selected, setSelected, tokens, useWord, removeWord, input, setInput, answerPreview, isComplete, restart, sessionScore, todayCorrect, todayAnswered, todaySeconds, submitting, notice, leaderboard: persisted.publicLeaderboard, studentName: persisted.studentName, openLeaderboard: () => setView('leaderboard') }} />}
          {view === 'leaderboard' && <LeaderboardView players={persisted.publicLeaderboard} rating={persisted.rating} studentName={persisted.studentName} refresh={refreshLeaderboard} notice={notice} />}
          {view === 'history' && <HistoryView history={persisted.history} rating={persisted.rating} />}
          {view === 'settings' && <SettingsView filter={filter} setFilter={restart} autoExplanation={persisted.autoExplanation} setAutoExplanation={(value) => setPersisted((current) => ({ ...current, autoExplanation: value }))} />}
        </div>
      </main>
    </div>
  )
}

function LandingView({ authMode, setAuthMode, authName, setAuthName, authPin, setAuthPin, submitAuth, authBusy, notice, leaderboard }) {
  return <div className="landing-view">
    <div className="landing-layout">
      <section className="landing-hero">
        <div className="landing-eyebrow"><span className="landing-mark"><Icon name="practice" size={25} /></span><span>WELCOME TO GRAMMAR ARENA</span></div>
        <p className="section-kicker">FOUNDATION COURSE / UNIT 01</p>
        <h1>レートを確認して、<br /><em>対戦を始める。</em></h1>
        <p className="landing-copy">生徒名と暗証番号でログインすると、現在レートを確認してから基礎講座の10問対戦を始められます。</p>
        <div className="auth-tabs" role="tablist" aria-label="アカウント操作">
          <button type="button" className={authMode === 'login' ? 'selected' : ''} onClick={() => { setAuthMode('login'); setNotice('') }}>ログイン</button>
          <button type="button" className={authMode === 'register' ? 'selected' : ''} onClick={() => { setAuthMode('register'); setNotice('') }}>初回登録</button>
        </div>
        <form className="landing-form" onSubmit={(event) => { event.preventDefault(); submitAuth() }}>
          <label htmlFor="landing-student-name">生徒名</label>
          <input id="landing-student-name" value={authName} onChange={(event) => setAuthName(event.target.value)} placeholder="例：山田 太郎" maxLength={20} autoComplete="username" />
          <label htmlFor="landing-pin">暗証番号（4〜8桁）</label>
          <input id="landing-pin" type="password" inputMode="numeric" value={authPin} onChange={(event) => setAuthPin(event.target.value.replace(/\D/g, '').slice(0, 8))} placeholder="数字のみ" maxLength={8} autoComplete={authMode === 'login' ? 'current-password' : 'new-password'} />
          {notice && <p className="auth-notice" role="alert">{notice}</p>}
          <button type="submit" className="primary-button landing-start" disabled={authBusy}>{authBusy ? '確認中…' : authMode === 'login' ? 'ログインしてレート確認' : '登録してレート対戦へ'}<Icon name="arrow" size={21} /></button>
          <p className="landing-note">暗証番号は画面に表示されず、照合用の情報だけを保存します。各問題への回答は1つの名前につき1回までです。</p>
        </form>
      </section>
      <PublicLeaderboard players={leaderboard} currentName={authName} limit={5} />
    </div>
    <div className="landing-footer"><span>NOW PLAYING</span><strong>基礎講座 - 不定詞</strong><span className="landing-footer-muted">他の単元は後日追加予定</span></div>
  </div>
}

function LobbyView({ studentName, rating, leaderboard, startPractice, openLeaderboard }) {
  return <div className="lobby-view">
    <section className="lobby-card">
      <div className="landing-eyebrow"><span className="landing-mark"><Icon name="leaderboard" size={25} /></span><span>READY FOR RATED MATCH</span></div>
      <p className="section-kicker">WELCOME BACK / {studentName}</p>
      <h1>レート対戦の準備完了。</h1>
      <div className="lobby-rate"><span>YOUR CURRENT RATE</span><strong>{rating.toLocaleString()}</strong><small>{studentName} の現在レート</small></div>
      <button type="button" className="primary-button lobby-start" onClick={startPractice}>レート対戦を始める<Icon name="arrow" size={21} /></button>
    </section>
    <PublicLeaderboard players={leaderboard} currentName={studentName} limit={5} onOpen={openLeaderboard} />
  </div>
}

function NavItem({ icon, label, active, onClick }) {
  return <button type="button" className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}><Icon name={icon} size={22} /><span>{label}</span></button>
}

function PracticeView({ question, queue, index, filter, setFilter, submitted, submit, nextQuestion, selected, setSelected, tokens, useWord, removeWord, input, setInput, answerPreview, isComplete, restart, sessionScore, todayCorrect, todayAnswered, todaySeconds, submitting, notice, leaderboard, studentName, openLeaderboard }) {
  return <div className="practice-layout">
    <section className="practice-column">
      <div className="course-banner"><div><span className="course-banner-label">FOUNDATION COURSE</span><strong>基礎講座</strong><span className="course-banner-unit">UNIT 01 / 不定詞</span></div><span className="course-stamp">STUDY</span></div>
      <div className="section-heading"><div><p className="section-kicker">基礎講座 / 不定詞</p><h1>不定詞を、解いて、理解する。</h1><p className="session-hint">1セッション {SESSION_LENGTH}問 / {filter === 'all' ? '全レベルミックス' : `${DIFFICULTY[filter].label}を優先して出題`}</p></div><div className="difficulty-tabs" role="tablist" aria-label="難易度"><DifficultyTab value="all" current={filter} onClick={setFilter} label="すべて" /><DifficultyTab value="starter" current={filter} onClick={setFilter} label="基礎" /><DifficultyTab value="standard" current={filter} onClick={setFilter} label="標準" /><DifficultyTab value="advanced" current={filter} onClick={setFilter} label="発展" /></div></div>
      {notice && <div className="app-notice" role="status">{notice}</div>}
      {isComplete ? <CompleteCard score={sessionScore} queue={queue} restart={() => restart(filter)} /> : <QuestionCard {...{ question, queue, index, submitted, submit, nextQuestion, selected, setSelected, tokens, useWord, removeWord, input, setInput, answerPreview, submitting }} />}
    </section>
    <div className="right-column"><DailyRail correct={todayCorrect} answered={todayAnswered} seconds={todaySeconds} /><PublicLeaderboard players={leaderboard} currentName={studentName} onOpen={openLeaderboard} /></div>
  </div>
}

function DifficultyTab({ value, current, onClick, label }) {
  return <button type="button" className={`difficulty-tab ${current === value ? 'selected' : ''}`} onClick={() => onClick(value)}>{label}</button>
}

function QuestionCard({ question, queue, index, submitted, submit, nextQuestion, selected, setSelected, tokens, useWord, removeWord, input, setInput, answerPreview, submitting }) {
  const [shuffledWords, setShuffledWords] = useState(() => question.type === 'reorder' ? shuffleDifferent(question.words) : [])
  useEffect(() => {
    setShuffledWords(question.type === 'reorder' ? shuffleDifferent(question.words) : [])
  }, [question.id, question.type])
  const wordSource = shuffledWords.length ? shuffledWords : question.words
  const remainingWords = question.type === 'reorder' ? wordSource.filter((word, wordIndex) => {
    const usedCount = tokens.filter((token) => token === word).length
    const priorCount = wordSource.slice(0, wordIndex).filter((item) => item === word).length
    return usedCount < priorCount + 1
  }) : []
  const questionNumber = String(index + 1).padStart(2, '0')
  return <article className="question-card">
    <div className="question-head"><div><div className="lesson-label">{question.lesson} <span>•</span> {question.topic}</div><div className="question-type">QUESTION {questionNumber}</div></div><div className="progress-block"><span>{index + 1} / {queue.length}</span><div className="progress-track"><span style={{ width: `${((index + 1) / queue.length) * 100}%` }} /></div></div></div>
    <div className="question-body"><p className="prompt">{question.prompt}</p>{question.japanese && <p className="japanese-prompt">{question.japanese}</p>}{question.sentence && <p className="sentence">{renderSentence(question.sentence, question.inputPrefix)}</p>}
      {question.type === 'choice' && <div className="choices">{question.choices.map((choice, choiceIndex) => <button type="button" key={choice} className={`choice-button ${selected === choice ? 'chosen' : ''} ${submitted && choice === question.answer ? 'correct-choice' : ''} ${submitted && selected === choice && selected !== question.answer ? 'wrong-choice' : ''}`} onClick={() => !submitted && setSelected(choice)}><span className="choice-letter">{String.fromCharCode(65 + choiceIndex)}</span><span>{choice}</span>{submitted && choice === question.answer && <Icon name="check" size={19} />}</button>)}</div>}
      {question.type === 'reorder' && <div className="reorder-area"><div className={`answer-line ${submitted ? (submitted.correct ? 'answer-correct' : 'answer-wrong') : ''}`}>{tokens.length ? tokens.map((token, tokenIndex) => <button type="button" key={`${token}-${tokenIndex}`} className="token selected-token" onClick={() => removeWord(tokenIndex)}>{token}</button>) : <span className="answer-placeholder">ここに語句を並べます</span>}</div><div className="word-bank">{remainingWords.map((word, wordIndex) => <button type="button" key={`${word}-${wordIndex}`} className="token" onClick={() => useWord(word)}>{word}</button>)}</div></div>}
      {question.type === 'input' && <div className={`input-wrap ${submitted ? (submitted.correct ? 'input-correct' : 'input-wrong') : ''}`}><input aria-label="解答入力" value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') submit() }} placeholder="解答を入力" disabled={Boolean(submitted)} autoComplete="off" /><span>{question.answer.includes(' ') ? '語句' : '語'}</span></div>}
      {submitted && <Feedback question={question} result={submitted} />}
    </div>
    <div className="question-actions"><button type="button" className="primary-button" onClick={submitted ? nextQuestion : submit} disabled={submitting}>{submitted ? (index === queue.length - 1 ? '結果を見る' : '次の問題へ') : submitting ? '共有中…' : '答えを確定する'}<Icon name="arrow" size={21} /></button>{submitted && <button type="button" className="secondary-button" onClick={() => document.getElementById('explanation')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}><Icon name="document" size={18} />解説を見る</button>}</div>
  </article>
}

function renderSentence(sentence = '') {
  if (!sentence) return null
  return sentence.split(/(\(　　　\)|______)/g).map((part, index) => part.includes('　　　') || part === '______' ? <span key={index} className="sentence-blank">　</span> : <span key={index}>{part}</span>)
}

function Feedback({ question, result }) {
  return <div id="explanation" className={`feedback ${result.correct ? 'feedback-correct' : 'feedback-wrong'}`}><div className="feedback-title"><span className="feedback-icon"><Icon name={result.correct ? 'check' : 'close'} size={17} /></span><strong>{result.correct ? '正解です' : '今回は不正解'}</strong><span className="feedback-delta">{result.delta > 0 ? `レート +${result.delta}` : `レート ${result.delta}`}</span></div><div className="correction"><span>正答</span><strong>{result.correctAnswer}</strong></div><p>{question.explanation}</p><small>{question.source}</small></div>
}

function CompleteCard({ score, queue, restart }) {
  const percentage = score.answered ? Math.round((score.correct / score.answered) * 100) : 0
  return <article className="complete-card"><div className="complete-icon"><Icon name="check" size={32} /></div><p className="section-kicker">SESSION COMPLETE</p><h2>今日の{queue.length}問、完了。</h2><div className="result-grid"><div><span>正答数</span><strong>{score.correct} / {queue.length}</strong></div><div><span>正答率</span><strong>{percentage}%</strong></div><div><span>学習モード</span><strong>不定詞</strong></div></div><button type="button" className="primary-button" onClick={restart}>もう一度解く<Icon name="arrow" size={21} /></button></article>
}

function DailyRail({ correct, answered, seconds }) {
  const incorrect = Math.max(0, answered - correct)
  const rate = answered ? `${Math.round((correct / answered) * 100)}%` : '—'
  const minutes = `${Math.max(1, Math.round(seconds / 60))}分`
  return <aside className="daily-rail"><div className="rail-card"><div className="rail-title"><Icon name="calendar" size={21} /><h2>今日の記録</h2><span className="study-stamp">STUDY</span></div><div className="metric-list"><Metric icon="check" label="正解数" value={correct} /><Metric icon="close" label="不正解数" value={incorrect} /><Metric icon="chart" label="正答率" value={rate} /><Metric icon="clock" label="学習時間" value={minutes} /></div><div className="rail-divider" /><h3>レートの推移</h3><RatingChart /></div><div className="rail-note"><Icon name="chart" size={25} /><p>コツコツ積み重ねて、<br />もっと高いレベルへ。</p></div></aside>
}

function PublicLeaderboard({ players = [], currentName = '', limit = 5, onOpen }) {
  const visiblePlayers = players.length ? players.slice(0, limit) : [{ name: 'まだ参加者はいません', rating: '—', answered: 0 }]
  return <section className="leaderboard-card"><div className="leaderboard-head"><div><span className="section-kicker">PUBLIC RATE</span><h2>みんなのレート</h2></div><span className="leaderboard-live">LIVE</span></div><p className="leaderboard-copy">同じ講座を学ぶ生徒の現在レート</p><div className="leaderboard-list">{visiblePlayers.map((player, index) => <div className={`leaderboard-row ${player.name === currentName ? 'current' : ''}`} key={`${player.name}-${index}`}><span className="leaderboard-rank">{String(index + 1).padStart(2, '0')}</span><span className="leaderboard-name">{player.name}</span><strong>{typeof player.rating === 'number' ? player.rating.toLocaleString() : player.rating}</strong></div>)}</div>{onOpen && <button type="button" className="leaderboard-link" onClick={onOpen}>全体ランキングを見る <Icon name="arrow" size={16} /></button>}</section>
}

function LeaderboardView({ players = [], rating, studentName, refresh, notice }) {
  return <div className="leaderboard-page">
    <div className="leaderboard-page-head"><div><p className="section-kicker">PUBLIC RATEBOARD</p><h1>全体ランキング</h1><p className="subcopy">同じ講座に参加している生徒のレートを確認できます。</p></div><button type="button" className="secondary-button leaderboard-refresh" onClick={refresh}><Icon name="history" size={18} />ランキングを更新</button></div>
    {notice && <div className="app-notice" role="status">{notice}</div>}
    <div className="leaderboard-overview"><div className="leaderboard-you"><span>YOUR RATE</span><strong>{rating.toLocaleString()}</strong><small>{studentName ? `${studentName} の現在レート` : '名前を入力すると参加できます'}</small></div><div className="leaderboard-rule"><span>RANKING RULE</span><strong>正答で上昇 / 不正解で下降</strong><small>問題ごとに1回だけレートへ反映されます。</small></div></div>
    <section className="leaderboard-table-card"><div className="leaderboard-table-head"><h2>参加者一覧</h2><span>{players.length ? `${players.length}人` : '共有データなし'}</span></div>{players.length ? <div className="leaderboard-table"><div className="leaderboard-table-row leaderboard-table-label"><span>RANK</span><span>PLAYER</span><span>ANSWERED</span><span>RATE</span></div>{players.map((player, index) => <div className={`leaderboard-table-row ${player.name === studentName ? 'current' : ''}`} key={`${player.name}-${index}`}><strong>{String(index + 1).padStart(2, '0')}</strong><span>{player.name}</span><span>{player.answered ?? 0}</span><strong>{typeof player.rating === 'number' ? player.rating.toLocaleString() : player.rating}</strong></div>)}</div> : <div className="leaderboard-empty"><Icon name="leaderboard" size={34} /><h3>まだ共有ランキングがありません。</h3><p>共有サーバーに接続すると、他の生徒のレートがここに表示されます。</p></div>}</section>
  </div>
}

function Metric({ icon, label, value }) {
  return <div className="metric-row"><span className={`metric-icon metric-${icon}`}><Icon name={icon} size={16} /></span><span>{label}</span><strong>{value}</strong></div>
}

function RatingChart() {
  return <div className="rating-chart"><svg viewBox="0 0 280 130" role="img" aria-label="レートの推移"><path d="M30 8v102h238" className="chart-axis" /><path d="M30 84H268M30 54H268M30 24H268" className="chart-grid" /><path d="M30 91 L69 73 L108 66 L147 54 L186 42 L225 31 L264 18 L264 110 L30 110Z" className="chart-area" /><path d="M30 91 L69 73 L108 66 L147 54 L186 42 L225 31 L264 18" className="chart-line" />{[[30,91],[69,73],[108,66],[147,54],[186,42],[225,31],[264,18]].map(([x,y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="4.5" className="chart-dot" />)}<text x="0" y="112">1,000</text><text x="0" y="58">1,200</text><text x="0" y="12">1,300</text></svg></div>
}

function HistoryView({ history, rating }) {
  return <div className="simple-view"><div className="section-heading"><div><p className="section-kicker">YOUR PROGRESS</p><h1>学習履歴</h1><p className="subcopy">解いた記録を見返して、伸び方をつかもう。</p></div><div className="history-current"><span>現在レート</span><strong>{rating.toLocaleString()}</strong></div></div><div className="history-panel"><div className="history-panel-head"><h2>最近のセッション</h2><span>{history.length}件</span></div>{history.length ? <div className="history-list">{history.map((item) => <div className="history-row" key={item.id}><div className="history-date"><span>{item.date.replaceAll('-', '.')}</span><strong>{item.label}</strong></div><div className="history-result"><strong>{item.correct} / {item.total}</strong><span>正答</span></div><div className="history-change"><strong className={item.ratingDelta >= 0 ? 'up' : 'down'}>{item.ratingDelta >= 0 ? '+' : ''}{item.ratingDelta}</strong><span>レート変動</span></div><div className="history-after"><span>終了時</span><strong>{item.ratingAfter.toLocaleString()}</strong></div></div>)}</div> : <div className="empty-history"><Icon name="history" size={34} /><h3>まだ履歴がありません。</h3><p>演習を終えると、ここにレートと正答数が記録されます。</p></div>}</div></div>
}

function SettingsView({ filter, setFilter, autoExplanation, setAutoExplanation }) {
  return <div className="simple-view"><div className="section-heading"><div><p className="section-kicker">PRACTICE SETTINGS</p><h1>出題設定</h1><p className="subcopy">今の理解度に合わせて、取り組み方を変えられます。</p></div></div><div className="settings-grid"><section className="settings-panel"><h2>出題レベル</h2><p>演習画面のタブからいつでも変更できます。</p><div className="settings-options">{Object.entries(DIFFICULTY).map(([key, value]) => <button type="button" key={key} className={`setting-option ${filter === key ? 'selected' : ''}`} onClick={() => setFilter(key)}><span className="setting-radio" /> <span><strong>{value.label}</strong><small>{key === 'all' ? 'Lesson 13〜15・Plus' : key === 'starter' ? 'まずは基本から' : key === 'standard' ? '使い分けを練習' : '一歩進んだ表現'}</small></span></button>)}</div></section><section className="settings-panel"><h2>学習の表示</h2><p>解答後の画面の見え方を設定します。</p><label className="toggle-row"><span><strong>解説を自動で表示</strong><small>正誤判定のあとに解説を開きます</small></span><button type="button" className={`toggle ${autoExplanation ? 'on' : ''}`} aria-pressed={autoExplanation} onClick={() => setAutoExplanation(!autoExplanation)}><span /></button></label><div className="rule-note"><Icon name="document" size={19} /><span>正答数に応じてレートが変動し、履歴に保存されます。</span></div></section></div></div>
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
