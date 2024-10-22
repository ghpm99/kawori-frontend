import React from "react";
import { render, waitFor } from "@testing-library/react";

import AuthProvider from "./index";
import TokenService from "@/services/auth/authToken";
import { setLoading, setToken, userDetailsThunk } from "@/lib/features/auth";
import { useAppDispatch } from "@/lib/hooks";
import { refreshTokenService, verifyTokenService } from "@/services/auth";
import { useRouter } from "next/navigation";

jest.mock("@/services/auth/authToken");
jest.mock("@/lib/features/auth");
jest.mock("@/lib/hooks");
jest.mock("@/services/auth");
jest.mock("next/navigation");

describe("AuthProvider", () => {
    const mockDispatch = jest.fn();
    const mockNavigate = { push: jest.fn() };

    beforeEach(() => {
        jest.clearAllMocks();
        (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
        (useRouter as jest.Mock).mockReturnValue(mockNavigate);
    });

    test("should dispatch setLoading(false) if no user token is found", async () => {
        (TokenService.getToken as jest.Mock).mockReturnValue(null);

        render(
            <AuthProvider>
                <div>Test</div>
            </AuthProvider>,
        );

        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith(setLoading(false));
        });
    });

    test("should verify token if user token is found", async () => {
        const mockToken = { tokens: { access: "access-token", refresh: "refresh-token" } };
        (TokenService.getToken as jest.Mock).mockReturnValue(mockToken);
        (verifyTokenService as jest.Mock).mockResolvedValue({});

        render(
            <AuthProvider>
                <div>Test</div>
            </AuthProvider>,
        );

        await waitFor(() => {
            expect(verifyTokenService).toHaveBeenCalledWith({ token: "access-token" });
            expect(mockDispatch).toHaveBeenCalledWith(setToken(mockToken));
            expect(mockDispatch).toHaveBeenCalledWith(userDetailsThunk());
            expect(mockDispatch).toHaveBeenCalledWith(setLoading(false));
        });
    });

    test("should refresh token if access token verification fails", async () => {
        const mockToken = { tokens: { access: "access-token", refresh: "refresh-token" } };
        (TokenService.getToken as jest.Mock).mockReturnValue(mockToken);
        (verifyTokenService as jest.Mock).mockRejectedValue({});
        (refreshTokenService as jest.Mock).mockResolvedValue({ data: { access: "new-access-token" } });

        render(
            <AuthProvider>
                <div>Test</div>
            </AuthProvider>,
        );

        await waitFor(() => {
            expect(verifyTokenService).toHaveBeenCalledWith({ token: "access-token" });
            expect(refreshTokenService).toHaveBeenCalledWith({ refresh: "refresh-token" });
            expect(mockDispatch).toHaveBeenCalledWith(
                setToken({
                    ...mockToken,
                    tokens: {
                        ...mockToken.tokens,
                        access: "new-access-token",
                    },
                }),
            );
            expect(mockDispatch).toHaveBeenCalledWith(userDetailsThunk());
            expect(mockDispatch).toHaveBeenCalledWith(setLoading(false));
        });
    });

    test("should navigate to /signout if token refresh fails", async () => {
        const mockToken = { tokens: { access: "access-token", refresh: "refresh-token" } };
        (TokenService.getToken as jest.Mock).mockReturnValue(mockToken);
        (verifyTokenService as jest.Mock).mockRejectedValue({});
        (refreshTokenService as jest.Mock).mockRejectedValue({});

        render(
            <AuthProvider>
                <div>Test</div>
            </AuthProvider>,
        );

        await waitFor(() => {
            expect(verifyTokenService).toHaveBeenCalledWith({ token: "access-token" });
            expect(refreshTokenService).toHaveBeenCalledWith({ refresh: "refresh-token" });
            expect(mockNavigate.push).toHaveBeenCalledWith("/signout");
        });
    });
});
