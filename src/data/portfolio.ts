// src/data/portfolio.ts
// Single source of truth for portfolio content, consumed by every theme.
// Derived from Sounic's resume + GitHub (github.com/ImSounic).

export const profile = {
  name: 'Sounic Akkaraju',
  firstName: 'Sounic',
  role: 'AI/ML Engineer',
  tagline: 'AI/ML Engineer & Full-Stack Builder',
  location: 'Enschede, Netherlands',
  timezone: 'Europe/Amsterdam',
  // Coordinates for Enschede (live weather widget)
  coords: { latitude: 52.2215, longitude: 6.8937 },
  email: 'imsounic.dev@gmail.com',
  phone: '+31 611732672',
  availability: 'Seeking SWE / AI-ML internships starting September 2026',
  summary:
    "Master's student in Computer Science (Data Science & Technologies) at the University of Twente, with a strong foundation in AI, Machine Learning, Deep Learning, and Big Data. Experienced in backend development and full ML pipelines, with hands-on work in NLP, healthcare prediction, distributed computing, and transformer-based model evaluation.",
  shortBio:
    'First-year Master’s student in Data Science & Technologies, graduating 2027. Building end-to-end ML pipelines and full-stack apps, from ensemble deep-learning models for healthcare to distributed big-data systems.',
} as const

export const socials = {
  github: 'https://github.com/ImSounic',
  linkedin: 'https://www.linkedin.com/in/imsounic/',
  email: 'mailto:imsounic.dev@gmail.com',
  resume: '/Resume.pdf',
} as const

export type Experience = {
  role: string
  company: string
  location: string
  period: string
  bullets: string[]
}

export const experience: Experience[] = [
  {
    role: 'Software Engineering Intern',
    company: 'CoreTek Labs',
    location: 'India',
    period: 'Jul 2023 - Sep 2023',
    bullets: [
      'Spearheaded development of an AI chatbot using the Django REST framework to build a seamless backend infrastructure.',
      'Applied web-scraping techniques and used the scraped data to train the chatbot, expanding its knowledge base for the company website.',
      'Worked closely with the back-end team in a collaborative, problem-solving environment.',
    ],
  },
]

export type Project = {
  id: string
  title: string
  subtitle: string
  period: string
  blurb: string // 1-2 line summary
  description: string // longer
  highlights: string[]
  tags: string[]
  github?: string
  link?: string
  image: string
  status?: 'live' | 'in-progress' | 'research'
  featured?: boolean
}

