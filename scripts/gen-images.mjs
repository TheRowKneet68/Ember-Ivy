// Generates the SVG art assets for Ember & Ivy into public/images.
// Each scene is a moody "photographic" composition: gradient backdrop,
// layered blurred shapes, light streaks and a film grain. Run: node scripts/gen-images.mjs
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images')
mkdirSync(root, { recursive: true })

const rand = (a, b) => a + Math.random() * (b - a)
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
const r = (a, b) => Math.round(rand(a, b))

// warm/ember palettes
const GOLD = ['#c49a6c', '#e7c48a', '#a8794a', '#f0d9a8', '#8a5f31']
const DARK = ['#111111', '#1e1e1e', '#2a241c', '#17140f', '#0e0c09']
const EMBER = ['#2d6a4f', '#40916c', '#52b788']
const EMO = (o) => `rgba(231,196,138,${o})`

const grain = () =>
  `<filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.06"/></feComponentTransfer><feComposite operator="over" in2="SourceGraphic"/></filter>`

const vignette = (c = 'rgba(0,0,0,0.55)') =>
  `<radialGradient id="vig" cx="50%" cy="46%" r="75%"><stop offset="0%" stop-color="transparent"/><stop offset="78%" stop-color="transparent"/><stop offset="100%" stop-color="${c}"/></radialGradient>`

const lightStreaks = () => {
  let s = ''
  for (let i = 0; i < 3; i++) {
    const x = r(-40, 40)
    const w = r(80, 220)
    s += `<ellipse cx="${50 + x}%" cy="${r(10, 90)}%" rx="${w}" ry="${r(30, 120)}" fill="${EMO(0.12)}" filter="url(#b)"/>`
  }
  return s
}

const glow = (x, y, rad, col) =>
  `<circle cx="${x}%" cy="${y}%" r="${rad}" fill="${col}" filter="url(#b)"/>`

const bg = () => {
  const c1 = pick(DARK)
  let c2 = pick(DARK)
  while (c2 === c1) c2 = pick(DARK)
  return `<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>`
}

// --- scene builders -------------------------------------------------

function coffee(v) {
  const w = 1200, h = 800
  const cups = 1 + (v % 3)
  let s = ''
  for (let i = 0; i < cups; i++) {
    const cx = 300 + i * 260
    const cy = 470 + (i % 2) * 40
    s += `<ellipse cx="${cx}" cy="${cy}" rx="${150 + i * 6}" ry="${70}" fill="#241f18" filter="url(#b)"/>` // shadow
    s += `<path d="M ${cx - 90} ${cy - 70} h 180 l 26 60 a 110 60 0 0 1 -232 0 z" fill="#f5efe6"/>` // cup
    s += `<path d="M ${cx - 90} ${cy - 70} h 180 l 26 60 a 110 60 0 0 1 -232 0 z" fill="none" stroke="${pick(GOLD)}" stroke-width="6"/>` // rim line
    s += `<ellipse cx="${cx}" cy="${cy - 72}" rx="90" ry="30" fill="${pick(['#3a2417', '#2d6a4f', '#4a2f1d'])}"/>` // liquid
    s += `<ellipse cx="${cx}" cy="${cy - 72}" rx="66" ry="20" fill="url(#bg)" opacity="0.5"/>`
    s += `<path d="M ${cx + 92} ${cy - 60} h 60 a 22 22 0 0 1 0 44 h -36" fill="none" stroke="#e9e0d2" stroke-width="14" stroke-linecap="round"/>` // handle
    s += `<path d="M ${cx + r(-30, 30)} ${cy - 70} c ${r(-20, 20)} -120 ${r(-40, 40)} -180 ${r(-60, 60)} -230" stroke="#d9cfc0" stroke-width="5" fill="none" opacity="0.85" stroke-linecap="round"/>` // steam
    s += `<path d="M ${cx + r(10, 50)} ${cy - 70} c ${r(-15, 15)} -100 ${r(-25, 25)} -150 ${r(-40, 40)} -190" stroke="#d9cfc0" stroke-width="4" fill="none" opacity="0.6" stroke-linecap="round"/>`
  }
  return wrap(w, h, `coffee-${v}`, [bg(), vignette(), grain()], s, 58, 42)
}

