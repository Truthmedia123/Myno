/**
 * Design system prompts and utilities for Myno AI Tutor
 * Provides consistent design guidance for AI-assisted development
 * @module designPrompts
 */

/**
 * Myno Design System Guide
 * @type {string}
 */
export const DESIGN_SYSTEM_GUIDE = `
# Myno Design System Guide

## 🎨 Colors
- **Primary**: indigo-500 (#6366f1) – buttons, active states, primary actions
- **Secondary**: purple-500 (#a855f7) – accents, highlights, secondary actions
- **Backgrounds**: 
  - Light: gray-50 (#f9fafb)
  - Dark: gray-900 (#111827)
- **Text**: 
  - Primary: gray-900 (#111827)
  - Secondary: gray-600 (#4b5563)
  - Muted: gray-500 (#6b7280)
- **Semantic**:
  - Success: green-500 (#10b981)
  - Warning: amber-500 (#f59e0b)
  - Error: red-500 (#ef4444)
  - Info: blue-500 (#3b82f6)

## 🔤 Typography
- **Font Family**: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif
- **Scale**:
  - xs: 0.75rem (12px)
  - sm: 0.875rem (14px)
  - base: 1rem (16px)
  - lg: 1.125rem (18px)
  - xl: 1.25rem (20px)
  - 2xl: 1.5rem (24px)
  - 3xl: 1.875rem (30px)
- **Weights**: 400 (normal), 600 (semibold)
- **Line Height**: 1.5 for body, 1.25 for headings
- **Letter Spacing**: -0.025em for headings, normal for body

## 🎭 Icons
- **Size**: 24x24 viewBox
- **Stroke**: 2px, rounded line caps
- **Style**: Outline icons for regular, filled for active states
- **Color**: Inherit from parent text color
- **Implementation**: Inline SVG with aria-hidden="true" for decorative icons

## 🎬 Animations
- **Duration**: 200-300ms for micro-interactions
- **Timing**: ease-out for natural feel
- **Transitions**:
  - Scale: 95% → 100% for button presses
  - Opacity: 0 → 100 for fades
  - Translate: subtle vertical/horizontal movement
- **Key Principles**:
  - Subtle, not distracting
  - Purposeful (indicates state change)
  - Consistent across similar interactions

## 🦉 Mascot (Myno)
- **Character**: Friendly owl mascot named Myno
- **Expressions**: 
  - 🤔 Thinking (processing)
  - 🎉 Celebrating (achievement)
  - 🔍 Correcting (feedback)
  - 💪 Encouraging (motivation)
  - 📴 Offline (disconnected)
- **Adaptive States**: Changes based on user progress, time of day, learning context
- **Implementation**: SVG with CSS animations, color-coded backgrounds

## 🧱 Components
- **Buttons**: Rounded corners (8px), subtle shadows, hover states
- **Cards**: White background, subtle border, rounded corners (12px), shadow-sm
- **Inputs**: Clear labels, focus rings matching primary color
- **Modals**: Backdrop blur, centered, slide-up animation
- **Navigation**: Bottom bar on mobile, sidebar on desktop

## 📱 Layout
- **Spacing**: 4px base unit (0.25rem)
  - 1 unit: 4px
  - 2 units: 8px
  - 3 units: 12px
  - 4 units: 16px
  - 6 units: 24px
  - 8 units: 32px
- **Grid**: 12-column responsive grid
- **Breakpoints**:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
  - 2xl: 1536px

## ♿ Accessibility
- **Contrast**: Minimum 4.5:1 for text
- **Focus**: Visible focus rings (primary color)
- **ARIA**: Proper roles and labels for interactive elements
- **Keyboard**: Full keyboard navigation support
- **Reduced Motion**: Respects prefers-reduced-motion

## 🎯 Design Principles
1. **Clarity**: Interface should be self-explanatory
2. **Consistency**: Similar elements behave similarly
3. **Efficiency**: Minimize steps to complete tasks
4. **Feedback**: Immediate visual feedback for actions
5. **Delight**: Small moments of joy through micro-interactions
`;

/**
 * Generate AI prompt for component design
 * @param {string} screenName - Name of the screen/component
 * @param {string} goal - What the component should achieve
 * @param {string} constraints - Any limitations or requirements
 * @returns {string} Formatted AI prompt
 */
export function generateComponentPrompt(screenName, goal, constraints = '') {
    return `
Design a ${screenName} component for Myno AI Tutor.

## CONTEXT
Myno is a language learning app with a friendly owl mascot. The design should be clean, modern, and accessible.

## DESIGN SYSTEM
${DESIGN_SYSTEM_GUIDE.split('\n').slice(0, 20).join('\n')}

## GOAL
${goal}

## CONSTRAINTS
${constraints || 'No specific constraints beyond the design system.'}

## OUTPUT REQUIREMENTS
1. Provide React component code (JSX) with Tailwind CSS classes
2. Include proper TypeScript types if applicable
3. Add accessibility attributes (aria-*)
4. Include hover/focus states
5. Add comments for key design decisions
6. Ensure mobile-responsive design
7. Follow the Myno color palette and typography scale

## EXAMPLE STRUCTURE
\`\`\`jsx
// Component name: ${screenName}
// Purpose: ${goal}

export default function ${screenName.replace(/\s+/g, '')}({ /* props */ }) {
  return (
    <div className="...">
      {/* Implementation */}
    </div>
  );
}
\`\`\`
`;
}

/**
 * Save design inspiration to localStorage
 * @param {string} title - Title of the inspiration
 * @param {string} url - URL or reference
 * @param {string} notes - Additional notes
 * @returns {boolean} Success status
 */
export function saveDesignInspiration(title, url, notes = '') {
    try {
        const key = 'myno:designInspiration';
        const existing = JSON.parse(localStorage.getItem(key) || '[]');

        const newItem = {
            id: Date.now().toString(),
            title,
            url,
            notes,
            createdAt: new Date().toISOString()
        };

        const updated = [...existing, newItem];
        localStorage.setItem(key, JSON.stringify(updated));
        return true;
    } catch (error) {
        console.error('Failed to save design inspiration:', error);
        return false;
    }
}

/**
 * Get all saved design inspirations
 * @returns {Array} Array of inspiration items
 */
export function getDesignInspiration() {
    try {
        const key = 'myno:designInspiration';
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Failed to get design inspiration:', error);
        return [];
    }
}

/**
 * Delete a design inspiration by ID
 * @param {string} id - Item ID to delete
 * @returns {boolean} Success status
 */
export function deleteDesignInspiration(id) {
    try {
        const key = 'myno:designInspiration';
        const existing = getDesignInspiration();
        const updated = existing.filter(item => item.id !== id);
        localStorage.setItem(key, JSON.stringify(updated));
        return true;
    } catch (error) {
        console.error('Failed to delete design inspiration:', error);
        return false;
    }
}

/**
 * Clear all design inspirations
 * @returns {boolean} Success status
 */
export function clearDesignInspiration() {
    try {
        localStorage.removeItem('myno:designInspiration');
        return true;
    } catch (error) {
        console.error('Failed to clear design inspiration:', error);
        return false;
    }
}