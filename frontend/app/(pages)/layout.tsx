import { FloatingNav } from "@/components/ui/FloatingNavbar";
import { navItems } from "@/data";
import { Footer } from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <FloatingNav navItems={navItems} />
      {children}
      <Footer />
    </>
  );
}
