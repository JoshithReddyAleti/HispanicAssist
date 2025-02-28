import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { User } from './types';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import { Loader2 } from 'lucide-react';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for active session on load
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data: { user: authUser } } = await supabase.auth.getUser();
          
          if (authUser) {
            setUser({
              id: authUser.id,
              email: authUser.email || '',
              isGSUStudent: authUser.user_metadata?.isGSUStudent || false,
              isGSUAlumni: authUser.user_metadata?.isGSUAlumni || false,
              firstName: authUser.user_metadata?.firstName,
              lastName: authUser.user_metadata?.lastName,
              preferredLanguage: authUser.user_metadata?.preferredLanguage || 'en'
            });
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const { user: authUser } = session;
          
          setUser({
            id: authUser.id,
            email: authUser.email || '',
            isGSUStudent: authUser.user_metadata?.isGSUStudent || false,
            isGSUAlumni: authUser.user_metadata?.isGSUAlumni || false,
            firstName: authUser.user_metadata?.firstName,
            lastName: authUser.user_metadata?.lastName,
            preferredLanguage: authUser.user_metadata?.preferredLanguage || 'en'
          });
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = () => {
    // This will be called after successful login
    // The auth state change listener will update the user state
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <div className="min-h-screen flex items-center justify-center px-4">
          <Auth onLogin={handleLogin} />
        </div>
      )}
    </div>
  );
}

export default App;