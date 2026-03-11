import React, { useState } from 'react';
import { Camera, Eye, EyeOff, Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import convertToBase64 from '../utils/imagetobase64';
import axiosClient from '../api/axiosClient';
import API from '../api/endpoints';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    fileBase64: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      try {
        const base64 = await convertToBase64(selectedFile);
        setFormData((prev) => ({
          ...prev,
          fileBase64: base64,
        }));
        toast.success('Profile picture updated!');
      } catch (error) {
        console.error('Error converting file:', error);
        toast.error('Image conversion failed!');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosClient.post(API.auth.signup, formData);
      toast.success('Account created successfully!');
      setTimeout(() => {
        navigate('/signin', { replace: true });
      }, 1500);
    } catch (error) {
      console.error('Error during signup:', error);
      toast.error(error.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen py-8 px-4"
      style={{ backgroundColor: 'var(--bg-body)', fontFamily: 'var(--font-body)' }}
    >
      <div
        className="w-full max-w-sm p-6 rounded-2xl shadow-xl border relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-light)',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        <div className="absolute top-0 left-0 w-full h-1.5" style={{ backgroundColor: 'var(--primary)' }}></div>

        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="mb-4">
            <Logo className="w-7 h-7" textClassName="text-lg" />
          </div>

          <div className="relative mb-6 group">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden border-4 transition-all"
              style={{ backgroundColor: 'var(--bg-body)', borderColor: 'var(--border-light)' }}
            >
              {formData.fileBase64 ? (
                <img
                  src={formData.fileBase64}
                  alt="Profile Preview"
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <Camera size={28} />
                  <span className="text-[9px] uppercase font-bold mt-1 tracking-wider">Upload</span>
                </div>
              )}
            </div>
            <label
              className="absolute bottom-0 right-0 p-2 rounded-full cursor-pointer shadow-lg transition-all hover:scale-110 active:scale-95"
              style={{ backgroundColor: 'var(--primary)', color: 'white' }}
            >
              <Camera size={14} />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                title="Choose Profile Image"
              />
            </label>
          </div>

          <div className="text-center mb-6 w-full">
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
              <span style={{ color: 'var(--text-main)' }}>Create</span>{' '}
              <span style={{ color: 'var(--primary)' }}>Account</span>
            </h2>
          </div>

          <div className="space-y-3.5 w-full">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border outline-none transition-all text-sm"
                  style={{ backgroundColor: 'var(--bg-body)', borderColor: 'var(--border-light)', color: 'var(--text-main)' }}
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
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border outline-none transition-all text-sm"
                  style={{ backgroundColor: 'var(--bg-body)', borderColor: 'var(--border-light)', color: 'var(--text-main)' }}
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
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-11 py-2.5 rounded-xl border outline-none transition-all text-sm"
                  style={{ backgroundColor: 'var(--bg-body)', borderColor: 'var(--border-light)', color: 'var(--text-main)' }}
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 px-4 rounded-xl font-bold text-white transition-all transform hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 text-sm"
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
                Creating account...
              </>
            ) : (
              <>
                Create Account <ArrowRight size={16} />
              </>
            )}
          </button>

          <p className="mt-8 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/signin" className="font-bold hover:underline transition-all" style={{ color: 'var(--primary)' }}>
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
