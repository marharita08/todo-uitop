import { z } from 'zod';

import { TodoStatus } from '@/core/types';

export const createTodoSchema = z.object({
  text: z
    .string()
    .min(1, 'Task text is required')
    .max(500, 'Task text cannot exceed 500 characters')
    .trim(),

  categoryId: z.number({ error: 'Category is required' }).int().min(1, 'Please select a category'),
});

export const updateTodoSchema = z.object({
  status: z.enum(Object.values(TodoStatus) as [string, ...string[]], {
    error: `Status must be one of: ${Object.values(TodoStatus).join(', ')}`,
  }),
});

export type CreateTodoDto = z.infer<typeof createTodoSchema>;
export type UpdateTodoDto = z.infer<typeof updateTodoSchema>;
