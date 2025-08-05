import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PredictiveAnalysis } from '@/hooks/useAdvancedReports';
import { formatCurrency } from '@/lib/formatUtils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sparkles, TrendingUp, Lightbulb, AlertTriangle, CheckCircle } from 'lucide-react';

interface PredictiveAnalysisCardProps {
  analysis: PredictiveAnalysis;
}

export const PredictiveAnalysisCard = ({ analysis }: PredictiveAnalysisCardProps) => {
  const isMobile = useIsMobile();

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-500';
    if (confidence >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 80) return <CheckCircle className="w-4 h-4" />;
    if (confidence >= 60) return <AlertTriangle className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 80) return 'Alta Confiança';
    if (confidence >= 60) return 'Confiança Moderada';
    return 'Baixa Confiança';
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} text-purple-800 flex items-center gap-2`}>
            <Sparkles className="w-5 h-5" />
            Análise Preditiva
          </CardTitle>
          <Badge 
            className={`${getConfidenceColor(analysis.confidence)} text-white flex items-center gap-1`}
          >
            {getConfidenceIcon(analysis.confidence)}
            {getConfidenceText(analysis.confidence)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Revenue Prediction */}
        <div className="bg-white/60 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-purple-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Previsão para Próximo Mês
            </h4>
            <span className="text-xs text-purple-600">
              {analysis.confidence.toFixed(0)}% confiança
            </span>
          </div>
          <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-purple-900`}>
            {formatCurrency(analysis.nextMonthRevenue)}
          </p>
        </div>

        {/* Factors */}
        <div className="bg-white/60 rounded-lg p-4">
          <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Fatores Considerados
          </h4>
          <div className="space-y-2">
            {analysis.factors.map((factor, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-purple-700">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                {factor}
              </div>
            ))}
          </div>
        </div>

        {/* Recommendation */}
        <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg p-4 border border-orange-200">
          <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Recomendação Estratégica
          </h4>
          <p className="text-sm text-orange-700">{analysis.recommendation}</p>
        </div>

        {/* Disclaimer */}
        <div className="text-xs text-purple-600 bg-white/40 rounded p-2">
          <strong>Nota:</strong> Esta previsão é baseada em dados históricos e tendências identificadas. 
          Fatores externos podem influenciar os resultados reais.
        </div>
      </CardContent>
    </Card>
  );
};