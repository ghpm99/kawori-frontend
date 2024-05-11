"use client";

import React, { useEffect, useState } from "react"

import TokenService, { IToken } from "@/services/auth/authToken"



import { useAppDispatch } from "@/lib/hooks"
import { refreshTokenControlledRequest, verifyTokenControlledRequest } from "@/services/auth"
import { isFulfilled } from "@reduxjs/toolkit"
import { useRouter } from "next/navigation"
import { setToken } from '@/lib/features/auth'

const AuthProvider: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const navigate = useRouter();
    const [loading, setLoading] = useState(true);

    const dispatch = useAppDispatch();

    const updateValidatedToken = (token: IToken) => {
        dispatch(setToken(token));
        setLoading(false);
    };

    const refreshTokenAccess = (token: IToken) => {
        refreshTokenControlledRequest
            .dispatchRequest({ refresh: token.tokens.refresh })
            .then((response) => {
                if (isFulfilled(response)) {
                    updateValidatedToken({
                        ...token,
                        tokens: {
                            ...token.tokens,
                            access: response.payload.data.access,
                        },
                    });
                }
            })
            .catch((error) => {
                console.error(error);
                navigate.push("/signout");
            });
    };

    const verifyToken = (token: IToken) => {
        verifyTokenControlledRequest
            .dispatchRequest({ token: token.tokens.access })
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

    if (loading) {
        return <></>;
    } else {
    }
};

export default AuthProvider;
