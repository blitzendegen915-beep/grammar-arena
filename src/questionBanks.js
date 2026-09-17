export const FOUNDATION_TRANSLATIONS = {
  'l13-01': '私たちの目的は、貧しい人々を助けることです。',
  'l13-02': '私は話し相手になってくれる友達がたくさんいます。',
  'l13-03': 'お腹が空きました。何か食べるものが欲しいです。',
  'l13-04': '私たちの目的は、貧しい人々を助けることです。',
  'l14-01': '私は昨日、服を買うために原宿へ行きました。',
  'l14-02': 'その警察官は、私たちに家へ帰るように言いました。',
  'l14-03': '他人の気持ちを理解することは簡単ではありません。',
  'l14-04': '私たちはその試合に参加しないことに決めました。',
  'l15-01': '私は自分を外出させませんでした。',
  'l15-02': '私は、妹が寝言で何か言うのを聞きました。',
  'l15-03': '私はどこかに眼鏡を置き忘れたようでした。',
  'l15-04': 'シンジは今、公園でサッカーをしているようです。',
  'plus-01': '率直に言うと、そのジャケットはあなたに似合いません。',
  'plus-02': 'フランス大統領は来月、日本を訪問する予定です。',
  'plus-03': 'その店は見つけやすいです。',
  'plus-04': '彼女はどこへ行けばよいのか分かりませんでした。',
}

import { countSentenceBlanks } from './questionQuality.js'

const shared = (question) => {
  const { japanese, ...rest } = question
  return {
    ...rest,
    japanese: question.type === 'reorder' ? japanese : '',
    translation: japanese || '',
    source: question.source || '基礎講座・追加演習',
    blankCount: countSentenceBlanks(question.sentence || ''),
  }
}

