import { userDetailsThunk } from "@/lib/features/auth";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";

import { useEffect } from "react";

const useUserPanel = () => {
    const store = useAppSelector((state: RootState) => state.auth);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (store.status === "authenticated") dispatch(userDetailsThunk());
    }, [store.status]);

    const formatDate = (date: string) => {
        const dateFormat = new Date(date);
        return dateFormat.toLocaleString();
    };

    return {
        status: store.status,
        user: store.user,
        formatDate,
    };
};

export default useUserPanel;
