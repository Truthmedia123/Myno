# Scenario Data Reset

This document explains how to reset scenario-related data in the Myno Language Coach application.

## Overview

Scenario data is stored in:
1. **localStorage**: Items `myno:scenarios` and `myno:scenarioProgress`
2. **IndexedDB**: Database `myno-scenarios`

Resetting this data is useful for:
- Development and testing
- Starting fresh with scenarios
- Debugging scenario progression issues
- Clearing cached scenario state

## Methods

### 1. Browser Console (Quickest)

Copy and paste the following code into your browser's developer console while on the Myno application (localhost):

```javascript
// Run once in browser console on localhost
localStorage.removeItem('myno:scenarios');
localStorage.removeItem('myno:scenarioProgress');
indexedDB.deleteDatabase('myno-scenarios');
console.log('Scenario data reset complete');
```

**Note**: The `indexedDB.deleteDatabase()` operation may fail if the database is currently open. Refresh the page first, then run the code.

### 2. Using the Utility Module

We've created a utility module `resetScenarioData.js` in `src/lib/` that provides programmatic reset functionality.

#### Import and Use

```javascript
import { resetScenarioData, checkScenarioData, getConsoleResetCode } from '@/lib/resetScenarioData';

// Check what data exists
const dataExists = await checkScenarioData();
console.log('Existing data:', dataExists);

// Reset scenario data
const result = await resetScenarioData();
console.log('Reset result:', result);

// Get console code for manual reset
const consoleCode = getConsoleResetCode();
console.log(consoleCode);
```

#### Available Functions

- `resetScenarioData()`: Clears localStorage items and deletes the IndexedDB database
- `checkScenarioData()`: Checks what scenario data exists
- `getConsoleResetCode()`: Returns the browser console code as a string
- `resetAllMynoData()`: **Use with caution** - resets ALL myno-related data

### 3. Integration in UI (Optional)

You can integrate the reset functionality into your UI for development purposes:

```jsx
import { resetScenarioData } from '@/lib/resetScenarioData';

function DevToolsPanel() {
  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all scenario data?')) {
      const result = await resetScenarioData();
      alert(`Reset completed: ${JSON.stringify(result)}`);
      window.location.reload();
    }
  };

  return (
    <button onClick={handleReset} className="dev-button">
      Reset Scenario Data
    </button>
  );
}
```

## Troubleshooting

### IndexedDB Database Blocked

If you see an error like `"Database 'myno-scenarios' is currently in use"`:

1. Refresh the page first
2. Run the reset code immediately after refresh (before the app opens the database)
3. Alternatively, close all tabs of the application and run the code

### localStorage Persists After Reset

If localStorage items reappear after reset:
- Check if the application is immediately rewriting the data
- Disable any auto-save functionality temporarily
- Use `resetAllMynoData()` to clear all myno-related localStorage keys

### Development Server Running

The dev server (Vite) may cache data. After resetting:
1. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear browser cache if needed
3. Restart the dev server if issues persist

## Implementation Details

The reset utility handles:
- Safe removal of localStorage items (with try-catch)
- Async deletion of IndexedDB databases
- Error handling for unsupported environments (SSR, older browsers)
- Detailed result reporting

## Related Data

Other myno data that might need resetting:
- `myno_streak_freeze` (localStorage) - streak freeze status
- `myno-offline-queue` (IndexedDB) - offline action queue
- Firebase data - requires backend reset

Use `resetAllMynoData()` to clear all localStorage keys starting with "myno".

## Security Considerations

- This functionality should be disabled in production
- Consider adding environment checks: `if (process.env.NODE_ENV === 'development')`
- Never expose reset buttons to end-users without proper authentication

## Support

For questions or issues with scenario reset, contact the development team or check the main project documentation.