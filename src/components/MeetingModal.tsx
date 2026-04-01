import React, { useState, useEffect } from 'react';
import { X, Video, MapPin, CheckCircle2, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Investor, Meeting, User } from '../types';
import { INVESTORS } from '../constants';
import { cn } from '../lib/utils';
import { db } from '../lib/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
}

interface MeetingModalProps {
  investorId: number | null;
  user: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const MeetingModal: React.FC<MeetingModalProps> = ({ investorId, user, onClose, onSuccess }) => {
  const [meetingType, setMeetingType] = useState<'virtual' | 'offline'>('virtual');
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [duration, setDuration] = useState('30 min');
  const [isScheduled, setIsScheduled] = useState(false);
  const [meetingDetails, setMeetingDetails] = useState<Meeting | null>(null);

  const [formData, setFormData] = useState({
    founderName: user?.name || '',
    founderEmail: user?.email || '',
    startupName: '',
    agenda: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        founderName: user.name || '',
        founderEmail: user.email || ''
      }));
    }
  }, [user]);

  if (investorId === null) return null;
  const investor = INVESTORS.find(inv => inv.id === investorId)!;

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "2:00 PM", "3:00 PM",
    "4:00 PM", "5:00 PM", "6:00 PM"
  ];

  const handleSchedule = async () => {
    if (!selectedTime || !formData.founderName || !formData.founderEmail || !user) {
      alert('Please fill in all required fields.');
      return;
    }

    const meetId = Math.random().toString(36).substr(2, 8);
    const meetLink = `https://meet.google.com/${meetId}`;
    
    const meetingDocRef = doc(collection(db, 'meetings'));
    
    const newMeeting: Meeting & { uid: string } = {
      id: meetingDocRef.id,
      uid: user.uid,
      investorId: investor.id,
      investorName: investor.name,
      investorFund: investor.fund,
      investorAvatar: investor.initials,
      investorColor: investor.color,
      meetingType,
      date: days[selectedDate].toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
      time: selectedTime,
      duration,
      agenda: formData.agenda,
      platform: meetingType === 'virtual' ? 'Google Meet' : undefined,
      meetLink: meetingType === 'virtual' ? meetLink : undefined,
      founderName: formData.founderName,
      founderEmail: formData.founderEmail,
      startupName: formData.startupName,
      officeAddress: investor.officeAddress,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(meetingDocRef, newMeeting);
      setMeetingDetails(newMeeting);
      setIsScheduled(true);
      onSuccess();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'meetings');
      alert('Failed to schedule meeting. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-[1000] p-5 overflow-y-auto">
      <div className="card max-w-[560px] w-full p-8 max-h-[90vh] overflow-y-auto animate-scale-in relative">
        <button onClick={onClose} className="absolute right-6 top-6 text-text-muted hover:text-white transition-colors">
          <X size={24} />
        </button>

        {isScheduled ? (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-success/10 border-2 border-success rounded-full mx-auto flex items-center justify-center text-4xl animate-scale-in">
              ✅
            </div>
            <h2 className="text-2xl font-bold mt-6">Meeting Scheduled! 🎉</h2>
            <div className="mt-6 bg-bg-input rounded-xl p-5 text-left border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: investor.color }}>
                  {investor.initials}
                </div>
                <div>
                  <p className="text-sm font-bold">{investor.name}</p>
                  <p className="text-xs text-text-muted">{investor.fund}</p>
                </div>
              </div>
              <div className="flex gap-4 text-sm text-gray-300">
                <p>📅 {meetingDetails?.date}</p>
                <p>⏰ {meetingDetails?.time}</p>
              </div>
              {meetingType === 'virtual' && (
                <div className="mt-4 p-3 bg-accent/10 border border-accent/20 rounded-lg flex items-center justify-between">
                  <span className="text-xs text-accent font-medium truncate mr-2">{meetingDetails?.meetLink}</span>
                  <button onClick={() => window.open(meetingDetails?.meetLink, '_blank')} className="text-accent text-xs font-bold whitespace-nowrap">Join Link</button>
                </div>
              )}
            </div>
            <button onClick={onClose} className="btn-primary w-full mt-8">Close</button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6">Schedule a Meeting 📅</h2>
            
            <div className="bg-bg-input rounded-xl p-4 flex items-center gap-3 mb-8 border border-border">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: investor.color }}>
                {investor.initials}
              </div>
              <div>
                <p className="text-sm font-bold">{investor.name}</p>
                <p className="text-xs text-text-muted">{investor.fund}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs text-text-muted uppercase font-bold tracking-widest mb-3">Meeting Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setMeetingType('virtual')}
                    className={cn(
                      "p-5 rounded-xl border-2 text-center transition-all",
                      meetingType === 'virtual' ? "border-accent bg-accent/10" : "border-border bg-bg-input"
                    )}
                  >
                    <div className="text-3xl mb-2">📹</div>
                    <p className="text-sm font-bold">Virtual Meeting</p>
                    <p className="text-[10px] text-text-muted mt-1">Google Meet link milega</p>
                  </button>
                  <button 
                    onClick={() => setMeetingType('offline')}
                    className={cn(
                      "p-5 rounded-xl border-2 text-center transition-all",
                      meetingType === 'offline' ? "border-success bg-success/10" : "border-border bg-bg-input"
                    )}
                  >
                    <div className="text-3xl mb-2">🤝</div>
                    <p className="text-sm font-bold">In-Person</p>
                    <p className="text-[10px] text-text-muted mt-1">Investor ke office mein</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs text-text-muted uppercase font-bold tracking-widest mb-3">Date Chuno</label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {days.map((d, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(i)}
                      className={cn(
                        "px-5 py-2.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all",
                        selectedDate === i ? "bg-accent text-white border-accent" : "bg-bg-input text-text-muted border-border-hover"
                      )}
                    >
                      {i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' })}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-text-muted uppercase font-bold tracking-widest mb-3">Time Chuno</label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={cn(
                        "py-3 rounded-xl text-xs font-medium border transition-all",
                        selectedTime === time ? "bg-accent/15 text-accent border-accent" : "bg-bg-input text-white border-border-hover"
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <input 
                  placeholder="Tumhara naam"
                  value={formData.founderName}
                  onChange={(e) => setFormData({...formData, founderName: e.target.value})}
                  className="w-full input-field"
                />
                <input 
                  placeholder="tumhara@email.com"
                  value={formData.founderEmail}
                  onChange={(e) => setFormData({...formData, founderEmail: e.target.value})}
                  className="w-full input-field"
                />
                <textarea 
                  placeholder="Kya discuss karna chahte ho investor se? Apna idea, traction, aur funding need batao..."
                  rows={3}
                  value={formData.agenda}
                  onChange={(e) => setFormData({...formData, agenda: e.target.value})}
                  className="w-full input-field resize-none"
                />
              </div>

              {meetingType === 'offline' && (
                <div className="bg-bg-input rounded-xl p-4 border border-border">
                  <p className="text-xs text-text-muted uppercase font-bold tracking-widest mb-2">Office Address</p>
                  <p className="text-sm text-white">📍 {investor.officeAddress}</p>
                  <p className="text-xs text-text-muted mt-1">{investor.area}</p>
                </div>
              )}

              <button 
                onClick={handleSchedule}
                className="w-full btn-primary h-14 text-lg"
              >
                Schedule Meeting 📅
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
