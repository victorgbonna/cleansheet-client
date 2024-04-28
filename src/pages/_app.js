import "@/styles/globals.css";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"

import { Roboto, Nunito, Inter } from 'next/font/google'

const roboto= Roboto({
  subsets:["latin"],
  weight:['100', '300', '400' ,'500', '700'],
  variable: '--font-roboto',

})
const nunito= Nunito({
  subsets:["latin"],
  weight:['300', '400' ,'500', '700'],
  variable: '--font-nunito',

})
const inter= Inter({
  subsets:["latin"],
  weight:['300', '400' ,'500', '700'],
  variable: '--font-inter',

})
// import { MainLayout } from '@/components'

import { EnterChatContextComponent } from '@/context'

const queryClient = new QueryClient();
const queryCache = new QueryCache();

export default function App({ Component, pageProps }) {
  return(<div className={roboto.variable+' '+nunito.variable+' '+inter.variable}>
    <QueryClientProvider client={queryClient} queryCache={queryCache}>
    <EnterChatContextComponent>
      {/* <MainLayout> */}
        <Component {...pageProps} />  
      {/* </MainLayout> */}
    </EnterChatContextComponent>
    </QueryClientProvider>
  </div>)
}