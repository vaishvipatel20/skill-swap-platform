import React, { useEffect, useState } from 'react';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { handleOAuthCallback, exchangeGoogleCode, exchangeAppleCode, clearOAuthParams } from '../utils/oauth';

interface OAuthCallbackProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

const OAuthCallback: React.FC<OAuthCallbackProps> = ({ onSuccess, onError }) => {
  const { loginWithOAuth } = useApp();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        const callbackData = handleOAuthCallback();
        
        if (!callbackData) {
          throw new Error('Invalid OAuth callback data');
        }

        const { provider, code } = callbackData;
        setMessage(`Authenticating with ${provider.charAt(0).toUpperCase() + provider.slice(1)}...`);

        let userData = null;

        if (provider === 'google') {
          userData = await exchangeGoogleCode(code);
        } else if (provider === 'apple') {
          userData = await exchangeAppleCode(code);
        }

        if (!userData) {
          throw new Error('Failed to get user data from OAuth provider');
        }

        setMessage('Creating your account...');
        
        const success = await loginWithOAuth(provider as 'google' | 'apple', userData);
        
        if (success) {
          setStatus('success');
          setMessage('Authentication successful! Redirecting...');
          clearOAuthParams();
          
          setTimeout(() => {
            onSuccess();
          }, 2000);
        } else {
          throw new Error('Failed to create user account');
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Authentication failed');
        clearOAuthParams();
        
        setTimeout(() => {
          onError('OAuth authentication failed. Please try again.');
        }, 3000);
      }
    };

    processOAuthCallback();
  }, [loginWithOAuth, onSuccess, onError]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-15"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-blue-900/40 to-indigo-900/40"></div>
        
        {/* Professional Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-indigo-400/15 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 bg-cyan-400/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-blue-400/15 rounded-full blur-xl animate-bounce"></div>
      </div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
            {status === 'processing' && <Loader2 className="h-8 w-8 text-white animate-spin" />}
            {status === 'success' && <CheckCircle className="h-8 w-8 text-white" />}
            {status === 'error' && <AlertCircle className="h-8 w-8 text-white" />}
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">
            {status === 'processing' && 'Authenticating...'}
            {status === 'success' && 'Success!'}
            {status === 'error' && 'Authentication Failed'}
          </h2>
          
          <p className="text-white/80">{message}</p>
          
          {status === 'processing' && (
            <div className="mt-6">
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
            </div>
          )}
          
          {status === 'error' && (
            <div className="mt-6">
              <button
                onClick={() => window.location.href = '/'}
                className="w-full backdrop-blur-xl bg-gradient-to-r from-white/15 to-white/10 border border-white/20 text-white py-3 px-6 rounded-full text-base font-medium hover:from-white/25 hover:to-white/15 hover:border-white/30 transition-all shadow-lg hover:scale-105 transform"
              >
                Return to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OAuthCallback;