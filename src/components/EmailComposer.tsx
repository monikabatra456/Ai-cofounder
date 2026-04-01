import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, Send, Save, ChevronDown } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { AnalysisResult, Investor } from '../types';
import { INVESTORS } from '../constants';
import { cn } from '../lib/utils';

interface EmailComposerProps {
  result: AnalysisResult;
  selectedCity: string;
}

export const EmailComposerSection: React.FC<EmailComposerProps> = ({ result, selectedCity }) => {
  const [selectedInvestorId, setSelectedInvestorId] = useState<number>(
    INVESTORS.find(inv => inv.city === selectedCity)?.id || INVESTORS[0]?.id
  );
  const [subject, setSubject] = useState(result.investorEmail.subject || '');
  const [body, setBody] = useState(result.investorEmail.body || '');
  const [isSent, setIsSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const selectedInvestor = INVESTORS.find(inv => inv.id === selectedInvestorId)!;

  const handleSend = async () => {
    setIsSending(true);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: selectedInvestor.email,
          subject: subject,
          text: body
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send email');
      }

      setIsSent(true);
    } catch (error) {
      console.error('Email failed:', error);
      alert(`Email failed to send: ${error instanceof Error ? error.message : 'Unknown error'}. \n\nNote: Make sure EMAIL_USER and EMAIL_PASS are set in your environment.`);
    } finally {
      setIsSending(false);
    }
  };

  if (isSent) {
    return (
      <div className="text-center py-20 animate-fade-in-up">
        <div className="w-20 h-20 bg-success/10 border-2 border-success rounded-full mx-auto flex items-center justify-center text-4xl animate-scale-in">
          ✅
        </div>
        <h2 className="text-3xl font-bold mt-6">Email Bhej Diya! 🎉</h2>
        <p className="text-text-muted mt-2">{selectedInvestor.name} ko email send ho gaya</p>
        <p className="text-[#6B7280] text-sm mt-1">{new Date().toLocaleString()}</p>
        
        <div className="flex gap-4 justify-center mt-8">
          <button 
            onClick={() => setIsSent(false)}
            className="border border-accent text-accent px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-accent/10"
          >
            Send Another
          </button>
          <button className="btn-primary px-6 py-2.5 rounded-xl text-sm font-bold">
            Schedule Meeting 📅
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-center gap-0 mb-8">
        {[
          { id: 1, label: 'Select', status: 'done' },
          { id: 2, label: 'Compose', status: 'active' },
          { id: 3, label: 'Send', status: 'pending' }
        ].map((step, i) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                step.status === 'active' || step.status === 'done' ? "bg-accent text-white" : "bg-bg-input text-text-muted"
              )}>
                {step.id}
              </div>
              <span className="text-[10px] mt-1 text-text-muted uppercase tracking-widest">{step.label}</span>
            </div>
            {i < 2 && <div className="w-16 h-px bg-border mt-4" />}
          </React.Fragment>
        ))}
      </div>

      <div className="card p-5 mb-4">
        <label className="block text-[10px] text-text-muted uppercase font-bold tracking-widest mb-2">Sending to:</label>
        <div className="relative">
          <select 
            value={selectedInvestorId}
            onChange={(e) => setSelectedInvestorId(Number(e.target.value))}
            className="w-full bg-bg-input text-white border border-border-hover rounded-xl px-4 py-3 text-sm outline-none appearance-none cursor-pointer focus:border-accent"
          >
            {INVESTORS.map(inv => (
              <option key={inv.id} value={inv.id}>{inv.name} ({inv.fund})</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-3">
          <span className="text-xs text-[#6B7280] font-medium min-w-[60px]">Subject:</span>
          <input 
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="bg-transparent text-white text-sm flex-1 outline-none"
          />
        </div>
        <div className="px-5 py-4 border-b border-border flex items-center gap-3">
          <span className="text-xs text-[#6B7280] font-medium min-w-[60px]">To:</span>
          <input 
            value={selectedInvestor.email}
            readOnly
            className="bg-transparent text-white text-sm flex-1 outline-none"
          />
        </div>
        <div className="p-5">
          <textarea 
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full min-h-[300px] bg-transparent text-gray-300 text-sm leading-relaxed outline-none resize-none"
          />
        </div>
        <div className="px-5 py-3 bg-bg-input/50 border-t border-border flex justify-between items-center">
          <span className="text-[11px] text-text-muted italic">— Sent via FounderAI</span>
          <span className="text-[11px] text-text-muted">{body.trim() ? body.trim().split(/\s+/).length : 0} words</span>
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button className="flex-1 border border-border-hover text-gray-300 py-3.5 rounded-xl text-sm font-medium hover:bg-bg-input transition-colors flex items-center justify-center gap-2">
          <Save size={16} />
          Save Draft
        </button>
        <button 
          onClick={handleSend}
          disabled={isSending}
          className="flex-[2] btn-primary py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
        >
          {isSending ? 'Sending...' : (
            <>
              <Send size={16} />
              Send Now 🚀
            </>
          )}
        </button>
      </div>
    </div>
  );
};
