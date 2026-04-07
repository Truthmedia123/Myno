# Myno Design Inspiration Guide

Curated resources and prompts for maintaining visual consistency in Myno AI Tutor.

## 🌟 Design Inspiration Sources

### UI/UX Patterns
- **Mobbin**: https://mobbin.com
  - Search terms: `language learning onboarding`, `education dashboard`, `progress tracking`, `gamification`
  - Best for: Complete user flows, interaction patterns, mobile-first designs

- **60FPS**: https://60fps.club
  - Search terms: `micro-interactions`, `loading animations`, `state transitions`, `gesture feedback`
  - Best for: Smooth animations, performance-optimized interactions

- **Spotted in Prod**: https://spottedinprod.com
  - Search terms: `real-world patterns`, `production apps`, `enterprise UX`, `mobile patterns`
  - Best for: Practical implementations, edge cases, scalability considerations

- **Dribbble**: https://dribbble.com
  - Search terms: `language app ui`, `education design`, `owl mascot`, `gradient cards`, `glassmorphism`
  - Best for: Visual aesthetics, color palettes, illustration styles

- **Pinterest**: https://pinterest.com
  - Search terms: `language learning interface`, `educational technology`, `minimalist dashboard`, `interactive cards`
  - Best for: Mood boards, style exploration, color inspiration

### Component Libraries
- **shadcn/ui**: https://ui.shadcn.com
  - Reference for: Accessible components, consistent styling, React patterns
- **Tailwind UI**: https://tailwindui.com
  - Reference for: Production-ready components, responsive layouts
- **Radix UI**: https://radix-ui.com
  - Reference for: Unstyled, accessible primitives

### Icon Resources
- **Heroicons**: https://heroicons.com
  - Usage: Default icon set for Myno (outline + solid variants)
- **Lucide**: https://lucide.dev
  - Usage: Additional icons when Heroicons doesn't have what we need
- **Iconify**: https://iconify.design
  - Usage: Search for specific icons across multiple sets

## 🎨 Myno-Specific Search Terms

### For AI Image Generation (Midjourney/DALL-E)
```
1. "friendly owl mascot learning languages, digital illustration, flat design, pastel colors, educational app"
2. "language learning interface with progress rings, clean dashboard, indigo and purple theme, glassmorphism"
3. "micro-interaction animation for correct answer, celebration effect, particle system, educational app"
4. "onboarding screen for language app, step-by-step guide, friendly mascot guiding user, clean typography"
5. "vocabulary card with pronunciation button, word of the day, minimalist design, language learning"
```

### For UI Design Tools (Figma/Canva)
```
1. "Myno color palette: indigo-500 (#6366f1), purple-500 (#a855f7), gray-50 (#f9fafb)"
2. "Typography: system-ui font stack, 400/600 weights, 1.5 line height"
3. "Spacing: 4px base unit, consistent 8/16/24/32px margins"
4. "Border radius: 8px for buttons, 12px for cards, 16px for modals"
5. "Shadows: subtle elevation (shadow-sm), no harsh drop shadows"
```

## 📝 Example Prompts for AI Design Assistants

### For ChatGPT/Claude (Component Generation)
```
I need a React component for Myno AI Tutor. Follow these design system rules:

COLORS:
- Primary: indigo-500 (#6366f1)
- Secondary: purple-500 (#a855f7)
- Background: gray-50 (#f9fafb)
- Text: gray-900 (#111827)

TYPOGRAPHY:
- Font: system-ui stack
- Scale: xs (12px), sm (14px), base (16px), lg (18px), xl (20px), 2xl (24px)
- Weights: 400 (normal), 600 (semibold)

COMPONENT: [Describe your component here]
GOAL: [What it should achieve]
CONSTRAINTS: [Any limitations]

Output should be:
1. React JSX with Tailwind CSS
2. Mobile-responsive
3. Accessible (ARIA labels, keyboard navigation)
4. With hover/focus states
5. Comments explaining design decisions
```

