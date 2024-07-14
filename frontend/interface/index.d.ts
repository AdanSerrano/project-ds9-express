export interface User {
    id?: string;
    name?: string;
    email?: string;
    password?: string;
    role?: string;
}

export interface Client {
    id?: string;
    name?: string;
    lastname?: string;
    email?: string;
    phoneNumber?: string;
    ident?: string
    createdAt?: Date | ReactNode;
    sales?: Sale[];
}

export interface Sale {
    id?: string;
    clientId?: string;
    saleDate?: Date | ReactNode;
    details?: SaleDetail[];
    clients?: Client;
    invoiceId?: number;
    TotalSale?: number;
    Payment?: number;
    PaymentPending?: number;
}

export interface SaleDetail {
    id?: string;
    product?: string;
    quantity?: number;
    price?: number;
    tax?: number;
    discount?: number;
    saleId?: string;
    sale?: Sale;
}

export interface SaleById {
    id?: string;
    clientId?: string;
    saleDate?: string;
    details?: SaleDetail[];
    clients?: Client;
}