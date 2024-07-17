import { FaceIcon, InstagramLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons"
import { Button } from "./ui/button"
import Link from "next/link"
import Image from "next/image"

export const Footer = () => {
    return (
        <footer className="max-w-7xl py-10 mx-auto">
            <div className="flex flex-col-reverse gap-10 md:flex-row items-center justify-between px-10">

                <div className="w-fit">
                    <p className="text-sm text-center text-gray-400">
                        Todos los derechos reservados<span className="text-purple-500 font-medium"> ©{new Date().getFullYear()} <span className="text-white">PAY</span>SALES</span>
                    </p>
                </div>
                <div className="flex flex-row items-center justify-center gap-3">
                    {items.map((item, index) => (
                        <Button className="border text-gray-400" variant={'ghost'} size={'icon'} asChild key={index}>
                            <Link href={item.href}>
                                <Image
                                    src={item.icon}
                                    alt="icon"
                                    width={20}
                                    height={20}
                                />
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
        href: '#',
        icon: '/linkedin.svg'
    },
    {
        href: '#',
        icon: '/github.svg'
    },
    {
        href: '#',
        icon: '/instagram.svg'
    },
    {
        href: '#',
        icon: '/twitter.svg'
    },
    {
        href: '#',
        icon: '/whatsapp.svg'
    },
]