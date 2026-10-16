"use client";

import { useEffect, useState } from "react";
import { getChallengeStatus } from "@/actions/challenge.actions";
import TaskChecklist from "@/components/features/task-checklist";
import StreakGrid from "@/components/features/streak-grid";

export default function DashboardPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadStatus() {
      const data = await getChallengeStatus();
      setStatus(data);
      setLoading(false);
    }
    loadStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-challenge-sage font-bold animate-pulse tracking-widest">
        SYNCING WITH VAULT...
      </div>
    );
  }

  // ডেটা না আসলে সেফটি চেক
  if (!status) return null;

  // ডেট সুন্দর করে দেখানোর জন্য (যেমন: Oct 14, 2026)
  const displayDate = new Date(status.pendingDateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const isBacklog = status.pendingDateStr !== status.todayStr;

  return (
    <div className="max-w-md mx-auto p-6 animate-in fade-in duration-500 space-y-8">
      
      {/* ডায়নামিক Day Header */}
      <div className="flex flex-col items-center justify-center mt-2 mb-6">
        <h1 className="text-5xl font-black text-challenge-cream tracking-widest drop-shadow-[0_0_15px_rgba(234,224,200,0.2)]">
          DAY {status.currentDay.toString().padStart(2, '0')}
        </h1>
        <p className="text-sm font-bold text-challenge-sage uppercase tracking-widest mt-2 text-center">
          OF 41 DAYS REWIRE
          {/* 🚀 যদি পেছনের দিনের ফর্ম পূরণ করে, তবে লাল রঙের সতর্কতা দেখাবে */}
          {!status.isUpToDate && isBacklog && (
            <span className="block text-red-400 mt-1 text-[10px]">
              LOGGING PENDING DATE: {displayDate}
            </span>
          )}
        </p>
      </div>

      {/* কন্ডিশনাল রেন্ডারিং: আজকের টাস্ক বা সাকসেস মেসেজ */}
      {status.isUpToDate ? (
        <div className="bg-green-900/20 border border-green-500/30 p-8 rounded-3xl text-center shadow-[0_0_30px_rgba(34,197,94,0.1)] backdrop-blur-sm">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🛡️</span>
          </div>
          <h2 className="text-2xl font-black text-green-400 mb-2 tracking-wide uppercase">Vault Secured</h2>
          <p className="text-green-200/70 text-sm font-medium leading-relaxed">
            All protocols are up to date.<br/>
            Come back tomorrow!
          </p>
        </div>
      ) : (
        // 🚀 আজকে কমপ্লিট না করে থাকলে চেকলিস্ট দেখাবে এবং pendingDateStr পাস করবে
        <TaskChecklist pendingDateStr={status.pendingDateStr} />
      )}

      {/* 🚀 41-Days Journey Map (StreakGrid) */}
      <div className="pt-6 border-t border-challenge-brown/20 mt-8">
        <StreakGrid />
      </div>

    </div>
  );
}