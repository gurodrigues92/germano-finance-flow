import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Eye, Edit, User, Phone, Mail } from 'lucide-react';
import { Cliente } from '@/types/salon';
import { formatCurrency } from '@/lib/formatUtils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTranslations } from '@/lib/translations';

interface SalonClientTableProps {
  clientes: Cliente[];
  onViewCliente: (cliente: Cliente) => void;
  onEditCliente: (cliente: Cliente) => void;
}

export const SalonClientTable = ({ 
  clientes, 
  onViewCliente, 
  onEditCliente 
}: SalonClientTableProps) => {
  const isMobile = useIsMobile();
  const t = useTranslations();

  if (clientes.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            Nenhum cliente encontrado
          </h3>
          <p className="text-muted-foreground">
            Ajuste os filtros ou adicione novos clientes
          </p>
        </CardContent>
      </Card>
    );
  }

  // Mobile card layout
  if (isMobile) {
    return (
      <div className="space-y-3">
        {clientes.map((cliente) => (
          <Card key={cliente.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="w-12 h-12 flex-shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {cliente.nome.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">
                        {cliente.nome}
                      </h3>
                      {!cliente.ativo && (
                        <Badge variant="destructive" className="text-xs">
                          Inativo
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-1">
                      {cliente.telefone && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          <span className="truncate">{cliente.telefone}</span>
                        </div>
                      )}
                      {cliente.email && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{cliente.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span 
                    className={`font-bold text-sm ${
                      cliente.saldo > 0 
                        ? 'text-green-600' 
                        : cliente.saldo < 0 
                        ? 'text-red-600' 
                        : 'text-muted-foreground'
                    }`}
                  >
                    {formatCurrency(cliente.saldo, true)}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewCliente(cliente)}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {t.actions.view}
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onEditCliente(cliente)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {t.actions.edit}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Desktop table layout
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-4 font-semibold text-sm text-muted-foreground">Foto</th>
                <th className="text-left p-4 font-semibold text-sm text-muted-foreground">Nome</th>
                <th className="text-left p-4 font-semibold text-sm text-muted-foreground">Saldo</th>
                <th className="text-left p-4 font-semibold text-sm text-muted-foreground">Telefone</th>
                <th className="text-center p-4 font-semibold text-sm text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente, index) => (
                <tr 
                  key={cliente.id} 
                  className={`hover:bg-muted/50 transition-colors border-b last:border-b-0 ${
                    index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                  }`}
                >
                  {/* Photo */}
                  <td className="p-4">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {cliente.nome.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </td>

                  {/* Name */}
                  <td className="p-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{cliente.nome}</span>
                        {!cliente.ativo && (
                          <Badge variant="destructive" className="text-xs">
                            Inativo
                          </Badge>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Balance */}
                  <td className="p-4">
                    <span 
                      className={`font-semibold ${
                        cliente.saldo > 0 
                          ? 'text-green-600' 
                          : cliente.saldo < 0 
                          ? 'text-red-600' 
                          : 'text-muted-foreground'
                      }`}
                    >
                      {formatCurrency(cliente.saldo, true)}
                    </span>
                  </td>

                  {/* Phone */}
                  <td className="p-4">
                    <span className="text-foreground">
                      {cliente.telefone || '-'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewCliente(cliente)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onEditCliente(cliente)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};