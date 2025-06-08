import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "./component/sessionProvider";
import { Providers } from "./redux/provider";
// import { ToastContainer } from "react-toastify";
import Toaster from "./component/Toaster";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cape",
  description: "cape is web application for education",
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
        <Providers>
          <SessionProvider>
            {children}
            <Toaster />
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}
