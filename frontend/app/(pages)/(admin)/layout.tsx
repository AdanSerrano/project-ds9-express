'use client'
import { notFound, useRouter } from "next/navigation";
import { currentUser } from "@/lib/verificationToken";
import { useEffect, useState } from "react";
import { User } from "@/interface";

export default function PageLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        setUser(currentUser());
    }, []);

    if (user?.role !== 'ADMIN') {
        notFound()
    }

    return (
        <>
            {children}
        </>
    );
}
