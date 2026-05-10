/**
 * App.jsx
 * Root component — manages page routing (home / quiz / result),
 * dark mode, sound system, and high score persistence.
 */
import React, { useState } from 'react'

import { useDarkMode }            from './hooks/useDarkMode.js'
import { useSound }               from './hooks/useSound.js'
import { getHighScores, saveHighScore } from './utils/highScore.js'

import Navbar     from './components/Navbar.jsx'
import HomePage   from './pages/HomePage.jsx'
import QuizPage   from './pages/QuizPage.jsx'
import ResultPage from './pages/ResultPage.jsx'

export default function App() {
  // ── Global state ────────────────────────────────────────
  const [page,       setPage]       = useState('home')   // 'home' | 'quiz' | 'result'
  const [level,      setLevel]      = useState('easy')
  const [result,     setResult]     = useState(null)
  const [highScores, setHighScores] = useState(() => getHighScores())
  const [quizKey,    setQuizKey]    = useState(0)        // force-remount QuizPage

  // ── Hooks ────────────────────────────────────────────────
  const [dark, toggleDark] = useDarkMode()
  const sounds             = useSound()

  // ── Handlers ─────────────────────────────────────────────
  const handleStart = (selectedLevel) => {
    sounds.playClick()
    setLevel(selectedLevel)
    setQuizKey(k => k + 1)   // fresh mount each new game
    setPage('quiz')
  }

  const handleFinish = (res) => {
    // Calculate accuracy
    const correct  = res.answers.filter(a => a.correct).length
    const accuracy = res.total > 0
      ? Math.round((correct / res.total) * 100)
      : 0

    // Persist high score
    saveHighScore({ score: res.score, level: res.level, accuracy })
    setHighScores(getHighScores())

    setResult({ ...res, accuracy })
    setPage('result')
  }

  const handleRestart = (lvl) => {
    sounds.playClick()
    setLevel(lvl)
    setQuizKey(k => k + 1)
    setPage('quiz')
  }

  const handleHome = () => {
    sounds.playClick()
    setPage('home')
  }

  // ── Render ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
      {/* Fixed Navbar — always visible */}
      <Navbar
        soundOn={sounds.soundOn}
        onSoundToggle={sounds.toggleSound}
        dark={dark}
        onDarkToggle={toggleDark}
        onHome={handleHome}
      />

      {/* Page router */}
      {page === 'home' && (
        <HomePage
          onStart={handleStart}
          highScores={highScores}
        />
      )}

      {page === 'quiz' && (
        <QuizPage
          key={quizKey}               // remount on new game
          level={level}
          onFinish={handleFinish}
          sounds={sounds}
        />
      )}

      {page === 'result' && result && (
        <ResultPage
          result={result}
          onRestart={handleRestart}
          onHome={handleHome}
        />
      )}
    </div>
  )
}
