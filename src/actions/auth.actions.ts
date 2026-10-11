"use server";

import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error) return { success: false, error: error.message };
  
  // সার্ভার কুকি সেভ করেছে, এবার ক্লায়েন্টকে সাকসেস সিগন্যাল দিচ্ছি
  return { success: true, session: data.session };
}

export async function signup(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });
  
  if (error) return { success: false, error: error.message };
  
  // প্রোফাইল তৈরি করা
  if (data.user) {
    const profilePayload: any = { id: data.user.id, email: data.user.email };
    await supabase.from('profiles').insert(profilePayload);
  }
  
  return { success: true, session: data.session };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}