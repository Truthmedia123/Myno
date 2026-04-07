# Myno AI Tutor

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://vercel.com)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-blue)](https://tailwindcss.com)
[![Design System](https://img.shields.io/badge/Design-Consistent-6366f1)](./public/design-inspiration.md)

Myno is an AI-powered language learning tutor that helps users practice conversations, improve pronunciation, and build vocabulary through interactive scenarios.

## 🚀 Features

- **AI-Powered Conversations**: Real-time chat with Groq AI (llama-3.1-8b-instant)
- **Pronunciation Analysis**: Voice input with confidence scoring
- **Spaced Repetition**: FSRS-based vocabulary review system
- **Progress Tracking**: Streaks, achievements, and mastery levels
- **Offline Support**: PWA with service worker caching
- **Adaptive Learning**: Personalized content based on CEFR levels
- **Mascot System**: Friendly owl mascot (Myno) with adaptive expressions

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **AI Integration**: Groq API, custom prompt engineering
- **Database**: Firebase Firestore (optional), localStorage fallback
- **Voice**: Web Speech API, custom pronunciation engine
- **Deployment**: Vercel, GitHub Actions CI/CD
- **Design**: Custom design system with consistent patterns

## 🎨 Design System

Myno maintains visual consistency through a comprehensive design system:

### Quick Links
- **[Design Inspiration Guide](./public/design-inspiration.md)** - Curated resources and prompts
- **DesignReviewModal** - Built-in design review tool (`src/components/ui/DesignReviewModal.jsx`)
- **Design Prompts** - AI prompt utilities (`src/lib/designPrompts.js`)

### Using the Design System

#### 1. For AI-Assisted Design
```javascript
import { generateComponentPrompt } from '@/lib/designPrompts';

const prompt = generateComponentPrompt(
  'Dashboard Stats Card',
  'Show progress metrics in an engaging way',
  'Must include circular progress rings and work on mobile'
);
// Use this prompt with ChatGPT, Claude, or Figma AI
```

#### 2. Saving Design Inspiration
```javascript
import { saveDesignInspiration } from '@/lib/designPrompts';

saveDesignInspiration(
  'Onboarding Flow Example',
  'https://mobbin.com/apps/duolingo',
  'Great progressive disclosure pattern'
);
```

#### 3. Accessing Design Guide
Open the DesignReviewModal component in the app to:
- View the complete design system
- Browse saved inspiration
- Generate AI prompts
- Maintain consistency

### Design Principles
1. **Clarity**: Interface should be self-explanatory
2. **Consistency**: Similar elements behave similarly
3. **Efficiency**: Minimize steps to complete tasks
4. **Feedback**: Immediate visual feedback for actions
5. **Delight**: Small moments of joy through micro-interactions

### Color Palette
- **Primary**: `indigo-500` (#6366f1)
- **Secondary**: `purple-500` (#a855f7)
- **Background**: `gray-50` (#f9fafb)
- **Text**: `gray-900` (#111827)

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/Truthmedia123/Myno.git
cd Myno
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Add your Groq API key to .env
```

4. Run the development server:
```bash
npm run dev
```

## 🔧 Configuration

### Environment Variables
```env
VITE_GROQ_API_KEY=your_groq_api_key_here
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Firebase Setup (Optional)
1. Create a Firebase project
2. Enable Firestore and Authentication
3. Add web app configuration
4. Update environment variables

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy automatically on push

### Manual Build
```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── chat/           # Chat interface components
│   ├── ui/             # Reusable UI components
│   ├── dashboard/      # Dashboard components
│   └── onboarding/     # Onboarding components
├── lib/                # Utilities and services
│   ├── designPrompts.js        # Design system utilities
│   ├── groqClient.js           # AI API client
│   ├── memoryManager.js        # Spaced repetition system
│   ├── promptBuilder.js        # AI prompt engineering
│   └── streakManager.js        # Streak tracking
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── data/               # Static data and configurations
└── utils/              # Helper functions
```

## 🔄 Development Workflow

### Adding New Features
1. Check design inspiration guide for patterns
2. Use DesignReviewModal to ensure consistency
3. Generate AI prompts for complex components
4. Follow the design system color/typography rules
5. Test accessibility and responsiveness

### Code Style
- Use Tailwind CSS for styling
- Follow React hooks best practices
- Add JSDoc comments for exports
- Use TypeScript-like type annotations
- Maintain consistent file structure

## 🤝 Contributing

### Design Contributions
1. Review the [Design Inspiration Guide](./public/design-inspiration.md)
2. Use the DesignReviewModal to save inspiration
3. Generate prompts for AI-assisted design
4. Follow the design quality checklist

### Code Contributions
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Reporting Issues
- Use GitHub Issues
- Include screenshots for UI issues
- Describe expected vs actual behavior
- Note browser/device information

## 📚 Learning Resources

### For Developers
- [React Documentation](https://reactjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [Firebase Documentation](https://firebase.google.com/docs)

### For Designers
- [Myno Design Inspiration](./public/design-inspiration.md)
- [Figma Community](https://www.figma.com/community)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/)
- [Material Design](https://material.io/design)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Groq for AI inference
- Firebase for backend services
- Tailwind CSS for styling utilities
- React community for components and patterns
- All contributors and testers

## 📞 Support

- GitHub Issues: [Report bugs or request features](https://github.com/Truthmedia123/Myno/issues)
- Email: [Your contact email]
- Documentation: [Add documentation link]

---

*Built with ❤️ by the Myno team*  
*Last updated: ${new Date().toLocaleDateString()}*