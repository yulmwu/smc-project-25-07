import './globals.css'
import { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <main className='max-w-3xl mx-auto p-6'>
                <Component {...pageProps} />
            </main>
        </>
    )
}
