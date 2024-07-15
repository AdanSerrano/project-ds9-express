'use client'
import { BreadCrumb } from '@/components/BreadCrumb'
import { CardSales } from '@/components/CardSales'
import { MaxHeigthOrder } from '@/components/MaxHeigthOrder'
import { MaxWidthWrappper } from '@/components/MaxWidthWrapper'
import { SalesNavigation } from '@/components/SalesNavigation'
import { Sale } from '@/interface'
import { apiUrl } from '@/lib/api-url'
import { getToken } from '@/lib/verificationToken'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

export default function OrdersPage() {
    const [salesIsPayment, setSalesIsPayment] = useState<Sale[] | null>([])
    const [salesNotIsPayment, setSalesNotIsPayment] = useState<Sale[] | null>([])
    const links = [
        {
            name: 'Home',
            href: '/'
        },
        {
            name: 'Facturas',
            href: '/dashboard/orders'
        },
    ]

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/sales/isPayment/0`, {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                });
                setSalesNotIsPayment(response.data.data);
            } catch (error) {
                console.log('error fetching data', error)
            }
        }
        fetchData();
    }, [])

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
        <MaxHeigthOrder>
            <BreadCrumb links={links} />
            <h1 className="text-4xl mt-12 mb-4 font-bold tracking-tight lg:text-5xl text-white-200">Facturas</h1>
            <div className="lg:flex justify-between items-center space-y-4 lg:space-y-0">
                <SalesNavigation />
            </div>
            <div className='my-10'>
                <h2 className='text-white'>Facturas Pagadas</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 items-center justify-center my-10'>
                    {salesIsPayment?.map((sale) => (
                        <CardSales isPaid href='/dashboard/orders/salesIsPaid' key={sale.id} sale={sale} image={'/Icono factura pagada.avif'} />
                    ))}
                </div>

                <h2 className='text-white'>Facturas No Pagadas</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 items-center justify-center my-10'>
                    {salesNotIsPayment?.map((sale) => (
                        <CardSales href='/dashboard/orders/salesNotIsPaid' isPaid={false} key={sale.id} sale={sale} />
                    ))}
                </div>
            </div>

        </MaxHeigthOrder>
    )
}
