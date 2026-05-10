/**
 * ResultPage.jsx
 * Shows score summary, accuracy bar, evaluation label, and answer review.
 */
import React from 'react'
import { LEVELS } from './HomePage.jsx'

// ─── Evaluation Logic ─────────────────────────────────────
function getEvaluation(accuracy) {
  if (accuracy >= 80) return {
    label:     'Sangat Baik',
    emoji:     '🏆',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    bg:        'bg-emerald-50 dark:bg-emerald-900/20',
    border:    'border-emerald-200 dark:border-emerald-800',
    tip:       'Pertahankan! Kamu siap menghadapi tes CPNS.'
  }
  if (accuracy >= 60) return {
    label:     'Baik',
    emoji:     '👍',
    textColor: 'text-amber-600 dark:text-amber-400',
    bg:        'bg-amber-50 dark:bg-amber-900/20',
    border:    'border-amber-200 dark:border-amber-800',
    tip:       'Lumayan! Terus berlatih untuk hasil lebih baik.'
  }
  return {
    label:     'Perlu Latihan',
    emoji:     '📚',
    textColor: 'text-rose-600 dark:text-rose-400',
    bg:        'bg-rose-50 dark:bg-rose-900/20',
    border:    'border-rose-200 dark:border-rose-800',
    tip:       'Jangan menyerah! Pahami pola dan coba lagi.'
  }
}

// ─── Stat Box ─────────────────────────────────────────────
function StatBox({ value, label, color }) {
  return (
    <div className={`${color} rounded-xl p-3 text-center`}>
      <p className="text-2xl font-black">{value}</p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{label}</p>
    </div>
  )
}

// ─── Review Row ───────────────────────────────────────────
function ReviewRow({ entry, index }) {
  const { question, selected, correct, earned } = entry
  const seqText = question.sequence.map(n => n === null ? '?' : n).join(', ')

  return (
    <div className={`flex items-center justify-between text-xs p-2.5 rounded-xl gap-2 ${
      correct
        ? 'bg-emerald-50 dark:bg-emerald-900/20'
        : 'bg-rose-50 dark:bg-rose-900/20'
    }`}>
      {/* Sequence */}
      <span className="text-gray-500 dark:text-gray-400 font-mono flex-1 truncate">
        [{seqText}]
      </span>

      {/* Answer display */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {correct ? (
          <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
            {selected} ✓
          </span>
        ) : (
          <>
            <span className="text-rose-400 line-through">{selected}</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
              {question.correctAnswer} ✓
            </span>
          </>
        )}
        {earned > 10 && (
          <span className="text-orange-500 font-bold text-xs">🔥</span>
        )}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────
export default function ResultPage({ result, onRestart, onHome }) {
  const { score, answers, level, total } = result

  const correct    = answers.filter(a => a.correct).length
  const wrong      = answers.filter(a => !a.correct).length
  const unanswered = total - answers.length
  const accuracy   = total > 0 ? Math.round((correct / total) * 100) : 0
  const evaluation = getEvaluation(accuracy)
  const levelCfg   = LEVELS[level]

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-lg mx-auto mt-4 animate-scaleIn">

        {/* ── Evaluation Badge ──────────────────────────── */}
        <div className={`rounded-3xl ${evaluation.bg} border-2 ${evaluation.border} p-6 text-center mb-4 shadow-sm`}>
          <div className="text-5xl mb-3">{evaluation.emoji}</div>
          <h2 className={`text-2xl font-black mb-1 ${evaluation.textColor}`}>
            {evaluation.label}
          </h2>
          <p className="text-gray-400 dark:text-gray-500 text-xs capitalize">
            Level: {levelCfg?.label || level}
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 italic">
            "{evaluation.tip}"
          </p>
        </div>

        {/* ── Score Card ────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 mb-4">
          {/* Big score */}
          <div className="text-center mb-4">
            <p className="text-5xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {score}
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Total Poin</p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <StatBox
              value={correct}
              label="Benar"
              color="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
            />
            <StatBox
              value={wrong}
              label="Salah"
              color="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400"
            />
            <StatBox
              value={unanswered}
              label="Tidak Dijawab"
              color="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400"
            />
          </div>

          {/* Accuracy bar */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-bold text-gray-400">Akurasi</span>
              <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                {accuracy}%
              </span>
            </div>
            <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
                style={{ width: `${accuracy}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── Answer Review ─────────────────────────────── */}
        {answers.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 mb-4">
            <h3 className="font-extrabold text-gray-800 dark:text-white mb-3 text-sm flex items-center gap-1.5">
              📝 Review Jawaban
            </h3>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {answers.map((entry, i) => (
                <ReviewRow key={i} entry={entry} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* ── Action Buttons ────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onHome}
            className="btn-secondary"
          >
            🏠 Beranda
          </button>
          <button
            onClick={() => onRestart(level)}
            className="btn-primary"
          >
            🔄 Coba Lagi
          </button>
        </div>

        {/* Scoring legend */}
        <p className="text-center text-xs text-gray-300 dark:text-gray-700 mt-4">
          ≥80% = Sangat Baik · ≥60% = Baik · &lt;60% = Perlu Latihan
        </p>
      </div>
    </div>
  )
}
