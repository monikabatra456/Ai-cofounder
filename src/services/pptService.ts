import { PPTData, PPTSlide, PPTTheme } from '../types';
import { PPT_THEMES } from '../constants';

export function generatePresentationContent(
  prompt: string, 
  slideCount: number, 
  theme: string, 
  language: string, 
  type: string
): PPTData {

  const p = prompt.toLowerCase();
  
  // Detect topic from prompt
  const topic = detectTopic(p);
  const startupName = extractOrGenerateName(p, topic);
  const targetCity = extractCity(p);
  const fundingAsk = extractFunding(p);
  
  const t: PPTTheme = (PPT_THEMES as any)[theme] || (PPT_THEMES as any)['Startup'];
  
  // Topic-specific data
  const topicData: any = {
    food: {
      market:'$8.4B', growth:'28% YoY',
      ask: fundingAsk || '₹50 Lakhs',
      pain:'Healthy affordable food unavailable',
      solution:'Cloud kitchen network',
      revenue:'15% commission + delivery fee',
      traction:'500+ orders/day in beta',
      competitor1:'Zomato', c1w:'25-30% commission',
      competitor2:'Swiggy', c2w:'Not profitable',
      competitor3:'EatSure', c3w:'Metro cities only',
      stat1:{v:'28%',l:'Market Growth'},
      stat2:{v:'₹350',l:'Avg Order Value'},
      stat3:{v:'4.2x',l:'LTV:CAC Ratio'},
      stat4:{v:'68%',l:'Repeat Order Rate'}
    },
    edtech: {
      market:'$4.2B', growth:'39% YoY',
      ask: fundingAsk || '₹75 Lakhs',
      pain:'Quality education too expensive',
      solution:'AI-powered personalized learning',
      revenue:'₹499/month subscription',
      traction:'2000+ active learners',
      competitor1:"Byju's", c1w:'Too expensive',
      competitor2:'Unacademy', c2w:'Low completion',
      competitor3:'Vedantu', c3w:'High teacher cost',
      stat1:{v:'39%',l:'Sector Growth'},
      stat2:{v:'₹499',l:'Monthly Price'},
      stat3:{v:'85%',l:'Completion Rate'},
      stat4:{v:'4.8★',l:'User Rating'}
    },
    health: {
      market:'$6.1B', growth:'32% YoY',
      ask: fundingAsk || '₹1 Crore',
      pain:'Good doctors inaccessible in tier 2',
      solution:'Instant doctor booking platform',
      revenue:'₹50 per booking + medicine margin',
      traction:'1000+ patients served',
      competitor1:'Practo', c1w:'Poor tier 2 coverage',
      competitor2:'PharmEasy', c2w:'Delivery slow',
      competitor3:'1mg', c3w:'Trust issues',
      stat1:{v:'50Cr+',l:'Potential Patients'},
      stat2:{v:'32%',l:'Annual Growth'},
      stat3:{v:'₹50',l:'Per Booking Revenue'},
      stat4:{v:'90%',l:'Patient Satisfaction'}
    },
    fintech: {
      market:'$31B', growth:'22% YoY',
      ask: fundingAsk || '₹2 Crore',
      pain:'Small businesses lack financial tools',
      solution:'All-in-one financial platform',
      revenue:'0.5% transaction fee + subscription',
      traction:'200+ SMEs onboarded',
      competitor1:'Razorpay', c1w:'Complex for SMEs',
      competitor2:'PhonePe Biz', c2w:'Limited features',
      competitor3:'Paytm', c3w:'Too cluttered',
      stat1:{v:'3Cr+',l:'Target SMEs'},
      stat2:{v:'$31B',l:'Market Size'},
      stat3:{v:'22%',l:'YoY Growth'},
      stat4:{v:'200+',l:'Beta Customers'}
    },
    agri: {
      market:'$2.3B', growth:'41% YoY',
      ask: fundingAsk || '₹50 Lakhs',
      pain:'Farmers get 30% of actual value',
      solution:'Farm to consumer direct platform',
      revenue:'8% commission both sides',
      traction:'50 farmers, 200 buyers active',
      competitor1:'DeHaat', c1w:'Limited states',
      competitor2:'AgroStar', c2w:'Maharashtra only',
      competitor3:'Ninjacart', c3w:'B2B only',
      stat1:{v:'12Cr+',l:'Farmers in India'},
      stat2:{v:'40%',l:'Extra Income for Farmers'},
      stat3:{v:'30%',l:'Savings for Buyers'},
      stat4:{v:'41%',l:'Sector Growth'}
    },
    saas: {
      market:'$3.8B', growth:'35% YoY',
      ask: fundingAsk || '₹1.5 Crore',
      pain:'SMEs waste time on manual tasks',
      solution:'AI automation platform',
      revenue:'₹2999/month per company',
      traction:'50 paying companies',
      competitor1:'Zoho', c1w:'Too complex',
      competitor2:'Freshworks', c2w:'Too expensive',
      competitor3:'Spreadsheets', c3w:'Error-prone',
      stat1:{v:'6Cr+',l:'Target SMEs'},
      stat2:{v:'₹2999',l:'Monthly Price'},
      stat3:{v:'35%',l:'Market Growth'},
      stat4:{v:'50',l:'Paying Customers'}
    },
    tech: {
      market:'$5.5B', growth:'31% YoY',
      ask: fundingAsk || '₹75 Lakhs',
      pain:'Problem not solved efficiently today',
      solution:'Technology-first modern solution',
      revenue:'Freemium + Premium subscription',
      traction:'1000+ signups in beta',
      competitor1:'Player 1', c1w:'Poor UX',
      competitor2:'Player 2', c2w:'Too expensive',
      competitor3:'Player 3', c3w:'Outdated tech',
      stat1:{v:'$5.5B',l:'Market Size'},
      stat2:{v:'31%',l:'Annual Growth'},
      stat3:{v:'1000+',l:'Beta Signups'},
      stat4:{v:'8/10',l:'User Score'}
    }
  };
  
  const d = topicData[topic] || topicData.tech;
  
  // Generate all slide content
  const allSlideTemplates: any[] = [
    {
      layoutType: 'title',
      emoji: getTitleEmoji(topic),
      title: startupName,
      subtitle: d.solution + ' for India',
      content: 'Seed Round | ' + d.ask,
      speakerNotes: 'Start with energy! Introduce yourself and the company in 30 seconds. Make them curious.',
      stats: [],
      bulletPoints: []
    },
    {
      layoutType: 'problem',
      emoji: '😤',
      title: 'The Problem',
      subtitle: 'A massive pain point ignored',
      content: d.pain + ' across India',
      bulletPoints: [
        'Crores of Indians face this daily',
        'Current solutions are expensive and poor',
        'No India-first solution exists today',
        'Market ready for disruption right now'
      ],
      speakerNotes: 'Tell a real story of someone facing this problem. Make the investors feel the pain personally.',
      stats: []
    },
    {
      layoutType: 'solution',
      emoji: '💡',
      title: 'Our Solution',
      subtitle: startupName + ' — built for Bharat',
      content: d.solution,
      bulletPoints: [
        'Simple enough for non-tech users',
        'Works in Hindi and English',
        'Mobile-first, offline-capable',
        'Solves problem in under 2 minutes'
      ],
      speakerNotes: 'Demo the product here if possible. Show a screenshot or short video. Keep it visual.',
      stats: []
    },
    {
      layoutType: 'stats',
      emoji: '📊',
      title: 'Market Opportunity',
      subtitle: 'Massive TAM in India',
      content: 'Total addressable market analysis',
      bulletPoints: [],
      stats: [
        {value: d.market, label: 'Total Market (TAM)'},
        {value: d.growth, label: 'Annual Growth'},
        {value: '10Cr+', label: 'Target Users'},
        {value: targetCity || 'Delhi NCR', label: 'Launch City'}
      ],
      speakerNotes: 'Show bottom-up market calculation. TAM → SAM → SOM. Be conservative and credible.'
    },
    {
      layoutType: 'product',
      emoji: '⚡',
      title: 'How It Works',
      subtitle: '3 simple steps',
      content: 'Frictionless user journey',
      bulletPoints: [
        '1. User signs up in 30 seconds',
        '2. Core feature used instantly',
        '3. Value delivered in minutes',
        '4. Refer friends — viral growth'
      ],
      speakerNotes: 'Walk through the actual product flow. Show the app screens. Focus on simplicity.',
      stats: []
    },
    {
      layoutType: 'revenue',
      emoji: '💰',
      title: 'Business Model',
      subtitle: 'Multiple revenue streams',
      content: d.revenue,
      bulletPoints: [
        'Primary: ' + d.revenue,
        'Month 1-6: Free tier to build users',
        'Month 7+: Monetization begins',
        'Target: ₹10L MRR by Month 12'
      ],
      speakerNotes: 'Show unit economics clearly. LTV, CAC, payback period. Investors love specific numbers.',
      stats: []
    },
    {
      layoutType: 'traction',
      emoji: '🚀',
      title: 'Traction',
      subtitle: 'Early momentum is strong',
      content: 'Proof that market wants this',
      bulletPoints: [],
      stats: [
        {value: '1000+', label: 'Waitlist Users'},
        {value: d.traction.split(' ')[0], label: 'Active Users'},
        {value: '4.8★', label: 'Beta Rating'},
        {value: '₹2L', label: 'LOIs Signed'}
      ],
      speakerNotes: 'Show growth chart if possible. Even small numbers with strong growth rate is powerful.'
    },
    {
      layoutType: 'competition',
      emoji: '🏆',
      title: 'Why We Win',
      subtitle: 'Unfair competitive advantage',
      content: 'We beat competition on every dimension',
      bulletPoints: [
        d.competitor1 + ': ' + d.c1w,
        d.competitor2 + ': ' + d.c2w,
        d.competitor3 + ': ' + d.c3w,
        startupName + ': India-first, affordable'
      ],
      speakerNotes: 'Never say no competition exists. Show you understand the landscape deeply.',
      stats: []
    },
    {
      layoutType: 'gtm',
      emoji: '🎯',
      title: 'Go To Market',
      subtitle: '3-phase expansion plan',
      content: 'Systematic city-by-city growth',
      bulletPoints: [
        'Q1 2025: ' + (targetCity||'Delhi NCR') + ' launch, 1000 users',
        'Q3 2025: 5 metro cities, 10K users',
        'Q1 2026: Pan India, 1 lakh users',
        'Channel: Referral + Content + Paid'
      ],
      speakerNotes: 'Be very specific about your first 100, then 1000 customers. Show you have a plan.',
      stats: []
    },
    {
      layoutType: 'team',
      emoji: '👥',
      title: 'The Dream Team',
      subtitle: 'We have done this before',
      content: 'Experienced founders + advisors',
      bulletPoints: [
        'CEO: IIT graduate, 5yr domain expert',
        'CTO: Ex-FAANG, 3 products built',
        'CMO: Ex-Zomato, growth hacker',
        'Advisor: Sequoia-backed founder'
      ],
      speakerNotes: 'Team is the #1 thing investors bet on. Show why you are uniquely qualified.',
      stats: []
    },
    {
      layoutType: 'financials',
      emoji: '📈',
      title: 'Financial Projections',
      subtitle: '3-year growth plan',
      content: 'Conservative bottom-up forecast',
      bulletPoints: [],
      stats: [
        {value: '₹10L', label: 'MRR Month 12'},
        {value: '₹1Cr', label: 'ARR Year 2'},
        {value: '10K+', label: 'Users Year 2'},
        {value: '40%', label: 'Gross Margin'}
      ],
      speakerNotes: 'Show month-by-month projection for Year 1. Be realistic. Explain key assumptions.'
    },
    {
      layoutType: 'ask',
      emoji: '🤝',
      title: 'The Ask',
      subtitle: 'Join us on this journey',
      content: 'Raising ' + d.ask + ' seed round',
      bulletPoints: [],
      stats: [
        {value: d.ask, label: 'Raising Now'},
        {value: '18 mo', label: 'Runway'},
        {value: '10x', label: 'Target Return'},
        {value: '2026', label: 'Series A Target'}
      ],
      speakerNotes: 'Be clear and specific. What milestone does this money get you to? When will you raise Series A?'
    },
    {
      layoutType: 'useoffunds',
      emoji: '💵',
      title: 'Use of Funds',
      subtitle: 'Every rupee has a purpose',
      content: 'Allocation breakdown',
      bulletPoints: [
        '40% — Product & Engineering team',
        '30% — Marketing & User Growth',
        '20% — Operations & Infrastructure',
        '10% — Legal, Admin & Reserve'
      ],
      speakerNotes: 'Show investors exactly where money goes. Hiring plan + marketing budget.',
      stats: []
    },
    {
      layoutType: 'roadmap',
      emoji: '🗺️',
      title: 'Product Roadmap',
      subtitle: '12-month execution plan',
      content: 'Milestone-based development',
      bulletPoints: [
        'Month 1-3: MVP launch + 500 users',
        'Month 4-6: Feature expansion + 2K users',
        'Month 7-9: 5-city expansion + 10K users',
        'Month 10-12: Revenue ₹10L MRR'
      ],
      speakerNotes: 'Show concrete milestones with dates. Each milestone should be measurable.',
      stats: []
    },
    {
      layoutType: 'vision',
      emoji: '🌟',
      title: 'The Big Vision',
      subtitle: 'Building Indias next unicorn',
      content: 'Where we are in 5 years',
      bulletPoints: [
        '1 crore users across 50 cities',
        'Expand to Southeast Asia by 2027',
        'IPO target by 2028',
        'Creating 10,000 jobs in India'
      ],
      speakerNotes: 'End with inspiration. Make investors excited about the future they are investing in.',
      stats: []
    },
    {
      layoutType: 'testimonial',
      emoji: '💬',
      title: 'What Users Say',
      subtitle: 'Real feedback from beta users',
      content: 'NPS Score: 72 (World class)',
      bulletPoints: [
        '"Finally a solution that works for India"',
        '"Saved me 3 hours every week"',
        '"Recommended to all my friends"',
        '"I switched from competitor in day 1"'
      ],
      speakerNotes: 'Real user quotes are powerful. If you have video testimonials show them here.',
      stats: []
    },
    {
      layoutType: 'impact',
      emoji: '🌍',
      title: 'Social Impact',
      subtitle: 'Beyond profit — for Bharat',
      content: 'Creating positive change in India',
      bulletPoints: [
        'Empowering 1 crore people',
        'Creating jobs in tier 2 cities',
        'Reducing inequality through tech',
        'Aligned with India 2047 vision'
      ],
      speakerNotes: 'Impact investing is growing. Show how your business creates social good.',
      stats: []
    },
    {
      layoutType: 'advisors',
      emoji: '🎓',
      title: 'Advisors & Investors',
      subtitle: 'World class support system',
      content: 'Backed by the best in the industry',
      bulletPoints: [
        'Advisor from Sequoia Capital India',
        'Mentor from IIM Ahmedabad CIIE',
        'Technical advisor ex-Google India',
        'Industry expert with 20yr experience'
      ],
      speakerNotes: 'Show social proof. If you have any notable advisors or angels, highlight them.',
      stats: []
    },
    {
      layoutType: 'closing',
      emoji: '🙏',
      title: 'Thank You',
      subtitle: "Let's build India's future together",
      content: 'contact@' + startupName.toLowerCase() + '.in' + ' | +91 98765 43210',
      bulletPoints: [],
      stats: [],
      speakerNotes: 'End with confidence and a clear call to action. Ask for the meeting or term sheet.'
    }
  ];
  
  // Select slides based on count
  const slideSelection = selectSlides(allSlideTemplates, slideCount, type);
  
  return {
    presentationTitle: startupName,
    subtitle: d.solution,
    fundingAsk: d.ask,
    presenter: 'Founder & CEO',
    theme: t,
    themeName: theme,
    slideCount: slideSelection.length,
    slides: slideSelection.map((s,i)=>({
      ...s,
      slideNumber: i+1,
      content: s.content || 'Key insights about ' + s.title
    }))
  };
}

