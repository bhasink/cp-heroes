import '../styles/globals.css'
import '../styles/style.css'
import { useEffect } from 'react'
import { initializeScripts } from '../utils/scripts'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    initializeScripts();
  }, []);

  return <Component {...pageProps} />
}

export default MyApp