export const projects: Project[] = [
  {
    id: 'miscarriage-prediction',
    title: 'Miscarriage Prediction',
    subtitle: 'Bachelor Thesis · Ensemble Deep Learning',
    period: 'Dec 2024 - May 2025',
    blurb:
      'Ensemble deep-learning system for healthcare prediction achieving 93.1% AUC-ROC on national health-survey data.',
    description:
      'Built an ensemble deep-learning system combining TabTransformer, FT-Transformer, and TabNet, achieving 93.1% AUC-ROC on NFHS-5 national health-survey data. Developed a novel NearSMOTE class-balancing technique (SMOTE + NearMiss + Tomek links) to handle severe class imbalance, with a full pipeline of LASSO feature selection, PyTorch training on A100 GPUs, and SHAP interpretability.',
    highlights: [
      'Novel NearSMOTE class-balancing technique',
      '93.1% AUC-ROC on NFHS-5 data',
      'SHAP analysis surfaced prenatal care as a top protective factor',
    ],
    tags: ['PyTorch', 'Transformers', 'SHAP', 'Healthcare ML'],
    github:
      'https://github.com/ImSounic/Miscarriage-Prediction-Using-Ensemble-Deep-Learning-Model',
    image: '/projects/ai-project.jpg',
    status: 'research',
    featured: true,
  },
  {
    id: 'lora-vs-bert',
    title: 'In-Context Learning vs LoRA vs BERT',
    subtitle: 'NLP Research Project',
    period: 'Sep 2025 - Nov 2025',
    blurb:
      'Compared parameter-efficient fine-tuning vs in-context learning across 10 benchmark datasets.',
    description:
      'A 2-person research project comparing parameter-efficient fine-tuning against in-context learning across classification, QA, and reasoning tasks on 10 benchmarks. Built a BERT/DistilBERT pipeline reaching 93.7% accuracy on AG News, and ran systematic ICL experiments on Gemma3 models (270M-4B) across k-shot settings. Quantified that BERT delivers 190× higher throughput but zero cross-task transfer.',
    highlights: [
      '93.7% accuracy on AG News (BERT/DistilBERT)',
      'ICL experiments on Gemma3 270M-4B, k = 0/5/10/25',
      'Co-authored research article on deployment tradeoffs',
    ],
    tags: ['NLP', 'HuggingFace', 'LoRA', 'lm-eval'],
    image: '/projects/ai-project.jpg',
    status: 'research',
    featured: true,
  },
  {
    id: 'cleanslate',
    title: 'CleanSlate',
    subtitle: 'Cross-Platform Mobile App',
    period: 'Jun 2025 - Present',
    blurb:
      'Automated chore-management app (Flutter + Supabase) with Google Calendar sync and real-time updates.',
    description:
      'A cross-platform Flutter/Dart app with a Supabase backend (PostgreSQL with Row-Level Security, real-time subscriptions, Edge Functions). Integrated the Google Calendar API via OAuth 2.0 for automatic chore syncing with token refresh and event CRUD. Designed a 7-table relational schema and architected the app feature-first with the Repository pattern across 15+ modules.',
    highlights: [
      'Flutter + Supabase (RLS, realtime, Edge Functions)',
      'Google Calendar OAuth 2.0 sync',
      'Feature-first architecture, Repository pattern',
    ],
    tags: ['Flutter', 'Dart', 'Supabase', 'PostgreSQL'],
    image: '/projects/cleanslate.jpg',
    status: 'in-progress',
    featured: true,
  },
  {
    id: 'crypto-microstructure',
    title: 'Crypto Market Microstructure',
    subtitle: 'Managing Big Data Project',
    period: 'Dec 2025 - Feb 2026',
    blurb:
      'Distributed PySpark pipeline processing 32GB of Binance data across 1000+ pairs on an HDFS cluster.',
    description:
      'A distributed data pipeline using PySpark on a university HDFS cluster to process 32GB of Binance full trading history across 1000+ pairs. Engineered minute-level features (log returns, Amihud illiquidity, Parkinson volatility, taker ratios) and built three Spark jobs for stress liquidity comparison, BTC/ETH shock-propagation lag, and regime-dependent sensitivity. Found large-cap volatility amplifies 19× during stress and shocks propagate instantly while liquidity takes ~2h to recover.',
    highlights: [
      '32GB across 1000+ crypto pairs on HDFS',
      'Volatility amplifies 19× during market stress',
      'Adaptive query execution + Parquet columnar storage',
    ],
    tags: ['PySpark', 'HDFS', 'Big Data', 'Parquet'],
    github: 'https://github.com/ImSounic/mbd-project-binance',
    image: '/projects/big-data.png',
    status: 'research',
    featured: true,
  },
  {
    id: 'f1-strategy',
    title: 'F1 Race Strategy Optimizer',
    subtitle: 'Data Mining · Time Series',
    period: 'Feb 2026 - Mar 2026',
    blurb:
      'Optimizes Formula 1 pit-stop strategy with ML, Monte Carlo simulation, and Bayesian inference; 71% exact-match accuracy.',
    description:
      'A data-driven system for optimizing F1 pit-stop strategies, combining an XGBoost tyre-degradation model, per-circuit Bayesian safety-car probabilities, hierarchical circuit clustering, and a fast Monte Carlo simulator (~9,000 sims/sec). Trained on FastF1, OpenF1, and Jolpica data across 92 races (2022-2025) with rolling temporal validation and zero data leakage.',
    highlights: [
      '71% exact strategy match, 86% top-5 (dry, 2025)',
      'XGBoost tyre-degradation model, 0.079 s/lap MAE',
      'Bayesian safety-car model + DTW stint similarity',
    ],
    tags: ['XGBoost', 'Monte Carlo', 'Bayesian', 'Time Series'],
    github: 'https://github.com/ImSounic/f1-strategy-prediction',
    image: '/projects/big-data.png',
    status: 'research',
    featured: true,
  },
  {
    id: 'sepsis-forecasting',
    title: 'Sepsis Early-Warning (ICU)',
    subtitle: 'Healthcare ML · Time Series',
    period: 'Mar 2026 - Apr 2026',
    blurb:
      'Patient-level early sepsis prediction from ICU time-series on the PhysioNet 2019 dataset (40k patients, 1.3M timesteps).',
    description:
      "An ML pipeline that flags sepsis risk before onset from ICU vitals and labs (PhysioNet/CinC 2019: 40,336 patients, 1.3M timesteps, 1.84% sepsis-hour prevalence). Engineered clinical severity scores (SOFA, qSOFA, NEWS) and handled extreme class imbalance and 80-95% lab missingness to produce a patient-level risk score.",
    highlights: [
      '40,336 ICU patients, 1.3M timesteps',
      'Engineered SOFA / qSOFA / NEWS clinical scores',
      'Patient-level risk under 1.84% prevalence',
    ],
    tags: ['Healthcare ML', 'Time Series', 'Imbalanced Data'],
    github: 'https://github.com/ImSounic/sepsis-forecasting',
    image: '/projects/ai-project.jpg',
    status: 'research',
  },
  {
    id: 'ev-forecasting',
    title: 'EV Charging Demand Forecasting',
    subtitle: 'Forecasting · Applied AI',
    period: 'May 2026',
    blurb:
      'End-to-end forecasting of daily EV charging demand for Palo Alto: 19 model variants, time-aware CV, and a COVID stress test.',
    description:
      "A full forecasting study on Palo Alto's public EV charging network, comparing 19 model variants under time-aware cross-validation and a 2020 COVID stress test. Recommends a three-model deployment: an MLP seed-ensemble for point forecasts, a 7-quantile LightGBM with adaptive conformal intervals for procurement bands, and a MinT-reconciled per-station LightGBM for city-wide and per-station planning across 47 stations.",
    highlights: [
      '19 model variants, time-aware CV + COVID stress test',
      'MinT-reconciled hierarchical LightGBM, 12% MAE',
      'Quantile forecasts with adaptive conformal intervals',
    ],
    tags: ['Forecasting', 'LightGBM', 'Probabilistic', 'Time Series'],
    github: 'https://github.com/ImSounic/ev-forecasting',
    image: '/projects/big-data.png',
    status: 'research',
  },
  {
    id: 'cifr-quant',
    title: 'CIFR-Quant',
    subtitle: 'Quant · Foundation Models',
    period: '2026 - Present',
    blurb:
      'Multi-market algorithmic trading system that fine-tunes the Kronos financial foundation model for BTC, EUR, and gold.',
    description:
      'A multi-market algorithmic trading system built on Kronos, an open-source foundation model for financial candlestick data (102M parameters). Fine-tunes Kronos-base into three market-specialized checkpoints (BTC/USDT, EUR/USD, XAU/USD), runs 30-path Monte Carlo probabilistic forecasts, layers quantile-based risk management on top, and uses an LLM strategy layer to generate and select trades. Trained on an HPC cluster with Slurm.',
    highlights: [
      'Fine-tunes Kronos (102M) into 3 market checkpoints',
      '30-path Monte Carlo probabilistic forecasts',
      'Quantile risk + LLM strategy layer, HPC/Slurm training',
    ],
    tags: ['Foundation Models', 'PyTorch', 'Quant', 'Time Series'],
    github: 'https://github.com/ImSounic/cifr-quant',
    image: '/projects/ai-project.jpg',
    status: 'in-progress',
    featured: true,
  },
  {
    id: 'medsam-vpt',
    title: 'MedSAM-VPT',
    subtitle: 'Visual Prompt Tuning for Medical Foundation Models',
    period: '2025',
    blurb:
      'Visual prompt tuning to adapt medical imaging foundation models efficiently.',
    description:
      'Research exploring Visual Prompt Tuning (VPT) for adapting medical-imaging foundation models (SAM family) to downstream segmentation tasks with minimal trainable parameters.',
    highlights: [
      'Parameter-efficient adaptation of foundation models',
      'Medical image segmentation',
    ],
    tags: ['PyTorch', 'Foundation Models', 'Medical Imaging'],
    github: 'https://github.com/ImSounic/medsam-vpt',
    image: '/projects/ai-project.jpg',
    status: 'research',
  },
  {
    id: 'house-of-games',
    title: 'House of Games',
    subtitle: 'Quiz Game (Java)',
    period: '2024',
    blurb:
      'A quiz game inspired by the British TV show, with multiple rounds and scoring mechanisms.',
    description:
      'Created a quiz game inspired by the British TV show "House of Games", implementing various game rounds and scoring mechanisms. A showcase of building entertaining, interactive applications in Java.',
    highlights: ['Multiple game rounds', 'Custom scoring system'],
    tags: ['Java', 'Game Dev'],
    github: 'https://github.com/ImSounic/House-Of-Games',
    image: '/projects/house-of-games.jpg',
    status: 'live',
  },
]

