import { useQueryClient } from '@tanstack/react-query';

import { QueryKey } from '@/core/const';
import { BulkUpdateTodoDto } from '@/core/types';
import { todoService } from '@/services';

import { useAppMutation } from './use-app-mutation';

export function useTodoBulkUpdateMutation() {
  const queryClient = useQueryClient();

  return useAppMutation<{ count: number }, Error, BulkUpdateTodoDto>({
    mutationFn: (dto) => todoService.bulkUpdate(dto),
    successMessage: 'Tasks updated',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.TODOS] });
    },
  });
}
