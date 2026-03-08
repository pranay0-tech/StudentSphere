import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { User, Heart, MessageCircle, AlertCircle } from 'lucide-react';
import { Comment } from '../context/PostContext';
import { useTheme } from '../context/ThemeContext';

export const CommentCard: React.FC<{ comment: Comment }> = ({ comment }) => {
  const { theme } = useTheme();
  return (
    <div className={`p-3 mb-2 rounded-xl ${theme === 'light' ? 'bg-gray-50' : 'bg-[#252525]'}`}>
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}>
          <User size={12} className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'} />
        </div>
        <span className="text-xs font-semibold">Anonymous Student</span>
        <span className="text-[10px] opacity-50">{formatDistanceToNow(new Date(comment.timestamp))} ago</span>
      </div>
      <p className="text-sm opacity-90">{comment.content}</p>
    </div>
  );
};

export const NotificationItem: React.FC<{ type: 'like' | 'comment' | 'report'; content: string; time: string }> = ({ type, content, time }) => {
  const { theme } = useTheme();
  
  const getIcon = () => {
    switch (type) {
      case 'like': return <Heart size={16} className="text-red-500" />;
      case 'comment': return <MessageCircle size={16} className="text-blue-500" />;
      case 'report': return <AlertCircle size={16} className="text-orange-500" />;
    }
  };

  return (
    <div className={`p-4 border-b flex items-start gap-4 ${theme === 'light' ? 'border-gray-100 hover:bg-gray-50' : 'border-gray-800 hover:bg-[#1A1A1A]'}`}>
      <div className={`mt-1 p-2 rounded-full ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'}`}>
        {getIcon()}
      </div>
      <div className="flex-1">
        <p className="text-sm leading-tight mb-1">{content}</p>
        <span className="text-[10px] opacity-50">{time}</span>
      </div>
    </div>
  );
};

export const PollCard: React.FC<{ 
  question: string; 
  options: { id: string; text: string; votes: number }[]; 
  onVote?: (optionId: string) => void;
  voted?: boolean;
}> = ({ question, options, onVote, voted }) => {
  const { theme } = useTheme();
  const totalVotes = options.reduce((acc, opt) => acc + opt.votes, 0);

  return (
    <div className={`p-4 mb-4 rounded-2xl border ${theme === 'light' ? 'bg-white/50 border-gray-100' : 'bg-white/5 border-gray-800'}`}>
      <h3 className="font-bold text-sm mb-4">{question}</h3>
      <div className="space-y-2">
        {options.map((opt) => {
          const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
          return (
            <button 
              key={opt.id} 
              disabled={voted}
              onClick={(e) => {
                e.stopPropagation();
                onVote?.(opt.id);
              }}
              className={`w-full relative h-11 rounded-xl overflow-hidden group transition-all active:scale-[0.98] ${voted ? 'cursor-default' : 'cursor-pointer hover:ring-2 hover:ring-[#6C63FF]/30'}`}
            >
              <div 
                className={`absolute inset-0 transition-all duration-700 ease-out ${theme === 'light' ? 'bg-[#6C63FF]/10' : 'bg-[#6C63FF]/20'}`} 
                style={{ width: `${percentage}%` }} 
              />
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <span className={`text-xs font-semibold ${voted ? 'opacity-100' : 'opacity-80'}`}>{opt.text}</span>
                {voted && <span className="text-[10px] font-bold text-[#6C63FF]">{percentage}%</span>}
              </div>
            </button>
          );
        })}
      </div>
      <div className="flex justify-between items-center mt-3">
        <p className="text-[10px] opacity-40">{totalVotes} votes</p>
        <p className="text-[10px] font-bold text-[#6C63FF] opacity-60">Anonymous Poll</p>
      </div>
    </div>
  );
};
