'use client'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"

import { ArrowRight } from "lucide-react"
import { HamburgerMenuIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import { Separator } from "./ui/separator"
import { Button, buttonVariants } from "./ui/button"
import { useEffect, useState } from "react"
import { currentUser, isLoggedIn, LogoutClick } from "@/lib/verificationToken"
import { useRouter } from "next/navigation"
import { User } from "@/interface"

export const SheetNav = () => {
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
        <Sheet>
            <SheetTrigger className="cursor-pointer" asChild>
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full text-sm flex items-center justify-center">
                    <HamburgerMenuIcon className="h-4 w-4" />
                </div>
            </SheetTrigger>
            <SheetContent className="inline-flex focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none rounded-l-2xl p-2 sm:p-4">
                <SheetHeader className="w-full">
                    <SheetTitle className="relative flex flex-col gap-4 items-center justify-center my-3">
                        <Link href={'/'} className='flex z-40 font-semibold text-lg'>
                            Fesa<span className='text-blue-800'>Store</span>
                        </Link>

                        <Separator />

                    </SheetTitle>
                    <SheetDescription>
                        {!isLoggedin ? (
                            <div className="flex flex-col items-start justify-center gap-2">
                                <SheetClose asChild>
                                    <Link
                                        href={'/auth/login'}
                                        className={buttonVariants({
                                            size: 'sm',
                                            variant: 'ghost'
                                        })}>
                                        Ingresar
                                    </Link>
                                </SheetClose>
                                <SheetClose asChild>
                                    <Link
                                        href={'/auth/register'}
                                        className={buttonVariants({
                                            size: 'sm',
                                            variant: 'ghost'
                                        })}>
                                        Registrarse
                                    </Link>
                                </SheetClose>
                                <SheetClose asChild>
                                    <Link
                                        href={'/sales'}
                                        className={buttonVariants({
                                            size: 'sm',
                                            variant: 'ghost'
                                        })}>
                                        Pagar factura
                                    </Link>
                                </SheetClose>
                            </div>
                        ) : (
                            <>
                                {user?.role === 'ADMIN' ? (
                                    <div className="flex flex-col items-start p-0">
                                        <SheetClose asChild>
                                            <Link
                                                href={'/users'}
                                                className={buttonVariants({
                                                    size: 'sm',
                                                    variant: 'ghost'
                                                })}>
                                                Usuarios
                                            </Link>
                                        </SheetClose>
                                        <SheetClose asChild>
                                            <Link
                                                href={'/clients'}
                                                className={buttonVariants({
                                                    size: 'sm',
                                                    variant: 'ghost'
                                                })}>
                                                Clientes
                                            </Link>
                                        </SheetClose>
                                        <SheetClose asChild>
                                            <Link
                                                href={'/sales'}
                                                className={buttonVariants({
                                                    size: 'sm',
                                                    variant: 'ghost'
                                                })}>
                                                Facturas
                                            </Link>
                                        </SheetClose>
                                        <Link
                                            href={'/dashboard'}
                                            className={buttonVariants({
                                                size: 'sm',
                                                variant: 'ghost'
                                            })}>
                                            Dashboard
                                        </Link>
                                        <SheetClose asChild>
                                            <Link
                                                href={'/sales'}
                                                className={buttonVariants({
                                                    size: 'sm',
                                                    variant: 'ghost'
                                                })}>
                                                Facturas
                                            </Link>
                                        </SheetClose>
                                    </div>
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
                                <Button onClick={onLogout} variant="ghost" size={'sm'}>
                                    Logout
                                </Button>
                            </>

                        )}
                    </SheetDescription>
                </SheetHeader>
            </SheetContent >
        </Sheet >
    )
}