function detectTopic(prompt: string) {
  const map: any = {
    food: ['food','tiffin','restaurant','delivery','kitchen','cook','meal','snack','cloud kitchen'],
    edtech: ['education','student','learn','teach','school','college','course','tutor','jee','neet'],
    health: ['health','doctor','medicine','hospital','fitness','medical','patient','clinic','pharma'],
    fintech: ['money','payment','loan','invest','finance','bank','insurance','credit','upi'],
    agri: ['farmer','farm','crop','agriculture','kisan','harvest','vegetable','grain'],
    saas: ['software','tool','platform','dashboard','automation','crm','erp','management','workflow']
  };
  for(const [topic,words] of Object.entries(map)){
    if((words as string[]).some(w=>prompt.includes(w)))
      return topic;
  }
  return 'tech';
}

function extractOrGenerateName(prompt: string, topic: string) {
  const words = prompt.split(' ');
  const caps = words.find(w=>
    w.length>3 && w[0]===w[0].toUpperCase() &&
    w[0]!==w[0].toLowerCase());
  if(caps && caps.length>3) return caps;
  
  const names: any = {
    food:['TiffinHub','FreshBox','GharKhana','MealMate','YumGo'],
    edtech:['LearnFast','VidyaAI','SmartGuru','StudyPro','GyanBox'],
    health:['DocNear','CareAI','SwasthApp','MedEasy','HealHub'],
    fintech:['PayFast','DhanAI','MoneyMate','FinEasy','ArthPro'],
    agri:['KisanHub','FarmDirect','FasalAI','GreenMart','AgroConnect'],
    saas:['FlowAI','DashPro','StackUp','AutoMate','ScaleHub'],
    tech:['TechHub','AppPro','DigiSolve','SmartApp','InnovatePro']
  };
  const list = names[topic]||names.tech;
  return list[Math.floor(Math.random()*list.length)];
}

