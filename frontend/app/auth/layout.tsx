'use client'
import { SpotlightFound } from '@/components/SpotlightFound'
import { isLoggedIn } from '@/lib/verificationToken';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

export default function LayoutAuthentication({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    useEffect(() => {
        if (isLoggedIn()) {
            router.push('/');
        }
    }, [router]);
    return (
        <SpotlightFound>
            <div className='flex items-center justify-center h-full w-full min-h-screen relative z-10'>{children}</div>
        </SpotlightFound>
    )
}
