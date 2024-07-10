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
                const token = sessionStorage.getItem('token');
                const response = await axios.get(`${apiUrl}/api/sales`, {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                });
                setSales(response.data);
            } catch (error) {
                console.log('error fetching data', error)
            }
        }
        fetchData();
    }, [])


    const formattedProducts: SalesColumns[] = sales?.map((item) => ({
        id: item.id,
        clientId: item.clients?.name,
        saleDate: format(new Date(item.saleDate), "MMMM do, yyyy", { locale: es }),
        details: item.details?.length,
        clients: item.clients?.name,
    })) || [];

    return (
        <div className="flex-col min-h-screen bg-black h-full w-full">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SalesClient data={formattedProducts} />
            </div>
        </div>
    )
}
