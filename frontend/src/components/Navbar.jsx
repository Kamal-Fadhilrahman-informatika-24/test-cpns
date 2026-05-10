/**
 * Navbar.jsx
 * Top navigation bar — fixed, with dark/sound toggles and logo.
 */
import React from 'react'

export default function Navbar({ soundOn, onSoundToggle, dark, onDarkToggle, onHome }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 shadow-lg">
      {/* Gradient background shifts for dark mode */}
      <div
        className={`${
          dark
            ? 'bg-gradient-to-r from-gray-900 to-gray-800'
            : 'bg-gradient-to-r from-indigo-600 to-purple-600'
        } transition-colors duration-300`}
      >
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo / Home button */}
          <button
            onClick={onHome}
            className="flex items-center gap-2 text-white font-black text-lg tracking-tight hover:opacity-80 transition-opacity"
          >
            <span className="text-2xl" role="img" aria-label="brain">🧮</span>
            <span className="hidden sm:block">
              CPNS{' '}
              <span className="text-purple-200 font-normal text-base">Numerik</span>
            </span>
          </button>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Sound toggle */}
            <button
              onClick={onSoundToggle}
              title={soundOn ? 'Matikan suara' : 'Nyalakan suara'}
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 active:scale-90 transition-all flex items-center justify-center text-white text-base"
            >
              {soundOn ? '🔊' : '🔇'}
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={onDarkToggle}
              title={dark ? 'Mode terang' : 'Mode gelap'}
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 active:scale-90 transition-all flex items-center justify-center text-white text-base"
            >
              {dark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
