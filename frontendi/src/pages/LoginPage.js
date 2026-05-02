import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { formatApiErrorDetail } from '../services/api';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(formatApiErrorDetail(err.response?.data?.detail) || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-purple-50 flex items-center justify-center py-12 px-4" data-testid="login-page">
      <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgb(0,0,0,0.08)] p-8 sm:p-12 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-fredoka text-3xl text-slate-900 mb-2">Welcome Back!</h1>
          <p className="font-nunito text-slate-600">Sign in to continue planning your celebration</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 rounded-2xl p-4 mb-6 font-nunito text-sm" data-testid="login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-nunito font-semibold text-slate-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-2xl focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all font-nunito"
                placeholder="you@example.com"
                required
                data-testid="login-email"
              />
            </div>
          </div>

          <div>
            <label className="block font-nunito font-semibold text-slate-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-slate-50 border-transparent rounded-2xl focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all font-nunito"
                placeholder="Enter your password"
                required
                data-testid="login-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="login-submit"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="font-nunito text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-amber-500 font-semibold hover:underline" data-testid="register-link">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
