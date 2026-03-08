import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockPosts, mockComments } from '../services/firebase';

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Post {
  id: string;
  content: string;
  category: string;
  timestamp: string;
  likesCount: number;
  commentsCount: number;
  reportsCount: number;
  repostsCount: number;
  campus: string;
  authorId: string;
  reactions: { agree: number };
  upvotes: number;
  downvotes: number;
  userVote?: 1 | -1 | 0;
  isReported?: boolean;
  poll?: {
    question: string;
    options: PollOption[];
  };
  isBookmarked?: boolean;
  aiModerationStatus?: 'safe' | 'warning' | 'blocked';
  aiSupportMessage?: string;
  isDailyQuestionAnswer?: boolean;
  dailyQuestionId?: string;
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  timestamp: string;
  authorId: string;
  isHelpful?: boolean;
}

export interface AdviceRoom {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}

interface PostContextType {
  posts: Post[];
  trendingPosts: Post[];
  bookmarkedPosts: Post[];
  rooms: AdviceRoom[];
  addPost: (content: string, category: string, campus: string, poll?: { question: string; options: string[] }, aiStatus?: 'safe' | 'warning' | 'blocked', aiSupport?: string, isDailyAnswer?: boolean) => void;
  addComment: (postId: string, content: string) => void;
  getPostById: (id: string) => Post | undefined;
  getCommentsByPostId: (postId: string) => Comment[];
  reactToPost: (postId: string, reactionType: 'agree') => void;
  unreactToPost: (postId: string, reactionType: 'agree') => void;
  upvotePost: (postId: string) => void;
  downvotePost: (postId: string) => void;
  reportPost: (postId: string) => void;
  repostPost: (postId: string) => void;
  unrepostPost: (postId: string) => void;
  voteInPoll: (postId: string, optionId: string) => void;
  toggleBookmark: (postId: string) => void;
  markCommentAsHelpful: (commentId: string) => void;
  getUserKarma: () => number;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [rooms] = useState<AdviceRoom[]>([
    { id: '1', name: 'Exam Stress', description: 'Share your study struggles and get tips.', icon: '📚', category: 'Academic' },
    { id: '2', name: 'Relationships', description: 'Anonymous advice for your heart.', icon: '❤️', category: 'Social' },
    { id: '3', name: 'Career Advice', description: 'Internships, jobs, and future plans.', icon: '💼', category: 'Professional' },
    { id: '4', name: 'Mental Health', description: 'A safe space to talk about your well-being.', icon: '🧠', category: 'Wellness' },
    { id: '5', name: 'Campus Life', description: 'Everything about hostel, mess, and fests.', icon: '🏫', category: 'Social' },
  ]);

