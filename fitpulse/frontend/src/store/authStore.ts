import { create } from 'zustand';
import api from '@/api/axios';

interface User {
    _id: string;
    name: string;
    email: string;
    token: string;
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    login: (data: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    isLoading: false,
    error: null,
    login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await api.post('/auth/login', credentials);
            localStorage.setItem('user', JSON.stringify(data));
            localStorage.setItem('token', data.token);
            set({ user: data, isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Login failed', isLoading: false });
        }
    },
    register: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await api.post('/auth/register', credentials);
            localStorage.setItem('user', JSON.stringify(data));
            localStorage.setItem('token', data.token);
            set({ user: data, isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Registration failed', isLoading: false });
        }
    },
    logout: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        set({ user: null });
    },
}));
