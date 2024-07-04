'use client'
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { apiUrl } from "@/lib/api-url";
import axios from "axios";
import { useEffect, useState, useTransition } from "react";
import { start } from "repl";
import { toast } from "sonner";

interface CardComponentsProps {
    id?: string;
    name?: string;
    email?: string;
}

export const CardComponents = ({ id, name, email }: CardComponentsProps) => {
    const [isPending, startTransition] = useTransition()
    useEffect(() => {
        console.log('CardComponentsProps', { id, name, email })
    }, [id, name, email])

    function onClick() {
        startTransition(async () => {
            try {
                const response = await axios.delete(`${apiUrl}/users/${id}`);
                if (response.data.success) {
                    toast.success(response.data.success)
                } else {
                    toast.error(response.data.error)
                }
                setTimeout(() => {
                    location.pathname = '/'
                }, 1500);
            } catch (error) {
                console.log('error deleting user', error)
            }
        })
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
                        disabled={isPending}
                        onClick={onClick}
                    >Delete</Button>
                </CardFooter>
            </Card>
        </>
    )
}
