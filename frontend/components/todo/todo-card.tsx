import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/core/lib/utils';
import { Todo, TodoStatus } from '@/core/types';

interface TodoCardProps {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onDelete: (id: number) => void;
}

export function TodoCard({ todo, onToggle, onDelete }: TodoCardProps) {
  const isCompleted = todo.status === TodoStatus.COMPLETED;

  return (
    <div
      className={cn(
        'bg-card flex items-center gap-3 rounded-lg border p-4 shadow-sm transition-opacity',
        isCompleted && 'opacity-60',
      )}
    >
      <Checkbox
        checked={isCompleted}
        onCheckedChange={() => onToggle(todo)}
        aria-label={isCompleted ? 'Mark as active' : 'Mark as completed'}
      />

      <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
        <p
          className={cn(
            'truncate text-sm font-medium',
            isCompleted && 'text-muted-foreground line-through',
          )}
        >
          {todo.text}
        </p>
        <span className="text-muted-foreground text-xs">{todo.category.name}</span>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-destructive h-8 w-8 shrink-0"
        onClick={() => onDelete(todo.id)}
        aria-label="Delete task"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
