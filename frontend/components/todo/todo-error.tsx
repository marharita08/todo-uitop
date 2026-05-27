import { AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface TodoErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function TodoError({ message = 'Something went wrong', onRetry }: TodoErrorProps) {
  return (
    <div className="border-destructive/30 bg-destructive/5 flex flex-col items-center justify-center gap-4 rounded-lg border p-10 text-center">
      <AlertCircle className="text-destructive h-10 w-10" />
      <div className="flex flex-col gap-1">
        <p className="text-destructive font-medium">Failed to load tasks</p>
        <p className="text-muted-foreground text-sm">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
