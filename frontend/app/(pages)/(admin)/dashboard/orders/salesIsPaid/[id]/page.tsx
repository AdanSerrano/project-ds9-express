'use client'
import { Sale } from '@/interface'
import { apiUrl } from '@/lib/api-url'
import { getToken } from '@/lib/verificationToken'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Loader2 } from 'lucide-react'
import { MaxHeigthOrder } from '@/components/MaxHeigthOrder'

export default function PaidInvoice({ params }: { params: { id: string } }) {
    const [sale, setSale] = useState<Sale | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/sales/${params.id}`, {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                })
                if (!response.data.isPayment) {
                    setError("Esta factura no está pagada")
                } else {
                    setSale(response.data)
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Error al cargar los datos de la factura")
            } finally {
                setLoading(false);
            }
        }
        fetchData()
    }, [params.id])

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>
    }

    if (!sale) {
        return <div className="text-center">No se encontró la factura</div>
    }

    return (
        <MaxHeigthOrder className="container py-8">
            <h1 className="text-3xl font-bold mb-6 text-white">Factura Pagada #{sale.id}</h1>

            <div className="bg-gray-100 p-4 rounded-lg mb-6">
                <p><strong>Cliente:</strong> {sale?.clients?.name}</p>
                <p><strong>Fecha de venta:</strong> {format(new Date(sale.saleDate), "dd MMMM yyyy", { locale: es })}</p>
                <p><strong>Fecha de pago:</strong> {sale.Payment ? format(new Date(sale.Payment), "dd MMMM yyyy", { locale: es }) : 'No disponible'}</p>
            </div>

            <Table className="w-full mb-6">
                <TableHeader>
                    <TableRow className='text-white'>
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

            <div className="flex justify-between items-center">
                <div className="text-xl font-bold text-white">
                    Total Pagado: ${sale?.TotalSale?.toFixed(2)}
                </div>
                <div className="px-6 py-2 bg-green-500 text-white rounded">
                    Pagado
                </div>
            </div>
        </MaxHeigthOrder>
    )
}