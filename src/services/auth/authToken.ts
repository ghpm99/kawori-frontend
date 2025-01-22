export interface IToken {
    tokens: {
        refresh: string;
        access: string;
    };
    remember: boolean;
}

class TokenService {
    userItemName: string;

    status: string = "loading";

    constructor(itemName: string) {
        this.userItemName = itemName;
        this.status = "ok";
    }

    getToken(): IToken | undefined {
        const localStorageToken = localStorage.getItem(this.userItemName);
        const sessionStorageToken = sessionStorage.getItem(this.userItemName);
        const token = localStorageToken ?? sessionStorageToken ?? undefined;
        if (!token || this.status === "signout") {
            return undefined;
        }
        const user: IToken = JSON.parse(token);
        return user;
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
        this.status = "signin";
        if (token.remember) {
            localStorage.setItem(this.userItemName, JSON.stringify(token));
        } else {
            sessionStorage.setItem(this.userItemName, JSON.stringify(token));
        }
        this.status = "ok";
    }

    updateLocalAccessToken(token: string) {
        const user = this.getToken();
        if (user) {
            user.tokens.access = token;
            this.setUser(user);
        }
    }

    removeUser() {
        this.status = "signout";
        localStorage.removeItem(this.userItemName);
        sessionStorage.removeItem(this.userItemName);
    }
}

const TokenServiceInstance = new TokenService("kawori");

export default TokenServiceInstance;
