import { FaceIcon, InstagramLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons"
import { Button } from "./ui/button"
import Link from "next/link"

export const Footer = () => {
    return (
        <footer className="max-w-7xl py-10 mx-auto">
            <div className="flex flex-col-reverse gap-10 md:flex-row items-center justify-between px-10">

                <div className="w-fit">
                    <p className="text-sm sm:text-base text-center text-gray-400">
                        Todos los derechos reservados<span className="text-purple-500"> ©{new Date().getFullYear()} Adán Serrano</span>
                    </p>
                </div>
                <div className="flex flex-row items-center justify-center gap-3">
                    {items.map((item, index) => (
                        <Button className="border text-gray-400" variant={'ghost'} size={'icon'} asChild key={index}>
                            <Link href={item.href}>
                                {item.icon}
                            </Link>
                        </Button>
                    ))
                    }
                </div>
            </div>
        </footer>
    )
}


const items = [
    {
        href: '/',
        icon: <InstagramLogoIcon className="h-5 w-5" />
    },
    {
        href: '/about',
        icon: <FaceIcon className="h-5 w-5" />
    },
    {
        href: '/contact',
        icon: <TwitterLogoIcon className="h-5 w-5" />
    },
    {
        href: '/blog',
        icon: <TwitterLogoIcon className="h-5 w-5" />
    },
    {
        href: '/services',
        icon: <TwitterLogoIcon className="h-5 w-5" />
    },
]