import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

const useMenuHeader = () => {
    const { token, user } = useSelector((state: RootState) => state.auth);

    return {
        status: "authenticated",
        data: {
            user,
            token,
        },
    };
};

export default useMenuHeader;
