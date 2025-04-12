'use client'

import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Inter } from 'next/font/google'
import Layout from '@/components/Layout'
import { AnimatePresence, motion } from 'framer-motion'
import { ThirdwebProvider, metamaskWallet, coinbaseWallet, walletConnect } from "@thirdweb-dev/react"
import { Polygon } from "@thirdweb-dev/chains"

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export default function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <ThirdwebProvider
      activeChain={Polygon}
      clientId="7150c0afa154a5ab4a82ccf3e45d4346"
      supportedWallets={[metamaskWallet(), coinbaseWallet(), walletConnect()]}
    >
      <Head>
        <title>MYKS Global Investment</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <meta name="description" content="Empowering global investors through MYKS – a blockchain-based investment ecosystem with profit sharing and transparency." />
        <meta name="keywords" content="MYKS, investment, blockchain, token, global investors, smart contract, profit sharing, Web3" />
        <meta name="author" content="MYKS Global Team" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={`${inter.variable} bg-[var(--color-background)] text-[var(--color-text)]`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={router.route}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </motion.div>
        </AnimatePresence>
      </main>
    </ThirdwebProvider>
  )
}