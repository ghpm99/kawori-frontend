import { useAppDispatch } from '@/lib/hooks'
import { verifyTokenThunk } from '@/services/auth'
import { useEffect } from "react";

const AuthProvider = ({ children }) => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(verifyTokenThunk())
    }, []);
    return children;
};

export default AuthProvider;
