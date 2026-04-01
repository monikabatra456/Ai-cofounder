import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Video, Users, Search, ChevronLeft, ChevronRight, CheckCircle, XCircle, ExternalLink, Mail, Phone, Linkedin } from 'lucide-react';
import { cn } from '../lib/utils';
import { INVESTORS } from '../constants';
import { Meeting, Investor, User } from '../types';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, deleteDoc, doc, orderBy, setDoc } from 'firebase/firestore';

interface MeetingsSectionProps {
  user: User | null;
}

export const MeetingsSection: React.FC<MeetingsSectionProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'book' | 'calendar' | 'my-meetings'>('book');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [meetingType, setMeetingType] = useState<'virtual' | 'offline'>('virtual');
  const [agenda, setAgenda] = useState('');
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'meetings'),
      where('uid', '==', user.uid),
      orderBy('date', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const meetingsData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Meeting[];
      setMeetings(meetingsData);
    }, (error) => {
      console.error('Firestore Error (Meetings):', error);
    });

    return () => unsubscribe();
  }, [user]);

  const filteredInvestors = INVESTORS.filter(inv => {
    const matchesSearch = inv.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         inv.fund.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inv.focus.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCity = selectedCity === 'All' || inv.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  const handleBookMeeting = async () => {
    if (!selectedInvestor || !selectedTime || !agenda || !user) {
      alert('Please fill all fields');
      return;
    }

    setIsBooking(true);
    
    const meetingDocRef = doc(collection(db, 'meetings'));
    
    const newMeeting: Meeting & { uid: string } = {
      id: meetingDocRef.id,
      uid: user.uid,
      investorId: selectedInvestor.id,
      investorName: selectedInvestor.name,
      investorFund: selectedInvestor.fund,
      investorAvatar: selectedInvestor.initials,
      investorColor: selectedInvestor.color,
      meetingType,
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      duration: '30 mins',
      agenda,
      founderName: user.name || 'Founder',
      founderEmail: user.email || 'founder@example.com',
      startupName: 'My Startup',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      officeAddress: selectedInvestor.officeAddress
    };

    try {
      await setDoc(meetingDocRef, newMeeting);
      alert('Meeting booked successfully! Check "My Meetings" tab.');
      setActiveTab('my-meetings');
      setSelectedInvestor(null);
      setSelectedTime('');
      setAgenda('');
    } catch (error) {
      console.error('Failed to book meeting:', error);
      alert('Failed to book meeting. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const handleDeleteMeeting = async (id: string | number) => {
    if (!window.confirm('Are you sure you want to cancel this meeting?')) return;
    try {
      await deleteDoc(doc(db, 'meetings', String(id)));
    } catch (error) {
      console.error('Failed to delete meeting:', error);
      alert('Failed to cancel meeting.');
    }
  };

  return (
    <div className="max-w-[1100px] mx-auto animate-fade-in pb-20">
      <div className="flex gap-1 bg-[#1F2937] border border-[#1F2937] rounded-xl p-1 mb-8">
        {[
          { id: 'book', label: 'Book Meeting', icon: Users },
          { id: 'calendar', label: 'My Calendar', icon: CalendarIcon },
          { id: 'my-meetings', label: 'My Meetings', icon: Clock }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
              activeTab === tab.id ? "bg-[#111827] text-white shadow-lg" : "text-[#9CA3AF] hover:text-white hover:bg-[#111827]/50"
            )}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'book' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up">
          {/* Left Column: Investor Selector */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-5 flex flex-col h-fit">
            <h3 className="text-white text-base font-bold mb-4 flex items-center gap-2">
              <Users size={18} className="text-[#3B82F6]" />
              Select Investor 👤
            </h3>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={16} />
              <input 
                type="text"
                placeholder="Search by name, fund, or focus..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1F2937] text-white border border-[#374151] rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-[#3B82F6] transition-all"
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {['All', 'Delhi NCR', 'Mumbai', 'Bangalore', 'Hyderabad'].map(city => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-[12px] font-medium transition-all border",
                    selectedCity === city ? "bg-[#3B82F6] text-white border-[#3B82F6]" : "bg-[#1F2937] text-[#9CA3AF] border-[#374151] hover:border-[#3B82F6]/50"
                  )}
                >
                  {city}
                </button>
              ))}
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredInvestors.map(inv => (
                <div 
                  key={inv.id}
                  onClick={() => setSelectedInvestor(inv)}
                  className={cn(
                    "bg-[#1F2937] border rounded-xl p-4 cursor-pointer transition-all hover:border-[#374151]",
                    selectedInvestor?.id === inv.id ? "border-[#3B82F6] bg-[#3B82F6]/5" : "border-transparent"
                  )}
                >
                  <div className="flex gap-3 items-center">
                    <div 
                      className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{ backgroundColor: inv.color }}
                    >
                      {inv.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-bold truncate">{inv.name}</div>
                      <div className="text-[#9CA3AF] text-xs truncate">{inv.fund}</div>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <span className="bg-[#1E3A5F] text-[#60A5FA] text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">📹 Online</span>
                      <span className="bg-[#064E3B] text-[#6EE7B7] text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">🤝 Office</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {inv.focus.map(f => (
                      <span key={f} className="bg-[#111827] text-[#9CA3AF] text-[10px] px-2 py-0.5 rounded-md border border-[#374151]">{f}</span>
                    ))}
                    <span className="bg-[#064E3B]/20 text-[#6EE7B7] text-[10px] px-2 py-0.5 rounded-md border border-[#064E3B]/30 ml-auto">{inv.distance}</span>
                  </div>

                  {selectedInvestor?.id === inv.id && (
                    <div className="mt-4 pt-4 border-t border-[#374151] animate-fade-in">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[#9CA3AF] text-xs">
                          <MapPin size={14} className="text-[#3B82F6]" />
                          <span className="truncate">{inv.officeAddress}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#3B82F6] text-xs cursor-pointer hover:underline">
                          <Mail size={14} />
                          <span>{inv.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#9CA3AF] text-xs">
                          <Phone size={14} className="text-[#3B82F6]" />
                          <span>+91 98765 43210</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#3B82F6] text-xs cursor-pointer hover:underline">
                          <Linkedin size={14} />
                          <span>linkedin.com/in/{inv.name.toLowerCase().replace(' ', '')}</span>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-[#9CA3AF] text-[10px] font-bold uppercase">Available:</span>
                        <div className="flex gap-1">
                          {['Mon', 'Wed', 'Fri'].map(d => (
                            <span key={d} className="bg-[#064E3B] text-[#6EE7B7] text-[9px] px-1.5 py-0.5 rounded font-bold">{d}</span>
                          ))}
                        </div>
                      </div>
                      <div className="mt-1 text-[#9CA3AF] text-[10px] flex items-center gap-1">
                        <Clock size={10} className="text-[#3B82F6]" />
                        10:00 AM - 01:00 PM
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Booking Form */}
          <div className="space-y-6">
            <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6">
              <h3 className="text-white text-base font-bold mb-5 flex items-center gap-2">
                <CalendarIcon size={18} className="text-[#F59E0B]" />
                Select Date & Time 📅
              </h3>

              <div className="grid grid-cols-7 gap-1 mb-6">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <div key={i} className="text-center text-[#6B7280] text-[10px] font-bold py-1 uppercase">{d}</div>
                ))}
                {Array.from({ length: 31 }).map((_, i) => {
                  const day = i + 1;
                  const isToday = day === new Date().getDate();
                  const isSelected = day === selectedDate.getDate();
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        const newDate = new Date();
                        newDate.setDate(day);
                        setSelectedDate(newDate);
                      }}
                      className={cn(
                        "aspect-square flex items-center justify-center text-sm rounded-lg transition-all",
                        isSelected ? "bg-[#3B82F6] text-white font-bold" : 
                        isToday ? "bg-[#1F2937] text-[#3B82F6] border border-[#3B82F6]/30" : "text-[#9CA3AF] hover:bg-[#1F2937]"
                      )}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-4">
                <label className="block text-[12px] text-[#9CA3AF] font-bold uppercase tracking-wider">Available Slots</label>
                <div className="grid grid-cols-3 gap-2">
                  {['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM'].map(time => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={cn(
                        "py-2.5 rounded-xl text-xs font-medium border transition-all",
                        selectedTime === time ? "bg-[#3B82F6] text-white border-[#3B82F6]" : "bg-[#1F2937] text-[#9CA3AF] border-[#374151] hover:border-[#3B82F6]/50"
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6">
              <h3 className="text-white text-base font-bold mb-5 flex items-center gap-2">
                <Video size={18} className="text-[#10B981]" />
                Meeting Details 📝
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-[12px] text-[#9CA3AF] mb-2 font-bold uppercase tracking-wider">Meeting Type</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setMeetingType('virtual')}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold border transition-all",
                        meetingType === 'virtual' ? "bg-[#3B82F6]/10 border-[#3B82F6] text-white" : "bg-[#1F2937] border-[#374151] text-[#9CA3AF]"
                      )}
                    >
                      <Video size={14} />
                      Virtual
                    </button>
                    <button
                      onClick={() => setMeetingType('offline')}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold border transition-all",
                        meetingType === 'offline' ? "bg-[#3B82F6]/10 border-[#3B82F6] text-white" : "bg-[#1F2937] border-[#374151] text-[#9CA3AF]"
                      )}
                    >
                      <MapPin size={14} />
                      In-Person
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] text-[#9CA3AF] mb-2 font-bold uppercase tracking-wider">Meeting Agenda</label>
                  <textarea 
                    rows={3}
                    value={agenda}
                    onChange={(e) => setAgenda(e.target.value)}
                    placeholder="What would you like to discuss? (e.g. Seed round pitch, Product feedback)"
                    className="w-full bg-[#1F2937] text-white border border-[#374151] rounded-xl p-4 text-sm outline-none focus:border-[#3B82F6] transition-all resize-none"
                  />
                </div>

                <button
                  onClick={handleBookMeeting}
                  disabled={isBooking || !selectedInvestor || !selectedTime}
                  className="w-full h-[54px] bg-[#3B82F6] text-white font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isBooking ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      Confirm Booking
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-8 animate-fade-in">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-2xl font-bold text-white">April 2026</h3>
              <p className="text-[#9CA3AF] text-sm mt-1">You have {meetings.length} meetings scheduled this month</p>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 bg-[#1F2937] border border-[#374151] rounded-xl text-white flex items-center justify-center hover:bg-[#374151]">
                <ChevronLeft size={20} />
              </button>
              <button className="w-10 h-10 bg-[#1F2937] border border-[#374151] rounded-xl text-white flex items-center justify-center hover:bg-[#374151]">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px bg-[#1F2937] border border-[#1F2937] rounded-xl overflow-hidden">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="bg-[#0D1117] py-3 text-center text-[#6B7280] text-[11px] font-bold uppercase tracking-widest">{day}</div>
            ))}
            {Array.from({ length: 35 }).map((_, i) => {
              const dayNum = i - 2; // Offset for April 2026 starting on Wednesday
              const isValid = dayNum >= 1 && dayNum <= 30;
              const dateStr = `2026-04-${String(dayNum).padStart(2, '0')}`;
              const dayMeetings = meetings.filter(m => m.date === dateStr);
              
              return (
                <div key={i} className={cn(
                  "bg-[#111827] min-h-[120px] p-3 border-t border-l border-[#1F2937] transition-all",
                  !isValid && "bg-[#0D1117]/50 opacity-30"
                )}>
                  {isValid && (
                    <>
                      <div className={cn(
                        "text-sm font-medium mb-2",
                        dayNum === new Date().getDate() ? "text-[#3B82F6] font-bold" : "text-[#9CA3AF]"
                      )}>
                        {dayNum}
                      </div>
                      <div className="space-y-1">
                        {dayMeetings.map(m => (
                          <div 
                            key={m.id}
                            className="bg-[#1E3A5F] border border-[#3B82F6]/30 rounded-md p-1.5 cursor-pointer hover:bg-[#3B82F6]/20 transition-all group"
                          >
                            <div className="text-[10px] text-white font-bold truncate">{m.investorName}</div>
                            <div className="text-[9px] text-[#60A5FA] flex items-center gap-1 mt-0.5">
                              <Clock size={8} />
                              {m.time}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'my-meetings' && (
        <div className="space-y-4 animate-fade-in">
          {meetings.length === 0 ? (
            <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-20 text-center">
              <div className="w-20 h-20 bg-[#1F2937] rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock size={40} className="text-[#6B7280]" />
              </div>
              <h3 className="text-white text-xl font-bold">No meetings scheduled</h3>
              <p className="text-[#9CA3AF] mt-2 max-w-xs mx-auto">Start by booking a meeting with an investor from the "Book Meeting" tab.</p>
              <button 
                onClick={() => setActiveTab('book')}
                className="mt-8 px-8 py-3 bg-[#3B82F6] text-white font-bold rounded-xl hover:bg-blue-600 transition-all"
              >
                Find Investors
              </button>
            </div>
          ) : (
            meetings.map(meeting => (
              <div key={meeting.id} className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center group hover:border-[#374151] transition-all">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-lg"
                  style={{ backgroundColor: meeting.investorColor }}
                >
                  {meeting.investorAvatar}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-white text-lg font-bold truncate">{meeting.investorName}</h4>
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
                      meeting.status === 'confirmed' ? "bg-[#064E3B] text-[#6EE7B7]" : "bg-[#7F1D1D] text-[#FCA5A5]"
                    )}>
                      {meeting.status}
                    </span>
                  </div>
                  <p className="text-[#9CA3AF] text-sm mb-3">{meeting.investorFund} • {meeting.duration}</p>
                  
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-[#E5E7EB] text-sm">
                      <CalendarIcon size={14} className="text-[#3B82F6]" />
                      {new Date(meeting.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2 text-[#E5E7EB] text-sm">
                      <Clock size={14} className="text-[#3B82F6]" />
                      {meeting.time}
                    </div>
                    <div className="flex items-center gap-2 text-[#E5E7EB] text-sm">
                      {meeting.meetingType === 'virtual' ? (
                        <><Video size={14} className="text-[#10B981]" /> Virtual Meeting</>
                      ) : (
                        <><MapPin size={14} className="text-[#F59E0B]" /> {meeting.officeAddress}</>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                  {meeting.meetingType === 'virtual' && (
                    <button className="flex-1 md:flex-none px-5 py-2.5 bg-[#1E3A5F] text-[#60A5FA] rounded-xl text-sm font-bold hover:bg-[#254a7a] transition-all flex items-center justify-center gap-2">
                      <ExternalLink size={16} />
                      Join
                    </button>
                  )}
                  <button 
                    onClick={() => handleDeleteMeeting(meeting.id)}
                    className="flex-1 md:flex-none px-5 py-2.5 bg-[#1F2937] text-[#EF4444] border border-[#374151] rounded-xl text-sm font-bold hover:bg-[#2d1b1b] hover:border-[#EF4444]/30 transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle size={16} />
                    Cancel
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
