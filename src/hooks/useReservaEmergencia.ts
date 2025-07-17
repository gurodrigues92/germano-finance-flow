import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ReservaEmergencia, ReservaEmergenciaInput } from '@/types/investimentos';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export function useReservaEmergencia() {
  const [reservas, setReservas] = useState<ReservaEmergencia[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchReservas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reserva_emergencia')
        .select('*')
        .order('mes_referencia', { ascending: false });

      if (error) throw error;
      setReservas(data || []);
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados da reserva de emergência",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createOrUpdateReserva = async (reserva: ReservaEmergenciaInput) => {
    try {
      // Verifica se já existe uma entrada para este mês
      const mesReferencia = reserva.mes_referencia.substring(0, 7); // YYYY-MM
      const { data: existing, error: checkError } = await supabase
        .from('reserva_emergencia')
        .select('*')
        .like('mes_referencia', `${mesReferencia}%`)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      let result;
      if (existing) {
        // Atualiza a entrada existente
        const { data, error } = await supabase
          .from('reserva_emergencia')
          .update(reserva)
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
        setReservas(prev => prev.map(r => r.id === existing.id ? data : r));
      } else {
        // Cria nova entrada
        const { data, error } = await supabase
          .from('reserva_emergencia')
          .insert([{ ...reserva, user_id: (await supabase.auth.getUser()).data.user?.id }])
          .select()
          .single();

        if (error) throw error;
        result = data;
        setReservas(prev => [data, ...prev]);
      }

      toast({
        title: "Sucesso",
        description: "Reserva de emergência atualizada com sucesso",
      });
      return result;
    } catch (error) {
      console.error('Erro ao salvar reserva:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar reserva de emergência",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  // Pega a reserva mais recente (do mês atual ou mais próximo)
  const reservaAtual = reservas.length > 0 ? reservas[0] : null;
  
  // Calcula o percentual da meta atingido
  const percentualMeta = reservaAtual 
    ? (Number(reservaAtual.valor_atual) / Number(reservaAtual.meta_valor)) * 100 
    : 0;

  return {
    reservas,
    reservaAtual,
    loading,
    createOrUpdateReserva,
    refetch: fetchReservas,
    percentualMeta
  };
}