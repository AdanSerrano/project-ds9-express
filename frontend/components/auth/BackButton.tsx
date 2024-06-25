'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"

interface BackButtonProps {
    label: string
    href: string
}

export const BackButton = ({ label, href }: BackButtonProps) => {
    return (
        <Button
            asChild
            className="w-full font-normal text-gray-500"
            size={'sm'}
            variant={'link'}
        >
            <Link href={href} className="text-left">
                {label}
            </Link>
        </Button>
    )
}
