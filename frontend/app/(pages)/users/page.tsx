'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { apiUrl } from "@/lib/api-url";
import { User } from "@/interface";
import { CardComponents } from "@/components/auth/CardComponents";
import axios from "axios";

export default function Home() {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);

    //fetch user
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get(`${apiUrl}/api/users`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUsers(response.data);
            } catch (error) {
                console.log('error fetching data', error);
                setError('Error fetching data');
            }
        };
        fetchData();
    }, []);
    return (
        <main className="relative flex justify-center items-center flex-col mx-auto w-full h-full min-h-screen sm:px-10 px-5">
            {error && <p>{error}</p>}
            <div className="grid grid-cols-3 gap-2">
                {users.map((user) => (
                    <div key={user.id}>
                        <CardComponents id={user.id} name={user.name} email={user.email} />
                        {/* <Button variant={'destructive'} onClick={() => deleteUser(user.id)}>Delete</Button> */}
                    </div>
                ))}
            </div>
        </main>
    );
}
