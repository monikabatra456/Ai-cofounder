import React, { useState } from 'react';
import { Search, Database, Code, Copy, Check } from 'lucide-react';
import { cn } from '../lib/utils';

export const InvestorSearchSection: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/investors/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!results) return;
    navigator.clipboard.writeText(JSON.stringify(results, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Database className="text-accent" />
          Investor Data Extraction
        </h2>
        <p className="text-text-muted">
          Extract precise investor details from our verified database in JSON format.
        </p>
      </div>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by city (e.g. Delhi), focus (e.g. SaaS), or name..."
            className="w-full bg-bg-input border border-border rounded-2xl px-6 py-4 pl-14 text-white outline-none focus:border-accent transition-all shadow-lg"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" size={24} />
          <button 
            type="submit"
            disabled={isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 btn-primary px-6 py-2 rounded-xl text-sm font-bold"
          >
            {isLoading ? 'Extracting...' : 'Extract JSON'}
          </button>
        </div>
      </form>

      {results && (
        <div className="space-y-6">
          <div className="flex justify-between items-center px-2">
            <span className="text-sm font-medium text-text-muted">
              Found {results.length} results
            </span>
            <button 
              onClick={copyToClipboard}
              className="flex items-center gap-2 text-xs font-bold text-accent hover:text-accent-hover transition-colors"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy JSON'}
            </button>
          </div>

          <div className="card p-0 overflow-hidden border-border/50">
            <div className="bg-[#0F172A] p-4 border-b border-border flex items-center gap-2">
              <Code size={16} className="text-accent" />
              <span className="text-xs font-mono text-text-muted">output.json</span>
            </div>
            <pre className="p-6 text-xs font-mono text-green-400 overflow-x-auto max-h-[500px] bg-[#020617] leading-relaxed">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((inv, i) => (
              <div key={i} className="card p-4 border-border/30 hover:border-accent/30 transition-all">
                <h3 className="font-bold text-white mb-1">{inv.investor_name}</h3>
                <p className="text-xs text-accent mb-3">{inv.fund_name}</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-text-muted uppercase tracking-wider">Location</span>
                    <span className="text-white">{inv.location}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-text-muted uppercase tracking-wider">Email</span>
                    <span className="text-white">{inv.email_address}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-text-muted uppercase tracking-wider">LinkedIn</span>
                    <span className="text-white italic">{inv.linkedin_url}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!results && !isLoading && (
        <div className="text-center py-20 bg-bg-input/20 rounded-3xl border border-dashed border-border">
          <Database size={48} className="mx-auto text-border mb-4 opacity-50" />
          <p className="text-text-muted">Enter a query to extract investor data</p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {['Delhi', 'Mumbai', 'SaaS', 'Fintech'].map(tag => (
              <button 
                key={tag}
                onClick={() => setQuery(tag)}
                className="text-[10px] bg-bg-input border border-border px-3 py-1 rounded-full text-text-muted hover:text-white hover:border-accent transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
