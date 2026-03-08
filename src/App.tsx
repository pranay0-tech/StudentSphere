import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { PostProvider, Post } from './context/PostContext';
import { 
  SplashScreen, 
  OnboardingScreen, 
  LoginScreen,
  HomeFeed, 
  ExploreScreen,
  AdviceRoomsScreen,
  BookmarksScreen,
  CreatePost, 
  PostDetails 
} from './screens/AppScreens';
import { NotificationsScreen, ProfileScreen } from './screens/SettingsScreens';
import { BottomNavigationBar, FloatingActionButton } from './components/Navigation';
import { PollCard } from './components/Feedback';
import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';

const MainApp = () => {
  const { theme } = useTheme();
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    const hasOnboarded = localStorage.getItem('hasOnboarded');
    const user = localStorage.getItem('user');
    
    if (!hasOnboarded) {
      setShowOnboarding(true);
    }
    
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleOnboardingFinish = () => {
    localStorage.setItem('hasOnboarded', 'true');
    setShowOnboarding(false);
  };

  const handleLogin = (username: string) => {
    localStorage.setItem('user', JSON.stringify({ username }));
    setIsLoggedIn(true);
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (showOnboarding) {
    return <OnboardingScreen onFinish={handleOnboardingFinish} />;
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className={`h-full flex flex-col font-sans transition-colors duration-300 ${theme === 'light' ? 'bg-white text-[#222222]' : 'bg-[#0F0F0F] text-white'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-30 px-6 py-4 flex items-center justify-between border-b ${theme === 'light' ? 'bg-white/80 border-gray-100' : 'bg-[#0F0F0F]/80 border-gray-800'} backdrop-blur-md`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#6C63FF] rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xs">S</span>
          </div>
          <h1 className="text-lg font-bold tracking-tight">Privora</h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative min-h-0">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1 flex flex-col min-h-0"
            >
              <HomeFeed onPostClick={(post) => setSelectedPost(post)} />
            </motion.div>
          )}

          {activeTab === 'rooms' && (
            <motion.div
              key="rooms"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1 flex flex-col min-h-0"
            >
              <AdviceRoomsScreen onPostClick={(post) => setSelectedPost(post)} />
            </motion.div>
          )}

          {activeTab === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex-1 flex flex-col min-h-0"
            >
              <ExploreScreen onPostClick={(post) => setSelectedPost(post)} />
            </motion.div>
          )}

          {activeTab === 'bookmarks' && (
            <motion.div
              key="bookmarks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col min-h-0"
            >
              <BookmarksScreen onPostClick={(post) => setSelectedPost(post)} />
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex-1 flex flex-col min-h-0"
            >
              <ProfileScreen onLogout={() => {
                localStorage.removeItem('user');
                setIsLoggedIn(false);
              }} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation & Overlays */}
      <BottomNavigationBar activeTab={activeTab} onTabChange={setActiveTab} />
      
      {activeTab === 'home' && (
        <FloatingActionButton onClick={() => setShowCreatePost(true)} />
      )}

      <AnimatePresence>
        {showCreatePost && (
          <CreatePost onClose={() => setShowCreatePost(false)} />
        )}
        {selectedPost && (
          <PostDetails post={selectedPost} onClose={() => setSelectedPost(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <PostProvider>
        <MainApp />
      </PostProvider>
    </ThemeProvider>
  );
}
