import { Category } from './category.types';

export enum TodoStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

export interface Todo {
  id: number;
  text: string;
  status: TodoStatus;
  createdAt: string;
  updatedAt: string;
  categoryId: number;
  category: Pick<Category, 'id' | 'name'>;
}

export type TodoFilter = {
  categoryId?: number;
  page?: number;
  limit?: number;
};

export type BulkUpdateTodoDto = {
  ids: number[];
  status: TodoStatus;
};
