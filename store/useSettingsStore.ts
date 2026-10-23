import { create } from 'zustand';
import axios from 'axios';
import { getBaseApiUrl } from '@/lib/apiUrl';

const API_URL = getBaseApiUrl();

interface SettingsState {
    settings: {
        companyName: string;
        logoText: string;
        logoAccent: string;
        logoUrl: string;
        faviconUrl?: string;
        supportEmail: string;
        isRegistrationEnabled?: boolean;
        socialLinks: {
            twitter?: string;
            linkedin?: string;
            instagram?: string;
            facebook?: string;
        };
    } | null;
    fetchSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
    settings: {
        companyName: 'KeyTrust Pay',
        logoText: 'KeyTrust',
        logoAccent: 'Pay',
        logoUrl: '/logo.png',
        faviconUrl: '/favicon.png',
        supportEmail: 'support@keytrustpay.org',
        isRegistrationEnabled: true,
        socialLinks: {}
    },
    fetchSettings: async () => {
        try {
            const res = await axios.get(`${API_URL}/public/settings`);
            set({ settings: res.data });
        } catch (error) {
            // Fallback defaults
            set({
                settings: {
                    companyName: 'KeyTrust Pay',
                    logoText: 'KeyTrust',
                    logoAccent: 'Pay',
                    logoUrl: '/logo.png',
                    faviconUrl: '/favicon.png',
                    supportEmail: 'support@keytrustpay.org',
                    isRegistrationEnabled: true,
                    socialLinks: {}
                }
            });
        }
    },
}));
