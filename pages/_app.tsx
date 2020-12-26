import { AppProps } from 'next/app'
import '../styles/globals.sass'

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default App