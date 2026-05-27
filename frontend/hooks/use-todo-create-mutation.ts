import { useQueryClient } from '@tanstack/react-query';

import { QueryKey } from '@/core/const';
import { CreateTodoDto } from '@/core/schemas';
import { Todo } from '@/core/types';
import { todoService } from '@/services';

import { useAppMutation } from './use-app-mutation';

export function useTodoCreateMutation() {
  const queryClient = useQueryClient();

  return useAppMutation<Todo, Error, CreateTodoDto>({
    mutationFn: (dto) => todoService.create(dto),
    successMessage: 'Task created successfully',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.TODOS] });
    },
  });
}
