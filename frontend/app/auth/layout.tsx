import { SpotlightFound } from '@/components/SpotlightFound'
import React from 'react'

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <SpotlightFound>
            <div className='flex items-center justify-center h-full w-full min-h-screen relative z-10'>{children}</div>
        </SpotlightFound>
    )
}
