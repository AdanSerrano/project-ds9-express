'use client'
import { FloatingNav } from "@/components/ui/FloatingNavbar";
import { navItems } from "@/data";
import { Footer } from "@/components/Footer";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/verificationToken";
import { useEffect } from "react";

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter()
  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/auth/login');
    } else {
      router.push('/');
    }
  }, [router]);
  return (
    <>
      <FloatingNav navItems={navItems} />
      {children}
      <Footer />
    </>
  );
}
