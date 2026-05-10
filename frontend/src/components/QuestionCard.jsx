/**
 * QuestionCard.jsx
 * Displays the number sequence and 4 answer options.
 * Handles visual feedback (green/red) after answer selection.
 */
import React from 'react'

// ─── Sequence Display ─────────────────────────────────────
function SequenceBox({ value, isQuestion }) {
  if (isQuestion) {
    return (
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center
                      border-2 border-dashed border-indigo-400
                      bg-indigo-50 dark:bg-indigo-900/30
                      text-indigo-500 text-2xl font-black
                      animate-popIn">
        ?
      </div>
    )
  }
  return (
    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center
                    border-2 border-gray-100 dark:border-gray-600
                    bg-gray-50 dark:bg-gray-700/60
                    text-gray-800 dark:text-white
                    text-base sm:text-lg font-extrabold">
      {value}
    </div>
  )
}

// ─── Option Button ────────────────────────────────────────
function OptionButton({ value, onClick, state, disabled }) {
  // state: 'idle' | 'correct' | 'wrong' | 'dim'
  const styles = {
    idle:    'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-800 dark:text-white hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:-translate-y-0.5',
    correct: 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-400 text-emerald-700 dark:text-emerald-300 shadow-emerald-100 scale-105',
    wrong:   'bg-rose-50 dark:bg-rose-900/30 border-rose-400 text-rose-700 dark:text-rose-300',
    dim:     'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-300 dark:text-gray-600 opacity-50'
  }

  const icon = state === 'correct' ? ' ✓' : state === 'wrong' ? ' ✗' : ''

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-2xl border-2 p-4 font-extrabold text-xl
                  transition-all duration-200 shadow-sm
                  ${styles[state]}
                  ${!disabled ? 'active:scale-95' : ''}`}
    >
      {value}{icon}
    </button>
  )
}

// ─── Main Component ───────────────────────────────────────
export default function QuestionCard({
  question,       // { sequence, options, correctAnswer, description }
  questionNumber, // 1-based
  totalQuestions,
  selectedAnswer, // null or number
  onAnswer,       // (value: number) => void
  shake           // boolean — triggers shake animation on wrong
}) {
  const answered = selectedAnswer !== null

  const getState = (opt) => {
    if (!answered) return 'idle'
    if (opt === question.correctAnswer) return 'correct'
    if (opt === selectedAnswer) return 'wrong'
    return 'dim'
  }

  return (
    <div className={`${shake ? 'animate-shake' : ''}`}>
      {/* Card header */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-md p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-gray-400 dark:text-gray-500">
            Soal {questionNumber} / {totalQuestions}
          </span>
          <span className="text-xs bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 px-2.5 py-1 rounded-full font-bold">
            {question.description}
          </span>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 text-center mb-4">
          Tentukan angka berikutnya dalam deret:
        </p>

        {/* Number sequence */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {question.sequence.map((num, i) => (
            <SequenceBox
              key={i}
              value={num}
              isQuestion={num === null}
            />
          ))}
        </div>
      </div>

      {/* Answer options — 2×2 grid */}
      <div className="grid grid-cols-2 gap-3">
        {question.options.map((opt, i) => (
          <OptionButton
            key={i}
            value={opt}
            state={getState(opt)}
            disabled={answered}
            onClick={() => onAnswer(opt)}
          />
        ))}
      </div>
    </div>
  )
}
