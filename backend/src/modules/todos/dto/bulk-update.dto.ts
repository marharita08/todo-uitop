import { IsArray, IsEnum, ArrayNotEmpty, IsInt } from 'class-validator';
import { TodoStatus } from '@prisma/client';

export class BulkUpdateTodoDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  ids: number[];

  @IsEnum(TodoStatus)
  status: TodoStatus;
}
