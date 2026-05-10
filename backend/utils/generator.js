/**
 * utils/generator.js
 * Core question generation algorithm — runs on Node.js server.
 * Identical logic to frontend/src/utils/questionGenerator.js
 * so server and client produce the same format.
 */

'use strict'

// ─── Helpers ─────────────────────────────────────────────────
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function makeDistractors(answer, count = 3) {
  const set = new Set()
  const offsets = [-1, 1, -2, 2, -3, 3, -4, 4, -5, 5, -10, 10]
  let i = 0
  while (set.size < count && i < 60) {
    const multiplier = Math.floor(i / offsets.length) + 1
    const candidate  = answer + offsets[i % offsets.length] * multiplier
    if (
      candidate !== answer &&
      candidate > 0 &&
      Number.isFinite(candidate) &&
      candidate < 99999 &&
      Number.isInteger(candidate)
    ) {
      set.add(candidate)
    }
    i++
  }
  return Array.from(set).slice(0, count)
}

// ─── Pattern Generators ───────────────────────────────────────

function genAddition() {
  const start = rand(1, 20), diff = rand(2, 12)
  const seq = [0,1,2,3,4].map(i => start + diff * i)
  return { sequence: seq.slice(0,4), answer: seq[4], description: `+${diff}` }
}

function genSubtraction() {
  const diff = rand(2, 10)
  const start = rand(diff * 5 + 5, diff * 5 + 60)
  const seq = [0,1,2,3,4].map(i => start - diff * i)
  return { sequence: seq.slice(0,4), answer: seq[4], description: `-${diff}` }
}

function genMultiplication() {
  const start = rand(1, 4), ratio = rand(2, 3)
  const seq = [0,1,2,3,4].map(i => start * Math.pow(ratio, i))
  return { sequence: seq.slice(0,4), answer: Math.round(seq[4]), description: `×${ratio}` }
}

function genDivision() {
  const ratio = rand(2, 3)
  const start = Math.pow(ratio, 5) * rand(1, 4)
  const seq = [0,1,2,3,4].map(i => start / Math.pow(ratio, i))
  return { sequence: seq.slice(0,4), answer: Math.round(seq[4]), description: `÷${ratio}` }
}

function genStepped() {
  const start = rand(1, 10), initDiff = rand(1, 3)
  let cur = start; const seq = [start]
  for (let i = 1; i <= 5; i++) { cur += initDiff + i; seq.push(cur) }
  return { sequence: seq.slice(0,4), answer: seq[4], description: 'Pola Bertingkat' }
}

function genMixed() {
  const add = rand(2,6), start = rand(2,8)
  let cur = start; const seq = [start]
  for (let i = 0; i < 5; i++) {
    cur = i % 2 === 0 ? cur + add : cur * 2; seq.push(cur)
  }
  return { sequence: seq.slice(0,4), answer: seq[4], description: `+${add}/×2` }
}

function genAlternating() {
  const startA = rand(2,10), startB = rand(2,10)
  const diffA  = rand(2,8),  diffB  = rand(2,6)
  const full = []
  for (let i = 0; i < 4; i++) {
    full.push(startA + diffA * i)
    full.push(startB + diffB * i)
  }
  return {
    sequence: full.slice(0,4),
    answer: full[4],
    description: `Selang-seling +${diffA}/+${diffB}`
  }
}

// ─── Level Mapping ────────────────────────────────────────────

const GENERATORS = {
  easy:   [genAddition, genSubtraction],
  medium: [genMultiplication, genDivision, genStepped],
  hard:   [genMixed, genAlternating, genStepped, genMultiplication]
}

// ─── Public API ───────────────────────────────────────────────

/**
 * Generate a single question
 * @param {'easy'|'medium'|'hard'} level
 * @returns {object}
 */
function generateQuestion(level = 'easy') {
  const pool  = GENERATORS[level] || GENERATORS.easy
  const genFn = pool[Math.floor(Math.random() * pool.length)]

  let result, attempts = 0
  do {
    result = genFn()
    attempts++
  } while (
    attempts < 10 &&
    (!Number.isFinite(result.answer) || result.answer <= 0 || result.answer > 99999)
  )

  if (!Number.isFinite(result.answer) || result.answer <= 0) {
    return generateQuestion('easy')
  }

  const distractors = makeDistractors(result.answer, 3)
  const options      = shuffle([result.answer, ...distractors])

  return {
    id:            Math.random().toString(36).slice(2, 11),
    sequence:      [...result.sequence, null],
    options,
    correctAnswer: result.answer,
    type:          genFn.name,
    description:   result.description
  }
}

/**
 * Generate multiple questions
 * @param {number} count
 * @param {'easy'|'medium'|'hard'} level
 * @returns {object[]}
 */
function generateQuestions(count = 10, level = 'easy') {
  return Array.from({ length: count }, () => generateQuestion(level))
}

module.exports = { generateQuestion, generateQuestions }
