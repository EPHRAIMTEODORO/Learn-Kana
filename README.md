# Learn Kana

A modern, interactive web application for learning Japanese Hiragana and Katakana characters. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

### 📋 Kana Chart
- Complete visual reference of all Hiragana and Katakana characters
- Traditional grid layout organized by consonant rows and vowel columns
- Three view modes: Hiragana only, Katakana only, or both side-by-side
- Each character displays with its romaji pronunciation
- Hover effects and mobile-responsive design

### 🎴 Flashcards
- Interactive flip cards showing characters and romaji
- Three learning modes: Hiragana only, Katakana only, or Mixed
- Self-assessment with "I Know This" and "Still Learning" buttons
- Randomized card order for better retention

### ✍️ Quiz Mode
- Multiple-choice quizzes with 10 questions per session
- Two question types: character → romaji and romaji → character
- Randomized questions and answer options
- Immediate feedback with color-coded answers
- Score tracking and performance summary

### 📊 Progress Tracking
- Per-character statistics: correct count, incorrect count, accuracy percentage
- Last reviewed timestamp for each character
- Filter by learning status (All, Learning <80%, Mastered ≥80%)
- Overall statistics dashboard
- Progress persisted in MongoDB with a browser cache for responsive practice

### 🔐 Accounts
- Email/password signup and login
- Google federated login
- HTTP-only session cookies
- User progress stored under the signed-in account
- Anonymous learner data can be merged into an account after login/signup

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Storage**: MongoDB via Next.js route handlers, plus browser cache fallback
- **Auth**: MongoDB-backed users and sessions with Node crypto password hashing

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure MongoDB:
```bash
cp .env.example .env.local
```

Set `MONGODB_URI` to your MongoDB connection string. `MONGODB_DB` defaults to `learn-kana` if omitted.

For Google login, create a Google OAuth Web application client and add this authorized redirect URI:

```text
http://localhost:3000/api/auth/google/callback
```

Then set:

```bash
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
Learn-Kana/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Home page
│   ├── chart/page.tsx       # Kana chart reference
│   ├── learn/page.tsx       # Flashcard mode
│   ├── quiz/page.tsx        # Quiz mode
│   ├── progress/page.tsx    # Progress dashboard
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/              # React components
│   └── Flashcard.tsx        # Flashcard component with flip animation
├── data/                    # Static data
│   └── kana.ts              # Hiragana and Katakana datasets
├── types/                   # TypeScript type definitions
│   └── kana.ts              # Core data types
├── utils/                   # Utility functions
│   ├── progress.ts          # Learner progress utilities
│   └── quiz.ts              # Quiz question generation
└── package.json
```

## Key Design Decisions

### Data Model
- **Immutable Character Data**: Hiragana and Katakana characters stored as static arrays for consistency
- **Progress Separation**: Learning progress tracked separately from character definitions
- **Type Safety**: Full TypeScript coverage ensures type-safe data flow

### User Experience
- **Mobile-First**: Responsive design optimized for touch devices
- **Immediate Feedback**: Visual feedback for correct/incorrect answers in quiz mode
- **Persistent Progress**: MongoDB stores progress, review schedules, and attempt logs
- **User Accounts**: Signed-in users keep their learner data under an account
- **Anonymous Learner Profile**: Visitors can still practice before creating an account

### Performance
- **Client-Side Rendering**: Interactive features use 'use client' directive
- **Shuffled Practice**: Characters randomized to prevent memorization of order
- **Responsive Storage**: Browser cache keeps the UI fast while MongoDB syncs in the background

## Future Enhancements

- Spaced repetition algorithm for smarter review scheduling
- Sound pronunciation for each character
- Writing practice with stroke order
- User accounts across devices
- Leaderboards and achievements

## License

MIT

## Author

Built with ❤️ for Japanese language learners
