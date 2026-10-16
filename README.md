# TypeCert Enterprise — Typing Certification & Credential Verification Portal

> **Official Typing Speed Certification, Real-Time Analytics & Cryptographic Credential Verification**

TypeCert Enterprise is a production-grade, minimalist corporate web application for administering standardized typing examinations and issuing verifiable credentials. Built with a sleek corporate glassmorphism design system accented with `#94E1FF` gradients, the platform offers candidate testing, verifiable PDF certificates, candidate dashboards, and an instant employer verification portal.

---

## 🌟 Key Features

- **Standardized Typing Engine**: Real-time Gross WPM, Net WPM, accuracy %, consistency metric, and error penalty tracking with customizable durations (30s, 60s, 120s) and difficulty tiers (Standard Business, Tech & Legal, Numbers & Symbols).
- **Anti-Cheat & Integrity Engine**: Automated burst anomaly monitoring, paste interception, keystroke rhythm variance scoring, and focus tracking ensuring resume-grade certification.
- **Cryptographic & Verifiable Certificates**: Generates tamper-resistant digital diplomas with unique credential IDs (e.g. `TC-NOV-202610-XXXXXX`), signature blocks, and scannable verification QR codes.
- **One-Click Print to PDF**: Engineered print stylesheet formatting certificates strictly onto a single landscape sheet while hiding all browser controls, navigation bars, and buttons.
- **Employer Verification Portal**: Employers and recruiters can independently verify credential IDs, viewing certified WPM, accuracy, timestamp, and tamper-check status.
- **Candidate Dashboard**: Track historical test progression, average WPM, personal bests, and cloud-synced test sessions.
- **Dual Theme Support**: Full corporate Dark Mode and high-clarity Light Mode with custom frosted glass styling and `#94E1FF` sky-blue gradient accents.
- **Multi-Screen Responsive**: Seamless layout across mobile (320px+), tablet, and desktop viewports.
- **SEO & Structured Data**: Rich Schema.org markup (`WebApplication`, `EducationalOccupationalCredential`, `FAQPage`, `HowTo`, `BreadcrumbList`).

---

## 🔐 Security & Firebase Environment Variables

All Firebase configuration parameters and sensitive credentials are encrypted and isolated within environment variables rather than hardcoded in the application bundle or committed to version control.

### Required Environment Variables

Create a `.env` file in the project root (or set these variables in your deployment environment):

```bash
# Firebase Client Configuration
VITE_FIREBASE_API_KEY="your-firebase-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
VITE_FIREBASE_APP_ID="your-web-app-id"
VITE_FIREBASE_MEASUREMENT_ID=""
VITE_FIREBASE_FIRESTORE_DATABASE_ID="your-firestore-database-id"
```

> **Security Note:**
> - `.env` and `firebase-applet-config.json` are both listed in `.gitignore` to prevent credentials from being tracked by git.
> - Client-side environment variables use Vite's `VITE_` prefix to be safely bundled at compile time without exposing backend secrets.
> - An example template is provided in [`.env.example`](./.env.example).

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   ```bash
   cp .env.example .env
   # Edit .env and insert your Firebase credentials
   ```

4. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Build & Deployment

To compile the application for production:

```bash
# Type check and build static production bundle
npm run build

# Preview production build locally
npm run preview
```

The output artifacts will be located in the `dist/` directory, ready to deploy to any modern static hosting or CDN platform (Firebase Hosting, Vercel, Cloudflare Pages, Netlify, or Google Cloud Run).

---

## 📁 Project Architecture

```
├── .env.example             # Template for required environment variables
├── .gitignore               # Ignores sensitive env files and build outputs
├── firestore.rules          # Firestore security rules
├── index.html               # Semantic HTML shell, SEO meta & JSON-LD schemas
├── package.json             # Dependencies and scripts
├── src/
│   ├── App.tsx              # Core app container, theme management & routing
│   ├── components/
│   │   ├── Header.tsx               # Responsive navbar with theme toggle
│   │   ├── TypingEngine.tsx         # Real-time typing engine & anti-cheat
│   │   ├── OfficialCertificate.tsx  # Verifiable diploma & PDF print view
│   │   ├── VerificationPortal.tsx   # Public credential lookup portal
│   │   ├── CandidateDashboard.tsx   # Candidate statistics & test history
│   │   ├── SettingsModal.tsx        # Audio and test configuration modal
│   │   └── AboutView.tsx            # Corporate information & syllabus
│   ├── data/
│   │   └── testPassages.ts          # Certified test passages & difficulty tiers
│   ├── services/
│   │   └── firebase.ts              # Firebase Auth & Firestore client (reads from env)
│   ├── types/
│   │   └── index.ts                 # Domain TypeScript interfaces
│   └── utils/
│       ├── keyboardAudio.ts         # High-precision Web Audio click synthesizers
│       └── storage.ts               # LocalStorage & offline fallback helpers
└── vite.config.ts           # Vite bundler configuration
```

---

## 📄 License

TypeCert Enterprise is open-source software licensed under the MIT License.