function cocktail(v) {
  const w = 1200, h = 800
  const cx = 600, cy = 460
  const liq = pick(GOLD)
  let s = ''
  s += `<ellipse cx="${cx}" cy="${cy + 20}" rx="300" ry="90" fill="#201a13" filter="url(#b)"/>`
  // coupe glass
  s += `<path d="M ${cx - 150} ${cy - 150} q 0 150 150 210 q 150 -60 150 -210 z" fill="${EMO(0.28)}"/>`
  s += `<path d="M ${cx - 150} ${cy - 150} q 0 150 150 210 q 150 -60 150 -210 z" fill="none" stroke="${liq}" stroke-width="6"/>`
  s += `<path d="M ${cx - 150} ${cy - 150} q 0 150 150 210" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.5"/>` // highlight
  s += `<line x1="${cx}" y1="${cy + 60}" x2="${cx}" y2="${cy + 220}" stroke="${liq}" stroke-width="10"/>`
  s += `<circle cx="${cx}" cy="${cy + 300}" r="40" fill="${liq}"/>`
  s += `<circle cx="${cx - 60}" cy="${cy - 150}" r="70" fill="${pick(GOLD)}" opacity="0.9"/>` // garnish
  s += `<path d="M ${cx - 40} ${cy - 120} l -30 -60 14 -20 40 50 z" fill="${pick(EMBER)}"/>` // leaf
  s += `<circle cx="${cx - 40}" cy="${cy - 175}" r="16" fill="${pick(GOLD)}" opacity="0.7"/>`
  // bubbles
  for (let i = 0; i < 14; i++) {
    s += `<circle cx="${r(cx - 130, cx + 130)}" cy="${r(cy - 120, cy + 190)}" r="${r(2, 5)}" fill="#fff" opacity="${rand(0.2, 0.6)}"/>`
  }
  return wrap(w, h, `cocktail-${v}`, [bg(), vignette(), grain()], s, 60, 38)
}

function food(v) {
  const w = 1200, h = 800
  const cx = 600, cy = 440
  const c1 = pick(GOLD), c2 = pick(DARK)
  let s = ''
  s += `<ellipse cx="${cx}" cy="${cy + 30}" rx="330" ry="80" fill="#1a140d" filter="url(#b)"/>` // plate shadow
  s += `<ellipse cx="${cx}" cy="${cy}" rx="330" ry="90" fill="#efe9dd"/>` // plate
  s += `<ellipse cx="${cx}" cy="${cy}" rx="300" ry="76" fill="#f8f4ec"/>`
  s += `<ellipse cx="${cx}" cy="${cy}" rx="230" ry="58" fill="none" stroke="${c1}" stroke-width="3" opacity="0.5"/>`
  // composed "dish"
  const kind = v % 3
  if (kind === 0) {
    // steak-ish
    s += `<ellipse cx="${cx}" cy="${cy}" rx="150" ry="44" fill="#7a3f2a"/>`
    s += `<path d="M ${cx - 130} ${cy - 20} q 30 -60 130 -40 q 40 40 -10 70 q -70 30 -120 -10 z" fill="#9c4f32"/>`
    s += `<path d="M ${cx - 90} ${cy + 8} q 40 -50 110 -30" stroke="${c1}" stroke-width="14" fill="none" stroke-linecap="round" opacity="0.85"/>` // sauce
    s += `<ellipse cx="${cx + 90}" cy="${cy + 16}" rx="22" ry="10" fill="${pick(EMBER)}"/>` // garnish
    s += `<ellipse cx="${cx - 120}" cy="${cy + 12}" rx="18" ry="8" fill="#3a2a1c"/>`
  } else if (kind === 1) {
    // pasta
    for (let i = 0; i < 6; i++) {
      s += `<ellipse cx="${cx + r(-160, 160)}" cy="${cy + r(-40, 34)}" rx="${r(30, 48)}" ry="${r(14, 20)}" fill="${c1}" opacity="0.9"/>`
      s += `<ellipse cx="${cx + r(-140, 140)}" cy="${cy + r(-34, 30)}" rx="${r(18, 30)}" ry="${r(8, 12)}" fill="${c2}" opacity="0.5"/>`
    }
    s += `<circle cx="${cx + r(-120, 120)}" cy="${cy + r(-30, 26)}" r="10" fill="${pick(EMBER)}"/>`
  } else {
    // salad / composed
    for (let i = 0; i < 5; i++) {
      s += `<circle cx="${cx + r(-170, 170)}" cy="${cy + r(-40, 36)}" r="${r(24, 40)}" fill="${pick(EMBER)}" opacity="${rand(0.6, 0.95)}"/>`
      s += `<circle cx="${cx + r(-150, 150)}" cy="${cy + r(-30, 26)}" r="10" fill="${c1}" opacity="0.9"/>`
    }
  }
  return wrap(w, h, `food-${v}`, [bg(), vignette(), grain()], s, 52, 34)
}

