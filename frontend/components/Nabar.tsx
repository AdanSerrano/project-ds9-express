import React, { use, useEffect, useState } from 'react'
import { MaxWidthWrappper } from './MaxWidthWrapper'
import Link from 'next/link'
import { Button, buttonVariants } from './ui/button'
import { useRouter } from 'next/navigation'
import { currentUser, isLoggedIn, LogoutClick } from '@/lib/verificationToken'
import axios from 'axios'
import { apiUrl } from '@/lib/api-url'
import { User } from '@/interface'

export const NabarComponent = () => {
    const [isLoggedin, setIsLoggedin] = useState(false)
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter()

    useEffect(() => {
        setUser(currentUser());
    }, []);


    useEffect(() => {
        setIsLoggedin(isLoggedIn())
    }, [router]);

    const onLogout = () => {
        LogoutClick()
        router.push('/auth/login')
        router.refresh()
        setIsLoggedin(false)
    }

    return (
        <nav className='sticky z-[20] h-14 inset-x-0 top-0 border-b border-b-white-100 backdrop-blur-lg transition-all w-full'>
            <MaxWidthWrappper>
                <div className='flex h-14 items-center justify-between text-white'>
                    <Link href={'/'} className='flex z-40 font-semibold text-lg '>
                        PAY<span className='text-purple-500'>SALES</span>
                    </Link>

                    <div className='h-full flex items-center justify-between sm:space-x-4'>
                        {!isLoggedin ? (
                            <>
                                <Link
                                    href={'/auth/login'}
                                    className={buttonVariants({
                                        size: 'sm',
                                        variant: 'ghost'
                                    })}>
                                    Ingresar
                                </Link>
                                <Link
                                    href={'/auth/register'}
                                    className={buttonVariants({
                                        size: 'sm',
                                        variant: 'ghost'
                                    })}>
                                    Registrarse
                                </Link>
                                <div className="h-8 w-px bg-white-100 hidden sm:block" />
                                <Link
                                    href={'/sales'}
                                    className={buttonVariants({
                                        size: 'sm',
                                        variant: 'ghost'
                                    })}>
                                    Pagar factura
                                </Link>
                            </>
                        ) : (
                            <>
                                {user?.role === 'ADMIN' ? (
                                    <>
                                        <Link
                                            href={'/users'}
                                            className={buttonVariants({
                                                size: 'sm',
                                                variant: 'ghost'
                                            })}>
                                            Usuarios
                                        </Link>
                                        <Link
                                            href={'/clients'}
                                            className={buttonVariants({
                                                size: 'sm',
                                                variant: 'ghost'
                                            })}>
                                            Clientes
                                        </Link>
                                        <Link
                                            href={'/sales'}
                                            className={buttonVariants({
                                                size: 'sm',
                                                variant: 'ghost'
                                            })}>
                                            Facturas
                                        </Link>
                                        <Link
                                            href={'/dashboard'}
                                            className={buttonVariants({
                                                size: 'sm',
                                                variant: 'ghost'
                                            })}>
                                            Dashboard
                                        </Link>
                                    </>
                                ) : (
                                    <Link
                                        href={'/dashboard/orders'}
                                        className={buttonVariants({
                                            size: 'sm',
                                            variant: 'ghost'
                                        })}>
                                        Facturas
                                    </Link>
                                )}
                                <div className="h-8 w-px bg-white-100 hidden sm:block" />
                                <Button onClick={onLogout} variant="ghost" className="border text-sm font-medium relative border-neutral-200 border-white/[0.2] text-white px-4 py-2 rounded-full">
                                    Cerrar
                                    <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px" />
                                </Button>
                            </>
                        )}
                    </div>
                </div>


            </MaxWidthWrappper>
        </nav>
    )
}
