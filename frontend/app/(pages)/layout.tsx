'use client'
import { FloatingNav } from "@/components/ui/FloatingNavbar";
import { Footer } from "@/components/Footer";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/verificationToken";
import { useEffect } from "react";
import { navItems } from "@/data";
import { NabarComponent } from "@/components/Nabar";
import { MaxWidthWrappper } from "@/components/MaxWidthWrapper";

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
      <NabarComponent />
      {children}
      <Footer />
    </>
  );
}