function dessert(v) {
  const w = 1200, h = 800
  const cx = 600, cy = 470
  let s = ''
  s += `<ellipse cx="${cx}" cy="${cy + 40}" rx="300" ry="70" fill="#1a140d" filter="url(#b)"/>`
  s += `<rect x="${cx - 150}" y="${cy - 40}" width="300" height="120" rx="14" fill="#e9dcc4"/>` // cake base
  s += `<rect x="${cx - 150}" y="${cy - 100}" width="300" height="62" rx="14" fill="${pick(['#6b4226', '#2d6a4f', '#8a5f31'])}"/>` // top layer
  s += `<path d="M ${cx - 150} ${cy - 38} q 300 30 300 10 l 0 28 l -300 0 z" fill="#fff" opacity="0.85"/>` // cream drip
  s += `<circle cx="${cx}" cy="${cy - 120}" r="26" fill="${pick(GOLD)}"/>` // topping
  s += `<circle cx="${cx - 90}" cy="${cy - 118}" r="14" fill="${pick(EMBER)}"/>`
  s += `<circle cx="${cx + 100}" cy="${cy - 112}" r="12" fill="${pick(GOLD)}"/>`
  // steam/dust
  for (let i = 0; i < 18; i++) s += `<circle cx="${r(cx - 140, cx + 140)}" cy="${r(cy - 170, cy - 130)}" r="${r(2, 4)}" fill="#fff" opacity="${rand(0.3, 0.7)}"/>`
  return wrap(w, h, `dessert-${v}`, [bg(), vignette(), grain()], s, 55, 36)
}

function interior(v) {
  const w = 1200, h = 800
  let s = ''
  // wall
  s += `<rect width="1200" height="800" fill="url(#bg)"/>`
  // warm light pools
  s += lightStreaks()
  // pendant lamps
  for (const lx of [260, 600, 940]) {
    s += `<line x1="${lx}" y1="-20" x2="${lx}" y2="${120 + r(0, 60)}" stroke="#0e0c09" stroke-width="6"/>`
    s += `<path d="M ${lx - 34} ${120 + r(0, 60)} h 68 l -12 90 h -44 z" fill="${EMO(0.85)}" filter="url(#b)"/>`
    s += glow(lx / 12, 40, 90, EMO(0.18))
  }
  // sofa
  s += `<rect x="${100}" y="560" width="1000" height="150" rx="60" fill="#241f18" filter="url(#b)"/>`
  s += `<rect x="${90}" y="520" width="1020" height="130" rx="52" fill="#2e2820"/>`
  s += `<rect x="${150}" y="470" width="900" height="90" rx="40" fill="#362f25"/>`
  // cushions
  s += `<rect x="${200}" y="470" width="150" height="80" rx="26" fill="${pick(GOLD)}" opacity="0.5"/>`
  s += `<rect x="${860}" y="470" width="150" height="80" rx="26" fill="${pick(EMBER)}" opacity="0.45"/>`
  // table
  s += `<ellipse cx="600" cy="640" rx="340" ry="60" fill="#1c1710"/>`
  s += `<rect x="520" y="560" width="160" height="80" rx="10" fill="#6b4226" opacity="0.8"/>`
  // window light
  s += `<rect x="470" y="120" width="260" height="300" rx="8" fill="${EMO(0.1)}" stroke="${EMO(0.4)}" stroke-width="4"/>`
  s += `<rect x="490" y="140" width="220" height="260" fill="${EMO(0.05)}"/>`
  return wrap(w, h, `interior-${v}`, [vignette(), grain()], s, 48, 34)
}

function live(v) {
  const w = 1200, h = 800
  let s = ''
  s += `<rect width="1200" height="800" fill="url(#bg)"/>`
  // stage lights
  s += `<polygon points="${300 + r(0, 80)},0 ${460 + r(0, 60)},560 ${540 + r(0, 60)},560" fill="${EMO(0.08)}"/>`
  s += `<polygon points="${700 + r(0, 80)},0 ${560 + r(0, 60)},560 ${640 + r(0, 60)},560" fill="rgba(64,145,108,0.12)"/>`
  // mic
  s += `<line x1="600" y1="760" x2="600" y2="430" stroke="#0e0c09" stroke-width="12"/>`
  s += `<ellipse cx="600" cy="420" rx="46" ry="16" fill="#0a0a0a"/>`
  s += `<rect x="576" y="398" width="48" height="34" rx="8" fill="#111"/>`
  s += `<rect x="584" y="404" width="32" height="12" fill="#2a2a2a"/>`
  // crowd silhouettes
  for (let i = 0; i < 40; i++) {
    const hx = 30 + i * 29
    const hy = 620 + r(-40, 40)
    s += `<circle cx="${hx}" cy="${hy}" r="22" fill="#060606" opacity="0.9"/>`
    s += `<path d="M ${hx - 22} ${hy + 22} q 22 90 44 0 z" fill="#060606" opacity="0.9"/>`
  }
  // guitar stand-in
  s += `<ellipse cx="340" cy="600" rx="18" ry="70" fill="#3a2417" transform="rotate(18 340 600)"/>`
  return wrap(w, h, `live-${v}`, [vignette(), grain()], s, 60, 40)
}

