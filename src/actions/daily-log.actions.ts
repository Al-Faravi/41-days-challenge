"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveDailyLog(tasks: any) {
  try {
    const supabase = await createClient();
    
    // FIX: getUser() এর বদলে getSession() ব্যবহার করা হলো (No Network Timeout)
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session?.user) {
      console.error("Auth error in Server Action:", authError);
      return { success: false, error: "Authentication failed. Please login again." };
    }

    const user = session.user;

    // Accurate Bangladesh Timezone Date (YYYY-MM-DD)
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka' }).format(new Date());

    const payload: any = {
      user_id: user.id,
      log_date: today,
      prayers_5_waqt: tasks.prayers_5_waqt,
      no_porn: tasks.no_porn,
      no_masturbation: tasks.no_masturbation,
      nafal_prayer: tasks.nafal_prayer,
      quran_reading: tasks.quran_reading,
      walk_minutes: tasks.walk_minutes,
    };

    const { error: dbError } = await supabase
      .from('daily_logs')
      .upsert(payload, { onConflict: 'user_id, log_date' });

    if (dbError) {
      console.error("Database Save Error:", dbError);
      return { success: false, error: dbError.message };
    }

    // ড্যাশবোর্ড রিফ্রেশ করার জন্য
    revalidatePath('/'); 
    
    return { success: true };
    
  } catch (error: any) {
    console.error("Server Action Crashed:", error.message);
    return { success: false, error: error.message || "Unknown server error occurred." };
  }
}