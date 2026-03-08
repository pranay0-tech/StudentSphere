import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Shield, Users, MessageSquare, ArrowRight, X, Send, ChevronLeft, BarChart2, PlusCircle, MinusCircle, Lock, User as UserIcon, Search, Bookmark, Heart, Sparkles, AlertTriangle, Info, HelpCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { usePosts, Post, AdviceRoom } from '../context/PostContext';
import { PostCard } from '../components/PostCard';
import { BottomNavigationBar, FloatingActionButton } from '../components/Navigation';
import { CommentCard, NotificationItem, PollCard } from '../components/Feedback';
import { moderateContent, generateSupportMessage } from '../services/aiService';
import { cn } from '../lib/utils';

// --- Login Screen ---
export const LoginScreen: React.FC<{ onLogin: (username: string) => void }> = ({ onLogin }) => {
  const { theme } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }
    onLogin(username);
  };

  return (
    <div className={`fixed inset-0 z-[110] flex flex-col p-8 ${theme === 'light' ? 'bg-white' : 'bg-[#0F0F0F]'}`}>
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-[#6C63FF] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/20">
            <GraduationCap size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-sm opacity-50">Enter your anonymous credentials</p>
        </motion.div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <UserIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Anonymous Username"
              className={`w-full pl-12 pr-4 py-4 rounded-2xl text-sm border-none focus:ring-2 focus:ring-[#6C63FF] transition-all ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'}`}
            />
          </div>
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Secret Password"
              className={`w-full pl-12 pr-4 py-4 rounded-2xl text-sm border-none focus:ring-2 focus:ring-[#6C63FF] transition-all ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'}`}
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-red-500 text-center font-medium"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            className="w-full bg-[#6C63FF] text-white py-5 rounded-2xl font-bold shadow-xl shadow-indigo-500/20 active:scale-95 transition-transform mt-4"
          >
            Enter StudentSphere
          </button>
        </form>

        <p className="text-[10px] text-center opacity-40 mt-8 leading-relaxed">
          By entering, you agree to our Community Guidelines. Your identity remains anonymous to other students.
        </p>
      </div>
    </div>
  );
};

// --- Splash Screen ---
export const SplashScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-[#6C63FF] flex flex-col items-center justify-center z-[100]">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white p-6 rounded-[2.5rem] shadow-2xl mb-6"
      >
        <GraduationCap size={80} className="text-[#6C63FF]" />
      </motion.div>
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-white text-4xl font-bold tracking-tight"
      >
        StudentSphere
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="text-white/70 mt-2 font-medium"
      >
        Your voice, anonymously.
      </motion.p>
    </div>
  );
};

// --- Onboarding Screen ---
export const OnboardingScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [step, setStep] = useState(0);
  const steps = [
    {
      title: "Share Freely",
      desc: "Express your thoughts, confessions, and problems without any fear of judgment.",
      icon: <MessageSquare size={48} className="text-[#6C63FF]" />,
    },
    {
      title: "Stay Anonymous",
      desc: "Your identity is never revealed. We prioritize your privacy above everything else.",
      icon: <Shield size={48} className="text-[#4ECDC4]" />,
    },
    {
      title: "Support Others",
      desc: "Join a community of students helping each other through college life.",
      icon: <Users size={48} className="text-[#FF6B6B]" />,
    },
  ];

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else onFinish();
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col p-8 z-[90]">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <motion.div
          key={step}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          className="mb-12"
        >
          <div className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
            {steps[step].icon}
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{steps[step].title}</h2>
          <p className="text-gray-500 leading-relaxed max-w-xs mx-auto">{steps[step].desc}</p>
        </motion.div>
        
        <div className="flex gap-2 mb-12">
          {steps.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-[#6C63FF]' : 'w-2 bg-gray-200'}`} />
          ))}
        </div>
      </div>

      <button
        onClick={next}
        className="w-full bg-[#6C63FF] text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/20 active:scale-95 transition-transform"
      >
        {step === steps.length - 1 ? "Get Started" : "Continue"}
        <ArrowRight size={20} />
      </button>
    </div>
  );
};

