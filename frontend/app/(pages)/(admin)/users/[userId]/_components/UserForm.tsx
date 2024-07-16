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
import { RegisterFormValues, RegisterSchema, UserFormValues, UserSchema } from '@/schema';
import { User } from '@/interface';
import { apiUrl } from '@/lib/api-url';
import { AlertModal } from '@/components/modals/alert-modal';
import { getToken } from '@/lib/verificationToken';
import { PasswordInput } from '@/components/ui/input-password';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserFormProps {
    initialData?: User | null;
}

export const UserForm = ({ initialData }: UserFormProps) => {
    const [isPending, startTransition] = useTransition();
    const [success, setSuccess] = useState<string | undefined>('');
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>('');
    const router = useRouter();
    const params = useParams();

    const title = initialData ? 'Editar Usuario' : 'Crear Usuario';
    const description = initialData ? 'Actualizar Usuario' : 'Agregar nuevo Usuario';
    const toastMessage = initialData ? 'Usuario Actualizado' : 'Usuario creado.';
    const action = initialData ? 'Guardar cambios' : 'Crear';

    const form = useForm<UserFormValues>({
        resolver: zodResolver(UserSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            role: '',
        }
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name,
                email: initialData.email,
                password: initialData.password,
                role: initialData.role
            });
        }
    }, [initialData, form]);


    const onSubmit = (values: UserFormValues) => {
        setError('');
        setSuccess('');
        startTransition(async () => {
            try {
                if (initialData) {
                    await axios.put(`${apiUrl}/api/users/${params.userId}`, values, {
                        headers: {
                            Authorization: `Bearer ${getToken()}`
                        }
                    });
                } else {
                    await axios.post(`${apiUrl}/api/users`, values, {
                        headers: {
                            Authorization: `Bearer ${getToken()}`
                        }
                    });
                }
                router.push(`/users`)
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
            await axios.delete(`${apiUrl}/api/users/${params.userId}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });
            router.push(`/users`);
            router.refresh();
            toast.success("Usuario eliminado satisfactoramente");
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
                            name="email"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className='text-white'>Email</FormLabel>
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
                        {initialData ? null : (
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className='text-white'>Contraseña</FormLabel>
                                        <FormControl>
                                            <PasswordInput disabled={isPending} placeholder="******" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )
                        }
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className='text-white'>Role</FormLabel>
                                    <Select
                                        disabled={isPending}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger defaultValue={field.value}>
                                                <SelectValue placeholder="Selecciona una cliente" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Cliente</SelectLabel>
                                                <SelectItem value='USER'>
                                                    Usuario
                                                </SelectItem>
                                                <SelectItem value='ADMIN'>
                                                    Administrador
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
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
