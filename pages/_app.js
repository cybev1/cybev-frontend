import '../styles/globals.css';
import Navbar from '../components/Navbar';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <main className="pt-20 px-4 md:px-12 bg-gray-50 dark:bg-black min-h-screen">
        <Component {...pageProps} />
      </main>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default MyApp;
