# Research Notes: Adaptive Kana and Kanji Learning

## Project framing

Learn Kana is structured as a lightweight adaptive learning system for Japanese kana and kanji practice. The system is designed to answer a central research question: how can a browser-based study tool use learner interaction data to choose more useful practice items over time?

The current implementation focuses on local, transparent personalization rather than account-based data collection. This makes it suitable for classroom demonstration, usability testing, and early educational data mining experiments without requiring a backend.

## Alignment with Watanobe Laboratory

Professor Yutaka Watanobe's lab emphasizes Smart Learning, Virtual TA systems, adaptive user interfaces, machine learning support models, educational data mining, and algorithmic transparency. Learn Kana aligns with those themes by treating language study as an autonomous learning support problem rather than a static practice tool.

The app now includes:

- A learner model that estimates item-level memory strength.
- A Virtual TA feedback layer that explains the learner's current state and next action.
- A transparent adaptive UI policy that shows why recommendations are selected.
- Educational data mining traces such as attempts, response time, weak items, and recent failures.
- A research alignment page that maps implementation details to lab themes.

Although the domain is Japanese character learning rather than programming education, the research structure is similar: learners attempt small tasks, the system observes performance, models difficulty, recommends next tasks, and provides feedback to support autonomous learning.

## Learning model

Each kana or kanji item has its own learner model entry. The stored fields include correct answers, incorrect answers, total attempts, last seen timestamp, ease factor, review interval, next review timestamp, consecutive correct count, and recent failure timestamps.

The spaced repetition engine starts each item with an ease factor of 2.5. Correct answers increase the review interval using the current ease factor. Incorrect answers reset the interval so the item becomes due immediately. Ease factor is adjusted after every response with a simplified SM-2 style update: successful recall gradually increases review spacing, while failed recall lowers confidence and schedules near-term review.

This model helps the system understand the learner by estimating item-level memory strength rather than treating all characters as equally known or unknown.

## Recommendation logic

The recommendation system ranks items using three main signals:

1. Due items from the spaced repetition schedule.
2. Low accuracy items based on correct answers divided by attempts.
3. Recently failed items, detected from recent failure timestamps.

When no due or weak items are available, the system introduces new characters from the curriculum. This balances exploitation and exploration: the learner reviews known weaknesses first, but still progresses through new material when review demand is low.

The quiz page and learner dashboard both show a "Recommended for you" section so the adaptive decision is visible. This is important for adaptive user interface research because it makes system behavior inspectable rather than hidden.

## Virtual TA feedback

The dashboard includes a Virtual TA-style feedback panel. It summarizes the learner state, recommends a next action, and lists the evidence used to produce the feedback. The current implementation is rule-based so it remains explainable during early research review.

This feature supports the Smart Learning goal of helping learners continue without constant instructor availability. It also creates a baseline that could later be replaced or compared with machine learning models that predict error probability, dropout risk, or readiness for new material.

## Algorithmic transparency

The adaptive UI policy inspector shows the current recommendation policy and the counts of due, weak, new, and selected items. It also displays the ranking signals and weights used by the recommender.

This directly supports algorithmic transparency: the learner and researcher can inspect the system's behavior instead of treating adaptation as a black box. In a future study, this could support a comparison between hidden adaptation and transparent adaptation.

## Data collected

The app stores data locally in the browser. The current data includes:

- Item-level progress for kana and kanji.
- Correct, incorrect, and total attempt counts.
- Last seen and next review timestamps.
- Spaced repetition ease factor and interval.
- Recent failure timestamps.
- Kana quiz attempt logs with response time, selected answer, expected answer, practice mode, kana type, group, and detected visual confusion pairs.

No authentication, external API, or remote database is used. The data layer is centralized in `lib/storage.ts` so the same interface can later be backed by a server-side repository.

## Learning analytics

The progress page presents analytics that are useful for both learners and researchers:

- Accuracy by category: hiragana, katakana, and kanji.
- Weakest 10 characters by accuracy and misses.
- Recent mistakes.
- Kanji completion by grade level.
- Basic study streak.

These measures support formative feedback for the learner and provide observable outcomes for evaluating whether recommendations are improving practice efficiency.

## Research uses

This system could support undergraduate research in several ways:

- Adaptive user interfaces: compare visible recommendations against non-adaptive quiz selection.
- Learning analytics: study how accuracy, streaks, and weak-item lists affect learner self-regulation.
- Recommendation systems: evaluate whether due-first and weakness-first ranking improves quiz accuracy over later sessions.
- Educational data mining: analyze response times, confusion pairs, and recent failures to identify patterns of kana similarity or persistent kanji difficulty.
- Virtual TA systems: evaluate whether generated feedback improves learner self-regulation and persistence.
- Algorithmic transparency: compare learner trust and outcomes when recommendation reasons are shown versus hidden.

Future research extensions could include controlled A/B studies, server-side anonymized logging, pre/post assessments, teacher dashboards, and model comparisons between random practice, spaced repetition, and hybrid recommendation policies.
