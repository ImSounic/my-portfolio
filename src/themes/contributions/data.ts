// src/themes/contributions/data.ts
// View data for the Contributions theme, derived from src/data/portfolio.ts.
// Pictures in public/contrib/ (from the project images; two replaced with
// credited open-licence pictures).
import { projects, hotTakes, skills, experience, type Project } from '@/data/portfolio'

export type Print = {
  id: string
  title: string
  kind: string
  year: string
  big: string
  body: string
  image: string
  alt: string
  github?: string
  tags: [string, string] // the top two tools, shown on the project card
}

// One true number and a short write-up per project (from its description).
const FEATURE: Record<string, { key: string; big: string; body: string; alt: string }> = {
  'cleanslate': { key: 'cleanslate', big: '15+', body: 'Automated chore-management app in Flutter and Supabase, with Google Calendar sync and real-time updates.', alt: 'Two phones showing a chore-planning app' },
  'cifr-quant': { key: 'cifr', big: '102M', body: 'Multi-market trading system that fine-tunes the Kronos financial foundation model for BTC, EUR and gold.', alt: 'Stacked gold bars' },
  'crypto-microstructure': { key: 'crypto', big: '32 GB', body: 'Distributed PySpark pipeline over 32 GB of Binance trades across 1000+ pairs on an HDFS cluster.', alt: 'A candlestick price chart on a trading monitor' },
  'f1-strategy': { key: 'f1', big: '71%', body: 'Exact strategy match on dry 2025 races. XGBoost tyre degradation, Bayesian safety cars, a Monte Carlo simulator at about 9,000 races a second.', alt: 'A pit crew swarming a Formula 1 car during a stop' },
  'sepsis-forecasting': { key: 'sepsis', big: '40,336', body: 'Patient-level early sepsis warning from ICU time series: 1.3M timesteps at 1.84% prevalence.', alt: 'A bedside patient monitor showing heart rate and oxygen' },
  'ev-forecasting': { key: 'ev', big: '19', body: 'Daily EV charging demand for Palo Alto: 19 model variants, time-aware validation and a COVID stress test.', alt: 'Electric cars charging under a solar canopy' },
  'miscarriage-prediction': { key: 'miscarriage', big: '93.1%', body: 'Ensemble deep learning on NFHS-5 survey data, with NearSMOTE for class balance and SHAP to explain each prediction.', alt: 'Hands holding a tablet with an ultrasound scan' },
  'lora-vs-bert': { key: 'lora', big: '190×', body: 'Fine-tuning against in-context learning on 10 benchmarks. BERT gave 190× the throughput with zero cross-task transfer.', alt: 'Metal movable type sorted in a printer’s wooden case' },
  'medsam-vpt': { key: 'medsam', big: 'SAM', body: 'Visual prompt tuning to adapt medical imaging foundation models with very few trainable parameters.', alt: 'Rows of brain scans printed on film' },
  'house-of-games': { key: 'hog', big: 'Java', body: 'A quiz game inspired by the British TV show, with several rounds and its own scoring.', alt: 'Two quiz buzzers with red and blue buttons' },
}

const yearOf = (p: Project) => {
  if (/present/i.test(p.period)) return 'Now'
  const years = p.period.match(/\d{4}/g)
  return years ? years[years.length - 1] : ''
}

// Order on the line: running now first, then newest to oldest.
const RANK: Record<string, number> = { Now: 0, '2026': 1, '2025': 2, '2024': 3 }
export const PRINTS: Print[] = [...projects]
  .sort((a, b) => (RANK[yearOf(a)] ?? 9) - (RANK[yearOf(b)] ?? 9))
  .map((p) => {
    const f = FEATURE[p.id]
    return {
      id: p.id,
      title: p.title,
      kind: p.subtitle.replace(' · ', ', '),
      year: yearOf(p),
      big: f?.big ?? '',
      body: f?.body ?? p.blurb,
      image: `/contrib/${f?.key ?? 'f1'}.jpg`,
      alt: f?.alt ?? '',
      github: p.github,
      tags: [p.tags[0] ?? '', p.tags[1] ?? ''] as [string, string],
    }
  })

// The test strip after the hero: four exposures, darkest to brightest.
export const EXPOSURES = [
  { big: '1.84%', body: 'of ICU hours were sepsis. A model can score 98% by never saying yes.', from: 'Sepsis Early-Warning' },
  { big: '80 to 95%', body: 'of lab values missing. Data that lies by leaving things out.', from: 'Sepsis Early-Warning' },
  { big: '4 billion', body: 'rows after one careless join on 32 GB of trades.', from: 'Crypto Market Microstructure' },
  { big: 'Why?', body: 'is what a clinician asks of a 93.1% AUC. SHAP is how I answer.', from: 'Miscarriage Prediction' },
]

const titleOf = (id?: string) => projects.find((p) => p.id === id)?.title
export const NOTES = hotTakes.map((t) => ({
  title: t.title.charAt(0) + t.title.slice(1).toLowerCase(),
  body: t.body,
  from: titleOf(t.projectId) ?? 'Video editing',
}))

export const CHEMISTRY = skills.map((g) => ({ name: g.category.replace(' / ', ' and ').replace(' & ', ' and '), items: g.items }))

const job = experience[0]
export const LETTER = [
  'I’m doing an MSc in Computer Science, Data Science and Technologies, at the University of Twente, and I finish in 2027. Before that came a BSc in Computer Science and Artificial Intelligence at Leeds and Aberystwyth, with firsts in Scientific Python, Software Engineering and Persistent Data.',
  `In ${job.period.slice(-4)} I interned at ${job.company} in ${job.location}, building an AI chatbot on Django REST and training it on data I scraped from the company’s own site.`,
  'I cut video before I cut code. Editing in After Effects and Premiere taught me pacing, and a clumsy loading state is just a bad edit.',
  'I read patch notes for fun, speak Telugu at home, Hindi and English fluently, and Dutch at the “ik wil een koffie” stage.',
]

export const NAV = [
  { id: 'work', label: 'Work' },
  { id: 'notes', label: 'Notes' },
  { id: 'chemistry', label: 'Stack' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
]

export const CREDITS = [
  '“Metal movable type” by Willi Heidelbach, CC BY 2.5',
  '“Arayashiki Japanese Quiz buzzer 1” by 舌先現象になります, CC BY-SA 4.0',
]

export const scrollToId = (id: string) => {
  const el = document.getElementById(id)
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
}
