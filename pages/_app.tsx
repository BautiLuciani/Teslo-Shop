import { AuthProvider, CartProvider, UiProvider } from '@/context'
import '@/styles/globals.css'
import { lightTheme } from '@/themes'
import { CssBaseline, ThemeProvider } from '@mui/material'
import type { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import { SessionProvider } from 'next-auth/react'
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <PayPalScriptProvider options={{ 'clientId': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '' }}>
        {/* SWRConfig es el provider de SWR */}
        <SWRConfig
          value={{
            /* Definimos el fetcher globalmente, este fetcher esta en la documentacion oficial */
            fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
          }}
        >
          <AuthProvider>
            <CartProvider>
              <UiProvider>
                <ThemeProvider theme={lightTheme}>
                  <CssBaseline />
                  <Component {...pageProps} />
                </ThemeProvider>
              </UiProvider>
            </CartProvider>
          </AuthProvider>
        </SWRConfig>
      </PayPalScriptProvider>
    </SessionProvider>
  )
}
