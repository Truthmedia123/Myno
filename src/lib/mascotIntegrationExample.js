/**
 * Myno Adaptive Mascot Integration Example
 * Shows how to integrate the adaptive mascot system into existing components
 * @module mascotIntegrationExample
 */

import { useAdaptiveMascot } from '@/hooks/useAdaptiveMascot';
import { getAdaptiveMascotState, getScenarioMascotState } from '@/data/mynoMascot';

/**
 * Example 1: Integrating with Chat.jsx
 * 
 * In your Chat component, add:
 * 
 * ```jsx
 * import { useAdaptiveMascot } from '@/hooks/useAdaptiveMascot';
 * import AdaptiveMascotAvatar from '@/components/ui/AdaptiveMascotAvatar';
 * 
 * export default function Chat() {
 *   const [messages, setMessages] = useState([]);
 *   const [userProfile, setUserProfile] = useState(null);
 *   
 *   // Initialize adaptive mascot
 *   const { 
 *     state, 
 *     prompt, 
 *     recordInteraction,
 *     updateContext 
 *   } = useAdaptiveMascot(userProfile, {
 *     sessionMessages: messages.length,
 *     consecutiveCorrect: 0,
 *     phonemeAccuracy: 0.7
 *   });
 *   
 *   // Update context when messages change
 *   useEffect(() => {
 *     updateContext({ sessionMessages: messages.length });
 *   }, [messages.length, updateContext]);
 *   
 *   // Record interactions
 *   const handleUserMessage = async (text) => {
 *     // ... existing message handling
 *     
 *     if (isCorrect) {
 *       recordInteraction('celebration', { phonemeAccuracy: 0.9 });
 *     } else {
 *       recordInteraction('correction', { phonemeAccuracy: 0.4 });
 *     }
 *   };
 *   
 *   return (
 *     <div>
 *       {/* Mascot avatar in header *\/}
 *       <AdaptiveMascotAvatar
 *         userProfile={userProfile}
 *         size="md"
 *         showTip={true}
 *       />
 *       
 *       {/* Use mascot prompt in AI calls *\/}
 *       <button onClick={() => sendMessageWithMascot(prompt)}>
 *         Send with Mascot Personality
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */

/**
 * Example 2: Integrating with AI prompt builder
 * 
 * ```jsx
 * import { buildScenarioPrompt } from '@/lib/promptBuilder';
 * import { generateMynoPrompt } from '@/data/mynoMascot';
 * 
 * const sendMessageWithMascot = async (userMessage) => {
 *   const scenarioPrompt = buildScenarioPrompt(scenario, userProfile);
 *   
 *   // Get mascot state based on user performance
 *   const analytics = {
 *     accuracy: 0.8,
 *     streak: 3,
 *     sessionTime: 300,
 *     recentMistakes: 1
 *   };
 *   
 *   const mascotState = getAdaptiveMascotState(analytics, userProfile);
 *   const mascotPrompt = generateMynoPrompt(mascotState, userProfile?.target_language);
 *   
 *   // Combine prompts
 *   const fullPrompt = `${scenarioPrompt}\n\n${mascotPrompt}`;
 *   
 *   // Send to Groq API
 *   const response = await callGroq([
 *     { role: 'system', content: fullPrompt },
 *     { role: 'user', content: userMessage }
 *   ]);
 *   
 *   return response;
 * };
 * ```
 */

/**
 * Example 3: Scenario-specific mascot states
 * 
 * ```jsx
 * const ScenarioComponent = ({ scenario, performance }) => {
 *   const mascotState = getScenarioMascotState(scenario.type, performance);
 *   
 *   return (
 *     <div className={`p-4 rounded-lg ${mascotState.bgColor}`}>
 *       <div className="flex items-center gap-3">
 *         <span className={`text-2xl ${mascotState.color}`}>
 *           {mascotState.expression}
 *         </span>
 *         <div>
 *           <h3 className="font-bold">{scenario.title}</h3>
 *           <p className="text-sm opacity-80">{mascotState.tip}</p>
 *         </div>
 *       </div>
 *     </div>
 *   );
 * };
 * ```
 */

