'use client'
import axios from "axios"
import { useEffect, useState } from "react"
import { apiUrl } from "@/lib/api-url";
import { Client, Sale, User } from "@/interface";
import { SaleForm } from "./_components/SaleForm";
import { Spotlight } from "@/components/ui/spotlight";
import { MaxWidthWrappper } from "@/components/MaxWidthWrapper";
import { toast } from "sonner";
import { getToken } from "@/lib/verificationToken";

export default function SaleIdPage({ params }: { params: { saleId: string } }) {
    const [sale, setSale] = useState<Sale | null>(null)
    const [clients, setClients] = useState<Client[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/sales/${params.saleId}`, {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                })
                setSale(response.data)
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData()
    }, [params.saleId])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/clients`, {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                })
                setClients(response.data)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData()
    }, [])

    return (
        <MaxWidthWrappper className='flex-col'>
            <div className='flex-1 space-y-4  p-4 sm:p-8 pt-6'>
                <SaleForm initialData={sale} clients={clients} />
            </div>
        </MaxWidthWrappper>
    )
}