// --- Daily Question Component ---
const DailyQuestion: React.FC<{ onAnswer: () => void }> = ({ onAnswer }) => {
  const { theme } = useTheme();
  const dailyQuestion = "What is the most stressful subject this semester?";
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-5 rounded-3xl mb-6 border-2 border-dashed",
        theme === 'light' 
          ? "bg-indigo-50 border-indigo-200 text-indigo-900" 
          : "bg-indigo-900/20 border-indigo-500/30 text-indigo-100"
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={18} className="text-indigo-500" />
        <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">Question of the Day</span>
      </div>
      <h3 className="font-bold text-lg mb-4 leading-tight">{dailyQuestion}</h3>
      <button 
        onClick={onAnswer}
        className="w-full py-3 bg-indigo-500 text-white rounded-2xl text-xs font-bold shadow-lg shadow-indigo-500/20 active:scale-95 transition-transform"
      >
        Answer Anonymously
      </button>
    </motion.div>
  );
};

// --- Home Feed Screen ---
export const HomeFeed: React.FC<{ onPostClick: (post: Post) => void }> = ({ onPostClick }) => {
  const { posts, trendingPosts, addPost } = usePosts();
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showDailyAnswerInput, setShowDailyAnswerInput] = useState(false);
  const [dailyAnswer, setDailyAnswer] = useState('');
  
  const categories = ['All', 'Trending', 'Confession', 'Study Help', 'College Life', 'Mental Health', 'Gratitude', 'Events'];
  
  let displayPosts = posts;
  if (selectedCategory === 'Trending') {
    displayPosts = trendingPosts;
  } else if (selectedCategory !== 'All') {
    displayPosts = posts.filter(p => p.category === selectedCategory);
  }

  const handleDailyAnswerSubmit = () => {
    if (dailyAnswer.trim().length < 5) return;
    addPost(dailyAnswer, 'Daily Question', 'My Campus', undefined, 'safe', undefined, true);
    setDailyAnswer('');
    setShowDailyAnswerInput(false);
    alert('Your answer has been posted anonymously!');
  };

  return (
    <div className="flex-1 overflow-y-auto pb-32 px-4 pt-4 min-h-0">
      <DailyQuestion onAnswer={() => setShowDailyAnswerInput(true)} />
      
      <AnimatePresence>
        {showDailyAnswerInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={cn(
              "mb-6 p-4 rounded-3xl border overflow-hidden",
              theme === 'light' ? "bg-white border-gray-100" : "bg-gray-900 border-gray-800"
            )}
          >
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-xs font-bold uppercase tracking-widest opacity-50">Your Answer</h4>
              <button onClick={() => setShowDailyAnswerInput(false)} className="p-1 opacity-50"><X size={16} /></button>
            </div>
            <textarea
              value={dailyAnswer}
              onChange={(e) => setDailyAnswer(e.target.value)}
              placeholder="Type your anonymous answer here..."
              className={cn(
                "w-full p-3 rounded-2xl text-sm mb-3 min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
                theme === 'light' ? "bg-gray-50" : "bg-gray-800"
              )}
            />
            <button
              onClick={handleDailyAnswerSubmit}
              disabled={dailyAnswer.trim().length < 5}
              className="w-full py-3 bg-indigo-500 text-white rounded-2xl text-xs font-bold disabled:opacity-50 disabled:grayscale transition-all"
            >
              Post Answer
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat 
                ? 'bg-[#6C63FF] text-white' 
                : (theme === 'light' ? 'bg-gray-100 text-gray-600' : 'bg-gray-800 text-gray-400')
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {displayPosts.map(post => (
          <PostCard key={post.id} post={post} onClick={() => onPostClick(post)} />
        ))}
      </div>
    </div>
  );
};

