import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import API from '../api/endpoints';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/Userslice';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';

const Signin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosClient.post(API.auth.signin, formData);
      const { token, user } = response.data;

      if (token && user) {
        dispatch(setUser({ token, user }));
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        toast.success(`Welcome back, ${user.name}!`);
        if (user.role === 'admin') {
          navigate('/admin/product', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } else {
        toast.error('Invalid login response!');
      }
    } catch (error) {
      console.error('Login Error:', error);
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-[90vh] p-4"
      style={{ backgroundColor: 'var(--bg-body)', fontFamily: 'var(--font-body)' }}
    >
      <div
        className="w-full max-w-sm p-6 rounded-2xl shadow-xl border relative overflow-hidden animate-in fade-in zoom-in duration-300"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-light)',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        <div className="absolute top-0 left-0 w-full h-1.5" style={{ backgroundColor: 'var(--primary)' }}></div>
        <div className="flex flex-col items-center mb-6">
          <Logo className="w-8 h-8" textClassName="text-xl" />
          <div className="text-center mt-4">
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
              <span style={{ color: 'var(--text-main)' }}>Sign</span>{' '}
              <span style={{ color: 'var(--primary)' }}>In</span>
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={16} style={{ color: 'var(--text-muted)' }} />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                required
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border outline-none transition-all text-sm"
                style={{
                  backgroundColor: 'var(--bg-body)',
                  borderColor: 'var(--border-light)',
                  color: 'var(--text-main)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary)';
                  e.target.style.boxShadow = '0 0 0 2px rgba(2, 99, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-light)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={16} style={{ color: 'var(--text-muted)' }} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full pl-9 pr-11 py-2.5 rounded-xl border outline-none transition-all text-sm"
                style={{
                  backgroundColor: 'var(--bg-body)',
                  borderColor: 'var(--border-light)',
                  color: 'var(--text-main)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary)';
                  e.target.style.boxShadow = '0 0 0 2px rgba(2, 99, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-light)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-white transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 text-sm mt-4"
            style={{
              backgroundColor: 'var(--primary)',
              boxShadow: '0 4px 12px 0 rgba(2, 99, 255, 0.2)'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--primary-hover)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--primary)'}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          <div className="text-center mt-6">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Don't have an account?{' '}
              <Link to="/signup" className="font-bold hover:underline transition-all" style={{ color: 'var(--primary)' }}>
                Create Account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;
