import { Client, SaleDetail } from "@/interface";
import { CellAction } from "./cell-action"
import { ColumnDef } from "@tanstack/react-table"
import { ReactNode } from "react";

export type SalesColumns = {
    id: string | undefined;
    clientId: string | undefined;
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
        accessorKey: "clientId",
        header: "ClientId"
    },
    {
        accessorKey: "saleDate",
        header: "Date"
    },
    {
        accessorKey: "details",
        header: "details"
    },
    {
        accessorKey: "clients",
        header: "Clients"
    },
    {
        id: 'actions',
        cell: ({ row }) => <CellAction data={row.original} />
    }
]
