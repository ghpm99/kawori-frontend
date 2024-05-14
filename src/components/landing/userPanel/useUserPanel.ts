

import { userDetailsControlledRequest } from "@/lib/features/auth"
import { useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { useEffect } from "react"

const useUserPanel = () => {
    const store = useAppSelector((state: RootState) => state.auth);

    console.log("store", store);

    useEffect(() => {
        userDetailsControlledRequest.dispatchRequest()
    },[])

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
