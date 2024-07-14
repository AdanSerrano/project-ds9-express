'use client'

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "./ui/breadcrumb"

import Link from "next/link"
import React from "react"
import { usePathname } from "next/navigation"

interface BreadCrumbProps {
    links: {
        name: string
        href: string
    }[]
}

export const BreadCrumb = ({ links }: BreadCrumbProps) => {
    const pathname = usePathname()

    return (
        <Breadcrumb className="mb-2">
            <BreadcrumbList>
                {
                    links.map((link, index) => (
                        <React.Fragment key={index}>
                            <BreadcrumbItem key={index}>
                                <BreadcrumbLink asChild>
                                    <Link className={`text-white/50 transition hover:underline hover:text-white/80 ${pathname === link.href && '!text-purple-500'}`} href={link.href}>{link.name}</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className={`${index === links.length - 1 && 'hidden'}`} />
                        </React.Fragment>
                    ))
                }
            </BreadcrumbList>
        </Breadcrumb>
    )
}
