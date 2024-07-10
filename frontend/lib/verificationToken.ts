import { User } from "@/interface";

export const isLoggedIn = () => {
    const token = sessionStorage.getItem('token');
    return !!token;
};

export const setCurrentUser = (user: User | null) => {
    if (user) {
        sessionStorage.setItem('user', JSON.stringify(user));
    } else {
        sessionStorage.removeItem('user');
    }
};

export const currentUser = (): User | null => {
    const userString = sessionStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
};

export const verificationToken = (token: string) => {
    sessionStorage.setItem('token', token);
}

export const LogoutClick = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
};

export const setToken = (token: string) => {
    sessionStorage.setItem('token', token);
};

export const getToken = () => {
    return sessionStorage.getItem('token');
};