function outdoor(v) {
  const w = 1200, h = 800
  let s = ''
  s += `<rect width="1200" height="800" fill="url(#bg)"/>`
  // dusk sky band
  s += `<rect width="1200" height="330" fill="url(#sky)"/>`
  s += `<rect y="330" width="1200" height="470" fill="#141210"/>`
  // string lights
  s += `<path d="M 0 180 q 300 -60 600 0 t 600 0" stroke="#0e0c09" stroke-width="4" fill="none"/>`
  for (let i = 0; i < 24; i++) {
    const x = i * 50
    const y = 180 + Math.sin((i / 23) * Math.PI) * -60
    s += `<circle cx="${x}" cy="${y}" r="7" fill="${EMO(0.9)}" filter="url(#b)"/>`
  }
  // tables
  for (const tx of [250, 700]) {
    s += `<ellipse cx="${tx}" cy="620" rx="170" ry="40" fill="#0a0807"/>`
    s += `<rect x="${tx - 110}" y="590" width="220" height="10" rx="5" fill="#3a2c1c"/>`
    s += `<line x1="${tx - 100}" y1="600" x2="${tx - 100}" y2="660" stroke="#3a2c1c" stroke-width="8"/>`
    s += `<line x1="${tx + 100}" y1="600" x2="${tx + 100}" y2="660" stroke="#3a2c1c" stroke-width="8"/>`
    s += `<rect x="${tx - 70}" y="520" width="140" height="70" rx="8" fill="#2a2219" opacity="0.9"/>` // people-ish
    s += `<circle cx="${tx - 40}" cy="505" r="16" fill="#241c13"/>`
    s += `<circle cx="${tx + 40}" cy="505" r="16" fill="#241c13"/>`
  }
  return wrap(w, h, `outdoor-${v}`, [vignette(), grain()], s, 50, 34, true)
}

function heroSlide(v) {
  const w = 1600, h = 1000
  let s = ''
  if (v % 3 === 0) s = interior(v) === null ? '' : stripWrap(interior(v)).replace('<svg', `<svg width="${w}" height="${h}"`) 
  else s = live(v) === null ? '' : stripWrap(live(v)).replace('<svg', `<svg width="${w}" height="${h}"`)
  return s
}

function team(v) {
  const w = 800, h = 800
  const skin = pick(['#b98a63', '#c79a72', '#a5714b', '#d3a57c'])
  const hair = pick(['#241a12', '#17110b', '#3a2a1c', '#0d0d0d', '#4a3826'])
  const cloth = pick(['#2d6a4f', '#7a4a2b', '#3a2f26', '#1e1e1e', '#8a5f31'])
  let s = ''
  s += glow(50, 30, 260, EMO(0.14))
  // shoulders
  s += `<path d="M 400 800 C 200 800 170 640 190 560 Q 210 490 290 470 L 400 470 L 510 470 Q 590 490 610 560 C 630 640 600 800 400 800 Z" fill="${cloth}"/>`
  // neck
  s += `<rect x="352" y="410" width="96" height="70" rx="26" fill="${skin}"/>`
  // head
  s += `<circle cx="400" cy="330" r="132" fill="${skin}"/>`
  // hair
  s += `<path d="M 400 170 A 140 150 0 0 1 545 300 Q 552 240 480 205 Q 470 150 400 165 Q 320 150 320 205 Q 248 240 255 300 A 140 150 0 0 1 400 170 Z" fill="${hair}"/>`
  // face
  s += `<ellipse cx="345" cy="330" rx="10" ry="16" fill="#1a110b" opacity="0.85"/>`
  s += `<ellipse cx="455" cy="330" rx="10" ry="16" fill="#1a110b" opacity="0.85"/>`
  s += `<path d="M 372 392 q 28 24 56 0" stroke="#1a110b" stroke-width="7" fill="none" stroke-linecap="round" opacity="0.8"/>`
  s += `<circle cx="345" cy="330" r="4" fill="#fff" opacity="0.9"/>`
  s += `<circle cx="455" cy="330" r="4" fill="#fff" opacity="0.9"/>`
  // gold rim light
  s += `<circle cx="400" cy="330" r="132" fill="none" stroke="${EMO(0.35)}" stroke-width="3" stroke-dasharray="6 10"/>`
  return wrap(w, h, `team-${v}`, [vignette(), grain()], s, 55, 34)
}

