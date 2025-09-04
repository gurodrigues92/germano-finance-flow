import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { useAdvancedReports } from '@/hooks/useAdvancedReports';
import { AdvancedReportsHeader } from '@/components/reports/AdvancedReportsHeader';
import { ReportFilters } from '@/components/reports/ReportFilters';
import { TrendAnalysisChart } from '@/components/reports/TrendAnalysisChart';
import { PredictiveAnalysisCard } from '@/components/reports/PredictiveAnalysisCard';
import { PerformanceByDayChart } from '@/components/reports/PerformanceByDayChart';
import { SavedReportsPanel } from '@/components/reports/SavedReportsPanel';
import { TransactionSummary } from '@/components/finance/TransactionSummary';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

export const AdvancedReports = () => {
  const {
    filters,
    setFilters,
    filteredTransactions,
    trendAnalysis,
    predictiveAnalysis,
    performanceByDay,
    relatorios,
    exportTransactions,
    exportTrendAnalysis,
    saveCustomReport,
    deleteRelatorio
  } = useAdvancedReports();

  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [reportName, setReportName] = useState('');
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleSaveReport = async () => {
    if (!reportName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Digite um nome para o relatório",
        variant: "destructive"
      });
      return;
    }

    const result = await saveCustomReport(reportName.trim());
    if (result.success) {
      toast({
        title: "Relatório salvo",
        description: "Relatório personalizado salvo com sucesso",
      });
      setReportName('');
      setSaveDialogOpen(false);
    } else {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o relatório",
        variant: "destructive"
      });
    }
  };

  const handleDeleteReport = async (id: string) => {
    const result = await deleteRelatorio(id);
    if (result.success) {
      toast({
        title: "Relatório excluído",
        description: "Relatório removido com sucesso",
      });
    } else {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o relatório",
        variant: "destructive"
      });
    }
  };

  return (
    <PageLayout 
      title="Relatórios Avançados"
      subtitle="Analytics inteligente e previsões de performance"
    >
      {/* Header with Export Actions */}
      <AdvancedReportsHeader
        onExportTransactions={exportTransactions}
        onExportTrends={exportTrendAnalysis}
        onSaveReport={() => setSaveDialogOpen(true)}
        transactionCount={filteredTransactions.length}
        startDate={filters.startDate}
        endDate={filters.endDate}
      />

      {/* Filters */}
      <ReportFilters filters={filters} onChange={setFilters} />

      {/* Summary */}
      <div className="mb-6">
        <TransactionSummary
          transactions={filteredTransactions}
          dateStart={filters.startDate}
          dateEnd={filters.endDate}
          isCustomPeriod={true}
          totalTransactions={filteredTransactions.length}
        />
      </div>

      {/* Main Analytics Grid */}
      <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'} mb-6`}>
        {/* Trend Analysis - Full Width on Desktop */}
        <div className={isMobile ? '' : 'lg:col-span-2'}>
          <TrendAnalysisChart data={trendAnalysis} />
        </div>

        {/* Predictive Analysis */}
        <div>
          <PredictiveAnalysisCard analysis={predictiveAnalysis} />
        </div>
      </div>

      {/* Performance by Day */}
      <div className="mb-6">
        <PerformanceByDayChart data={performanceByDay} />
      </div>

      {/* Saved Reports */}
      <SavedReportsPanel
        reports={relatorios}
        onDeleteReport={handleDeleteReport}
      />

      {/* Save Report Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Salvar Relatório Personalizado</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nome do Relatório</label>
              <Input
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="Ex: Análise Trimestral 2024"
                className="mt-1"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveReport}>
                Salvar Relatório
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};