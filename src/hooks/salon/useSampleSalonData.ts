import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSampleSalonData = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  const initializeSampleData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if data already exists
      const { data: existingProfissionais } = await supabase
        .from('profissionais')
        .select('id')
        .limit(1);

      if (existingProfissionais && existingProfissionais.length > 0) {
        setIsInitialized(true);
        return;
      }

      // Sample Profissionais
      const sampleProfissionais = [
        {
          nome: 'Eduardo Germano',
          tipo: 'cabeleireiro',
          percentual_comissao: 40.00,
          cor_agenda: '#8B5CF6',
          telefone: '(11) 99999-0001',
          email: 'eduardo@germanostudio.com',
          user_id: user.id
        },
        {
          nome: 'Kamlley Zapata',
          tipo: 'assistente',
          percentual_comissao: 10.00,
          cor_agenda: '#EF4444',
          telefone: '(11) 99999-0002',
          email: 'kamlley@germanostudio.com',
          user_id: user.id
        }
      ];

      const { data: profissionais, error: profError } = await supabase
        .from('profissionais')
        .insert(sampleProfissionais)
        .select();

      if (profError) throw profError;

      // Sample Serviços
      const sampleServicos = [
        {
          nome: 'Corte Masculino',
          categoria: 'Corte',
          preco: 45.00,
          duracao_minutos: 30,
          cor_categoria: '#8B5CF6',
          user_id: user.id
        },
        {
          nome: 'Corte + Barba',
          categoria: 'Corte',
          preco: 65.00,
          duracao_minutos: 45,
          cor_categoria: '#8B5CF6',
          user_id: user.id
        },
        {
          nome: 'Coloração',
          categoria: 'Coloração',
          preco: 120.00,
          duracao_minutos: 90,
          cor_categoria: '#EF4444',
          user_id: user.id
        },
        {
          nome: 'Luzes',
          categoria: 'Coloração',
          preco: 150.00,
          duracao_minutos: 120,
          cor_categoria: '#EF4444',
          user_id: user.id
        }
      ];

      const { error: servicosError } = await supabase
        .from('servicos')
        .insert(sampleServicos);

      if (servicosError) throw servicosError;

      // Sample Clientes
      const sampleClientes = [
        {
          nome: 'João Silva',
          telefone: '(11) 98765-4321',
          email: 'joao@email.com',
          saldo: 0,
          user_id: user.id
        },
        {
          nome: 'Maria Santos',
          telefone: '(11) 97654-3210',
          email: 'maria@email.com',
          saldo: 25.00,
          user_id: user.id
        },
        {
          nome: 'Pedro Costa',
          telefone: '(11) 96543-2109',
          saldo: -15.00,
          user_id: user.id
        }
      ];

      const { error: clientesError } = await supabase
        .from('clientes')
        .insert(sampleClientes);

      if (clientesError) throw clientesError;

      setIsInitialized(true);
      toast({
        title: "Dados de demonstração criados",
        description: "Profissionais, serviços e clientes de exemplo foram adicionados ao sistema"
      });

    } catch (error) {
      console.error('Erro ao inicializar dados de exemplo:', error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      initializeSampleData();
    }, 2000); // Wait 2 seconds after mount

    return () => clearTimeout(timer);
  }, []);

  return { isInitialized, initializeSampleData };
};