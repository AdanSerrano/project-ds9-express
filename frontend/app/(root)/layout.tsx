'use client'
import { FloatingNav } from "@/components/ui/FloatingNavbar";
import { Footer } from "@/components/Footer";
import { navItems } from "@/data";
import { NabarComponent } from "@/components/Nabar";

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-screen overflow-hidden flex items-center flex-col">
      <NabarComponent />
      {children}
      <Footer />
    </div>
  );
}
