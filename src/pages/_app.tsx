import { ConfigProvider } from 'antd'
import 'antd/dist/antd.css'
import ptBr from 'antd/lib/locale/pt_BR'
import { SessionProvider, useSession } from 'next-auth/react'
import Head from 'next/head'
import { Provider } from 'react-redux'
import '../../styles/globals.css'
import LoadingPage from '../components/loadingPage/Index'
import PusherProvider from '../components/pusherProvider/Index'
import { store } from '../store/store'


export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {

  return (
    <SessionProvider session={ session }>
      <ConfigProvider locale={ ptBr }>
        <Head>
          <title>Kawori</title>
        </Head>
        { Component.auth ? (
          Component.pusher ? (
            <Auth>
              <Provider store={ store }>
                <PusherProvider>
                  <Component { ...pageProps } />
                </PusherProvider>
              </Provider>
            </Auth>
          ) : (
            <Auth>
              <Provider store={ store }>
                <Component { ...pageProps } />
              </Provider>
            </Auth>
          )

        ) : (
          <Provider store={ store }>
            <Component { ...pageProps } />
          </Provider>
        ) }
      </ConfigProvider>
    </SessionProvider>
  )
}

function Auth({ children }) {
  const { data: session, status } = useSession({ required: true })
  const isUser = !!session?.user

  if (isUser) {
    return children
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <LoadingPage />
}
