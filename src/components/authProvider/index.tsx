import { verifyTokenService } from "@/services/auth";
import { useEffect } from "react";

const AuthProvider = ({ children }) => {
    useEffect(() => {
        verifyTokenService();
    }, []);
    return children;
};

export default AuthProvider;
