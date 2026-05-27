import { useQueryClient } from '@tanstack/react-query';

import { QueryKey } from '@/core/const';
import { UpdateTodoDto } from '@/core/schemas';
import { Todo } from '@/core/types';
import { todoService } from '@/services';

import { useAppMutation } from './use-app-mutation';

type UpdateTodoVariables = {
  id: number;
  dto: UpdateTodoDto;
};

export function useTodoUpdateMutation() {
  const queryClient = useQueryClient();

  return useAppMutation<Todo, Error, UpdateTodoVariables>({
    mutationFn: ({ id, dto }) => todoService.update(id, dto),
    successMessage: 'Task completed',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.TODOS] });
    },
  });
}