function extractCity(prompt: string) {
  const cities = ['Delhi','Mumbai','Bangalore','Hyderabad','Pune','Chennai','Kolkata','Ahmedabad','Jaipur','Lucknow'];
  return cities.find(c=>
    prompt.toLowerCase().includes(c.toLowerCase())
  ) || 'Delhi NCR';
}

function extractFunding(prompt: string) {
  const match = prompt.match(/₹\s*\d+\s*(lakh|crore|L|Cr)/i);
  return match ? match[0] : null;
}

function getTitleEmoji(topic: string) {
  const emojis: any = {
    food:'🍕', edtech:'📚', health:'🏥',
    fintech:'💳', agri:'🌾', saas:'⚡', tech:'🚀'
  };
  return emojis[topic]||'🚀';
}

function selectSlides(templates: any[], count: number, type: string) {
  const essential = [0,1,2,3,4,5,6,7];
  const optional = [8,9,10,11,12,13,14,15,16,17];
  
  let selected = [];
  const maxEssential = Math.min(count-1, essential.length);
  selected = essential.slice(0, maxEssential).map(i=>templates[i]);
  
  const remaining = count - selected.length - 1;
  for(let i=0; i<remaining && i<optional.length; i++){
    selected.push(templates[optional[i]]);
  }
  
  selected.push(templates[templates.length-1]);
  return selected.slice(0,count);
}
