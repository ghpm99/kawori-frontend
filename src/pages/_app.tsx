import { ConfigProvider } from 'antd'
import 'antd/dist/antd.css'
import ptBr from 'antd/lib/locale/pt_BR'
import { SessionProvider, useSession } from 'next-auth/react'
import { useCallback } from 'react'
import { Provider } from 'react-redux'
import Particles from 'react-tsparticles'
import { loadFull } from 'tsparticles'
import { Engine, ISourceOptions } from 'tsparticles-engine'
import '../../styles/globals.css'
import LoadingPage from '../components/loadingPage/Index'
import PusherProvider from '../components/pusherProvider/Index'
import { store } from '../store/store'
import particlesOptions from '../../public/particles.json'

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
}, []);

  return (
    <SessionProvider session={ session }>
      <ConfigProvider locale={ ptBr }>
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
        <Particles options={particlesOptions as ISourceOptions} init={particlesInit}/>
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
