import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { GraduationCap, Mail, Lock, LogIn, UserPlus } from 'lucide-react';

interface AuthProps {
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isGSUStudent, setIsGSUStudent] = useState(false);
  const [isGSUAlumni, setIsGSUAlumni] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              isGSUStudent,
              isGSUAlumni,
              preferredLanguage: 'en',
            },
          },
        });

        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
      }
      
      onLogin();
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <div className="flex justify-center mb-6">
        <GraduationCap className="h-12 w-12 text-blue-600" />
      </div>
      
      <h2 className="text-2xl font-bold text-center mb-6">
        {isSignUp ? 'Create an Account' : 'Sign In to Hispanic Assist'}
      </h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleAuth}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your@email.com"
              required
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>
        </div>
        
        {isSignUp && (
          <div className="mb-6">
            <p className="block text-gray-700 text-sm font-bold mb-2">GSU Affiliation</p>
            <div className="flex flex-col space-y-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={isGSUStudent}
                  onChange={(e) => setIsGSUStudent(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">I am a GSU student</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={isGSUAlumni}
                  onChange={(e) => setIsGSUAlumni(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">I am a GSU alumni</span>
              </label>
            </div>
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center"
        >
          {loading ? (
            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
          ) : isSignUp ? (
            <>
              <UserPlus className="h-5 w-5 mr-2" />
              Sign Up
            </>
          ) : (
            <>
              <LogIn className="h-5 w-5 mr-2" />
              Sign In
            </>
          )}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
        </button>
      </div>
    </div>
  );
};

export default Auth;