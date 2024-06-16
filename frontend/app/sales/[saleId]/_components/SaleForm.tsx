'use client';
import React, { useState, useTransition } from 'react';
import { useForm, useFieldArray, UseFormReturn, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { toast } from 'sonner';
import { useParams, useRouter } from 'next/navigation';
import { SaleSchema, SaleFormValues } from '@/schema';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { CardWrapper } from '@/components/auth/CardWrapper';
import { Input } from '@/components/ui/input';
import { FormError } from '@/components/auth/FormError';
import { FormSuccess } from '@/components/auth/FormSuccess';
import { CalendarIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Sale } from '@/interface';
import { apiUrl } from '@/lib/api-url';
import { AlertModal } from '@/components/modals/alert-modal';
import { Trash } from 'lucide-react';
import { Heading } from '@/components/ui/heading';


interface SaleFormProps {
    initialData?: Sale | null;
}

export const SaleForm = ({ initialData }: SaleFormProps) => {
    const [isPending, startTransition] = useTransition();
    const [success, setSuccess] = useState<string | undefined>('');
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>('');
    const router = useRouter();
    const params = useParams();

    const title = initialData ? 'Edit Sale' : 'Create Sale';
    const description = initialData ? 'Sale updated' : 'Add a new Sale';
    const toastMessage = initialData ? 'Edit a Sale' : 'Sale Created.';
    const action = initialData ? 'Save Change' : 'Create';

    const form = useForm<SaleFormValues>({
        resolver: zodResolver(SaleSchema),
        defaultValues: {
            clientId: '',
            saleDate: new Date(),
            details: [{ product: '', quantity: 1, price: 0 }],
        },
    });
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'details',
    });

    const onSubmit = (values: SaleFormValues) => {
        console.log(values);
        const transformedValues = {
            ...values,
            saleDate: values.saleDate ? new Date(values.saleDate) : new Date(), // Asegúrate de que saleDate sea una fecha válida
            details: values.details.map(detail => ({
                ...detail,
                quantity: Number(detail.quantity),
                price: Number(detail.price),
                total: Number(detail.quantity) * Number(detail.price) // Calcula el total por producto
            }))
        };

        console.log(transformedValues);

        setError('');
        setSuccess('');
        startTransition(async () => {
            try {
                if (initialData) {
                    await axios.put(`${apiUrl}/api/sales/${params.saleId}`, transformedValues);
                } else {
                    await axios.post(`${apiUrl}/api/sales`, transformedValues);
                }
                router.push(`/sales`)
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

            await axios.delete(`${apiUrl}/api/sales/${params.productsId}`);
            router.push(`/sales`);
            router.refresh();
            toast.success("Sales deleted successfully");
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
                title='Delete Product'
                description='Are you sure you want to delete this Product?'
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
                            name="clientId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Client ID</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending} placeholder="Client ID" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="saleDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Date of birth</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "text-left  h-10 font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {fields.map((field, index) => (
                            <div key={field.id} className='space-y-4'>
                                <FormField
                                    control={form.control}
                                    name={`details.${index}.product`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product</FormLabel>
                                            <FormControl>
                                                <Input disabled={isPending} placeholder="Product Name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`details.${index}.quantity`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Quantity</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    disabled={isPending}
                                                    placeholder="Quantity"
                                                    value={field.value}
                                                    onChange={e => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`details.${index}.price`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    disabled={isPending}
                                                    placeholder="Price"
                                                    {...field}
                                                    onChange={e => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="button"
                                    onClick={() => remove(index)}
                                >
                                    Remove Product
                                </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            onClick={() => append({ product: '', quantity: 1, price: 0 })}
                            disabled={fields.length >= 10}
                        >
                            Add New Product
                        </Button>
                    </section>
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button className='w-full' type="submit" disabled={isPending}>
                        Submit Sale
                    </Button>
                </form>
            </Form>
        </>
    );
};
