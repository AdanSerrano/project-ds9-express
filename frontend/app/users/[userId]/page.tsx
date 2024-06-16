'use client'
import axios from "axios"
import { useEffect, useState } from "react"
import { apiUrl } from "@/lib/api-url";
import { User } from "@/interface";


export default function UserIdPage({ params }: { params: { userId: string } }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    console.log('params', params.userId)
    console.log('user', user)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/users/${params.userId}`)
                setUser(response.data)
            } catch (error) {
                console.log('error fetching data', error)
                setError('Error fetching user data')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [params.userId])


    return (
        <div className="text-white w-[200px] h-[200px]">
            {user ? user.email : 'User not found'}
        </div>
    )
}
