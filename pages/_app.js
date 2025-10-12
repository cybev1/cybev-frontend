import 'react-quill/dist/quill.snow.css';      // Quill theme (global CSS)
import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from '../components/Navbar';
import { ToastContainer } from 'react-toastify';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <main className="pt-20 px-4 md:px-12 bg-gray-50 min-h-screen dark:bg-black dark:text-white">
        <Component {...pageProps} />
      </main>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default MyApp;
