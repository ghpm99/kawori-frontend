import TokenServiceInstance from "./authToken"
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

    test("should return undefined if no token is found in localStorage or sessionStorage", () => {
        const token = TokenService.getToken();
        expect(token).toBeUndefined();
    });

    test("should return token from localStorage if it exists", () => {
        localStorage.setItem(userItemName, JSON.stringify(mockToken));
        const token = TokenService.getToken();
        expect(token).toEqual(mockToken);
    });

    test("should return token from sessionStorage if it exists and not in localStorage", () => {
        sessionStorage.setItem(userItemName, JSON.stringify(mockToken));
        const token = TokenService.getToken();
        expect(token).toEqual(mockToken);
    });


});
