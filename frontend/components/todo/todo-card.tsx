'use client';

import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/core/lib/utils';
import { Todo, TodoStatus } from '@/core/types';
import { usePendingAction } from '@/hooks/use-pending-action';

interface TodoCardProps {
  todo: Todo;
  onToggle: (todo: Todo, undo: () => void) => void;
  onDelete: (todo: Todo, undo: () => void) => void;
}

export function TodoCard({ todo, onToggle, onDelete }: TodoCardProps) {
  const toggle = usePendingAction();
  const remove = usePendingAction();

  const optimisticCompleted = toggle.isPending
    ? todo.status !== TodoStatus.COMPLETED
    : todo.status === TodoStatus.COMPLETED;

  const handleToggle = () => {
    if (remove.isPending) return;

    if (toggle.isPending) {
      toggle.cancel();
      return;
    }

    toggle.start(() => {
      onToggle(todo, () => toggle.cancel());
    });

    onToggle(todo, () => toggle.cancel());
  };

  const handleDelete = () => {
    if (remove.isPending) return;

    remove.start(() => {
      onDelete(todo, () => {});
    });

    onDelete(todo, () => remove.cancel());
  };

  const isDeleting = remove.isPending;
  const isCompleting = toggle.isPending;
  const activeProgress = isDeleting ? remove.progress : isCompleting ? toggle.progress : null;
  const progressColor = isDeleting ? 'bg-destructive/70' : 'bg-primary/50';

  return (
    <div
      className={cn(
        'bg-card relative flex items-center gap-3 overflow-hidden rounded-lg border p-4 shadow-sm transition-colors duration-200',
        optimisticCompleted && !isDeleting && 'opacity-60',
        isDeleting && 'border-destructive/40 bg-destructive/5',
        isCompleting && 'border-primary/30 bg-primary/5',
      )}
    >
      {activeProgress !== null && (
        <div
          className={cn('absolute bottom-0 left-0 h-0.5 transition-none', progressColor)}
          style={{ width: `${activeProgress}%` }}
        />
      )}

      <Checkbox
        checked={optimisticCompleted}
        onCheckedChange={handleToggle}
        disabled={isDeleting}
        aria-label={optimisticCompleted ? 'Mark as active' : 'Mark as completed'}
      />

      <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
        <p
          className={cn(
            'truncate text-sm font-medium transition-colors',
            optimisticCompleted && 'text-muted-foreground line-through',
            isDeleting && 'text-destructive/80',
          )}
        >
          {todo.text}
        </p>
        <span
          className={cn(
            'text-muted-foreground text-xs transition-colors',
            isDeleting && 'text-destructive/60',
          )}
        >
          {todo.category.name}
        </span>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'text-muted-foreground hover:text-destructive h-8 w-8 shrink-0',
          isDeleting && 'text-destructive',
        )}
        onClick={handleDelete}
        disabled={isDeleting}
        aria-label="Delete task"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