// --- Explore Screen ---
export const ExploreScreen: React.FC<{ onPostClick: (post: Post) => void }> = ({ onPostClick }) => {
  const { theme } = useTheme();
  const { posts } = usePosts();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredPosts = searchQuery.trim() === '' 
    ? [] 
    : posts.filter(p => 
        p.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="flex-1 overflow-y-auto pb-32 p-6 min-h-0">
      <div className={`p-4 rounded-2xl flex items-center gap-3 mb-6 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'}`}>
        <Search size={20} className="opacity-40" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search campus, topics, or posts..." 
          className="bg-transparent border-none focus:ring-0 text-sm w-full"
        />
      </div>

      {searchQuery.trim() === '' ? (
        <>
          <h2 className="font-bold mb-4">Trending Topics</h2>
          <div className="grid grid-cols-2 gap-3 mb-8">
            {['#FinalsWeek', '#LibraryLife', '#CampusFood', '#DormConfessions'].map(tag => (
              <button 
                key={tag} 
                onClick={() => setSearchQuery(tag.replace('#', ''))}
                className={`p-4 rounded-2xl border text-left transition-transform active:scale-95 ${theme === 'light' ? 'bg-white border-gray-100' : 'bg-[#1A1A1A] border-gray-800'}`}
              >
                <p className="text-sm font-bold text-[#6C63FF]">{tag}</p>
                <p className="text-[10px] opacity-50">1.2k posts today</p>
              </button>
            ))}
          </div>

          <h2 className="font-bold mb-4">Active Polls</h2>
          <PollCard 
            question="Should the library be open 24/7 during finals week?"
            options={[
              { id: '1', text: 'Yes, absolutely!', votes: 450 },
              { id: '2', text: 'No, we need sleep.', votes: 120 },
              { id: '3', text: 'Only the quiet floor.', votes: 85 }
            ]}
          />
        </>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold opacity-50">Search Results ({filteredPosts.length})</h2>
            <button onClick={() => setSearchQuery('')} className="text-xs font-bold text-[#6C63FF]">Clear</button>
          </div>
          {filteredPosts.map(post => (
            <PostCard key={post.id} post={post} onClick={() => onPostClick(post)} />
          ))}
          {filteredPosts.length === 0 && (
            <div className="py-20 text-center opacity-30">
              <Search size={48} className="mx-auto mb-4" />
              <p>No posts found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- Create Post Screen ---
export const CreatePost: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { addPost } = usePosts();
  const { theme } = useTheme();
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Confession');
  const [campus, setCampus] = useState('My Campus');
  const [isPoll, setIsPoll] = useState(false);
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [isModerating, setIsModerating] = useState(false);
  const [moderationWarning, setModerationWarning] = useState<string | null>(null);

  const categories = ['Confession', 'Study Help', 'College Life', 'Relationship Advice', 'Mental Health', 'Gratitude', 'Events'];

  const handleSubmit = async () => {
    if (content.trim().length < 5) return;
    
    setIsModerating(true);
    setModerationWarning(null);

    const moderation = await moderateContent(content);
    
    if (moderation.status === 'blocked') {
      setModerationWarning(moderation.reason || "This post violates our community guidelines.");
      setIsModerating(false);
      return;
    }

    let aiSupport;
    if (category === 'Mental Health' || category === 'Confession') {
      const support = await generateSupportMessage(content);
      aiSupport = support.message;
    }

    if (isPoll) {
      const validOptions = pollOptions.filter(opt => opt.trim().length > 0);
      if (validOptions.length < 2) {
        setIsModerating(false);
        return;
      }
      addPost(content, category, campus, {
        question: content,
        options: validOptions
      }, moderation.status, aiSupport);
    } else {
      addPost(content, category, campus, undefined, moderation.status, aiSupport);
    }
    
    setIsModerating(false);
    onClose();
  };

  const addOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const removeOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className={`fixed inset-0 z-[60] flex flex-col ${theme === 'light' ? 'bg-white' : 'bg-[#0F0F0F]'}`}
    >
      <div className="p-4 flex justify-between items-center border-b border-black/5 dark:border-white/5">
        <button onClick={onClose} className="p-2"><X size={24} /></button>
        <h2 className="font-bold">Create {isPoll ? 'Poll' : 'Post'}</h2>
        <button 
          onClick={handleSubmit}
          disabled={content.trim().length < 5 || isModerating}
          className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${content.trim().length < 5 || isModerating ? 'opacity-50 grayscale' : 'opacity-100'} bg-[#6C63FF] text-white flex items-center gap-2`}
        >
          {isModerating ? (
            <>
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Checking...
            </>
          ) : 'Post'}
        </button>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        {moderationWarning && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-start gap-3"
          >
            <AlertTriangle size={20} className="shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold mb-1">Moderation Warning</p>
              <p className="text-[10px] opacity-80 leading-relaxed">{moderationWarning}</p>
            </div>
          </motion.div>
        )}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => setIsPoll(false)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${!isPoll ? 'bg-[#6C63FF] text-white' : 'bg-gray-100 dark:bg-gray-800 opacity-50'}`}
          >
            Regular Post
          </button>
          <button 
            onClick={() => setIsPoll(true)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors ${isPoll ? 'bg-[#6C63FF] text-white' : 'bg-gray-100 dark:bg-gray-800 opacity-50'}`}
          >
            <BarChart2 size={14} />
            Poll Post
          </button>
        </div>

        <textarea
          autoFocus
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, 300))}
          placeholder={isPoll ? "Ask a question..." : "What's on your mind? Stay anonymous..."}
          className={`w-full h-32 text-lg bg-transparent border-none focus:ring-0 resize-none ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}
        />
        <div className="flex justify-end mb-6">
          <span className={`text-xs ${content.length >= 300 ? 'text-red-500' : 'opacity-50'}`}>{content.length}/300</span>
        </div>

        {isPoll && (
          <div className="mb-8 space-y-3">
            <h3 className="text-sm font-bold opacity-70 mb-2">Poll Options</h3>
            {pollOptions.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input 
                  type="text"
                  value={opt}
                  onChange={(e) => updateOption(i, e.target.value)}
                  placeholder={`Option ${i + 1}`}
                  className={`flex-1 p-3 rounded-xl text-sm ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'}`}
                />
                {pollOptions.length > 2 && (
                  <button onClick={() => removeOption(i)} className="text-red-500 opacity-50 hover:opacity-100">
                    <MinusCircle size={20} />
                  </button>
                )}
              </div>
            ))}
            {pollOptions.length < 4 && (
              <button 
                onClick={addOption}
                className="flex items-center gap-2 text-xs font-bold text-[#6C63FF] mt-2 p-2 hover:bg-[#6C63FF]/10 rounded-lg transition-colors"
              >
                <PlusCircle size={16} />
                Add Option
              </button>
            )}
          </div>
        )}

        <div className="space-y-6">
          <section>
            <h3 className="text-sm font-bold mb-4 opacity-70">Select Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    category === cat 
                      ? 'bg-[#6C63FF] text-white' 
                      : (theme === 'light' ? 'bg-gray-100 text-gray-600' : 'bg-gray-800 text-gray-400')
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold mb-4 opacity-70">Campus</h3>
            <div className={`flex items-center gap-3 p-4 rounded-2xl ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'}`}>
              <Users size={18} className="opacity-30" />
              <input 
                type="text"
                value={campus}
                onChange={(e) => setCampus(e.target.value)}
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm"
                placeholder="Enter your college name..."
              />
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
};

