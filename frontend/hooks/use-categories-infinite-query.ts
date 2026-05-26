import { QueryKey } from '@/core/const';
import { Category } from '@/core/types';
import { categoryService } from '@/services';

import { useAppInfiniteQuery } from './use-app-infinite-query';

type UseCategoriesInfiniteQueryOptions = {
  limit?: number;
};

export const useCategoriesInfiniteQuery = (options?: UseCategoriesInfiniteQueryOptions) => {
  return useAppInfiniteQuery<Category>({
    queryKey: [QueryKey.CATEGORIES],
    limit: options?.limit ?? 50,

    queryFn: ({ page, limit }) => categoryService.getAll(page, limit),
  });
};
