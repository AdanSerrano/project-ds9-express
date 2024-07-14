'use client'
import { BreadCrumb } from '@/components/BreadCrumb'
import { CardSales } from '@/components/CardSales'
import { MaxHeigthOrder } from '@/components/MaxHeigthOrder'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Sale } from '@/interface'
import { apiUrl } from '@/lib/api-url'
import { formatter } from '@/lib/utils'
import { getToken } from '@/lib/verificationToken'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export default function SalesIsPaid() {
    const [salesIsPayment, setSalesIsPayment] = useState<Sale[] | null>([])
    const links = [
        {
            name: 'Home',
            href: '/'
        },
        {
            name: 'Facturas',
            href: '/dashboard/orders'
        },
        {
            name: 'Facturas pagadas',
            href: `/dashboard/orders/salesIsPaid`
        },
    ]

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/sales/isPayment/1`, {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                });
                setSalesIsPayment(response.data.data);
            } catch (error) {
                console.log('error fetching data', error)
            }
        }
        fetchData();
    }, [])

    return (
        <MaxHeigthOrder className='min-h-[68vh]'>
            <BreadCrumb links={links} />
            <h1 className="text-4xl mt-12 mb-4 font-bold tracking-tight lg:text-5xl text-white-200">Facturas pagadas</h1>
            <div className="lg:flex justify-between items-center space-y-4 lg:space-y-0">
            </div>
            <div className='grid grid-cols-4 gap-2 items-center justify-center my-10'>
                {salesIsPayment?.map((sale) => (
                    <CardSales key={sale.id} sale={sale} image={'/Icono factura pagada.avif'} />
                ))}
            </div>
        </MaxHeigthOrder>
    )
}
