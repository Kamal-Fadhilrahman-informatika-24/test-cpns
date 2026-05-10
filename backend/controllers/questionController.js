/**
 * controllers/questionController.js
 * Handles HTTP request/response for question endpoints.
 * Calls questionService for business logic.
 */

'use strict'

const { getQuestions, getOneQuestion } = require('../services/questionService')

/**
 * GET /api/questions?level=easy&count=10
 */
function getQuestionsHandler(req, res) {
  try {
    const { level = 'easy', count = 10 } = req.query
    const result = getQuestions(level, count)

    return res.status(200).json({
      success:   true,
      questions: result.questions,
      meta:      result.meta
    })
  } catch (err) {
    console.error('[questionController] Error generating questions:', err.message)
    return res.status(500).json({
      success: false,
      error:   'Gagal membuat soal. Coba lagi.'
    })
  }
}

/**
 * GET /api/questions/single?level=medium
 */
function getSingleQuestion(req, res) {
  try {
    const { level = 'easy' } = req.query
    const question = getOneQuestion(level)
    return res.status(200).json({ success: true, question })
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Gagal membuat soal.' })
  }
}

module.exports = { getQuestionsHandler, getSingleQuestion }
