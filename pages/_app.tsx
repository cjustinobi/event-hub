import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import AppHeader from '@/components/layout/Header'
import AppFooter from '@/components/layout/Footer'

export default function App({ Component, pageProps }: AppProps) {
  return (
  <>
    <AppHeader>heafe</AppHeader>
    <Component {...pageProps} />
    <AppFooter>footer</AppFooter>
  </>
  )
}
