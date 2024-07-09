import { User } from "@/interface";

export const isLoggedIn = () => {
    const token = sessionStorage.getItem('token');
    return !!token;
};


export const LogoutClick = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('User');
}

export const currentUser = (): User | null => {
    const user = sessionStorage.getItem('User');
    return user ? JSON.parse(user) : null;
}

export const verificationToken = (token: string) => {
    sessionStorage.setItem('token', token);
}

export const token = sessionStorage.getItem('token');