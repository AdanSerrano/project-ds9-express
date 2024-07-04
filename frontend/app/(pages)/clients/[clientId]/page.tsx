'use client'
import axios from "axios"
import { useEffect, useState } from "react"
import { apiUrl } from "@/lib/api-url";
import { Sale, User } from "@/interface";
import { SaleForm } from "./_components/SaleForm";
import { Spotlight } from "@/components/ui/spotlight";

export default function SaleIdPage({ params }: { params: { saleId: string } }) {
    const [sale, setSale] = useState<Sale | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/sales/${params.saleId}`)
                setSale(response.data)
            } catch (error: any) {
                console.log('error fetching data', error)
                setError(error.response?.data?.error || 'Error fetching sale data')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [params.saleId])
    return (
        <div className='flex-col '>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <SaleForm initialData={sale} />
            </div>
        </div>
    )
}
