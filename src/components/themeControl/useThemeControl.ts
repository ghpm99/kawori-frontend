import { changeTheme } from "@/lib/features/configuration";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

const useThemeControl = () => {
    const theme = useAppSelector((state) => state.configuration.theme);
    const dispatch = useAppDispatch();

    const toggleTheme = () => {
        dispatch(changeTheme(theme === "light" ? "dark" : "light"));
    };

    return {
        theme,
        toggleTheme,
    };
};

export default useThemeControl;
