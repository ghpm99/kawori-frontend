import { useSession } from 'next-auth/react';
import { useState } from 'react';

const useMenu = () => {

    const { status, data } = useSession()

	const [collapsed, setCollapsed] = useState<boolean>()

	const toggleCollapsed = () => {
		setCollapsed((prev) => !prev)
	}

    return {
        status,
        data: data,
        collapsed,
        toggleCollapsed,
    }
}

export default useMenu