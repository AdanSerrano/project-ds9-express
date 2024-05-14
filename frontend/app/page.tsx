'use client'
import Image from "next/image";
import { CardComponents } from "./_components/CardComponents";
import axios from "axios";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface User {
  id?: string;
  name?: string;
  email?: string;
}

export default function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<User>({});
  const [updateUser, setUpdateUser] = useState<User>({});

  //fetch user
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/users`);
        console.log({ response })
        setUsers(response.data)
      } catch (error) {
        console.log('error fetching data', error)
      }
    }
    fetchData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
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
