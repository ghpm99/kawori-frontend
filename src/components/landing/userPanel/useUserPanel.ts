"use client";
import { useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";

const useUserPanel = () => {
    const { status, user } = useAppSelector((state: RootState) => state.auth);

    const formatDate = (date: string) => {
        const dateFormat = new Date(date);
        return dateFormat.toLocaleString();
    };

    return {
        status: status,
        data: user,
        formatDate,
    };
};

export default useUserPanel;
