import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Building, RefreshCw, Save, Info } from 'lucide-react';
import { useConfiguracoes } from '@/contexts/ConfiguracoesContext';

export const EstablishmentCard = () => {
  const { config, updateEstablishment, resetSection } = useConfiguracoes();
  const [formData, setFormData] = useState(config.establishment);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateEstablishment(formData);
    setHasChanges(false);
  };

  const handleReset = () => {
    resetSection('establishment');
    setFormData(config.establishment);
    setHasChanges(false);
  };

  const formatCNPJ = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  };

  const handleCNPJChange = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length <= 14) {
      setFormData(prev => ({ ...prev, cnpj: cleanValue }));
      setHasChanges(true);
    }
  };

  const formatPhone = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length === 11) {
      return cleanValue.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (cleanValue.length === 10) {
      return cleanValue.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    }
    return value;
  };

  const handlePhoneChange = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length <= 11) {
      setFormData(prev => ({ ...prev, telefone: cleanValue }));
      setHasChanges(true);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Dados do Estabelecimento</CardTitle>
              <CardDescription>
                Informações da empresa para relatórios e documentos
              </CardDescription>
            </div>
          </div>
          {hasChanges && (
            <Badge variant="secondary" className="animate-pulse">
              Não salvo
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nomeEmpresa">Nome da Empresa</Label>
            <Input
              id="nomeEmpresa"
              value={formData.nomeEmpresa}
              onChange={(e) => handleChange('nomeEmpresa', e.target.value)}
              placeholder="Ex: Studio Germano"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input
              id="cnpj"
              value={formatCNPJ(formData.cnpj)}
              onChange={(e) => handleCNPJChange(e.target.value)}
              placeholder="00.000.000/0000-00"
              maxLength={18}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="endereco">Endereço Completo</Label>
          <Textarea
            id="endereco"
            value={formData.endereco}
            onChange={(e) => handleChange('endereco', e.target.value)}
            placeholder="Rua, número, bairro, cidade - UF, CEP"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              value={formatPhone(formData.telefone)}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="(00) 00000-0000"
              maxLength={15}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="contato@studiogermano.com"
            />
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
          <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
          <div className="text-sm text-muted-foreground">
            <p>Estas informações serão utilizadas em relatórios, recibos e documentos gerados pelo sistema. 
            Mantenha os dados sempre atualizados.</p>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button 
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Salvar Alterações
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Restaurar Padrão
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};