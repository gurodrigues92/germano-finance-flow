import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useExcelImport = () => {
  const [importing, setImporting] = useState(false);
  const { toast } = useToast();

  const importClientesFromExcel = async () => {
    setImporting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Dados dos clientes do Excel fornecido
      const clientesData = [
        { nome: "Adriana Kuntgen", telefone: "19996592712", saldo: 0 },
        { nome: "Adriana Takechi", telefone: "15991832626", saldo: 0 },
        { nome: "Adriana Valeska", telefone: "15991856214", saldo: 0 },
        { nome: "Aimee Pavanelli", telefone: "15981818801", saldo: 0 },
        { nome: "Alcione fonseca", telefone: "15997067067", saldo: 0 },
        { nome: "Alessandra de Souza Peres", telefone: "14981281335", saldo: 0 },
        { nome: "Alessandra Holtz", telefone: "15998536026", saldo: 0 },
        { nome: "Alessandra Leria", telefone: "15996432196", saldo: 0 },
        { nome: "Alessandra Maria Ribeiro", telefone: "15998466538", saldo: 0 },
        { nome: "Alessandra Nassar", telefone: "15997542324", saldo: 0 },
        { nome: "Alessandra Vecina", telefone: "15996131317", saldo: 0 },
        { nome: "Alexandra Pedro", telefone: "15981558917", saldo: 0 },
        { nome: "Alexandre Germano", telefone: "15981310797", saldo: 0 },
        { nome: "Alexandre Oliveira", telefone: "15996848533", saldo: 0 },
        { nome: "Aline Gaspari", telefone: "15988126820", saldo: 0 },
        { nome: "Aline Lamberti", telefone: "15997596881", saldo: 0 },
        { nome: "Aline Sançon", telefone: "15991602424", saldo: 0 },
        { nome: "Amanda Aleixo", telefone: "15991753881", saldo: 0 },
        { nome: "Amanda Gabriella", telefone: "15991703101", saldo: 0 },
        { nome: "Amanda Lima", telefone: "15997333903", saldo: 0 },
        { nome: "Amanda Oliveira", telefone: "15996104636", saldo: 0 },
        { nome: "Ana Carolina Rodrigues", telefone: "15998212270", saldo: 0 },
        { nome: "Ana Carolina Salvatti", telefone: "15991151502", saldo: 0 },
        { nome: "Ana Caroline Moura", telefone: "15996164052", saldo: 0 },
        { nome: "Ana Laura", telefone: "15996452141", saldo: 0 },
        { nome: "Ana Laura Albiero", telefone: "11955940007", saldo: 0 },
        { nome: "Ana Laura Medeiros (Kam)", telefone: "15997187022", saldo: 0 },
        { nome: "Ana Lima", telefone: "15998369506", saldo: 0 },
        { nome: "Ana Luiza Padilha", telefone: "11965865455", saldo: 0 },
        { nome: "Ana Paula Cordeiro", telefone: "15996468022", saldo: 0 },
        { nome: "Ana Paula da Silva Lima", telefone: "15996244618", saldo: 0 },
        { nome: "Ana Paula Stefani (Kam)", telefone: "15981049937", saldo: 0 },
        { nome: "André Sano Vieira", telefone: "15991245741", saldo: 0 },
        { nome: "Andrea Pauletto", telefone: "15988018748", saldo: 0 },
        { nome: "Andressa Oliveira", telefone: "15996790796", saldo: 0 },
        { nome: "Ane Bueno", telefone: "15996190235", saldo: 0 },
        { nome: "Ane Caroline", telefone: "15996840311", saldo: 0 },
        { nome: "Antonela Carneiro (Kam)", telefone: "15998088284", saldo: 0 },
        { nome: "Antonio Betti Junior", telefone: "15998888988", saldo: 0 },
        { nome: "Arthur Fernando", telefone: "11971696565", saldo: 0 },
        { nome: "Arthur vicensoto Fukuhara", telefone: "34991039617", saldo: 0 },
        { nome: "Augusto (Kam)", telefone: "15997449824", saldo: 0 },
        { nome: "Bárbara Silva", telefone: "11995221995", saldo: 0 },
        { nome: "Beatriz Cardoso Poli", telefone: "15991482759", saldo: 0 },
        { nome: "Beatriz Carvajal", telefone: "15998467724", saldo: 0 },
        { nome: "Beatriz Guimarães", telefone: "16823300778", saldo: 0 },
        { nome: "Beatriz Monteiro", telefone: "11993472554", saldo: 0 },
        { nome: "Beatriz Oliveira", telefone: "15981231177", saldo: 0 },
        { nome: "Beatriz Pignataro", telefone: "15998549738", saldo: 0 },
        { nome: "Beatriz Zenebri", telefone: "8016315480", saldo: 0 },
        { nome: "Betania Oliveira", telefone: "15981791111", saldo: 0 }
      ];

      // Verificar se já existem clientes para evitar duplicatas
      const { data: existingClients } = await supabase
        .from('clientes')
        .select('nome, telefone')
        .eq('user_id', user.id);

      const existingNames = new Set(existingClients?.map(c => c.nome.toLowerCase()) || []);
      const existingPhones = new Set(existingClients?.map(c => c.telefone) || []);

      // Filtrar clientes que ainda não existem
      const newClientes = clientesData.filter(cliente => 
        !existingNames.has(cliente.nome.toLowerCase()) && 
        !existingPhones.has(cliente.telefone)
      );

      if (newClientes.length === 0) {
        toast({
          title: "Informação",
          description: "Todos os clientes do arquivo já foram importados anteriormente.",
        });
        return;
      }

      // Inserir novos clientes
      const clientesToInsert = newClientes.map(cliente => ({
        nome: cliente.nome,
        telefone: cliente.telefone,
        saldo: cliente.saldo,
        user_id: user.id,
        ativo: true,
        created_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('clientes')
        .insert(clientesToInsert);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `${newClientes.length} clientes importados com sucesso do Excel!`,
      });

    } catch (error) {
      console.error('Erro ao importar clientes:', error);
      toast({
        title: "Erro",
        description: "Erro ao importar clientes do Excel",
        variant: "destructive"
      });
    } finally {
      setImporting(false);
    }
  };

  return {
    importing,
    importClientesFromExcel
  };
};