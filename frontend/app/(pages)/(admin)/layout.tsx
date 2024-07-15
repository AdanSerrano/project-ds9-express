'use client'
import { notFound, useRouter } from "next/navigation";
import { currentUser, isLoggedIn } from "@/lib/verificationToken";
import { useEffect, useState } from "react";
import { User } from "@/interface";

export default function PageLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn()) {
            router.push('/auth/login');
        }
    }, [router]);
    return (
        <>
            {children}
        </>
    );
}
