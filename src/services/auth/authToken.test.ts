import TokenService from "./authToken";

describe("TokenService getToken", () => {
    const userItemName = "kawori";
    const mockToken = {
        tokens: {
            refresh: "mockRefreshToken",
            access: "mockAccessToken",
        },
        remember: true,
    };

    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();
    });

    it("should return undefined if no token is found in localStorage or sessionStorage", () => {
        const token = TokenService.getToken();
        expect(token).toBeUndefined();
    });

    it("should return token from localStorage if it exists", () => {
        localStorage.setItem(userItemName, JSON.stringify(mockToken));
        const token = TokenService.getToken();
        expect(token).toEqual(mockToken);
    });

    it("should return token from sessionStorage if it exists and not in localStorage", () => {
        sessionStorage.setItem(userItemName, JSON.stringify(mockToken));
        const token = TokenService.getToken();
        expect(token).toEqual(mockToken);
    });

    it("should prefer localStorage token over sessionStorage token if both exist", () => {
        const localStorageToken = {
            ...mockToken,
            tokens: { refresh: "localRefreshToken", access: "localAccessToken" },
        };
        localStorage.setItem(userItemName, JSON.stringify(localStorageToken));
        sessionStorage.setItem(userItemName, JSON.stringify(mockToken));
        const token = TokenService.getToken();
        expect(token).toEqual(localStorageToken);
    });

    it("should return undefined if JSON parsing fails", () => {
        localStorage.setItem(userItemName, "invalidJSON");
        const token = TokenService.getToken();
        expect(token).toBeUndefined();
    });
});
