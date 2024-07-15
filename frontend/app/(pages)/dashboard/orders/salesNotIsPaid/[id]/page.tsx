'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Sale } from '@/interface';
import { apiUrl } from '@/lib/api-url';
import { getToken } from '@/lib/verificationToken';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { formatter } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { MaxHeigthOrder } from '@/components/MaxHeigthOrder';
import { toast } from 'sonner';

export default function SalesNotIsPaidByID({ params }: { params: { id: string } }) {
    const [sale, setSale] = useState<Sale | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/sales/${params.id}`, {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                });
                setSale(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [params.id]);

    const createOrder = async () => {
        try {
            const response = await axios.post(`${apiUrl}/api/payments`, {
                clientId: sale?.clients?.id,
                saleId: sale?.id,
                paymentDate: new Date(),
                amount: sale?.TotalSale,
            }, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            return response.data.id;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    };

    const onApprove = async (data: any) => {
        try {
            const response = await axios.get(`${apiUrl}/api/payments/captureOrder?token=${data.orderID}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            console.log('Payment captured:', response.data);
            toast.success("Pago realizado con éxito");
        } catch (error) {
            console.error('Error capturing payment:', error);
            toast.error("Error procesando el pago");
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    if (!sale) {
        return <div className="text-center">No se encontró la venta</div>;
    }

    return (
        <MaxHeigthOrder className="container py-8">
            <h1 className="text-3xl font-bold mb-6 text-white">Orden de Compra #{sale.id}</h1>

            <div className="bg-gray-100 p-4 rounded-lg mb-6">
                <p><strong>Cliente:</strong> {sale?.clients?.name}</p>
                <p><strong>Fecha:</strong> {format(new Date(sale.saleDate), "dd MMMM yyyy", { locale: es })}</p>
            </div>

            <Table className="w-full mb-6">
                <TableHeader>
                    <TableRow className='text-white'>
                        <TableHead>Producto</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Descuento</TableHead>
                        <TableHead>Inpuesto</TableHead>
                        <TableHead>Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sale?.details?.map((detail, index) => (
                        <TableRow className='text-white' key={index}>
                            <TableCell>{detail.product}</TableCell>
                            <TableCell>{detail.quantity}</TableCell>
                            <TableCell>${detail.price?.toFixed(2)}</TableCell>
                            <TableCell>${detail.discount?.toFixed(2)}</TableCell>
                            <TableCell>% {detail.tax}</TableCell>
                            <TableCell>${((detail.quantity || 0) * (detail.price || 0)).toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="flex justify-between items-center my-10">
                <div className="text-xl font-bold text-white">
                    Total: ${sale?.TotalSale?.toFixed(2)}
                </div>
            </div>
            <div className='w-full flex items-center justify-center'>
                {!sale?.isPayment && (
                    <PayPalScriptProvider options={{ "clientId": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "" }}>
                        <PayPalButtons
                            className='w-1/2'
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={(err) => {
                                console.error(err);
                                toast.error("Error procesando el pago");
                            }}
                        />
                    </PayPalScriptProvider>
                )}
                {sale?.isPayment && (
                    <Button disabled className="px-6 py-2">
                        Pagado
                    </Button>
                )}
            </div>
        </MaxHeigthOrder>
    );
}
