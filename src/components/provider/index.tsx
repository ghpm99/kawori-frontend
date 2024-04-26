import React, { useEffect, useState } from 'react'


import { refreshTokenService, verifyTokenService } from '@/services/common/auth'
import TokenService from '@/services/common/auth/authToken'

import { setToken } from '@/store/features/auth'
import { useAppDispatch } from '@/store/store'

import { useRouter } from 'next/router'

const AuthProvider: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const navigate = useRouter()
    const [loading, setLoading] = useState(true)


    const dispatch = useAppDispatch()

    const updateValidatedToken = (user: IUser) => {
        dispatch(setToken(user))
        setLoading(false)
    }

    const refreshTokenAccess = (user: IUser) => {
        refreshTokenService(user.tokens.refresh)
            .then((response) => {
                updateValidatedToken({
                    ...user,
                    tokens: {
                        ...user.tokens,
                        access: response.data.access,
                    },
                })
            })
            .catch(() => {
                navigate.push('/signin')
            })
    }

    const verifyToken = (user: IUser) => {
        verifyTokenService(user.tokens.access)
            .then(() => {
                updateValidatedToken(user)
            })
            .catch(() => {
                refreshTokenAccess(user)
            })
    }

    useEffect(() => {
        const user = TokenService.getUser()
        if (user) {
            verifyToken(user)
        } else {
            navigate.push('/signin')
            return
        }
    }, [])

    if (loading) {
        return <></>
    } else {
        return children
    }
}

export default AuthProvider
