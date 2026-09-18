const JAPANESE_INAPPROPRIATE_PATTERNS = [
  /(?:死ね|しね|消えろ|きえろ|殺す|ころす|殺せ|ころせ|レイプ|強姦|ちんこ|ちんぽ|まんこ|おっぱい|セックス|えっち|オナニー|自慰|精子|ペニス|ヴァギナ|アナル|肛門|フェラ|裸|ばか(?!り)|馬鹿|バカ(?!り)|アホ|あほ|ブス|デブ|ハゲ|クズ|ゴミ|カス|無能|キモい|きもい|うざい)/i,
]

const ENGLISH_INAPPROPRIATE_PATTERN = /(?:^|[^a-z0-9])(fuck(?:ing|ed|er)?|shit|bitch|asshole|dick|pussy|cunt|cock|nigger|faggot|slut|whore|rape)(?:$|[^a-z0-9])/i

function normalizeModerationText(value = '') {
  return String(value || '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/[\s\p{P}\p{S}]+/gu, '')
}

export function isModerationBlocked(value = '') {
  const original = String(value || '').normalize('NFKC').toLowerCase().trim()
  if (!original) return false
  const compact = normalizeModerationText(original)
  if (JAPANESE_INAPPROPRIATE_PATTERNS.some((pattern) => pattern.test(original) || pattern.test(compact))) return true
  return ENGLISH_INAPPROPRIATE_PATTERN.test(original)
}

export const MODERATION_NOTICE = '不適切な表現は使用できません。表示名や解答を見直してください。'

// Exported for tests and future moderation UI; the app only needs the boolean check.
export { normalizeModerationText }
