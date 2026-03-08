import React from 'react';
import { Home, Bell, User, Plus, Search, MessageSquare, Bookmark } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNavigationBar: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { theme } = useTheme();

  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'rooms', icon: MessageSquare, label: 'Rooms' },
    { id: 'search', icon: Search, label: 'Explore' },
    { id: 'bookmarks', icon: Bookmark, label: 'Saved' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 h-16 border-t flex items-center justify-around px-4 z-40",
      theme === 'light' ? "bg-white border-gray-100" : "bg-[#0F0F0F] border-gray-800"
    )}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 transition-colors",
              isActive 
                ? (theme === 'light' ? "text-[#6C63FF]" : "text-[#8B7CFF]")
                : (theme === 'light' ? "text-gray-400" : "text-gray-600")
            )}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export const FloatingActionButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const { theme } = useTheme();
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-20 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30 z-50 transition-transform active:scale-90",
        theme === 'light' ? "bg-[#6C63FF] text-white" : "bg-[#8B7CFF] text-white"
      )}
    >
      <Plus size={28} />
    </button>
  );
};
