"use client";

import { useState } from "react";
import { CheckCircle2, Circle, AlertTriangle, Save } from "lucide-react";
import { useChallengeStore } from "@/store/challenge-store";
import { createClient } from "@/lib/supabase/client";

// 🚀 প্যারেন্ট থেকে pendingDateStr রিসিভ করা হচ্ছে
export default function TaskChecklist({ pendingDateStr }: { pendingDateStr: string }) {
  const { tasks, toggleTask, setWalkMinutes, resetTasks } = useChallengeStore();
  const [isSaving, setIsSaving] = useState(false);
  
  const supabase = createClient();

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        alert("Authentication missing! Redirecting to login...");
        window.location.href = "/login";
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('current_attempt')
        .eq('id', session.user.id)
        .single();
        
      const currentAttempt = profile?.current_attempt || 1;

      // Mandatory টাস্ক মিস করেছে কিনা চেক করা (যেকোনো একটা false হলেই Relapse!)
      const isRelapse = !tasks.prayers_5_waqt || !tasks.no_porn || !tasks.no_masturbation;

      const payload: any = {
        user_id: session.user.id,
        log_date: pendingDateStr, // 🚀 আজকের বদলে আটকে থাকা তারিখটা (Pending Date) সেভ হবে
        attempt_number: currentAttempt, 
        is_relapse: isRelapse, 
        prayers_5_waqt: tasks.prayers_5_waqt,
        no_porn: tasks.no_porn,
        no_masturbation: tasks.no_masturbation,
        nafal_prayer: tasks.nafal_prayer,
        quran_reading: tasks.quran_reading,
        walk_minutes: tasks.walk_minutes,
      };

      const { error } = await supabase
        .from('daily_logs')
        .upsert(payload, { onConflict: 'user_id, log_date' });

      if (error) {
        alert("Failed to save: " + error.message);
      } else {
        if (isRelapse) {
          // 🔴 ফেইল করেছে! সাথে সাথে নতুন জার্নি শুরু (Attempt + 1)
          await supabase.from('profiles').update({ current_attempt: currentAttempt + 1 }).eq('id', session.user.id);
          alert(`PROTOCOL BREACHED ON ${pendingDateStr}. \nAttempt Failed. Initiating New Journey.`);
        }
        
        resetTasks();
        window.location.reload(); 
      }
      
    } catch (error: any) {
      alert("System error: Could not reach the Vault.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Mandatory Section */}
      <div className="bg-black/80 border-l-4 border-l-red-600 border-y border-r border-challenge-brown/30 rounded-r-2xl p-4 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h3 className="font-extrabold text-red-500 tracking-wide">MANDATORY TASKS</h3>
        </div>

        <div className="space-y-3">
          {[
            { key: "prayers_5_waqt", label: "৫ ওয়াক্ত নামাজ" },
            { key: "no_porn", label: "No-Porn" },
            { key: "no_masturbation", label: "No-Masturbation" },
          ].map((task) => (
            <button
              key={task.key}
              onClick={() => toggleTask(task.key as any)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#0A2947]/50 border border-challenge-brown/20 hover:bg-[#0A2947] transition-all"
            >
              <span className={`font-bold ${tasks[task.key as keyof typeof tasks] ? 'text-challenge-sage line-through' : 'text-challenge-cream'}`}>
                {task.label}
              </span>
              {tasks[task.key as keyof typeof tasks] ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : (
                <Circle className="w-6 h-6 text-challenge-sage" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Secondary Section */}
      <div className="bg-black/60 border-l-4 border-l-green-500 border-y border-r border-challenge-brown/30 rounded-r-2xl p-4 shadow-lg">
        <h3 className="font-extrabold text-green-500 tracking-wide mb-4">SCORE BOOSTERS</h3>

        <div className="space-y-3">
          {[
            { key: "nafal_prayer", label: "নফল নামাজ (অন্তত ৪ রাকাত)" },
            { key: "quran_reading", label: "কুরআন তিলাওয়াত" },
          ].map((task) => (
            <button
              key={task.key}
              onClick={() => toggleTask(task.key as any)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#0A2947]/50 border border-challenge-brown/20 hover:bg-[#0A2947] transition-all"
            >
              <span className={`font-bold ${tasks[task.key as keyof typeof tasks] ? 'text-challenge-sage line-through' : 'text-challenge-cream'}`}>
                {task.label}
              </span>
              {tasks[task.key as keyof typeof tasks] ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : (
                <Circle className="w-6 h-6 text-challenge-sage" />
              )}
            </button>
          ))}
          
          {/* Walking Slider */}
          <div className="p-4 rounded-xl bg-[#0A2947]/50 border border-challenge-brown/20 mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-challenge-cream">হাঁটা / Physical Activity</span>
              <span className="font-bold text-blue-400">{tasks.walk_minutes} min</span>
            </div>
            <input 
              type="range" min="0" max="60" step="5"
              value={tasks.walk_minutes}
              onChange={(e) => setWalkMinutes(Number(e.target.value))}
              className="w-full accent-blue-500 h-2 bg-black rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Smart & Minimal Save Button */}
      <div className="flex justify-center pt-2">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full max-w-[220px] bg-gradient-to-r from-challenge-brown/80 to-challenge-brown border border-yellow-700/50 hover:brightness-110 text-white font-bold py-3 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(139,94,60,0.3)] disabled:opacity-50 text-sm tracking-widest"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "SAVING..." : "LOG PROGRESS"}
        </button>
      </div>

    </div>
  );
}