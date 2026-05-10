/**
 * HomePage.jsx
 * Landing page — shows hero, level selector, and past scores.
 */
import React from 'react'

const LEVELS = {
  easy: {
    label:       'Mudah',
    gradient:    'from-emerald-400 to-teal-500',
    bg:          'bg-emerald-500',
    icon:        '🟢',
    description: 'Penjumlahan & pengurangan sederhana',
    questions:   10,
    time:        120
  },
  medium: {
    label:       'Sedang',
    gradient:    'from-amber-400 to-orange-500',
    bg:          'bg-amber-500',
    icon:        '🟡',
    description: 'Perkalian, pembagian & pola bertingkat',
    questions:   10,
    time:        90
  },
  hard: {
    label:       'Sulit',
    gradient:    'from-rose-500 to-pink-600',
    bg:          'bg-rose-500',
    icon:        '🔴',
    description: 'Pola kompleks, campuran & selang-seling',
    questions:   10,
    time:        60
  }
}

// ─── Level Card ───────────────────────────────────────────
function LevelCard({ levelKey, config, onStart }) {
  return (
    <button
      onClick={() => onStart(levelKey)}
      className="w-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-100
                 dark:border-gray-700 p-4 flex items-center gap-4
                 hover:shadow-lg hover:-translate-y-0.5 active:scale-98
                 transition-all duration-200 text-left group"
    >
      {/* Icon bubble */}
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-xl shadow-md flex-shrink-0`}>
        {config.icon}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="font-extrabold text-gray-900 dark:text-white">{config.label}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">
          {config.description}
        </p>
      </div>

      {/* Meta */}
      <div className="text-right flex-shrink-0 mr-1">
        <p className="text-xs text-gray-400">{config.questions} soal</p>
        <p className="text-xs font-bold text-indigo-500">{config.time}s</p>
      </div>

      <span className="text-gray-300 dark:text-gray-600 group-hover:text-indigo-500 text-xl transition-colors">
        ›
      </span>
    </button>
  )
}

// ─── Score Row ────────────────────────────────────────────
function ScoreRow({ rank, entry }) {
  const medals = ['🥇', '🥈', '🥉']
  const levelLabel = LEVELS[entry.level]?.label || entry.level

  return (
    <div className="flex items-center justify-between text-xs py-1.5">
      <div className="flex items-center gap-2">
        <span className="w-6 text-center">
          {rank < 3 ? medals[rank] : <span className="text-gray-400 font-bold">{rank + 1}</span>}
        </span>
        <span className="text-gray-600 dark:text-gray-300 capitalize">{levelLabel}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-gray-300 dark:text-gray-600">{entry.date}</span>
        <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{entry.score} pts</span>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────
export default function HomePage({ onStart, highScores }) {
  const topScore = highScores[0] || null

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-lg mx-auto mt-4 animate-fadeUp">

        {/* ── Hero ────────────────────────────────────── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold px-4 py-2 rounded-full mb-4 shadow-sm">
            📋 Simulasi Tes CPNS Resmi
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white leading-tight mb-3">
            Latihan{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Deret Angka
            </span>
          </h1>

          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto leading-relaxed">
            Asah kemampuan numerik dengan simulator tes berbasis waktu, dirancang mirip soal CPNS sungguhan.
          </p>
        </div>

        {/* ── Best Score Banner ────────────────────────── */}
        {topScore && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 mb-6 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-xl shadow-md flex-shrink-0">
              🏆
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Skor Terbaik Kamu</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white">
                {topScore.score}
                <span className="text-sm font-normal text-gray-400 ml-1">poin</span>
              </p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xs text-gray-400 capitalize">
                {LEVELS[topScore.level]?.label || topScore.level}
              </p>
              <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                {topScore.accuracy}% akurasi
              </p>
            </div>
          </div>
        )}

        {/* ── Level Selector ────────────────────────────── */}
        <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3 px-1">
          Pilih Tingkat Kesulitan
        </p>

        <div className="space-y-3 mb-6">
          {Object.entries(LEVELS).map(([key, cfg]) => (
            <LevelCard key={key} levelKey={key} config={cfg} onStart={onStart} />
          ))}
        </div>

        {/* ── Score History ─────────────────────────────── */}
        {highScores.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
            <h3 className="font-extrabold text-gray-800 dark:text-white mb-3 text-sm flex items-center gap-2">
              📊 Riwayat Skor Terakhir
            </h3>
            <div className="space-y-0.5 divide-y divide-gray-50 dark:divide-gray-700/50">
              {highScores.slice(0, 6).map((s, i) => (
                <ScoreRow key={i} rank={i} entry={s} />
              ))}
            </div>
          </div>
        )}

        {/* Footer note */}
        <p className="text-center text-xs text-gray-300 dark:text-gray-700 mt-6">
          Benar +10 pts · Streak ≥3 bonus +5 pts · Salah 0 pts
        </p>
      </div>
    </div>
  )
}

// Export LEVELS so QuizPage and ResultPage can import it too
export { LEVELS }
