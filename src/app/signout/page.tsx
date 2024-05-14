

import { signout } from '@/lib/features/auth'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Signout() {

    const dispatch = useAppDispatch()
    const navigate = useRouter();
    const authStore = useAppSelector(state => state.auth)
    useEffect(() => {
        if(authStore.status === 'unauthenticated'){
            navigate.push("/");
        }else{
            dispatch(signout())
        }
    },[authStore.status])



    return <div>Deslogando</div>;
}
