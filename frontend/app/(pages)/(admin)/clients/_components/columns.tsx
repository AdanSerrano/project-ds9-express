import { Sale, } from "@/interface";
import { CellAction } from "./cell-action"
import { ColumnDef } from "@tanstack/react-table"
import { ReactNode } from "react";

export type ClientsColumns = {
    id?: string;
    name?: string;
    lastname?: string;
    email?: string;
    phoneNumber?: string;
    ident?: string;
    sales?: number | undefined;
}


export const columns: ColumnDef<ClientsColumns>[] = [
    {
        accessorKey: "id",
        header: "Id"
    },
    {
        accessorKey: "name",
        header: "Nombre",
        cell: ({ row }) => <div className="flex gap-2">
            <span>{row.original.name}{' '}{row.original.lastname}</span>
        </div>
    },
    {
        accessorKey: "email",
        header: "Email"
    },
    {
        accessorKey: "phoneNumber",
        header: "Telefono"
    },
    {
        accessorKey: "ident",
        header: "Identificacion"
    },
    {
        accessorKey: "sales",
        header: "Facturas",
    },
    {
        id: 'actions',
        cell: ({ row }) => <CellAction data={row.original} />
    }
]
