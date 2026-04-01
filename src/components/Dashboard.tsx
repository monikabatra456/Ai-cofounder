import React from 'react';
import { BarChart3, Presentation, MapPin, Mail, CheckCircle2, ChevronRight, Download, TrendingUp, ShieldAlert, Scale, Users } from 'lucide-react';
import { AnalysisResult, Investor } from '../types';
import { INVESTORS } from '../constants';
import { cn } from '../lib/utils';

interface DashboardProps {
  result: AnalysisResult;
  selectedCity: string;
  onNavigate: (section: string) => void;
  onDownloadPPT: () => void;
}

export const DashboardSection: React.FC<DashboardProps> = ({ result, selectedCity, onNavigate, onDownloadPPT }) => {
  const cityInvestors = INVESTORS.filter(inv => inv.city === selectedCity).slice(0, 3);

  return (
    <div className="animate-fade-in-up pb-10">
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Your Co-Founder Kit</h2>
        
        <div className="flex gap-3">
          <div className="bg-[#064E3B] text-[#6EE7B7] border border-[#065F46] rounded-full px-4 py-1.5 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 size={14} />
            Analysis Complete
          </div>
          
          <div className="bg-bg-input text-text-muted border border-border rounded-full px-4 py-1.5 text-xs font-medium">
            {result.startupName}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* CARD 1: Market Analysis */}
        <div className="card relative overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />
          
          <div className="flex gap-4 items-center mb-6">
            <div className="w-12 h-12 bg-[#1E3A5F] rounded-full flex items-center justify-center text-2xl">📊</div>
            <div>
              <h3 className="text-lg font-bold">Market Analysis</h3>
              <p className="text-text-muted text-xs mt-0.5">{result.oneLiner}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-bg-input rounded-xl p-4 text-center">
              <span className="block text-accent text-2xl font-bold">{result.marketSize}</span>
              <span className="block text-text-muted text-[10px] mt-1.5 uppercase tracking-wider">Market Size</span>
            </div>
            <div className="bg-bg-input rounded-xl p-4 text-center">
              <span className="block text-success text-2xl font-bold">{result.marketGrowth}</span>
              <span className="block text-text-muted text-[10px] mt-1.5 uppercase tracking-wider">Growth Rate</span>
            </div>
            <div className="bg-bg-input rounded-xl p-4 text-center">
              <span className="block text-warning text-2xl font-bold">{result.opportunityScore}/10</span>
              <span className="block text-text-muted text-[10px] mt-1.5 uppercase tracking-wider">Opportunity</span>
            </div>
            <div className="bg-bg-input rounded-xl p-4 text-center">
              <span className="block text-purple-400 text-lg font-bold">{result.fundingStage}</span>
              <span className="block text-text-muted text-[10px] mt-1.5 uppercase tracking-wider">Best Stage</span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-[10px] text-[#6B7280] uppercase tracking-widest font-bold">Top Competitors</label>
            <div className="flex flex-wrap gap-2">
              {result.competitors?.map((comp) => (
                <span 
                  key={comp.name} 
                  title={comp.weakness}
                  className="bg-bg-input text-gray-300 text-[11px] px-3 py-1 rounded-full border border-border-hover cursor-help"
                >
                  {comp.name}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button className="flex-1 bg-[#064E3B] text-[#6EE7B7] text-[10px] py-1.5 rounded-full font-bold uppercase tracking-wider">💪 Strengths</button>
            <button className="flex-1 bg-[#7F1D1D] text-[#FCA5A5] text-[10px] py-1.5 rounded-full font-bold uppercase tracking-wider">⚠️ Weaknesses</button>
            <button className="flex-1 bg-[#1E3A5F] text-[#93C5FD] text-[10px] py-1.5 rounded-full font-bold uppercase tracking-wider">🎯 Opps</button>
          </div>
        </div>

        {/* CARD 2: Pitch Deck */}
        <div className="card relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500" />
          
          <div className="flex gap-4 items-center mb-6">
            <div className="w-12 h-12 bg-[#2E1065] rounded-full flex items-center justify-center text-2xl">📑</div>
            <div>
              <h3 className="text-lg font-bold">10 Slides Ready</h3>
              <p className="text-text-muted text-xs mt-0.5">Investor-ready pitch deck</p>
            </div>
          </div>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2 relative">
            {result.pitchSlides?.map((slide) => (
              <div 
                key={slide.number}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-bg-input cursor-pointer transition-colors group"
              >
                <div className="w-6 h-6 bg-[#374151] rounded flex items-center justify-center text-[10px] text-text-muted font-bold group-hover:bg-accent group-hover:text-white transition-colors">
                  {slide.number}
                </div>
                <span className="text-sm text-white flex-1">{slide.title}</span>
                <ChevronRight size={14} className="text-[#4B5563]" />
              </div>
            ))}
            <div className="sticky bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-bg-card to-transparent pointer-events-none" />
          </div>

          <button 
            onClick={onDownloadPPT}
            className="w-full mt-4 flex items-center justify-center gap-2 border border-accent text-[#60A5FA] py-3 rounded-xl text-sm font-medium hover:bg-accent/10 transition-colors"
          >
            <Download size={16} />
            Download PPT
          </button>
        </div>

        {/* CARD 3: Investors Near You */}
        <div className="card relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-success" />
          
          <div className="flex gap-4 items-center mb-4">
            <div className="w-12 h-12 bg-[#064E3B] rounded-full flex items-center justify-center text-2xl">📍</div>
            <div>
              <h3 className="text-lg font-bold">Investors Near You</h3>
              <p className="text-text-muted text-xs mt-0.5">📍 {selectedCity} • {cityInvestors.length} investors found</p>
            </div>
          </div>

          <div className="space-y-3 mt-6">
            {cityInvestors.map((inv) => (
              <div key={inv.id} className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ backgroundColor: inv.color }}
                >
                  {inv.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{inv.name}</p>
                  <p className="text-xs text-text-muted truncate">{inv.fund}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="bg-bg-input text-gray-300 text-[10px] px-2 py-0.5 rounded-full border border-border-hover">
                    {inv.focus?.[0]}
                  </span>
                  <span className="bg-success/10 text-success text-[10px] px-2 py-0.5 rounded-full font-medium">
                    {inv.distance}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => onNavigate('map')}
            className="w-full mt-6 bg-success/10 text-success border border-success/30 py-3 rounded-xl text-sm font-medium hover:bg-success/20 transition-colors"
          >
            View All on Map →
          </button>
        </div>

        {/* CARD 4: Investor Email */}
        <div className="card relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-warning" />
          
          <div className="flex gap-4 items-center mb-6">
            <div className="w-12 h-12 bg-[#78350F] rounded-full flex items-center justify-center text-2xl">✉️</div>
            <div>
              <h3 className="text-lg font-bold">Email Draft Ready</h3>
              <p className="text-text-muted text-xs mt-0.5">Professional pitch email</p>
            </div>
          </div>

          <div className="bg-bg-input rounded-xl p-4 max-h-[160px] overflow-hidden relative">
            <p className="text-white text-xs font-bold mb-2 truncate">Subject: {result.investorEmail.subject}</p>
            <div className="h-px bg-border-hover my-2" />
            <p className="text-text-muted text-[11px] leading-relaxed">
              {result.investorEmail.body?.substring(0, 150) || 'No email body generated.'}...
            </p>
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-bg-input to-transparent pointer-events-none" />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <button 
              onClick={() => onNavigate('email')}
              className="border border-border-hover text-gray-300 py-3 rounded-xl text-sm font-medium hover:bg-bg-input transition-colors"
            >
              Edit Draft
            </button>
            <button 
              onClick={() => onNavigate('email')}
              className="bg-accent text-white py-3 rounded-xl text-sm font-bold hover:bg-blue-600 transition-colors"
            >
              Send Email 🚀
            </button>
          </div>
        </div>
      </div>

      {/* NEW SECTION: Deep Market Research */}
      <div className="mt-12 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center text-accent">
              <TrendingUp size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Deep Market Research</h3>
              <p className="text-text-muted text-xs">AI-powered insights into the Indian ecosystem</p>
            </div>
          </div>
          <div className="h-px flex-1 bg-border mx-6 hidden md:block" />
          <span className="text-[10px] text-accent font-bold uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
            Premium Analysis
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* TAM/SAM/SOM - Market Funnel */}
          <div className="card bg-bg-input/20 border-accent/10 relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-colors" />
            
            <h4 className="text-sm font-bold mb-6 flex items-center gap-2">
              <BarChart3 size={16} className="text-accent" />
              Market Potential (Funnel)
            </h4>
            
            <div className="space-y-6">
              <div className="relative">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[10px] text-text-muted uppercase font-bold">TAM (Total)</span>
                  <span className="text-sm font-bold text-white">{result.tamSamSom?.tam || '₹10,000 Cr+'}</span>
                </div>
                <div className="w-full bg-bg-input h-2 rounded-full overflow-hidden">
                  <div className="bg-accent h-full w-full animate-pulse-slow" />
                </div>
                <p className="text-[9px] text-text-muted mt-1 italic">Total market demand for the product category</p>
              </div>
              
              <div className="relative pl-4 border-l border-accent/30">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[10px] text-text-muted uppercase font-bold">SAM (Serviceable)</span>
                  <span className="text-sm font-bold text-white">{result.tamSamSom?.sam || '₹2,500 Cr'}</span>
                </div>
                <div className="w-full bg-bg-input h-2 rounded-full overflow-hidden">
                  <div className="bg-accent h-full w-2/3" />
                </div>
                <p className="text-[9px] text-text-muted mt-1 italic">Segment of TAM within your reach</p>
              </div>

              <div className="relative pl-8 border-l border-accent/30">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[10px] text-text-muted uppercase font-bold">SOM (Obtainable)</span>
                  <span className="text-sm font-bold text-white">{result.tamSamSom?.som || '₹500 Cr'}</span>
                </div>
                <div className="w-full bg-bg-input h-2 rounded-full overflow-hidden">
                  <div className="bg-accent h-full w-1/3" />
                </div>
                <p className="text-[9px] text-text-muted mt-1 italic">Market share you can realistically capture</p>
              </div>
            </div>
          </div>

          {/* Market Trends & Pain Points */}
          <div className="card bg-bg-input/20 border-warning/10 relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-warning/5 rounded-full blur-2xl group-hover:bg-warning/10 transition-colors" />
            
            <h4 className="text-sm font-bold mb-6 flex items-center gap-2">
              <Users size={16} className="text-warning" />
              Dynamics & Pain Points
            </h4>
            
            <div className="space-y-6">
              <div>
                <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold block mb-3">Emerging Trends</span>
                <div className="flex flex-wrap gap-2">
                  {(result.marketTrends || ['Digital Transformation', 'Mobile First', 'Hyper-local']).map((trend, i) => (
                    <span key={i} className="text-[10px] bg-warning/5 text-warning px-2.5 py-1 rounded-lg border border-warning/20 flex items-center gap-1.5">
                      <div className="w-1 h-1 bg-warning rounded-full" />
                      {trend}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="bg-bg-input/40 p-4 rounded-xl border border-border">
                <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold block mb-3">Customer Pain Points</span>
                <div className="space-y-3">
                  {(result.customerPainPoints || ['High operational costs', 'Lack of real-time transparency', 'Fragmented supply chain']).map((point, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="w-5 h-5 bg-warning/10 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                        <ShieldAlert size={12} className="text-warning" />
                      </div>
                      <p className="text-[11px] text-gray-300 leading-tight">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Barriers & Regulatory */}
          <div className="card bg-bg-input/20 border-success/10 relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-success/5 rounded-full blur-2xl group-hover:bg-success/10 transition-colors" />
            
            <h4 className="text-sm font-bold mb-6 flex items-center gap-2">
              <Scale size={16} className="text-success" />
              Barriers & Regulatory
            </h4>
            
            <div className="space-y-6">
              <div>
                <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold block mb-3">Moat & Barriers</span>
                <div className="grid grid-cols-1 gap-2">
                  {(result.barriersToEntry || ['High CAPEX requirements', 'Strong Network Effects', 'Deep Brand Loyalty']).map((barrier, i) => (
                    <div key={i} className="flex items-center gap-3 bg-success/5 border border-success/10 p-2 rounded-lg">
                      <div className="w-1.5 h-1.5 bg-success rounded-full" />
                      <span className="text-[11px] text-gray-300">{barrier}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold block mb-3">Regulatory Landscape</span>
                <div className="bg-[#064E3B]/20 p-4 rounded-xl border border-success/20 relative overflow-hidden">
                  <div className="absolute right-2 top-2 opacity-10">
                    <Scale size={40} />
                  </div>
                  <p className="text-[11px] text-gray-300 leading-relaxed relative z-10">
                    {result.regulatoryLandscape || 'Standard Indian startup regulations apply. GST compliance, local trade licenses, and data protection laws are critical for this sector.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
