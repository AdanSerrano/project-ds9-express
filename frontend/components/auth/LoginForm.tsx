'use client'
import React, { useContext, useState, useTransition } from "react";
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Button } from '@/components/ui/button';
import { CardWrapper } from "@/components/auth/CardWrapper";
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormError } from '@/app/_components/FormError';
import { FormSuccess } from '@/app/_components/FormSuccess';
import { LoginSchema } from '@/schema';
import { PasswordInput } from '../ui/input-password';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { apiUrl } from '@/lib/api-url';
import { GlobalState } from '@/context/global-state';

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

    const { setLogin } = useContext(GlobalState);
    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError('');
        setSuccess('');
        startTransition(async () => {
            try {
                const response = await axios.post(`${apiUrl}/login`, values);
                console.log(response.data.user, response.data.token);
                setLogin(response.data.user, response.data.token);

                if (response.data.success) {
                    setSuccess(response.data.success);
                    toast.success(response.data.success);
                    router.push('/dashboard');
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
