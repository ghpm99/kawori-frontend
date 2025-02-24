import { userDetailThunk, userGroupsThunk, verifyTokenThunk } from "@/lib/features/auth";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect } from "react";

const AuthProvider = ({ children }) => {
    const dispatch = useAppDispatch();

    const { status } = useAppSelector((state) => state.auth);

    const onAuthenticated = () => {
        dispatch(userDetailThunk())
        dispatch(userGroupsThunk())
    }

    useEffect(() => {
        dispatch(verifyTokenThunk());
    }, []);

    useEffect(() => {
        if (status === "authenticated") onAuthenticated();
    }, [status]);

    return children;
};

export default AuthProvider;
