import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Eye, Edit, User } from 'lucide-react';
import { Cliente } from '@/types/salon';
import { formatCurrency } from '@/lib/formatUtils';

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

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-4 font-semibold text-sm text-gray-700">Photo</th>
                <th className="text-left p-4 font-semibold text-sm text-gray-700">Name</th>
                <th className="text-left p-4 font-semibold text-sm text-gray-700">Balance</th>
                <th className="text-left p-4 font-semibold text-sm text-gray-700">Phone</th>
                <th className="text-center p-4 font-semibold text-sm text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente, index) => (
                <tr 
                  key={cliente.id} 
                  className={`hover:bg-gray-50 transition-colors border-b last:border-b-0 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                  }`}
                >
                  {/* Photo */}
                  <td className="p-4">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                        {cliente.nome.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </td>

                  {/* Name */}
                  <td className="p-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{cliente.nome}</span>
                        {!cliente.ativo && (
                          <Badge variant="destructive" className="text-xs">
                            Inativo
                          </Badge>
                        )}
                      </div>
                      {/* Próximo agendamento - TODO: implementar quando tiver integração com agenda */}
                      <span className="text-xs text-blue-600">
                        {/* Today at 10:00 - placeholder */}
                      </span>
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
                          : 'text-gray-600'
                      }`}
                    >
                      {formatCurrency(cliente.saldo, true)}
                    </span>
                  </td>

                  {/* Phone */}
                  <td className="p-4">
                    <span className="text-gray-700">
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
                        className="bg-green-500 text-white border-green-500 hover:bg-green-600"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditCliente(cliente)}
                        className="bg-pink-500 text-white border-pink-500 hover:bg-pink-600"
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