<<<<<<< HEAD
import '../../styles/globals.scss'
import 'antd/dist/reset.css'

import { Analytics } from '@vercel/analytics/react'
=======
import 'antd/dist/reset.css'
import '../../styles/globals.scss'

>>>>>>> dev
import { ConfigProvider } from 'antd'
import ptBr from 'antd/lib/locale/pt_BR'
import { NextComponentType, NextPageContext } from 'next'
import { SessionProvider, useSession } from 'next-auth/react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { Provider } from 'react-redux'

import LoadingPage from '../components/loadingPage/Index'
import PusherProvider from '../components/pusherProvider/Index'
import { store } from '../store/store'
import { NextPageCustom } from '../types/commonTypes'

<<<<<<< HEAD
type NextComponentCustom = NextComponentType<NextPageContext, any, Record<string, never>> & Partial<NextPageCustom>

type ExtendedAppProps<P = Record<string, never>> = AppProps<P> &
=======
import { Analytics } from '@vercel/analytics/react'

type NextComponentCustom = NextComponentType<NextPageContext, any, {}> & Partial<NextPageCustom>

type ExtendedAppProps<P = {}> = AppProps<P> &
>>>>>>> dev
    Partial<{
        Component: NextComponentCustom
        pageProps: any
    }>

export default function MyApp({ Component, pageProps }: ExtendedAppProps) {
    return (
        <SessionProvider session={pageProps.session}>
            <ConfigProvider locale={ptBr}>
                <Head>
                    <title>Kawori</title>
                </Head>
                {Component.auth ? (
                    Component.pusher ? (
                        <Auth>
                            <Provider store={store}>
                                <PusherProvider>
                                    <Component {...pageProps} />
                                </PusherProvider>
                            </Provider>
                        </Auth>
                    ) : (
                        <Auth>
                            <Provider store={store}>
                                <Component {...pageProps} />
                            </Provider>
                        </Auth>
                    )
                ) : (
                    <Provider store={store}>
                        <Component {...pageProps} />
                    </Provider>
                )}
                <Analytics />
            </ConfigProvider>
        </SessionProvider>
    )
}

interface IAuthProps {
    children: JSX.Element
}

function Auth({ children }: IAuthProps) {
    const { data: session, status } = useSession({ required: true })
    const isUser = !!session?.user

    if (isUser) {
        return children
    }

    // Session is being fetched, or no user.
    // If no user, useEffect() will redirect.
    return <LoadingPage />
}
