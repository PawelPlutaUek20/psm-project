import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Head from "next/head";

import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { FuegoProvider } from "@nandorojo/swr-firestore";

import fuego from "../firebase/firestore/initFirestore";
import initAuth from "../firebase/auth/initAuth";
import Layout from "../components/Layout";
import GeolocationProvider from "../components/GeolocationProvider";

initAuth();

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const publicRoutes = ["/login", "/signup"];
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="description" content="Description" />
        <meta name="keywords" content="Keywords" />
        <title>Next.js PWA Example</title>

        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          href="/icons/icon-512x512.png"
          rel="icon"
          type="image/png"
          sizes="512x512"
        />
        <link rel="apple-touch-icon" href="/apple-icon.png"></link>
        <meta name="theme-color" content="#317EFB" />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: "light",
        }}
      >
        {publicRoutes.includes(router.pathname) ? (
          <Component {...pageProps} />
        ) : (
          <FuegoProvider fuego={fuego}>
            <NotificationsProvider>
              <GeolocationProvider>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </GeolocationProvider>
            </NotificationsProvider>
          </FuegoProvider>
        )}
      </MantineProvider>
    </>
  );
}

export default MyApp;
