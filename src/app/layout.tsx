import type { Metadata } from "next";
import "@/app/globals.css"; // গ্লোবাল সিএসএস ইমপোর্ট

export const metadata: Metadata = {
  title: "41-Days Rewire",
  description: "Secure your journey and rewire your mind.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#051726] text-white min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  );
}