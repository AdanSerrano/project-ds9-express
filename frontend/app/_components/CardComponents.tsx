'use client'
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { apiUrl } from "@/lib/api-url";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface CardComponentsProps {
    id?: string;
    name?: string;
    email?: string;
}

export const CardComponents = ({ id, name, email }: CardComponentsProps) => {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const onDelete = async () => {
        try {
            setLoading(true)
            const response = await axios.delete(`${apiUrl}/api/users/${id}`);
            router.push('/users')
            router.refresh()
            toast.success(response.data.success)
        } catch (error) {
            console.log('error deleting user', error)
        } finally {
            setLoading(false)
        }

    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>{name}</CardTitle>
                    <CardDescription>{email}</CardDescription>
                </CardHeader>
                <CardFooter className="flex gap-3">
                    <div className="line-clamp-1">{id}</div>

                    <Button
                        variant={'destructive'}
                        disabled={loading}
                        onClick={onDelete}
                    >
                        Delete
                    </Button>
                </CardFooter>
            </Card>
        </>
    )
}
