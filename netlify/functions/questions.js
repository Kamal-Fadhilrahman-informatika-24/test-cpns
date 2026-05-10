/**
 * netlify/functions/questions.js
 * Serverless function — replaces Express backend on Netlify.
 * Maps to: /.netlify/functions/questions
 * Proxied via netlify.toml to: /api/questions
 *
 * Usage: GET /api/questions?level=easy&count=10
 */

'use strict'

// ── Inline generator (same algorithm as backend/utils/generator.js) ──

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function makeDistractors(answer, count = 3) {
  const set = new Set()
  const offsets = [-1, 1, -2, 2, -3, 3, -4, 4, -5, 5]
  let i = 0
  while (set.size < count && i < 50) {
    const m = Math.floor(i / offsets.length) + 1
    const c = answer + offsets[i % offsets.length] * m
    if (c !== answer && c > 0 && Number.isFinite(c) && c < 99999) set.add(Math.round(c))
    i++
  }
  return Array.from(set).slice(0, count)
}

function genAddition()      { const s=rand(1,20),d=rand(2,12); const q=[0,1,2,3,4].map(i=>s+d*i); return {sequence:q.slice(0,4),answer:q[4],description:`+${d}`} }
function genSubtraction()   { const d=rand(2,10),s=rand(d*5+5,d*5+60); const q=[0,1,2,3,4].map(i=>s-d*i); return {sequence:q.slice(0,4),answer:q[4],description:`-${d}`} }
function genMultiplication(){ const s=rand(1,4),r=rand(2,3); const q=[0,1,2,3,4].map(i=>s*Math.pow(r,i)); return {sequence:q.slice(0,4),answer:Math.round(q[4]),description:`×${r}`} }
function genDivision()      { const r=rand(2,3),s=Math.pow(r,5)*rand(1,4); const q=[0,1,2,3,4].map(i=>s/Math.pow(r,i)); return {sequence:q.slice(0,4),answer:Math.round(q[4]),description:`÷${r}`} }
function genStepped()       { const s=rand(1,10),d=rand(1,3); let c=s; const q=[s]; for(let i=1;i<=5;i++){c+=d+i;q.push(c)} return {sequence:q.slice(0,4),answer:q[4],description:'Pola Bertingkat'} }
function genMixed()         { const add=rand(2,6),s=rand(2,8); let c=s; const q=[s]; for(let i=0;i<5;i++){c=i%2===0?c+add:c*2;q.push(c)} return {sequence:q.slice(0,4),answer:q[4],description:`+${add}/×2`} }
function genAlternating()   { const sA=rand(2,10),sB=rand(2,10),dA=rand(2,8),dB=rand(2,6); const full=[]; for(let i=0;i<4;i++){full.push(sA+dA*i);full.push(sB+dB*i)} return {sequence:full.slice(0,4),answer:full[4],description:`Selang-seling`} }

const POOLS = {
  easy:   [genAddition, genSubtraction],
  medium: [genMultiplication, genDivision, genStepped],
  hard:   [genMixed, genAlternating, genStepped, genMultiplication]
}

function generateQuestion(level='easy') {
  const pool  = POOLS[level] || POOLS.easy
  const genFn = pool[Math.floor(Math.random() * pool.length)]
  let result, n=0
  do { result=genFn(); n++ } while (n<10 && (!Number.isFinite(result.answer)||result.answer<=0||result.answer>99999))
  if (!Number.isFinite(result.answer)||result.answer<=0) return generateQuestion('easy')
  const options = shuffle([result.answer, ...makeDistractors(result.answer,3)])
  return { id:Math.random().toString(36).slice(2,9), sequence:[...result.sequence,null], options, correctAnswer:result.answer, type:genFn.name, description:result.description }
}

// ── Netlify Handler ───────────────────────────────────────

const CORS_HEADERS = {
  'Content-Type':                'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods':'GET, OPTIONS',
  'Access-Control-Allow-Headers':'Content-Type'
}

exports.handler = async (event) => {
  // Preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' }
  }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  try {
    const params    = event.queryStringParameters || {}
    const level     = ['easy','medium','hard'].includes(params.level) ? params.level : 'easy'
    const count     = Math.max(1, Math.min(30, parseInt(params.count||'10',10)))
    const questions = Array.from({ length: count }, () => generateQuestion(level))

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        success: true,
        questions,
        meta: { level, count, generated: new Date().toISOString() }
      })
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ success: false, error: 'Gagal membuat soal.' })
    }
  }
}
