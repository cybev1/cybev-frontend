import { api } from '../lib/api';

export default function Health({ health }: { health: { ok: boolean; ts: number } }) {
  return (
    <main style={{ padding: 24 }}>
      <h1>CYBEV Frontend → API Health</h1>
      <pre>{JSON.stringify(health, null, 2)}</pre>
    </main>
  );
}

export async function getServerSideProps() {
  const health = await api<{ ok: boolean; ts: number }>('/api/health');
  return { props: { health } };
}
