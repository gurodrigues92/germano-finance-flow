interface ArchiveHeaderProps {
  monthCount: number;
  transactionCount: number;
  totalBruto: number;
  totalLiquido: number;
}

export const ArchiveHeader = ({
  monthCount,
  transactionCount,
  totalBruto,
  totalLiquido
}: ArchiveHeaderProps) => {
  return (
    <div className="flex items-center justify-between border-b border-border pb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground">Arquivo Histórico</h1>
        <p className="text-muted-foreground mt-1">Histórico completo de transações organizadas por mês</p>
      </div>
    </div>
  );
};