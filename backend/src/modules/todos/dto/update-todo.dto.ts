import { IsEnum } from 'class-validator';
import { TodoStatus } from '@prisma/client';

export class UpdateTodoDto {
  @IsEnum(TodoStatus, {
    message: `Status must be one of: ${Object.values(TodoStatus).join(', ')}`,
  })
  status: TodoStatus;
}
