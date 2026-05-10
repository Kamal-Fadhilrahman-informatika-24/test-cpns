/**
 * services/questionService.js
 * Business logic layer for question generation.
 * Controllers call this; this calls utils/generator.
 */

'use strict'

const { generateQuestion, generateQuestions } = require('../utils/generator')

const VALID_LEVELS = ['easy', 'medium', 'hard']
const MAX_COUNT    = 30
const MIN_COUNT    = 1

/**
 * Validate and sanitize inputs, then generate questions.
 * @param {string} level
 * @param {number|string} count
 * @returns {{ questions: object[], meta: object }}
 */
function getQuestions(level = 'easy', count = 10) {
  // Sanitize level
  const safeLevel = VALID_LEVELS.includes(level) ? level : 'easy'

  // Sanitize count
  const rawCount = parseInt(count, 10)
  const safeCount = isNaN(rawCount)
    ? 10
    : Math.max(MIN_COUNT, Math.min(MAX_COUNT, rawCount))

  const questions = generateQuestions(safeCount, safeLevel)

  return {
    questions,
    meta: {
      level:     safeLevel,
      count:     safeCount,
      generated: new Date().toISOString()
    }
  }
}

/**
 * Generate a single question (used internally or for preview)
 */
function getOneQuestion(level = 'easy') {
  const safeLevel = VALID_LEVELS.includes(level) ? level : 'easy'
  return generateQuestion(safeLevel)
}

module.exports = { getQuestions, getOneQuestion }
