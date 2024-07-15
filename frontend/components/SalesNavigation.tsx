'use client'

import { useParams, usePathname } from "next/navigation"
import Link from "next/link"

export const SalesNavigation = () => {

    const pathName = usePathname();
    const params = useParams()

    return (
        <ul className="flex flex-wrap gap-4 text-white/50 text-sm">
            <li>
                <Link className={`transition hover:underline hover:text-white/80 ${(`/dashboard/orders/salesIsPaid` === pathName) && '!text-purple-600'}`} href={`/dashboard/orders/salesIsPaid`}>
                    Pagadas
                </Link>
            </li>
            <li>
                <Link className={`transition hover:underline hover:text-white/80 ${(`/dashboard/orders/salesNotIsPaid` === pathName) && '!text-purple-600'}`} href={`/dashboard/orders/salesNotIsPaid`}>
                    No pagadas
                </Link>
            </li>
        </ul>
    )
}