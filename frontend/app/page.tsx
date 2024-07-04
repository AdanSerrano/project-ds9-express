'use client'
import Image from "next/image";
import { CardComponents } from "./_components/CardComponents";
import axios from "axios";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { RegisterSchema } from "@/schema";
import { apiUrl } from "@/lib/api-url";

interface User {
  id?: string;
  name?: string;
  email?: string;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })


  //fetch user
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/users`);
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
        {users.map((user, index) => (
          <div key={index}>
            <CardComponents id={user.id} name={user.name} email={user.email} />
            {/* <Button variant={'destructive'} onClick={() => deleteUser(user.id)}>Delete</Button> */}
          </div>
        ))}
      </div>
    </main>
  );
}
