import { createContext, useState } from "react";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const storedUser = localStorage.getItem("userInfoLms");
    const initialUser = storedUser ? JSON.parse(storedUser) : null;
    const [user, setUser] = useState(initialUser);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("userInfoLms");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
