import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  User, Mail, Lock, ShieldCheck, Save, Camera, 
  ArrowLeft, BadgeCheck, Star, Shield, 
  UserCircle, Loader2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/UI/Button';
import useToast from '../../components/UI/Toast/useToast';
import axios from 'axios';
import { setUser } from '../../redux/Userslice';
import convertToBase64 from '../../utils/imagetobase64';

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    oldPassword: '',
    password: '',
    confirmPassword: '',
    image: user?.image || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await convertToBase64(file);
        setFormData(prev => ({ ...prev, image: base64 }));
        showToast('Success', 'Image ready to save', 'success');
      } catch (error) {
        showToast('Error', 'Failed to process image', 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      return showToast('Error', 'Passwords do not match', 'error');
    }

    setLoading(true);
    try {
      const { data } = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/user/profile/update`, {
        ...formData,
        userId: user._id
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (data.success) {
        dispatch(setUser({ user: data.user, token: localStorage.getItem('token') }));
        localStorage.setItem('user', JSON.stringify(data.user));
        showToast('Success', 'Profile updated successfully', 'success');
        setFormData(prev => ({ ...prev, oldPassword: '', password: '', confirmPassword: '' }));
      }
    } catch (error) {
      showToast('Error', error.response?.data?.message || 'Update failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-body)] pb-16 pt-6 transition-premium" style={{ fontFamily: 'var(--font-body)' }}>
      <div className="max-w-[1024px] mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div className="space-y-1">
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--primary)] text-xs font-medium transition-colors mb-3"
              >
                <ArrowLeft size={14} /> Back to dashboard
              </button>
              <h1 className="text-2xl font-semibold text-[var(--text-main)] tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                Account Settings
              </h1>
              <p className="text-[var(--text-muted)] text-sm">Manage your profile information and security.</p>
            </div>
            <div className="flex items-center">
              <div className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center gap-2 shadow-sm">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-xs font-medium text-emerald-700">Status: Active</span>
              </div>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
           
           {/* Sidebar Navigation */}
           <div className="w-full lg:w-64 shrink-0 space-y-6">
              <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-light)] shadow-sm p-2 flex flex-col gap-1">
                 <button 
                   onClick={() => setActiveTab('general')}
                   className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${activeTab === 'general' ? 'bg-[var(--primary-light)] text-[var(--primary)]' : 'text-[var(--text-muted)] hover:bg-[var(--bg-section)] hover:text-[var(--text-main)]'}`}
                 >
                    <UserCircle size={18} />
                    <span>General Info</span>
                 </button>
                 <button 
                   onClick={() => setActiveTab('security')}
                   className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${activeTab === 'security' ? 'bg-[var(--primary-light)] text-[var(--primary)]' : 'text-[var(--text-muted)] hover:bg-[var(--bg-section)] hover:text-[var(--text-main)]'}`}
                 >
                    <Shield size={18} />
                    <span>Security</span>
                 </button>
              </div>

              {/* Minimal Pro Badge */}
              <div className="bg-gradient-to-br from-[var(--primary-dark)] to-[var(--primary)] rounded-xl p-5 text-white shadow-sm relative overflow-hidden">
                 <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                       <Star className="text-amber-300 fill-amber-300" size={16} />
                       <h4 className="font-semibold text-sm">ShopEase Plus</h4>
                    </div>
                    <p className="text-white/80 text-xs leading-relaxed">Enjoy exclusive offers and faster delivery routes.</p>
                 </div>
                 <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl" />
              </div>
           </div>

           {/* Main Content Area */}
           <div className="flex-1 w-full bg-[var(--bg-card)] border border-[var(--border-light)] rounded-xl shadow-sm overflow-hidden">
              <form onSubmit={handleSubmit} className="flex flex-col h-full">
                 
                 <div className="p-6 sm:p-8">
                    {/* Tab: General */}
                    {activeTab === 'general' && (
                      <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-8">
                         
                         {/* Profile Image Section */}
                         <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            <div className="relative group">
                               <div className="w-24 h-24 rounded-full border border-[var(--border-light)] shadow-sm overflow-hidden bg-[var(--bg-section)]">
                                  {formData.image ? (
                                    <img src={formData.image} alt="Profile" className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[var(--primary)] text-2xl font-bold">
                                       {user?.name?.[0]?.toUpperCase()}
                                    </div>
                                  )}
                               </div>
                               <input 
                                 type="file" 
                                 ref={fileInputRef} 
                                 onChange={handleFileChange} 
                                 className="hidden" 
                                 accept="image/*"
                               />
                               <button 
                                 type="button"
                                 onClick={() => fileInputRef.current.click()}
                                 className="absolute bottom-0 right-0 p-2 bg-[var(--bg-card)] border border-[var(--border-light)] text-[var(--text-main)] rounded-full shadow-sm hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                               >
                                  <Camera size={14} />
                               </button>
                            </div>
                            <div className="text-center sm:text-left space-y-1">
                               <h3 className="text-xl font-semibold text-[var(--text-main)] flex items-center justify-center sm:justify-start gap-1.5" style={{ fontFamily: 'var(--font-heading)' }}>
                                  {user?.name} 
                                  <BadgeCheck size={18} className="text-blue-500 fill-blue-50" />
                               </h3>
                               <p className="text-[var(--text-muted)] text-xs capitalize font-medium">{user?.role} Account</p>
                               <p className="text-[var(--text-muted)] text-xs pt-2 max-w-sm">We recommend an image of at least 400x400. Gifs work too.</p>
                            </div>
                         </div>

                         {/* Form Inputs Grid */}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-[var(--border-light)]">
                            <div className="space-y-1.5">
                               <label className="text-xs font-semibold text-[var(--text-main)] ml-0.5">Full Name</label>
                               <div className="relative">
                                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                                  <input 
                                    type="text" 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full h-10 bg-[var(--bg-body)] border border-[var(--border-light)] focus:bg-white focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)] pl-10 pr-4 rounded-lg text-sm text-[var(--text-main)] transition-all outline-none"
                                    placeholder="Full Name"
                                  />
                               </div>
                            </div>
                            <div className="space-y-1.5">
                               <label className="text-xs font-semibold text-[var(--text-muted)] ml-0.5">Email Address (Read-only)</label>
                               <div className="relative">
                                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                  <input 
                                    type="email" 
                                    value={formData.email}
                                    disabled
                                    className="w-full h-10 bg-[var(--bg-section)] border border-transparent cursor-not-allowed pl-10 pr-4 rounded-lg text-sm text-[var(--text-muted)] outline-none"
                                  />
                               </div>
                            </div>
                         </div>
                      </div>
                    )}

                    {/* Tab: Security */}
                    {activeTab === 'security' && (
                      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                         <div className="mb-6 pb-4 border-b border-[var(--border-light)]">
                            <h3 className="text-lg font-semibold text-[var(--text-main)]" style={{ fontFamily: 'var(--font-heading)' }}>Login Security</h3>
                            <p className="text-[var(--text-muted)] text-sm">Update your password to keep your account secure.</p>
                         </div>

                         <div className="space-y-5 max-w-md">
                            <div className="space-y-1.5">
                               <label className="text-xs font-semibold text-[var(--text-main)] ml-0.5">Current Password</label>
                               <div className="relative">
                                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                                  <input 
                                    type="password" 
                                    name="oldPassword"
                                    value={formData.oldPassword}
                                    onChange={handleChange}
                                    className="w-full h-10 bg-[var(--bg-body)] border border-[var(--border-light)] focus:bg-white focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)] pl-10 pr-4 rounded-lg text-sm text-[var(--text-main)] transition-all outline-none"
                                    placeholder="Enter current password"
                                  />
                               </div>
                            </div>
                            
                            <div className="pt-2 space-y-5">
                               <div className="space-y-1.5">
                                  <label className="text-xs font-semibold text-[var(--text-main)] ml-0.5">New Password</label>
                                  <div className="relative">
                                     <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                                     <input 
                                       type="password" 
                                       name="password"
                                       value={formData.password}
                                       onChange={handleChange}
                                       className="w-full h-10 bg-[var(--bg-body)] border border-[var(--border-light)] focus:bg-white focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)] pl-10 pr-4 rounded-lg text-sm text-[var(--text-main)] transition-all outline-none"
                                       placeholder="New password"
                                     />
                                  </div>
                               </div>
                               <div className="space-y-1.5">
                                  <label className="text-xs font-semibold text-[var(--text-main)] ml-0.5">Confirm New Password</label>
                                  <div className="relative">
                                     <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                                     <input 
                                       type="password" 
                                       name="confirmPassword"
                                       value={formData.confirmPassword}
                                       onChange={handleChange}
                                       className="w-full h-10 bg-[var(--bg-body)] border border-[var(--border-light)] focus:bg-white focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)] pl-10 pr-4 rounded-lg text-sm text-[var(--text-main)] transition-all outline-none"
                                       placeholder="Repeat password"
                                     />
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                    )}
                 </div>

                 {/* Action Footer */}
                 <div className="mt-auto px-6 py-4 bg-[var(--bg-section)] border-t border-[var(--border-light)] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-[var(--text-muted)] text-center sm:text-left">
                       Changes are saved securely to your account.
                    </p>
                    <Button 
                      type="submit" 
                      disabled={loading || (activeTab === 'security' && !formData.oldPassword && formData.password)}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                      variant="primary"
                    >
                       {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                       Save Changes
                    </Button>
                 </div>
                 
              </form>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;