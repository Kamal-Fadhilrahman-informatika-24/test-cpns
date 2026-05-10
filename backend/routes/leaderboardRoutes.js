/**
 * routes/leaderboardRoutes.js
 * GET  /api/leaderboard  — top scores
 * POST /api/leaderboard  — submit a score
 */

'use strict'

const express     = require('express')
const router      = express.Router()

const leaderboard = []

router.get('/', (req, res) => {
  const sorted = [...leaderboard]
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
  return res.status(200).json({ success: true, leaderboard: sorted })
})

router.post('/', (req, res) => {
  const { name = 'Anonim', score, level, accuracy } = req.body
  if (typeof score !== 'number') {
    return res.status(400).json({ success: false, error: 'Score wajib berupa angka.' })
  }

  leaderboard.push({
    name:     String(name).slice(0, 30),
    score,
    level:    level    || 'easy',
    accuracy: accuracy || 0,
    date:     new Date().toLocaleDateString('id-ID')
  })

  if (leaderboard.length > 500) leaderboard.shift()

  return res.status(201).json({ success: true, message: 'Skor berhasil disimpan.' })
})

module.exports = router
