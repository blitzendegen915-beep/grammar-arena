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
    explanation: 'enjoy の後ろは動名詞（動詞の -ing 形）です。この文では books を読むことを楽しんでいるので reading が合い、read や to read はこの形に続きません。',
  }),
  shared({
    id: 'gerund-02', lesson: 'LESSON 16', topic: '動名詞の基本', difficulty: 'starter', type: 'input',
    prompt: '空所に入る語句を入力しなさい。', sentence: 'She avoided ______ to him.', japanese: '彼女は彼に話しかけるのを避けました。',
    answer: 'talking', accepted: ['talking'], answerLabel: 'talking', explanation: 'avoid の後ろは動名詞（avoid doing）です。「彼に話しかけるのを避けた」ので talking が合い、to talk は続けられません。',
  }),
  shared({
    id: 'gerund-03', lesson: 'LESSON 16', topic: '前置詞 + 動名詞', difficulty: 'starter', type: 'choice',
    prompt: '空所に入る最も適切な語句を選びなさい。', sentence: 'Thank you for ______ me.', japanese: '私を助けてくれてありがとう。',
    choices: ['helping', 'help', 'to help'], answer: 'helping', answerLabel: 'helping', explanation: '前置詞の後ろでは動詞を動名詞にします。for は前置詞で、ここでは「私を助けること」への感謝なので helping が合い、help や to help にはしません。',
  }),
  shared({
    id: 'gerund-04', lesson: 'LESSON 16', topic: '動名詞の表現', difficulty: 'standard', type: 'reorder',
    prompt: '日本語の意味に合うように、語句を並べかえなさい。', japanese: '毎日英語を読むことは役に立ちます。',
    words: ['Reading', 'English', 'every', 'day', 'is', 'useful.'], answer: 'Reading English every day is useful.', answerLabel: 'Reading English every day is useful.',
    explanation: '動名詞句は文の主語にできます。ここでは Reading English every day（毎日英語を読むこと）が is useful の主語なので、文頭に置きます。',
  }),
  shared({
    id: 'gerund-05', lesson: 'LESSON 16', topic: '前置詞 to + 動名詞', difficulty: 'standard', type: 'choice',
    prompt: '空所に入る最も適切な語句を選びなさい。', sentence: 'I look forward to ______ you again.', japanese: 'またあなたに会えるのを楽しみにしています。',
    choices: ['seeing', 'see', 'to see'], answer: 'seeing', answerLabel: 'seeing', explanation: 'look forward to の to は前置詞なので、後ろは動名詞（look forward to doing）です。また会うことを楽しみにしているため seeing が合い、see や to see にはしません。',
  }),
  shared({
    id: 'gerund-06', lesson: 'LESSON 16', topic: '動名詞の基本', difficulty: 'standard', type: 'input',
    prompt: '空所に入る語句を入力しなさい。', sentence: 'Would you mind ______ the window?', japanese: '窓を閉めていただけませんか。',
    answer: 'closing', accepted: ['closing'], answerLabel: 'closing', explanation: 'mind の後ろに動作を続ける形は mind doing です。Would you mind ...? は依頼表現で、窓を閉める動作を尋ねているので closing が入ります。',
  }),
  shared({
    id: 'gerund-07', lesson: 'LESSON 17', topic: 'stop + 動名詞', difficulty: 'standard', type: 'choice',
    prompt: '文の意味に合う語句を選びなさい。', sentence: 'He stopped ______ because he was tired.', japanese: '彼は疲れていたので、走るのをやめました。',
    choices: ['running', 'to run', 'run'], answer: 'running', answerLabel: 'running', explanation: 'stop doing は「～するのをやめる」です。疲れて走るのをやめた文なので running が合い、stop to run なら「走るために立ち止まる」になります。',
  }),
  shared({
    id: 'gerund-08', lesson: 'LESSON 17', topic: 'stop + 不定詞', difficulty: 'standard', type: 'choice',
    prompt: '文の意味に合う語句を選びなさい。', sentence: 'He stopped ______ some water.', japanese: '彼は水を飲むために立ち止まりました。',
    choices: ['to drink', 'drinking', 'drank'], answer: 'to drink', answerLabel: 'to drink', explanation: 'stop to do は「～するために立ち止まる」です。水を飲むために止まったので to drink が合い、drinking なら「飲むのをやめた」という意味になります。',
  }),
  shared({
    id: 'gerund-09', lesson: 'LESSON 17', topic: 'remember + 動名詞', difficulty: 'advanced', type: 'input',
    prompt: '空所に入る語句を入力しなさい。', sentence: 'I remember ______ that movie last year.', japanese: '私は去年、その映画を見たことを覚えています。',
    answer: 'seeing', accepted: ['seeing'], answerLabel: 'seeing', explanation: 'remember doing は「以前にしたことを覚えている」を表します。last year が過去の鑑賞を示すので seeing が合い、remember to do（これからすることを忘れずにする）とは意味が異なります。',
  }),
  shared({
    id: 'gerund-10', lesson: 'LESSON 17', topic: 'forget + 不定詞', difficulty: 'advanced', type: 'choice',
    prompt: '空所に入る最も適切な語句を選びなさい。', sentence: 'Don’t forget ______ your homework.', japanese: '宿題をするのを忘れないでください。',
    choices: ['to do', 'doing', 'do'], answer: 'to do', answerLabel: 'to do', explanation: 'forget to do は「これからすることを忘れる」です。宿題をするのを忘れないよう促しているので to do が合い、doing なら「宿題をしたことを忘れる」になります。',
  }),
  shared({
    id: 'gerund-11', lesson: 'LESSON 18', topic: '動名詞の主語', difficulty: 'standard', type: 'reorder',
    prompt: '日本語の意味に合うように、語句を並べかえなさい。', japanese: '早起きすることは健康によいです。',
    words: ['Getting', 'up', 'early', 'is', 'good', 'for', 'your', 'health.'], answer: 'Getting up early is good for your health.', answerLabel: 'Getting up early is good for your health.',
    explanation: '動名詞句は文の主語になり、「～すること」を表せます。ここでは Getting up early が主語で、is 以下がその内容を説明しています。',
  }),
  shared({
    id: 'gerund-12', lesson: 'LESSON 18', topic: '動名詞の複数正解', difficulty: 'advanced', type: 'input',
    prompt: '空所に入る語句を入力しなさい。正解は2通りあります。', sentence: 'This book needs ______.', japanese: 'この本は読まれる必要があります。',
    answer: 'reading', accepted: ['reading', 'to be read'], answerLabel: 'reading / to be read', explanation: 'need doing は受け身の意味で「～される必要がある」を表し、need to be done と言い換えられます。本は読む側ではなく読まれる側なので reading（= to be read）が合い、to read では意味が変わります。',
  }),
]

