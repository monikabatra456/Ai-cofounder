import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, Download, RefreshCw, Presentation } from 'lucide-react';
import { cn } from '../lib/utils';
import { PPTData } from '../types';
import { generatePresentationContent } from '../services/pptService';
import pptxgen from 'pptxgenjs';

export const PPTMakerSection: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [slideCount, setSlideCount] = useState(10);
  const [theme, setTheme] = useState('Startup');
  const [language, setLanguage] = useState('English');
  const [type, setType] = useState('💰 Investor Pitch');
  const [isLoading, setIsLoading] = useState(false);
  const [pptData, setPptData] = useState<PPTData | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const loadingSteps = [
    "📝 Reading your prompt...",
    "🧠 Understanding the topic...",
    "📊 Generating slide content...",
    "🎨 Applying beautiful design...",
    "✨ Adding animations...",
    "📥 Preparing download..."
  ];

  const examplePrompts = [
    { title: "🍕 Food Delivery Startup", desc: "10 slide pitch for FoodieExpress cloud kitchen in Delhi NCR.", full: "Create a 10 slide investor pitch deck for FoodieExpress — a cloud kitchen startup targeting working professionals in Delhi NCR. Market size $8B, competitors Zomato and Swiggy, raising ₹50L seed funding. Dark theme." },
    { title: "📚 EdTech Platform", desc: "12 slide deck for LearnFast AI tutoring app for JEE/NEET.", full: "Make a 12 slide pitch deck for LearnFast — AI tutoring app for Class 10-12 students preparing for JEE and NEET. Market 2 crore students, subscription ₹499/month, startup theme." },
    { title: "🏥 HealthTech App", desc: "10 slides for DoctorNear doctor booking in tier 2 cities.", full: "Build 10 slides for DoctorNear — instant doctor booking app for tier 2 cities in India. Target market $6B, 50 crore underserved patients, raising ₹75L pre-seed. Corporate theme." },
    { title: "🌾 AgriTech Solution", desc: "8 slides for KisanConnect farm-to-consumer marketplace.", full: "Create 8 slides for KisanConnect — marketplace connecting farmers to buyers directly. Removes middlemen, 12 crore farmers in India, commission model, colorful theme." },
    { title: "💳 FinTech Product", desc: "10 slide deck for PayEasy UPI solution for kirana stores.", full: "Make a 10 slide deck for PayEasy — UPI-based payment solution for small kirana stores. 3 crore stores in India, ₹31B market, subscription ₹299/month, dark professional theme." },
    { title: "🏠 PropTech Platform", desc: "12 slides for GharDhundo AI rental platform for students.", full: "Create 12 slides for GharDhundo — AI-powered rental platform for students and working professionals. 1 crore people search housing yearly, commission 5%, raising ₹1Cr seed." }
  ];

  const handleGenerate = () => {
    if (prompt.length < 20) {
      alert('Please describe your presentation in at least 20 characters.');
      return;
    }

    setIsLoading(true);
    setLoadingStep(0);
    setProgress(0);

    // Simulate loading
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    const stepInterval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev >= 5) {
          clearInterval(stepInterval);
          return 5;
        }
        return prev + 1;
      });
    }, 800);

    setTimeout(() => {
      const data = generatePresentationContent(prompt, slideCount, theme, language, type);
      setPptData(data);
      setIsLoading(false);
      setCurrentSlide(0);
    }, 5000);
  };

  const downloadPPTX = () => {
    if (!pptData) return;
    
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_WIDE';
    pptx.title = pptData.presentationTitle;
    const t = pptData.theme;
    
    pptData.slides.forEach(s => {
      const slide = pptx.addSlide();
      slide.background = { color: t.bg.replace('#','') };
      
      if(s.layoutType !== 'title') {
        slide.addShape(pptx.ShapeType.rect, {
          x:0, y:0, w:'100%', h:0.07,
          fill: { color: t.accent.replace('#','') }
        });
        slide.addText(String(s.slideNumber), {
          x:12.8, y:0.08, w:0.5, h:0.25,
          fontSize:9, color: '6B7280'
        });
      }
      
      if(s.layoutType === 'title') {
        slide.addText(s.emoji || '🚀', {
          x: 5.5, y: 1.5, w: 2.3, h: 1.3,
          fontSize: 58, align: 'center'
        });
        slide.addText(pptData.presentationTitle, {
          x: 0.5, y: 3.0, w: 12.3, h: 1.5,
          fontSize: 44, bold: true, align: 'center',
          color: t.title.replace('#','')
        });
        slide.addText(s.subtitle || '', {
          x: 0.5, y: 4.5, w: 12.3, h: 0.7,
          fontSize: 20, align: 'center',
          color: t.accent.replace('#','')
        });
        slide.addText(pptData.fundingAsk || 'Seed Round', {
          x: 4.8, y: 5.5, w: 3.7, h: 0.55,
          fontSize: 15, align: 'center', bold: true,
          color: t.accent.replace('#',''),
          line: { color: t.accent.replace('#',''), width: 0.75 }
        });
        slide.addShape(pptx.ShapeType.rect, {
          x: 0, y: 7.43, w: '100%', h: 0.07,
          fill: { color: t.accent.replace('#','') }
        });
      } else if(['stats', 'traction', 'financials', 'ask'].includes(s.layoutType)) {
        slide.addText((s.emoji || '📊') + ' ' + s.title, {
          x: 0.5, y: 0.5, w: 12.3, h: 0.8,
          fontSize: 26, bold: true,
          color: t.title.replace('#','')
        });
        slide.addText(s.subtitle || '', {
          x: 0.5, y: 1.3, w: 12.3, h: 0.4,
          fontSize: 14, color: t.accent.replace('#','')
        });
        
        const stats = s.stats || [];
        const cols = stats.length;
        const sw = (12.3 / cols);
        
        stats.forEach((st, i) => {
          const x = 0.5 + (i * sw);
          slide.addShape(pptx.ShapeType.roundRect, {
            x, y: 2.0, w: sw - 0.2, h: 4.0,
            fill: { color: t.card.replace('#','') },
            line: { color: '1F2937', width: 0.5 },
            rectRadius: 0.12
          });
          slide.addText(st.value, {
            x, y: 2.8, w: sw - 0.2, h: 1.5,
            fontSize: 34, bold: true, align: 'center',
            color: t.accent.replace('#','')
          });
          slide.addText(st.label, {
            x, y: 4.5, w: sw - 0.2, h: 0.8,
            fontSize: 12, align: 'center',
            color: '9CA3AF'
          });
        });
      } else if(['closing', 'thankyou'].includes(s.layoutType)) {
        slide.addText('🙏', {
          x: 5.8, y: 1.5, w: 1.8, h: 1.1,
          fontSize: 50, align: 'center'
        });
        slide.addText('Thank You!', {
          x: 0.5, y: 3.0, w: 12.3, h: 1.1,
          fontSize: 44, bold: true, align: 'center',
          color: t.title.replace('#','')
        });
        slide.addText(s.subtitle || '', {
          x: 0.5, y: 4.2, w: 12.3, h: 0.65,
          fontSize: 18, align: 'center',
          color: t.accent.replace('#','')
        });
        slide.addText(s.content || '', {
          x: 0.5, y: 5.0, w: 12.3, h: 0.6,
          fontSize: 14, align: 'center',
          color: '9CA3AF'
        });
        slide.addShape(pptx.ShapeType.rect, {
          x: 0, y: 7.43, w: '100%', h: 0.07,
          fill: { color: t.accent.replace('#','') }
        });
      } else {
        slide.addText((s.emoji || '📌') + ' ' + s.title, {
          x: 0.5, y: 0.5, w: 12.3, h: 0.85,
          fontSize: 26, bold: true,
          color: t.title.replace('#','')
        });
        slide.addText(s.subtitle || '', {
          x: 0.6, y: 1.3, w: 12.1, h: 0.4,
          fontSize: 14, color: t.accent.replace('#','')
        });
        if(s.content && s.content.length > 3) {
          slide.addText(s.content, {
            x: 0.6, y: 1.8, w: 12.1, h: 0.4,
            fontSize: 13, color: '9CA3AF'
          });
        }
        const bullets = s.bulletPoints || [];
        const startY = s.content ? 2.5 : 2.0;
        bullets.forEach((bp, i) => {
          slide.addShape(pptx.ShapeType.ellipse, {
            x: 0.6, y: startY + (i * 0.8) + 0.1,
            w: 0.12, h: 0.12,
            fill: { color: t.accent.replace('#','') }
          });
          slide.addText(bp, {
            x: 0.8, y: startY + (i * 0.8),
            w: 11.9, h: 0.6,
            fontSize: 15,
            color: t.text.replace('#',''),
            lineSpacingMultiple: 1.1
          });
        });
      }
    });
    
    const fname = pptData.presentationTitle.replace(/[^a-z0-9]/gi,'_').toLowerCase();
    pptx.writeFile({ fileName: `${fname}_FounderAI.pptx` });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!pptData) return;
      if (e.key === 'ArrowLeft') setCurrentSlide(prev => Math.max(0, prev - 1));
      if (e.key === 'ArrowRight') setCurrentSlide(prev => Math.min(pptData.slides.length - 1, prev + 1));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pptData]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/90 z-[999] flex items-center justify-center">
        <div className="bg-[#111827] rounded-[24px] border border-[#1F2937] p-12 max-w-[420px] w-[90%] text-center">
          <div className="relative mx-auto mb-8 w-20 h-20">
            <div className="absolute inset-0 border-[3px] border-[#1F2937] rounded-full" />
            <div className="absolute inset-0 border-[3px] border-transparent border-t-[#3B82F6] border-r-[#6366F1] rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-3xl">📑</div>
          </div>
          <h3 className="text-white text-xl font-bold mt-6">Creating Your Presentation</h3>
          <div className="mt-6 flex flex-col gap-3 text-left">
            {loadingSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[10px]",
                  i < loadingStep ? "bg-[#064E3B] text-[#6EE7B7]" : 
                  i === loadingStep ? "bg-[#1E3A5F] text-[#60A5FA]" : "bg-[#1F2937] text-[#6B7280]"
                )}>
                  {i < loadingStep ? "✓" : i === loadingStep ? "●" : "○"}
                </div>
                <span className={cn(
                  "text-sm",
                  i < loadingStep ? "text-[#6EE7B7]" : 
                  i === loadingStep ? "text-white font-medium" : "text-[#6B7280]"
                )}>
                  {step}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-7 h-2 bg-[#1F2937] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#3B82F6] via-[#6366F1] to-[#8B5CF6] transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-[#3B82F6] text-2xl font-bold mt-3">{progress}%</div>
        </div>
      </div>
    );
  }

  if (pptData) {
    const slide = pptData.slides[currentSlide];
    const t = pptData.theme;

    return (
      <div className="h-full flex flex-col bg-[#0D1117] animate-fade-in">
        <div className="flex-1 flex overflow-hidden">
          {/* Left Rail */}
          <div className="w-[200px] bg-[#060D1F] border-r border-[#1F2937] overflow-y-auto p-3 flex-shrink-0">
            <div className="text-[#9CA3AF] text-[11px] uppercase tracking-wider mb-3 px-1 font-bold">All Slides</div>
            {pptData.slides.map((s, i) => (
              <div 
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={cn(
                  "w-full aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all mb-2 relative",
                  currentSlide === i ? "border-[#3B82F6]" : "border-transparent hover:border-[#374151]"
                )}
                style={{ backgroundColor: t.bg }}
              >
                <div className="p-1.5 h-full flex flex-col">
                  <div className="bg-black/50 text-white text-[9px] px-1.5 py-0.5 rounded w-fit mb-1">{s.slideNumber}</div>
                  <div className="text-white text-[8px] font-bold leading-tight line-clamp-2" style={{ color: t.title }}>{s.title}</div>
                  <div className="text-sm mt-auto">{s.emoji}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Area */}
          <div className="flex-1 flex flex-col">
            <div className="h-[60px] bg-[#060D1F] border-bottom border-[#1F2937] flex items-center justify-between px-5 flex-shrink-0">
              <div className="text-[#9CA3AF] text-sm">Slide {currentSlide + 1} of {pptData.slideCount}</div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
                  className="w-8 h-8 bg-[#111827] border border-[#1F2937] rounded-lg text-white flex items-center justify-center hover:bg-[#1F2937]"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="text-white text-sm font-medium truncate max-w-[200px]">{slide.title}</div>
                <button 
                  onClick={() => setCurrentSlide(prev => Math.min(pptData.slides.length - 1, prev + 1))}
                  className="w-8 h-8 bg-[#111827] border border-[#1F2937] rounded-lg text-white flex items-center justify-center hover:bg-[#1F2937]"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setPptData(null)}
                  className="px-4 py-2 border border-[#1F2937] text-[#9CA3AF] rounded-xl text-xs font-medium hover:bg-[#1F2937] flex items-center gap-2"
                >
                  <RefreshCw size={14} />
                  Regenerate
                </button>
                <button 
                  onClick={downloadPPTX}
                  className="px-4 py-2 bg-[#3B82F6] text-white rounded-xl text-xs font-bold hover:bg-blue-600 flex items-center gap-2"
                >
                  <Download size={14} />
                  Download PPTX
                </button>
              </div>
            </div>

            <div className="flex-1 p-8 flex items-center justify-center overflow-auto">
              <div 
                className="w-full max-w-[840px] aspect-video rounded-xl overflow-hidden relative shadow-2xl"
                style={{ backgroundColor: t.bg }}
              >
                <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: t.accent }} />
                
                {slide.layoutType === 'title' ? (
                  <div className="h-full flex flex-col items-center justify-center p-12 text-center relative">
                    <div className="text-7xl mb-4 leading-none">{slide.emoji}</div>
                    <h1 className="text-5xl font-extrabold mb-4 leading-tight" style={{ color: t.title }}>{pptData.presentationTitle}</h1>
                    <p className="text-2xl mb-6" style={{ color: t.accent }}>{slide.subtitle}</p>
                    <div className="px-7 py-2.5 rounded-full border font-bold text-lg" style={{ backgroundColor: `${t.accent}33`, borderColor: t.accent, color: t.accent }}>
                      {pptData.fundingAsk}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: t.accent }} />
                  </div>
                ) : ['stats', 'traction', 'financials', 'ask'].includes(slide.layoutType) ? (
                  <div className="h-full p-10 flex flex-col relative">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl border" style={{ backgroundColor: `${t.accent}26`, borderColor: `${t.accent}4D` }}>
                        {slide.emoji}
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold" style={{ color: t.title }}>{slide.title}</h2>
                        <p className="text-sm mt-1" style={{ color: t.accent }}>{slide.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-sm opacity-75 mb-5" style={{ color: t.text }}>{slide.content}</p>
                    <div className="grid grid-cols-4 gap-4 mt-auto">
                      {slide.stats.map((st, i) => (
                        <div key={i} className="rounded-xl p-6 text-center border border-white/5" style={{ backgroundColor: t.card }}>
                          <div className="text-4xl font-extrabold leading-none" style={{ color: t.accent }}>{st.value}</div>
                          <div className="text-[13px] mt-2.5 opacity-70" style={{ color: t.text }}>{st.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : ['closing', 'thankyou'].includes(slide.layoutType) ? (
                  <div className="h-full flex flex-col items-center justify-center p-12 text-center relative">
                    <div className="text-7xl mb-5 leading-none">🙏</div>
                    <h1 className="text-5xl font-bold mb-4" style={{ color: t.title }}>Thank You!</h1>
                    <p className="text-2xl mb-6" style={{ color: t.accent }}>{slide.subtitle}</p>
                    <div className="px-8 py-5 rounded-xl border border-white/10" style={{ backgroundColor: t.card }}>
                      <p style={{ color: t.text }}>{slide.content}</p>
                    </div>
                    <div className="flex gap-2 mt-6">
                      {[1,2,3].map(i => <div key={i} className="w-2 h-2 rounded-full opacity-30" style={{ backgroundColor: t.accent }} />)}
                    </div>
                    <div className="absolute bottom-4 text-[12px] opacity-25" style={{ color: t.text }}>Created with FounderAI • Slide {slide.slideNumber}</div>
                  </div>
                ) : (
                  <div className="h-full p-10 flex flex-col relative">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl border" style={{ backgroundColor: `${t.accent}26`, borderColor: `${t.accent}4D` }}>
                        {slide.emoji}
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold" style={{ color: t.title }}>{slide.title}</h2>
                        <p className="text-sm mt-1" style={{ color: t.accent }}>{slide.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-sm opacity-75 mb-5" style={{ color: t.text }}>{slide.content}</p>
                    <div className="space-y-3 mt-2">
                      {slide.bulletPoints.map((bp, i) => (
                        <div key={i} className="flex items-start gap-4">
                          <div className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: t.accent }} />
                          <p className="text-lg leading-relaxed" style={{ color: t.text }}>{bp}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="absolute top-3.5 right-5 text-[12px] opacity-30" style={{ color: t.text }}>{slide.slideNumber}</div>
              </div>
            </div>

            <div className="h-[100px] bg-[#060D1F] border-t border-[#1F2937] p-4 flex-shrink-0 overflow-y-auto">
              <div className="flex justify-between items-center mb-2">
                <div className="text-[#9CA3AF] text-[11px] font-bold uppercase tracking-wider">🎤 Speaker Notes</div>
              </div>
              <p className="text-white text-[13px] leading-relaxed">{slide.speakerNotes}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[760px] mx-auto animate-fade-in-up pb-20">
      <header className="text-center pt-16">
        <div className="inline-flex items-center gap-2 bg-[#1E3A5F] text-[#60A5FA] border border-[#3B82F6] rounded-full px-6 py-2 text-sm font-medium">
          <Sparkles size={14} />
          <span>✦ AI Presentation Generator — Like Gamma</span>
        </div>
        <h1 className="mt-5 text-[44px] font-bold leading-tight text-white">
          Ek Prompt — Poori PPT Taiyaar
        </h1>
        <p className="mt-3 text-lg text-[#9CA3AF]">
          10 seconds mein beautiful pitch deck
        </p>
      </header>

      <div className="mt-12 bg-[#111827] border border-[#1F2937] rounded-[20px] p-10">
        <textarea 
          rows={5}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your presentation...&#10;&#10;Example: Make a 10 slide investor pitch deck for a food delivery app targeting college students in Delhi. Include market size, competitors, funding ask ₹50 lakhs."
          className="w-full bg-[#1F2937] text-white border border-[#374151] rounded-[14px] p-5 text-[15px] resize-none outline-none focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/10 transition-all leading-relaxed"
        />
        <div className="text-right text-[12px] text-[#9CA3AF] mt-2">{prompt.length} / 500 characters</div>

        <div className="grid grid-cols-3 gap-5 mt-6">
          <div>
            <label className="block text-[12px] text-[#9CA3AF] mb-2 font-bold">📊 Slides</label>
            <div className="flex flex-wrap gap-2">
              {[5, 8, 10, 12, 15, 20].map(n => (
                <button 
                  key={n}
                  onClick={() => setSlideCount(n)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-[13px] transition-all border",
                    slideCount === n ? "bg-[#3B82F6] text-white border-[#3B82F6]" : "bg-[#1F2937] text-[#9CA3AF] border-[#374151] hover:border-[#3B82F6]/50"
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[12px] text-[#9CA3AF] mb-2 font-bold">🎨 Theme</label>
            <div className="flex flex-wrap gap-2">
              {['Dark', 'Startup', 'Corporate', 'Light', 'Colorful', 'Purple'].map(t => (
                <button 
                  key={t}
                  onClick={() => setTheme(t)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-[13px] transition-all border",
                    theme === t ? "bg-[#3B82F6] text-white border-[#3B82F6]" : "bg-[#1F2937] text-[#9CA3AF] border-[#374151] hover:border-[#3B82F6]/50"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[12px] text-[#9CA3AF] mb-2 font-bold">🌐 Language</label>
            <div className="flex flex-wrap gap-2">
              {['English', 'Hindi', 'Hinglish'].map(l => (
                <button 
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-[13px] transition-all border",
                    language === l ? "bg-[#3B82F6] text-white border-[#3B82F6]" : "bg-[#1F2937] text-[#9CA3AF] border-[#374151] hover:border-[#3B82F6]/50"
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-[12px] text-[#9CA3AF] mb-2 font-bold">📋 Presentation Type</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: '💰 Investor Pitch', desc: 'For raising funding' },
              { id: '📈 Business Proposal', desc: 'For clients/partners' },
              { id: '🎓 Educational', desc: 'For school/college' },
              { id: '📣 Product Launch', desc: 'For new product reveal' }
            ].map(t => (
              <button 
                key={t.id}
                onClick={() => setType(t.id)}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl border transition-all text-left",
                  type === t.id ? "bg-[#3B82F6]/10 border-[#3B82F6]" : "bg-[#1F2937] border-[#374151] hover:border-[#3B82F6]/50"
                )}
              >
                <div className="flex-1">
                  <div className="text-white text-sm font-bold">{t.id}</div>
                  <div className="text-[#9CA3AF] text-[12px] mt-0.5">{t.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <label className="block text-[13px] text-[#9CA3AF] mb-3 font-bold">⚡ Quick Start — Click to use:</label>
          <div className="grid grid-cols-2 gap-3">
            {examplePrompts.map((ex, i) => (
              <button 
                key={i}
                onClick={() => setPrompt(ex.full)}
                className="bg-[#1F2937] border border-[#374151] rounded-xl p-4 text-left hover:border-[#3B82F6] transition-all group"
              >
                <div className="text-white text-[13px] font-bold group-hover:text-[#3B82F6] transition-colors">{ex.title}</div>
                <div className="text-[#9CA3AF] text-[11px] mt-1">{ex.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full h-[60px] bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white text-lg font-bold rounded-[14px] mt-8 hover:opacity-90 hover:-translate-y-0.5 active:scale-[0.98] transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2"
        >
          <Sparkles size={20} />
          Generate My Presentation
        </button>

        <div className="flex justify-between mt-4 text-[12px] text-[#9CA3AF]">
          <span>⚡ Generates in 3-5 seconds</span>
          <span>📥 Downloads as real .pptx file</span>
        </div>
      </div>
    </div>
  );
};
