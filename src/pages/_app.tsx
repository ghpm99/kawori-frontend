import "antd/dist/reset.css";
import "../../styles/globals.scss";

import { ConfigProvider, theme } from "antd";
import ptBr from "antd/lib/locale/pt_BR";
import { NextComponentType, NextPageContext } from "next";

import { AppProps } from "next/app";
import Head from "next/head";
import { Provider } from "react-redux";

import LoadingPage from "../components/loadingPage/Index";
import PusherProvider from "../components/pusherProvider/Index";
import { store } from "../store/store";
import { NextPageCustom } from "../types/commonTypes";

import { Analytics } from "@vercel/analytics/react";
import { PrismicPreview } from "@prismicio/next";

type NextComponentCustom = NextComponentType<NextPageContext, any, {}> & Partial<NextPageCustom>;

type ExtendedAppProps<P = {}> = AppProps<P> &
    Partial<{
        Component: NextComponentCustom;
        pageProps: any;
    }>;

export default function MyApp({ Component, pageProps }: ExtendedAppProps) {
    return (
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
            <PrismicPreview repositoryName={"kawori-frontend"} />
        </ConfigProvider>
    );
}

interface IAuthProps {
    children: JSX.Element;
}