export const PARTICIPLE_QUESTIONS = [
  shared({
    id: 'participle-01', lesson: 'LESSON 19', topic: '現在分詞', difficulty: 'starter', type: 'choice',
    prompt: '空所に入る最も適切な語を選びなさい。', sentence: 'The movie was very ______.', japanese: 'その映画はとてもおもしろかったです。',
    choices: ['interesting', 'interested', 'interest'], answer: 'interesting', answerLabel: 'interesting', explanation: '感情を表す -ing 形は、感情を起こさせる側を表します。映画が人をおもしろがらせるので interesting が合い、interested では映画自身が興味を感じる意味になります。',
  }),
  shared({
    id: 'participle-02', lesson: 'LESSON 19', topic: '過去分詞', difficulty: 'starter', type: 'choice',
    prompt: '空所に入る最も適切な語を選びなさい。', sentence: 'I was ______ by the movie.', japanese: '私はその映画に興味を引かれました。',
    choices: ['interested', 'interesting', 'interest'], answer: 'interested', answerLabel: 'interested', explanation: '感情を表す過去分詞は、その感情を受ける人を表します。I が映画を見て興味を引かれた側なので interested が合います。interesting は映画のように、興味を起こさせる側に使います。',
  }),
  shared({
    id: 'participle-03', lesson: 'LESSON 19', topic: '現在分詞の形容詞用法', difficulty: 'starter', type: 'input',
    prompt: '空所に入る語を入力しなさい。', sentence: 'Look at the ______ leaves.', japanese: '落ちている葉を見てください。',
    answer: 'falling', accepted: ['falling'], answerLabel: 'falling', explanation: '現在分詞は名詞の前で「～している…」と名詞を修飾できます。葉が落ちている最中なので falling leaves が合い、fallen leaves なら落ち終えた葉を表します。',
  }),
  shared({
    id: 'participle-04', lesson: 'LESSON 19', topic: '過去分詞の形容詞用法', difficulty: 'standard', type: 'reorder',
    prompt: '日本語の意味に合うように、語句を並べかえなさい。', japanese: '壊れた窓は修理される必要があります。',
    words: ['The', 'broken', 'window', 'needs', 'to', 'be', 'repaired.'], answer: 'The broken window needs to be repaired.', answerLabel: 'The broken window needs to be repaired.',
    explanation: '過去分詞は「～された状態」を表し、名詞の前から修飾できます。窓は壊された側なので broken が合い、breaking window では窓が何かを壊す側のように読まれます。',
  }),
  shared({
    id: 'participle-05', lesson: 'LESSON 20', topic: '分詞の後置修飾', difficulty: 'standard', type: 'choice',
    prompt: '空所に入る最も適切な語を選びなさい。', sentence: 'The girl ______ by the door is my sister.', japanese: 'ドアのそばに立っている少女は私の妹です。',
    choices: ['standing', 'stood', 'to stand'], answer: 'standing', answerLabel: 'standing', explanation: '現在分詞句は名詞の後ろに置き、動作中の名詞を説明できます（名詞 + V-ing）。少女がドアのそばに立っているので standing が合い、stood ではこの現在の動作を表せません。',
  }),
  shared({
    id: 'participle-06', lesson: 'LESSON 20', topic: '分詞の後置修飾', difficulty: 'standard', type: 'choice',
    prompt: '空所に入る最も適切な語を選びなさい。', sentence: 'The book ______ by this author is popular.', japanese: 'この著者によって書かれた本は人気があります。',
    choices: ['written', 'writing', 'write'], answer: 'written', answerLabel: 'written', explanation: '過去分詞句は名詞の後ろに置き、受け身の意味で修飾できます（名詞 + 過去分詞）。本は著者によって書かれる側なので written が合い、writing では本が書く側になります。',
  }),
  shared({
    id: 'participle-07', lesson: 'LESSON 20', topic: '知覚動詞 + 過去分詞', difficulty: 'advanced', type: 'input',
    prompt: '空所に入る語を入力しなさい。', sentence: 'I found the door ______.', japanese: '私はドアが鍵をかけられていることに気づきました。',
    answer: 'locked', accepted: ['locked'], answerLabel: 'locked', explanation: 'find + O + 過去分詞で「Oが～された状態だと分かる」を表します。ドアが鍵をかけられた状態なので locked が合い、locking ではドアが鍵をかける側の意味になります。',
  }),
  shared({
    id: 'participle-08', lesson: 'LESSON 21', topic: '現在分詞・過去分詞', difficulty: 'standard', type: 'choice',
    prompt: '空所に入る最も適切な語を選びなさい。', sentence: 'The news was ______.', japanese: 'その知らせは驚くべきものでした。',
    choices: ['surprising', 'surprised', 'surprise'], answer: 'surprising', answerLabel: 'surprising', explanation: '感情の原因には -ing 形を使います（物事 is surprising）。知らせが人を驚かせる側なので surprising が合い、surprised は驚いた側を表します。',
  }),
  shared({
    id: 'participle-09', lesson: 'LESSON 21', topic: '現在分詞・過去分詞', difficulty: 'standard', type: 'choice',
    prompt: '空所に入る最も適切な語を選びなさい。', sentence: 'We were ______ at the news.', japanese: '私たちはその知らせに驚きました。',
    choices: ['surprised', 'surprising', 'surprise'], answer: 'surprised', answerLabel: 'surprised', explanation: '感情を受ける人には過去分詞を使います（人 is surprised）。私たちが知らせに驚いた側なので surprised が合い、surprising は驚かせる側を表します。',
  }),
  shared({
    id: 'participle-10', lesson: 'LESSON 21', topic: '分詞の後置修飾', difficulty: 'standard', type: 'reorder',
    prompt: '日本語の意味に合うように、語句を並べかえなさい。', japanese: '私の隣に座っている男性は英語を話します。',
    words: ['The', 'man', 'sitting', 'next', 'to', 'me', 'speaks', 'English.'], answer: 'The man sitting next to me speaks English.', answerLabel: 'The man sitting next to me speaks English.',
    explanation: '現在分詞句は名詞の後ろに置き、動作中の人や物を説明できます。隣に座っているのは the man なので sitting next to me がその名詞を修飾し、speaks English が文の動詞になります。',
  }),
  shared({
    id: 'participle-11', lesson: 'LESSON 21', topic: '現在分詞の形容詞用法', difficulty: 'starter', type: 'choice',
    prompt: '空所に入る最も適切な語を選びなさい。', sentence: 'The ______ baby woke up everyone.', japanese: '泣いている赤ちゃんがみんなを起こしました。',
    choices: ['crying', 'cried', 'cry'], answer: 'crying', answerLabel: 'crying', explanation: '名詞の前の現在分詞は、その名詞がしている動作を表せます。赤ちゃん自身が泣いているので crying が合い、cried や cry では動作中の意味になりません。',
  }),
  shared({
    id: 'participle-12', lesson: 'LESSON 22', topic: '過去分詞の後置修飾', difficulty: 'advanced', type: 'input',
    prompt: '空所に入る語を入力しなさい。', sentence: 'The letter ______ in French was difficult to read.', japanese: 'フランス語で書かれた手紙は読みにくかったです。',
    answer: 'written', accepted: ['written'], answerLabel: 'written', explanation: '過去分詞句は名詞の後ろに置き、受け身の内容を説明できます。手紙はフランス語で書かれる側なので written in French が合い、writing だと手紙が何かを書く意味になります。',
  }),
]
