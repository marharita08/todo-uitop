import { IsString, IsNotEmpty, IsInt, MaxLength, Min } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty({ message: 'Task text cannot be empty' })
  @MaxLength(500, { message: 'Task text cannot exceed 500 characters' })
  text: string;

  @IsInt()
  @Min(1)
  categoryId: number;
}
