'use client'
import { BreadCrumb } from '@/components/BreadCrumb'
import { Sale } from '@/interface'
import { apiUrl } from '@/lib/api-url'
import { getToken } from '@/lib/verificationToken'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

export default function SalesNotIsPaid() {
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
        {
            name: 'Facturas no pagadas',
            href: `/dashboard/orders/salesNotIsPaid`
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

    return (
        <section className="mt-10 mb-16 px-2 sm:px-4 max-w-6xl mx-auto">
            <BreadCrumb links={links} />
            <h1 className="text-4xl mt-12 mb-4 font-bold tracking-tight lg:text-5xl text-white-200">Facturas no pagadas</h1>
            <div className="lg:flex justify-between items-center space-y-4 lg:space-y-0">
            </div>
            <div className='grid grid-cols-4 gap-2 items-center justify-center my-10'>
                {salesNotIsPayment?.map((sale) => (
                    <div key={sale.id} className="bg-white p-4 rounded-lg shadow-md">
                        <p>Id: {sale.id}</p>
                        <p>Cliente: {sale.clients?.name}</p>
                        <p>Fecha de Venta: {sale.saleDate}</p>
                        <p>Id de Factura: {sale.invoiceId}</p>
                        <p>Total de Venta: {sale.TotalSale}</p>
                        <p>Pagado: {sale.isPayment ? 'Si' : 'No'}</p>
                    </div>
                ))}
            </div>
        </section>

    )
}
