"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function EmergencyFab() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Pulse Effect Animation */}
      <div className="absolute inset-0 bg-red-600 rounded-full animate-ping opacity-75"></div>
      
      <Link 
        href="/emergency"
        className="relative flex items-center justify-center w-16 h-16 bg-red-600 text-white rounded-full shadow-2xl border-2 border-red-800 hover:bg-red-700 active:scale-95 transition-all"
        title="Emergency Panic Button"
      >
        <ShieldAlert className="w-8 h-8" />
      </Link>
    </div>
  );
}