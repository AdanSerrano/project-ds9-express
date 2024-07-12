import { Sale, } from "@/interface";
import { CellAction } from "./cell-action"
import { ColumnDef } from "@tanstack/react-table"
import { ReactNode } from "react";

export type ClientsColumns = {
    id?: string;
    name?: string;
    lastname?: string;
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
        header: "Nombre"
    },
    {
        accessorKey: "lastname",
        header: "Segundo Nombre"
    },
    {
        accessorKey: "phoneNumber",
        header: "Numero de Telefono"
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
