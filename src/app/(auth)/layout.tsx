export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#051726]">
      
      {/* ব্যাকগ্রাউন্ডে হালকা গ্লোয়িং ইফেক্ট (ঐচ্ছিক কিন্তু সুন্দর) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-challenge-brown/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Login Page Content */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        {children}
      </div>
      
    </div>
  );
}