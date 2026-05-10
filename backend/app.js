/**
 * server.js
 * Express server entry point.
 *
 * Routes:
 *   GET  /api/questions          → generate soal
 *   GET  /api/questions/single   → satu soal
 *   POST /api/result             → simpan hasil
 *   GET  /api/result             → daftar hasil
 *   GET  /api/leaderboard        → top scores
 *   POST /api/leaderboard        → tambah skor
 *   GET  /api/health             → health check
 */

'use strict'

const express    = require('express')
const cors       = require('cors')

const questionRoutes    = require('./routes/questionRoutes')
const resultRoutes      = require('./routes/resultRoutes')
const leaderboardRoutes = require('./routes/leaderboardRoutes')

const app  = express()
const PORT = process.env.PORT || 3001

// ── Middleware ────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:4173', '*'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: false }))

// Request logger (development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
    next()
  })
}

// ── Routes ────────────────────────────────────────────────
app.use('/api/questions',   questionRoutes)
app.use('/api/result',      resultRoutes)
app.use('/api/leaderboard', leaderboardRoutes)

// Health check
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status:  'ok',
    service: 'CPNS Numerik API',
    time:    new Date().toISOString()
  })
})

// Root
app.get('/', (_req, res) => {
  res.json({ message: 'CPNS Numerik API — gunakan /api/questions untuk soal.' })
})

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint tidak ditemukan.' })
})

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('[Server Error]', err)
  res.status(500).json({ success: false, error: 'Internal server error.' })
})


module.exports = app
