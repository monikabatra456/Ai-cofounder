import React, { useState } from 'react';
import { Sparkles, Lightbulb } from 'lucide-react';
import { CITIES } from '../constants';
import { cn } from '../lib/utils';
import { User } from '../types';

interface HomeProps {
  onGenerate: (idea: string, city: string) => void;
  isLoading: boolean;
  user: User | null;
}

export const HomeSection: React.FC<HomeProps> = ({ onGenerate, isLoading, user }) => {
  const [idea, setIdea] = useState('');
  const [selectedCity, setSelectedCity] = useState('Delhi NCR');

  const handleGenerate = () => {
    if (idea.length < 20) {
      alert('Please describe your idea in at least 20 characters.');
      return;
    }
    onGenerate(idea, selectedCity);
  };

  return (
    <div className="max-w-[680px] mx-auto animate-fade-in-up">
      <header className="text-center pt-16">
        {user && (
          <div className="text-[#9CA3AF] text-sm mb-2 font-medium">
            Welcome back, {user.name?.split(' ')?.[0] || 'Founder'}! 👋
          </div>
        )}
        <div className="inline-flex items-center gap-2 bg-[#1E3A5F] text-[#60A5FA] border border-accent rounded-full px-4 py-1.5 text-sm font-medium">
          <Sparkles size={14} />
          <span>Powered by Gemini AI</span>
        </div>
        
        <h1 className="mt-5 text-5xl font-bold leading-tight">
          Your AI Co-Founder
        </h1>
        
        <p className="mt-3 text-xl text-text-muted">
          Idea se funding tak — seconds mein
        </p>
      </header>

      <main className="mt-12 card p-9">
        <div className="space-y-6">
          <div>
            <label className="block text-xs text-text-muted font-medium mb-2.5">
              Apna startup idea batao 💡
            </label>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Example: Main ek app banana chahta hoon jisse college students apne notes sell kar sakein aur doosre kharid sakein. Delhi University ke 3 lakh+ students target hain. Revenue subscription se aayega..."
              className="w-full h-40 input-field resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-[#4B5563]">aur</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div>
            <label className="block text-xs text-text-muted font-medium mb-2.5">
              Apna shehar chuno 📍
            </label>
            <div className="flex flex-wrap gap-2.5">
              {CITIES.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={cn(
                    "px-5 py-2 rounded-full text-xs transition-all duration-200 border",
                    selectedCity === city
                      ? "bg-accent text-white border-accent"
                      : "bg-bg-input text-text-muted border-border-hover hover:border-accent/50"
                  )}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { num: '500+', label: 'Founders' },
              { num: '25+', label: 'Investors' },
              { num: '10', label: 'Slide Deck' }
            ].map((stat) => (
              <div key={stat.label} className="bg-bg-input rounded-xl p-4 text-center">
                <span className="block text-accent text-2xl font-bold">{stat.num}</span>
                <span className="block text-text-muted text-[10px] mt-1 uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full h-14 btn-primary text-lg tracking-wide"
          >
            {isLoading ? 'Analyzing Idea...' : 'Generate My Co-Founder Kit 🚀'}
          </button>

          <div className="flex flex-wrap justify-center gap-2">
            {['📊 Deep Market Research', '📑 10 Slides', '📍 Investor Map', '✉️ Email Draft'].map((f) => (
              <span key={f} className="text-[11px] text-[#6B7280] bg-bg-input/60 px-3 py-1 rounded-full">
                {f}
              </span>
            ))}
          </div>

          <div className="text-center">
            <p className="text-[11px] text-[#4B5563] flex items-center justify-center gap-1">
              <Lightbulb size={12} />
              Just want a PPT? Click the 📑 tab →
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
