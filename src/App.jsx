
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './pages/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Home from './pages/Home';
import Onboarding from './pages/Onboarding';
import Chat from './pages/Chat';
import WordVault from './pages/WordVault';
import Progress from './pages/Progress';
import Paywall from './pages/Paywall';
import ShareModal from '@/components/myno/ShareModal';
import { ToastProvider } from '@/context/ToastContext';
import ToastContainer from '@/components/ui/ToastContainer';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/vault" element={<WordVault />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/pro" element={<Paywall />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <ToastProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <AuthenticatedApp />
            <ShareModal />
            <ToastContainer />
          </Router>
        </QueryClientProvider>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
