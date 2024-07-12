'use client';
import React, { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { toast } from 'sonner';
import { useParams, useRouter } from 'next/navigation';
import { SaleSchema, SaleFormValues } from '@/schema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalendarIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Client, Sale, SaleDetail } from '@/interface';
import { apiUrl } from '@/lib/api-url';
import { AlertModal } from '@/components/modals/alert-modal';
import { Trash } from 'lucide-react';
import { Heading } from '@/components/ui/heading';
import { getToken } from '@/lib/verificationToken';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface SaleFormProps {
    initialData?: Sale | null;
    clients?: Client[] | null;
}

export const SaleForm = ({ initialData, clients }: SaleFormProps) => {
    const [isPending, startTransition] = useTransition();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>('');
    const router = useRouter();
    const params = useParams();

    const [details, setDetails] = useState<SaleDetail[]>([]);

    const title = initialData ? 'Edit Sale' : 'Create Sale';
    const description = initialData ? 'Sale updated' : 'Add a new Sale';
    const action = initialData ? 'Save Change' : 'Create';

    const form = useForm<SaleFormValues>({
        resolver: zodResolver(SaleSchema),
        defaultValues: {
            clientId: '',
            saleDate: undefined,
            details: [],
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                clientId: initialData.clientId,
                saleDate: new Date(initialData.saleDate),
                details: []
            });
            setDetails(initialData.details?.map(detail => ({
                product: detail.product || '',
                quantity: Number(detail.quantity),
                price: Number(detail.price),
                tax: Number(detail.tax),
                discount: Number(detail.discount)
            })) || []);
        }
    }, [initialData, form]);

    const onSubmit = (values: SaleFormValues) => {
        setError('');
        startTransition(async () => {
            try {
                const dataToSubmit = { ...values, details };
                if (initialData) {
                    const response = await axios.put(`${apiUrl}/api/sales/${params.saleId}`, dataToSubmit, {
                        headers: { Authorization: `Bearer ${getToken()}` }
                    });
                    toast.success(response.data.success)
                } else {
                    const response = await axios.post(`${apiUrl}/api/sales`, dataToSubmit, {
                        headers: { Authorization: `Bearer ${getToken()}` }
                    });
                    toast.success(response.data.success)
                }
                router.push(`/sales`)
                router.refresh();
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    setError(error.response.data.error);
                    toast.error(error.response.data.error);
                } else {
                    console.error('Unexpected error:', error);
                    setError('An unexpected error occurred');
                }
            }
        });
    };

    const onDelete = async () => {
        try {
            await axios.delete(`${apiUrl}/api/sales/${params.saleId}`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
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

    const addProduct = () => {
        const newProduct = form.getValues('details')[0];
        setDetails([...details, newProduct]);
        form.reset({ ...form.getValues(), details: [{ product: '', quantity: 0, price: 0, tax: 0, discount: 0 }] });
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
                                    <FormLabel className='text-white'>Client ID</FormLabel>
                                    <Select
                                        disabled={isPending}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger defaultValue={field.value} >
                                                <SelectValue placeholder="Selecciona una cliente" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Cliente</SelectLabel>
                                                {clients?.map((client) => (
                                                    <SelectItem key={client.id} value={client.id || ''}>
                                                        {client.name}{' '}{client.lastname}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="saleDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className='text-white'>Date of sale</FormLabel>
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
                    </section>
                    <div className='grid grid-cols-1 sm:grid-cols-2 items-center justify-center gap-2'>
                        <FormField
                            control={form.control}
                            name={`details.0.product`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-white'>Product</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending} placeholder="Product Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`details.0.quantity`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-white'>Cantidad</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isPending}
                                            placeholder="Cantidad"
                                            type="number"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`details.0.price`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-white'>Price</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isPending}
                                            placeholder="Precio"
                                            type="number"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`details.0.tax`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-white'>Tax</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isPending}
                                            placeholder="Tax"
                                            type="number"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`details.0.discount`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-white'>Discount</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isPending}
                                            placeholder="Discount"
                                            type="number"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="button"
                            onClick={addProduct}
                        >
                            Add Product
                        </Button>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Tax</TableHead>
                                <TableHead>Discount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {details.map((detail, index) => (
                                <TableRow className='text-white' key={index}>
                                    <TableCell>{detail.product}</TableCell>
                                    <TableCell>{detail.quantity}</TableCell>
                                    <TableCell>{detail.price}</TableCell>
                                    <TableCell>{detail.tax}</TableCell>
                                    <TableCell>{detail.discount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Button className='w-full' type="submit" disabled={isPending}>
                        Submit Sale
                    </Button>
                </form>
            </Form>
        </>
    );
};