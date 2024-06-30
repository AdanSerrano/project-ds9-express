'use client';
import React, { useState, useTransition } from "react";
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Button } from '@/components/ui/button';
import { CardWrapper } from "@/components/auth/CardWrapper";
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormError } from '@/components/auth/FormError';
import { FormSuccess } from '@/components/auth/FormSuccess';
import { LoginSchema } from '@/schema';
import { PasswordInput } from '../ui/input-password';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { apiUrl } from '@/lib/api-url';

export const LoginForm = () => {
    const [isPending, startTransition] = useTransition();
    const [success, setSuccess] = useState<string | undefined>('');
    const [error, setError] = useState<string | undefined>('');
    const router = useRouter();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError('');
        setSuccess('');
        startTransition(async () => {
            try {
                const response = await axios.post(`${apiUrl}/api/auth/login`, values);
                if (response.data.success) {
                    sessionStorage.setItem('token', response.data.token);
                    sessionStorage.setItem('User', JSON.stringify(response.data.userInfo));
                    router.push('/');
                    setSuccess(response.data.success);
                    toast.success(response.data.success);
                } else {
                    setError(response.data.error);
                    toast.error(response.data.error);
                }
            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    if (error.response) {
                        setError(error.response.data.message);
                        toast.error(error.response.data.message);
                    } else {
                        setError('An unexpected error occurred');
                    }
                } else {
                    console.error('Unexpected error:', error);
                    setError('An unexpected error occurred');
                }
            }
        });
    };

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
                        variant={'default'}
                        className='w-full'
                        type="submit"
                        disabled={isPending}
                    >
                        Ingreso
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
};
