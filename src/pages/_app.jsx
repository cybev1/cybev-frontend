import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { SocketProvider } from '@/context/SocketContext';
import { Web3Provider } from '@/context/Web3Context';

export default function App({ Component, pageProps }) {
  return (
    <Web3Provider>
      <SocketProvider>
        <Component {...pageProps} />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </SocketProvider>
    </Web3Provider>
  );
}
