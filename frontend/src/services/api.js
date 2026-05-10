/**
 * api.js
 * Axios wrapper for backend API calls.
 * If the API is unavailable, functions fall back to local generation.
 */
import axios from 'axios'
import { generateQuestions } from '../utils/questionGenerator.js'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 6000,
  headers: { 'Content-Type': 'application/json' }
})

/**
 * GET /api/questions?level=easy&count=10
 * Returns array of question objects.
 * Falls back to client-side generation if API fails.
 */
export async function fetchQuestions(level = 'easy', count = 10) {
  try {
    const { data } = await apiClient.get('/questions', {
      params: { level, count }
    })
    if (data.success && Array.isArray(data.questions)) {
      return data.questions
    }
    throw new Error('Invalid API response')
  } catch {
    // Graceful fallback — generate locally
    console.info('[API] Fallback: generating questions locally')
    return generateQuestions(count, level)
  }
}

/**
 * POST /api/result
 * Submit quiz result to backend (optional, non-critical).
 */
export async function submitResult(result) {
  try {
    const { data } = await apiClient.post('/result', result)
    return data
  } catch {
    return null
  }
}

/**
 * GET /api/leaderboard
 */
export async function fetchLeaderboard() {
  try {
    const { data } = await apiClient.get('/leaderboard')
    return data.leaderboard || []
  } catch {
    return []
  }
}
