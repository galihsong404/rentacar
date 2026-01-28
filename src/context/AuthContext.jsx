import { createContext, useContext, useState, useEffect } from 'react';
import { usersApi } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for stored user on mount
    useEffect(() => {
        const stored = localStorage.getItem('rentacar_user');
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch (e) {
                localStorage.removeItem('rentacar_user');
            }
        }
        setLoading(false);
    }, []);

    // Login
    const login = async (email, password) => {
        try {
            const userData = await usersApi.getByEmail(email);

            if (!userData) {
                return { success: false, error: 'Email tidak ditemukan' };
            }

            if (userData.password !== password) {
                return { success: false, error: 'Password salah' };
            }

            if (!userData.is_active) {
                return { success: false, error: 'Akun tidak aktif. Hubungi admin.' };
            }

            // Store user (without password)
            const userToStore = { ...userData };
            delete userToStore.password;

            localStorage.setItem('rentacar_user', JSON.stringify(userToStore));
            setUser(userToStore);

            return { success: true, user: userToStore };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Terjadi kesalahan. Coba lagi.' };
        }
    };

    // Register
    const register = async (data) => {
        try {
            // Check if email exists
            const existing = await usersApi.getByEmail(data.email);
            if (existing) {
                return { success: false, error: 'Email sudah terdaftar' };
            }

            // Create user
            const newUser = await usersApi.create({
                email: data.email,
                password: data.password,
                name: data.name,
                phone: data.phone,
                role: 'user',
                is_active: true,
                avatar: `https://i.pravatar.cc/100?u=${data.email}`,
            });

            // Store user (without password)
            const userToStore = { ...newUser };
            delete userToStore.password;

            localStorage.setItem('rentacar_user', JSON.stringify(userToStore));
            setUser(userToStore);

            return { success: true, user: userToStore };
        } catch (error) {
            console.error('Register error:', error);
            return { success: false, error: 'Terjadi kesalahan. Coba lagi.' };
        }
    };

    // Logout
    const logout = () => {
        localStorage.removeItem('rentacar_user');
        setUser(null);
    };

    // Update profile
    const updateProfile = async (data) => {
        if (!user) return { success: false };

        try {
            const updated = await usersApi.update(user.id, data);
            const userToStore = { ...updated };
            delete userToStore.password;

            localStorage.setItem('rentacar_user', JSON.stringify(userToStore));
            setUser(userToStore);

            return { success: true };
        } catch (error) {
            console.error('Update profile error:', error);
            return { success: false, error: 'Gagal update profil' };
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
