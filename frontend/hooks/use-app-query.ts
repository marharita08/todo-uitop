import { useEffect } from 'react';

import { type QueryKey, type UseQueryOptions, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

type AppQueryProps<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = {
  defaultErrorHandling?: boolean;
  onError?: (error: TError) => void;
} & UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>;

export function useAppQuery<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>({
  onError,
  defaultErrorHandling = true,
  ...params
}: AppQueryProps<TQueryFnData, TError, TData, TQueryKey>) {
  const response = useQuery({ ...params });

  useEffect(() => {
    if (!response.isError) return;

    onError?.(response.error as TError);

    if (defaultErrorHandling) {
      const message =
        response.error instanceof Error ? response.error.message : 'Something went wrong';

      toast.error(message);
    }
  }, [response.isError, response.error, onError, defaultErrorHandling]);

  return response;
}
