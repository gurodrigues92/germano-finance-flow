import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Palette, DollarSign, Building, Bell, FileText } from 'lucide-react';
import { NomenclaturaCard } from './NomenclaturaCard';
import { FinanceSettingsCard } from './FinanceSettingsCard';
import { AppearanceCard } from './AppearanceCard';
import { EstablishmentCard } from './EstablishmentCard';
import { useConfiguracoes } from '@/contexts/ConfiguracoesContext';

export const ConfiguracoesLayout = () => {
  const { isLoading } = useConfiguracoes();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold text-foreground">Configurações do Sistema</h2>
          <p className="text-muted-foreground">Personalize o sistema de acordo com suas necessidades</p>
        </div>
      </div>

      <Tabs defaultValue="nomenclatura" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
          <TabsTrigger value="nomenclatura" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Nomenclaturas</span>
          </TabsTrigger>
          <TabsTrigger value="financeiro" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Financeiro</span>
          </TabsTrigger>
          <TabsTrigger value="aparencia" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Aparência</span>
          </TabsTrigger>
          <TabsTrigger value="estabelecimento" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">Estabelecimento</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="nomenclatura" className="space-y-4">
            <NomenclaturaCard />
          </TabsContent>

          <TabsContent value="financeiro" className="space-y-4">
            <FinanceSettingsCard />
          </TabsContent>

          <TabsContent value="aparencia" className="space-y-4">
            <AppearanceCard />
          </TabsContent>

          <TabsContent value="estabelecimento" className="space-y-4">
            <EstablishmentCard />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};