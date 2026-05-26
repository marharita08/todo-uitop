import { QueryKey } from '@/core/const';
import { Todo, TodoFilter } from '@/core/types';
import { todoService } from '@/services';

import { useAppInfiniteQuery } from './use-app-infinite-query';

type UseTodosInfiniteQueryOptions = Omit<TodoFilter, 'page'>;

export const useTodosInfiniteQuery = (options?: UseTodosInfiniteQueryOptions) => {
  const { limit, ...filter } = options ?? {};

  return useAppInfiniteQuery<Todo, typeof filter>({
    queryKey: [QueryKey.TODOS],
    filter,
    limit,

    queryFn: (params) => todoService.getAll(params),
  });
};
