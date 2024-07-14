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
import { FormError } from '@/components/auth/FormError'
import { FormSuccess } from '@/components/auth/FormSuccess'
import { RegisterFormValues, RegisterSchema } from '@/schema'
import axios from 'axios'
import { PasswordInput } from '../ui/input-password'
import { apiUrl } from '@/lib/api-url'
import { useRouter } from 'next/navigation'
import { User } from '@/interface'


export const RegisterForm = () => {
    const [isPending, startTransition] = useTransition()
    const [users, setUsers] = useState<User[]>([]);
    const [newUser, setNewUser] = useState<User>({});
    const [success, setSuccess] = useState<string | undefined>('');
    const [error, setError] = useState<string | undefined>('');
    const router = useRouter()

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })


    // 2. Define a submit handler.
    function onSubmit(values: RegisterFormValues) {
        setError('');
        setSuccess('');
        startTransition(async () => {
            try {
                const response = await axios.post(`${apiUrl}/api/users`, values);
                setUsers([...users, response.data]);
                setNewUser(response.data);
                if (response.data.success) {
                    setSuccess(response.data.success);
                    toast(response.data.success);
                    form.reset();
                    router.push('/auth/login');
                }
            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    if (error.response) {
                        setError(error.response.data.error);
                        toast.error(error.response.data.error);
                    } else {
                        setError('An unexpected error occurred');
                    }
                } else {
                    console.error('Unexpected error:', error);
                    setError('An unexpected error occurred');
                }
            }
        })
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
                                        <PasswordInput
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