export const education = [
  {
    degree: 'MSc Computer Science, Data Science & Technologies',
    school: 'University of Twente, Netherlands',
    period: 'Sep 2025 - Jun 2027',
    detail: 'Core: Machine Learning, Deep Learning, NLP, Big Data',
  },
  {
    degree: 'BSc Computer Science & Artificial Intelligence',
    school: 'University of Leeds & Aberystwyth University, UK',
    period: 'Sep 2023 - Jun 2025',
    detail: 'Scientific Python (1st), Software Engineering (1st), Persistent Data (1st)',
  },
]

export type SkillGroup = { category: string; items: string[] }

export const skills: SkillGroup[] = [
  {
    category: 'Languages',
    items: ['Python', 'Dart', 'TypeScript', 'JavaScript', 'Java', 'SQL', 'HTML/CSS'],
  },
  {
    category: 'ML / AI',
    items: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'HuggingFace', 'SHAP', 'Pandas', 'NumPy', 'lm-eval'],
  },
  {
    category: 'Frameworks',
    items: ['Flutter', 'Django REST', 'React', 'Next.js', 'PySpark', 'Supabase'],
  },
  {
    category: 'Cloud & Data',
    items: ['Google Cloud', 'OAuth 2.0', 'PostgreSQL', 'HDFS', 'Parquet', 'Git'],
  },
  {
    category: 'Concepts',
    items: ['Deep Learning', 'NLP', 'Transformers', 'Distributed Computing', 'REST APIs', 'Database Design'],
  },
  {
    category: 'Tools & Craft',
    items: ['Linux', 'Slurm', 'Bash', 'Figma', 'After Effects', 'Premiere'],
  },
]

