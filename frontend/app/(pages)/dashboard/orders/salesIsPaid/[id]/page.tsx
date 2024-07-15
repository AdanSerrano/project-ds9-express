'use client'
import { Sale } from '@/interface'
import { apiUrl } from '@/lib/api-url'
import { getToken } from '@/lib/verificationToken'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Loader2, Calendar, DollarSign, User, Package } from 'lucide-react'
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
                setSale(response.data)
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
        return <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        </div>
    }

    if (!sale) {
        return <div className="text-center text-red-500 text-xl">No se encontró la factura</div>
    }

    return (
        <MaxHeigthOrder className="container py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 mb-8">
                <h1 className="text-4xl font-bold mb-2 text-white">Factura Pagada #{sale.id}</h1>
                <div className="flex flex-wrap items-center text-gray-200">
                    <User className="mr-2" />
                    <span className="mr-4">{sale?.clients?.name}</span>
                    <Calendar className="mr-2" />
                    <span>{format(new Date(sale.saleDate), "dd MMMM yyyy", { locale: es })}</span>
                </div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
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
                    <div className="flex items-center">
                        <DollarSign className="mr-2 text-green-400" />
                        <div>
                            <p className="text-sm text-gray-400">Fecha de pago</p>
                            <p className="font-semibold">{sale.payment?.createdAt ? format(new Date(sale.payment?.createdAt), "dd MMMM yyyy", { locale: es }) : 'No disponible'}</p>
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

            <div className="flex flex-col sm:flex-row justify-between items-center bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-6">
                <div className="text-2xl font-bold text-white mb-4 sm:mb-0">
                    Total Pagado: ${sale?.TotalSale?.toFixed(2)}
                </div>
                <div className="px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full font-semibold shadow-lg">
                    Pagado
                </div>
            </div>
        </MaxHeigthOrder>
    )
}