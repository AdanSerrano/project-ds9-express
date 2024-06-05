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
import { LoginSchema } from '@/schema'
import axios from 'axios'
import { PasswordInput } from '../ui/input-password'

interface User {
    id?: string;
    name?: string;
    email?: string;
}

export const LoginForm = () => {
    const [isPending, startTransition] = useTransition()
    const [success, setSuccess] = useState<string | undefined>('');
    const [error, setError] = useState<string | undefined>('');

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })


    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof LoginSchema>) {
        setError('');
        setSuccess('');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

        console.log(values)
    }
    return (
        <CardWrapper headerLabel='Ingreso' backButtonLabel='¿Eres Nuevo?, Registrate.' backButtonHref='/auth/register' >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                    <section className='space-y-4'>
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
