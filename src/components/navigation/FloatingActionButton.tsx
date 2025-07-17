import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FloatingActionButtonProps {
  onClick?: () => void;
}

export const FloatingActionButton = ({ onClick }: FloatingActionButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-finance-studio hover:bg-finance-studio/90 text-finance-studio-foreground shadow-lg hover:scale-110 transition-transform z-40 p-0"
    >
      <Plus className="w-6 h-6" />
    </Button>
  );
};