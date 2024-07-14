'use client'
import axios from "axios"
import { useEffect, useState } from "react"
import { apiUrl } from "@/lib/api-url";
import { Client } from "@/interface";
import { MaxWidthWrappper } from "@/components/MaxWidthWrapper";
import { ClientForm } from "./_components/ClientForm";
import { getToken } from "@/lib/verificationToken";

export default function SaleIdPage({ params }: { params: { clientId: string } }) {
    const [client, setClient] = useState<Client | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/clients/${params.clientId}`, {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                });
                setClient(response.data)

            } catch (error: any) {
                console.log('error fetching data', error)
                setError(error.response?.data?.error || 'Error fetching client data')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [params.clientId])

    return (
        <MaxWidthWrappper className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <ClientForm initialData={client} />
            </div>
        </MaxWidthWrappper>
    )
}
