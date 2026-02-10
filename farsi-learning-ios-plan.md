# Farsi Learning iOS App Concept ("Penglish Play")

## 1) Product Vision
Build a playful, AI-powered iOS app that teaches Persian (Farsi) through **Penglish** (Persian written with Latin letters), then gradually transitions learners to Persian script.

The app should feel:
- Friendly and playful (inspired by game-like learning loops)
- Culturally rich (Nowruz, Shab-e Yalda, Persian poetry, food, traditions)
- Personalized for each learner using AI
- Safe and age-appropriate for kids and families

---

## 2) Target Users
- **Kids (6–12):** short lessons, animation-first, mascot guidance
- **Teens/adults beginners:** practical conversation and pronunciation
- **Parents/heritage learners:** reconnect with culture and language

---

## 3) Core Learning Experience

### Daily Session Loop (5–10 minutes)
1. Warm-up (review streak + 2 quick words)
2. New mini-lesson (10–20 seconds animation + 3 words/phrases)
3. Pronunciation practice (record + AI feedback)
4. Cultural "story card" (e.g., Nowruz table items)
5. Quick quiz + reward

### Micro-content format
- 10-second animated clips with cute Persian-inspired art
- Flash cards with:
  - Penglish (e.g., "salaam")
  - Persian script ("سلام")
  - Audio
  - Translation
- Progression from Penglish-heavy -> mixed -> Persian script-first

---

## 4) AI Personalization Strategy
Use AI to adapt for each learner:

- **Difficulty adjustment:** pace, repetition, and challenge based on performance
- **Pronunciation feedback:** gentle, child-friendly coaching
- **Custom examples:** AI generates examples using learner interests (animals, football, space)
- **Smart review scheduler:** spaced repetition + streak recovery suggestions
- **Parent/teacher mode:** weekly summary and suggested offline activities

### AI Guardrails
- Content moderation for generated text/images/audio prompts
- No open-ended unsafe chat for children
- Curated topic boundaries + retrieval from approved cultural content set

---

## 5) Cultural Curriculum (Iran-Focused)
Create seasonal/event learning modules:

- **Nowruz:** Haft-Seen vocabulary, greetings, family traditions
- **Shab-e Yalda:** pomegranate, poetry, longest night concepts
- **Mehregan, Sizdah Bedar, Chaharshanbe Suri**
- Persian geography, famous figures, food, and simple history timelines

Each event module includes:
- Story animation
- Vocabulary pack
- Phrase pack
- Cultural quiz
- Family challenge activity

---

## 6) Feature Set (MVP -> V2)

### MVP (first release)
- iOS app (SwiftUI)
- Account + learner profile
- Lesson player (animation + cards + audio)
- Basic AI personalization (difficulty + review cadence)
- **AI Tutor (conversation practice with guided corrections)**
- **AI Companions (role-based speaking partners + cultural context)**
- Streaks and calendar
- Core holiday packs (Nowruz + Yalda)
- Parent dashboard (read-only progress)

### V2
- Multiplayer family challenges
- Classroom mode for tutors
- Offline packs for travel
- Expanded cultural library
- Companion marketplace (new personas and scenarios)

---

## 7) Suggested Technical Architecture

### iOS Frontend
- SwiftUI + MVVM
- Local cache: Core Data or SQLite
- AVFoundation for recording/playback
- StoreKit for subscription

### Backend
- API layer (FastAPI or Node)
- User profiles, progress, streaks, content delivery
- AI orchestration service (prompt templates + moderation + analytics)
- CDN for animation/image/audio assets

### AI Stack
- LLM for explanation/customization
- Speech-to-text for pronunciation assessment
- Optional text-to-speech for phrase playback
- Safety layer before/after generation

---

## 8) Monetization
- Freemium model:
  - Free: daily lessons + core cultural modules
  - Premium: unlimited AI tutor, full festival packs, advanced reports
- Family plan + school pilot licensing

---

## 9) 90-Day Build Plan

### Days 1–30
- Finalize curriculum map and design system
- Build lesson engine + account flow
- Prepare first 100 vocabulary items and 30 animations

### Days 31–60
- Integrate AI personalization and pronunciation scoring
- Add streak calendar and parent summary
- Internal alpha test

### Days 61–90
- Add Nowruz + Yalda modules
- Improve onboarding and retention loops
- TestFlight beta + feedback iteration

---

## 10) Troubleshooting & Launch Readiness Checklist
Use this checklist before beta launch:

1. **Content quality**
   - Validate Penglish spelling consistency
   - Confirm Persian script correctness with native reviewers
2. **AI reliability**
   - Evaluate personalization outputs for age-appropriateness
   - Add fallback deterministic content when AI confidence is low
3. **Audio pipeline**
   - Test pronunciation scoring in noisy environments
   - Tune thresholds for younger voices
4. **Performance**
   - Ensure animations load under 1s on low-end devices
   - Pre-cache next lesson assets
