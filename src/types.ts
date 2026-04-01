export interface Competitor {
  name: string;
  description: string;
  weakness: string;
}

export interface SWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface PitchSlide {
  number: number;
  title: string;
  content: string;
  bulletPoints: string[];
  speakerNotes: string;
  emoji?: string;
  layoutType?: 'title' | 'bullets' | 'stats' | 'split' | 'thankyou';
  stats?: { value: string; label: string }[];
}

export interface AnalysisResult {
  id?: string;
  uid?: string;
  startupName: string;
  oneLiner: string;
  marketSize: string;
  marketGrowth: string;
  tamSamSom?: {
    tam: string;
    sam: string;
    som: string;
  };
  marketTrends?: string[];
  barriersToEntry?: string[];
  regulatoryLandscape?: string;
  customerPainPoints?: string[];
  opportunityScore: number;
  targetCustomer: string;
  revenueModel: string;
  fundingStage: string;
  competitors: Competitor[];
  swot: SWOT;
  pitchSlides: PitchSlide[];
  investorEmail: {
    subject: string;
    body: string;
  };
  city?: string;
  createdAt?: string;
}

export interface Investor {
  id: number;
  name: string;
  fund: string;
  city: string;
  area: string;
  focus: string[];
  email: string;
  initials: string;
  color: string;
  lat: number;
  lng: number;
  distance: string;
  officeAddress: string;
}

export interface Meeting {
  id: number | string;
  uid?: string;
  investorId: number;
  investorName: string;
  investorFund: string;
  investorAvatar: string;
  investorColor: string;
  meetingType: 'virtual' | 'offline';
  date: string;
  time: string;
  duration: string;
  agenda: string;
  platform?: string;
  meetLink?: string;
  founderName: string;
  founderEmail: string;
  startupName: string;
  officeAddress?: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
}

export interface PPTTheme {
  bg: string;
  title: string;
  text: string;
  accent: string;
  card: string;
  subtitle: string;
}

export interface PPTSlide {
  slideNumber: number;
  layoutType: string;
  emoji: string;
  title: string;
  subtitle: string;
  content: string;
  bulletPoints: string[];
  stats: { value: string; label: string }[];
  speakerNotes: string;
}

export interface PPTData {
  presentationTitle: string;
  subtitle: string;
  fundingAsk: string;
  presenter: string;
  theme: PPTTheme;
  themeName: string;
  slideCount: number;
  slides: PPTSlide[];
}

export interface User {
  uid: string;
  name: string | null;
  email: string | null;
  photo: string | null;
}
