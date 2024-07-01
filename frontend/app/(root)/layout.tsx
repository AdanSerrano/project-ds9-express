'use client'
import { FloatingNav } from "@/components/ui/FloatingNavbar";
import { Footer } from "@/components/Footer";
import { navItems } from "@/data";

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-screen overflow-hidden flex items-center flex-col">
      <FloatingNav navItems={navItems} />
      {children}
      <Footer />
    </div>
  );
}
