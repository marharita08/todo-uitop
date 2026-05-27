'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategoriesInfiniteQuery } from '@/hooks/use-categories-infinite-query';

interface CategorySelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  withAll?: boolean;
}

export function CategorySelect({
  value,
  onValueChange,
  placeholder = 'Select category',
  withAll = false,
}: CategorySelectProps) {
  const { ref: loaderRef, inView } = useInView();

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useCategoriesInfiniteQuery({ limit: 20 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const categories = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent position="popper" side="bottom">
        {withAll && <SelectItem value="all">All categories</SelectItem>}

        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="px-2 py-1.5">
                <Skeleton className="h-5 w-full" />
              </div>
            ))
          : categories.map((category) => (
              <SelectItem key={category.id} value={String(category.id)}>
                {category.name}
              </SelectItem>
            ))}

        {hasNextPage && (
          <div ref={loaderRef} className="px-2 py-1.5">
            {isFetchingNextPage && <Skeleton className="h-5 w-full" />}
          </div>
        )}
      </SelectContent>
    </Select>
  );
}
