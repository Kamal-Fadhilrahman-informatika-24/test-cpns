/**
 * TimerBar.jsx
 * Displays countdown timer as a number + animated progress bar.
 * Color shifts: indigo → amber → red as time runs out.
 */
import React from 'react'

export default function TimerBar({ timeLeft, totalTime }) {
  const pct = Math.max(0, Math.min(100, (timeLeft / totalTime) * 100))

  const isWarning  = timeLeft <= 20 && timeLeft > 10
  const isDanger   = timeLeft <= 10

  const barColor = isDanger
    ? 'bg-rose-500'
    : isWarning
    ? 'bg-amber-500'
    : 'bg-indigo-500'

  const textColor = isDanger
    ? 'text-rose-500 animate-pulse'
    : isWarning
    ? 'text-amber-500'
    : 'text-gray-800 dark:text-white'

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
      {/* Label + countdown number */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
          ⏱ Waktu Tersisa
        </span>
        <span className={`text-2xl font-black tabular-nums transition-colors ${textColor}`}>
          {timeLeft}
          <span className="text-sm font-normal ml-0.5">s</span>
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-1000 ease-linear`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
