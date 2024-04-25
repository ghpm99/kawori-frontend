import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { refreshTokenService, verifyTokenService } from '@/services/common/auth'
import TokenService from '@/services/common/auth/authToken'
import { RootState, useAppDispatch } from '@/store'
import { setToken } from '@/store/features/common/account'

const AuthProvider: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [searchParams] = useSearchParams()
    const theme = useSelector((state: RootState) => state.common.account.theme)

    const accessToken = searchParams.get('access')
    const refreshToken = searchParams.get('refresh')

    const getUserByParams = () => {
        if (!accessToken || !refreshToken) {
            return undefined
        }

        const local = TokenService.getUser()

        const user: IUser = {
            theme: local?.theme ?? theme,
            tokens: {
                access: accessToken,
                refresh: refreshToken,
            },
            remember: local?.remember ?? true,
        }
        return user
    }

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
                navigate('/signin')
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
        const user = getUserByParams() ?? TokenService.getUser()
        if (user) {
            verifyToken(user)
        } else {
            navigate('/signin')
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