### For Midjourney (Illustration Generation)
```
/imagine prompt: friendly owl mascot named Myno holding a language book, digital illustration, flat design style, pastel color palette with indigo and purple accents, clean lines, educational app character, vector art, no background --ar 1:1 --style raw
```

### For Figma AI
```
Create a dashboard component for language learning progress tracking with:
- Circular progress rings showing vocabulary mastery
- Weekly streak counter with visual celebration
- Phoneme accuracy chart with color coding
- Myno mascot in the corner with encouraging expression
- Use Myno design system colors and typography
- Ensure mobile responsiveness
```

## 🧩 Design Patterns to Emulate

### 1. Onboarding Flows
```
Reference: Duolingo, Babbel, Memrise
Key elements:
- Progress indicators (3-5 steps max)
- Friendly mascot guidance
- Clear value proposition per screen
- Minimal required information
- Skip option available
```

### 2. Progress Tracking
```
Reference: Khan Academy, Coursera
Key elements:
- Visual progress rings/circles
- Streak counters with celebration
- Milestone badges
- Weekly/monthly summaries
- Shareable achievements
```

### 3. Interactive Learning
```
Reference: Quizlet, Anki
Key elements:
- Immediate feedback (correct/incorrect)
- Micro-interactions (button presses, card flips)
- Pronunciation playback
- Spaced repetition indicators
- Difficulty adjustment
```

### 4. Community Features
```
Reference: HelloTalk, Tandem
Key elements:
- User avatars with language flags
- Conversation starters
- Correction system
- Encouragement mechanisms
- Safe interaction design
```

## 🔧 How to Contribute to Myno's Design

### 1. Found a Great Pattern?
1. Save it using the DesignReviewModal in the app
2. Add notes on what makes it work well
3. Suggest how to adapt it for Myno
4. Share the URL with the team

### 2. Want to Improve a Component?
1. Use the Prompt Builder to generate an AI design brief
2. Test the new design against accessibility standards
3. Ensure it follows the Myno design system
4. Document the changes in a pull request

### 3. Have Color/Illustration Ideas?
1. Create a mood board with similar aesthetics
2. Test color contrast ratios (minimum 4.5:1)
3. Ensure illustrations are culturally appropriate
4. Keep file sizes optimized for web

### 4. Found a Bug or Inconsistency?
1. Take a screenshot
2. Note the device/browser
3. Describe the expected behavior
4. Use GitHub Issues to report

## 📊 Design Quality Checklist

### ✅ Before Implementing
- [ ] Follows Myno color palette
- [ ] Uses correct typography scale
- [ ] Responsive across breakpoints
- [ ] Accessible (keyboard, screen readers)
- [ ] Performance optimized (images, animations)

### ✅ After Implementation
- [ ] Tested on mobile/desktop
- [ ] Color contrast verified
- [ ] Loading states implemented
- [ ] Error states designed
- [ ] Animation smoothness checked

### ✅ Before Release
- [ ] Design reviewed in DesignReviewModal
- [ ] Inspiration saved if novel pattern
- [ ] Prompt updated for future reference
- [ ] Documentation added to this guide

## 🚀 Quick Start for New Designers

1. **Review the Design System**: Open DesignReviewModal → Design Guide tab
2. **Save Inspiration**: Find 3-5 references you like, save them in Inspiration tab
3. **Generate Prompt**: Use Prompt Builder for your first component
4. **Implement**: Code the component following the generated prompt
5. **Review**: Check against the Design Quality Checklist above

## 🔗 Additional Resources

- [Myno GitHub Repository](https://github.com/Truthmedia123/Myno)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/standards-guidelines/wcag/)
- [Google Material Design](https://material.io/design)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

---

*Last updated: ${new Date().toLocaleDateString()}*  
*Maintainer: Myno Design Team*  
*Version: 1.0*