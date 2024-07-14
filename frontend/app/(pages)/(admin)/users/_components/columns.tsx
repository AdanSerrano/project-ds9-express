import { Sale, } from "@/interface";
import { CellAction } from "./cell-action"
import { ColumnDef } from "@tanstack/react-table"
import { ReactNode } from "react";

export type UsersColumns = {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
}


export const columns: ColumnDef<UsersColumns>[] = [
    {
        accessorKey: "id",
        header: "Id"
    },
    {
        accessorKey: "name",
        header: "Nombre",
    },
    {
        accessorKey: "email",
        header: "Email"
    },
    {
        accessorKey: "role",
        header: "Tipo"
    },
    {
        id: 'actions',
        cell: ({ row }) => <CellAction data={row.original} />
    }
]
