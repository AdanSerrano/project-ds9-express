'use client'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { BackButton } from './BackButton'
import { Header } from './Header'


// import { Suspense } from 'react'
// import { Social } from '@/components/auth/Social'


interface CardWrapperProps {
    children: React.ReactNode
    headerLabel: string
    backButtonLabel: string
    backButtonHref: string
}

export const CardWrapper = ({
    children,
    headerLabel,
    backButtonLabel,
    backButtonHref,
}: CardWrapperProps) => {
    return (
        <Card className='w-[400px] shadow-lg relative overflow-hidden'>
            <CardHeader className='relative z-50'>
                <Header label={headerLabel} />
            </CardHeader>
            <CardContent className='relative z-50'>
                {children}
            </CardContent>
            {/* {showSocial && (
                <CardFooter>
                    <Suspense fallback={<SearchBarFallback />}>
                        <Social />
                    </Suspense>
                </CardFooter>
            )} */}

            <CardFooter>
                <BackButton
                    label={backButtonLabel}
                    href={backButtonHref}
                />
            </CardFooter>
            {/* <Meteors number={50} className='absolute z-10' /> */}
        </Card>
    )
}

const SearchBarFallback = () => {
    return <>placeholder</>
}