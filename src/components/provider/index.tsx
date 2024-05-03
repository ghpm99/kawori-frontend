"use client";

import React, { useEffect, useState } from "react";

import TokenService, { IToken } from "@/services/auth/authToken";

import { setToken } from "@/store/features/auth";
import { useAppDispatch } from "@/store/store";

import { useRouter } from "next/router";
import { refreshTokenControlledRequest, verifyTokenControlledRequest } from "@/services/auth";
import { isFulfilled } from "@reduxjs/toolkit";

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
            .dispatchRequest({ refreshToken: token.tokens.refresh })
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
            .catch(() => {
                navigate.push("/signout");
            });
    };

    const verifyToken = (token: IToken) => {
        verifyTokenControlledRequest
            .dispatchRequest({ accessToken: token.tokens.access })
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
        } else {
            navigate.push("/signout");
            return;
        }
    }, []);

    if (loading) {
        return <></>;
    } else {
        return children;
    }
};

export default AuthProvider;
