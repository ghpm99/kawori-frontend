import { MenuProps } from 'antd';
import { ItemType } from 'antd/lib/menu/hooks/useItems'
import { useSession } from 'next-auth/react'
import { useState } from 'react'




const useMenu = () => {

    const { status } = useSession()

	const [collapsed, setCollapsed] = useState<boolean>()

	const toggleCollapsed = () => {
		setCollapsed((prev) => !prev)
	}

    return {
        status,
        collapsed,
        toggleCollapsed,
    }
}

export default useMenu