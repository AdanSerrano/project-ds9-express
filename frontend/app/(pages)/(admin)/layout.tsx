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

    if (loading) return (<div className="text-white">Loading...</div>);

    if (user?.role !== 'ADMIN') {
        notFound() || router.push(`${user?.role === 'ADMIN' ? '/sales' : '/payments'}`);
    }

    return (
        <>
            {children}
        </>
    );
}
