# 🧮 CPNS Numerik — Simulator Tes Deret Angka

Aplikasi web simulator tes deret angka berbasis waktu untuk persiapan CPNS.
Dibangun dengan **React + Vite + Tailwind CSS** (frontend) dan **Node.js + Express** (backend).

---

## 📁 Struktur Project

```
cpns-full/
├── frontend/                    ← React App
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       ← Navigasi atas (dark/sound toggle)
│   │   │   ├── TimerBar.jsx     ← Progress bar timer
│   │   │   └── QuestionCard.jsx ← Kartu soal + pilihan jawaban
│   │   ├── pages/
│   │   │   ├── HomePage.jsx     ← Halaman utama (level selector)
│   │   │   ├── QuizPage.jsx     ← Sesi quiz (timer + soal)
│   │   │   └── ResultPage.jsx   ← Halaman hasil + review
│   │   ├── hooks/
│   │   │   ├── useDarkMode.js   ← Toggle dark mode + localStorage
│   │   │   └── useSound.js      ← Web Audio API sound effects
│   │   ├── utils/
│   │   │   ├── questionGenerator.js ← Algoritma generate soal
│   │   │   └── highScore.js         ← LocalStorage high score
│   │   ├── services/
│   │   │   └── api.js           ← Axios wrapper + fallback lokal
│   │   ├── App.jsx              ← Root component (router halaman)
│   │   ├── main.jsx             ← Entry point React
│   │   └── index.css            ← Tailwind + custom styles
│   ├── public/                  ← Static assets
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── backend/                     ← Node.js + Express API
│   ├── routes/
│   │   ├── questionRoutes.js    ← GET /api/questions
│   │   ├── resultRoutes.js      ← POST/GET /api/result
│   │   └── leaderboardRoutes.js ← GET/POST /api/leaderboard
│   ├── controllers/
│   │   └── questionController.js
│   ├── services/
│   │   └── questionService.js
│   ├── utils/
│   │   └── generator.js         ← Core algorithm (Node.js)
│   ├── server.js
│   └── package.json
│
├── netlify/
│   └── functions/
│       └── questions.js         ← Serverless function untuk Netlify
│
└── netlify.toml                 ← Konfigurasi deploy Netlify
```

---

## 🚀 Cara Menjalankan

### ✅ Prasyarat
- Node.js v18+ (download: https://nodejs.org)
- npm v9+

---

### 1️⃣ FRONTEND (wajib)

```bash
# Masuk ke folder frontend
cd frontend

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Buka browser: **http://localhost:5173**

> ⚡ **Catatan:** Frontend sudah bisa berjalan TANPA backend!
> Jika backend tidak aktif, soal di-generate langsung di browser (fallback otomatis).

---

### 2️⃣ BACKEND (opsional)

```bash
# Dari folder cpns-full, masuk ke backend
cd backend

# Install dependencies
npm install

# Jalankan server
node server.js

# Atau dengan auto-reload (development):
npm run dev
```

Server berjalan di: **http://localhost:3001**

Endpoints yang tersedia:
```
GET  http://localhost:3001/api/questions?level=easy&count=10
GET  http://localhost:3001/api/questions/single?level=medium
POST http://localhost:3001/api/result
GET  http://localhost:3001/api/leaderboard
POST http://localhost:3001/api/leaderboard
GET  http://localhost:3001/api/health
```

---

### 3️⃣ Menghubungkan Frontend ke Backend (opsional)

Buat file `frontend/.env`:
```
VITE_API_URL=http://localhost:3001/api
```

Restart dev server (`npm run dev`), sekarang soal diambil dari API.

---

## ☁️ Deploy ke Netlify (GRATIS)

### Cara 1 — Upload via Netlify UI

1. Build frontend:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
2. Login ke https://netlify.com
3. Drag & drop folder `frontend/dist/` ke Netlify
4. Selesai! ✅

### Cara 2 — Connect GitHub (Recommended)

1. Push seluruh folder `cpns-full/` ke GitHub
2. Login ke https://netlify.com → **"Add new site" → "Import an existing project"**
3. Pilih repo GitHub kamu
4. Netlify otomatis baca `netlify.toml`:
   - Build command: `npm install && npm run build`
   - Publish dir: `dist`
   - Functions: `netlify/functions/`
5. Klik **Deploy** → tunggu 1-2 menit
6. Dapat URL seperti: `https://cpns-numerik-xyz.netlify.app`

> 📝 API `/api/questions` otomatis terhubung ke Netlify Function (gratis, tanpa server!)

---

## ✨ Fitur Lengkap

| Fitur | Keterangan |
|-------|-----------|
| 🎯 Generator Soal | 7 tipe pola: penjumlahan, pengurangan, perkalian, pembagian, bertingkat, campuran, selang-seling |
| ⏱ Timer | Countdown per sesi, otomatis submit saat habis |
| 🎚 3 Level | Mudah (120s), Sedang (90s), Sulit (60s) |
| 🔥 Streak | Bonus +5 pts saat benar ≥3 kali berturut |
| 🎵 Sound | Click, correct, wrong — Web Audio API (tanpa file mp3) |
| 🌙 Dark Mode | Toggle + tersimpan di localStorage |
| 🏆 High Score | Top 10 tersimpan di localStorage |
| 📊 Review | Lihat semua jawaban benar/salah setelah selesai |
| 📡 REST API | Backend Express + fallback lokal |
| ☁️ Netlify | Siap deploy dengan serverless function |

## 🎮 Sistem Poin

| Kondisi | Poin |
|---------|------|
| Jawaban benar | +10 |
| Streak ≥ 3 berturut | +5 bonus |
| Jawaban salah | 0 |
| Tidak dijawab | 0 |

## 📊 Evaluasi Hasil

| Akurasi | Predikat |
|---------|----------|
| ≥ 80% | 🏆 Sangat Baik |
| ≥ 60% | 👍 Baik |
| < 60% | 📚 Perlu Latihan |

---

## 🛠 Teknologi

- **Frontend**: React 18, Vite 5, Tailwind CSS 3
- **Backend**: Node.js, Express 4
- **API**: REST (Axios + graceful fallback)
- **Audio**: Web Audio API (tanpa library)
- **Storage**: localStorage (high score, preferensi)
- **Deploy**: Netlify (frontend + serverless functions)

---

*Dibuat untuk tugas UAS Pemrograman Web — Teknik Informatika Semester 4*
