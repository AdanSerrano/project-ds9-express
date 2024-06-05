'use client'

import * as z from 'zod'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { useState, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { CardWrapper } from "@/components/auth/CardWrapper"
import { EnvelopeClosedIcon } from '@radix-ui/react-icons'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormError } from '@/app/_components/FormError'
import { FormSuccess } from '@/app/_components/FormSuccess'
import { RegisterSchema } from '@/schema'
import axios from 'axios'

interface User {
    id?: string;
    name?: string;
    email?: string;
}

export const RegisterForm = () => {
    const [isPending, startTransition] = useTransition()
    const [users, setUsers] = useState<User[]>([]);
    const [newUser, setNewUser] = useState<User>({});
    const [success, setSuccess] = useState<string | undefined>('');
    const [error, setError] = useState<string | undefined>('');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })


    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof RegisterSchema>) {
        setError('');
        setSuccess('');
        try {
            const response = await axios.post(`${apiUrl}/users`, values);
            setUsers([...users, response.data]);
            setNewUser(response.data);

            if (response.data.success) {
                setSuccess(response.data.success);
                toast(response.data.success);
                form.reset();
            } else {
                setError(response.data.error);
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    setError(error.response.data.error);
                } else {
                    setError('An unexpected error occurred');
                }
            } else {
                console.error('Unexpected error:', error);
                setError('An unexpected error occurred');
            }
        }
    }
    return (
        <CardWrapper headerLabel='Registro' backButtonLabel='¿Ya tienes una cuenta?, Inicia Sesión.' backButtonHref='/auth/login' >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                    <section className='space-y-4'>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isPending}
                                            type='name'
                                            placeholder="Example name"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isPending}
                                            type='email'
                                            placeholder="email.doe@example.com"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contraseña</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isPending}
                                            placeholder="******"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </section>
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button
                        className='w-full'
                        type="submit"
                        disabled={isPending}
                    >
                        Registro
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}
