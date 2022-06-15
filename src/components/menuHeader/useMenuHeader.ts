import { useSession } from 'next-auth/react'



const useMenuHeader = () => {

    const { data, status } = useSession()

    console.log(data, status)

    return {
        status,
        data,
    }
}

export default useMenuHeader