/**
 * Example 4: Dashboard integration
 * 
 * ```jsx
 * const DashboardStats = ({ userProfile, stats }) => {
 *   const { state, getMotivationalMessage } = useAdaptiveMascot(userProfile, {
 *     sessionDuration: stats.totalPracticeTime,
 *     phonemeAccuracy: stats.avgPronunciation,
 *     consecutiveCorrect: stats.currentStreak
 *   });
 *   
 *   const motivationalMessage = getMotivationalMessage();
 *   
 *   return (
 *     <div className="p-6 rounded-xl border">
 *       <div className="flex items-start justify-between">
 *         <div>
 *           <h2 className="text-xl font-bold">Your Progress</h2>
 *           <p className="text-gray-600">{motivationalMessage}</p>
 *         </div>
 *         <AdaptiveMascotAvatar
 *           userProfile={userProfile}
 *           size="sm"
 *           showTip={false}
 *         />
 *       </div>
 *       
 *       <div className="mt-4 grid grid-cols-2 gap-4">
 *         <StatCard label="Current Streak" value={stats.currentStreak} />
 *         <StatCard label="Pronunciation" value={`${Math.round(stats.avgPronunciation * 100)}%`} />
 *       </div>
 *     </div>
 *   );
 * };
 * ```
 */

/**
 * Example 5: Real-time interaction tracking
 * 
 * ```jsx
 * const useMascotInteractionTracker = () => {
 *   const { recordInteraction, updateContext } = useAdaptiveMascot();
 *   
 *   const trackCorrectAnswer = () => {
 *     recordInteraction('celebration', {
 *       phonemeAccuracy: 0.9,
 *       timestamp: Date.now()
 *     });
 *   };
 *   
 *   const trackMistake = (mistakeType, correction) => {
 *     recordInteraction('correction', {
 *       mistakeType,
 *       correction,
 *       phonemeAccuracy: 0.4
 *     });
 *   };
 *   
 *   const trackSessionStart = () => {
 *     updateContext({
 *       sessionStart: Date.now(),
 *       sessionMessages: 0
 *     });
 *   };
 *   
 *   const trackSessionEnd = () => {
 *     const sessionEnd = Date.now();
 *     // Save session data to localStorage or backend
 *   };
 *   
 *   return {
 *     trackCorrectAnswer,
 *     trackMistake,
 *     trackSessionStart,
 *     trackSessionEnd
 *   };
 * };
 * ```
 */

/**
 * Available mascot states for reference:
 * 
 * 1. thinking (🤔) - When AI is processing
 * 2. celebrating (🎉) - When user achieves something
 * 3. correcting (🔍) - When providing corrections
 * 4. encouraging (💪) - General encouragement
 * 5. offline (📴) - When working offline
 * 6. focused (🎯) - During intense practice sessions
 * 7. playful (😄) - For fun, casual learning
 * 8. patient (⏳) - When user needs more time
 * 9. curious (🔎) - When exploring new topics
 * 10. proud (🏆) - For major achievements
 * 
 * Each state has:
 * - expression (emoji)
 * - animation (Tailwind class)
 * - tip (short message)
 * - color (text color class)
 * - bgColor (background color class)
 */

export const mascotIntegrationExamples = {
    chatIntegration: `
    // In Chat.jsx
    const { state, recordInteraction } = useAdaptiveMascot(userProfile);
    
    // When user sends a message
    const handleSend = async (text) => {
      const isCorrect = await checkAnswer(text);
      
      if (isCorrect) {
        recordInteraction('celebration');
      } else {
        recordInteraction('correction');
      }
      
      // Rest of your message handling
    };
  `,

    promptIntegration: `
    // In your AI call function
    const sendWithMascot = async (messages) => {
      const mascotState = getAdaptiveMascotState(analytics, userProfile);
      const mascotPrompt = generateMynoPrompt(mascotState, targetLanguage);
      
      const systemPrompt = \`You are Myno, a friendly language tutor. \${mascotPrompt}\`;
      
      return await callGroq([
        { role: 'system', content: systemPrompt },
        ...messages
      ]);
    };
  `,

    uiIntegration: `
    // In any component
    <div className={\`p-4 rounded-lg \${mascotState.bgColor} border \${mascotState.color}\`}>
      <div className="flex items-center gap-2">
        <span className="text-2xl">{mascotState.expression}</span>
        <div>
          <p className="font-medium">{mascotState.tip}</p>
          <p className="text-sm opacity-80">Keep up the great work!</p>
        </div>
      </div>
    </div>
  `
};

/**
 * Quick start: 3 steps to integrate
 * 
 * 1. Import the hook in your component:
 *    import { useAdaptiveMascot } from '@/hooks/useAdaptiveMascot';
 * 
 * 2. Initialize with user profile:
 *    const { state, recordInteraction } = useAdaptiveMascot(userProfile);
 * 
 * 3. Use mascot state in your UI:
 *    <div className={state.bgColor}>
 *      <span>{state.expression}</span>
 *      <p>{state.tip}</p>
 *    </div>
 * 
 * 4. Record interactions:
 *    recordInteraction('celebration', { phonemeAccuracy: 0.9 });
 */

export default mascotIntegrationExamples;