export const GERUND_QUESTIONS = [
  shared({
    id: 'gerund-01', lesson: 'LESSON 16', topic: '動名詞の基本', difficulty: 'starter', type: 'choice',
    prompt: '空所に入る最も適切な語句を選びなさい。', sentence: 'I enjoy ______ books in my free time.',
    japanese: '私は自由時間に本を読むのを楽しんでいます。', choices: ['reading', 'read', 'to read'], answer: 'reading', answerLabel: 'reading',
    explanation: 'enjoy の後ろには動名詞（動詞の -ing 形）を置きます。',
  }),
  shared({
    id: 'gerund-02', lesson: 'LESSON 16', topic: '動名詞の基本', difficulty: 'starter', type: 'input',
    prompt: '空所に入る語句を入力しなさい。', sentence: 'She avoided ______ to him.', japanese: '彼女は彼に話しかけるのを避けました。',
    answer: 'talking', accepted: ['talking'], answerLabel: 'talking', explanation: 'avoid の後ろには動名詞を置きます。to talk にはしません。',
  }),
  shared({
    id: 'gerund-03', lesson: 'LESSON 16', topic: '前置詞 + 動名詞', difficulty: 'starter', type: 'choice',
    prompt: '空所に入る最も適切な語句を選びなさい。', sentence: 'Thank you for ______ me.', japanese: '私を助けてくれてありがとう。',
    choices: ['helping', 'help', 'to help'], answer: 'helping', answerLabel: 'helping', explanation: 'for は前置詞なので、後ろには動名詞 helping を置きます。',
  }),
  shared({
    id: 'gerund-04', lesson: 'LESSON 16', topic: '動名詞の表現', difficulty: 'standard', type: 'reorder',
    prompt: '日本語の意味に合うように、語句を並べかえなさい。', japanese: '毎日英語を読むことは役に立ちます。',
    words: ['Reading', 'English', 'every', 'day', 'is', 'useful.'], answer: 'Reading English every day is useful.', answerLabel: 'Reading English every day is useful.',
    explanation: '動名詞 Reading English every day を主語にしています。動名詞は文の主語にもなります。',
  }),
  shared({
    id: 'gerund-05', lesson: 'LESSON 16', topic: '前置詞 to + 動名詞', difficulty: 'standard', type: 'choice',
    prompt: '空所に入る最も適切な語句を選びなさい。', sentence: 'I look forward to ______ you again.', japanese: 'またあなたに会えるのを楽しみにしています。',
    choices: ['seeing', 'see', 'to see'], answer: 'seeing', answerLabel: 'seeing', explanation: 'look forward to の to は前置詞です。したがって、後ろは動名詞 seeing になります。',
  }),
  shared({
    id: 'gerund-06', lesson: 'LESSON 16', topic: '動名詞の基本', difficulty: 'standard', type: 'input',
    prompt: '空所に入る語句を入力しなさい。', sentence: 'Would you mind ______ the window?', japanese: '窓を閉めていただけませんか。',
    answer: 'closing', accepted: ['closing'], answerLabel: 'closing', explanation: 'Would you mind ～ing? は「～していただけませんか」という丁寧な依頼です。',
  }),
  shared({
    id: 'gerund-07', lesson: 'LESSON 17', topic: 'stop + 動名詞', difficulty: 'standard', type: 'choice',
    prompt: '文の意味に合う語句を選びなさい。', sentence: 'He stopped ______ because he was tired.', japanese: '彼は疲れていたので、走るのをやめました。',
    choices: ['running', 'to run', 'run'], answer: 'running', answerLabel: 'running', explanation: 'stop ～ing は「～するのをやめる」という意味です。',
  }),
  shared({
    id: 'gerund-08', lesson: 'LESSON 17', topic: 'stop + 不定詞', difficulty: 'standard', type: 'choice',
    prompt: '文の意味に合う語句を選びなさい。', sentence: 'He stopped ______ some water.', japanese: '彼は水を飲むために立ち止まりました。',
    choices: ['to drink', 'drinking', 'drank'], answer: 'to drink', answerLabel: 'to drink', explanation: 'stop to do は「～するために立ち止まる」という意味です。stop ～ing と意味が変わります。',
  }),
  shared({
    id: 'gerund-09', lesson: 'LESSON 17', topic: 'remember + 動名詞', difficulty: 'advanced', type: 'input',
    prompt: '空所に入る語句を入力しなさい。', sentence: 'I remember ______ that movie last year.', japanese: '私は去年、その映画を見たことを覚えています。',
    answer: 'seeing', accepted: ['seeing'], answerLabel: 'seeing', explanation: 'remember ～ing は「～したことを覚えている」という意味です。',
  }),
  shared({
    id: 'gerund-10', lesson: 'LESSON 17', topic: 'forget + 不定詞', difficulty: 'advanced', type: 'choice',
    prompt: '空所に入る最も適切な語句を選びなさい。', sentence: 'Don’t forget ______ your homework.', japanese: '宿題をするのを忘れないでください。',
    choices: ['to do', 'doing', 'do'], answer: 'to do', answerLabel: 'to do', explanation: 'forget to do は「これからすることを忘れる」という意味です。',
  }),
  shared({
    id: 'gerund-11', lesson: 'LESSON 18', topic: '動名詞の主語', difficulty: 'standard', type: 'reorder',
    prompt: '日本語の意味に合うように、語句を並べかえなさい。', japanese: '早起きすることは健康によいです。',
    words: ['Getting', 'up', 'early', 'is', 'good', 'for', 'your', 'health.'], answer: 'Getting up early is good for your health.', answerLabel: 'Getting up early is good for your health.',
    explanation: 'Getting up early が文の主語になっています。動名詞は「～すること」と訳せます。',
  }),
  shared({
    id: 'gerund-12', lesson: 'LESSON 18', topic: '動名詞の複数正解', difficulty: 'advanced', type: 'input',
    prompt: '空所に入る語句を入力しなさい。正解は2通りあります。', sentence: 'This book needs ______.', japanese: 'この本は読まれる必要があります。',
    answer: 'reading', accepted: ['reading', 'to be read'], answerLabel: 'reading / to be read', explanation: 'need ～ing は受け身の意味で「～される必要がある」を表します。to be read も同じ意味で使えます。',
  }),
]

