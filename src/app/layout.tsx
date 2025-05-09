import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { initDatabase } from "@/lib/db";
import "./globals.css";

try {
  initDatabase();
} catch (error) {
  console.error("Error initializing database:", error);
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sql App",
  description: "Sql App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
