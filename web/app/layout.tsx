import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import BottomNav from "@/components/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dublin House Renting",
  description: "Find your next home in Dublin!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full min-w-full">
        <AuthProvider>
          <div className="flex flex-col h-dvh md:h-auto">
            <div className="flex-1 min-h-0 overflow-y-auto md:overflow-visible">
              {children}
            </div>
            <BottomNav />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
