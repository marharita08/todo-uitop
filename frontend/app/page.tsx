'use client';

import { useState } from 'react';

import { CategorySelect } from '@/components/category/category-select';
import { TodoCard, TodoEmpty, TodoError, TodoListSkeleton } from '@/components/todo';

import { useTodosInfiniteQuery } from '@/hooks/use-todos-infinite-query';

import { TodoFilter } from '@/core/types';

export default function HomePage() {
  const [filter, setFilter] = useState<Omit<TodoFilter, 'page'>>({});

  const { data, isLoading, isError, error, refetch } = useTodosInfiniteQuery(filter);

  const todos = data?.pages.flatMap((page) => page.data) ?? [];
  const total = data?.pages[0]?.meta.total ?? 0;
  const isFiltered = !!filter.categoryId;

  const handleCategoryFilter = (value: string) => {
    setFilter((prev) => ({
      ...prev,
      categoryId: value === 'all' ? undefined : Number(value),
    }));
  };

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-muted-foreground text-sm">{total} tasks total</p>
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
                <TodoCard key={todo.id} todo={todo} onToggle={() => {}} onDelete={() => {}} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
