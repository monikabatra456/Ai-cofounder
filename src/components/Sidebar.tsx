import React from 'react';
import { Home, LayoutDashboard, MapPin, Mail, Calendar, Presentation, Database, LucideIcon, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { User } from '../types';

interface NavItem {
  id: string;
  icon: LucideIcon;
  tooltip: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', icon: Home, tooltip: 'Home' },
  { id: 'dashboard', icon: LayoutDashboard, tooltip: 'Dashboard' },
  { id: 'map', icon: MapPin, tooltip: 'Investor Map' },
  { id: 'email', icon: Mail, tooltip: 'Email' },
  { id: 'meetings', icon: Calendar, tooltip: 'Meetings' },
  { id: 'ppt', icon: Presentation, tooltip: 'PPT Maker' },
  { id: 'search', icon: Database, tooltip: 'Data Extraction' },
];

interface SidebarProps {
  activeSection: string;
  onSectionChange: (id: string) => void;
  user: User | null;
  onSignOut: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange, user, onSignOut }) => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-[70px] bg-[#060D1F] border-r border-border flex flex-col items-center py-5 z-[100] transition-all md:translate-x-0 -translate-x-full md:relative">
      <div className="w-11 h-11 bg-accent rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-blue-500/20">
        F
      </div>

      <nav className="mt-8 flex flex-col gap-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "group relative w-[46px] h-[46px] rounded-xl flex items-center justify-center transition-all duration-200",
                isActive 
                  ? "bg-[#1E3A5F] text-accent shadow-[inset_0_0_0_1px_#3B82F6]" 
                  : "text-text-muted hover:bg-bg-input hover:text-white"
              )}
            >
              <Icon size={22} />
              
              {/* Tooltip */}
              <div className="absolute left-[70px] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 bg-bg-card text-white px-3 py-1.5 rounded-lg text-xs whitespace-nowrap border border-border z-[999] shadow-xl">
                {item.tooltip}
              </div>
            </button>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="mt-auto pt-4 border-t border-[#1F2937] w-full flex flex-col items-center gap-3">
        {user ? (
          <div className="group relative flex flex-col items-center gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#3B82F6] bg-[#1E3A5F] flex items-center justify-center text-white font-bold text-sm">
              {user.photo ? (
                <img src={user.photo} alt={user.name || ''} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span>{user.name?.charAt(0) || 'U'}</span>
              )}
            </div>

            {/* Tooltip */}
            <div className="absolute left-[70px] bottom-12 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 bg-bg-card text-white px-4 py-3 rounded-xl text-xs whitespace-nowrap border border-border z-[999] shadow-2xl min-w-[180px]">
              <div className="font-bold text-sm mb-0.5">{user.name}</div>
              <div className="text-text-muted mb-3">{user.email}</div>
              <button 
                onClick={onSignOut}
                className="w-full py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all font-medium flex items-center justify-center gap-2"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>

            {/* Logout Button */}
            <button 
              onClick={onSignOut}
              className="w-9 h-9 rounded-full bg-transparent border border-[#374151] text-[#9CA3AF] flex items-center justify-center transition-all hover:border-red-500 hover:text-red-500"
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-[#1F2937] flex items-center justify-center text-[#4B5563]">
            ?
          </div>
        )}
      </div>
    </aside>
  );
};
