'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Sale } from '@/interface';
import { apiUrl } from '@/lib/api-url';
import { getToken } from '@/lib/verificationToken';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, DollarSign, User, Package, CreditCard } from 'lucide-react';
import { MaxHeigthOrder } from '@/components/MaxHeigthOrder';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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

            console.log('Payment captured:', response.data);
            toast.success("Pago realizado con éxito");
            return response.data.id;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    };

    const onApprove = async (data: any) => {
        const response = await axios.get(`${apiUrl}/api/payments/captureOrder?token=${data.orderID}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
        console.log('Payment captured:', response.data);
        toast.success("Pago realizado con éxito");
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        </div>;
    }

    if (error) {
        return <div className="text-red-500 text-center text-xl">{error}</div>;
    }

    if (!sale) {
        return <div className="text-center text-white text-xl">No se encontró la venta</div>;
    }

    return (
        <MaxHeigthOrder className="container py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 mb-8">
                <h1 className="text-4xl font-bold mb-2 text-white">Orden de Compra #{sale.id}</h1>
                <div className="flex flex-wrap items-center text-gray-200">
                    <User className="mr-2" />
                    <span className="mr-4">{sale?.clients?.name}</span>
                    <Calendar className="mr-2" />
                    <span>{format(new Date(sale.saleDate), "dd MMMM yyyy", { locale: es })}</span>
                </div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
                    <div className="flex items-center">
                        <User className="mr-2 text-blue-400" />
                        <div>
                            <p className="text-sm text-gray-400">Cliente</p>
                            <p className="font-semibold">{sale?.clients?.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Calendar className="mr-2 text-purple-400" />
                        <div>
                            <p className="text-sm text-gray-400">Fecha de venta</p>
                            <p className="font-semibold">{format(new Date(sale.saleDate), "dd MMMM yyyy", { locale: es })}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg overflow-hidden mb-8">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-800 text-gray-200">
                            <TableHead>Producto</TableHead>
                            <TableHead>Cantidad</TableHead>
                            <TableHead>Precio</TableHead>
                            <TableHead>Descuento</TableHead>
                            <TableHead>Impuesto</TableHead>
                            <TableHead>Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sale?.details?.map((detail, index) => (
                            <TableRow key={index} className="text-gray-300 hover:bg-gray-700 transition-colors">
                                <TableCell className="font-medium">{detail.product}</TableCell>
                                <TableCell>{detail.quantity}</TableCell>
                                <TableCell>${detail.price?.toFixed(2)}</TableCell>
                                <TableCell>${detail.discount?.toFixed(2)}</TableCell>
                                <TableCell>% {detail.tax}</TableCell>
                                <TableCell>${((detail.quantity || 0) * (detail.price || 0)).toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-6 mb-8">
                <div className="text-2xl font-bold text-white mb-4 sm:mb-0 flex items-center">
                    <DollarSign className="mr-2 text-green-400" />
                    Total: ${sale?.TotalSale?.toFixed(2)}
                </div>
                <div className="w-full sm:w-auto">
                    {!sale?.isPayment ? (
                        <PayPalScriptProvider options={{ "clientId": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "" }}>
                            <PayPalButtons
                                className='w-full sm:w-64'
                                createOrder={createOrder}
                                onApprove={onApprove}
                            />
                        </PayPalScriptProvider>
                    ) : (
                        <Button disabled className="px-6 py-2 bg-green-500 text-white rounded-full font-semibold shadow-lg flex items-center">
                            <CreditCard className="mr-2" />
                            Pagado
                        </Button>
                    )}
                </div>
            </div>
        </MaxHeigthOrder>
    );
}