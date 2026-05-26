import { InfiniteData, QueryKey, useInfiniteQuery } from '@tanstack/react-query';

import { Paginated } from '@/core/types';

type UseAppInfiniteQueryParams<TData, TFilter> = {
  queryKey: QueryKey;
  filter?: TFilter;
  limit?: number;

  queryFn: (
    params: TFilter & {
      page: number;
      limit: number;
    },
  ) => Promise<Paginated<TData>>;
};

export const useAppInfiniteQuery = <TData, TFilter extends object = object>({
  queryKey,
  filter,
  limit = 10,
  queryFn,
}: UseAppInfiniteQueryParams<TData, TFilter>) => {
  return useInfiniteQuery<
    Paginated<TData>,
    Error,
    InfiniteData<Paginated<TData>>,
    QueryKey,
    number
  >({
    queryKey: [...queryKey, filter, limit],

    initialPageParam: 1,

    queryFn: ({ pageParam }) =>
      queryFn({
        ...(filter as TFilter),
        page: pageParam,
        limit,
      }),

    getNextPageParam: (lastPage) => {
      if (!lastPage.meta.hasNextPage) {
        return undefined;
      }

      return lastPage.meta.page + 1;
    },
  });
};
