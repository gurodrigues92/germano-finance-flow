import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Database, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { useFinance } from '@/hooks/useFinance';

export const MigrationPrompt = () => {
  const { migrateFromLocalStorage, isUsingSupabase, transactions } = useFinance();
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationComplete, setMigrationComplete] = useState(false);

  // Se já está usando Supabase, não mostrar
  if (isUsingSupabase) return null;

  // Se não há dados no localStorage, não mostrar
  if (transactions.length === 0) return null;

  const handleMigration = async () => {
    setIsMigrating(true);
    try {
      const success = await migrateFromLocalStorage();
      if (success) {
        setMigrationComplete(true);
        // Recarregar página após migração para usar dados do Supabase
        setTimeout(() => window.location.reload(), 2000);
      }
    } catch (error) {
      console.error('Erro na migração:', error);
    } finally {
      setIsMigrating(false);
    }
  };

  if (migrationComplete) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-800">Migração Concluída!</h3>
              <p className="text-sm text-green-600">
                Seus dados foram migrados para o Supabase. Recarregando...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <AlertCircle className="h-5 w-5" />
          Migração para Banco de Dados
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-orange-700">
          Suas transações estão armazenadas localmente no navegador. 
          Migre para o banco de dados para maior segurança e sincronização.
        </p>
        
        <div className="flex items-center gap-2 text-sm text-orange-600">
          <Database className="h-4 w-4" />
          <span>{transactions.length} transações encontradas</span>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="w-full" variant="outline" disabled={isMigrating}>
              <Upload className="h-4 w-4 mr-2" />
              {isMigrating ? 'Migrando...' : 'Migrar para Supabase'}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Migrar Dados para Supabase</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação irá migrar todas as suas {transactions.length} transações do 
                armazenamento local para o banco de dados Supabase. 
                
                <br/><br/>
                
                <strong>Benefícios:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Dados seguros e protegidos</li>
                  <li>Sincronização entre dispositivos</li>
                  <li>Backup automático</li>
                  <li>Melhor performance</li>
                </ul>
                
                <br/>
                
                Deseja continuar?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleMigration} disabled={isMigrating}>
                {isMigrating ? 'Migrando...' : 'Sim, Migrar Dados'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};