export const whyHireMe = [
  {
    id: 'critical-thinker',
    title: 'Critical Thinker',
    description:
      'I break complex problems down to first principles, from designing a novel class-balancing technique to interpreting model behaviour with SHAP. I care about why a system works, not just that it does.',
    quote: 'A critical thinker never sleeps, just dreams in algorithms.',
  },
  {
    id: 'adaptive-innovator',
    title: 'Adaptive Innovator',
    description:
      'From PyTorch on A100 GPUs to Flutter apps to PySpark on HDFS clusters, I move fluidly across stacks. I learn fast and integrate new tools wherever they make the work better.',
    quote: 'Changing gears and mastering the new.',
  },
  {
    id: 'code-craftsman',
    title: 'Code Craftsman',
    description:
      'Clean architecture matters. I structure projects feature-first with clear separation of concerns: Repository patterns, typed pipelines, and reproducible experiments that hold up under scale.',
    quote: 'Crafting code like an artist paints a masterpiece.',
  },
]

export const languages = [
  { name: 'English', level: 'Fluent' },
  { name: 'Hindi', level: 'Fluent' },
  { name: 'Telugu', level: 'Native' },
  { name: 'Dutch', level: 'Learning' },
]

// ── Human voice: opinionated, specific, first-person. Use this copy verbatim
//    in themes to break the generic "empowering teams to build better products" slop.

export const manifesto =
  "I build models I can actually explain. A 93% AUC means nothing if you can't tell a clinician *why*, so I'd rather ship something interpretable than win a leaderboard. Most of my work lives at the unglamorous end: class imbalance, data that lies, joins that explode to four billion rows. That's the part I like."

// Short, punchy, defensible takes, each backed by something I actually did.
export const hotTakes = [
  "Interpretability isn't a nice-to-have. If you can't explain the prediction, you don't have a product. You have a liability.",
  "Most 'AI' is a fine-tuned BERT in a trench coat. I measured it: BERT gave 190× the throughput of an LLM with zero cross-task transfer. Ship the boring tool.",
  "Class imbalance is where models quietly learn to lie. I wrote NearSMOTE because the off-the-shelf fixes were making it worse.",
  "Big Data is 10% Spark and 90% realizing your join just became four billion rows.",
  "The best debugging tool I own is a video timeline. Editing taught me pacing, and pacing is just latency you can feel.",
  "Backtests are where strategies look brilliant. Out of sample is where they go to die, so I trust the walk-forward and nothing else.",
]

// What I'm actually doing right now (keep this current-ish; it reads human).
export const currently = {
  building: 'CleanSlate, a chore app my flatmates actually use',
  learning: 'Dutch (firmly at the "ik wil een koffie" stage)',
  exploring: 'mechanistic interpretability & visual prompt tuning for medical models',
  location: 'Enschede, NL. Usually 8°C and raining sideways',
}

// The creative side, genuinely shapes how I build software.
export const creative = {
  title: 'I cut video before I cut code',
  body: "I edit in After Effects and Premiere, and it rewired how I think about interfaces. Pacing, rhythm, when to cut. A clumsy loading state is just a bad edit. The same eye that times a montage times an animation curve.",
}

// Gaming, not a hobby line, a way of thinking.
export const gaming = {
  title: 'I read patch notes for fun',
  body: "I play strategy games the way I read papers: hunting for the dominant line, thinking two moves ahead, and actually reading the patch notes. Good games are just well-tuned systems, which is most of what ML is too.",
}

// A small, honest "colophon", great as an easter egg / footer note.
export const colophon =
  "Built with Next.js, too much coffee, and an unreasonable number of theme rewrites. Try the theme switcher, top right. Yes, I made all of them.";

export const navSections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'work', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]
