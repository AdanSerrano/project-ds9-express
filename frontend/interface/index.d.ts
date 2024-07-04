export interface User {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
}

export interface Client {
    id?: string;
    name?: string;
    lastname?: string;
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
}

export interface SaleDetail {
    id?: string;
    product?: string;
    quantity?: number;
    price?: number;
}

export interface SaleById {
    id?: string;
    clientId?: string;
    saleDate?: string;
    details?: SaleDetail[];
    clients?: Client;
}