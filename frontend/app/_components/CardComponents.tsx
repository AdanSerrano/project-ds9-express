'use client'
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { toast } from "sonner";

interface CardComponentsProps {
    id?: string;
    name?: string;
    email?: string;
}

export const CardComponents = ({ id, name, email }: CardComponentsProps) => {
    useEffect(() => {
        console.log('CardComponentsProps', { id, name, email })
    }, [])

    return (
        <div className="">
            <Card>
                <CardHeader>
                    <CardTitle>{name}</CardTitle>
                    <CardDescription>{email}</CardDescription>
                </CardHeader>
                <CardFooter className="flex gap-3">
                    <p>{id}</p>
                    <Button
                        variant={'destructive'}
                        // onClick={() => deleteUser(user.id)}
                        onClick={() =>
                            toast("Event has been created", {
                                description: "Sunday, December 03, 2023 at 9:00 AM",
                                action: {
                                    label: "Undo",
                                    onClick: () => console.log("Undo"),
                                },
                            })
                        }
                    >Delete</Button>
                </CardFooter>
            </Card>
        </div>
    )
}
