import test from 'node:test';
import assert from 'node:assert/strict';
import { REGULAR_2KIMATSU_QUESTIONS } from './regular2kimatsuQuestions.js';

const byId = new Map(REGULAR_2KIMATSU_QUESTIONS.map((question) => [question.id, question]));

function normalizedTokens(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/<[^>]*>/g, ' ')
    .replace(/[’']/g, '')
    .match(/[a-z0-9]+/g) ?? [];
}

function includesTokenSequence(haystack, needle) {
  if (!needle.length || needle.length > haystack.length) return false;
  return haystack.some((_, start) => needle.every((token, offset) => haystack[start + offset] === token));
}

function canBuildInOrder(answer, words) {
  const answerTokens = normalizedTokens(answer);
  const availableCounts = new Map();

  for (const chunk of words ?? []) {
    const tokens = normalizedTokens(chunk);
    if (!tokens.length) continue;
    const key = tokens.join(' ');
    availableCounts.set(key, (availableCounts.get(key) ?? 0) + 1);
  }

  // A multiword card remains one card: its tokens must be contiguous and in-order.
  const memo = new Set();
  function visit(answerIndex, remaining) {
    if (answerIndex === answerTokens.length) return true;
    const state = `${answerIndex}|${[...remaining].sort(([a], [b]) => a.localeCompare(b)).map(([k, n]) => `${k}:${n}`).join(',')}`;
    if (memo.has(state)) return false;
    memo.add(state);

    for (const [chunk, count] of remaining) {
      const chunkTokens = chunk.split(' ');
      if (!count || !chunkTokens.every((token, offset) => answerTokens[answerIndex + offset] === token)) continue;
      const next = new Map(remaining);
      if (count === 1) next.delete(chunk);
      else next.set(chunk, count - 1);
      if (visit(answerIndex + chunkTokens.length, next)) return true;
    }
    return false;
  }

  return visit(0, availableCounts);
}

test('all 82 term-final reorder answers and accepted forms can be built from the word cards in order', () => {
  const questions = REGULAR_2KIMATSU_QUESTIONS.filter((question) => question.type === 'reorder');
  assert.equal(questions.length, 82, 'the term-final reorder set should remain complete');

  const violations = [];
  for (const question of questions) {
    const answers = [...new Set([question.answer, ...(question.accepted ?? [])])];
    for (const answer of answers) {
      if (!canBuildInOrder(answer, question.words)) {
        violations.push(`${question.id}: ${JSON.stringify(answer)} cannot be built in order from ${JSON.stringify(question.words)}`);
      }
    }
  }
  assert.deepEqual(violations, [], violations.join('\n'));
});

test('the when-fishing reorder preserves the reduced answer and complete sentence label', () => {
  const question = byId.get('term2k-wb-p53-plus-s2-1-5');
  assert.ok(question, 'known item must exist');
  assert.equal(question.answer, 'When fishing at the riverside');
  assert.deepEqual(question.accepted, ['When fishing at the riverside']);
  assert.equal(question.answerLabel, 'When fishing at the riverside, I fell into the river.');
  assert.doesNotMatch(question.answer, /I fell/i);
  assert.ok(question.accepted.every((answer) => !/I fell/i.test(answer)));
});

test('the rich-enough reorder keeps the given to token and has no leftover-word note', () => {
  const question = byId.get('term2k-eg-p56-fe-3-5');
  assert.ok(question, 'known item must exist');
  assert.ok((question.words ?? []).some((word) => normalizedTokens(word).join(' ') === 'to'), 'to must be present as a word card');
  assert.doesNotMatch(`${question.japanese ?? ''} ${question.prompt ?? ''} ${question.explanation ?? ''}`, /1語不足|語が不足|不足している/i);
});

// Fixed from the source's input/options fields. Keep this test independent of tmp/ review files.
const designatedWordsById = {
  'term2k-wb-p48-l18-s1-1-1': ['wear'],
  'term2k-wb-p48-l18-s1-1-2': ['live'],
  'term2k-wb-p48-l18-s1-1-3': ['catch'],
  'term2k-wb-p48-l18-s1-1-4': ['sleep'],
  'term2k-wb-p48-l18-s1-1-5': ['hide'],
  'term2k-wb-p48-l18-s1-1-6': ['lie'],
  'term2k-wb-p48-l18-s1-1-7': ['boil'],
  'term2k-wb-p48-l18-s1-1-8': ['take'],
  'term2k-wb-p49-l18-s2-3-1': ['stand'],
  'term2k-wb-p49-l18-s2-3-2': ['buy'],
  'term2k-wb-p49-l18-s2-3-3': ['run'],
  'term2k-wb-p49-l18-s2-3-4': ['excite'],
  'term2k-wb-p49-l18-s2-3-5': ['finish'],
  'term2k-wb-p50-l19-s1-1-1': ['shine'],
  'term2k-wb-p50-l19-s1-1-2': ['steal'],
  'term2k-wb-p50-l19-s1-1-3': ['run'],
  'term2k-wb-p50-l19-s1-1-4': ['change'],
  'term2k-wb-p50-l19-s1-1-5': ['understand'],
  'term2k-wb-p50-l19-s1-1-6': ['call'],
  'term2k-wb-p51-l19-s2-3-1': ['feel', 'pull'],
  'term2k-wb-p51-l19-s2-3-2': ['watch', 'play'],
  'term2k-wb-p51-l19-s2-3-3': ['have', 'bring'],
  'term2k-wb-p53-plus-s1-4-1': ['compete'],
  'term2k-wb-p53-plus-s1-4-2': ['leave'],
  'term2k-wb-p53-plus-s1-4-3': ['skate'],
  'term2k-wb-p53-plus-s1-4-4': ['work'],
  'term2k-wb-p53-plus-s2-2-1': ['with', 'shine'],
  'term2k-wb-p53-plus-s2-2-2': ['frankly'],
  'term2k-wb-p53-plus-s2-2-3': ['ski'],
  'term2k-wb-p53-plus-s2-2-4': ['prepare'],
  'term2k-wb-p54-fe-2-1': ['make'],
  'term2k-wb-p54-fe-2-2': ['bake'],
  'term2k-wb-p54-fe-2-3': ['seat'],
  'term2k-wb-p54-fe-2-4': ['talk'],
  'term2k-wb-p54-fe-2-5': ['understand'],
  'term2k-wb-p56-check-2-1': ['large'],
  'term2k-wb-p56-check-2-2': ['kind'],
  'term2k-wb-p56-check-2-3': ['slowly'],
  'term2k-wb-p56-check-2-4': ['hard'],
  'term2k-wb-p56-check-2-5': ['many'],
  'term2k-wb-p56-check-2-6': ['much'],
  'term2k-wb-p57-check-3-1': ['big'],
  'term2k-wb-p57-check-3-2': ['exciting'],
  'term2k-wb-p57-check-3-3': ['interesting'],
  'term2k-wb-p57-check-3-4': ['be good at'],
  'term2k-wb-p57-check-3-5': ['little'],
  'term2k-wb-p57-check-4-1': ['important'],
  'term2k-wb-p57-check-4-2': ['deep'],
  'term2k-wb-p57-check-4-3': ['hard'],
  'term2k-wb-p57-check-4-4': ['early'],
  'term2k-wb-p57-check-4-5': ['valuable'],
  'term2k-wb-p58-l20-s1-2a-1': ['well'],
  'term2k-wb-p58-l20-s1-2a-2': ['fast'],
  'term2k-wb-p58-l20-s1-2a-3': ['difficult'],
  'term2k-wb-p58-l20-s1-2a-4': ['not cold'],
  'term2k-wb-p58-l20-s1-2a-5': ['not expensive'],
  'term2k-wb-p59-l20-s2-2-1': ['large'],
  'term2k-wb-p59-l20-s2-2-2': ['popular'],
  'term2k-wb-p59-l20-s2-2-3': ['many'],
  'term2k-wb-p59-l20-s2-2-4': ['mild'],
  'term2k-wb-p60-l21-s1-2-1': ['much', 'bad'],
  'term2k-wb-p60-l21-s1-2-2': ['funny'],
  'term2k-wb-p60-l21-s1-2-3': ['small'],
  'term2k-wb-p60-l21-s1-2-4': ['expensive'],
  'term2k-wb-p61-l21-s2-2-1': ['difficult'],
  'term2k-wb-p61-l21-s2-2-2': ['successful'],
  'term2k-wb-p61-l21-s2-2-3': ['nothing'],
  'term2k-wb-p61-l21-s2-2-4': ['large'],
  'term2k-wb-p63-plus-s2-2-1': ['blow', 'hard'],
  'term2k-wb-p63-plus-s2-2-2': ['you', 'book', 'cheap'],
  'term2k-wb-p63-plus-s2-2-3': ['no', 'less', 'diligent'],
  'term2k-wb-p63-plus-s2-2-4': ['expensive', 'coat'],
};

test('all 72 designated input words are visible in the sentence or exposed as UI-consumed designatedWords', () => {
  assert.equal(Object.keys(designatedWordsById).length, 72);

  for (const [id, designatedWords] of Object.entries(designatedWordsById)) {
    const question = byId.get(id);
    assert.ok(question, `${id}: designated-word question must exist`);
    const sentenceTokens = normalizedTokens(question.sentence);
    const metadata = (question.designatedWords ?? []).flatMap((word) => normalizedTokens(word));
    for (const phrase of designatedWords) {
      const tokens = normalizedTokens(phrase);
      assert.ok(
        includesTokenSequence(sentenceTokens, tokens) || includesTokenSequence(metadata, tokens),
        `${id}: designated word ${JSON.stringify(phrase)} is neither in sentence nor designatedWords metadata`,
      );
    }
  }
});

test('known translation-choice distractors do not repeat the correct Japanese meaning', () => {
  const cases = [
    ['term2k-wb-p49-l18-s2-1-3', '医者は私に隣の部屋で待ち続けさせた。'],
    ['term2k-wb-p65-fe-5-2', 'アンは自分の2倍の年齢の人たちに話しかけるのを楽しんだ。'],
    ['term2k-eg-p55-explus-3-1', '彼女は目を閉じられた状態で仕事のことを考えていた。'],
  ];
  for (const [id, distractor] of cases) {
    const question = byId.get(id);
    assert.ok(question, `${id}: known question must exist`);
    assert.ok(!question.choices?.includes(distractor), `${id}: duplicate/incorrectly close distractor remains`);
  }
});

test('all 42 translation-choice prompts tell students to choose a Japanese translation', () => {
  const questions = REGULAR_2KIMATSU_QUESTIONS.filter((question) => question.translationChoice);
  assert.equal(questions.length, 42);
  for (const question of questions) {
    assert.match(question.prompt ?? '', /日本語.{0,20}(選|選び|選択)/, `${question.id}: prompt must direct selection of Japanese`);
    assert.doesNotMatch(question.prompt ?? '', /日本語に訳し(?:なさい|なさい。)|日本語に直しなさい/, `${question.id}: prompt must not ask students to write a translation`);
  }
});

test('EXPLUS 3 questions show completed English without source choice brackets and underline the answer phrase', () => {
  const correctPhrases = { 1: 'closed', 2: 'shining', 3: 'left', 4: 'standing' };
  for (const suffix of [1, 2, 3, 4]) {
    const id = `term2k-eg-p55-explus-3-${suffix}`;
    const question = byId.get(id);
    assert.ok(question, `${id}: known question must exist`);
    assert.doesNotMatch(question.sentence ?? '', /\[[^\]]*\/[^\]]*\]/, `${id}: source alternatives remain in the displayed sentence`);
    const underlinedPhrases = [...(question.sentence ?? '').matchAll(/<u>(.*?)<\/u>/gi)].map((match) => match[1]);
    assert.deepEqual(underlinedPhrases.map((phrase) => phrase.toLowerCase()), [correctPhrases[suffix]], `${id}: underline must mark the correct English phrase`);
  }
});

test('the (b) comparison sentence no longer carries eat it all forward', () => {
  const question = byId.get('term2k-wb-p54-fe-4-5');
  assert.ok(question, 'known item must exist');
  const partB = question.sentence.split(/\(b\)/i)[1] ?? '';
  assert.doesNotMatch(partB, /eat it all/i);
});

test('the as ... as rewrite rejects so ... as alternatives', () => {
  const question = byId.get('term2k-wb-p64-fe-3-1');
  assert.ok(question, 'known item must exist');
  assert.ok(question.accepted?.length, 'accepted answers must be explicit');
  assert.ok(question.accepted.every((answer) => !/\bso\b/i.test(answer)), 'only as ... as forms are permitted by the instruction');
});
