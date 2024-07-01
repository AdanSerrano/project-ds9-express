'use client'
import { FloatingNav } from "@/components/ui/FloatingNavbar";
import { Footer } from "@/components/Footer";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/verificationToken";
import { useEffect } from "react";
import { navItems } from "@/data";

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter()
  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/auth/login');
    }
  }, [router]);

  return (
    <div className="w-screen overflow-hidden flex items-center flex-col">
      <FloatingNav navItems={navItems} />
      {children}
      <Footer />
    </div>
  );
}
