'use client';

import { useRef, useState } from 'react';

import { toast } from 'sonner';

import { CategorySelect } from '@/components/category/category-select';
import {
  TodoCard,
  TodoCreateDialog,
  TodoEmpty,
  TodoError,
  TodoListSkeleton,
} from '@/components/todo';
import { Todo, TodoFilter, TodoStatus } from '@/core/types';
import { useTodoDeleteMutation } from '@/hooks/use-todo-delete-mutation';
import { useTodoUpdateMutation } from '@/hooks/use-todo-update-mutation';
import { useTodosInfiniteQuery } from '@/hooks/use-todos-infinite-query';

export default function HomePage() {
  const [filter, setFilter] = useState<Omit<TodoFilter, 'page'>>({});
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const { data, isLoading, isError, error, refetch } = useTodosInfiniteQuery(filter);

  const { mutate: updateTodo } = useTodoUpdateMutation();
  const { mutate: deleteTodo } = useTodoDeleteMutation();

  const todos = data?.pages.flatMap((page) => page.data) ?? [];
  const total = data?.pages[0]?.meta.total ?? 0;
  const isFiltered = !!filter.categoryId;

  const handleCategoryFilter = (value: string) => {
    setFilter((prev) => ({
      ...prev,
      categoryId: value === 'all' ? undefined : Number(value),
    }));
  };

  const startTimer = (id: number, onConfirm: () => void) => {
    const timer = setTimeout(() => {
      onConfirm();
      timers.current.delete(id);
    }, 5000);

    timers.current.set(id, timer);
  };

  const cancelTimer = (id: number) => {
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  };

  const handleToggle = (todo: Todo, undoOptimistic: () => void) => {
    startTimer(todo.id, () => {
      updateTodo({ id: todo.id, dto: { status: TodoStatus.COMPLETED } });
    });

    toast.info('Task completion...', {
      duration: 5000,
      action: {
        label: 'Undo',
        onClick: () => {
          cancelTimer(todo.id);
          undoOptimistic();
        },
      },
    });
  };

  const handleDelete = (todo: Todo, undoOptimistic: () => void) => {
    startTimer(todo.id, () => {
      deleteTodo(todo.id);
    });

    toast.info('Task deleting...', {
      duration: 5000,
      action: {
        label: 'Undo',
        onClick: () => {
          cancelTimer(todo.id);
          undoOptimistic();
        },
      },
    });
  };

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-muted-foreground mb-4 text-sm">{total} tasks total</p>
          <TodoCreateDialog />
        </div>

        <div className="w-full">
          <CategorySelect
            value={filter.categoryId ? String(filter.categoryId) : 'all'}
            onValueChange={handleCategoryFilter}
            withAll
            placeholder="Filter by category"
          />
        </div>

        <div className="min-h-64 w-full">
          {isLoading ? (
            <TodoListSkeleton count={5} />
          ) : isError ? (
            <TodoError message={error?.message} onRetry={() => refetch()} />
          ) : todos.length === 0 ? (
            <TodoEmpty filtered={isFiltered} />
          ) : (
            <div className="flex flex-col gap-3">
              {todos.map((todo) => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
