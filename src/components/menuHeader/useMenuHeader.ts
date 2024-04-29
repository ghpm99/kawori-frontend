import { RootState } from "@/store/store"
import { useSelector } from "react-redux"


const useMenuHeader = () => {
    const { token } = useSelector((state: RootState) => state.auth)

    return {
        status: 'authenticated',
        data: {
            token,
        },
    };
};

export default useMenuHeader;
