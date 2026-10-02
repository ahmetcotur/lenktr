import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '../utils/api/client';

const api = createClient();
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active sessions and sets the user
        const setData = async () => {
            const { data, error } = await api.auth.getSession();
            const session = data?.session || null;
            if (error) console.error('Error getting session:', error);
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        };

        const { data: { subscription } } = api.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        setData();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const value = {
        session,
        user,
        signOut: () => api.auth.signOut(),
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
