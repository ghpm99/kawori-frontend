// Single source of truth for the JWT auth state. The frontend stores the
// tokens and decides whether the user is authenticated by inspecting the
// access token locally — no server round-trip, no cookies.

const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";

const hasWindow = () => typeof window !== "undefined";

export const getAccessToken = (): string | null => (hasWindow() ? localStorage.getItem(ACCESS_KEY) : null);

export const getRefreshToken = (): string | null => (hasWindow() ? localStorage.getItem(REFRESH_KEY) : null);

export const setTokens = (access: string, refresh?: string): void => {
    if (!hasWindow()) return;
    localStorage.setItem(ACCESS_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
};

export const clearTokens = (): void => {
    if (!hasWindow()) return;
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
};

const decodeExp = (token: string): number | null => {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return typeof payload.exp === "number" ? payload.exp : null;
    } catch {
        return null;
    }
};

// True only when an access token exists and has not expired. Drives the whole
// auth UI; logout is just clearing the tokens.
export const isAuthenticated = (): boolean => {
    const token = getAccessToken();
    if (!token) return false;
    const exp = decodeExp(token);
    return exp !== null && exp * 1000 > Date.now();
};
