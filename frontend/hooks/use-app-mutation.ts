import { useEffect } from 'react';

import { type UseMutationOptions, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

type AppMutationProps<TData = unknown, TError = Error, TVariables = void, TContext = unknown> = {
  defaultErrorHandling?: boolean;
  successMessage?: string;
  onError?: (error: TError) => void;
} & UseMutationOptions<TData, TError, TVariables, TContext>;

export function useAppMutation<
  TData = unknown,
  TError = Error,
  TVariables = void,
  TContext = unknown,
>({
  onError,
  defaultErrorHandling = true,
  successMessage,
  ...params
}: AppMutationProps<TData, TError, TVariables, TContext>) {
  const response = useMutation({ ...params });

  useEffect(() => {
    if (!response.isError) return;

    onError?.(response.error as TError);

    if (defaultErrorHandling) {
      const message =
        response.error instanceof Error ? response.error.message : 'Something went wrong';

      toast.error(message);
    }
  }, [response.isError, response.error, onError, defaultErrorHandling]);

  useEffect(() => {
    if (!response.isSuccess) return;

    if (successMessage) {
      toast.success(successMessage);
    }
  }, [response.isSuccess, successMessage]);

  return response;
}
