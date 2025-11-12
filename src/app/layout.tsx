import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Poppins, Roboto, DM_Sans, Outfit, Sora } from "next/font/google";
import "./globals.css";
import Navbar from "../components/layout/Navbar";
import { Navbar as NewNavbar } from "../features/Navigation";
import LoginModalRenderer from "../components/layout/LoginModalRenderer";
import PasswordResetModalRenderer from "../components/layout/PasswordResetModalRenderer";
import UserModalRenderer from "../components/layout/UserModalRenderer";
import { QueryProvider } from "../components/providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
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
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${poppins.variable} ${roboto.variable} ${dmSans.variable} ${outfit.variable} ${sora.variable} antialiased`}
      >
        <div className="min-w-[280px] overflow-x-hidden">
          <QueryProvider>
            <Navbar />
            <NewNavbar />
            {children}
            <LoginModalRenderer />
            <PasswordResetModalRenderer />
            <UserModalRenderer />
          </QueryProvider>
        </div>
      </body>
    </html>
  );
}
