"use client";

import { createClient } from "@/lib/supabase/client";

export async function getChallengeStatus() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) return null;

  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka' }).format(new Date());

  // FIX: .single() এর বদলে .maybeSingle() ব্যবহার করা হয়েছে (0 row পেলেও ক্র্যাশ করবে না)
  const { data: firstLog } = await supabase
    .from('daily_logs')
    .select('log_date')
    .eq('user_id', session.user.id)
    .order('log_date', { ascending: true })
    .limit(1)
    .maybeSingle();

  const { data: todayLog } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('log_date', today)
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