'use client'

import { UsersColumns, columns } from "./columns"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Heading } from "@/components/ui/heading"
import { Plus } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface UsersClientProps {
    data: UsersColumns[]
}

export const UsersClient = ({ data }: UsersClientProps) => {
    const router = useRouter()

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Usuarios (${data.length})`}
                    description="Manejo de Usuarios"
                />
                <Button onClick={() => router.push(`/users/news`)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Nuevo
                </Button>
            </div>
            <Separator />
            <DataTable searchKey="name" columns={columns} data={data} />
        </>
    )
}

