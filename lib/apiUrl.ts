export const getBaseApiUrl = (): string => {
    let url = process.env.NEXT_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    url = url.trim().replace(/\/+$/, '');
    if (!url.endsWith('/api')) {
        url = `${url}/api`;
    }
    return url;
};

export default getBaseApiUrl;
