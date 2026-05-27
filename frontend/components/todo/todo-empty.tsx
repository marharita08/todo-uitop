import { ClipboardList } from 'lucide-react';

interface TodoEmptyProps {
  filtered?: boolean;
}

export function TodoEmpty({ filtered = false }: TodoEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-10 text-center">
      <ClipboardList className="text-muted-foreground h-10 w-10" />
      <div className="flex flex-col gap-1">
        <p className="font-medium">No tasks yet</p>
        <p className="text-muted-foreground text-sm">
          {filtered
            ? 'No tasks found for the selected category'
            : 'Create your first task to get started'}
        </p>
      </div>
    </div>
  );
}
