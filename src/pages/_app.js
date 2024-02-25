import "@/styles/globals.css";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"

const queryClient = new QueryClient();
const queryCache = new QueryCache();

export default function App({ Component, pageProps }) {
  return( 
  <QueryClientProvider client={queryClient} queryCache={queryCache}>
    <Component {...pageProps} />;
  </QueryClientProvider>
  )
}
