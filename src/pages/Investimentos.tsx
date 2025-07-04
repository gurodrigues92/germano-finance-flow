import { useState } from "react";
import { useInvestimentos } from "@/hooks/useInvestimentos";
import { useReservaEmergencia } from "@/hooks/useReservaEmergencia";
import { InvestimentoForm } from "@/components/investimentos/InvestimentoForm";
import { ReservaEmergenciaForm } from "@/components/investimentos/ReservaEmergenciaForm";
import { InvestimentosTimeline } from "@/components/investimentos/InvestimentosTimeline";
import { Investimento } from "@/types/investimentos";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Plus, TrendingUp, DollarSign, Target, PiggyBank } from "lucide-react";

export function Investimentos() {
  const [editingInvestimento, setEditingInvestimento] = useState<Investimento | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const {
    investimentos,
    loading: investimentosLoading,
    createInvestimento,
    updateInvestimento,
    deleteInvestimento,
    totalPorCategoria,
    totalGeral,
    investimentosRecentes
  } = useInvestimentos();

  const {
    reservaAtual,
    loading: reservaLoading,
    createOrUpdateReserva,
    percentualMeta
  } = useReservaEmergencia();

  const handleCreateInvestimento = async (data: any) => {
    await createInvestimento(data);
    setShowForm(false);
  };

  const handleEditInvestimento = (investimento: Investimento) => {
    setEditingInvestimento(investimento);
  };

  const handleUpdateInvestimento = async (data: any) => {
    if (editingInvestimento) {
      await updateInvestimento(editingInvestimento.id, data);
      setEditingInvestimento(null);
    }
  };

  const handleDeleteInvestimento = async () => {
    if (deletingId) {
      await deleteInvestimento(deletingId);
      setDeletingId(null);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (investimentosLoading || reservaLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-studio-gold"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Investimentos & Reserva</h2>
          <p className="text-sm text-muted-foreground">Controle de investimentos e reserva de emergência</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-finance-studio hover:bg-finance-studio/90 text-finance-studio-foreground sm:hidden"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Investimento
        </Button>
      </div>
      
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Total Investido
            </CardTitle>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-lg sm:text-2xl font-bold text-finance-income">{formatCurrency(totalGeral)}</div>
            <p className="text-xs text-muted-foreground">
              {investimentos.length} investimentos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Investimentos Recentes
            </CardTitle>
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-lg sm:text-2xl font-bold text-finance-net">{formatCurrency(
              investimentosRecentes.reduce((total, inv) => total + Number(inv.valor), 0)
            )}</div>
            <p className="text-xs text-muted-foreground">
              últimos 30 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Reserva Emergência
            </CardTitle>
            <PiggyBank className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-lg sm:text-2xl font-bold text-finance-studio">
              {reservaAtual ? formatCurrency(Number(reservaAtual.valor_atual)) : formatCurrency(0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {percentualMeta.toFixed(1)}% da meta
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Meta da Reserva
            </CardTitle>
            <Target className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-lg sm:text-2xl font-bold text-finance-edu">
              {reservaAtual ? formatCurrency(Number(reservaAtual.meta_valor)) : formatCurrency(0)}
            </div>
            <p className="text-xs text-muted-foreground">
              valor objetivo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cards por Categoria */}
      {Object.keys(totalPorCategoria).length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {Object.entries(totalPorCategoria).map(([categoria, total]) => (
            <Card key={categoria} className="border-l-4 border-l-finance-studio">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {categoria}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-finance-studio">
                  {formatCurrency(total)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {((total / totalGeral) * 100).toFixed(1)}% do total
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tabs principais */}
      <Tabs defaultValue="investimentos" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="investimentos">Investimentos</TabsTrigger>
          <TabsTrigger value="reserva">Reserva de Emergência</TabsTrigger>
        </TabsList>

        <TabsContent value="investimentos" className="space-y-6">
          <InvestimentosTimeline
            investimentos={investimentos}
            onEdit={handleEditInvestimento}
            onDelete={setDeletingId}
          />
        </TabsContent>

        <TabsContent value="reserva" className="space-y-6">
          <ReservaEmergenciaForm
            onSubmit={createOrUpdateReserva}
            valorAtual={reservaAtual ? Number(reservaAtual.valor_atual) : 0}
            metaAtual={reservaAtual ? Number(reservaAtual.meta_valor) : 0}
            percentualMeta={percentualMeta}
          />
        </TabsContent>
      </Tabs>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Registrar Novo Investimento</DialogTitle>
          </DialogHeader>
          <InvestimentoForm onSubmit={handleCreateInvestimento} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingInvestimento} onOpenChange={() => setEditingInvestimento(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Editar Investimento</DialogTitle>
          </DialogHeader>
          {editingInvestimento && (
            <InvestimentoForm
              onSubmit={handleUpdateInvestimento}
              initialData={editingInvestimento}
              isEdit={true}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja excluir este investimento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteInvestimento} className="bg-destructive hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}