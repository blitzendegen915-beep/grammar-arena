import test from 'node:test'
import assert from 'node:assert/strict'
import { isModerationBlocked, MODERATION_NOTICE } from './contentModeration.js'

test('blocks direct Japanese insults, threats, and sexual expressions', () => {
  for (const value of ['死ね', 'お前はバカだ', 'ち ん こ', 'セックス', 'チビ', 'キモい', 'うざい', 'レイプ']) {
    assert.equal(isModerationBlocked(value), true, value)
  }
})

test('blocks common English profanity without blocking ordinary words', () => {
  assert.equal(isModerationBlocked('you are an asshole'), true)
  assert.equal(isModerationBlocked('you are an idiot'), true)
  assert.equal(isModerationBlocked('f.u.c.k'), true)
  assert.equal(isModerationBlocked('ＳＨＩＴ'), true)
  assert.equal(isModerationBlocked('The class is ready.'), false)
  assert.equal(isModerationBlocked('Our purpose is to help the poor.'), false)
})

test('blocks kana and separator variations used to evade the filter', () => {
  assert.equal(isModerationBlocked('バ カ'), true)
  assert.equal(isModerationBlocked('せっ・く・す'), true)
  assert.equal(isModerationBlocked('チー牛'), true)
  assert.equal(isModerationBlocked('d-u-m-b-a-s-s'), true)
})

test('allows ordinary educational Japanese text', () => {
  assert.equal(isModerationBlocked('ばかりではありません'), false)
  assert.equal(isModerationBlocked('服を買うために原宿へ行きました'), false)
})

test('provides a neutral user-facing message without repeating blocked terms', () => {
  assert.match(MODERATION_NOTICE, /不適切な表現/)
  assert.doesNotMatch(MODERATION_NOTICE, /死ね|ちんこ|fuck/i)
})
