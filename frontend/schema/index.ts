import * as z from 'zod'

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(2).max(50)
})
export const RegisterSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(2).max(50)
})


export const SaleSchema = z.object({
    clientId: z.string().min(1, "Client ID is required"),
    saleDate: z.date({
        required_error: "A date of birth is required.",
    }),
    details: z.array(
        z.object({
            product: z.string().min(1, "Product is required"),
            quantity: z.number().min(1, "Quantity must be at least 1"),
            price: z.number().min(0, "Price must be a positive number"),
        })
    ).min(1, "At least one product is required").max(10, "Maximum 10 products allowed"),
});

export const ClientSchema = z.object({
    name: z.string().min(1, "Name is required"),
    lastname: z.string().min(1, "Lastname is required"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    ident: z.string().min(1, "Identification is required"),
});

export type SaleFormValues = z.infer<typeof SaleSchema>;
export type ClientFormValues = z.infer<typeof ClientSchema>;

