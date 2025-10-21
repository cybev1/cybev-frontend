import '@/styles/globals.css';
import 'react-quill/dist/quill.snow.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function App({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <GoogleAnalytics />
      <Component {...pageProps} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </ErrorBoundary>
  );
}
