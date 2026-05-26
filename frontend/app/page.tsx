'use client';

import { useState } from 'react';

import { Check, CheckSquare } from 'lucide-react';

import { CategorySelect } from '@/components/category/category-select';
import {
  TodoCard,
  TodoCreateDialog,
  TodoEmpty,
  TodoError,
  TodoListSkeleton,
} from '@/components/todo';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import {
  Todo,
  TodoFilter,
  TodoStatus,
} from '@/core/types';

import { useTodoBulkUpdateMutation } from '@/hooks/use-todo-bulk-update-mutation';
import { useTodoDeleteMutation } from '@/hooks/use-todo-delete-mutation';
import { useTodoUpdateMutation } from '@/hooks/use-todo-update-mutation';
import { useTodosInfiniteQuery } from '@/hooks/use-todos-infinite-query';

export default function HomePage() {
  const [filter, setFilter] = useState<
    Omit<TodoFilter, 'page'>
  >({});

  const [isSelectMode, setIsSelectMode] =
    useState(false);

  const [selectedIds, setSelectedIds] =
    useState<Set<number>>(new Set());

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useTodosInfiniteQuery(filter);

  const { mutate: updateTodo } =
    useTodoUpdateMutation();

  const { mutate: deleteTodo } =
    useTodoDeleteMutation();

  const { mutate: bulkUpdate } =
    useTodoBulkUpdateMutation();

  const todos =
    data?.pages.flatMap((page) => page.data) ??
    [];

  const total =
    data?.pages[0]?.meta.total ?? 0;

  const isFiltered = !!filter.categoryId;

  const isSelecting =
    isSelectMode || selectedIds.size > 0;

  const allSelected =
    todos.length > 0 &&
    todos.every((todo) =>
      selectedIds.has(todo.id),
    );

  const handleCategoryFilter = (
    value: string,
  ) => {
    setFilter((prev) => ({
      ...prev,

      categoryId:
        value === 'all'
          ? undefined
          : Number(value),
    }));
  };

  const handleToggle = (todo: Todo) => {
    updateTodo({
      id: todo.id,

      dto: {
        status: TodoStatus.COMPLETED,
      },
    });
  };

  const handleDelete = (todo: Todo) => {
    deleteTodo(todo.id);
  };

  const handleSelect = (todo: Todo) => {
    setSelectedIds((prev) => {
      const next = new Array(...prev);
      return new Set(next.filter((id) => id !== todo.id));
    });
  };

  const handleSelectAll = () => {
    setSelectedIds(
      allSelected
        ? new Set()
        : new Set(
            todos.map((todo) => todo.id),
          ),
    );
  };

  const handleCancelSelection = () => {
    setSelectedIds(new Set());

    setIsSelectMode(false);
  };

  const handleBulkComplete = () => {
    const ids = Array.from(selectedIds);

    bulkUpdate({
      ids,
      status: TodoStatus.COMPLETED,
    });

    setSelectedIds(new Set());

    setIsSelectMode(false);
  };

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">
            Tasks
          </h1>

          <p className="text-muted-foreground mb-4 text-sm">
            {total} tasks total
          </p>

          <TodoCreateDialog />
        </div>

        <div className="w-full">
          <CategorySelect
            value={
              filter.categoryId
                ? String(filter.categoryId)
                : 'all'
            }
            onValueChange={
              handleCategoryFilter
            }
            withAll
            placeholder="Filter by category"
          />
        </div>

        {isSelecting && (
          <div className="bg-muted flex items-center justify-between rounded-lg px-4 py-2">
            <div className="flex items-center gap-3">
              <Checkbox
                id="select-all"
                checked={allSelected}
                onCheckedChange={
                  handleSelectAll
                }
              />

              <label
                htmlFor="select-all"
                className="cursor-pointer text-sm"
              >
                Select all
              </label>

              <span className="text-muted-foreground text-sm">
                ({selectedIds.size} selected)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleBulkComplete}
                disabled={
                  selectedIds.size === 0
                }
              >
                <Check className="h-4 w-4" />
                Mark as done
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={
                  handleCancelSelection
                }
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="min-h-64 w-full">
          {isLoading ? (
            <TodoListSkeleton count={5} />
          ) : isError ? (
            <TodoError
              message={error?.message}
              onRetry={() => refetch()}
            />
          ) : todos.length === 0 ? (
            <TodoEmpty
              filtered={isFiltered}
            />
          ) : (
            <div className="flex flex-col gap-3">
              {!isSelecting &&
                todos.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-fit"
                    onClick={() =>
                      setIsSelectMode(true)
                    }
                  >
                    <CheckSquare className="h-4 w-4" />
                    Select multiple tasks
                  </Button>
                )}

              {todos.map((todo) => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  selectable={isSelecting}
                  selected={selectedIds.has(
                    todo.id,
                  )}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
