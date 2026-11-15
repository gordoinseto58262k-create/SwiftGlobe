import { createRootRoute, Outlet } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// ⚠️ SUAS CHAVES DO SUPABASE
const supabase = createClient(
  'https://fmpakiiodmmcdkfozinj.supabase.co',
  'sb_publishable_LMFzj5Gwpx99pUGWE2Y0AQ_3Holr_xj'
);

// 1. O ESPIÃO (Fica escondido registrando cliques)
function Espiao() {
  useEffect(() => {
    const registrar = async (acao: string, detalhes: string) => {
      await supabase.from('registros').insert([{ acao, detalhes }]);
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const texto = target.innerText || target.tagName;
      registrar('Clique', `Clicou em: ${texto.substring(0, 50)}`);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}

// 2. O PAINEL ADMIN
function PainelAdmin() {
  const [registros, setRegistros] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscar() {
      const { data } = await supabase
        .from('registros')
        .select('*')
        .order('data_hora', { ascending: false })
        .limit(100);
      if (data) setRegistros(data);
      setCarregando(false);
    }
    buscar();
  }, []);

  if (carregando) return <p style={{ padding: '20px' }}>Carregando registros...</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Painel de Segurança</h1>
      <table border={1} cellPadding={10} style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th>Data/Hora</th>
            <th>Ação</th>
            <th>Detalhes</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((log, index) => (
            <tr key={index}>
              <td>{new Date(log.data_hora).toLocaleString('pt-BR')}</td>
              <td>{log.acao}</td>
              <td>{log.detalhes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// 3. A RAIZ DO SITE (Onde tudo se junta)
export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  // Verifica se a URL é /admin
  const isAdmin = typeof window !== 'undefined' && window.location.pathname === '/admin';

  // Se for admin, mostra o painel. Se não, mostra o site normal (Outlet)
  if (isAdmin) {
    return <PainelAdmin />;
  }

  return (
    <>
      <Espiao />
      <Outlet />
    </>
  );
}
