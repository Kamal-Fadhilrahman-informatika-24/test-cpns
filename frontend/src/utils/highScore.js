/**
 * highScore.js
 * Manage high scores & session history using localStorage
 */

const HS_KEY      = 'cpns_highscores'
const HISTORY_KEY = 'cpns_history'

// ─── High Scores (top 10 all-time) ───────────────────────

/**
 * @returns {Array<{score, level, accuracy, date}>}
 */
export function getHighScores() {
  try {
    return JSON.parse(localStorage.getItem(HS_KEY) || '[]')
  } catch {
    return []
  }
}

/**
 * Save a new score entry and keep only top 10
 * @param {{ score: number, level: string, accuracy: number }} entry
 */
export function saveHighScore(entry) {
  const scores = getHighScores()
  scores.push({
    score:    entry.score,
    level:    entry.level,
    accuracy: entry.accuracy,
    date:     new Date().toLocaleDateString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric'
    })
  })
  scores.sort((a, b) => b.score - a.score)
  localStorage.setItem(HS_KEY, JSON.stringify(scores.slice(0, 10)))
}

/** Get the best (highest) score entry */
export function getBestScore() {
  const scores = getHighScores()
  return scores[0] || null
}

/** Clear all high scores */
export function clearHighScores() {
  localStorage.removeItem(HS_KEY)
}

// ─── Session History (recent 20 games) ───────────────────

/**
 * @returns {Array}
 */
export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
  } catch {
    return []
  }
}

/**
 * Save completed session to history
 */
export function saveHistory(session) {
  const history = getHistory()
  history.unshift({
    ...session,
    playedAt: new Date().toISOString()
  })
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 20)))
}
