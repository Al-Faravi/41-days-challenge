import type { Metadata, Viewport } from "next";
import "@/app/globals.css";

export const viewport: Viewport = {
  themeColor: "#051726",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "41-Days Rewire",
  description: "Secure your journey and rewire your mind.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/effort.png",     // 🚀 Favicon এর জন্য
    shortcut: "/icons/effort.png", // 🚀 শর্টকাটের জন্য
    apple: "/icons/effort.png",    // 🚀 মোবাইলে অ্যাপ আইকনের জন্য
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "The Rewire",
  },
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