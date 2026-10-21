# 🎯 ProblemRadar

> **Discover 1 year of high-intent everyday & business problems from Reddit, inspect profitable online businesses solving them with verified Monthly Recurring Revenue (MRR), and execute autonomous AI agent solutions in real time.**

---

## 📸 Application Preview

![ProblemRadar Dashboard](./docs/images/desktop-overview.png)

*ProblemRadar Dashboard: Real-time intelligence feed tracking pain points across 12 months with verified business MRRs and one-click AI Agent automation.*

---

## ✨ Key Capabilities & Screenshots

### 1. 💼 Online Business Solutions with Monthly Revenue (MRR)
Explore real online business models making anywhere from **$4,500/mo to $88,000/mo** solving verified problems. Each business card features verified pricing tiers, business models (SaaS, Agency, Micro-SaaS), tech stacks, and step-by-step monetization blueprints.

![Online Business Breakdown](./docs/images/business-modal.png)

### 2. 🤖 Autonomous AI Agent Studio & Code Generator
For any selected pain point, instantiate an autonomous agent workflow. Watch the live console execute multi-step routines (scraping, synthesis, classification, enrichment) and export production-ready TypeScript code, system prompts, or n8n workflow definitions.

![AI Agent Studio](./docs/images/agent-studio.png)

### 3. 📊 Opportunity Matrix & ROI Calculator
Visualize problems on an interactive **Impact vs. Effort** quadrant matrix. Toggle real-time ROI simulations to estimate development timelines, estimated launch costs, and projected 12-month revenue potential.

![Opportunity Matrix](./docs/images/opportunity-matrix.png)

### 4. 📱 Responsive & Mobile-Optimized
Full-featured responsive interface engineered for desktop, tablet, and mobile workflows with smooth animations and touch ergonomics.

![Mobile Interface](./docs/images/mobile-overview.png)

---

## 📁 Repository Structure & Assets

All project screenshots and diagrams are tracked in `./docs/images/` and `./public/` with clean relative paths for complete GitHub compatibility:

```text
├── docs/
│   └── images/
│       ├── desktop-overview.png       # Main overview dashboard
│       ├── business-modal.png         # Online business & MRR breakdown
│       ├── agent-studio.png           # AI agent code builder & terminal
│       ├── opportunity-matrix.png     # Impact/Effort matrix & ROI
│       └── mobile-overview.png        # Mobile responsive view
├── public/
│   ├── og-image.png                   # OpenGraph social share card
│   ├── preview.png                    # App preview image
│   └── favicon.png                    # Browser favicon
├── src/                               # Frontend React + Tailwind source
├── server.ts                          # Express + Gemini backend proxy
└── README.md                          # Project documentation
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- Gemini API Key (optional, for live AI scans and custom agents)

### Installation

1. **Clone repository**:
   ```bash
   git clone https://github.com/your-username/problem-radar.git
   cd problem-radar
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment** (optional):
   ```bash
   cp .env.example .env
   # Add your GEMINI_API_KEY if desired
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Motion, Lucide Icons
- **Backend**: Node.js Express server (`server.ts`) with Vite middleware
- **AI Engine**: Google GenAI SDK (`@google/genai`)
- **Assets & Media**: Relative PNG assets in `docs/images/` and `public/` for reliable GitHub preview
