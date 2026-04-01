import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { HomeSection } from './components/Home';
import { DashboardSection } from './components/Dashboard';
import { InvestorMapSection } from './components/InvestorMap';
import { EmailComposerSection } from './components/EmailComposer';
import { MeetingsSection } from './components/Meetings';
import { PPTMakerSection } from './components/PPTMaker';
import { InvestorSearchSection } from './components/InvestorSearch';
import { LoadingOverlay } from './components/LoadingOverlay';
import { MeetingModal } from './components/MeetingModal';
import { AuthModal } from './components/AuthModal';
import { analyzeIdea } from './services/aiService';
import { AnalysisResult, User } from './types';
import { cn } from './lib/utils';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from './lib/firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedCity, setSelectedCity] = useState('Delhi NCR');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [selectedInvestorId, setSelectedInvestorId] = useState<number | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData: User = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          photo: firebaseUser.photoURL
        };
        setUser(userData);
        localStorage.setItem('founderai_user', JSON.stringify(userData));
        
        // Sync user profile to Firestore
        try {
          await setDoc(doc(db, 'users', firebaseUser.uid), {
            ...userData,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        } catch (error) {
          console.error('Failed to sync user profile:', error);
        }

        // Load user-specific data from Firestore
        try {
          const q = query(
            collection(db, 'analysisResults'),
            where('uid', '==', firebaseUser.uid),
            orderBy('createdAt', 'desc'),
            limit(1)
          );
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const latestResult = querySnapshot.docs[0]?.data() as AnalysisResult;
            setAnalysisResult(latestResult);
            setSelectedCity(latestResult.city || 'Delhi NCR');
          } else {
            // Fallback to localStorage if Firestore is empty
            const savedResult = localStorage.getItem(`founderai_result_${firebaseUser.uid}`);
            const savedCity = localStorage.getItem(`founderai_city_${firebaseUser.uid}`);
            if (savedResult) setAnalysisResult(JSON.parse(savedResult));
            if (savedCity) setSelectedCity(savedCity || 'Delhi NCR');
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.LIST, 'analysisResults');
        }
      } else {
        setUser(null);
        setAnalysisResult(null);
        localStorage.removeItem('founderai_user');
      }
      
      // Artificial delay for smooth loading screen as requested
      setTimeout(() => {
        setIsAuthLoading(false);
      }, 1500);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      setActiveSection('home');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleGenerate = async (idea: string, city: string) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const result = await analyzeIdea(idea, city);
      const newDocRef = doc(collection(db, 'analysisResults'));
      const resultWithMeta = {
        ...result,
        id: newDocRef.id,
        uid: user.uid,
        city,
        createdAt: new Date().toISOString()
      };
      
      setAnalysisResult(resultWithMeta);
      setSelectedCity(city);
      
      // Save to Firestore
      try {
        await setDoc(newDocRef, resultWithMeta);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'analysisResults');
      }

      localStorage.setItem(`founderai_result_${user.uid}`, JSON.stringify(resultWithMeta));
      localStorage.setItem(`founderai_city_${user.uid}`, city);
      setActiveSection('dashboard');
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('AI error — check your Gemini API key in the environment variables.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookMeeting = (investorId: number) => {
    setSelectedInvestorId(investorId);
  };

  const switchSection = (section: string) => {
    if (!user) return;
    setActiveSection(section);
  };

  if (isAuthLoading) {
    return (
      <div className="fixed inset-0 bg-[#0A0F2C] flex flex-col items-center justify-center z-[10000]">
        <div className="w-16 h-16 bg-[#3B82F6] rounded-2xl flex items-center justify-center text-3xl font-bold text-white animate-pulse shadow-lg shadow-blue-500/20">
          F
        </div>
        <div className="mt-6 text-[#9CA3AF] font-medium animate-pulse">
          Loading FounderAI...
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthModal isOpen={true} />;
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <HomeSection onGenerate={handleGenerate} isLoading={isLoading} user={user} />;
      case 'dashboard':
        return analysisResult ? (
          <DashboardSection 
            result={analysisResult} 
            selectedCity={selectedCity} 
            onNavigate={switchSection}
            onDownloadPPT={() => switchSection('ppt')}
          />
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold">No analysis found</h2>
            <p className="text-text-muted mt-2">Go to Home and generate your co-founder kit first.</p>
            <button onClick={() => switchSection('home')} className="btn-primary mt-6">Go Home</button>
          </div>
        );
      case 'map':
        return (
          <InvestorMapSection 
            selectedCity={selectedCity} 
            onCityChange={setSelectedCity} 
            onBookMeeting={handleBookMeeting}
          />
        );
      case 'email':
        return analysisResult ? (
          <EmailComposerSection result={analysisResult} selectedCity={selectedCity} />
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold">No analysis found</h2>
            <button onClick={() => switchSection('home')} className="btn-primary mt-6">Go Home</button>
          </div>
        );
      case 'meetings':
        return <MeetingsSection user={user} />;
      case 'ppt':
        return <PPTMakerSection />;
      case 'search':
        return <InvestorSearchSection />;
      default:
        return <HomeSection onGenerate={handleGenerate} isLoading={isLoading} user={user} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary text-white">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={switchSection} 
        user={user}
        onSignOut={handleSignOut}
      />
      
      <main className="flex-1 overflow-y-auto p-6 md:p-10 relative">
        <div className="max-w-6xl mx-auto">
          {renderSection()}
        </div>
      </main>

      <LoadingOverlay isVisible={isLoading} />
      
      <MeetingModal 
        investorId={selectedInvestorId} 
        user={user}
        onClose={() => setSelectedInvestorId(null)}
        onSuccess={() => {
          setSelectedInvestorId(null);
          switchSection('meetings');
        }}
      />
    </div>
  );
}
