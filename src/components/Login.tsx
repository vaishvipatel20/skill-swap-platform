import React, { useState } from 'react';
import { Users, Mail, Lock, Eye, EyeOff, User, ArrowRight, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { signInWithGoogle, signInWithApple } from '../firebase';

interface LoginProps {
  onSuccess: () => void;
  onOAuthStart?: () => void;
}

const Login: React.FC<LoginProps> = ({ onSuccess, onOAuthStart }) => {
  const { login, loginWithOAuth } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (isSignUp) {
      // Sign up validation
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setIsLoading(false);
        return;
      }
      if (!name.trim()) {
        setError('Name is required');
        setIsLoading(false);
        return;
      }
      
      // Mock sign up - in real app, this would create a new user
      setError('Sign up successful! Please sign in with your credentials.');
      setIsSignUp(false);
      setIsLoading(false);
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        onSuccess();
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    // Notify parent component that OAuth is starting
    onOAuthStart?.();

    if (provider === 'google') {
      setGoogleLoading(true);
    } else {
      setAppleLoading(true);
    }

    setError('');

    try {
      let userData;
      if (provider === 'google') {
        userData = await signInWithGoogle();
      } else {
        userData = await signInWithApple();
      }

      if (!userData || !userData.email) {
        throw new Error('Failed to retrieve user data from provider');
      }

      // Use loginWithOAuth from context to login or create user
      const success = await loginWithOAuth(provider, userData);

      if (success) {
        onSuccess();
      } else {
        setError(`${provider.charAt(0).toUpperCase() + provider.slice(1)} account linked successfully! You can now sign in.`);
      }
    } catch (err) {
      setError(`${provider.charAt(0).toUpperCase() + provider.slice(1)} authentication failed. Please try again.`);
    } finally {
      setGoogleLoading(false);
      setAppleLoading(false);
    }
  };

  const demoCredentials = [
    { email: 'sarah@example.com', password: 'demo123', role: 'User' },
    { email: 'mike@example.com', password: 'demo123', role: 'User' },
    { email: 'admin@skillxchange.com', password: 'admin123', role: 'Admin' },
  ];

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

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
        
        {/* Geometric Shapes */}
        <div className="absolute top-1/4 left-1/4 w-16 h-16 border border-white/10 rotate-45 animate-spin" style={{animationDuration: '20s'}}></div>
        <div className="absolute bottom-1/4 right-1/4 w-12 h-12 border border-blue-400/20 rotate-12 animate-pulse"></div>
      </div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {isSignUp ? 'Join SkillXchange' : 'Welcome Back'}
          </h2>
          <p className="text-white/80">
            {isSignUp ? 'Create your account to start exchanging skills' : 'Sign in to your account'}
          </p>
        </div>

        {/* Social Login Buttons */}
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl space-y-4">
          <button
            onClick={() => handleSocialLogin('google')}
            disabled={googleLoading || appleLoading}
            className="w-full flex items-center justify-center px-6 py-4 backdrop-blur-xl bg-white/15 border border-white/25 rounded-full text-white hover:bg-white/25 hover:border-white/35 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
          >
            {googleLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <div className="w-5 h-5 mr-3 bg-white rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">G</span>
                </div>
                Continue with Google
              </>
            )}
          </button>
          
          <button
            onClick={() => handleSocialLogin('apple')}
            disabled={googleLoading || appleLoading}
            className="w-full flex items-center justify-center px-6 py-4 backdrop-blur-xl bg-white/15 border border-white/25 rounded-full text-white hover:bg-white/25 hover:border-white/35 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
          >
            {appleLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <div className="w-5 h-5 mr-3 bg-white rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-800">🍎</span>
                </div>
                Continue with Apple
              </>
            )}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/30" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 backdrop-blur-md bg-white/20 text-white/80 rounded-lg">or</span>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl space-y-6">
          {isSignUp && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required={isSignUp}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 w-full px-4 py-3 backdrop-blur-md bg-white/20 border border-white/30 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all text-white placeholder-white/60 shadow-lg"
                  placeholder="Enter your full name"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 w-full px-4 py-3 backdrop-blur-md bg-white/20 border border-white/30 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all text-white placeholder-white/60 shadow-lg"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 w-full px-4 py-3 backdrop-blur-md bg-white/20 border border-white/30 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all text-white placeholder-white/60 shadow-lg"
                placeholder={isSignUp ? "Create a password (min 6 characters)" : "Enter your password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {isSignUp && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/90 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required={isSignUp}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10 w-full px-4 py-3 backdrop-blur-md bg-white/20 border border-white/30 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all text-white placeholder-white/60 shadow-lg"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className={`backdrop-blur-md border rounded-xl px-4 py-3 ${
              error.includes('successful') 
                ? 'bg-green-500/20 border-green-400/30 text-green-100' 
                : 'bg-red-500/20 border-red-400/30 text-red-100'
            }`}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full backdrop-blur-xl bg-gradient-to-r from-blue-500/25 to-purple-500/25 border border-white/25 text-white py-4 px-6 rounded-full font-medium hover:from-blue-500/35 hover:to-purple-500/35 hover:border-white/35 focus:ring-2 focus:ring-white/50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-xl hover:shadow-2xl flex items-center justify-center"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
            ) : (
              <ArrowRight className="h-5 w-5 mr-2" />
            )}
            {isLoading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>

          {/* Toggle Sign In/Sign Up */}
          <div className="text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-white/80 hover:text-white transition-colors text-sm"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>

        {/* Demo Credentials - Only show for sign in */}
        {!isSignUp && (
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/30" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 backdrop-blur-md bg-white/20 text-white/80 rounded-lg">Demo Accounts</span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {demoCredentials.map((cred, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setEmail(cred.email);
                    setPassword(cred.password);
                  }}
                  className="w-full text-left px-6 py-4 backdrop-blur-xl bg-white/10 border border-white/20 rounded-full hover:bg-white/20 hover:border-white/30 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-white">{cred.role} Demo</div>
                      <div className="text-xs text-white/70">{cred.email}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-white/60" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;