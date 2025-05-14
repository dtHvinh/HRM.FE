import { AuthContextProvider } from "@/context/AuthProvider";
import { MantineProvider } from "@mantine/core";
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import type { Metadata } from "next";
import { DM_Sans, Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HRM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthContextProvider>
          <MantineProvider>
            <Toaster />
            {children}
          </MantineProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
