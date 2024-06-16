'use client'
import Image from "next/image";
import axios from "axios";
import { useState, useEffect } from "react";
import { CardComponents } from "../_components/CardComponents";
import Link from "next/link";
import { apiUrl } from "@/lib/api-url";
import { User } from "@/interface";


export default function Home() {
    const [users, setUsers] = useState<User[]>([]);


    //fetch user
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/users`);
                setUsers(response.data)
            } catch (error) {
                console.log('error fetching data', error)
            }
        }
        fetchData();
    }, []);

    return (
        <main className="relative flex justify-center items-center flex-col mx-auto w-full h-full min-h-screen sm:px-10 px-5">
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
