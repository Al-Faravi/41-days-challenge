"use client";

import { useEffect, useState } from "react";
import { Check, X, RefreshCw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// টাইপ ডিক্লেয়ারেশন
type DayStatus = 'success' | 'failed' | 'pending';
interface Attempt {
  id: number;
  name: string;
  days: DayStatus[];
  isFailed: boolean;
}

export default function StreakGrid() {
  const [history, setHistory] = useState<Attempt[]>([]);
  const [isCurrentFailed, setIsCurrentFailed] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    loadJourneyData();
  }, []);

  // ডাটাবেস থেকে আসল ডেটা টেনে আনার ম্যাজিক ফাংশন
  const loadJourneyData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    // ১. প্রোফাইল থেকে বর্তমান Attempt বের করা
    const { data: profile } = await supabase
      .from('profiles')
      .select('current_attempt')
      .eq('id', session.user.id)
      .single();
    
    const currentAttemptNum = profile?.current_attempt || 1;

    // ২. এই ইউজারের জীবনের সব লগ নিয়ে আসা
    const { data: logs } = await supabase
      .from('daily_logs')
      .select('*')
      .eq('user_id', session.user.id)
      .order('log_date', { ascending: true });

    // ৩. লগগুলোকে Attempt অনুযায়ী আলাদা করা (Grouping)
    const attemptsMap = new Map<number, any[]>();
    for (let i = 1; i <= currentAttemptNum; i++) attemptsMap.set(i, []); 
    
    logs?.forEach(log => {
      const attemptNum = log.attempt_number || 1;
      if (attemptsMap.has(attemptNum)) {
        attemptsMap.get(attemptNum)?.push(log);
      }
    });

    const parsedHistory: Attempt[] = [];
    let currentFailed = false;

    // ৪. উল্টো দিক থেকে লুপ চালানো (যাতে Current Journey শুরুতে থাকে)
    for (let i = currentAttemptNum; i >= 1; i--) {
      const attemptLogs = attemptsMap.get(i) || [];
      const days: DayStatus[] = Array(41).fill('pending');
      let hasRelapse = false;

      attemptLogs.forEach((log, index) => {
        if (index < 41) {
          if (log.is_relapse) {
            days[index] = 'failed';
            hasRelapse = true;
          } else {
            days[index] = 'success';
          }
        }
      });

      if (i === currentAttemptNum && hasRelapse) currentFailed = true;

      parsedHistory.push({
        id: i,
        name: i === currentAttemptNum ? "Current Journey" : `Attempt ${i}`,
        days: days,
        isFailed: hasRelapse
      });
    }

    setHistory(parsedHistory);
    setIsCurrentFailed(currentFailed);
    setLoading(false);
  };

  // 🚀 নতুন জার্নি শুরু করার সেই ফাংশনটি!
  const handleRestartJourney = async () => {
    setIsRestarting(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('current_attempt')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        // Attempt Number ১ বাড়িয়ে দেওয়া হলো
        await supabase
          .from('profiles')
          .update({ current_attempt: profile.current_attempt + 1 })
          .eq('id', session.user.id);
          
        alert("New Journey Initiated! Rise and rewire.");
        window.location.reload(); // পেজ রিলোড দিলে সব নতুন হয়ে যাবে
      }
    }
    setIsRestarting(false);
  };

  if (loading) {
    return <div className="animate-pulse text-challenge-sage text-center text-sm py-10 font-bold tracking-widest">SYNCING GRID...</div>;
  }

  return (
    <div className="w-full space-y-4">
      <h2 className="text-sm font-extrabold text-challenge-sage tracking-widest uppercase px-1">
        41-Days Journey Map
      </h2>
      
      {/* Horizontal Swipe Container */}
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 hide-scrollbar">
        {history.map((attempt, index) => (
          <div 
            key={attempt.id} 
            className={`min-w-[90%] md:min-w-full snap-center rounded-3xl p-5 border-2 ${
              index === 0 ? 'bg-[#051726]/80 border-challenge-brown/50 shadow-2xl' : 'bg-black/60 border-red-900/30 opacity-75'
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className={`font-bold text-sm tracking-wide ${index === 0 ? 'text-challenge-cream' : 'text-gray-500'}`}>
                {attempt.name}
              </h3>
              {attempt.isFailed && <span className="text-xs bg-red-900/30 text-red-500 px-2 py-1 rounded-md font-bold">FAILED</span>}
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

      {/* 🔴 যদি বর্তমান জার্নি ফেইল করে, তবে রিস্টার্ট বাটন ভেসে উঠবে */}
      {isCurrentFailed && (
        <div className="mt-4 text-center animate-in slide-in-from-bottom-4 duration-500">
          <button 
            onClick={handleRestartJourney}
            disabled={isRestarting}
            className="w-full flex items-center justify-center gap-2 bg-red-950/80 border border-red-500/50 hover:bg-red-900 text-red-100 font-black tracking-widest text-sm py-4 rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isRestarting ? 'animate-spin' : ''}`} />
            {isRestarting ? "INITIALIZING..." : "INITIATE NEW JOURNEY"}
          </button>
        </div>
      )}
    </div>
  );
}