'use client'

import { Cross2Icon, PersonIcon } from '@radix-ui/react-icons'

import Link from 'next/link'

interface HeaderProps {
    label: string
}

export const Header = ({ label }: HeaderProps) => {
    return (

        <section className='w-full flex flex-col items-center justify-center gap-y-4 relative'>
            <h1>
                Ingresa tus datos
            </h1>
            <p className='text-muted-foreground text-sm'>
                {label}
            </p>
        </section>
    )
}
