/**
 * routes/resultRoutes.js
 * POST /api/result  — store quiz result
 * GET  /api/result  — get recent results
 */

'use strict'

const express = require('express')
const router  = express.Router()

// In-memory store (replace with MongoDB for production)
const results = []

/**
 * POST /api/result
 * Body: { score, correct, wrong, accuracy, level, name? }
 */
router.post('/', (req, res) => {
  const { score, correct, wrong, accuracy, level, name = 'Anonim' } = req.body

  if (typeof score !== 'number' || score < 0) {
    return res.status(400).json({ success: false, error: 'Data skor tidak valid.' })
  }

  const entry = {
    id:        Date.now(),
    name:      String(name).slice(0, 30),
    score,
    correct:   correct  || 0,
    wrong:     wrong    || 0,
    accuracy:  accuracy || 0,
    level:     level    || 'easy',
    createdAt: new Date().toISOString()
  }

  results.push(entry)

  // Keep only last 200 entries
  if (results.length > 200) results.shift()

  return res.status(201).json({ success: true, entry })
})

/**
 * GET /api/result
 */
router.get('/', (req, res) => {
  const page  = parseInt(req.query.page  || '1',  10)
  const limit = parseInt(req.query.limit || '20', 10)
  const start = (page - 1) * limit
  const slice = results.slice(-limit * page).reverse().slice(start, start + limit)

  return res.status(200).json({
    success: true,
    results: slice,
    total:   results.length
  })
})

module.exports = router
