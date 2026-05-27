import { CreateTodoDto, UpdateTodoDto } from '@/core/schemas';
import { BulkUpdateTodoDto, Paginated, Todo, TodoFilter } from '@/core/types';

import { httpService } from './http.service';

class TodoService {
  private readonly baseUrl = '/todos';

  async getAll(filter?: TodoFilter): Promise<Paginated<Todo>> {
    return httpService.get<Paginated<Todo>>(this.baseUrl, filter);
  }

  async create(dto: CreateTodoDto): Promise<Todo> {
    return httpService.post<Todo, CreateTodoDto>(this.baseUrl, dto);
  }

  async update(id: number, dto: UpdateTodoDto): Promise<Todo> {
    return httpService.patch<Todo, UpdateTodoDto>(`${this.baseUrl}/${id}`, dto);
  }

  async remove(id: number): Promise<{ message: string }> {
    return httpService.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }

  async bulkUpdate(dto: BulkUpdateTodoDto): Promise<{ count: number }> {
    return httpService.patch<{ count: number }, BulkUpdateTodoDto>(
      `${this.baseUrl}/bulk`,
      dto,
    );
  }
}

export const todoService = new TodoService();
