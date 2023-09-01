import { useSession } from "next-auth/react";

const useMenuHeader = () => {
    const { data, status } = useSession();

    return {
        status,
        data,
    };
};

export default useMenuHeader;
