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
- Progress persisted in localStorage (no authentication required)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Storage**: localStorage API

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

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
│   ├── progress.ts          # localStorage progress tracking
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
- **Persistent Progress**: localStorage ensures progress survives page refreshes
- **No Authentication**: Simple, frictionless learning experience

### Performance
- **Client-Side Rendering**: Interactive features use 'use client' directive
- **Shuffled Practice**: Characters randomized to prevent memorization of order
- **Efficient Storage**: Minimal localStorage usage with JSON serialization

## Future Enhancements

- Add dakuten/handakuten characters (が, ぱ, etc.)
- Include combination characters (きゃ, しゅ, etc.)
- Spaced repetition algorithm for smarter review scheduling
- Sound pronunciation for each character
- Writing practice with stroke order
- User accounts with cloud sync
- Leaderboards and achievements

## License

MIT

## Author

Built with ❤️ for Japanese language learners
