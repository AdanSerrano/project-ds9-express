import { Client, SaleDetail } from "@/interface";
import { CellAction } from "./cell-action"
import { ColumnDef } from "@tanstack/react-table"
import { ReactNode } from "react";

export type SalesColumns = {
    id: string | undefined;
    saleDate: Date | ReactNode | undefined;
    invoiceId: number | undefined;
    TotalSale: number | undefined;
    details: number | undefined;
    clients: string | undefined;
}


export const columns: ColumnDef<SalesColumns>[] = [
    {
        accessorKey: "id",
        header: "Id"
    },
    {
        accessorKey: "clients",
        header: "Nombre de Cliente"
    },
    {
        accessorKey: "details",
        header: "Cantidad de Productos"
    },
    {
        accessorKey: "saleDate",
        header: "Fecha de Venta"
    },
    {
        accessorKey: "invoiceId",
        header: "Id de Factura"
    },
    {
        accessorKey: "TotalSale",
        header: "Total de Venta"
    },
    {
        accessorKey: "Payment",
        header: "Total Pagado"
    },
    {
        accessorKey: "PaymentPending",
        header: "Por Pagar"
    },
    {
        id: 'actions',
        cell: ({ row }) => <CellAction data={row.original} />
    }
]
