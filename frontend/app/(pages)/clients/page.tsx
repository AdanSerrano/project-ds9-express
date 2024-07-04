'use client'
import { Button } from '@/components/ui/button'
import { Client, Sale } from '@/interface'
import { apiUrl } from '@/lib/api-url'
import { formatter } from '@/lib/utils'
import { format } from 'date-fns'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { ClientsColumns } from './_components/columns'
import { ClientsClient } from './_components/client'
import axios from 'axios'

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[] | null>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get(`${apiUrl}/api/clients`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
                );
                setClients(response.data)
                console.log(response.data)
            } catch (error) {
                console.log('error fetching data', error)
            }
        }
        fetchData();
    }, [])


    const formattedProducts: ClientsColumns[] = clients?.map((item) => ({
        id: item.id,
        name: item.name,
        lastname: item.lastname,
        phoneNumber: item.phoneNumber,
        ident: item.ident,
        sales: item.sales?.length,
    })) || [];

    return (
        <div className="flex-col min-h-screen bg-black h-full w-full">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ClientsClient data={formattedProducts} />
            </div>
        </div>
    )
}
