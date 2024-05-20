import {createContext} from "react";

export enum LoginMethods {
    web,
    native,
    none
}

export interface AuthContext {
    token:string;
    isLoggedIn: boolean;
    saveToken: (token: string, method: LoginMethods) => void;
    logout: () => void;
}
export const AuthContext = createContext<AuthContext>({
    token: "",
    isLoggedIn: false,
    saveToken: () => {},
    logout: () => {}
});