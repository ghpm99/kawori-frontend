import { userDetailThunk, verifyTokenThunk } from "@/lib/features/auth";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect } from "react";

const AuthProvider = ({ children }) => {
    const dispatch = useAppDispatch();

    const { status } = useAppSelector((state) => state.auth);

    useEffect(() => {
        dispatch(verifyTokenThunk());
    }, []);

    useEffect(() => {
        if (status === "authenticated") dispatch(userDetailThunk());
    }, [status, dispatch]);

    return children;
};

export default AuthProvider;
