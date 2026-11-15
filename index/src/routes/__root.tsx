import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Outlet, createRootRoute } from '@tanstack/react-router';

// ⚠️ SUAS CHAVES DO SUPABASE JÁ ESTÃO AQUI
const supabase = createClient(
  'https://fmpakiiodmmcdkfozinj.supabase.co',
  'sb_publishable_LMFzj5Gwpx99pUGWE2Y0AQ_3Holr_xj'
);

// ==========================================
// 1. O ESPIÃO (Registra tudo no fundo)
// ==========================================
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

    const handleSubmit = () => {
      registrar('Formulário', 'Alguém enviou um formulário');
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('submit', handleSubmit);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('submit', handleSubmit);
    };
  }, []);

  return null; 
}

// ==========================================
// 2. O PAINEL ADMIN (A tela que você vê)
// ==========================================
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
      <p>Mostrando os últimos 100 cliques no site.</p>
      <table border={1} cellPadding={10} style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th>Data/Hora</th>
            <th>Ação</th>
            <th>Detalhes</th>
          </tr>
        </thead>
        <tbody>
          {registros.length === 0 ? (
            <tr>
              <td colSpan={3} style={{ textAlign: 'center' }}>Nenhum registro ainda. Clique no site para testar!</td>
            </tr>
          ) : (
            registros.map((log, index) => (
              <tr key={index}>
                <td>{new Date(log.data_hora).toLocaleString('pt-BR')}</td>
                <td>{log.acao}</td>
                <td>{log.detalhes}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ==========================================
// 3. O CÉREBRO DO SITE (Onde tudo se junta)
// ==========================================
export const Route = createRootRoute({
  component: () => {
    // Verifica se a pessoa digitou /admin no navegador
    const isAdminPage = typeof window !== 'undefined' && window.location.pathname === '/admin';

    return (
      <>
        {/* O espião fica ligado o tempo todo */}
        <Espiao /> 
        
        {/* Se estiver na página /admin, mostra o painel. Se não, mostra o site normal. */}
        {isAdminPage ? <PainelAdmin /> : <Outlet />}
      </>
    );
  },
});