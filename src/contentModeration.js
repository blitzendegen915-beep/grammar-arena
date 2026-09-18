const JAPANESE_INAPPROPRIATE_PATTERNS = [
  /(?:死ね|しね|消えろ|きえろ|殺す|ころす|殺せ|ころせ|だまれ|黙れ|うるせえ|レイプ|れいぷ|強姦|ごうかん|ちんこ|ちんぽ|ちんちん|まんこ|おっぱい|ぱいおつ|セックス|せっくす|えっち|エッチ|エロ|えろ|オナニー|おなにー|自慰|じい|射精|しゃせい|精子|せいし|ペニス|ぺにす|ヴァギナ|ばぎな|アナル|あなる|肛門|こうもん|フェラ|ふぇら|裸|はだか|全裸|ぜんら|乳首|ちくび|パンツ|ぱんつ|うんこ|うんち|ばか(?!り)|馬鹿|バカ(?!り)|アホ|あほ|ブス|ぶす|デブ|でぶ|ハゲ|はげ|チビ|ちび|クズ|くず|ゴミ|ごみ|カス|かす|無能|むのう|キモい|きもい|キショい|きしょい|うざい|ウザい|陰キャ|いんきゃ|チー牛|ちーぎゅう|ガイジ|がいじ|キチガイ|きちがい|池沼|ちしょう|老害|ろうがい|雑魚|ざこ|負け犬|まけいぬ|役立たず|やくたたず|下手くそ|へたくそ)/i,
]

const ENGLISH_INAPPROPRIATE_PATTERN = /(?:^|[^a-z0-9])(motherfucker|fuck(?:ing|ed|er)?|shit(?:head)?|bitch|asshole|dick|pussy|cunt|cock|nigger|faggot|slut|whore|rape|porn(?:ography)?|nude|naked|sex|sexy|masturbat(?:e|ed|ing|ion)|penis|vagina|boobs?|tits?|dildo|jerk|idiot|moron|loser|dumbass|stupid|retard)(?:$|[^a-z0-9])/i

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
  const kanaFolded = toHiragana(original)
  const kanaCompact = toHiragana(compact)
  const japaneseCandidates = [original, compact, kanaFolded, kanaCompact]
  if (JAPANESE_INAPPROPRIATE_PATTERNS.some((pattern) => japaneseCandidates.some((candidate) => pattern.test(candidate)))) return true
  const englishCandidates = [original, compact, normalizeLatinConfusables(original), normalizeLatinConfusables(compact)]
  return englishCandidates.some((candidate) => ENGLISH_INAPPROPRIATE_PATTERN.test(candidate))
}

function toHiragana(value) {
  return String(value || '').replace(/[\u30A1-\u30F6]/g, (character) => String.fromCharCode(character.charCodeAt(0) - 0x60))
}

function normalizeLatinConfusables(value) {
  return String(value || '')
    .replace(/[@＠]/g, 'a')
    .replace(/[$＄]/g, 's')
    .replace(/[０]/g, 'o')
    .replace(/[１]/g, 'i')
    .replace(/[３]/g, 'e')
    .replace(/[４]/g, 'a')
    .replace(/[５]/g, 's')
    .replace(/[７]/g, 't')
}

export const MODERATION_NOTICE = '不適切な表現は使用できません。表示名や解答を見直してください。'

// Exported for tests and future moderation UI; the app only needs the boolean check.
export { normalizeModerationText }
