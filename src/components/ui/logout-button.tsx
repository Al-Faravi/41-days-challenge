"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault(); // ফর্ম বা অন্য কোনো ডিফল্ট অ্যাকশন ব্লক করবে
    setIsLoggingOut(true);
    
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      
      // লোকাল স্টোরেজ ক্লিয়ার করে একদম ফ্রেশভাবে লগইনে পাঠাবে
      localStorage.clear();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="text-challenge-sage hover:text-red-400 transition-colors flex items-center gap-1.5 text-xs font-bold bg-black/30 px-3 py-1.5 rounded-lg border border-transparent hover:border-red-900/50 disabled:opacity-50"
    >
      <span>{isLoggingOut ? "WAIT..." : "LOGOUT"}</span>
      <LogOut className="w-3.5 h-3.5" />
    </button>
  );
}