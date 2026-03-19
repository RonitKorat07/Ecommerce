import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../redux/Userslice';
import { 
  User, Mail, Lock, ShieldCheck, Save, Camera, 
  ArrowLeft, BadgeCheck, Star, Shield, 
  UserCircle, Loader2, Key, CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useToast from '../../components/UI/Toast/useToast';
import axiosClient from '../../api/axiosClient';
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
        showToast('Photo Ready', 'Click Save to apply your new photo', 'info');
      } catch (error) {
        showToast('Error', 'Failed to process image', 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      return showToast('Password Mismatch', 'Please make sure passwords match', 'error');
    }

    setLoading(true);
    try {
      const { data } = await axiosClient.put(`/user/profile/update`, {
        ...formData,
        userId: user._id
      });

      if (data.success) {
        dispatch(setUser({ user: data.user, token: localStorage.getItem('token') }));
        localStorage.setItem('user', JSON.stringify(data.user));
        // Update formData to show new saved image
        setFormData(prev => ({ 
          ...prev, 
          image: data.user.image || prev.image,
          oldPassword: '', 
          password: '', 
          confirmPassword: '' 
        }));
        showToast('Profile Updated', 'Your changes have been saved successfully', 'success');
      }
    } catch (error) {
      showToast('Update Failed', error.response?.data?.message || 'Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General Info', icon: <UserCircle size={16} /> },
    { id: 'security', label: 'Security', icon: <Shield size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-body)] pb-16 pt-6" style={{ fontFamily: 'var(--font-body)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--primary)] text-xs font-semibold transition-colors mb-4 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Back
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-main)] tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                Account Settings
              </h1>
              <p className="text-[var(--text-muted)] text-sm mt-1">Manage your profile, photo, and security.</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 w-fit">
              <CheckCircle2 size={12} className="text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Active</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
           
           {/* Left Sidebar */}
           <div className="w-full lg:w-60 shrink-0 space-y-4">
              {/* Profile Summary Card */}
              <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-light)] p-5 flex flex-col items-center text-center shadow-sm">
                <div className="relative mb-3 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-[var(--primary-light)] shadow-lg">
                    {formData.image ? (
                      <img src={formData.image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-2xl font-black" style={{ background: 'var(--gradient-primary)' }}>
                        {user?.name?.[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={18} className="text-white" />
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*"
                  />
                </div>
                <h3 className="font-black text-[var(--text-main)] text-sm leading-tight flex items-center gap-1" style={{ fontFamily: 'var(--font-heading)' }}>
                  {user?.name}
                  <BadgeCheck size={14} className="text-[var(--primary)]" />
                </h3>
                <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-wider mt-0.5 capitalize">{user?.role}</p>
                <p className="text-[11px] text-[var(--text-muted)] mt-1 truncate max-w-full">{user?.email}</p>
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3 w-full text-[10px] font-black uppercase tracking-wider px-3 py-2 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-all"
                >
                  Change Photo
                </button>
              </div>

              {/* Tab Nav */}
              <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-light)] p-2 flex flex-col gap-1 shadow-sm">
                {tabs.map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all text-xs font-bold ${
                      activeTab === tab.id 
                        ? 'bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20' 
                        : 'text-[var(--text-muted)] hover:bg-[var(--bg-section)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Elite Badge */}
              <div className="bg-slate-900 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Star className="text-amber-400 fill-amber-400" size={14} />
                    <h4 className="font-black text-[10px] uppercase tracking-[0.18em]">Elite Member</h4>
                  </div>
                  <p className="text-slate-400 text-[10px] font-medium leading-relaxed">Unlock exclusive deals and premium perks.</p>
                </div>
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-[var(--primary)]/20 rounded-full blur-2xl transition-transform group-hover:scale-125 duration-700" />
              </div>
           </div>

           {/* Main Content */}
           <div className="flex-1 w-full bg-[var(--bg-card)] border border-[var(--border-light)] rounded-2xl shadow-sm overflow-hidden">
              <form onSubmit={handleSubmit} className="flex flex-col h-full">
                 
                 {/* Tab Header */}
                 <div className="px-6 pt-6 pb-0 border-b border-[var(--border-light)]">
                    <div className="pb-5">
                       {activeTab === 'general' ? (
                         <>
                           <h2 className="text-lg font-black text-[var(--text-main)]" style={{ fontFamily: 'var(--font-heading)' }}>General Information</h2>
                           <p className="text-xs text-[var(--text-muted)] mt-0.5">Update your display name and profile photo.</p>
                         </>
                       ) : (
                         <>
                           <h2 className="text-lg font-black text-[var(--text-main)]" style={{ fontFamily: 'var(--font-heading)' }}>Change Password</h2>
                           <p className="text-xs text-[var(--text-muted)] mt-0.5">Keep your account secure with a strong password.</p>
                         </>
                       )}
                    </div>
                 </div>
                 
                 <div className="p-6">
                    {/* General Tab */}
                    {activeTab === 'general' && (
                      <div className="space-y-5">
                         <div className="space-y-1.5">
                           <label className="text-xs font-bold text-[var(--text-main)]">Full Name</label>
                           <div className="relative">
                             <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={15} />
                             <input 
                               type="text" 
                               name="name"
                               value={formData.name}
                               onChange={handleChange}
                               className="w-full h-11 bg-[var(--bg-body)] border-2 border-[var(--border-light)] focus:bg-white focus:border-[var(--primary)] pl-10 pr-4 rounded-xl text-sm text-[var(--text-main)] font-medium transition-all outline-none"
                               placeholder="Your full name"
                             />
                           </div>
                         </div>
                         
                         <div className="space-y-1.5">
                           <label className="text-xs font-bold text-[var(--text-muted)]">Email Address <span className="text-[10px] normal-case">(read-only)</span></label>
                           <div className="relative">
                             <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={15} />
                             <input 
                               type="email" 
                               value={formData.email}
                               disabled
                               className="w-full h-11 bg-[var(--bg-section)] border-2 border-transparent cursor-not-allowed pl-10 pr-4 rounded-xl text-sm text-[var(--text-muted)] outline-none"
                             />
                           </div>
                         </div>

                         <div className="space-y-1.5">
                           <label className="text-xs font-bold text-[var(--text-main)]">Profile Photo</label>
                           <div 
                             onClick={() => fileInputRef.current?.click()}
                             className="flex items-center gap-4 p-4 border-2 border-dashed border-[var(--border-light)] rounded-xl cursor-pointer hover:border-[var(--primary)] hover:bg-[var(--primary-light)] transition-all group"
                           >
                             <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 ring-2 ring-[var(--border-light)] group-hover:ring-[var(--primary)]">
                               {formData.image ? (
                                 <img src={formData.image} alt="" className="w-full h-full object-cover" />
                               ) : (
                                 <div className="w-full h-full bg-[var(--primary-light)] flex items-center justify-center text-[var(--primary)] font-black text-sm">
                                   {user?.name?.[0]?.toUpperCase()}
                                 </div>
                               )}
                             </div>
                             <div>
                               <p className="text-xs font-bold text-[var(--text-main)] group-hover:text-[var(--primary)]">Click to upload photo</p>
                               <p className="text-[10px] text-[var(--text-muted)]">PNG, JPG, GIF up to 10MB</p>
                             </div>
                             <Camera size={16} className="ml-auto text-slate-300 group-hover:text-[var(--primary)] transition-colors" />
                           </div>
                         </div>
                      </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                      <div className="space-y-5 max-w-sm">
                         <div className="space-y-1.5">
                           <label className="text-xs font-bold text-[var(--text-main)]">Current Password</label>
                           <div className="relative">
                             <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={15} />
                             <input 
                               type="password" 
                               name="oldPassword"
                               value={formData.oldPassword}
                               onChange={handleChange}
                               className="w-full h-11 bg-[var(--bg-body)] border-2 border-[var(--border-light)] focus:bg-white focus:border-[var(--primary)] pl-10 pr-4 rounded-xl text-sm text-[var(--text-main)] font-medium transition-all outline-none"
                               placeholder="Enter current password"
                             />
                           </div>
                         </div>
                         
                         <div className="space-y-1.5">
                           <label className="text-xs font-bold text-[var(--text-main)]">New Password</label>
                           <div className="relative">
                             <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={15} />
                             <input 
                               type="password" 
                               name="password"
                               value={formData.password}
                               onChange={handleChange}
                               className="w-full h-11 bg-[var(--bg-body)] border-2 border-[var(--border-light)] focus:bg-white focus:border-[var(--primary)] pl-10 pr-4 rounded-xl text-sm text-[var(--text-main)] font-medium transition-all outline-none"
                               placeholder="New password"
                             />
                           </div>
                         </div>
                         
                         <div className="space-y-1.5">
                           <label className="text-xs font-bold text-[var(--text-main)]">Confirm New Password</label>
                           <div className="relative">
                             <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={15} />
                             <input 
                               type="password" 
                               name="confirmPassword"
                               value={formData.confirmPassword}
                               onChange={handleChange}
                               className="w-full h-11 bg-[var(--bg-body)] border-2 border-[var(--border-light)] focus:bg-white focus:border-[var(--primary)] pl-10 pr-4 rounded-xl text-sm text-[var(--text-main)] font-medium transition-all outline-none"
                               placeholder="Repeat new password"
                             />
                           </div>
                         </div>
                      </div>
                    )}
                 </div>

                 {/* Footer */}
                 <div className="mt-auto px-6 py-4 bg-[var(--bg-section)] border-t border-[var(--border-light)] flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-[11px] text-[var(--text-muted)] text-center sm:text-left">
                       Changes sync securely across all your sessions.
                    </p>
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-[0.15em] text-white transition-all shadow-lg active:scale-95 disabled:opacity-60"
                      style={{ background: loading ? 'var(--text-muted)' : 'var(--gradient-primary)' }}
                    >
                       {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                       {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                 </div>
                 
              </form>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;