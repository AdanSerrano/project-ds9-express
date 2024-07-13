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

    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [details, setDetails] = useState<SaleDetail[]>([]);
    const [showProductForm, setShowProductForm] = useState(false);

    const title = initialData ? 'Editar Factura' : 'Crear Factura';
    const description = initialData ? 'Actualizar Factura' : 'Agregar una nueva Factura';
    const action = initialData ? 'Guardar Cambios de Factura' : 'Crear Factura';

    const form = useForm<SaleFormValues>({
        resolver: zodResolver(SaleSchema),
        defaultValues: {
            clientId: '',
            saleDate: new Date(),
            details: [],
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                clientId: initialData.clients?.id,
                saleDate: new Date(initialData.saleDate),
                details: initialData.details || []
            });
            setDetails(initialData.details || []);
        }
    }, [initialData, form]);

    const onSubmit = (values: SaleFormValues) => {
        setError('');
        startTransition(async () => {
            try {
                const dataToSubmit = {
                    ...values,
                    details: details.length > 0 ? details : initialData?.details || [],
                };

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
        setShowProductForm(false);
    };

    const handleEdit = (index: number) => {
        setEditIndex(index);
        form.reset({ ...form.getValues(), details: [details[index]] });
    };

    const handleSaveEdit = () => {
        if (editIndex !== null) {
            const newDetails = [...details];
            newDetails[editIndex] = form.getValues('details')[0];
            setDetails(newDetails);
            setEditIndex(null);
        }
    };

    const handleCancelEdit = () => {
        setEditIndex(null);
    };


    const calculateSubtotal = (detail: SaleDetail) => {
        const price = detail.price || 0;
        const quantity = detail.quantity || 0;
        const discount = detail.discount || 0;
        return (price * quantity) - discount;
    };

    const calculateITBMS = (detail: SaleDetail) => {
        const taxRate = (detail.tax || 0) / 100; // Convertir porcentaje a decimal
        return calculateSubtotal(detail) * taxRate;
    };

    const calculateTotal = (details: SaleDetail[]) => {
        const subtotal = details.reduce((acc, detail) => acc + calculateSubtotal(detail), 0);
        const totalITBMS = details.reduce((acc, detail) => acc + calculateITBMS(detail), 0);
        return subtotal + totalITBMS;
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
                                            <SelectTrigger defaultValue={field.value}>
                                                <SelectValue placeholder="Selecciona una cliente" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Cliente</SelectLabel>
                                                {clients?.map((client) => (
                                                    <SelectItem key={client.id} value={client.id || ''}>
                                                        {client.name} {client.lastname}
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
                                                        "text-left h-10 font-normal",
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
                        {showProductForm && (
                            <>
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
                                            <FormLabel className='text-white'>ITBMS (%)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isPending}
                                                    placeholder="ITBMS"
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
                                <div>
                                    <Button
                                        type="button"
                                        onClick={addProduct}
                                        disabled={isPending}
                                    >
                                        Save Product
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>

                    {!showProductForm && (
                        <Button
                            type="button"
                            onClick={() => setShowProductForm(true)}
                            disabled={isPending}
                        >
                            Agregar Producto
                        </Button>
                    )}

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Producto</TableHead>
                                <TableHead>Cantidad</TableHead>
                                <TableHead>Precio</TableHead>
                                <TableHead>ITBMS</TableHead>
                                <TableHead>DESCUENTO</TableHead>
                                <TableHead>ACCION</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {details.map((detail, index) => (
                                <TableRow className='text-white' key={index}>
                                    <TableCell className='w-72'>
                                        {editIndex === index ? (
                                            <FormControl>
                                                <Input
                                                    value={form.watch('details.0.product')}
                                                    onChange={(e) => form.setValue('details.0.product', e.target.value)}
                                                />
                                            </FormControl>
                                        ) : (
                                            detail.product
                                        )}
                                    </TableCell>
                                    <TableCell className='w-32'>
                                        {editIndex === index ? (
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    value={form.watch('details.0.quantity')}
                                                    onChange={(e) => form.setValue('details.0.quantity', parseFloat(e.target.value))}

                                                />
                                            </FormControl>
                                        ) : (
                                            detail.quantity
                                        )}
                                    </TableCell>
                                    <TableCell className='w-32'>
                                        {editIndex === index ? (
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    value={form.watch('details.0.price')}
                                                    onChange={(e) => form.setValue('details.0.price', parseFloat(e.target.value))}

                                                />
                                            </FormControl>
                                        ) : (
                                            detail.price
                                        )}
                                    </TableCell>
                                    <TableCell className='w-32'>
                                        {editIndex === index ? (
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    value={form.watch('details.0.tax')}
                                                    onChange={(e) => form.setValue('details.0.tax', parseFloat(e.target.value))}

                                                />
                                            </FormControl>
                                        ) : (
                                            detail.tax
                                        )}
                                    </TableCell>
                                    <TableCell className='w-32'>
                                        {editIndex === index ? (
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    value={form.watch('details.0.discount')}
                                                    onChange={(e) => form.setValue('details.0.discount', parseFloat(e.target.value))}

                                                />
                                            </FormControl>
                                        ) : (
                                            detail.discount
                                        )}
                                    </TableCell>
                                    <TableCell className='w-fit flex gap-2'>
                                        {editIndex === index ? (
                                            <>
                                                <Button
                                                    type="button"
                                                    onClick={handleSaveEdit}
                                                >
                                                    Guardar
                                                </Button>
                                                <Button
                                                    type="button"
                                                    onClick={handleCancelEdit}
                                                >
                                                    Cancelar
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    type="button"
                                                    onClick={() => handleEdit(index)}
                                                >
                                                    Editar
                                                </Button>
                                                <Button
                                                    type="button"
                                                    onClick={() => {
                                                        const newDetails = [...details];
                                                        newDetails.splice(index, 1);
                                                        setDetails(newDetails);
                                                    }}
                                                >
                                                    Eliminar
                                                </Button>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow className='text-white'>
                                <TableCell colSpan={5} className="text-right">Subtotal</TableCell>
                                <TableCell className='text-center'>{details.reduce((acc, detail) => acc + calculateSubtotal(detail), 0).toFixed(2)}</TableCell>
                            </TableRow>
                            <TableRow className='text-white'>
                                <TableCell colSpan={5} className="text-right">ITBMS</TableCell>
                                <TableCell className='text-center'>{details.reduce((acc, detail) => acc + calculateITBMS(detail), 0).toFixed(2)}</TableCell>
                            </TableRow>
                            <TableRow className='text-white'>
                                <TableCell colSpan={5} className="text-right">Total</TableCell>
                                <TableCell className='text-center'>{calculateTotal(details).toFixed(2)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <Button className='w-full' type="submit" disabled={isPending}>
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    );
};