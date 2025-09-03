import { ConfiguracoesProvider } from '@/contexts/ConfiguracoesContext';
import { PageLayout } from '@/components/layout/PageLayout';
import { ConfiguracoesLayout } from '@/components/configuracoes/ConfiguracoesLayout';

export default function Configuracoes() {
  return (
    <ConfiguracoesProvider>
      <PageLayout title="Configurações" subtitle="Personalize seu sistema">
        <ConfiguracoesLayout />
      </PageLayout>
    </ConfiguracoesProvider>
  );
}