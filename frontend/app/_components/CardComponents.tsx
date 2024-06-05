'use client'
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CardComponentsProps {
    id?: string;
    name?: string;
    email?: string;
}

export const CardComponents = ({ id, name, email }: CardComponentsProps) => {

    useEffect(() => {
        console.log('CardComponentsProps', { id, name, email })
    }, [id, name, email])

    async function onClick() {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
            const response = await axios.delete(`${apiUrl}/users/${id}`);
            setTimeout(() => {
                location.pathname = '/'
            }, 1500);
            if (response.data.success) {
                toast(response.data.success)
            } else {
                toast(response.data.error)
            }
        } catch (error) {
            console.log('error deleting user', error)
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
                        // onClick={() => deleteUser(user.id)}
                        onClick={onClick}
                    >Delete</Button>
                </CardFooter>
            </Card>
        </>
    )
}
