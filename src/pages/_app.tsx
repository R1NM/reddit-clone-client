import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Axios  from 'axios'
import { AuthProvider } from '../context/auth';
import { useRouter } from 'next/router';
import NavBar from '../components/NavBar';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  Axios.defaults.baseURL=process.env.NEXT_PUBLIC_SERVER_BASE_URL+"/api";
  Axios.defaults.withCredentials=true;

  // navbar is unavailable on register and login page
  const {pathname} = useRouter();
  const authRoutes = ["/register","/login"]
  const authRoute = authRoutes.includes(pathname)


  return <AuthProvider>
    <Head>
        <title>Reddit_Clone</title>
        <link rel="icon" href="/favicon.ico" />
    </Head>
    {!authRoute && <NavBar/>}
    <div className={authRoute ? "" : "pt-16"}>
      <Component {...pageProps} />
    </div>
  </AuthProvider>
}
