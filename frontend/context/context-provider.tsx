'use client'
import React, { useState, useEffect } from "react"
import { GlobalState } from "./global-state"

export const ContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUserState] = useState<string | null>(null);
    const [token, setTokenState] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");
        if (storedUser) setUserState(JSON.parse(storedUser));
        if (storedToken) setTokenState(storedToken);
    }, []);

    const setLogin = (user: string, token: string) => {
        setUserState(user);
        setTokenState(token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
    };

    const setLogout = () => {
        setUserState(null);
        setTokenState(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <GlobalState.Provider value={{ user, token, setLogin, setLogout }}>
            {children}
        </GlobalState.Provider>
    );
};