function chefDish(v) {
  const w = 1000, h = 1250
  const cx = 500, cy = 700
  let s = ''
  s += glow(50, 25, 300, EMO(0.16))
  s += `<ellipse cx="${cx}" cy="${cy + 40}" rx="380" ry="90" fill="#1a140d" filter="url(#b)"/>`
  s += `<ellipse cx="${cx}" cy="${cy}" rx="380" ry="100" fill="#efe9dd"/>`
  s += `<ellipse cx="${cx}" cy="${cy}" rx="345" ry="86" fill="#f8f4ec"/>`
  // main protein
  s += `<path d="M ${cx - 200} ${cy - 20} q 80 -120 260 -60 q 60 90 -20 140 q -120 60 -240 -10 z" fill="#8a4527"/>`
  s += `<path d="M ${cx - 170} ${cy} q 60 -90 200 -50 q 30 60 -20 100 q -90 40 -180 -10 z" fill="#a05a34"/>`
  s += `<path d="M ${cx - 140} ${cy + 30} q 60 -80 180 -30" stroke="${pick(GOLD)}" stroke-width="18" fill="none" stroke-linecap="round" opacity="0.9"/>`
  s += `<ellipse cx="${cx + 220}" cy="${cy + 20}" rx="34" ry="16" fill="${pick(EMBER)}"/>`
  s += `<ellipse cx="${cx - 240}" cy="${cy + 10}" rx="28" ry="12" fill="#3a2a1c"/>`
  for (let i = 0; i < 6; i++) {
    s += `<circle cx="${cx + r(-320, 320)}" cy="${cy + r(-70, 60)}" r="${r(4, 9)}" fill="${pick(EMBER)}" opacity="${rand(0.5, 0.9)}"/>`
  }
  return wrap(w, h, `chef-${v}`, [vignette(), grain()], s, 58, 30)
}

function cta(v) {
  const w = 1600, h = 900
  return heroSlide(v)
}

// --- helpers ----------------------------------------------------------

function wrap(w, h, name, defs, body, ax, ay, extraSky) {
  const sky = extraSky
    ? `<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#241c12"/><stop offset="1" stop-color="#17140f"/></linearGradient>`
    : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${name}">
  <defs>
    <filter id="b" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="${r(18, 40)}"/></filter>
    ${sky}
    ${defs.filter((d) => d.includes('radialGradient') || d.includes('linearGradient')).join('\n    ')}
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  ${body}
  <rect width="100%" height="100%" fill="url(#vig)" filter="url(#g)"/>
</svg>`
}

function stripWrap(svg) {
  return svg
}

// --- emit --------------------------------------------------------------

const emit = (name, svg) => writeFileSync(join(root, `${name}.svg`), svg, 'utf8')

const scenes = {
  'hero-1': () => interior(1),
  'hero-2': () => live(2),
  'hero-3': () => cocktail(1),
  'hero-4': () => coffee(1)
}

for (let i = 1; i <= 4; i++) scenes[`coffee-${i}`] = () => coffee(i)
for (let i = 1; i <= 5; i++) scenes[`cocktail-${i}`] = () => cocktail(i)
for (let i = 1; i <= 7; i++) scenes[`food-${i}`] = () => food(i)
for (let i = 1; i <= 3; i++) scenes[`dessert-${i}`] = () => dessert(i)
for (let i = 1; i <= 4; i++) scenes[`interior-${i}`] = () => interior(i)
for (let i = 1; i <= 3; i++) scenes[`live-${i}`] = () => live(i)
for (let i = 1; i <= 2; i++) scenes[`outdoor-${i}`] = () => outdoor(i)
for (let i = 1; i <= 4; i++) scenes[`team-${i}`] = () => team(i)
for (let i = 1; i <= 2; i++) scenes[`chef-${i}`] = () => chefDish(i)
scenes['cta-1'] = () => cta(1)
scenes['events-1'] = () => outdoor(1)
scenes['events-2'] = () => live(2)

for (const [name, fn] of Object.entries(scenes)) {
  emit(name, fn())
  console.log('generated', name)
}
console.log(`\nDone. ${Object.keys(scenes).length} assets in ${root}`)
