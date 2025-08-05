import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, FileText, Calendar, Download } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatDate } from '@/lib/formatUtils';

interface SavedReport {
  id: string;
  nome: string;
  tipo: string;
  data_inicio?: string;
  data_fim?: string;
  created_at: string;
  configuracao: any;
}

interface SavedReportsPanelProps {
  reports: SavedReport[];
  onDeleteReport: (id: string) => void;
  onLoadReport?: (report: SavedReport) => void;
}

export const SavedReportsPanel = ({ reports, onDeleteReport, onLoadReport }: SavedReportsPanelProps) => {
  const isMobile = useIsMobile();

  const getTypeColor = (tipo: string) => {
    switch (tipo) {
      case 'mensal': return 'bg-blue-500';
      case 'trimestral': return 'bg-green-500';
      case 'anual': return 'bg-purple-500';
      case 'personalizado': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeLabel = (tipo: string) => {
    switch (tipo) {
      case 'mensal': return 'Mensal';
      case 'trimestral': return 'Trimestral';
      case 'anual': return 'Anual';
      case 'personalizado': return 'Personalizado';
      default: return tipo;
    }
  };

  if (reports.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} text-foreground`}>
            Relatórios Salvos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Nenhum relatório salvo ainda</p>
            <p className="text-sm">Salve seus relatórios personalizados para acesso rápido</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} text-foreground flex items-center gap-2`}>
          <FileText className="w-5 h-5" />
          Relatórios Salvos ({reports.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {reports.map((report) => (
            <div 
              key={report.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`${isMobile ? 'text-sm' : 'text-base'} font-medium text-foreground truncate`}>
                    {report.nome}
                  </h4>
                  <Badge className={`${getTypeColor(report.tipo)} text-white text-xs`}>
                    {getTypeLabel(report.tipo)}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Criado em {formatDate(report.created_at)}
                  </span>
                  
                  {report.data_inicio && report.data_fim && (
                    <span>
                      • {formatDate(report.data_inicio)} até {formatDate(report.data_fim)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 ml-2">
                {onLoadReport && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onLoadReport(report)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Download className="w-4 h-4" />
                    {!isMobile && <span className="ml-1">Carregar</span>}
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteReport(report.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};