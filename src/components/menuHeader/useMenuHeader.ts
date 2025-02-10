import { changeTheme } from "@/lib/features/configuration";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";

const useMenuHeader = () => {
    const { status, user } = useSelector((state: RootState) => state.auth);
    const theme = useAppSelector((state) => state.configuration.theme);

    return {
        status: status,
        data: user,
        theme: theme,
    };
};

export default useMenuHeader;
