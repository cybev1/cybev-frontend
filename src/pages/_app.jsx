// src/pages/_app.jsx
import '../styles/globals.css'; // adjust if your globals path differs
import GoogleAnalytics from '../components/GoogleAnalytics';

export default function App({ Component, pageProps }) {
  return (
    <>
      <GoogleAnalytics />
      <Component {...pageProps} />
    </>
  );
}
