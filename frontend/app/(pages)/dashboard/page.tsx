'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CircleDollarSign, CircleOff, CreditCard, DollarSign, Package, Users, Weight } from 'lucide-react'

import { Heading } from '@/components/ui/heading'
import React, { useEffect, useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { formatter } from '@/lib/utils'
import { Client, Sale, User } from '@/interface'
import { currentUser, getToken } from '@/lib/verificationToken'
import axios from 'axios'
import { apiUrl } from '@/lib/api-url'
import { MaxWidthWrappper } from '@/components/MaxWidthWrapper'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
interface DashboardPageProps {
    params: {
        storeId: string
    }
}


export default function OrdersPage({ params }: DashboardPageProps) {
    const [sales, setSales] = useState<Sale[] | null>([])
    const [salesIsPayment, setSalesIsPayment] = useState<Sale[] | null>([])
    const [salesNotIsPayment, setSalesNotIsPayment] = useState<Sale[] | null>([])
    const [users, setUsers] = useState<User[] | null>([])
    const [user, setUser] = useState<User | null>(null);
    const [clients, setClients] = useState<Client[] | null>([])
    const router = useRouter()

    useEffect(() => {
        setUser(currentUser());
    }, []);

    if (user?.role === 'USER') {
        router.push('/dashboard/orders')
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/users`, {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                });
                setUsers(response.data.data);
            } catch (error) {
                console.log('error fetching data', error)
            }
        }
        fetchData();
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/clients`, {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                });
                setClients(response.data);
            } catch (error) {
                console.log('error fetching data', error)
            }
        }
        fetchData();
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/sales`, {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                });
                setSales(response.data.data);
            } catch (error) {
                console.log('error fetching data', error)
            }
        }
        fetchData();
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/sales/isPayment/0`, {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                });
                setSalesNotIsPayment(response.data.data);
            } catch (error) {
                console.log('error fetching data', error)
            }
        }
        fetchData();
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/sales/isPayment/1`, {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                });
                setSalesIsPayment(response.data.data);
            } catch (error) {
                console.log('error fetching data', error)
            }
        }
        fetchData();
    }, [])


    return (
        <div className="flex-col min-h-[80vh] h-full w-full">
            <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
                <Heading title='Dashboard' description='Descripción general tienda' />
                <Separator />

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-center justify-center mt-10'>
                    <Card className='cursor-pointer' onClick={() => router.push('/users')}>
                        <CardHeader className='flex flex-row items-center justify-between'>
                            <CardTitle className='text-sm font-medium'>
                                Total de usuarios
                            </CardTitle>
                            <Users className='h-4 w-4 text-muted-foreground' />
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold '>
                                {users?.length}
                            </div>
                        </CardContent>
                    </Card>


                    <Card className='cursor-pointer' onClick={() => router.push('/clients')} >
                        <CardHeader className='flex flex-row items-center justify-between'>
                            <CardTitle className='text-sm font-medium'>
                                Total de clientes
                            </CardTitle>
                            <Image alt='icono user' src={'/Iconos usuario chispa.png'} className='h-4 w-4 text-muted-foreground' width={10} height={10} />
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold '>
                                {clients?.length}
                            </div>
                        </CardContent>
                    </Card>


                    <Card className='cursor-pointer' onClick={() => router.push('/sales')}>
                        <CardHeader className='flex flex-row items-center justify-between'>
                            <CardTitle className='text-sm font-medium'>
                                Total de facturas
                            </CardTitle>
                            <Image alt='icono sales' src={'/facturas.png'} className='h-4 w-4 text-muted-foreground' width={10} height={10} />
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold '>
                                {sales?.length}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className='cursor-pointer' onClick={() => router.push('/dashboard/orders/salesIsPaid')}>
                        <CardHeader className='flex flex-row items-center justify-between'>
                            <CardTitle className='text-sm font-medium'>
                                Facturas Pagadas
                            </CardTitle>
                            <CircleDollarSign className='h-4 w-4 text-muted-foreground' />
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold '>
                                {salesIsPayment?.length}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className='cursor-pointer' onClick={() => router.push('/dashboard/orders/salesNotIsPaid')}>
                        <CardHeader className='flex flex-row items-center justify-between'>
                            <CardTitle className='text-sm font-medium'>
                                Facturas No Pagadas
                            </CardTitle>
                            <CircleOff className='h-4 w-4 text-muted-foreground' />
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold '>
                                {salesNotIsPayment?.length}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
