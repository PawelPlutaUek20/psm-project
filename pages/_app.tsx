import type { AppProps } from "next/app";

import "bootstrap/dist/css/bootstrap.min.css";

import initAuth from '../utils/initAuth'

initAuth()

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