export const PARTICIPLE_QUESTIONS = [
  shared({
    id: 'participle-01', lesson: 'LESSON 19', topic: '現在分詞', difficulty: 'starter', type: 'choice',
    prompt: '空所に入る最も適切な語を選びなさい。', sentence: 'The movie was very ______.', japanese: 'その映画はとてもおもしろかったです。',
    choices: ['interesting', 'interested', 'interest'], answer: 'interesting', answerLabel: 'interesting', explanation: 'interesting は「人をおもしろがらせる」という意味の現在分詞です。',
  }),
  shared({
    id: 'participle-02', lesson: 'LESSON 19', topic: '過去分詞', difficulty: 'starter', type: 'choice',
    prompt: '空所に入る最も適切な語を選びなさい。', sentence: 'I was ______ by the movie.', japanese: '私はその映画に興味を引かれました。',
    choices: ['interested', 'interesting', 'interest'], answer: 'interested', answerLabel: 'interested', explanation: 'interested は「興味を持たされている」という受け身の意味の過去分詞です。',
  }),
  shared({
    id: 'participle-03', lesson: 'LESSON 19', topic: '現在分詞の形容詞用法', difficulty: 'starter', type: 'input',
    prompt: '空所に入る語を入力しなさい。', sentence: 'Look at the ______ leaves.', japanese: '落ちている葉を見てください。',
    answer: 'falling', accepted: ['falling'], answerLabel: 'falling', explanation: 'falling leaves は「落ちている葉」という意味です。現在分詞が名詞を修飾しています。',
  }),
  shared({
    id: 'participle-04', lesson: 'LESSON 19', topic: '過去分詞の形容詞用法', difficulty: 'standard', type: 'reorder',
    prompt: '日本語の意味に合うように、語句を並べかえなさい。', japanese: '壊れた窓は修理される必要があります。',
    words: ['The', 'broken', 'window', 'needs', 'to', 'be', 'repaired.'], answer: 'The broken window needs to be repaired.', answerLabel: 'The broken window needs to be repaired.',
    explanation: 'broken は「壊された」という受け身の意味で window を修飾しています。',
  }),
  shared({
    id: 'participle-05', lesson: 'LESSON 20', topic: '分詞の後置修飾', difficulty: 'standard', type: 'choice',
    prompt: '空所に入る最も適切な語を選びなさい。', sentence: 'The girl ______ by the door is my sister.', japanese: 'ドアのそばに立っている少女は私の妹です。',
    choices: ['standing', 'stood', 'to stand'], answer: 'standing', answerLabel: 'standing', explanation: 'standing by the door が the girl を後ろから修飾しています。',
  }),
  shared({
    id: 'participle-06', lesson: 'LESSON 20', topic: '分詞の後置修飾', difficulty: 'standard', type: 'choice',
    prompt: '空所に入る最も適切な語を選びなさい。', sentence: 'The book ______ by this author is popular.', japanese: 'この著者によって書かれた本は人気があります。',
    choices: ['written', 'writing', 'write'], answer: 'written', answerLabel: 'written', explanation: 'written by this author は「この著者によって書かれた」という受け身の意味です。',
  }),
  shared({
    id: 'participle-07', lesson: 'LESSON 20', topic: '知覚動詞 + 過去分詞', difficulty: 'advanced', type: 'input',
    prompt: '空所に入る語を入力しなさい。', sentence: 'I found the door ______.', japanese: '私はドアが鍵をかけられていることに気づきました。',
    answer: 'locked', accepted: ['locked'], answerLabel: 'locked', explanation: 'find + O + 過去分詞で「Oが～された状態だと気づく」という意味になります。',
  }),
  shared({
    id: 'participle-08', lesson: 'LESSON 21', topic: '現在分詞・過去分詞', difficulty: 'standard', type: 'choice',
    prompt: '空所に入る最も適切な語を選びなさい。', sentence: 'The news was ______.', japanese: 'その知らせは驚くべきものでした。',
    choices: ['surprising', 'surprised', 'surprise'], answer: 'surprising', answerLabel: 'surprising', explanation: '知らせが人を驚かせるので、現在分詞 surprising を使います。',
  }),
  shared({
    id: 'participle-09', lesson: 'LESSON 21', topic: '現在分詞・過去分詞', difficulty: 'standard', type: 'choice',
    prompt: '空所に入る最も適切な語を選びなさい。', sentence: 'We were ______ at the news.', japanese: '私たちはその知らせに驚きました。',
    choices: ['surprised', 'surprising', 'surprise'], answer: 'surprised', answerLabel: 'surprised', explanation: '私たちが驚かされたので、過去分詞 surprised を使います。',
  }),
  shared({
    id: 'participle-10', lesson: 'LESSON 21', topic: '分詞の後置修飾', difficulty: 'standard', type: 'reorder',
    prompt: '日本語の意味に合うように、語句を並べかえなさい。', japanese: '私の隣に座っている男性は英語を話します。',
    words: ['The', 'man', 'sitting', 'next', 'to', 'me', 'speaks', 'English.'], answer: 'The man sitting next to me speaks English.', answerLabel: 'The man sitting next to me speaks English.',
    explanation: 'sitting next to me が the man を後ろから修飾しています。',
  }),
  shared({
    id: 'participle-11', lesson: 'LESSON 21', topic: '現在分詞の形容詞用法', difficulty: 'starter', type: 'choice',
    prompt: '空所に入る最も適切な語を選びなさい。', sentence: 'The ______ baby woke up everyone.', japanese: '泣いている赤ちゃんがみんなを起こしました。',
    choices: ['crying', 'cried', 'cry'], answer: 'crying', answerLabel: 'crying', explanation: 'crying は「泣いている」という動作中の状態を表します。',
  }),
  shared({
    id: 'participle-12', lesson: 'LESSON 22', topic: '過去分詞の後置修飾', difficulty: 'advanced', type: 'input',
    prompt: '空所に入る語を入力しなさい。', sentence: 'The letter ______ in French was difficult to read.', japanese: 'フランス語で書かれた手紙は読みにくかったです。',
    answer: 'written', accepted: ['written'], answerLabel: 'written', explanation: 'written in French は「フランス語で書かれた」という受け身の意味です。',
  }),
]
