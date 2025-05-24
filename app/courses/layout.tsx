// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import NavBar from "../component/NavBar";
import Header from "../component/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <NavBar />
      </body>
    </html>
  );
}
