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
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    useEffect(() => {
        const fetchUser = async () => {
            const userData = currentUser();
            setUser(userData);
            setLoading(false);
        };
        fetchUser();
    }, []);
    useEffect(() => {
        if (!isLoggedIn()) {
            router.push('/auth/login');
        }
    }, [router]);

    if (loading) return (<div className="text-white">Loading...</div>);

    return (
        <>
            {children}
        </>
    );
}
