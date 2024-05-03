"use client";

import { useState } from "react";

const useMenu = () => {
    const { status, data } = {
        status: "authenticated",
        data: { user: { name: "test" } },
    };

    const [collapsed, setCollapsed] = useState<boolean>(false);

    const toggleCollapsed = () => {
        setCollapsed((prev) => !prev);
    };

    return {
        status,
        data: data,
        collapsed,
        toggleCollapsed,
    };
};

export default useMenu;
