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
        required_error: "A sale date is required.",
    }),
    details: z.array(
        z.object({
            product: z.string().optional(),
            quantity: z.coerce.number().optional(),
            price: z.coerce.number().optional(),
            tax: z.coerce.number().optional(),
            discount: z.coerce.number().optional(),
        })
    ).nonempty({
        message: "At least one detail is required"
    })
});

export const ClientSchema = z.object({
    name: z.string().min(1, "Name is required"),
    lastname: z.string().min(1, "Lastname is required"),
    email: z.string().email(),
    phoneNumber: z.string().min(1, "Phone number is required"),
    ident: z.string().min(1, "Identification is required"),
});

export type SaleFormValues = z.infer<typeof SaleSchema>;
export type ClientFormValues = z.infer<typeof ClientSchema>;

