"use client";

import { useEffect, useState, useRef } from "react";
import { Check, X, RefreshCw, CalendarDays, ShieldAlert, ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type DayStatus = 'success' | 'failed' | 'pending';
interface Attempt {
  id: number;
  name: string;
  startDate: string | null;
  endDate: string | null;
  daysSurvived: number;
  days: DayStatus[];
  isFailed: boolean;
}

export default function StreakGrid() {
  const [history, setHistory] = useState<Attempt[]>([]);
  const [isCurrentFailed, setIsCurrentFailed] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [loading, setLoading] = useState(true);

  // স্ক্রলিং কন্ট্রোল করার জন্য Ref
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    loadJourneyData();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const loadJourneyData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const { data: profile } = await supabase.from('profiles').select('current_attempt').eq('id', session.user.id).single();
    const currentAttemptNum = profile?.current_attempt || 1;

    const { data: logs } = await supabase.from('daily_logs').select('*').eq('user_id', session.user.id).order('log_date', { ascending: true });

    const attemptsMap = new Map<number, any[]>();
    for (let i = 1; i <= currentAttemptNum; i++) attemptsMap.set(i, []); 
    
    logs?.forEach(log => {
      const attemptNum = log.attempt_number || 1;
      if (attemptsMap.has(attemptNum)) attemptsMap.get(attemptNum)?.push(log);
    });

    const parsedHistory: Attempt[] = [];
    let currentFailed = false;

    for (let i = currentAttemptNum; i >= 1; i--) {
      const attemptLogs = attemptsMap.get(i) || [];
      const days: DayStatus[] = Array(41).fill('pending');
      let hasRelapse = false;
      let survivedCount = 0;

      attemptLogs.forEach((log, index) => {
        if (index < 41) {
          if (log.is_relapse) { days[index] = 'failed'; hasRelapse = true; } 
          else { days[index] = 'success'; survivedCount++; }
        }
      });

      const startDate = attemptLogs.length > 0 ? formatDate(attemptLogs[0].log_date) : null;
      const endDate = attemptLogs.length > 0 ? formatDate(attemptLogs[attemptLogs.length - 1].log_date) : null;

      if (i === currentAttemptNum && hasRelapse) currentFailed = true;

      parsedHistory.push({
        id: i,
        name: i === currentAttemptNum ? "Current Journey" : `Attempt ${i}`,
        startDate,
        endDate: (i === currentAttemptNum && !hasRelapse) ? "Present" : endDate,
        daysSurvived: survivedCount,
        days: days,
        isFailed: hasRelapse
      });
    }

    setHistory(parsedHistory);
    setIsCurrentFailed(currentFailed);
    setLoading(false);
  };

  const handleRestartJourney = async () => {
    setIsRestarting(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      const { data: profile } = await supabase.from('profiles').select('current_attempt').eq('id', session.user.id).single();
      if (profile) {
        await supabase.from('profiles').update({ current_attempt: profile.current_attempt + 1 }).eq('id', session.user.id);
        alert("New Journey Initiated! Rise and rewire.");
        window.location.reload();
      }
    }
    setIsRestarting(false);
  };

  // 🚀 ডানে-বামে স্ক্রল করার ফাংশন
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) return <div className="animate-pulse text-challenge-sage text-center text-sm py-10 font-bold tracking-widest">SYNCING GRID...</div>;

  return (
    <div className="w-full space-y-4">
      
      {/* 🚀 Header with Navigation Buttons */}
      <div className="flex justify-between items-center px-1 mb-2">
        <h2 className="text-sm font-extrabold text-challenge-sage tracking-widest uppercase">
          Journey Records
        </h2>
        
        {/* < > Buttons */}
        <div className="flex gap-2">
          <button 
            onClick={() => scroll('left')} 
            className="p-1.5 bg-black/50 border border-challenge-brown/30 rounded-lg hover:bg-challenge-brown/20 text-challenge-cream transition-colors active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={() => scroll('right')} 
            className="p-1.5 bg-black/50 border border-challenge-brown/30 rounded-lg hover:bg-challenge-brown/20 text-challenge-cream transition-colors active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Horizontal Swipe Container (with Ref) */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 hide-scrollbar scroll-smooth"
      >
        {history.map((attempt, index) => (
          <div 
            key={attempt.id} 
            className={`min-w-[92%] md:min-w-full snap-center rounded-3xl p-5 border-2 transition-all ${
              index === 0 && !attempt.isFailed ? 'bg-[#051726]/90 border-challenge-brown/50 shadow-2xl' : 
              attempt.isFailed ? 'bg-red-950/20 border-red-900/30 opacity-80' : 
              'bg-black/60 border-challenge-brown/20 opacity-80'
            }`}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className={`font-black text-lg tracking-wide flex items-center gap-2 ${index === 0 && !attempt.isFailed ? 'text-challenge-cream' : 'text-gray-400'}`}>
                  {attempt.name}
                  {attempt.isFailed && <ShieldAlert className="w-4 h-4 text-red-500" />}
                </h3>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-challenge-sage mt-1.5">
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>{attempt.startDate ? `${attempt.startDate} - ${attempt.endDate}` : "Awaiting first log"}</span>
                </div>
              </div>

              <div className="text-right">
                {attempt.isFailed ? (
                  <span className="text-[10px] bg-red-900/30 text-red-500 px-2 py-1 rounded-md font-bold block mb-1 border border-red-500/20">FAILED</span>
                ) : index === 0 ? (
                  <span className="text-[10px] bg-green-900/30 text-green-500 px-2 py-1 rounded-md font-bold block mb-1 border border-green-500/20">ACTIVE</span>
                ) : null}
                <span className={`text-[10px] font-bold ${attempt.isFailed ? 'text-red-400/70' : 'text-challenge-brown'}`}>
                  Survived: {attempt.daysSurvived} Days
                </span>
              </div>
            </div>

            {/* 41 Boxes Grid */}
            <div className="grid grid-cols-7 gap-1.5 md:gap-2">
              {attempt.days.map((status, i) => (
                <div 
                  key={i}
                  className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold border transition-all ${
                    status === 'success' ? 'bg-green-500/20 border-green-500/40 text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.2)]' :
                    status === 'failed' ? 'bg-red-500/20 border-red-500/40 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' :
                    'bg-black/40 border-challenge-brown/20 text-challenge-sage/30'
                  }`}
                >
                  {status === 'success' && <Check strokeWidth={4} className="w-4 h-4 md:w-5 md:h-5" />}
                  {status === 'failed' && <X strokeWidth={4} className="w-4 h-4 md:w-5 md:h-5" />}
                  {status === 'pending' && <span>{i + 1}</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isCurrentFailed && (
        <div className="mt-2 text-center animate-in slide-in-from-bottom-4 duration-500 pb-4">
          <button onClick={handleRestartJourney} disabled={isRestarting} className="w-full flex items-center justify-center gap-2 bg-red-950/80 border border-red-500/50 hover:bg-red-900 text-red-100 font-black tracking-widest text-sm py-4 rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all disabled:opacity-50">
            <RefreshCw className={`w-5 h-5 ${isRestarting ? 'animate-spin' : ''}`} />
            {isRestarting ? "INITIALIZING..." : "INITIATE NEW JOURNEY"}
          </button>
        </div>
      )}
    </div>
  );
}