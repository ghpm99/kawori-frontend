"use client";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";

const useMenuHeader = () => {
    const { status, user } = useSelector((state: RootState) => state.auth);

    return {
        status: status,
        data: user,
    };
};

export default useMenuHeader;
