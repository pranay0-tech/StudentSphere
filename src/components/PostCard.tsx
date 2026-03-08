import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Heart, Share2, MoreVertical, ShieldAlert, User, Repeat, Bookmark, ArrowBigUp, ArrowBigDown, Flag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Post, usePosts } from '../context/PostContext';
import { useTheme } from '../context/ThemeContext';
import { PollCard } from './Feedback';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PostCardProps {
  post: Post;
  onClick?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
  const { repostPost, unrepostPost, voteInPoll, toggleBookmark, upvotePost, downvotePost, reportPost } = usePosts();
  const { theme } = useTheme();
  const [voted, setVoted] = React.useState(false);
  const [reposted, setReposted] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [showMenu, setShowMenu] = React.useState(false);

  const handleRepost = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (reposted) {
      unrepostPost(post.id);
      setReposted(false);
    } else {
      repostPost(post.id);
      setReposted(true);
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmark(post.id);
  };

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    upvotePost(post.id);
  };

  const handleDownvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    downvotePost(post.id);
  };

  const handleReport = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to report this post for inappropriate content?')) {
      reportPost(post.id);
      alert('Thank you for reporting. Our moderators will review this post.');
    }
    setShowMenu(false);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVote = (optionId: string) => {
    if (voted) return;
    voteInPoll(post.id, optionId);
    setVoted(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "p-4 mb-4 rounded-2xl cursor-pointer transition-colors",
        theme === 'light' ? "bg-[#F5F6FA] text-[#222222]" : "bg-[#1E1E1E] text-white"
      )}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            theme === 'light' ? "bg-gray-200" : "bg-gray-800"
          )}>
            <User size={20} className={theme === 'light' ? "text-gray-500" : "text-gray-400"} />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Anonymous Student</h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] opacity-50">{formatDistanceToNow(new Date(post.timestamp))} ago</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#6C63FF]/10 text-[#6C63FF] font-medium">
                {post.category}
              </span>
            </div>
          </div>
        </div>
        <div className="relative">
          <button 
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} 
            className="p-1 opacity-50 hover:opacity-100"
          >
            <MoreVertical size={18} />
          </button>
          
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className={cn(
                  "absolute right-0 mt-2 w-40 rounded-xl shadow-xl z-50 border overflow-hidden",
                  theme === 'light' ? "bg-white border-gray-100" : "bg-[#2A2A2A] border-gray-700"
                )}
              >
                <button 
                  onClick={handleReport}
                  className="w-full px-4 py-3 text-left text-xs font-medium text-red-500 hover:bg-red-500/10 flex items-center gap-2"
                >
                  <Flag size={14} />
                  Report Post
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <p className="text-sm leading-relaxed mb-4 line-clamp-4">
        {post.content}
      </p>

      {post.poll && (
        <PollCard 
          question={post.poll.question} 
          options={post.poll.options} 
          onVote={handleVote}
          voted={voted}
        />
      )}

      <div className="flex items-center justify-between pt-3 border-t border-black/5 dark:border-white/5">
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-black/5 dark:bg-white/5 rounded-full px-1">
            <button 
              onClick={handleUpvote}
              className={cn(
                "p-1.5 transition-all rounded-full",
                post.userVote === 1 ? "text-orange-500 bg-orange-500/10" : "opacity-50 hover:opacity-100"
              )}
            >
              <ArrowBigUp size={20} fill={post.userVote === 1 ? "currentColor" : "none"} />
            </button>
            <span className="text-xs font-bold min-w-[20px] text-center">
              {(post.upvotes || 0) - (post.downvotes || 0)}
            </span>
            <button 
              onClick={handleDownvote}
              className={cn(
                "p-1.5 transition-all rounded-full",
                post.userVote === -1 ? "text-indigo-500 bg-indigo-500/10" : "opacity-50 hover:opacity-100"
              )}
            >
              <ArrowBigDown size={20} fill={post.userVote === -1 ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
            <MessageCircle size={18} />
            <span className="text-xs font-medium">{post.commentsCount}</span>
          </div>
          <button 
            onClick={handleShare}
            className="flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity relative"
          >
            <Share2 size={18} />
            {copied && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-[10px] rounded shadow-lg whitespace-nowrap animate-bounce">
                Copied!
              </span>
            )}
          </button>

          <button 
            onClick={handleBookmark}
            className={cn(
              "flex items-center gap-1 transition-all",
              post.isBookmarked ? "text-amber-500 scale-110" : "opacity-70 hover:opacity-100"
            )}
          >
            <Bookmark size={18} fill={post.isBookmarked ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
