import { createContext } from "react";

interface GlobalStateType {
    user: string | null;
    token: string | null;
    setLogin: (user: string, token: string) => void;
    setLogout: () => void;
}

export const GlobalState = createContext<GlobalStateType>({
    user: null,
    token: null,
    setLogin: () => { },
    setLogout: () => { },
});
