import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/layout/Navbar";
import LoginModalRenderer from "../components/layout/LoginModalRenderer";
import PasswordResetModalRenderer from "../components/layout/PasswordResetModalRenderer";
import { QueryProvider } from "../components/providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Secure Payments | Google OAuth & Stripe Integration",
  description: "Manage your account, subscriptions, and payments securely with Google OAuth and Stripe integration",
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
        <QueryProvider>
          <Navbar />
          {children}
          <LoginModalRenderer />
          <PasswordResetModalRenderer />
        </QueryProvider>
      </body>
    </html>
  );
}
