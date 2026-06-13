import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { QuizProvider } from "@/lib/context";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Toolorna - Find Your Perfect Tool in 60 Seconds",
  description:
    "Answer 4 quick questions. Get 1 perfect AI tool recommendation. Save money with exclusive coupon codes. Built for Indian professionals.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-text-primary font-sans">
        <QuizProvider>{children}</QuizProvider>
      </body>
    </html>
  );
}
