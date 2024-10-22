export interface IToken {
    tokens: {
        refresh: string;
        access: string;
    };
    remember: boolean;
}

class TokenService {
    userItemName: string;

    constructor(itemName: string) {
        this.userItemName = itemName;
    }

    getToken(): IToken | undefined {
        const localStorageToken = localStorage.getItem(this.userItemName);
        const sessionStorageToken = sessionStorage.getItem(this.userItemName);
        const token = localStorageToken ?? sessionStorageToken ?? undefined;
        if (!token) {
            return undefined;
        }
        const user: IToken = JSON.parse(token);
        return user;
    }

    getLocalAccessToken() {
        const user = this.getToken();
        return user?.tokens.access;
    }

    setUser(token: IToken) {
        if (token.remember) {
            localStorage.setItem(this.userItemName, JSON.stringify(token));
        } else {
            sessionStorage.setItem(this.userItemName, JSON.stringify(token));
        }
    }

    removeUser() {
        localStorage.removeItem(this.userItemName);
        sessionStorage.removeItem(this.userItemName);
    }
}

const tokenServiceInstance = new TokenService("kawori");
export default tokenServiceInstance;
