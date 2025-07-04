import { Investimento } from "@/types/investimentos";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Clock, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface InvestimentosTimelineProps {
  investimentos: Investimento[];
  onEdit: (investimento: Investimento) => void;
  onDelete: (id: string) => void;
}

export function InvestimentosTimeline({ investimentos, onEdit, onDelete }: InvestimentosTimelineProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getCategoryColor = (categoria: string) => {
    const colors = {
      'Equipamentos': 'bg-blue-500',
      'Mobiliário': 'bg-green-500', 
      'Desenvolvimento': 'bg-purple-500',
      'Emergência': 'bg-red-500'
    };
    return colors[categoria as keyof typeof colors] || 'bg-gray-500';
  };

  const getGarantiaStatus = (investimento: Investimento) => {
    if (!investimento.garantia_meses) return null;
    
    const dataCompra = new Date(investimento.data_compra);
    const dataGarantia = new Date(dataCompra);
    dataGarantia.setMonth(dataGarantia.getMonth() + investimento.garantia_meses);
    
    const hoje = new Date();
    const diasRestantes = Math.ceil((dataGarantia.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diasRestantes < 0) {
      return { status: 'expirada', texto: 'Garantia expirada', cor: 'bg-red-100 text-red-800' };
    } else if (diasRestantes <= 30) {
      return { status: 'expirando', texto: `${diasRestantes} dias restantes`, cor: 'bg-orange-100 text-orange-800' };
    } else {
      return { status: 'ativa', texto: `${diasRestantes} dias restantes`, cor: 'bg-green-100 text-green-800' };
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Timeline de Investimentos ({investimentos.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {investimentos.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Nenhum investimento registrado
          </div>
        ) : (
          <div className="space-y-4">
            {investimentos.map((investimento, index) => {
              const garantiaStatus = getGarantiaStatus(investimento);
              
              return (
                <div key={investimento.id} className="relative">
                  {/* Linha vertical da timeline */}
                  {index < investimentos.length - 1 && (
                    <div className="absolute left-4 top-12 bottom-0 w-0.5 bg-border"></div>
                  )}
                  
                  {/* Card do investimento */}
                  <div className="flex gap-4">
                    {/* Indicador da timeline */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full ${getCategoryColor(investimento.categoria)} flex items-center justify-center relative z-10`}>
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    
                    {/* Conteúdo */}
                    <div className="flex-1 min-w-0">
                      <div className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="secondary" className={`${getCategoryColor(investimento.categoria)} text-white`}>
                                {investimento.categoria}
                              </Badge>
                              <span className="text-sm text-muted-foreground">•</span>
                              <span className="text-sm text-muted-foreground">{investimento.subcategoria}</span>
                            </div>
                            <h3 className="font-semibold text-lg">{investimento.descricao}</h3>
                            <p className="text-2xl font-bold text-primary">{formatCurrency(Number(investimento.valor))}</p>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => onEdit(investimento)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => onDelete(investimento.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Informações adicionais */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4" />
                            <span>{format(new Date(investimento.data_compra), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
                          </div>
                          
                          {investimento.fornecedor && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{investimento.fornecedor}</span>
                            </div>
                          )}
                          
                          {garantiaStatus && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <Badge variant="secondary" className={garantiaStatus.cor}>
                                {garantiaStatus.texto}
                              </Badge>
                            </div>
                          )}
                        </div>
                        
                        {investimento.observacoes && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-sm text-muted-foreground">{investimento.observacoes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}