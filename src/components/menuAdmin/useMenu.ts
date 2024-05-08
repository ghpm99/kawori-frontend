"use client";

import { useAppSelector } from "@/lib/hooks";
import { useState } from "react";

const useMenu = () => {
    const { status, user } = useAppSelector((state) => state.auth);

    const [collapsed, setCollapsed] = useState<boolean>(false);

    const toggleCollapsed = () => {
        setCollapsed((prev) => !prev);
    };

    return {
        status,
        user,
        collapsed,
        toggleCollapsed,
    };
};

export default useMenu;
