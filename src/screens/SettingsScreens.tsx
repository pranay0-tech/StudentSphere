import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { usePosts } from '../context/PostContext';
import { NotificationItem } from '../components/Feedback';
import { Settings, Shield, Info, Moon, Sun, ChevronRight, LogOut, User, ChevronLeft, Check, Bell, Lock, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const NotificationsScreen: React.FC = () => {
  const { theme } = useTheme();
  const notifications = [
    { id: '1', type: 'like' as const, content: 'Someone liked your post in "Study Help"', time: '2m ago' },
    { id: '2', type: 'comment' as const, content: 'A student replied to your confession: "I totally agree with you!"', time: '15m ago' },
    { id: '3', type: 'like' as const, content: 'Your post is trending in MIT campus!', time: '1h ago' },
    { id: '4', type: 'report' as const, content: 'A post you reported has been reviewed and removed.', time: '3h ago' },
    { id: '5', type: 'comment' as const, content: 'New comment on your mental health post.', time: '5h ago' },
  ];

  return (
    <div className="flex-1 overflow-y-auto pb-32 min-h-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>
        <div className={`rounded-3xl overflow-hidden border ${theme === 'light' ? 'bg-white border-gray-100' : 'bg-[#1A1A1A] border-gray-800'}`}>
          {notifications.map(n => (
            <NotificationItem key={n.id} type={n.type} content={n.content} time={n.time} />
          ))}
        </div>
      </div>
    </div>
  );
};

const SubScreenHeader: React.FC<{ title: string; onBack: () => void }> = ({ title, onBack }) => {
  const { theme } = useTheme();
  return (
    <div className={`sticky top-0 z-10 p-4 flex items-center gap-4 border-b ${theme === 'light' ? 'bg-white border-gray-100' : 'bg-[#0F0F0F] border-gray-800'}`}>
      <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
        <ChevronLeft size={24} />
      </button>
      <h2 className="font-bold text-lg">{title}</h2>
    </div>
  );
};

export const ProfileScreen: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  const { theme, toggleTheme } = useTheme();
  const { getUserKarma, posts } = usePosts();
  const [activeSubScreen, setActiveSubScreen] = useState<'main' | 'guidelines' | 'about' | 'settings'>('main');
  const [user, setUser] = useState<{ username: string } | null>(null);

  const karma = getUserKarma();
  const myPostsCount = posts.filter(p => p.authorId === 'me').length;

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const menuItems = [
    { id: 'guidelines', icon: <Shield size={20} className="text-blue-500" />, label: 'Community Guidelines', desc: 'Rules for a safe environment' },
    { id: 'about', icon: <Info size={20} className="text-emerald-500" />, label: 'About StudentSphere', desc: 'Learn more about our mission' },
    { id: 'settings', icon: <Settings size={20} className="text-gray-500" />, label: 'Account Settings', desc: 'Manage your anonymous profile' },
  ];

  const subScreenBg = theme === 'light' ? 'bg-white' : 'bg-[#0F0F0F]';

  const renderGuidelines = () => (
    <motion.div 
      initial={{ x: '100%' }} 
      animate={{ x: 0 }} 
      exit={{ x: '100%' }} 
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className={`fixed inset-0 z-[100] ${subScreenBg} flex flex-col`}
    >
      <SubScreenHeader title="Community Guidelines" onBack={() => setActiveSubScreen('main')} />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <section>
          <h3 className="font-bold text-[#6C63FF] mb-2">1. Respect Privacy</h3>
          <p className="text-sm opacity-70 leading-relaxed">Do not post personal information about yourself or others. This includes names, phone numbers, and social media handles.</p>
        </section>
        <section>
          <h3 className="font-bold text-[#6C63FF] mb-2">2. No Harassment</h3>
          <p className="text-sm opacity-70 leading-relaxed">Bullying, hate speech, and targeted harassment are strictly prohibited. We are here to support each other.</p>
        </section>
        <section>
          <h3 className="font-bold text-[#6C63FF] mb-2">3. Keep it Student-Focused</h3>
          <p className="text-sm opacity-70 leading-relaxed">StudentSphere is for campus life, study help, and student experiences. Keep discussions relevant to the community.</p>
        </section>
        <div className={`p-4 rounded-2xl ${theme === 'light' ? 'bg-blue-50 text-blue-700' : 'bg-blue-900/20 text-blue-400'}`}>
          <p className="text-xs font-medium">Violating these rules may lead to a permanent ban of your anonymous account.</p>
        </div>
      </div>
    </motion.div>
  );

  const renderAbout = () => (
    <motion.div 
      initial={{ x: '100%' }} 
      animate={{ x: 0 }} 
      exit={{ x: '100%' }} 
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className={`fixed inset-0 z-[100] ${subScreenBg} flex flex-col`}
    >
      <SubScreenHeader title="About StudentSphere" onBack={() => setActiveSubScreen('main')} />
      <div className="flex-1 overflow-y-auto p-6 text-center">
        <div className="w-20 h-20 bg-[#6C63FF] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/20">
          <span className="text-white font-bold text-2xl">S</span>
        </div>
        <h3 className="text-xl font-bold mb-2">StudentSphere v1.0.4</h3>
        <p className="text-sm opacity-60 mb-8">Empowering student voices through anonymity.</p>
        
        <div className="space-y-4 text-left">
          <div className={`p-4 rounded-2xl border ${theme === 'light' ? 'border-gray-100' : 'border-gray-800'}`}>
            <h4 className="font-bold text-sm mb-1">Our Mission</h4>
            <p className="text-xs opacity-70">To provide a safe, judgment-free space for students to share their real experiences and find support from peers.</p>
          </div>
          <div className={`p-4 rounded-2xl border ${theme === 'light' ? 'border-gray-100' : 'border-gray-800'}`}>
            <h4 className="font-bold text-sm mb-1">Privacy First</h4>
            <p className="text-xs opacity-70">We don't track your identity. Your posts are linked to a unique anonymous token that only you control.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderSettings = () => (
    <motion.div 
      initial={{ x: '100%' }} 
      animate={{ x: 0 }} 
      exit={{ x: '100%' }} 
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className={`fixed inset-0 z-[100] ${subScreenBg} flex flex-col`}
    >
      <SubScreenHeader title="Account Settings" onBack={() => setActiveSubScreen('main')} />
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className={`p-4 rounded-3xl border ${theme === 'light' ? 'bg-white border-gray-100' : 'bg-[#1A1A1A] border-gray-800'}`}>
          <h4 className="text-xs font-bold opacity-40 uppercase tracking-wider mb-4">Privacy</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <EyeOff size={18} className="opacity-50" />
                <span className="text-sm font-medium">Hide from Search</span>
              </div>
              <div className="w-10 h-5 bg-[#6C63FF] rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" /></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock size={18} className="opacity-50" />
                <span className="text-sm font-medium">Incognito Mode</span>
              </div>
              <div className="w-10 h-5 bg-gray-300 dark:bg-gray-700 rounded-full relative"><div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full" /></div>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-3xl border ${theme === 'light' ? 'bg-white border-gray-100' : 'bg-[#1A1A1A] border-gray-800'}`}>
          <h4 className="text-xs font-bold opacity-40 uppercase tracking-wider mb-4">Notifications</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={18} className="opacity-50" />
                <span className="text-sm font-medium">Push Notifications</span>
              </div>
              <div className="w-10 h-5 bg-[#6C63FF] rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" /></div>
            </div>
          </div>
        </div>

        <button className="w-full p-4 rounded-2xl border border-red-500/20 text-red-500 text-sm font-bold hover:bg-red-500/5 transition-colors">
          Reset Anonymous Identity
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="flex-1 overflow-y-auto pb-32 min-h-0">
      <AnimatePresence>
        {activeSubScreen === 'guidelines' && renderGuidelines()}
        {activeSubScreen === 'about' && renderAbout()}
        {activeSubScreen === 'settings' && renderSettings()}
      </AnimatePresence>

      <div className="p-6">
        <div className="flex flex-col items-center mb-10">
          <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center mb-4 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'}`}>
            <User size={48} className={theme === 'light' ? 'text-gray-400' : 'text-gray-500'} />
          </div>
          <h2 className="text-xl font-bold">{user?.username || 'Anonymous Student'}</h2>
        </div>

        <div className="flex justify-center gap-12 mb-10">
          <div className="text-center">
            <p className="text-2xl font-bold text-[#6C63FF]">{karma}</p>
            <p className="text-[10px] opacity-50 uppercase tracking-wider font-bold">Karma</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{myPostsCount}</p>
            <p className="text-[10px] opacity-50 uppercase tracking-wider font-bold">Posts</p>
          </div>
        </div>

        <div className={`p-4 rounded-3xl mb-6 flex items-center justify-between border ${theme === 'light' ? 'bg-white border-gray-100' : 'bg-[#1A1A1A] border-gray-800'}`}>
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-full ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'}`}>
              {theme === 'light' ? <Sun size={20} className="text-orange-500" /> : <Moon size={20} className="text-indigo-500" />}
            </div>
            <div>
              <p className="text-sm font-bold">Dark Mode</p>
              <p className="text-[10px] opacity-50">Switch between themes</p>
            </div>
          </div>
          <button 
            onClick={toggleTheme}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-[#8B7CFF]' : 'bg-gray-200'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        <div className={`rounded-3xl overflow-hidden border mb-6 ${theme === 'light' ? 'bg-white border-gray-100' : 'bg-[#1A1A1A] border-gray-800'}`}>
          {menuItems.map((item, i) => (
            <button 
              key={i}
              onClick={() => setActiveSubScreen(item.id as any)}
              className={`w-full p-4 flex items-center justify-between border-b last:border-none ${theme === 'light' ? 'border-gray-100 hover:bg-gray-50' : 'border-gray-800 hover:bg-[#252525]'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'}`}>
                  {item.icon}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold">{item.label}</p>
                  <p className="text-[10px] opacity-50">{item.desc}</p>
                </div>
              </div>
              <ChevronRight size={16} className="opacity-30" />
            </button>
          ))}
        </div>

        <button 
          onClick={onLogout}
          className="w-full p-4 rounded-3xl flex items-center justify-center gap-2 text-red-500 font-bold bg-red-500/10 active:scale-95 transition-transform"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </div>
  );
};
