import type { Metadata } from "next";
import "../globals.css";
import LenisProvider from "../components/client/layout/LenisProvider";
import Footer from "../components/client/layout/Footer";
import Header from "../components/client/layout/Header";
import IntroAnimation from "../components/client/animations/IntroAnimation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Brighton",
  description: "Architectural Lighting, Engineered.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html style={{ overflow: "hidden" }} className={`h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <LenisProvider>
          <IntroAnimation />
          <Suspense fallback={null}>
            <Header />
          </Suspense>
          {children}
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
