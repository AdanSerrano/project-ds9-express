'use client'
import { User } from '@/interface'
import { apiUrl } from '@/lib/api-url'
import React, { useEffect, useState } from 'react'
import { UsersColumns } from './_components/columns'
import axios from 'axios'
import { getToken } from '@/lib/verificationToken'
import { UsersClient } from './_components/client'

export default function UsersPage() {
    const [users, setUsers] = useState<User[] | null>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/users`, {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                }
                );
                setUsers(response.data.data)
            } catch (error) {
                console.log('error fetching data', error)
            }
        }
        fetchData();
    }, [])


    const formattedProducts: UsersColumns[] = users?.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        role: item.role
    })) || [];

    return (
        <div className="flex-col min-h-screen bg-black h-full w-full">
            <div className="flex-1 space-y-4  p-4 sm:p-8 pt-6">
                <UsersClient data={formattedProducts} />
            </div>
        </div>
    )
}
