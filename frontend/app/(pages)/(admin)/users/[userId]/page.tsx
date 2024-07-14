'use client'
import axios from "axios"
import { useEffect, useState } from "react"
import { apiUrl } from "@/lib/api-url";
import { User } from "@/interface";
import { MaxWidthWrappper } from "@/components/MaxWidthWrapper";
import { UserForm } from "./_components/UserForm";
import { getToken } from "@/lib/verificationToken";

export default function SaleIdPage({ params }: { params: { userId: string } }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/users/${params.userId}`, {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                });
                setUser(response.data.user)
            } catch (error: any) {
                console.log('error fetching data', error)
                setError(error.response?.data?.error || 'Error fetching user data')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [params.userId])

    return (
        <MaxWidthWrappper className='flex-col'>
            <div className='flex-1 space-y-4  p-4 sm:p-8 pt-6'>
                <UserForm initialData={user} />
            </div>
        </MaxWidthWrappper>
    )
}