// --- Post Details Screen ---
export const PostDetails: React.FC<{ post: Post; onClose: () => void }> = ({ post, onClose }) => {
  const { theme } = useTheme();
  const { getCommentsByPostId, addComment, markCommentAsHelpful } = usePosts();
  const [commentText, setCommentText] = useState('');
  const comments = getCommentsByPostId(post.id);

  const handleSendComment = () => {
    if (!commentText.trim()) return;
    addComment(post.id, commentText);
    setCommentText('');
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className={`fixed inset-0 z-[70] flex flex-col ${theme === 'light' ? 'bg-white' : 'bg-[#0F0F0F]'}`}
    >
      <div className="p-4 flex items-center gap-4 border-b border-black/5 dark:border-white/5">
        <button onClick={onClose} className="p-2"><ChevronLeft size={24} /></button>
        <h2 className="font-bold">Post</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        <PostCard post={post} />
        
        {post.aiSupportMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "mt-4 p-4 rounded-2xl border flex items-start gap-3",
              theme === 'light' ? "bg-emerald-50 border-emerald-100 text-emerald-900" : "bg-emerald-900/20 border-emerald-500/30 text-emerald-100"
            )}
          >
            <Sparkles size={18} className="text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-1">AI Support Suggestion</p>
              <p className="text-xs leading-relaxed">{post.aiSupportMessage}</p>
            </div>
          </motion.div>
        )}

        <div className="mt-6 mb-4 flex items-center justify-between">
          <h3 className="font-bold text-sm opacity-70">Comments ({comments.length})</h3>
        </div>

        <div className="space-y-4">
          {comments.map(c => (
            <div key={c.id} className="relative">
              <CommentCard comment={c} />
              {post.category === 'Study Help' && (
                <button 
                  onClick={() => markCommentAsHelpful(c.id)}
                  className={cn(
                    "absolute top-4 right-4 px-2 py-1 rounded-full text-[8px] font-bold uppercase transition-all",
                    c.isHelpful 
                      ? "bg-emerald-500 text-white" 
                      : "bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-emerald-500"
                  )}
                >
                  {c.isHelpful ? 'Helpful Answer' : 'Mark Helpful'}
                </button>
              )}
            </div>
          ))}
        </div>
        {comments.length === 0 && (
          <div className="py-12 text-center opacity-40">
            <MessageSquare size={48} className="mx-auto mb-4" />
            <p className="text-sm">No comments yet. Be the first to reply!</p>
          </div>
        )}
      </div>

      <div className={`p-4 border-t flex items-center gap-3 ${theme === 'light' ? 'bg-white border-gray-100' : 'bg-[#0F0F0F] border-gray-800'}`}>
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write an anonymous comment..."
          className={`flex-1 p-3 rounded-2xl text-sm ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'}`}
        />
        <button 
          onClick={handleSendComment}
          className="p-3 bg-[#6C63FF] text-white rounded-2xl active:scale-90 transition-transform"
        >
          <Send size={20} />
        </button>
      </div>
    </motion.div>
  );
};

