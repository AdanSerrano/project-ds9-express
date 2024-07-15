import { cn } from '@/lib/utils';
import React from 'react'

interface MaxHeigthOrderProps {
    className?: string;
    children: React.ReactNode
}

export const MaxHeigthOrder = ({ className, children }: MaxHeigthOrderProps) => {
    return (
        <div className={cn("mt-10 mb-16 px-2 min-h-[70vh] sm:px-4 max-w-6xl mx-auto", className)}>{children}</div>
    )
}
