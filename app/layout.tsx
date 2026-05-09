import type { Metadata } from "next";
import "./globals.css";
import React from 'react'
import Footer from './components/Footer'

export const metadata: Metadata = {
  title: "E2EBin",
  description: "End-to-end encrypted pastebin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <main className="flex-1">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}