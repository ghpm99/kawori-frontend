export interface IToken {
    tokens: {
        refresh: string;
        access: string;
    };
    remember: boolean;
}

class TokenService {
    userItemName: string;
    user: IToken | undefined;

    constructor(itemName: string) {
        this.userItemName = itemName;
    }

    getToken(): IToken | undefined {
        if(this.user) {
            return this.user;
        }
        const localStorageToken = localStorage.getItem(this.userItemName);
        const sessionStorageToken = sessionStorage.getItem(this.userItemName);
        const token = localStorageToken ?? sessionStorageToken ?? undefined;
        if (!token) {
            return undefined;
        }
        this.user = JSON.parse(token);
        return this.user;
    }

    getLocalAccessToken() {
        const user = this.getToken();
        return user?.tokens.access;
    }

    getLocalRefreshToken() {
        const user = this.getToken();
        return user?.tokens.refresh;
    }

    setUser(token: IToken) {
        this.user = token;
        if (token.remember) {
            localStorage.setItem(this.userItemName, JSON.stringify(this.user));
        } else {
            sessionStorage.setItem(this.userItemName, JSON.stringify(this.user));
        }
    }

    updateLocalAccessToken(token: string) {
        const user = this.getToken();
        if (user) {
            user.tokens.access = token;
            this.setUser(user);
        }
    }

    removeUser() {
        localStorage.removeItem(this.userItemName);
        sessionStorage.removeItem(this.userItemName);
    }
}

let tokenServiceInstance = null;

const getTokenServiceInstance = (itemName: string = 'kawori') : TokenService => {
    if (!tokenServiceInstance) {
        tokenServiceInstance = new TokenService(itemName);
    }
    return tokenServiceInstance;
};

const TokenServiceInstance = getTokenServiceInstance()

export default TokenServiceInstance;