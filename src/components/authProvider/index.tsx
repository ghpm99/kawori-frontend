import { userDetailThunk, userGroupsThunk, verifyTokenThunk } from "@/lib/features/auth";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect } from "react";
import { LOCAL_STORE_ITEM_NAME } from "../constants";

const AuthProvider = ({ children }) => {
    const dispatch = useAppDispatch();

    const { status } = useAppSelector((state) => state.auth);

    const onAuthenticated = () => {
        dispatch(userDetailThunk());
        dispatch(userGroupsThunk());
    };

    const verifyLocalStore = (): boolean => {
        const localStorageToken = localStorage.getItem(LOCAL_STORE_ITEM_NAME);

        if (!localStorageToken) {
            return false;
        }
        const dateNow = new Date();
        const tokenDate = new Date(localStorageToken);

        return dateNow < tokenDate;
    };

    useEffect(() => {
        if (verifyLocalStore()) {
            dispatch(verifyTokenThunk());
        }
    }, []);

    useEffect(() => {
        if (status === "authenticated") onAuthenticated();
    }, [status]);

    return children;
};

export default AuthProvider;
