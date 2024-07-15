import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Sale } from '@/interface'
import Image from 'next/image'
import Link from 'next/link'



interface CardSalesProps {
    sale: Sale
    image?: string
    href?: string
    isPaid?: boolean
}

export const CardSales = ({ sale, image, href, isPaid }: CardSalesProps) => {
    return (
        <Card key={sale.id} >
            <CardHeader>
                <Link href={`${href}/${sale.id}`} className="mx-auto z-10 rounded-xl relative flex flex-col justify-center items-center h-full sm:h-36 w-full ">
                    <Image
                        src={image || '/default.jpg'}
                        width={400}
                        height={400}
                        alt={'producto'}
                        className="relative bg-gray-200 z-50 w-full h-full object-fill sm:object-cover object-center mix-blend-overlay aspect-square rounded-xl max-w-sm"
                    />
                </Link>
            </CardHeader>
            <CardContent className="p-4">
                <div className="my-2">
                    <p className="text-sm text-gray-600">{sale.clients?.name}</p>
                    <p className="text-xs text-gray-400">{sale.clients?.email}</p>
                </div>
                <div className="mt-4">
                    <p className="text-xs text-gray-600 flex items-center justify-between">Total de Factura: <span>${sale.TotalSale?.toFixed(2)}</span></p>
                    <p className="text-xs text-gray-600 flex items-center justify-between">Sale Date: <span>{new Date(sale.saleDate).toLocaleDateString()}</span></p>
                </div>
            </CardContent>
            <CardFooter className="flex w-full gap-2 justify-center items-center overflow-hidden">
                <Link
                    href={`${isPaid ? '/dashboard/orders/salesIsPaid' : '/dashboard/orders/salesNotIsPaid'}/${sale.id}`}
                    className={buttonVariants({
                        variant: 'default',
                        className: 'w-full'
                    })}
                >
                    Más Detalles
                </Link>
            </CardFooter>
        </Card>
    )
}
