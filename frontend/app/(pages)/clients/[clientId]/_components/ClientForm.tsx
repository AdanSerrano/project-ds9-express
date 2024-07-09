'use client';
import React, { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { toast } from 'sonner';
import { useParams, useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormError } from '@/components/auth/FormError';
import { FormSuccess } from '@/components/auth/FormSuccess';
import { Trash } from 'lucide-react';
import { Heading } from '@/components/ui/heading';
import { ClientFormValues, ClientSchema } from '@/schema';
import { Client } from '@/interface';
import { apiUrl } from '@/lib/api-url';
import { AlertModal } from '@/components/modals/alert-modal';
import { token } from '@/lib/verificationToken';

interface ClientFormProps {
    initialData?: Client | null;
}

export const ClientForm = ({ initialData }: ClientFormProps) => {
    const [isPending, startTransition] = useTransition();
    const [success, setSuccess] = useState<string | undefined>('');
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>('');
    const router = useRouter();
    const params = useParams();

    const title = initialData ? 'Edit Client' : 'Create Client';
    const description = initialData ? 'Client updated' : 'Add a new Client';
    const toastMessage = initialData ? 'Edit a Client' : 'Client Created.';
    const action = initialData ? 'Save Change' : 'Create';

    const form = useForm<ClientFormValues>({
        resolver: zodResolver(ClientSchema),
        defaultValues: {
            name: '',
            lastname: '',
            phoneNumber: '',
            ident: ''
        }
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name,
                lastname: initialData.lastname,
                phoneNumber: initialData.phoneNumber,
                ident: initialData.ident
            });
        }
    }, [initialData, form]);


    const onSubmit = (values: ClientFormValues) => {
        setError('');
        setSuccess('');
        startTransition(async () => {
            try {
                if (initialData) {
                    await axios.put(`${apiUrl}/api/clients/${params.clientId}`, values, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                } else {
                    await axios.post(`${apiUrl}/api/clients`, values, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                }
                router.push(`/clients`)
                router.refresh();
                toast.success(toastMessage);
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

    const onDelete = async () => {
        try {
            await axios.delete(`${apiUrl}/api/clients/${params.clientId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            router.push(`/clients`);
            router.refresh();
            toast.success("Client deleted successfully");
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                title='Delete Client'
                description='Are you sure you want to delete this client?'
                loading={loading}
            />
            <Heading title={title} description={description} />
            {initialData && (
                <Button
                    variant={'destructive'}
                    size={'icon'}
                    disabled={loading}
                    onClick={() => setOpen(true)}
                >
                    <Trash className="h-4 w-4" />
                </Button>
            )}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                    <section className='space-y-4'>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-white'>Nombre</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending} placeholder="Nombre" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastname"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className='text-white'>Segundo Nombre</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending} placeholder="Segundo Nombre" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className='text-white'>Teléfono</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending} placeholder="Teléfono" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="ident"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className='text-white'>Identificación</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending} placeholder="Identificación" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </section>
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button className='w-full' type="submit" disabled={isPending}>
                        Submit Client
                    </Button>
                </form>
            </Form>
        </>
    );
};