5. **Safety and privacy**
   - COPPA/GDPR-K review for child data handling
   - Enable moderation logs and incident response process
6. **Retention mechanics**
   - Verify streak recovery logic
   - A/B test reward timing (after lesson vs after quiz)

---

## 11) Useful Documentation
- Apple SwiftUI: https://developer.apple.com/documentation/swiftui/
- Apple Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines/
- Apple AVFoundation: https://developer.apple.com/documentation/avfoundation/
- OpenAI API docs: https://platform.openai.com/docs
- OpenAI safety best practices: https://platform.openai.com/docs/guides/safety-best-practices
- OpenAI prompt engineering guide: https://platform.openai.com/docs/guides/prompt-engineering

---

## 12) Naming Options (App + Private Repository)

### Recommended app name
- **Parya** (short, brandable, Persian feel, easy in English)

### Strong alternatives
1. **Parya Learn**
2. **GolBarg Kids Farsi**
3. **PersiPlay**
4. **Roozoo Farsi**
5. **Bamdad Farsi**

### Private repo naming options
- `parya-ios`
- `parya-learning-app`
- `persiplay-ios`
- `farsi-penglish-ios`

### Name decision checklist
- Easy to pronounce globally
- Not too similar to Duolingo or existing app trademarks
- Works for both kid and family audiences
- Domain/social handle likely available

---

## 13) Private Repo Setup & Troubleshooting (Step-by-Step)

Because this product includes child-learning features and AI prompts/content, keep source code in a **private repository** by default.

### A) Create a private GitHub repository
1. Go to GitHub -> **New repository**
2. Repository name: pick from section 12
3. Select **Private**
4. Disable "Add README" if importing an existing repo
5. Create repository

### B) Push existing local project to private remote
```bash
git remote remove origin || true
git remote add origin git@github.com:<org-or-user>/<private-repo-name>.git
git push -u origin <branch-name>
```

### C) Verify visibility and access
- Confirm repo badge says **Private**
- Check collaborators and org teams have least-privilege access
- Enable branch protection on `main`

### D) Troubleshooting common push issues
1. **Permission denied (publickey)**
   - Confirm SSH key is loaded: `ssh-add -l`
   - Test auth: `ssh -T git@github.com`
2. **Repository not found**
   - Verify repo name/owner in remote URL: `git remote -v`
   - Confirm you have write access
3. **Protected branch rejects push**
   - Push feature branch and open PR
   - Merge via review workflow
4. **Accidentally created public repo**
   - Go to repo **Settings -> General -> Danger Zone -> Change repository visibility -> Make private**

### E) Security hardening
- Enable secret scanning and push protection
- Add dependency and code scanning (CodeQL)
- Keep API keys in GitHub Actions secrets, never in source


---

## 14) AI Tutor + AI Companions (Now Implemented)

You now have both real-time practice features in scope:
- **AI Tutor:** structured coaching for pronunciation, grammar, and phrase corrections
- **AI Companions:** friendly, role-based speaking partners for daily-life practice

### Companion examples
- American learner with Persian mother-in-law (family etiquette and respectful phrasing)
- Student preparing for Nowruz gathering (greetings + hosting language)
- Traveler practicing market/restaurant Persian

### Conversation design principles
1. Start with learner goals (family, travel, social, business)
2. Keep responses short and level-appropriate
3. Offer both **Penglish + Persian script + translation** where useful
4. Give one correction at a time to avoid overload
5. End each chat with 2-3 review phrases for spaced repetition

### Safety and quality guardrails for companions
- No emotional dependency framing (companions are practice partners, not replacements for real relationships)
- Refuse harmful/legal/medical high-risk guidance and redirect safely
- Use culturally respectful suggestions with neutral tone
- Log and review low-confidence cultural recommendations

### Example role prompt (high-level)
"You are a supportive Farsi speaking partner. Adapt to learner CEFR-like level, provide culturally respectful responses, include Penglish transliteration when needed, and add concise corrections after the learner message."

---

## 15) Troubleshooting AI Tutor/Companion Quality

### A) If replies are too advanced
- Lower target level in learner profile
- Increase short-sentence constraint in system prompt
- Add required transliteration output format

### B) If cultural suggestions feel off
- Retrieve from approved cultural knowledge base first
- Add country/region/family-context metadata
- Route uncertain outputs to safer generic alternatives

### C) If corrections are overwhelming
- Cap corrections to one key issue per turn
- Prioritize communication clarity over perfection
- Defer grammar deep-dives to post-chat summary

### D) If latency is high
- Stream partial responses
- Cache repeated scenario setup prompts
- Use smaller/faster model for low-risk companion turns

### E) Validation checklist before release
- Human review of 100+ companion dialogues across personas
- Bias and tone checks for family/culture-sensitive scenarios
- Red-team harmful prompt attempts and verify safe refusal behavior
