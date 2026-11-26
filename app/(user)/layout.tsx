import type { Metadata } from "next";
import "../globals.css";
import LenisProvider from "../components/client/layout/LenisProvider";
import Footer from "../components/client/layout/Footer";
import Header from "../components/client/layout/Header";
import IntroAnimation from "../components/client/animations/IntroAnimation";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";
import { getHeaderFooter } from "@/lib/services/headerFooter.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Brighton",
  description: "Architectural Lighting, Engineered.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerFooter = await getHeaderFooter();

  return (
    <div style={{ overflow: "hidden" }} className={`h-full antialiased`}>
      <div className="min-h-full flex flex-col">
        <LenisProvider>
          <IntroAnimation />
          <Suspense fallback={null}>
            <Header data={headerFooter?.header} />
          </Suspense>
          {children}
          <Footer data={headerFooter?.footer} />
        </LenisProvider>
        <Toaster />
      </div>
    </div>
  );
}
