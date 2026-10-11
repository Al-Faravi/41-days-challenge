"use client";

import { useState } from "react";
import { ShieldCheck, Lock, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // সরাসরি ব্রাউজার ক্লায়েন্ট ব্যবহার করা হচ্ছে
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    if (isLogin) {
      // 1. Client-Side Login (ব্রাউজারে সেশন সেভ হবে)
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        setError(error.message);
        setLoading(false);
      } else if (data.session) {
        setSuccess("Authentication successful! Entering vault...");
        setTimeout(() => {
          window.location.href = "/"; 
        }, 500);
      }
    } else {
      // 2. Client-Side Signup
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        if (data.user) {
          const profilePayload: any = { id: data.user.id, email: data.user.email };
          await supabase.from('profiles').insert(profilePayload);
        }
        
        if (data.session) {
          setSuccess("Vault created! Entering...");
          setTimeout(() => {
            window.location.href = "/";
          }, 500);
        } else {
          setSuccess("Vault initialized! Please check your email.");
          setLoading(false);
        }
      }
    }
  };

  return (
    <div className="bg-[#051726]/80 backdrop-blur-xl border border-challenge-brown/30 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-500">
      
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="w-16 h-16 bg-challenge-brown/20 rounded-full flex items-center justify-center mb-4 border border-challenge-brown/50">
          <ShieldCheck className="w-8 h-8 text-challenge-cream" />
        </div>
        <h1 className="text-2xl font-black text-challenge-cream tracking-widest uppercase">
          {isLogin ? "Secured Access" : "Create Vault"}
        </h1>
        <p className="text-sm text-challenge-sage font-bold mt-2">
          Your personal rewiring journey
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm font-bold text-center">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-900/30 border border-green-500/50 text-green-400 p-3 rounded-xl text-sm font-bold text-center">
            {success}
          </div>
        )}

        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-challenge-sage/50" />
            <input 
              name="email" 
              type="email" 
              required 
              placeholder="Email Address"
              className="w-full bg-black/50 border border-challenge-brown/30 text-challenge-cream rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-challenge-brown focus:ring-1 focus:ring-challenge-brown transition-all"
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-challenge-sage/50" />
            <input 
              name="password" 
              type="password" 
              required 
              placeholder="Password"
              className="w-full bg-black/50 border border-challenge-brown/30 text-challenge-cream rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-challenge-brown focus:ring-1 focus:ring-challenge-brown transition-all"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-challenge-cream text-[#051726] font-black tracking-widest py-3.5 rounded-xl mt-6 hover:bg-white transition-all disabled:opacity-50"
        >
          {loading ? "PROCESSING..." : isLogin ? "ENTER SECURE VAULT" : "INITIALIZE PROTOCOL"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button 
          type="button"
          onClick={() => { setIsLogin(!isLogin); setError(null); setSuccess(null); }} 
          className="text-xs font-bold text-challenge-sage hover:text-challenge-cream transition-colors"
        >
          {isLogin ? "First time? Create your vault." : "Already have a vault? Enter here."}
        </button>
      </div>
      
    </div>
  );
}