  useEffect(() => {
    // Load initial mock data
    const storedPosts = localStorage.getItem('posts');
    const storedComments = localStorage.getItem('comments');

    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    } else {
      setPosts(mockPosts);
      localStorage.setItem('posts', JSON.stringify(mockPosts));
    }

    if (storedComments) {
      setComments(JSON.parse(storedComments));
    } else {
      setComments(mockComments);
      localStorage.setItem('comments', JSON.stringify(mockComments));
    }
  }, []);

  const bookmarkedPosts = posts.filter(p => p.isBookmarked);

  const trendingPosts = [...posts].sort((a, b) => {
    const scoreA = (a.upvotes || 0) - (a.downvotes || 0) + a.commentsCount * 2 + (a.repostsCount || 0) * 3;
    const scoreB = (b.upvotes || 0) - (b.downvotes || 0) + b.commentsCount * 2 + (b.repostsCount || 0) * 3;
    return scoreB - scoreA;
  });

  const addPost = (content: string, category: string, campus: string, poll?: { question: string; options: string[] }, aiStatus: 'safe' | 'warning' | 'blocked' = 'safe', aiSupport?: string, isDailyAnswer: boolean = false) => {
    const newPost: Post = {
      id: Date.now().toString(),
      content,
      category,
      timestamp: new Date().toISOString(),
      likesCount: 0,
      commentsCount: 0,
      reportsCount: 0,
      repostsCount: 0,
      campus,
      authorId: 'me',
      reactions: { agree: 0 },
      upvotes: 0,
      downvotes: 0,
      userVote: 0,
      poll: poll ? {
        question: poll.question,
        options: poll.options.map((opt, i) => ({ id: i.toString(), text: opt, votes: 0 }))
      } : undefined,
      aiModerationStatus: aiStatus,
      aiSupportMessage: aiSupport,
      isDailyQuestionAnswer: isDailyAnswer
    };
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  const addComment = (postId: string, content: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      postId,
      content,
      timestamp: new Date().toISOString(),
      authorId: 'me'
    };
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    localStorage.setItem('comments', JSON.stringify(updatedComments));

    // Update comment count on post
    const updatedPosts = posts.map(p => p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p);
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  const getPostById = (id: string) => posts.find(p => p.id === id);
  const getCommentsByPostId = (postId: string) => comments.filter(c => c.postId === postId);

  const reactToPost = (postId: string, reactionType: 'agree') => {
    const updatedPosts = posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          reactions: {
            ...p.reactions,
            [reactionType]: p.reactions[reactionType] + 1
          },
          likesCount: p.likesCount + 1
        };
      }
      return p;
    });
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  const unreactToPost = (postId: string, reactionType: 'agree') => {
    const updatedPosts = posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          reactions: {
            ...p.reactions,
            [reactionType]: Math.max(0, p.reactions[reactionType] - 1)
          },
          likesCount: Math.max(0, p.likesCount - 1)
        };
      }
      return p;
    });
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  const upvotePost = (postId: string) => {
    const updatedPosts = posts.map(p => {
      if (p.id === postId) {
        const currentVote = p.userVote || 0;
        let upvotes = p.upvotes || 0;
        let downvotes = p.downvotes || 0;
        let userVote: 1 | -1 | 0 = 0;

        if (currentVote === 1) {
          upvotes -= 1;
          userVote = 0;
        } else {
          if (currentVote === -1) downvotes -= 1;
          upvotes += 1;
          userVote = 1;
        }

        return { ...p, upvotes, downvotes, userVote };
      }
      return p;
    });
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  const downvotePost = (postId: string) => {
    const updatedPosts = posts.map(p => {
      if (p.id === postId) {
        const currentVote = p.userVote || 0;
        let upvotes = p.upvotes || 0;
        let downvotes = p.downvotes || 0;
        let userVote: 1 | -1 | 0 = 0;

        if (currentVote === -1) {
          downvotes -= 1;
          userVote = 0;
        } else {
          if (currentVote === 1) upvotes -= 1;
          downvotes += 1;
          userVote = -1;
        }

        return { ...p, upvotes, downvotes, userVote };
      }
      return p;
    });
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  const reportPost = (postId: string) => {
    const updatedPosts = posts.map(p => 
      p.id === postId ? { ...p, reportsCount: (p.reportsCount || 0) + 1, isReported: true } : p
    );
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  const repostPost = (postId: string) => {
    const updatedPosts = posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          repostsCount: (p.repostsCount || 0) + 1
        };
      }
      return p;
    });
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  const unrepostPost = (postId: string) => {
    const updatedPosts = posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          repostsCount: Math.max(0, (p.repostsCount || 0) - 1)
        };
      }
      return p;
    });
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  const voteInPoll = (postId: string, optionId: string) => {
    const updatedPosts = posts.map(p => {
      if (p.id === postId && p.poll) {
        return {
          ...p,
          poll: {
            ...p.poll,
            options: p.poll.options.map(opt => 
              opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
            )
          }
        };
      }
      return p;
    });
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  const toggleBookmark = (postId: string) => {
    const updatedPosts = posts.map(p => 
      p.id === postId ? { ...p, isBookmarked: !p.isBookmarked } : p
    );
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  const markCommentAsHelpful = (commentId: string) => {
    const updatedComments = comments.map(c => 
      c.id === commentId ? { ...c, isHelpful: !c.isHelpful } : c
    );
    setComments(updatedComments);
    localStorage.setItem('comments', JSON.stringify(updatedComments));
  };

  const getUserKarma = () => {
    const postPoints = posts
      .filter(p => p.authorId === 'me')
      .reduce((acc, p) => acc + (p.upvotes || 0) - (p.downvotes || 0) + (p.commentsCount * 2) + (p.repostsCount || 0) * 3, 0);
    
    const commentPoints = comments
      .filter(c => c.authorId === 'me' && c.isHelpful)
      .length * 10; // 10 points for each helpful answer
      
    return postPoints + commentPoints;
  };

  return (
    <PostContext.Provider value={{ 
      posts, 
      trendingPosts, 
      bookmarkedPosts,
      rooms,
      addPost, 
      addComment, 
      getPostById, 
      getCommentsByPostId, 
      reactToPost, 
      unreactToPost,
      upvotePost,
      downvotePost,
      reportPost,
      repostPost, 
      unrepostPost,
      voteInPoll, 
      toggleBookmark,
      markCommentAsHelpful,
      getUserKarma 
    }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
};
