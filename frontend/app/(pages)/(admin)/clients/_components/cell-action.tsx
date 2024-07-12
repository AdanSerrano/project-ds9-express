'use client'

import { Check, Copy, Edit, MoreHorizontal, Trash } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

import { AlertModal } from "@/components/modals/alert-modal"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { toast } from "sonner"
import { useState } from "react"
import { apiUrl } from "@/lib/api-url"
import { ClientsColumns } from "./columns"
import { getToken } from "@/lib/verificationToken"

interface CellActionProps {
    data: ClientsColumns
}

export const CellAction = ({ data }: CellActionProps) => {
    const [copied, setCopied] = useState(false)
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const onCopy = (description: string) => {
        navigator.clipboard.writeText(description)
        toast.success('Cliente Copiado')
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 3000);
    }

    const token = sessionStorage.getItem('token')

    const onDelete = async () => {
        try {
            setLoading(true)
            const response = await axios.delete(`${apiUrl}/api/clients/${data.id}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            })

            toast.success("clients deleted successfully")
            // router.refresh()
            location.reload()
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                loading={loading}
                onConfirm={onDelete}
                description="Are you sure to delete this clients?"
                title="Delete clients"
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={'ghost'} className="h-8 w-8 p-0">
                        <span className="sr-only">Open Menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                        Actions
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onCopy(data.id || '')}>
                        {copied ? (
                            <>
                                <Check className="mr-2 h-4 w-4" />
                                Copied
                            </>
                        ) : (
                            <>
                                <Copy className="mr-2 h-4 w-4" />
                                Copiar
                            </>
                        )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/clients/${data.id}`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Actualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpen(true)} className="text-red-500 hover:text-red-500 focus:text-red-700">
                        <Trash className="mr-2 h-4 w-4" />
                        Eliminar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}