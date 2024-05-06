"use client";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";

const useUserPanel = () => {
    const { token, user } = useSelector((state: RootState) => state.auth);

    const formatDate = (date: string) => {
        const dateFormat = new Date(date);
        return dateFormat.toLocaleString();
    };

    return {
        status: "authenticated",
        data: {
            user,
            token,
        },
        formatDate,
    };
};

export default useUserPanel;
