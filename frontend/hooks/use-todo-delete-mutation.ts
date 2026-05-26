import { useQueryClient } from '@tanstack/react-query';

import { QueryKey } from '@/core/const';
import { todoService } from '@/services';

import { useAppMutation } from './use-app-mutation';

export function useTodoDeleteMutation() {
  const queryClient = useQueryClient();

  return useAppMutation<{ message: string }, Error, number>({
    mutationFn: (id) => todoService.remove(id),
    successMessage: 'Task deleted successfully',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.TODOS] });
    },
  });
}
