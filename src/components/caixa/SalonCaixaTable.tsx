import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, CreditCard } from 'lucide-react';
import { Comanda } from '@/types/salon';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SalonCaixaTableProps {
  comandas: Comanda[];
  type: 'open' | 'closed';
  onViewComanda: (comanda: Comanda) => void;
  onCloseTicket?: (comanda: Comanda) => void;
  loading?: boolean;
}

export const SalonCaixaTable = ({ 
  comandas, 
  type, 
  onViewComanda, 
  onCloseTicket,
  loading 
}: SalonCaixaTableProps) => {
  const title = type === 'open' ? 'Open Tickets' : 'Closed Tickets';
  const emptyMessage = type === 'open' ? 'Nenhuma comanda aberta' : 'Nenhuma comanda fechada hoje';

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">{title}</h3>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Carregando comandas...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (comandas.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">{title}</h3>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            {emptyMessage}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Badge variant="secondary" className="text-sm">
            {comandas.length} {comandas.length === 1 ? 'comanda' : 'comandas'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Client</TableHead>
              <TableHead className="w-[150px]">Date</TableHead>
              <TableHead className="w-[120px] text-right">Value</TableHead>
              <TableHead className="w-[120px] text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comandas.map((comanda) => (
              <TableRow key={comanda.id} className="hover:bg-muted/50">
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{comanda.cliente?.nome || 'Cliente não informado'}</div>
                    <div className="text-sm text-muted-foreground">
                      {comanda.profissional_principal?.nome || 'Profissional não informado'}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {type === 'open' ? 'Hoje às' : format(new Date(comanda.data_fechamento || comanda.data_abertura), 'HH:mm', { locale: ptBR })}
                    <br />
                    <span className="text-muted-foreground">
                      {format(new Date(comanda.data_abertura), 'HH:mm', { locale: ptBR })}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="font-semibold text-lg">
                    R$ {comanda.total_liquido.toFixed(2)}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex gap-2 justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewComanda(comanda)}
                      className="h-8"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {type === 'open' && onCloseTicket && (
                      <Button
                        size="sm"
                        onClick={() => onCloseTicket(comanda)}
                        className="h-8 bg-[hsl(142,76%,36%)] hover:bg-[hsl(142,76%,32%)] text-white"
                      >
                        <CreditCard className="w-4 h-4 mr-1" />
                        Close ticket
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};