'use client'
import { Sale } from '@/interface'
import { apiUrl } from '@/lib/api-url'
import axios from 'axios'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import React, { useEffect, useState } from 'react'
import { SalesColumns } from './_components/columns'
import { SalesClient } from './_components/client'
import { getToken } from '@/lib/verificationToken'

export default function SalesPage() {
    const [sales, setSales] = useState<Sale[] | null>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/sales`, {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                });
                setSales(response.data.data);
                console.log(response.data.data)
            } catch (error) {
                console.log('error fetching data', error)
            }
        }
        fetchData();
    }, [])
    console.log(sales)

    const formattedProducts: SalesColumns[] = sales?.map((item) => ({
        id: item.id,
        invoiceId: item.invoiceId,
        TotalSale: Number(item.TotalSale),
        saleDate: format(new Date(item.saleDate), "dd MMMM yyyy", { locale: es }),
        details: item.details?.length,
        clients: item.clients?.name,
        Payment: item.Payment,
        PaymentPending: item.PaymentPending,
    })) || [];

    return (
        <div className="flex-col min-h-screen bg-black h-full w-full">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SalesClient data={formattedProducts} />
            </div>
        </div>
    )
}
