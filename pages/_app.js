
import '../styles/globals.css'
import Navbar from '../components/Navbar'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <main className="pt-20 px-4 md:px-12 bg-gray-50 min-h-screen">
        <Component {...pageProps} />
      </main>
    </>
  )
}

export default MyApp
