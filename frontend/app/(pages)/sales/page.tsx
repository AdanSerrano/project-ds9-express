'use client'
import { Button } from '@/components/ui/button'
import { Sale } from '@/interface'
import { apiUrl } from '@/lib/api-url'
import { formatter } from '@/lib/utils'
import axios from 'axios'
import { format } from 'date-fns'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { SalesColumns } from './_components/columns'
import { SalesClient } from './_components/client'

export default function SalesPage() {
    const [sales, setSales] = useState<Sale[] | null>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get(`${apiUrl}/api/sales`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (Array.isArray(response.data)) {
                    setSales(response.data);
                    console.log(response.data)
                } else {
                    console.error('Data is not an array:', response.data);
                }
            } catch (error) {
                console.log('error fetching data', error)
            }
        }
        fetchData();
    }, [])


    const formattedProducts: SalesColumns[] = sales?.map((item) => ({
        id: item.id,
        clientId: item.clients?.id,
        saleDate: item.saleDate,
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
