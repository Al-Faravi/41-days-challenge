"use client";

import { createClient } from "@/lib/supabase/client";

export async function getChallengeStatus() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) return null;

  // আজকের তারিখ (বাংলাদেশ সময় অনুযায়ী)
  const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka' }).format(new Date());
  const todayDate = new Date(todayStr);

  const { data: profile } = await supabase.from('profiles').select('current_attempt').eq('id', session.user.id).single();
  const currentAttemptNum = profile?.current_attempt || 1;

  // বর্তমান জার্নির সবগুলো লগ ডেট অনুযায়ী নিয়ে আসা
  const { data: logs } = await supabase
    .from('daily_logs')
    .select('log_date')
    .eq('user_id', session.user.id)
    .eq('attempt_number', currentAttemptNum)
    .order('log_date', { ascending: true });

  let pendingDateStr = todayStr;
  let currentDay = 1;
  let isUpToDate = false;

  if (logs && logs.length > 0) {
    const lastLogDateStr = logs[logs.length - 1].log_date;
    const lastLogDate = new Date(lastLogDateStr);

    // পরবর্তী এক্সপেক্টেড তারিখ = শেষ লগের তারিখ + ১ দিন
    const nextExpectedDate = new Date(lastLogDate);
    nextExpectedDate.setDate(nextExpectedDate.getDate() + 1);
    
    pendingDateStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka' }).format(nextExpectedDate);

    // যদি পরবর্তী এক্সপেক্টেড তারিখ আজকের চেয়ে বড় হয়, তার মানে সে আপ-টু-ডেট!
    if (nextExpectedDate > todayDate) {
      isUpToDate = true;
      currentDay = logs.length;
    } else {
      currentDay = logs.length + 1; // যে দিনের ফর্ম পূরণ করতে হবে
    }
  }

  return {
    currentDay,
    pendingDateStr, // যে তারিখের ফর্মটা এখন ইউজারকে দেখাতে হবে
    isUpToDate,
    todayStr
  };
}