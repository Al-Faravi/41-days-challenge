import EmergencyFab from "@/components/features/emergency-fab";
import LogoutButton from "@/components/ui/logout-button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col relative pb-24 w-full">
      
      {/* Top Header */}
      <header className="w-full flex justify-between items-center p-4 border-b border-challenge-brown/20 bg-[#051726]/80 backdrop-blur-md sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-challenge-brown/20 rounded-full border border-challenge-brown/50 flex items-center justify-center shadow-inner">
            <span className="text-challenge-cream font-black text-xs">41</span>
          </div>
          <span className="font-black text-challenge-cream tracking-widest text-sm uppercase">The Rewire</span>
        </div>
        
        {/* ক্লায়েন্ট-সাইড লগআউট বাটন */}
        <LogoutButton />
      </header>

      {/* Main Content Area (পেজের আসল ডেটা এখানে বসবে) */}
      <main className="flex-1 w-full">
        {children}
      </main>
      
      {/* Floating Emergency Button */}
      <EmergencyFab />
      
    </div>
  );
}