"use client";

import { userDetailsControlledRequest } from "@/lib/features/auth"
import { useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { useEffect } from "react"

const useUserPanel = () => {
    const { status, user } = useAppSelector((state: RootState) => state.auth);

    useEffect(() => {
        userDetailsControlledRequest.dispatchRequest()
    },[])

    const formatDate = (date: string) => {
        const dateFormat = new Date(date);
        return dateFormat.toLocaleString();
    };

    return {
        status,
        user,
        formatDate,
    };
};

export default useUserPanel;
