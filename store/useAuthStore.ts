import { create } from 'zustand';

interface AuthState {
    user: any | null;
    accessToken: string | null;
    isInitialized: boolean;
    setAuth: (user: any, accessToken: string, refreshToken: string) => void;
    setUser: (user: any) => void;
    logout: () => void;
    initialize: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null,
    accessToken: typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
    isInitialized: false,
    setAuth: (user, accessToken, refreshToken) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
        }
        set({ user, accessToken });
    },
    setUser: (user) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(user));
        }
        set({ user });
    },
    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
        set({ user: null, accessToken: null });
    },
    initialize: () => {
        const { accessToken } = get();

        if (!accessToken) {
            get().logout();
            set({ isInitialized: true });
            return;
        }

        try {
            const payload = JSON.parse(atob(accessToken.split('.')[1]));
            const isExpired = Date.now() >= payload.exp * 1000;
            const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;

            if (isExpired && !refreshToken) {
                get().logout();
            }
        } catch (e) {
            get().logout();
        }

        set({ isInitialized: true });
    },
}));
