"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertTriangle, ShieldAlert, HeartPulse } from "lucide-react";

// ইসলামিক রিমাইন্ডার (কুরআন ও হাদিস)
const reminders = [
  {
    text: "“আর তোমরা ব্যভিচারের কাছেও যেয়ো না। নিশ্চয়ই এটা অশ্লীল কাজ এবং নিকৃষ্ট পথ।”",
    source: "কুরআন ১৭:৩২"
  },
  {
    text: "“হে যুবসমাজ! তোমাদের মধ্যে যার সামর্থ্য আছে সে যেন বিয়ে করে... আর যার সামর্থ্য নেই সে যেন রোযা রাখে। কেননা, তা যৌন উত্তেজনা প্রশমিত করে।”",
    source: "সহীহ বুখারী ৫০৬৫"
  },
  {
    text: "“আর যে আল্লাহকে ভয় করে, আল্লাহ তার জন্য নিষ্কৃতির পথ বের করে দেবেন।”",
    source: "কুরআন ৬৫:২"
  },
  {
    text: "“আল্লাহর রহমত থেকে নিরাশ হয়ো না। নিশ্চয়ই আল্লাহ সমস্ত গুনাহ মাফ করে দেন।”",
    source: "কুরআন ৩৯:৫৩"
  },
  {
    text: "“নিশ্চয়ই কষ্টের সাথেই রয়েছে স্বস্তি।”",
    source: "কুরআন ৯৪:৫"
  }
];

export default function EmergencyPage() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(60); // ৬০ সেকেন্ডের টাইমার
  const [confirmExit, setConfirmExit] = useState(false);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // ৬০ সেকেন্ডের টাইমার লজিক
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // প্রতি ১২ সেকেন্ড পর পর রিমাইন্ডার পরিবর্তন
  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % reminders.length);
    }, 12000);
    return () => clearInterval(quoteTimer);
  }, []);

  // স্মার্ট ব্যাক বাটন: ভুল করে বের হওয়া ঠেকাতে ডাবল-ক্লিক সিস্টেম
  const handleBack = () => {
    if (!confirmExit) {
      setConfirmExit(true);
      // ৩ সেকেন্ড পর আবার নরমাল ব্যাক বাটন হয়ে যাবে
      setTimeout(() => setConfirmExit(false), 3000); 
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[#051726]">
      
      {/* ব্যাকগ্রাউন্ড গ্লোয়িং ইফেক্ট */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[500px] max-h-[500px] bg-red-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* 🚀 কন্ট্রোলড Back Button (Two-Step Verification) */}
      <div className="absolute top-6 left-6 z-50">
        <button 
          onClick={handleBack}
          className={`flex items-center gap-2 transition-all px-4 py-2.5 rounded-xl border shadow-lg backdrop-blur-md font-bold text-xs tracking-widest uppercase
            ${confirmExit 
              ? 'bg-red-900/80 text-white border-red-500 hover:bg-red-800' 
              : 'bg-black/40 text-challenge-sage border-red-900/30 hover:border-challenge-brown/50 hover:text-white'
            }
          `}
        >
          {confirmExit ? (
            <>
              <ShieldAlert className="w-5 h-5 animate-pulse" />
              <span>Are you sure? Click again</span>
            </>
          ) : (
            <>
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Vault</span>
            </>
          )}
        </button>
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
        
        {/* Breathing Icon */}
        <div className="w-20 h-20 bg-red-950/50 border-2 border-red-500/50 rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
          <HeartPulse className={`w-10 h-10 text-red-500 ${timeLeft > 0 ? 'animate-ping' : ''}`} />
        </div>
        
        <h1 className="text-xl font-black text-challenge-cream tracking-widest mb-2 uppercase">
          Take a deep breath
        </h1>
        <p className="text-challenge-sage text-sm mb-10">
          Do not let 5 seconds of pleasure destroy 41 days of glory.
        </p>

        {/* ⏳ 60-Second Countdown Timer */}
        <div className="mb-12 relative flex items-center justify-center">
          {/* Outer Ring */}
          <svg className="w-48 h-48 transform -rotate-90">
            <circle cx="96" cy="96" r="88" className="stroke-red-900/30" strokeWidth="8" fill="transparent" />
            <circle 
              cx="96" cy="96" r="88" 
              className="stroke-red-500 transition-all duration-1000 ease-linear" 
              strokeWidth="8" fill="transparent" 
              strokeDasharray="553" 
              strokeDashoffset={553 - (553 * timeLeft) / 60} 
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-5xl font-black text-white">{timeLeft}</span>
            <span className="text-xs text-red-400 font-bold tracking-widest uppercase mt-1">Seconds</span>
          </div>
        </div>

        {/* 📖 Dynamic Quran/Hadith Reminder */}
        <div className="bg-black/50 border border-challenge-brown/30 p-6 rounded-2xl w-full min-h-[140px] flex flex-col justify-center items-center shadow-2xl transition-all duration-500">
          <p className="text-challenge-cream text-sm md:text-base font-medium leading-relaxed mb-4 italic">
            {reminders[currentQuoteIndex].text}
          </p>
          <span className="text-xs font-black text-challenge-sage tracking-widest uppercase bg-challenge-brown/20 px-3 py-1 rounded-md">
            {reminders[currentQuoteIndex].source}
          </span>
        </div>

      </div>
    </div>
  );
}