// --- Advice Rooms Screen ---
export const AdviceRoomsScreen: React.FC<{ onPostClick: (post: Post) => void }> = ({ onPostClick }) => {
  const { theme } = useTheme();
  const { rooms, posts } = usePosts();
  const [activeRoom, setActiveRoom] = useState<AdviceRoom | null>(null);

  const renderRoomList = () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Advice Rooms</h1>
      <div className="grid grid-cols-1 gap-4">
        {rooms.map(room => (
          <button
            key={room.id}
            onClick={() => setActiveRoom(room)}
            className={cn(
              "p-5 rounded-3xl border text-left transition-all active:scale-[0.98] flex items-center gap-4",
              theme === 'light' ? "bg-white border-gray-100 hover:border-indigo-200" : "bg-[#1A1A1A] border-gray-800 hover:border-indigo-500/30"
            )}
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-2xl">
              {room.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-base">{room.name}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 font-bold uppercase">
                  {room.category}
                </span>
              </div>
              <p className="text-xs opacity-50 line-clamp-1">{room.description}</p>
            </div>
            <ArrowRight size={18} className="opacity-20" />
          </button>
        ))}
      </div>
    </div>
  );

  const renderRoomDetail = (room: AdviceRoom) => {
    const roomPosts = posts.filter(p => p.category === room.name || p.category === room.category);
    
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 flex flex-col h-full"
      >
        <div className="p-4 flex items-center gap-4 border-b border-black/5 dark:border-white/5">
          <button onClick={() => setActiveRoom(null)} className="p-2"><ChevronLeft size={24} /></button>
          <div>
            <h2 className="font-bold text-sm">{room.name}</h2>
            <p className="text-[10px] opacity-50">Anonymous Discussion</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className={cn(
            "p-4 rounded-2xl mb-6 text-center",
            theme === 'light' ? "bg-gray-50" : "bg-gray-800/50"
          )}>
            <p className="text-xs opacity-60 leading-relaxed">{room.description}</p>
          </div>
          {roomPosts.map(post => (
            <PostCard key={post.id} post={post} onClick={() => onPostClick(post)} />
          ))}
          {roomPosts.length === 0 && (
            <div className="py-20 text-center opacity-30">
              <MessageSquare size={48} className="mx-auto mb-4" />
              <p>No posts in this room yet.</p>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden pb-32 min-h-0">
      {activeRoom ? renderRoomDetail(activeRoom) : renderRoomList()}
    </div>
  );
};

// --- Bookmarks Screen ---
export const BookmarksScreen: React.FC<{ onPostClick: (post: Post) => void }> = ({ onPostClick }) => {
  const { bookmarkedPosts } = usePosts();
  const { theme } = useTheme();

  return (
    <div className="flex-1 overflow-y-auto pb-32 p-6 min-h-0">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
          <Bookmark size={20} fill="currentColor" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Saved Posts</h1>
          <p className="text-xs opacity-50">Your private collection of useful tips</p>
        </div>
      </div>

      <div className="space-y-4">
        {bookmarkedPosts.map(post => (
          <PostCard key={post.id} post={post} onClick={() => onPostClick(post)} />
        ))}
        {bookmarkedPosts.length === 0 && (
          <div className="py-32 text-center opacity-30">
            <Bookmark size={64} className="mx-auto mb-6" />
            <p className="text-lg font-bold mb-2">No bookmarks yet</p>
            <p className="text-sm max-w-xs mx-auto">Save helpful advice, study tips, or interesting confessions to read them later.</p>
          </div>
        )}
      </div>
    </div>
  );
};
