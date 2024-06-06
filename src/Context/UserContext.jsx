import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from 'react-router-dom';

const UserContext = createContext(null);


export const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        const token = sessionStorage.getItem('authToken');
        console.log("Token from storage:", token);

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                console.log("Decoded Token:", decodedToken);
                const userId = decodedToken['nameid'];
                setUserId(userId);
            } catch (error) {
                console.error("Erreur de décodage du token:", error);
                if (location.pathname !== '/Register' && location.pathname !== '/') {
                    navigate('/');
                }
            }
        } else {
            if (location.pathname !== '/Register' && location.pathname !== '/') {
                navigate('/');
            }
        }
    }, [navigate, location.pathname]);

    return (
        <UserContext.Provider value={{ userId }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);