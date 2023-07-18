import '@/styles/globals.css'
import { Londrina_Shadow, Kalam } from 'next/font/google'
import type { AppProps } from 'next/app'
import AppHeader from '@/components/layout/Header'
import AppFooter from '@/components/layout/Footer'

// const lond = Londrina_Shadow({
//   weight: ['400'],
//   subsets: ['latin'],
//   variable: '--font-lond'
// })
const kalam = Kalam({ 
  subsets: ['latin'],
  weight:["400"],
  variable: '--font-kalam',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
  <div className={`${kalam.variable}`}>
    <AppHeader />
    <Component {...pageProps} />
    {/* <AppFooter /> */}
  </div>
  )
}
