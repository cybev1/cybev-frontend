
import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
  const useLayout = !['/login', '/register'].includes(pageProps?.route);

  return (
    <>
      {useLayout ? (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      ) : (
        <Component {...pageProps} />
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default MyApp;
