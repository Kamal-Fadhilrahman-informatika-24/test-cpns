/**
 * questionGenerator.js
 * ─────────────────────────────────────────────
 * Smart question generator for CPNS Deret Angka simulation.
 * Supports 7 pattern types across 3 difficulty levels.
 *
 * Output format:
 * {
 *   id: string,
 *   sequence: number[],   // 4 numbers + null (the "?")
 *   options: number[],    // 4 shuffled choices
 *   correctAnswer: number,
 *   type: string,
 *   description: string   // pattern hint shown to user
 * }
 */

// ─── Helpers ────────────────────────────────────────────

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Generate smart distractors — values close to correctAnswer
 * that mimic common calculation mistakes.
 */
function makeDistractors(answer, count = 3) {
  const set = new Set()
  // Common mistake offsets: ±1, ±2, ±step variations
  const offsets = [-1, 1, -2, 2, -3, 3, -4, 4, -5, 5, -10, 10]
  let i = 0
  while (set.size < count && i < 60) {
    const multiplier = Math.floor(i / offsets.length) + 1
    const candidate = answer + offsets[i % offsets.length] * multiplier
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

// ─── Pattern Generators ──────────────────────────────────

function genAddition() {
  const start = rand(1, 20)
  const diff  = rand(2, 12)
  const seq   = [0, 1, 2, 3, 4].map(i => start + diff * i)
  return {
    sequence: seq.slice(0, 4),
    answer:   seq[4],
    description: `+${diff}`
  }
}

function genSubtraction() {
  const diff  = rand(2, 10)
  const start = rand(diff * 5 + 5, diff * 5 + 60) // ensure positive result
  const seq   = [0, 1, 2, 3, 4].map(i => start - diff * i)
  return {
    sequence: seq.slice(0, 4),
    answer:   seq[4],
    description: `-${diff}`
  }
}

function genMultiplication() {
  const start = rand(1, 4)
  const ratio = rand(2, 3)
  const seq   = [0, 1, 2, 3, 4].map(i => start * Math.pow(ratio, i))
  return {
    sequence: seq.slice(0, 4),
    answer:   Math.round(seq[4]),
    description: `×${ratio}`
  }
}

function genDivision() {
  const ratio = rand(2, 3)
  // Start from ratio^5 * multiplier so all values are integers
  const base  = Math.pow(ratio, 5)
  const multi = rand(1, 4)
  const start = base * multi
  const seq   = [0, 1, 2, 3, 4].map(i => start / Math.pow(ratio, i))
  return {
    sequence: seq.slice(0, 4),
    answer:   Math.round(seq[4]),
    description: `÷${ratio}`
  }
}

function genStepped() {
  // Differences increase by 1 each step: +2, +3, +4, +5, +6
  const start    = rand(1, 10)
  const initDiff = rand(1, 3)
  let cur = start
  const seq = [start]
  for (let i = 1; i <= 5; i++) {
    cur += initDiff + i
    seq.push(cur)
  }
  return {
    sequence: seq.slice(0, 4),
    answer:   seq[4],
    description: 'Pola Bertingkat'
  }
}

function genMixed() {
  // Alternates: +add, ×mul, +add, ×mul ...
  const add  = rand(2, 6)
  const mul  = 2
  const start = rand(2, 8)
  let cur = start
  const seq = [start]
  for (let i = 0; i < 5; i++) {
    cur = i % 2 === 0 ? cur + add : cur * mul
    seq.push(cur)
  }
  return {
    sequence: seq.slice(0, 4),
    answer:   seq[4],
    description: `+${add} / ×${mul}`
  }
}

function genAlternating() {
  // Two separate sub-sequences interleaved
  const startA = rand(2, 10)
  const startB = rand(2, 10)
  const diffA  = rand(2, 8)
  const diffB  = rand(2, 6)
  // Build 8-element sequence, take first 5
  const full = []
  for (let i = 0; i < 4; i++) {
    full.push(startA + diffA * i) // even indices: 0,2,4,6
    full.push(startB + diffB * i) // odd indices:  1,3,5,7
  }
  return {
    sequence: full.slice(0, 4),
    answer:   full[4],
    description: `Selang-seling +${diffA}/+${diffB}`
  }
}

// ─── Main Generators ─────────────────────────────────────

const GENERATORS = {
  easy:   [genAddition, genSubtraction],
  medium: [genMultiplication, genDivision, genStepped],
  hard:   [genMixed, genAlternating, genStepped, genMultiplication]
}

/**
 * Generate a single question for given level
 * @param {'easy'|'medium'|'hard'} level
 * @returns {object} question object
 */
export function generateQuestion(level = 'easy') {
  const pool = GENERATORS[level] || GENERATORS.easy
  const genFn = pool[Math.floor(Math.random() * pool.length)]

  let result
  let attempts = 0

  // Retry if result is invalid (edge cases)
  do {
    result = genFn()
    attempts++
  } while (
    attempts < 10 &&
    (
      !Number.isFinite(result.answer) ||
      result.answer <= 0 ||
      result.answer > 99999 ||
      !Number.isInteger(result.answer)
    )
  )

  if (!Number.isFinite(result.answer) || result.answer <= 0) {
    // Ultimate fallback to simple addition
    return generateQuestion('easy')
  }

  const distractors = makeDistractors(result.answer, 3)
  const options = shuffle([result.answer, ...distractors])

  return {
    id: Math.random().toString(36).slice(2, 11),
    sequence: [...result.sequence, null], // null = "?"
    options,
    correctAnswer: result.answer,
    type: genFn.name,
    description: result.description
  }
}

/**
 * Generate multiple questions for a session
 * @param {number} count
 * @param {'easy'|'medium'|'hard'} level
 * @returns {object[]}
 */
export function generateQuestions(count = 10, level = 'easy') {
  return Array.from({ length: count }, () => generateQuestion(level))
}
