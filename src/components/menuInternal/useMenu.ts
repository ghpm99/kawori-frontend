import { useAppSelector } from "@/lib/hooks";
import { useState } from "react";

const useMenu = () => {
    const { status, user, selectedMenu } = useAppSelector((state) => state.auth);
    const theme = useAppSelector((state) => state.configuration.theme);

    const [collapsed, setCollapsed] = useState<boolean>(false);

    const toggleCollapsed = () => {
        setCollapsed((prev) => !prev);
    };

    return {
        status,
        user,
        collapsed,
        toggleCollapsed,
        selectedMenu,
        theme,
    };
};

export default useMenu;
