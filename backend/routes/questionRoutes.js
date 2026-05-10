/**
 * routes/questionRoutes.js
 * Defines API routes for questions.
 *
 * GET /api/questions         → list of questions
 * GET /api/questions/single  → single question
 */

'use strict'

const express    = require('express')
const router     = express.Router()
const controller = require('../controllers/questionController')

// GET /api/questions?level=easy&count=10
router.get('/', controller.getQuestionsHandler)

// GET /api/questions/single?level=medium
router.get('/single', controller.getSingleQuestion)

module.exports = router
