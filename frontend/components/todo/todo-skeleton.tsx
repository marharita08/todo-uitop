import { Skeleton } from '@/components/ui/skeleton';

export function TodoSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-4">
      <Skeleton className="h-4 w-4 rounded" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/4" />
      </div>
      <Skeleton className="h-8 w-8 rounded" />
    </div>
  );
}

export function TodoListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <TodoSkeleton key={i} />
      ))}
    </div>
  );
}
