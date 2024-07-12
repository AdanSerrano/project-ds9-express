import { Client, SaleDetail } from "@/interface";
import { CellAction } from "./cell-action"
import { ColumnDef } from "@tanstack/react-table"
import { ReactNode } from "react";

export type SalesColumns = {
    id: string | undefined;
    saleDate: Date | ReactNode | undefined;
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
        header: "details"
    },
    {
        accessorKey: "saleDate",
        header: "details"
    },
    {
        id: 'actions',
        cell: ({ row }) => <CellAction data={row.original} />
    }
]
