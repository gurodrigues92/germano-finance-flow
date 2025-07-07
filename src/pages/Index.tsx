import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Calculator, 
  Scissors,
  GraduationCap,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useFinance } from '@/hooks/useFinance';

const motivationalPhrases = [
  "Cada cliente é uma oportunidade de crescer",
  "Sucesso no salão começa com organização",
  "Seus números contam sua história de sucesso"
];

const Index = () => {
  const { getMonthlyData } = useFinance();
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  
  // Dados do mês atual
  const currentData = getMonthlyData();
  
  // Meta mensal (exemplo: R$ 50.000)
  const monthlyGoal = 50000;
  const goalProgress = currentData.totalBruto > 0 ? Math.min((currentData.totalBruto / monthlyGoal) * 100, 100) : 0;

  // Rotação das frases motivacionais
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % motivationalPhrases.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <div className="bg-card text-foreground py-12 border-b border-border">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h1 className="text-4xl font-bold text-foreground">
            Studio Germano
          </h1>
          
          {/* Access Button */}
          <Link to="/">
            <Button
              size="lg" 
              className="bg-finance-studio hover:bg-finance-studio/90 text-finance-studio-foreground font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Acessar Sistema
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Cards de Métricas */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {/* Total Bruto */}
          <Card className="hover:scale-105 transition-transform duration-300 border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">Total Bruto</CardTitle>
                <TrendingUp className="h-5 w-5 opacity-90" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold">
                {currentData.totalBruto.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </div>
            </CardContent>
          </Card>

          {/* Total Líquido */}
          <Card className="hover:scale-105 transition-transform duration-300 border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">Total Líquido</CardTitle>
                <Calculator className="h-5 w-5 opacity-90" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold">
                {currentData.totalLiquido.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </div>
            </CardContent>
          </Card>

          {/* 60% Studio */}
          <Card className="hover:scale-105 transition-transform duration-300 border-0 shadow-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">60% Studio</CardTitle>
                <Scissors className="h-5 w-5 opacity-90" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold">
                {currentData.totalStudio.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </div>
            </CardContent>
          </Card>

          {/* 40% Edu */}
          <Card className="hover:scale-105 transition-transform duration-300 border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">40% Edu</CardTitle>
                <GraduationCap className="h-5 w-5 opacity-90" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold">
                {currentData.totalEdu.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Seção Motivacional */}
        <Card className="border-border bg-card">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-finance-studio mr-3" />
              <h2 className="text-xl font-semibold text-foreground">
                {motivationalPhrases[currentPhraseIndex]}
              </h2>
              <Sparkles className="h-6 w-6 text-finance-studio ml-3" />
            </div>
            
            <div className="max-w-md mx-auto mt-6">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Meta do Mês</span>
                <span>{goalProgress.toFixed(1)}%</span>
              </div>
              <Progress value={goalProgress} className="h-3 mb-2" />
              <div className="flex justify-between text-sm">
                <span className="text-foreground font-medium">
                  {currentData.totalBruto.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </span>
                <span className="text-muted-foreground">
                  {monthlyGoal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;