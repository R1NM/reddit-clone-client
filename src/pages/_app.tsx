import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Axios  from 'axios'
import { AuthProvider } from '../context/auth';
import { useRouter } from 'next/router';
import NavBar from '../components/NavBar';
import Head from 'next/head';
import { library , config} from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { SWRConfig } from 'swr';
import axios from 'axios';


export default function App({ Component, pageProps }: AppProps) {
  Axios.defaults.baseURL=process.env.NEXT_PUBLIC_SERVER_BASE_URL+"/api";
  Axios.defaults.withCredentials=true;

  library.add(fas)
  config.autoAddCss=false


  // navbar is unavailable on register and login page
  const {pathname} = useRouter();
  const authRoutes = ["/register","/login"]
  const authRoute = authRoutes.includes(pathname)

  //swr fetcher
  const fetcher =async (url:string) => {
    try {
        const res  = await axios.get(url);
        return res.data
    } catch (error:any) {
        throw error.response.data
    }
  }

  return <SWRConfig
    value={{fetcher}}
  >
    <AuthProvider>
    <Head>
        <title>Reddit_Clone</title>
        <link rel="icon" href="/favicon.ico" />
    </Head>
    {!authRoute && <NavBar/>}
    <div className={authRoute ? "" : "pt-16 bg-gray-100 min-h-screen"}>
      <Component {...pageProps} />
    </div>
  </AuthProvider>
  </SWRConfig>
  
}
