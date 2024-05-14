import React, { useEffect } from "react";

import TokenService, { IToken } from "@/services/auth/authToken";

import { setToken, userDetailsThunk } from "@/lib/features/auth";
import { useAppDispatch } from "@/lib/hooks";
import { refreshTokenService, verifyTokenService } from "@/services/auth";

import { useRouter } from "next/navigation";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const navigate = useRouter();
    const dispatch = useAppDispatch();

    const updateValidatedToken = (token: IToken) => {
        dispatch(setToken(token));
        dispatch(userDetailsThunk());
    };

    const refreshTokenAccess = (token: IToken) => {
        refreshTokenService({ refresh: token.tokens.refresh })
            .then((response) => {
                updateValidatedToken({
                    ...token,
                    tokens: {
                        ...token.tokens,
                        access: response.data.access,
                    },
                });
            })
            .catch((error) => {
                console.error(error);
                navigate.push("/signout");
            });
    };

    const verifyToken = (token: IToken) => {
        verifyTokenService({ token: token.tokens.access })
            .then(() => {
                updateValidatedToken(token);
            })
            .catch(() => {
                refreshTokenAccess(token);
            });
    };

    useEffect(() => {
        const user = TokenService.getToken();
        if (user) {
            verifyToken(user);
        }
    }, []);
    return children;
}
