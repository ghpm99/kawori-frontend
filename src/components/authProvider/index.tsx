import { userDetailThunk, userGroupsThunk, verifyTokenThunk } from "@/lib/features/auth";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useCallback, useEffect } from "react";
import { LOCAL_STORE_ITEM_NAME } from "../constants";
import { useRouter } from "next/navigation";

const AuthProvider = ({ children }) => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { status } = useAppSelector((state) => state.auth);
    const loadingStore = useAppSelector((state) => state.loading);

    const onAuthenticated = useCallback(() => {
        dispatch(userDetailThunk());
        dispatch(userGroupsThunk());
    }, [dispatch]);

    const verifyLocalStore = (): boolean => {
        const localStorageToken = localStorage.getItem(LOCAL_STORE_ITEM_NAME);

        if (!localStorageToken) {
            return false;
        }
        const dateNow = new Date();
        const tokenDate = new Date(localStorageToken);

        return dateNow < tokenDate;
    };

    const loadingAuth = ((): boolean => {
        const verifyTokenLoading = !(loadingStore.effects["auth/verify"] === 'idle')
        const signinLoading = !(loadingStore.effects["auth/signin"] === 'idle')

        return verifyTokenLoading || signinLoading
    })()

    const hasAuthenticatedFailed = loadingStore.effects["auth/verify"] === "failed"
    console.log(hasAuthenticatedFailed, loadingStore.effects)

    useEffect(() => {
        if (verifyLocalStore()) {
            dispatch(verifyTokenThunk());
        }
    }, []);

    useEffect(() => {
        console.log("AuthProvider loading", loadingAuth)
        if (loadingAuth) return;
        if (status === "authenticated") onAuthenticated();
        else router.push("/signout");
    }, [status, loadingAuth, onAuthenticated, router]);

   useEffect(() => {
        console.log("falhou em autenticar", hasAuthenticatedFailed)
        if(hasAuthenticatedFailed){
            router.push("/signout")
        }
   }, [hasAuthenticatedFailed])

    return children;
};

export default AuthProvider;
