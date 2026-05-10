/**
 * QuizPage.jsx
 * Main quiz session: timer, questions, scoring, streak system.
 */
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { LEVELS } from './HomePage.jsx'
import { generateQuestions } from '../utils/questionGenerator.js'
import TimerBar from '../components/TimerBar.jsx'
import QuestionCard from '../components/QuestionCard.jsx'

export default function QuizPage({ level, onFinish, sounds }) {
  const cfg = LEVELS[level]

  // ── State ────────────────────────────────────────────────
  const [questions]     = useState(() => generateQuestions(cfg.questions, level))
  const [currentIdx,    setCurrentIdx]    = useState(0)
  const [score,         setScore]         = useState(0)
  const [answers,       setAnswers]       = useState([])
  const [selected,      setSelected]      = useState(null)   // chosen option
  const [showFeedback,  setShowFeedback]  = useState(false)  // locked after pick
  const [timeLeft,      setTimeLeft]      = useState(cfg.time)
  const [streak,        setStreak]        = useState(0)
  const [shake,         setShake]         = useState(false)
  const [visible,       setVisible]       = useState(true)   // for fade transition

  // ── Refs (avoid stale closures) ──────────────────────────
  const timerRef      = useRef(null)
  const finishedRef   = useRef(false)
  const scoreRef      = useRef(0)
  const answersRef    = useRef([])
  const streakRef     = useRef(0)

  scoreRef.current   = score
  answersRef.current = answers
  streakRef.current  = streak

  // ── Finish helper ─────────────────────────────────────────
  const doFinish = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    clearInterval(timerRef.current)
    onFinish({
      score:   scoreRef.current,
      answers: answersRef.current,
      level,
      total:   cfg.questions
    })
  }, [onFinish, level, cfg.questions])

  // ── Timer ─────────────────────────────────────────────────
  const startTimer = useCallback(() => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 11 && t > 0) sounds.playTimerWarn()
        if (t <= 1) {
          clearInterval(timerRef.current)
          doFinish()
          return 0
        }
        return t - 1
      })
    }, 1000)
  }, [doFinish, sounds])

  useEffect(() => {
    startTimer()
    return () => clearInterval(timerRef.current)
  }, []) // only on mount

  // ── Answer Handler ────────────────────────────────────────
  const handleAnswer = useCallback((option) => {
    if (showFeedback || finishedRef.current) return

    // Pause timer while showing feedback
    clearInterval(timerRef.current)
    sounds.playClick()

    const isCorrect = option === questions[currentIdx].correctAnswer
    setSelected(option)
    setShowFeedback(true)

    // Streak logic
    const newStreak = isCorrect ? streakRef.current + 1 : 0
    setStreak(newStreak)

    // Scoring
    const bonus     = isCorrect && newStreak >= 3 ? 5 : 0
    const earned    = isCorrect ? 10 + bonus : 0
    const newScore  = scoreRef.current + earned
    setScore(newScore)
    scoreRef.current = newScore

    // Record answer
    const newAnswers = [
      ...answersRef.current,
      {
        question:   questions[currentIdx],
        selected:   option,
        correct:    isCorrect,
        earned
      }
    ]
    setAnswers(newAnswers)
    answersRef.current = newAnswers

    // Sound feedback
    if (isCorrect) {
      sounds.playCorrect()
    } else {
      sounds.playWrong()
      setShake(true)
      setTimeout(() => setShake(false), 600)
    }

    // Advance after 900ms
    setTimeout(() => {
      const isLast = currentIdx + 1 >= cfg.questions
      if (isLast) {
        doFinish()
        return
      }

      // Fade out → swap question → fade in
      setVisible(false)
      setTimeout(() => {
        setCurrentIdx(i => i + 1)
        setSelected(null)
        setShowFeedback(false)
        setVisible(true)
        startTimer() // resume timer for next question
      }, 180)
    }, 900)
  }, [showFeedback, currentIdx, questions, cfg.questions, sounds, doFinish, startTimer])

  // ── Current question ──────────────────────────────────────
  const q        = questions[currentIdx]
  const progress = (currentIdx / cfg.questions) * 100

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-lg mx-auto mt-4">

        {/* ── Top Bar ──────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${cfg.bg}`} />
            <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
              {cfg.label}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {streak >= 3 && (
              <span className="text-xs bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 px-2.5 py-1 rounded-full font-extrabold animate-bounce">
                🔥 {streak}x Streak!
              </span>
            )}
            <span className="text-base font-black text-indigo-600 dark:text-indigo-400">
              {score}
              <span className="text-xs font-normal text-gray-400 ml-1">pts</span>
            </span>
          </div>
        </div>

        {/* ── Question Progress Bar ─────────────────────────── */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-400 font-bold tabular-nums w-12 text-right">
            {currentIdx + 1}/{cfg.questions}
          </span>
        </div>

        {/* ── Timer ─────────────────────────────────────────── */}
        <div className="mb-4">
          <TimerBar timeLeft={timeLeft} totalTime={cfg.time} />
        </div>

        {/* ── Question + Options ────────────────────────────── */}
        <div
          className="transition-opacity duration-180"
          style={{ opacity: visible ? 1 : 0 }}
        >
          <QuestionCard
            question={q}
            questionNumber={currentIdx + 1}
            totalQuestions={cfg.questions}
            selectedAnswer={selected}
            onAnswer={handleAnswer}
            shake={shake}
          />
        </div>

        {/* ── Feedback hint ─────────────────────────────────── */}
        {showFeedback && selected !== null && (
          <p className={`text-center text-sm font-bold mt-4 transition-all ${
            selected === q.correctAnswer
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-rose-500 dark:text-rose-400'
          }`}>
            {selected === q.correctAnswer
              ? streak >= 3
                ? `✅ Benar! +10 +5 bonus (streak ${streak}x)`
                : '✅ Benar! +10 pts'
              : `❌ Salah. Jawaban: ${q.correctAnswer}`}
          </p>
        )}
      </div>
    </div>
  )
}
