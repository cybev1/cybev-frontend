import Head from 'next/head'

export default function Home() {
  return (
    <div>
      <Head>
        <title>CYBEV Frontend</title>
      </Head>
      <main style={{ textAlign: 'center', padding: '4rem' }}>
        <h1>Welcome to CYBEV Frontend</h1>
        <p>This frontend is connected to your backend at <code>https://cybev.io</code></p>
      </main>
    </div>
  )
}