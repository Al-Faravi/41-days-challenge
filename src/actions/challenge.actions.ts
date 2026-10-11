"use client";

import { createClient } from "@/lib/supabase/client";

export async function getChallengeStatus() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) return null;

  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka' }).format(new Date());

  // ১. বর্তমান Attempt Number আনা
  const { data: profile } = await supabase
    .from('profiles')
    .select('current_attempt')
    .eq('id', session.user.id)
    .single();
    
  const currentAttemptNum = profile?.current_attempt || 1;

  // ২. শুধুমাত্র বর্তমান Attempt-এর প্রথম লগ বের করা (যাতে নতুন জার্নিতে Day 1 থেকে শুরু হয়)
  const { data: firstLog } = await supabase
    .from('daily_logs')
    .select('log_date')
    .eq('user_id', session.user.id)
    .eq('attempt_number', currentAttemptNum)
    .order('log_date', { ascending: true })
    .limit(1)
    .maybeSingle();

  // ৩. আজকে লগ করেছে কিনা (বর্তমান Attempt-এ)
  const { data: todayLog } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('log_date', today)
    .eq('attempt_number', currentAttemptNum)
    .maybeSingle();

  let currentDay = 1;

  if (firstLog) {
    const start = new Date(firstLog.log_date);
    const current = new Date(today);
    const diffTime = current.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    currentDay = diffDays >= 0 ? diffDays + 1 : 1;
  }

  return {
    currentDay,
    isTodayLogged: !!todayLog,
    todayLogData: todayLog || null,
  };
}