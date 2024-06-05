'use client'
import Image from "next/image";
import { CardComponents } from "./_components/CardComponents";
import axios from "axios";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FormSuccess } from "./_components/FormSuccess";
import { FormError } from "./_components/FormError";
import { toast } from "sonner";
import { RegisterSchema } from "@/schema";

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
  const [sucess, setSucess] = useState<string | undefined>('');
  const [error, setError] = useState<string | undefined>('');

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
  }, [apiUrl, newUser]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
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
