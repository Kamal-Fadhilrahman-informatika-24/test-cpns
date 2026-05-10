'use strict'

const app = require('./app')

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`\n✅  CPNS Numerik API berjalan di http://localhost:${PORT}`)
  console.log(`📋  Endpoints:`)
  console.log(`    GET  http://localhost:${PORT}/api/questions?level=easy&count=10`)
  console.log(`    POST http://localhost:${PORT}/api/result`)
  console.log(`    GET  http://localhost:${PORT}/api/leaderboard\n`)
})